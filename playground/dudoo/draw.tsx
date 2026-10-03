import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * O rabisco se desenhando: protótipo do ateliê. Envolve uma cena pronta (ou uma peça do kit) e
 * anima o SVG que já está na tela, sem mudar como a cena é desenhada. Cada elemento vira um papel,
 * na ordem do código, que é a ordem em que alguém desenharia:
 *
 * - **traço** (`SceneLine`): a linha sai da ponta da caneta, na velocidade da mão. Linha longa
 *   demora mais; a caneta levanta rápido para a próxima.
 * - **fundo** (o papel do `SceneCard`): acende enquanto o contorno do cartão é desenhado.
 * - **mancha** (`blob`): entra depois do traço, deslizando até o lugar, como a cor que cai fora
 *   de registro.
 * - **brilho** (`sparkle`, o ponto da ênfase): salta, com um giro, quando o resto está pronto.
 * - **DuDoo**: chega por último, subindo um pouco. O corpo não estica; só aparece.
 *
 * Desenha uma vez e para. Com movimento reduzido, a cena já aparece pronta.
 */

type Role = "traco" | "fundo" | "mancha" | "brilho" | "dudoo";

/** A velocidade da mão, em unidades do viewBox por ms (uma linha de 260 leva ~470 ms). */
const HAND = 0.55;
const STROKE_MS = { min: 110, max: 520 };
/** A caneta levanta para o próximo traço antes de o anterior acabar de assentar. */
const PEN_LIFT = -50;
const HAND_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";

const BLOB = { ms: 380, from: [-9, -7] as const, ease: "cubic-bezier(0.2, 0.7, 0.3, 1)" };
const POP = { ms: 420, stagger: 80, ease: "cubic-bezier(0.3, 1.7, 0.5, 1)" };
const DUDOO = { ms: 320, rise: 6, ease: "cubic-bezier(0.2, 0.7, 0.3, 1)" };

const svgNS = "http://www.w3.org/2000/svg";

/** Que papel cada elemento faz na cena. */
function roleOf(el: SVGElement, root: SVGSVGElement): Role | undefined {
  if (el instanceof SVGSVGElement && el !== root) return "dudoo";
  if (!(el instanceof SVGGeometryElement)) return undefined;
  const stroke = el.getAttribute("stroke");
  const fill = el.getAttribute("fill");
  if (stroke && stroke !== "none" && (!fill || fill === "none")) return "traco";
  if (!fill || fill === "none") return undefined;
  if (el instanceof SVGRectElement) return "fundo";
  // O ponto (da ênfase, de uma lista) salta como o brilho.
  if (el instanceof SVGCircleElement) return "brilho";
  // Mancha ou brilho: os dois são preenchidos. A mancha enche a própria caixa (uma oval mole),
  // o brilho de quatro pontas deixa a caixa quase vazia.
  return fillRatio(el) > 0.5 ? "mancha" : "brilho";
}

function fillRatio(el: SVGGeometryElement): number {
  const box = el.getBBox();
  if (!box.width || !box.height) return 0;
  let inside = 0;
  const n = 6;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = new DOMPoint(
        box.x + ((i + 0.5) / n) * box.width,
        box.y + ((j + 0.5) / n) * box.height,
      );
      if (el.isPointInFill(p)) inside++;
    }
  }
  return inside / (n * n);
}

/** Os elementos da cena, na ordem do código; o DuDoo (um `svg` dentro) conta como um só. */
function pieces(root: SVGSVGElement): [SVGElement, Role][] {
  const out: [SVGElement, Role][] = [];
  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (!(child instanceof SVGElement) || child.namespaceURI !== svgNS) continue;
      if (
        child instanceof SVGDefsElement ||
        child.tagName === "clipPath" ||
        child.tagName === "mask"
      )
        continue;
      const role = roleOf(child, root);
      if (role) out.push([child, role]);
      else if (child instanceof SVGGElement) walk(child);
    }
  };
  walk(root);
  return out;
}

/**
 * Anima a cena e devolve as animações (para cancelar numa nova rodada). `delay` adia o começo;
 * `speed` multiplica o tempo, para ver de perto.
 */
export function drawOn(root: SVGSVGElement, { delay = 0, speed = 1 } = {}): Animation[] {
  const all: Animation[] = [];
  const time = (ms: number) => ms / speed;
  const list = pieces(root);

  // 1. O traço, um atrás do outro. O papel do cartão acende enquanto o contorno é desenhado,
  // devagar no começo: quando o contorno fecha, o papel está lá.
  let t = delay;
  let pendingFundo: SVGElement[] = [];
  for (const [el, role] of list) {
    if (role === "fundo") {
      pendingFundo.push(el);
      continue;
    }
    if (role !== "traco") continue;
    const geo = el as SVGGeometryElement;
    const len = geo.getTotalLength();
    const ms = Math.max(STROKE_MS.min, Math.min(STROKE_MS.max, len / HAND));
    for (const f of pendingFundo) {
      all.push(
        f.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: time(ms),
          delay: time(t),
          easing: "cubic-bezier(0.6, 0, 0.9, 0.6)",
          fill: "backwards",
        }),
      );
    }
    pendingFundo = [];
    const dash = `${len} ${len}`;
    all.push(
      geo.animate(
        [
          { strokeDasharray: dash, strokeDashoffset: len },
          { strokeDasharray: dash, strokeDashoffset: 0 },
        ],
        { duration: time(ms), delay: time(t), easing: HAND_EASE, fill: "backwards" },
      ),
    );
    t += ms + PEN_LIFT;
  }
  const inked = t - PEN_LIFT;

  // 2. A mancha, quando o traço está acabando.
  const blobAt = Math.max(delay, inked - 140);
  for (const [el, role] of list) {
    if (role !== "mancha") continue;
    all.push(
      el.animate(
        [
          { opacity: 0, transform: `translate(${BLOB.from[0]}px, ${BLOB.from[1]}px)` },
          { opacity: 1, transform: "translate(0, 0)" },
        ],
        { duration: time(BLOB.ms), delay: time(blobAt), easing: BLOB.ease, fill: "backwards" },
      ),
    );
  }

  // 3. Os brilhos, um de cada vez.
  let popAt = Math.max(delay, inked - 60);
  for (const [el, role] of list) {
    if (role !== "brilho") continue;
    (el as SVGElement).style.transformBox = "fill-box";
    (el as SVGElement).style.transformOrigin = "center";
    all.push(
      el.animate(
        [
          { opacity: 0, transform: "scale(0) rotate(-40deg)" },
          { opacity: 1, transform: "scale(1) rotate(0deg)" },
        ],
        { duration: time(POP.ms), delay: time(popAt), easing: POP.ease, fill: "backwards" },
      ),
    );
    popAt += POP.stagger;
  }

  // 4. O DuDoo, por último.
  for (const [el, role] of list) {
    if (role !== "dudoo") continue;
    all.push(
      el.animate(
        [
          { opacity: 0, transform: `translateY(${DUDOO.rise}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: time(DUDOO.ms), delay: time(popAt), easing: DUDOO.ease, fill: "backwards" },
      ),
    );
  }
  return all;
}

/**
 * Desenha o que está dentro quando aparece na tela, e de novo a cada `replay` diferente. Com
 * `still`, não anima: a cena já aparece pronta (movimento reduzido, ou uma cena do Sério).
 */
export function DrawOn({
  replay = 0,
  still = false,
  speed = 1,
  delay = 0,
  children,
}: {
  replay?: number;
  still?: boolean;
  speed?: number;
  delay?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const running = useRef<Animation[]>([]);
  const seen = useRef(false);

  const play = () => {
    const svg = ref.current?.querySelector("svg");
    running.current.forEach((a) => a.cancel());
    running.current = svg && !still ? drawOn(svg, { delay, speed }) : [];
  };

  // Antes de pintar: a cena começa escondida, para não piscar pronta e sumir.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (still) {
      running.current.forEach((a) => a.cancel());
      el.style.visibility = "";
      return;
    }
    if (!seen.current) {
      el.style.visibility = "hidden";
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          io.disconnect();
          seen.current = true;
          el.style.visibility = "";
          play();
        },
        { threshold: 0.5 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replay, still]);

  useEffect(() => () => running.current.forEach((a) => a.cancel()), []);

  return <div ref={ref}>{children}</div>;
}

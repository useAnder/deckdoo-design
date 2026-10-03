import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DUDOO_MOODS,
  DuDooFace,
  SceneDuDooFace,
  type DuDooExpression,
  type DuDooMood,
} from "@deckdoo/design";
import { useDuDooMotion, usePrefersReducedMotion } from "./motion.js";

/**
 * O rabisco se desenhando: protótipo do ateliê. Envolve uma cena pronta (ou uma peça do kit) e
 * anima o SVG que já está na tela, sem mudar como a cena é desenhada. Cada elemento vira um papel,
 * na ordem do código, que é a ordem em que alguém desenharia:
 *
 * - **traço** (`SceneLine`): a linha sai da ponta da caneta, na velocidade da mão. Linha longa
 *   demora mais; a caneta levanta rápido para a próxima.
 * - **fundo** (o papel do cartão): acende enquanto o contorno é desenhado.
 * - **ponto** (o da ênfase): salta na sua vez, e os traços vêm depois.
 * - **mancha** (`blob`): entra depois do traço, deslizando até o lugar, como a cor que cai fora
 *   de registro.
 * - **brilho** (`sparkle`): salta, com um giro, quando o resto está pronto.
 * - **DuDoo**: chega por último, como a coruja pousando (gira até o prumo, assenta, dá um
 *   pulinho), e só então faz a cara da cena. O corpo não estica.
 *
 * O que está num grupo `data-dd-draw="loop"` se desenha, assenta, apaga e recomeça: a espera do
 * `SceneGenerating`. O resto desenha uma vez e para. Com movimento reduzido, a cena já aparece
 * pronta.
 */

type Role = "traco" | "fundo" | "ponto" | "mancha" | "brilho" | "dudoo";

/** A velocidade da mão, em unidades do viewBox por ms (uma linha de 260 leva ~470 ms). */
const HAND = 0.55;
const STROKE_MS = { min: 170, max: 520 };
/** A caneta levanta para o próximo traço antes de o anterior acabar de assentar. */
const PEN_LIFT = -50;
const HAND_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";
/**
 * O desenho inteiro, só o traço: o desenho pequeno desacelera a mão até o mínimo (no máximo 3
 * vezes), o grande acelera até o máximo. Uma peça sozinha não termina num piscar.
 */
const INK_MS = { min: 600, max: 1600, slowest: 3 };

const BLOB = { ms: 380, from: [-9, -7] as const, ease: "cubic-bezier(0.2, 0.7, 0.3, 1)" };
const POP = { ms: 420, stagger: 80, ease: "cubic-bezier(0.3, 1.7, 0.5, 1)" };
/** Depois que o ponto salta, quanto a mão espera para o próximo traço. */
const DOT_LEAD = 180;
/**
 * A chegada do DuDoo, como a coruja pousando: entra inclinado para o outro lado, gira pelo centro
 * até o prumo (passa um pouco e volta), assenta, e dá um pulinho no lugar, subindo e descendo.
 * Só gira e anda: o corpo não estica.
 */
const DUDOO = {
  ms: 860,
  /** De onde vem: um pouco abaixo e inclinado para a direita. */
  from: { y: 8, tilt: 14 },
  /** Quanto passa do prumo antes de assentar. */
  past: -3,
  /** A altura do pulinho. */
  hop: 6,
};
/** Quanto o DuDoo fica na cena antes de fazer a cara dela: chega, olha, reage. */
const DUDOO_REACT = 200;
/** O loop: depois de desenhado, segura assim, apaga neste tempo e espera para recomeçar. */
const LOOP = { hold: 1100, fade: 320, gap: 260, /** O slide se montando sem pressa. */ ink: 1000 };

const svgNS = "http://www.w3.org/2000/svg";

/** Que papel cada elemento faz na cena. */
function roleOf(el: SVGElement, root: SVGSVGElement): Role | undefined {
  if (el instanceof SVGSVGElement && el !== root) return "dudoo";
  if (!(el instanceof SVGGeometryElement)) return undefined;
  const stroke = el.getAttribute("stroke");
  const fill = el.getAttribute("fill");
  if (stroke && stroke !== "none" && (!fill || fill === "none")) return "traco";
  if (!fill || fill === "none") return undefined;
  // O papel: o retângulo do cartão, ou o contorno preenchido do arquivo, da pasta.
  if (el instanceof SVGRectElement || fill.includes("--dd-surface")) return "fundo";
  if (el instanceof SVGCircleElement) return "ponto";
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

interface Piece {
  el: SVGElement;
  role: Role;
  /** Está num grupo `data-dd-draw="loop"`. */
  loop: boolean;
}

/**
 * Um traço com vários pedaços (as linhas de texto do cartão são um `path` só) se desenharia com
 * os pedaços juntos: o tracejado recomeça em cada um. Para a mão ir de um ao outro, cada pedaço
 * vira uma cópia ao lado do original, que fica escondido até a cena acabar de se desenhar.
 */
function split(el: SVGElement, made: Split[]): SVGElement[] {
  const d = el.getAttribute("d");
  if (!d || /m/.test(d)) return [el];
  const parts = d.split(/(?=M)/).filter((part) => part.trim());
  if (parts.length < 2) return [el];
  const copies = parts.map((part) => {
    const copy = el.cloneNode() as SVGElement;
    copy.setAttribute("d", part);
    return copy;
  });
  el.after(...copies);
  el.style.visibility = "hidden";
  made.push({ original: el, copies });
  return copies;
}

interface Split {
  original: SVGElement;
  copies: SVGElement[];
}

/** Os elementos da cena, na ordem do código; o DuDoo (um `svg` dentro) conta como um só. */
function pieces(root: SVGSVGElement, made: Split[]): Piece[] {
  const out: Piece[] = [];
  const walk = (node: Element, loop: boolean) => {
    for (const child of Array.from(node.children)) {
      if (!(child instanceof SVGElement) || child.namespaceURI !== svgNS) continue;
      if (
        child instanceof SVGDefsElement ||
        child.tagName === "clipPath" ||
        child.tagName === "mask"
      )
        continue;
      const role = roleOf(child, root);
      if (role === "traco") for (const el of split(child, made)) out.push({ el, role, loop });
      else if (role) out.push({ el: child, role, loop });
      else if (child instanceof SVGGElement)
        walk(child, loop || child.getAttribute("data-dd-draw") === "loop");
    }
  };
  walk(root, false);
  return out;
}

const strokeMs = (el: SVGElement) => {
  const len = (el as SVGGeometryElement).getTotalLength();
  return { len, ms: Math.max(STROKE_MS.min, Math.min(STROKE_MS.max, len / HAND)) };
};

export interface DrawResult {
  animations: Animation[];
  /** Para a cena e devolve o SVG como estava (os traços divididos voltam a ser um). */
  stop: () => void;
  /** Quando o DuDoo termina de chegar, em ms desde o começo (já com a velocidade). */
  dudooAt: number;
}

/**
 * Anima a cena e devolve as animações (para cancelar numa nova rodada). `delay` adia o começo;
 * `speed` multiplica o tempo, para ver de perto.
 */
export function drawOn(root: SVGSVGElement, { delay = 0, speed = 1 } = {}): DrawResult {
  const all: Animation[] = [];
  const time = (ms: number) => ms / speed;
  const made: Split[] = [];
  const list = pieces(root, made);
  const once = list.filter((p) => !p.loop);
  const looping = list.filter((p) => p.loop);

  // O ritmo da mão: a soma do traço cabe entre o mínimo e o máximo do desenho inteiro.
  const loopInk = looping
    .filter((p) => p.role === "traco")
    .reduce((sum, p) => sum + strokeMs(p.el).ms + PEN_LIFT, 0);
  const rawInk =
    once.reduce(
      (sum, p) =>
        sum +
        (p.role === "traco" ? strokeMs(p.el).ms + PEN_LIFT : p.role === "ponto" ? DOT_LEAD : 0),
      0,
    ) + loopInk;
  const pace =
    rawInk <= 0
      ? 1
      : rawInk < INK_MS.min
        ? Math.min(INK_MS.slowest, INK_MS.min / rawInk)
        : rawInk > INK_MS.max
          ? INK_MS.max / rawInk
          : 1;

  // O loop é a espera: a mão monta o slide devagar, por mais curto que ele seja.
  const loopPace = loopInk > 0 ? Math.max(pace, LOOP.ink / loopInk) : pace;

  // 1. O traço e o ponto, na ordem do código. O papel do cartão acende enquanto o contorno é
  // desenhado, devagar no começo: quando o contorno fecha, o papel está lá.
  let t = delay;
  let pendingFundo: SVGElement[] = [];
  let loopAt: number | undefined;
  for (const { el, role, loop } of list) {
    if (loop) {
      // O loop começa na vez dele e ocupa a mão o tempo da primeira volta.
      if (loopAt === undefined) {
        loopAt = t;
        t += loopInk * loopPace;
      }
      continue;
    }
    if (role === "fundo") {
      pendingFundo.push(el);
      continue;
    }
    if (role === "ponto") {
      all.push(pop(el, time(t), time));
      t += DOT_LEAD;
      continue;
    }
    if (role !== "traco") continue;
    const { len, ms: raw } = strokeMs(el);
    const ms = raw * pace;
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
      el.animate(
        [
          { strokeDasharray: dash, strokeDashoffset: len },
          { strokeDasharray: dash, strokeDashoffset: 0 },
        ],
        { duration: time(ms), delay: time(t), easing: HAND_EASE, fill: "backwards" },
      ),
    );
    t += ms + PEN_LIFT * pace;
  }
  const inked = t - PEN_LIFT * pace;

  // 2. A mancha, quando o traço está acabando.
  const blobAt = Math.max(delay, inked - 140);
  for (const { el, role } of once) {
    if (role !== "mancha") continue;
    all.push(blob(el, time(blobAt), time(BLOB.ms)));
  }

  // 3. Os brilhos, um de cada vez.
  let popAt = Math.max(delay, inked - 60);
  for (const { el, role } of once) {
    if (role !== "brilho") continue;
    all.push(pop(el, time(popAt), time));
    popAt += POP.stagger;
  }

  // 4. O DuDoo, por último.
  let dudooAt = 0;
  for (const { el, role } of once) {
    if (role !== "dudoo") continue;
    // Pousa: gira pelo centro até o prumo, assenta e dá o pulinho.
    el.style.transformBox = "fill-box";
    el.style.transformOrigin = "50% 50%";
    const at = (ms: number) => ms / DUDOO.ms;
    const out = "cubic-bezier(0.2, 0.7, 0.3, 1)";
    const inOut = "cubic-bezier(0.45, 0, 0.55, 1)";
    all.push(
      el.animate(
        [
          {
            offset: 0,
            opacity: 0,
            translate: `0 ${DUDOO.from.y}px`,
            rotate: `${DUDOO.from.tilt}deg`,
            easing: out,
          },
          { offset: at(140), opacity: 1 },
          { offset: at(320), translate: "0 0", rotate: `${DUDOO.past}deg`, easing: inOut },
          { offset: at(460), translate: "0 0", rotate: "0deg", easing: out },
          { offset: at(610), translate: `0 ${-DUDOO.hop}px`, rotate: "0deg", easing: "ease-in" },
          { offset: at(740), translate: "0 0", rotate: "0deg", easing: out },
          { offset: 1, opacity: 1, translate: "0 0", rotate: "0deg" },
        ],
        { duration: time(DUDOO.ms), delay: time(popAt), fill: "backwards" },
      ),
    );
    dudooAt = time(popAt + DUDOO.ms);
  }

  // 5. O loop: desenha, a mancha cai, segura, apaga e recomeça, sem parar.
  if (loopAt !== undefined) all.push(...loopOn(looping, loopAt, loopPace, time));

  // Desenhada, a cena volta a ser o SVG de antes; o loop só para quando alguém para a cena.
  let stopped = false;
  const restore = () => {
    for (const { original, copies } of made) {
      copies.forEach((c) => c.remove());
      original.style.visibility = "";
    }
    made.length = 0;
  };
  const stop = () => {
    stopped = true;
    all.forEach((a) => a.cancel());
    restore();
  };
  const finite = all.filter((a) => a.effect?.getTiming().iterations !== Infinity);
  if (loopAt === undefined)
    Promise.all(finite.map((a) => a.finished))
      .then(() => !stopped && restore())
      .catch(() => {});

  return { animations: all, stop, dudooAt };
}

function pop(el: SVGElement, delay: number, time: (ms: number) => number) {
  el.style.transformBox = "fill-box";
  el.style.transformOrigin = "center";
  return el.animate(
    [
      { opacity: 0, scale: "0", rotate: "-40deg" },
      { opacity: 1, scale: "1", rotate: "0deg" },
    ],
    { duration: time(POP.ms), delay, easing: POP.ease, fill: "backwards" },
  );
}

/**
 * A mancha deslizando até o registro. Pelo `translate` à parte, não pelo `transform`: a mancha
 * pode ter a própria rotação (a do `SceneDone`), e o `transform` a trocaria até o fim, num salto.
 */
const SLIDE_FROM = `${BLOB.from[0]}px ${BLOB.from[1]}px`;

function blob(el: SVGElement, delay: number, duration: number) {
  return el.animate(
    [
      { opacity: 0, translate: SLIDE_FROM },
      { opacity: 1, translate: "0 0" },
    ],
    { duration, delay, easing: BLOB.ease, fill: "backwards" },
  );
}

/** Uma volta do loop, repetida para sempre: cada elemento com os seus quadros na volta inteira. */
function loopOn(looping: Piece[], at: number, pace: number, time: (ms: number) => number) {
  const strokes = looping
    .filter((p) => p.role === "traco")
    .map((p) => ({ ...p, ...strokeMs(p.el) }));
  let t = 0;
  const drawn = strokes.map((s) => {
    const ms = s.ms * pace;
    const span = { start: t, end: t + ms };
    t += ms + PEN_LIFT * pace;
    return span;
  });
  const inked = t - PEN_LIFT * pace;
  const blobStart = Math.max(0, inked - 140);
  const fadeStart = Math.max(inked, blobStart + BLOB.ms) + LOOP.hold;
  const fadeEnd = fadeStart + LOOP.fade;
  const cycle = fadeEnd + LOOP.gap;
  const o = (ms: number) => ms / cycle;
  const timing = {
    duration: time(cycle),
    delay: time(at),
    iterations: Infinity,
    fill: "backwards" as const,
  };

  const out: Animation[] = [];
  strokes.forEach((s, i) => {
    const { start, end } = drawn[i]!;
    const dash = `${s.len} ${s.len}`;
    out.push(
      s.el.animate(
        [
          { offset: 0, strokeDasharray: dash, strokeDashoffset: s.len, opacity: 1 },
          { offset: o(start), strokeDasharray: dash, strokeDashoffset: s.len, easing: HAND_EASE },
          { offset: o(end), strokeDasharray: dash, strokeDashoffset: 0 },
          { offset: o(fadeStart), strokeDasharray: dash, strokeDashoffset: 0, opacity: 1 },
          { offset: o(fadeEnd), strokeDasharray: dash, strokeDashoffset: 0, opacity: 0 },
          { offset: 1, strokeDasharray: dash, strokeDashoffset: s.len, opacity: 0 },
        ],
        timing,
      ),
    );
  });
  const from = SLIDE_FROM;
  for (const { el, role } of looping) {
    if (role !== "mancha") continue;
    out.push(
      el.animate(
        [
          { offset: 0, opacity: 0, translate: from },
          { offset: o(blobStart), opacity: 0, translate: from, easing: BLOB.ease },
          { offset: o(blobStart + BLOB.ms), opacity: 1, translate: "0 0" },
          { offset: o(fadeStart), opacity: 1, translate: "0 0" },
          { offset: o(fadeEnd), opacity: 0, translate: "0 0" },
          { offset: 1, opacity: 0, translate: from },
        ],
        timing,
      ),
    );
  }
  return out;
}

/* ——— O DuDoo da cena ——— */

interface Stage {
  /** Muda a cada desenho; o DuDoo recomeça a chegada. */
  run: number;
  /** Quando ele termina de chegar, em ms desde o começo do desenho. */
  arriveAt: number;
  still: boolean;
}

const DrawStage = createContext<Stage | null>(null);

/** O nome do mood, se a expressão for uma do vocabulário (com ou sem inclinação). */
function named(mood: DuDooMood | DuDooExpression): {
  mood: DuDooMood | DuDooExpression;
  lean: number;
} {
  if (typeof mood === "string") return { mood, lean: 0 };
  const plain = JSON.stringify({ ...mood, lean: 0 });
  const name = (Object.keys(DUDOO_MOODS) as DuDooMood[]).find(
    (k) => JSON.stringify({ ...DUDOO_MOODS[k], lean: 0 }) === plain,
  );
  return name ? { mood: name, lean: mood.lean } : { mood, lean: 0 };
}

/**
 * O rosto do DuDoo dentro de uma cena que se desenha: chega neutro e, assentado, faz a cara da
 * cena (a piscadinha do pronto, o pensando da espera). Entra no lugar do `DuDooFace` parado pelo
 * `SceneDuDooFace` do pacote.
 */
function SceneFace({ mood, size }: { mood: DuDooMood | DuDooExpression; size: number }) {
  const stage = useContext(DrawStage);
  const reduced = usePrefersReducedMotion();
  const target = named(mood);
  const [arrived, setArrived] = useState(true);
  useEffect(() => {
    if (!stage || stage.still || !stage.run) return setArrived(true);
    setArrived(false);
    const id = window.setTimeout(() => setArrived(true), stage.arriveAt + DUDOO_REACT);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage?.run, stage?.still]);
  const e = useDuDooMotion(arrived ? target.mood : "neutro", { reduced: reduced || stage?.still });
  return <DuDooFace size={size} mood={target.lean ? { ...e, lean: target.lean } : e} title="" />;
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
  const running = useRef<() => void>(() => {});
  const seen = useRef(false);
  const [stage, setStage] = useState<Stage>({ run: 0, arriveAt: 0, still });

  const play = () => {
    const svg = ref.current?.querySelector("svg");
    running.current();
    if (!svg || still) return;
    const { stop, dudooAt } = drawOn(svg, { delay, speed });
    running.current = stop;
    setStage((s) => ({ run: s.run + 1, arriveAt: dudooAt, still: false }));
  };

  // Antes de pintar: a cena começa escondida, para não piscar pronta e sumir.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (still) {
      running.current();
      el.style.visibility = "";
      setStage((s) => ({ ...s, still: true }));
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

  useEffect(() => () => running.current(), []);

  return (
    <DrawStage.Provider value={stage}>
      <SceneDuDooFace.Provider value={SceneFace}>
        <div ref={ref}>{children}</div>
      </SceneDuDooFace.Provider>
    </DrawStage.Provider>
  );
}

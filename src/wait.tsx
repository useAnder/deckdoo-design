import { useEffect, useRef, useState, type CSSProperties } from "react";

/*
 * A espera: o esqueleto que só aparece se a resposta demora (`useWait`, `Skeleton`) e o fio no
 * topo da página que responde ao clique (`TopProgress`). Vieram do `@eloquent-core/design`. O
 * visual está em `design.css`.
 */

/**
 * Quanto a espera esconde antes de aparecer (ms). Com cache, a maioria das esperas acaba antes
 * disso e nada pisca.
 */
export const WAIT_DELAY = 200;

/** Quanto tempo sem espera nenhuma ainda conta como a mesma troca de tela (o vão entre desmontar uma e montar outra). */
const SAME_EPISODE = 120;

let active = 0;
let episodeStart = 0;
let episodeEnd = Number.NEGATIVE_INFINITY;

const now = () => (typeof performance === "undefined" ? Date.now() : performance.now());

/**
 * A espera atrasada, para o contêiner de um esqueleto: `<div {...useWait()}>` (junte ao seu
 * `className` se o elemento já tiver um). Fica invisível por `WAIT_DELAY` e então esmaece para
 * dentro. As esperas de uma mesma troca de tela são uma só: a que entra no lugar de outra (a
 * página, depois a lista) herda o atraso que falta, e se a anterior já estava à vista aparece na
 * hora, sem esmaecer. Assim o esqueleto não some e volta entre um nível e outro.
 */
export function useWait(): { className: string; style: CSSProperties } {
  // No render, antes do commit: a espera que sai ainda conta como ativa, e a que entra continua o mesmo episódio.
  const [style] = useState<CSSProperties>(() => {
    const t = now();
    if (active === 0 && t - episodeEnd > SAME_EPISODE) episodeStart = t;
    const left = WAIT_DELAY - (t - episodeStart);
    return left > 0 ? { animationDelay: `${Math.round(left)}ms` } : { animation: "none" };
  });
  useEffect(() => {
    active++;
    return () => {
      active--;
      if (active === 0) episodeEnd = now();
    };
  }, []);
  return { className: "dd-wait", style };
}

/**
 * Um traço do esqueleto: a forma do que vai chegar (linha de texto, avatar, miniatura), com o
 * brilho que corre. Decorativo; quem anuncia a espera é o contêiner (`role="status"`).
 */
export function Skeleton({
  width,
  height = 14,
  radius,
  className,
  style,
}: {
  width?: number | string;
  height?: number | string;
  /** O canto. Padrão: 6 px; `"50%"` para o avatar. */
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className ? `dd-skel ${className}` : "dd-skel"}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden
    />
  );
}

/** Quanto tempo sem espera nenhuma ainda conta como a mesma (o vão entre a rota terminar e os dados começarem). */
const SETTLE = 120;
/** Depois de aparecer, fica pelo menos isto à vista: a resposta que chega logo em seguida não vira um flash. */
const MIN_VISIBLE = 400;
/** Completa e esmaece (a transição do `.dd-progress` em `.is-done`). */
const FINISH = 450;

type Phase = "off" | "start" | "run" | "done";

/** A barra acompanha a coluna do conteúdo (`.dd-main`); sem ela, a largura da tela. */
function measure(): CSSProperties {
  const main = document.querySelector(".dd-main");
  if (!main) return {};
  const { left, width } = main.getBoundingClientRect();
  return { left, width };
}

/**
 * O fio de espera do topo: responde ao clique quando a resposta demora. Aparece depois de
 * `WAIT_DELAY` (o mesmo ritmo do `useWait`), fica pelo menos 400 ms, cresce devagar sem prometer
 * um fim e, quando `active` cai, completa e esmaece. Ligue ao carregamento do roteador e às
 * buscas sem dado ainda; o que atualiza em segundo plano fica de fora. É `fixed` e decorativo:
 * não ocupa layout, não recebe clique e fica fora da árvore de acessibilidade.
 */
export function TopProgress({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<Phase>("off");
  const [box, setBox] = useState<CSSProperties>();
  const [busy, setBusy] = useState(active);
  const fill = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);
  const live = useRef(active);

  // `busy` atravessa o vão entre uma espera e a seguinte; `live` diz se ainda há espera na hora de aparecer.
  useEffect(() => {
    live.current = active;
    if (active) {
      setBusy(true);
      return;
    }
    const t = setTimeout(() => setBusy(false), SETTLE);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (phase === "start") {
      // Pinta em zero antes de soltar a transição, senão a barra já nasce no fim.
      fill.current?.getBoundingClientRect();
      setPhase("run");
      return;
    }
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === "off" && busy) {
      t = setTimeout(() => {
        if (!live.current) return;
        setBox(measure());
        shownAt.current = now();
        setPhase("start");
      }, WAIT_DELAY);
    } else if (phase === "run" && !busy) {
      t = setTimeout(() => setPhase("done"), Math.max(0, MIN_VISIBLE - (now() - shownAt.current)));
    } else if (phase === "done") {
      t = setTimeout(() => setPhase("off"), FINISH);
    }
    return () => clearTimeout(t);
  }, [busy, phase]);

  if (phase === "off") return null;
  return (
    <div className={`dd-progress is-${phase}`} style={box} aria-hidden="true">
      <div ref={fill} className="dd-progress-fill" />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  DUDOO_MOODS,
  dudooExpression,
  type DuDooEye,
  type DuDooExpression,
  type DuDooMood,
} from "@deckdoo/design";

/**
 * O DuDoo em movimento: protótipo do ateliê. Devolve, quadro a quadro, a expressão que o
 * `DuDooFace` desenha; nada no desenho muda. Três camadas, uma por cima da outra:
 *
 * 1. **A troca de mood.** Interpola os números de uma expressão até a outra. O olhar chega
 *    primeiro e as pálpebras vêm atrás, como quem vira o olho antes de mudar de cara. O olho
 *    fechado ("^", "‿") é outro desenho, então para chegar nele a pálpebra fecha até a fresta
 *    e só aí vira curva: a troca é uma piscada.
 * 2. **A vida própria**, por mood: a pupila passeia no `pensando`, dá uma olhada de lado no
 *    `neutro`, o olho respira no `dormindo`.
 * 3. **A piscada**, de vez em quando, com o olho aberto.
 *
 * O ritmo da troca vem da intensidade do mood (`docs/marca.md`): Trabalho é rápido e sem passar
 * do ponto; Festa tem mola; Neutro é calmo. Com movimento reduzido, a troca fica curta e sem
 * mola, a piscada e a piscadinha ficam, e sai o que mexe sem parar (olhar solto, respiração, riso).
 */

export type Intensity = "neutro" | "trabalho" | "festa";

export const INTENSITY: Record<DuDooMood, Intensity> = {
  neutro: "neutro",
  esperando: "neutro",
  dormindo: "neutro",
  olhando: "trabalho",
  pensando: "trabalho",
  curioso: "trabalho",
  "de-canto": "trabalho",
  focado: "trabalho",
  confuso: "trabalho",
  empolgado: "festa",
  feliz: "festa",
  piscada: "festa",
};

type Ease = (t: number) => number;

const easeOut: Ease = (t) => 1 - (1 - t) ** 3;
const easeInOut: Ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeIn: Ease = (t) => t ** 2;
/** A mola: passa uns 25% do ponto, volta um pouco aquém e assenta. */
const spring: Ease = (t) => (t >= 1 ? 1 : 1 - Math.exp(-4.2 * t) * Math.cos(Math.PI * 3 * t));

export const TIMING: Record<
  Intensity,
  {
    ms: number;
    ease: Ease;
    label: string;
    /** Quanto o olho cresce no meio da troca. */ pop: number;
  }
> = {
  trabalho: { ms: 240, ease: easeOut, label: "240 ms, sem passar do ponto", pop: 0 },
  neutro: { ms: 340, ease: easeInOut, label: "340 ms, calmo", pop: 0 },
  festa: { ms: 560, ease: spring, label: "560 ms, com mola e o olho saltando", pop: 0.1 },
};

/**
 * Movimento reduzido não é DuDoo parado: a troca continua, curta e sem mola nem salto, e a
 * piscada fica (é pequena e rara). Sai o que mexe sem parar: o olhar solto, a respiração, o riso.
 */
export const REDUCED_TIMING: (typeof TIMING)[Intensity] = {
  ms: 120,
  ease: easeOut,
  label: "120 ms, sem mola nem salto (movimento reduzido)",
  pop: 0,
};

/** O gesto da piscadinha, mais rápido que a troca da Festa: fecha e já reabre. */
const WINK = {
  close: { ...TIMING.festa, ms: 170 },
  hold: 0,
  open: { ...TIMING.trabalho, ms: 150 },
};

/** O olhar chega nesta fração do tempo da troca; o resto vem depois. */
const LOOK_LEAD = 0.55;
/** A fresta do olho que vai fechar em curva: centrada, para virar o traço reto do `arc: 0`. */
const SHUT = { top: 0.45, bottom: 0.45, tilt: 0 };
/** A fresta da piscada: a pálpebra de cima faz quase todo o caminho. */
const BLINK = { top: 0.64, bottom: 0.26 };

type Eye = Omit<DuDooEye, "look"> & { look: [number, number] };
interface Frame {
  pupil: number;
  lean: number;
  left: Eye;
  right: Eye;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const resolve = (m: DuDooMood | DuDooExpression) => (typeof m === "string" ? DUDOO_MOODS[m] : m);

/** Cada olho com o seu olhar: o `look` do rosto desce para os olhos, e daí tudo interpola. */
function toFrame(e: DuDooExpression): Frame {
  const eye = (d: DuDooEye): Eye => ({ ...d, look: d.look ?? e.look });
  return { pupil: e.pupil, lean: e.lean, left: eye(e.left), right: eye(e.right) };
}

function toExpression(f: Frame): DuDooExpression {
  return { look: f.left.look, pupil: f.pupil, lean: f.lean, left: f.left, right: f.right };
}

const closed = (e: Eye) => e.arc !== undefined;

function mixOpen(a: Eye, b: Eye, t: number, tl: number): Eye {
  return {
    size: lerp(a.size, b.size, t),
    top: lerp(a.top, b.top, t),
    tilt: lerp(a.tilt, b.tilt, t),
    bottom: lerp(a.bottom, b.bottom, t),
    look: lerp2(a.look, b.look, tl),
  };
}

/** Um olho de `a` a `b`, com `u` o tempo cru (0 a 1) da troca. */
function mixEye(a: Eye, b: Eye, u: number, ease: Ease): Eye {
  const t = ease(u);
  const tl = ease(clamp01(u / LOOK_LEAD));
  if (closed(a) === closed(b)) {
    const eye = mixOpen(a, b, t, tl);
    return closed(a) ? { ...eye, arc: lerp(a.arc!, b.arc!, t) } : eye;
  }
  // Abrir ou fechar: metade da troca no olho aberto, metade na curva, e a fresta no meio. A
  // curva nasce do traço reto (`arc: 0`), que fica onde a fresta centrada fecha.
  const mid = lerp(a.size, b.size, 0.5);
  const first = u < 0.5;
  const k = first ? easeIn(u / 0.5) : (closed(a) ? easeOut : ease)((u - 0.5) / 0.5);
  if (!closed(a)) {
    if (first) return { ...mixOpen(a, { ...a, ...SHUT, size: mid }, k, k), look: a.look };
    return { ...b, size: lerp(mid, b.size, k), arc: b.arc! * k };
  }
  if (first) return { ...a, size: lerp(a.size, mid, k), arc: a.arc! * (1 - k) };
  return mixOpen({ ...b, ...SHUT, size: mid }, b, k, k);
}

function mixFrame(a: Frame, b: Frame, u: number, ease: Ease, pop = 0): Frame {
  const t = ease(u);
  // O salto da Festa: o olho cresce no começo da troca e volta, por cima da mola.
  const grow = pop * Math.sin(Math.PI * clamp01(u / 0.6));
  const eye = (e: Eye): Eye => (grow ? { ...e, size: e.size + grow } : e);
  return {
    pupil: lerp(a.pupil, b.pupil, t),
    lean: lerp(a.lean, b.lean, t),
    left: eye(mixEye(a.left, b.left, u, ease)),
    right: eye(mixEye(a.right, b.right, u, ease)),
  };
}

/* ——— Vida própria ——— */

/**
 * O olhar solto de cada mood. `away` sorteia para onde ele olha; com `home`, ele volta ao olhar
 * do mood entre uma olhada e outra. Os tempos são de quanto ele fica parado em cada ponto.
 */
const IDLE: Partial<
  Record<
    DuDooMood,
    {
      away: (home: [number, number]) => [number, number];
      hold: [number, number];
      home?: [number, number];
    }
  >
> = {
  // Monta a ideia: a pupila salta de um ponto a outro, sempre para cima.
  pensando: {
    away: () => [rand(-0.85, 0.9), rand(-0.9, -0.35)],
    hold: [500, 1300],
  },
  // De vez em quando, uma olhada de lado, e volta.
  neutro: {
    away: ([x, y]) => [x + rand(0.25, 0.5) * (Math.random() < 0.5 ? -1 : 1), y + rand(-0.2, 0.15)],
    hold: [700, 1300],
    home: [4000, 8000],
  },
  // Entediado: o olhar escorrega pelo chão.
  esperando: {
    away: ([x, y]) => [x + rand(-0.6, 0.6), y],
    hold: [1400, 2400],
    home: [3000, 6000],
  },
  // Revisando: lê, linha a linha, da esquerda para a direita.
  focado: {
    away: ([, y]) => [rand(-0.5, 0.5), y + rand(-0.1, 0.15)],
    hold: [350, 700],
    home: [1200, 2400],
  },
  // Aponta com o olhar: fica no alvo, reajustando de leve, como quem confere.
  olhando: {
    away: ([x, y]) => [x + rand(-0.12, 0.08), y + rand(-0.15, 0.15)],
    hold: [700, 1500],
  },
  // A pergunta: olha para você, esperando a resposta, e volta para o assunto.
  curioso: {
    away: () => [rand(-0.12, 0.12), rand(-0.05, 0.12)],
    hold: [900, 1500],
    home: [1600, 2800],
  },
  // A segunda olhada: volta para você um instante e torna a olhar de lado.
  "de-canto": {
    away: () => [rand(-0.05, 0.15), rand(-0.05, 0.1)],
    hold: [350, 550],
    home: [2200, 4000],
  },
  // Não para quieto.
  empolgado: {
    away: () => [rand(-0.45, 0.45), rand(-0.35, 0.3)],
    hold: [250, 650],
  },
  // Procura o sentido: o olhar vaga, sem achar onde parar.
  confuso: {
    away: ([x, y]) => [x + rand(-0.3, 0.3), y + rand(-0.3, 0.3)],
    hold: [500, 1100],
  },
  // Depois da piscada, o olho reabre e ele fica como no neutro.
  piscada: {
    away: ([x, y]) => [x + rand(0.25, 0.5) * (Math.random() < 0.5 ? -1 : 1), y + rand(-0.2, 0.15)],
    hold: [700, 1300],
    home: [3000, 6000],
  },
};

/** A respiração do `dormindo`: a curva do olho fecha e abre um pouco, devagar. */
const BREATH_MS = 3600;
/** O riso do `feliz`: de vez em quando, o "^" sobe um pouco e volta. */
const CHUCKLE_MS = 380;
const CHUCKLE_EVERY: [number, number] = [1800, 3600];
/** A piscadinha reaberta: o olhar dela, com os dois olhos abertos. */
const WINK_OPEN = dudooExpression({ look: DUDOO_MOODS.piscada.look });

const SACCADE_MS = 110;
const BLINK_MS = { close: 70, hold: 30, open: 110 };
const BLINK_EVERY: [number, number] = [2600, 6500];

export interface DuDooMotionOptions {
  /** Piscar de vez em quando. */
  blink?: boolean;
  /** O olhar solto e a respiração. */
  idle?: boolean;
  /**
   * Troca curta, sem mola, e nada mexendo sem parar (a piscada fica). Padrão: o
   * `prefers-reduced-motion` do sistema.
   */
  reduced?: boolean;
  /** Multiplica o tempo, para ver de perto; 1 é o ritmo de verdade. */
  speed?: number;
  /** Força o ritmo da troca; sem isso, vale a intensidade do mood. */
  intensity?: Intensity;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  useEffect(() => {
    const q = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!q) return;
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * O motor, sem React e sem relógio do browser: quem usa avança o tempo (`advance`) e recebe o
 * quadro. É o que o hook roda a cada `requestAnimationFrame`, e o que dá para testar quadro a
 * quadro.
 */
export class DuDooMotion {
  private clock = 0;
  private from: Frame;
  private to: Frame;
  private name: DuDooMood | undefined;
  private start = -Infinity;
  private ms = 1;
  private ease: Ease = easeOut;
  private pop = 0;
  private last: Frame;
  /** A piscadinha já reabriu o olho. */
  private winked = false;
  private chuckleAt = -Infinity;
  private nextChuckle = 0;
  // O olhar solto: de onde, para onde, quando saiu e quando sai de novo.
  private look = {
    from: [0, 0] as [number, number],
    to: [0, 0] as [number, number],
    at: 0,
    next: 0,
  };
  private away = false;
  private blinkAt = -Infinity;
  private nextBlink = rand(...BLINK_EVERY);
  private double = false;

  constructor(mood: DuDooMood | DuDooExpression) {
    this.from = this.to = this.last = toFrame(resolve(mood));
    this.name = typeof mood === "string" ? mood : undefined;
  }

  /** Mood novo: a troca parte de onde ele está agora, não do mood anterior. */
  set(mood: DuDooMood | DuDooExpression, intensity?: Intensity) {
    const name = typeof mood === "string" ? mood : undefined;
    this.name = name;
    this.winked = false;
    const timing =
      name === "piscada" ? WINK.close : TIMING[intensity ?? (name ? INTENSITY[name] : "trabalho")];
    this.tween(resolve(mood), timing);
    this.nextChuckle = this.clock + this.ms + rand(...CHUCKLE_EVERY);
  }

  /** Movimento reduzido: as próximas trocas saem curtas e sem mola. */
  reduced = false;

  /** A troca em si: de onde ele está agora até `target`, sem mudar o nome do mood. */
  private tween(target: DuDooExpression, chosen: (typeof TIMING)[Intensity]) {
    const timing = this.reduced ? REDUCED_TIMING : chosen;
    this.from = this.last;
    this.to = toFrame(target);
    this.start = this.clock;
    // Fechar ou abrir o olho pede a fresta no meio: um pouco mais de tempo.
    const crossing = (["left", "right"] as const).some(
      (side) => closed(this.from[side]) !== closed(this.to[side]),
    );
    this.ms = timing.ms * (crossing ? 1.35 : 1);
    this.ease = timing.ease;
    this.pop = timing.pop;
    const home = this.to.left.look;
    const cfg = this.name ? IDLE[this.name] : undefined;
    const wait = cfg ? rand(...(cfg.home ?? cfg.hold)) : 0;
    this.look = { from: home, to: home, at: 0, next: this.clock + this.ms + wait };
    this.away = false;
  }

  /**
   * Avança `dt` ms e devolve o quadro. `gesture` deixa a piscadinha reabrir; sem ele (a fala
   * antiga do chat), ela fica fechada, como o desenho.
   */
  advance(
    dt: number,
    {
      blink = true,
      idle = true,
      gesture,
    }: { blink?: boolean; idle?: boolean; gesture?: boolean } = {},
  ): DuDooExpression {
    gesture ??= idle;
    this.clock += dt;
    const c = this.clock;

    if (
      gesture &&
      this.name === "piscada" &&
      !this.winked &&
      c - this.start >= this.ms + WINK.hold
    ) {
      this.winked = true;
      this.tween(WINK_OPEN, WINK.open);
    }

    // 1. A troca.
    const u = clamp01((c - this.start) / this.ms);
    let f = u < 1 ? mixFrame(this.from, this.to, u, this.ease, this.pop) : this.to;
    const settled = u >= 1;

    // 2. A vida própria, só depois que a troca assentou.
    const cfg = this.name ? IDLE[this.name] : undefined;
    if (idle && settled && cfg) {
      const home = this.to.left.look;
      if (c >= this.look.next) {
        const goAway = !cfg.home || !this.away;
        this.look = {
          from: this.saccade(c),
          to: goAway ? cfg.away(home) : home,
          at: c,
          next: c + rand(...(goAway || !cfg.home ? cfg.hold : cfg.home)),
        };
        this.away = goAway;
      }
      // O olhar solto anda junto nos dois olhos, mantendo a diferença entre eles (o `confuso`).
      const look = this.saccade(c);
      const [dx, dy] = [look[0] - home[0], look[1] - home[1]];
      const shift = (e: Eye): Eye => ({ ...e, look: [e.look[0] + dx, e.look[1] + dy] });
      f = { ...f, left: shift(f.left), right: shift(f.right) };
    }
    if (idle && settled && this.name === "dormindo") {
      const k = 1 + 0.18 * Math.sin((c / BREATH_MS) * Math.PI * 2);
      const breathe = (e: Eye): Eye => (closed(e) ? { ...e, arc: e.arc! * k } : e);
      f = { ...f, left: breathe(f.left), right: breathe(f.right) };
    }
    if (idle && settled && this.name === "feliz") {
      if (c >= this.nextChuckle) {
        this.chuckleAt = c;
        this.nextChuckle = c + rand(...CHUCKLE_EVERY);
      }
      const p = (c - this.chuckleAt) / CHUCKLE_MS;
      if (p < 1) {
        // Dois soquinhos, o segundo menor: o riso.
        const k = 1 + 0.28 * Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p * 0.5);
        const laugh = (e: Eye): Eye => (closed(e) ? { ...e, arc: e.arc! * k } : e);
        f = { ...f, left: laugh(f.left), right: laugh(f.right) };
      }
    }
    this.last = f;

    // 3. A piscada, por cima de tudo e só com os dois olhos abertos.
    const open = !closed(f.left) && !closed(f.right);
    if (blink && settled && open && c >= this.nextBlink) {
      this.blinkAt = c;
      this.double = Math.random() < 0.2;
      this.nextBlink = c + rand(...BLINK_EVERY);
    }
    const b =
      blinkAmount(c - this.blinkAt) || (this.double ? blinkAmount(c - this.blinkAt - 260) : 0);
    if (b > 0 && open) {
      const shut = (e: Eye): Eye => ({
        ...e,
        top: lerp(e.top, Math.max(e.top, BLINK.top), b),
        bottom: lerp(e.bottom, BLINK.bottom, b),
        tilt: lerp(e.tilt, 0, b),
      });
      f = { ...f, left: shut(f.left), right: shut(f.right) };
    }
    return toExpression(f);
  }

  /** Pisca agora, para testar. */
  blinkNow() {
    this.blinkAt = this.clock;
    this.double = false;
  }

  private saccade(c: number): [number, number] {
    return lerp2(this.look.from, this.look.to, easeOut(clamp01((c - this.look.at) / SACCADE_MS)));
  }
}

/**
 * A expressão do DuDoo, animada. Passe o mood que ele deve ter agora; o hook devolve o quadro
 * a desenhar (`<DuDooFace mood={…} />`, `<DuDoo mood={…} />`, `<ChatBubble mood={…} />`).
 */
export function useDuDooMotion(
  mood: DuDooMood | DuDooExpression,
  { blink = true, idle = true, reduced, speed = 1, intensity }: DuDooMotionOptions = {},
): DuDooExpression {
  const systemReduced = usePrefersReducedMotion();
  const less = reduced ?? systemReduced;
  const [shown, setShown] = useState(() => resolve(mood));
  const [motion] = useState(() => new DuDooMotion(mood));
  motion.reduced = less;
  // O que mexe sem parar sai no movimento reduzido; o gesto (a piscadinha reabrindo) fica.
  const wander = idle && !less;

  const opts = useRef({ blink, idle: wander, gesture: idle, speed });
  opts.current = { blink, idle: wander, gesture: idle, speed };

  const key = typeof mood === "string" ? mood : JSON.stringify(mood);
  useEffect(() => {
    motion.set(mood, intensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Sem vida própria, ele volta ao desenho do mood (o olhar solto assenta) e para ali: é a fala
  // antiga do chat, ou o movimento reduzido.
  const wanderOnce = useRef(wander);
  useEffect(() => {
    if (wanderOnce.current === wander) return;
    wanderOnce.current = wander;
    if (!wander) motion.set(mood, intensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wander]);

  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const o = opts.current;
      const f = motion.advance(Math.min(now - prev, 64) * o.speed, o);
      prev = now;
      setShown((p) => (same(p, f) ? p : f));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motion]);

  return shown;
}

/** Quanto a piscada fechou o olho, de 0 a 1, `t` ms depois de começar. */
function blinkAmount(t: number): number {
  const { close, hold, open } = BLINK_MS;
  if (t < 0 || t > close + hold + open) return 0;
  if (t < close) return easeIn(t / close);
  if (t < close + hold) return 1;
  return 1 - easeOut((t - close - hold) / open);
}

/** Evita redesenhar quando nada mexeu (o DuDoo parado entre uma olhada e outra). */
function same(a: DuDooExpression, b: DuDooExpression): boolean {
  const eq = (x: number, y: number) => Math.abs(x - y) < 1e-4;
  const eye = (e: DuDooEye, g: DuDooEye) => {
    const [el, gl] = [e.look ?? a.look, g.look ?? b.look];
    return (
      eq(e.size, g.size) &&
      eq(e.top, g.top) &&
      eq(e.tilt, g.tilt) &&
      eq(e.bottom, g.bottom) &&
      e.arc === g.arc &&
      eq(el[0], gl[0]) &&
      eq(el[1], gl[1])
    );
  };
  return eq(a.pupil, b.pupil) && eq(a.lean, b.lean) && eye(a.left, b.left) && eye(a.right, b.right);
}

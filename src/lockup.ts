import { LOCKUP_SPEC, type LockupSpec } from "./lockup-spec.js";
import { DECKDOO_WORD as WORD } from "./word.js";

/**
 * A geometria do lockup de cada app: onde vão o nome e o "DeckDoo" em relação ao mascote. É a
 * mesma conta para o `Logo` (com o nome em contorno, gerado) e para a bancada da marca (com o
 * nome medido na fonte ao vivo); muda aqui, muda nos dois.
 */

/**
 * - `compact`: mascote + nome.
 * - `stacked`: mascote + nome, com o "DeckDoo" embaixo.
 * - `inline`: o logotipo (mascote + "DeckDoo") e o nome depois.
 * - `text-stacked`, `text-inline`: os dois de cima sem o mascote.
 */
export type LockupVersion = "compact" | "stacked" | "inline" | "text-stacked" | "text-inline";

export const LOCKUP_VERSIONS: readonly LockupVersion[] = [
  "compact",
  "stacked",
  "inline",
  "text-stacked",
  "text-inline",
];

/**
 * As medidas do nome, em fração do corpo da fonte, a partir da origem do texto (o começo da linha
 * de base). `glyphs` é a tinta de cada letra: [começo, fim, quanto desce da base].
 */
export interface LockupMetrics {
  capFrac: number;
  inkLeft: number;
  inkRight: number;
  ascent: number;
  glyphs: readonly (readonly [number, number, number])[];
}

/** O nome em contorno num peso: o caminho em milésimos de em, com y para baixo. */
export interface LockupOutline {
  weight: number;
  d: string;
  metrics: LockupMetrics;
}

/**
 * O nome de um app. Com `outlines` (gerados por `pnpm lockup`), o `Logo` desenha o nome em
 * contorno, igual em qualquer lugar; sem eles, escreve com a fonte da página.
 */
export interface LockupApp {
  name: string;
  outlines?: readonly LockupOutline[];
}

/** Medidas do mascote (`deckdoo-mark.svg`, 114,4 × 125,3). */
const MARK_W = 114.4;
const MARK_H = 125.3;
/** O diâmetro da pupila / a altura: a unidade dos espaços. */
export const MARK_PUPIL = 19.6 / MARK_H;
/** O centro dos olhos / a altura. */
const MARK_EYES = 42.97 / MARK_H;

/**
 * O bloco de texto do lockup, em px, com x = 0 onde a tinta começa e y = 0 no topo do mascote.
 * O mascote fica antes dele, a `gap` de distância (0 sem o mascote).
 */
export interface LockupBlock {
  gap: number;
  width: number;
  /** O que passa do topo e da base do mascote (ascendente, descendente). */
  minY: number;
  maxY: number;
  text: { x: number; baseline: number; size: number; capH: number };
  word?: { x: number; baseline: number; scale: number };
  rule?: { x: number; y1: number; y2: number; width: number };
  /** Nas empilhadas: da descendente do nome ao topo da letra do "DeckDoo" embaixo dela. */
  clearance?: number;
  /** A espessura do recorte no "DeckDoo", quando ele vai. */
  knock?: number;
}

export function lockupHasMark(version: LockupVersion): boolean {
  return !version.startsWith("text-");
}

export function lockupLayout(
  version: LockupVersion,
  height: number,
  m: LockupMetrics,
  spec: LockupSpec = LOCKUP_SPEC,
): LockupBlock {
  const pupil = height * MARK_PUPIL;
  const withMark = lockupHasMark(version);
  let minY = 0;
  let maxY = height;
  let width = 0;

  /** O nome com a tinta da primeira letra em `inkLeft` e a base em `baseline`. */
  const placeText = (capH: number, inkLeft: number, baseline: number) => {
    const size = capH / m.capFrac;
    width = Math.max(width, inkLeft + (m.inkRight - m.inkLeft) * size);
    minY = Math.min(minY, baseline - m.ascent * size);
    const lowest = Math.max(0, ...m.glyphs.map((g) => g[2]));
    maxY = Math.max(maxY, baseline + lowest * size);
    return { x: inkLeft - m.inkLeft * size, baseline, size, capH };
  };
  /** O "DeckDoo" com a tinta do "D" em `x` e a base em `baseline`. */
  const placeWord = (x: number, baseline: number, scale: number) => {
    width = Math.max(width, x + (WORD.right - WORD.left) * scale);
    maxY = Math.max(maxY, baseline + (WORD.bottom - WORD.baseline) * scale);
    return { x, baseline, scale };
  };

  if (version === "compact") {
    const { cap, gap, align } = spec.compact;
    const capH = height * cap;
    let baseline = height / 2 + capH / 2;
    if (align === "eyes") baseline = height * MARK_EYES + capH / 2;
    else if (align === "top") baseline = capH;
    else if (align === "baseline") baseline = height;
    const text = placeText(capH, 0, baseline);
    return { gap: gap * pupil, width, minY, maxY, text };
  }

  if (version === "stacked" || version === "text-stacked") {
    // O nome encosta a maiúscula no topo do mascote; o "DeckDoo" assenta na base dele.
    const { cap, word: wordCap, gap, knock } = spec.stacked;
    const capH = height * cap;
    const text = placeText(capH, 0, capH);
    const scale = (height * wordCap) / (WORD.baseline - WORD.capTop);
    const word = placeWord(0, height, scale);

    // A folga só conta onde uma letra do nome passa por cima de uma letra do "DeckDoo".
    let clearance = Infinity;
    for (const [g0, g1, descent] of m.glyphs) {
      const gx0 = text.x + g0 * text.size;
      const gx1 = text.x + g1 * text.size;
      const bottom = text.baseline + descent * text.size;
      for (const [a, b, top] of WORD.profile) {
        const lx0 = (a - WORD.left) * scale;
        const lx1 = (b - WORD.left) * scale;
        if (gx1 <= lx0 || gx0 >= lx1) continue;
        clearance = Math.min(clearance, height - (WORD.baseline - top) * scale - bottom);
      }
    }
    return {
      gap: withMark ? gap * pupil : 0,
      width,
      minY,
      maxY,
      text,
      word,
      ...(clearance !== Infinity && { clearance }),
      ...(knock && clearance < pupil && { knock: pupil * 0.66 }),
    };
  }

  // Lado a lado: o logotipo nas proporções do arquivo (o "DeckDoo" na escala do mascote) e o
  // nome depois, na mesma linha de base.
  const { cap, gap, rule } = spec.inline;
  const scale = height / MARK_H;
  const baseline = WORD.baseline * scale;
  const word = placeWord(0, baseline, scale);
  const wordRight = (WORD.right - WORD.left) * scale;
  const wordCap = (WORD.baseline - WORD.capTop) * scale;
  const gapPx = gap * pupil;
  const text = placeText(wordCap * cap, wordRight + gapPx, baseline);
  return {
    gap: withMark ? (WORD.left - MARK_W) * scale : 0,
    width,
    minY,
    maxY,
    text,
    word,
    ...(rule && {
      rule: {
        x: wordRight + gapPx / 2,
        y1: baseline - wordCap,
        y2: baseline,
        width: Math.max(1, wordCap * 0.045),
      },
    }),
  };
}

/** O contorno gerado mais perto do peso pedido. */
export function pickOutline(
  outlines: readonly LockupOutline[] | undefined,
  weight: number,
): LockupOutline | undefined {
  let best: LockupOutline | undefined;
  for (const o of outlines ?? []) {
    if (!best || Math.abs(o.weight - weight) < Math.abs(best.weight - weight)) best = o;
  }
  return best;
}

/** O `transform` que põe o "DeckDoo" (unidades do logotipo) no lugar do bloco. */
export function wordTransform(word: NonNullable<LockupBlock["word"]>): string {
  const { x, baseline, scale } = word;
  return `translate(${x - WORD.left * scale} ${baseline - WORD.baseline * scale}) scale(${scale})`;
}

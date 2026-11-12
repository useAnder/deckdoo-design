/**
 * As medidas do lockup de cada app (o mascote, o nome do app e o "DeckDoo"), decididas na bancada
 * da marca (`/marca.html` na cozinha). Sem `import` de propósito: o `scripts/lockup.mjs` lê este
 * arquivo direto no Node para saber em que pesos gerar os nomes.
 *
 * Proporções são da altura do mascote; espaços são em pupilas (o diâmetro da pupila do mascote,
 * 15,6% da altura dele), para crescer junto com a marca.
 */
export interface LockupSpec {
  /** O peso do nome em tamanho grande. */
  weight: number;
  /** Engrossa o nome no tamanho pequeno: abaixo de 56px sobe até 400, aos 20px chega lá. */
  autoWeight: boolean;
  /** Espaço entre letras, em em. */
  tracking: number;
  /** Mascote + nome. */
  compact: {
    /** Altura da maiúscula do nome / altura do mascote. */
    cap: number;
    /** Do mascote à tinta da primeira letra, em pupilas. */
    gap: number;
    /** O que o centro da maiúscula acompanha: o centro do mascote ou a linha dos olhos. */
    align: "center" | "eyes" | "top" | "baseline";
  };
  /** Mascote + nome, com o "DeckDoo" embaixo. O nome encosta no topo, o "DeckDoo" na base. */
  stacked: {
    cap: number;
    /** Altura da maiúscula do "DeckDoo" / altura do mascote. */
    word: number;
    gap: number;
    /** Onde a descendente do nome cai em cima de uma letra do "DeckDoo", abre um respiro nela. */
    knock: boolean;
  };
  /** O logotipo inteiro (mascote + "DeckDoo") e o nome depois, na mesma linha de base. */
  inline: {
    /** Altura da maiúscula do nome / a do "DeckDoo". */
    cap: number;
    /** Do "DeckDoo" ao nome, em pupilas. */
    gap: number;
    /** Um fio entre os dois. */
    rule: boolean;
  };
}

export const LOCKUP_SPEC: LockupSpec = {
  weight: 300,
  autoWeight: true,
  tracking: 0,
  compact: { cap: 0.62, gap: 1, align: "center" },
  stacked: { cap: 0.62, word: 0.26, gap: 0.95, knock: false },
  inline: { cap: 1, gap: 0.75, rule: false },
};

/** Onde o peso começa a subir e onde chega ao máximo (altura do mascote, px). */
const LARGE = 56;
const SMALL = 20;
const HEAVY = 400;

/** O peso do nome numa altura de mascote. */
export function lockupWeight(height: number, spec: LockupSpec = LOCKUP_SPEC): number {
  const w = spec.weight;
  if (!spec.autoWeight || height >= LARGE) return w;
  const heavy = Math.max(w, HEAVY);
  if (height <= SMALL) return heavy;
  const t = (height - SMALL) / (LARGE - SMALL);
  return Math.round((heavy + (w - heavy) * t) / 10) * 10;
}

/** Os pesos em que o nome é gerado em contorno: o grande, o pequeno e o do meio. */
export function lockupWeights(spec: LockupSpec = LOCKUP_SPEC): number[] {
  if (!spec.autoWeight) return [spec.weight];
  const heavy = Math.max(spec.weight, HEAVY);
  const mid = Math.round((spec.weight + heavy) / 20) * 10;
  return [...new Set([spec.weight, mid, heavy])];
}

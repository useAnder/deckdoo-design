import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * O DuDoo desenhado: o mascote montado em peças para ganhar expressão. O corpo é o D da marca,
 * os olhos são furos nele e as pupilas boiam dentro dos furos. Só os olhos mexem; o corpo não
 * deforma (no máximo inclina, numa ilustração). Regras de uso em `docs/marca.md`.
 *
 * As medidas saem do `deckdoo-mark.svg` (viewBox 114.4 × 125.3). "Esquerdo" e "direito" são
 * como se vê na tela: o esquerdo fica dentro do D, o direito morde a borda.
 */

const VIEW = { w: 114.4, h: 125.3 };

/** O D inteiro, sem os furos. A metade de cima espelha a de baixo do arquivo original. */
const BODY =
  "M20.95,0H49.94C62.04,0,73,2.72,82.81,8.17C92.62,13.62,100.33,21.12,105.96,30.69C111.59,40.25,114.4,50.91,114.4,62.65C114.4,74.39,111.59,85.05,105.96,94.61C100.33,104.18,92.62,111.68,82.81,117.13C73,122.58,62.04,125.3,49.94,125.3H20.95C9.38,125.3,0,115.92,0,104.35V20.95C0,9.38,9.38,0,20.95,0Z";

const EYES = {
  left: { cx: 42.45, cy: 42.97 },
  right: { cx: 98.56, cy: 42.97 },
} as const;
const EYE_RX = 24.6;
const EYE_RY = 24;
const PUPIL_R = 10.05;
/** A grossura do contorno no escuro, a do mascote invertido da marca. */
const LINE = 8.5;
/** Pálpebras fechando o olho até sobrar uma fresta: o furo nunca some de vez. */
const MAX_SHUT = 0.9;
/** Daqui para cima o olho conta como fechado e a pupila some: na fresta, ela vira um borrão. */
const CLOSED = 0.7;

export interface DuDooEye {
  /** Tamanho do olho; 1 é o do mascote. */
  size: number;
  /** Quanto a pálpebra de cima desce, de 0 (aberto) a 1. */
  top: number;
  /** Inclinação da pálpebra de cima, em graus. Positivo desce o lado direito da linha. */
  tilt: number;
  /** Quanto a pálpebra de baixo sobe, de 0 a 1. */
  bottom: number;
  /** Para onde a pupila deste olho olha; sem isso, vale o `look` do rosto. */
  look?: [number, number];
  /**
   * Olho fechado como um corte em curva, no lugar do furo: 1 é o "^" (sorrindo), −1 o "‿"
   * (dormindo), 0 um traço reto.
   */
  arc?: number;
}

export interface DuDooExpression {
  /** Para onde as pupilas olham: x e y de −1 a 1 (−1, 0 é a esquerda da tela). */
  look: [number, number];
  /** Tamanho da pupila; 1 é a do mascote. */
  pupil: number;
  left: DuDooEye;
  right: DuDooEye;
  /** Inclinação do corpo inteiro, em graus. Só em ilustração; o avatar ignora. */
  lean: number;
}

const OPEN: DuDooEye = { size: 1, top: 0, tilt: 0, bottom: 0 };

const NEUTRAL: DuDooExpression = { look: [0, 0], pupil: 1, left: OPEN, right: OPEN, lean: 0 };

/** Monta uma expressão a partir do neutro, só com o que muda (`both` vale para os dois olhos). */
export function dudooExpression(
  e: Partial<Omit<DuDooExpression, "left" | "right">> & {
    left?: Partial<DuDooEye>;
    right?: Partial<DuDooEye>;
    both?: Partial<DuDooEye>;
  },
): DuDooExpression {
  const { left, right, both, ...rest } = e;
  return {
    ...NEUTRAL,
    ...rest,
    left: { ...OPEN, ...both, ...left },
    right: { ...OPEN, ...both, ...right },
  };
}

/** O vocabulário do DuDoo. Quando usar cada uma está em `docs/marca.md`. */
export const DUDOO_MOODS = {
  neutro: NEUTRAL,
  olhando: dudooExpression({ look: [-1, 0.1] }),
  pensando: dudooExpression({ look: [0.75, -0.75], both: { top: 0.12 } }),
  curioso: dudooExpression({ look: [0.35, -0.2], left: { size: 0.82 }, right: { size: 1.12 } }),
  "de-canto": dudooExpression({ look: [-0.9, 0.15], both: { top: 0.42 } }),
  focado: dudooExpression({
    look: [0, 0.25],
    left: { top: 0.3, tilt: 14 },
    right: { top: 0.3, tilt: -14 },
  }),
  empolgado: dudooExpression({ pupil: 0.72, both: { size: 1.12 } }),
  feliz: dudooExpression({ both: { arc: 1 } }),
  piscada: dudooExpression({ look: [-0.35, -0.15], right: { arc: 1 } }),
  esperando: dudooExpression({ look: [-0.2, 0.9], both: { top: 0.55 } }),
  dormindo: dudooExpression({ both: { arc: -0.6 } }),
  confuso: dudooExpression({
    left: { look: [-0.7, -0.7], size: 1.05 },
    right: { look: [0.6, 0.6], size: 0.9, top: 0.2 },
  }),
} satisfies Record<string, DuDooExpression>;

export type DuDooMood = keyof typeof DUDOO_MOODS;

const resolve = (mood: DuDooMood | DuDooExpression) =>
  typeof mood === "string" ? DUDOO_MOODS[mood] : mood;

function eyeGeometry(side: "left" | "right", eye: DuDooEye, ex: DuDooExpression) {
  const { cx, cy } = EYES[side];
  const rx = EYE_RX * eye.size;
  const ry = EYE_RY * eye.size;
  const shut = eye.top + eye.bottom;
  const scale = shut > MAX_SHUT ? MAX_SHUT / shut : 1;
  const topY = cy - ry + eye.top * scale * 2 * ry;
  const bottomY = cy + ry - eye.bottom * scale * 2 * ry;

  // A pupila anda dentro do olho, sem encostar na borda.
  const pr = PUPIL_R * ex.pupil;
  const travel = Math.max(0, Math.min(rx, ry) - pr - 2.5);
  let [lx, ly] = eye.look ?? ex.look;
  const len = Math.hypot(lx, ly);
  if (len > 1) {
    lx /= len;
    ly /= len;
  }

  const closed = eye.arc !== undefined;
  // O olho fechado: uma curva da largura do olho, cortada no corpo.
  const w = rx * 0.78;
  const lift = (eye.arc ?? 0) * ry * 0.5;
  return {
    cx,
    cy,
    rx,
    ry,
    topY,
    bottomY,
    px: cx + lx * travel,
    py: cy + ly * travel,
    pr,
    pupil: !closed && shut < CLOSED,
    closed,
    arc: `M${cx - w},${cy + lift * 0.5}Q${cx},${cy - lift * 1.5} ${cx + w},${cy + lift * 0.5}`,
    stroke: 7.5 * eye.size,
  };
}

export interface DuDooFaceProps {
  /** Uma expressão do vocabulário (`"pensando"`) ou uma montada com `dudooExpression`. */
  mood?: DuDooMood | DuDooExpression;
  /** Altura em px; a largura sai da proporção do mascote. */
  size?: number;
  /** Cor do corpo. Padrão: `--dd-dudoo-body`, o marinho, nos dois temas. */
  color?: string;
  /** Cor da pupila. Padrão: a do corpo. A pupila é sempre escura. */
  pupil?: string;
  /**
   * O contorno, como no mascote invertido da marca: uma faixa por dentro da borda do D, que
   * aparece também no corte do olho fechado. Padrão: `--dd-dudoo-line`, transparente sobre
   * fundo claro e papel sobre fundo escuro.
   */
  line?: string;
  /**
   * O branco do olho, inteiro: o olho da direita sai da borda do D como um círculo. Padrão: a
   * cor do contorno; transparente, o furo mostra o fundo, como no mascote original.
   */
  sclera?: string;
  className?: string;
  style?: CSSProperties;
  /** O rótulo acessível; `""` para quando o DuDoo é só enfeite ao lado do nome dele. */
  title?: string;
}

/**
 * O mascote com expressão, para ilustração (estado vazio, cena, o DuDoo espiando) e para o
 * avatar. Escolhe as cores pelo fundo sozinho, pelos tokens `--dd-dudoo-*`.
 */
export function DuDooFace({
  mood = "neutro",
  size = 96,
  color = "var(--dd-dudoo-body, currentColor)",
  line = "var(--dd-dudoo-line, transparent)",
  pupil = color,
  sclera = line,
  className,
  style,
  title = "DuDoo",
}: DuDooFaceProps) {
  const id = useId().replace(/[^\w-]/g, "");
  const ex = resolve(mood);
  const eyes = (["left", "right"] as const).map((side) => ({
    side,
    eye: ex[side],
    g: eyeGeometry(side, ex[side], ex),
  }));
  const open = (side: string, child: ReactNode) => (
    <g key={side} clipPath={`url(#${id}-${side}-top)`}>
      <g clipPath={`url(#${id}-${side}-bottom)`}>{child}</g>
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      height={size}
      width={(size * VIEW.w) / VIEW.h}
      className={className}
      style={{ overflow: "visible", ...style }}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        {eyes.map(({ side, eye, g }) => (
          <g key={side}>
            {/* O que fica de olho aberto: entre as duas pálpebras e dentro da elipse. */}
            <clipPath id={`${id}-${side}-top`}>
              <rect
                x={g.cx - 80}
                y={g.topY}
                width={160}
                height={160}
                transform={`rotate(${eye.tilt} ${g.cx} ${g.topY})`}
              />
            </clipPath>
            <clipPath id={`${id}-${side}-bottom`}>
              <rect x={g.cx - 80} y={g.bottomY - 160} width={160} height={160} />
            </clipPath>
            <clipPath id={`${id}-${side}-ball`}>
              <ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} />
            </clipPath>
          </g>
        ))}
        <clipPath id={`${id}-d`}>
          <path d={BODY} />
        </clipPath>
        <mask id={`${id}-body`} maskUnits="userSpaceOnUse" x={-20} y={-20} width={160} height={170}>
          <path d={BODY} fill="#fff" />
          {eyes.map(({ side, g }) =>
            g.closed ? (
              <path
                key={side}
                d={g.arc}
                fill="none"
                stroke="#000"
                strokeWidth={g.stroke}
                strokeLinecap="round"
              />
            ) : (
              open(side, <ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} fill="#000" />)
            ),
          )}
        </mask>
      </defs>

      <g transform={ex.lean ? `rotate(${ex.lean} 57.2 62.65)` : undefined}>
        {eyes.map(
          ({ side, g }) =>
            !g.closed &&
            open(side, <ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} fill={sclera} />),
        )}
        {/* O fundo do contorno: aparece pelo corte do olho fechado e vira um traço claro. */}
        <path d={BODY} fill={line} />
        <path d={BODY} fill={color} mask={`url(#${id}-body)`} />
        {/* A faixa por dentro da borda. */}
        <path
          d={BODY}
          fill="none"
          stroke={line}
          strokeWidth={LINE * 2}
          clipPath={`url(#${id}-d)`}
        />
        {/* A pupila por último: perto da borda, ela passa por cima da faixa, que ali é olho. */}
        {eyes.map(
          ({ side, g }) =>
            g.pupil &&
            open(
              side,
              <g clipPath={`url(#${id}-${side}-ball)`}>
                <circle cx={g.px} cy={g.py} r={g.pr} fill={pupil} />
              </g>,
            ),
        )}
      </g>
    </svg>
  );
}

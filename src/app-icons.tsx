import { useId } from "react";
import type { LockupApp } from "./lockup.js";
import {
  LOCKUP_COMMERCE,
  LOCKUP_MARKETING,
  LOCKUP_PAGES,
  LOCKUP_SLIDES,
  LOCKUP_WORKS,
} from "./lockup-names.js";
import { BRAND } from "./theme.js";

/*
 * O ícone de cada app da suíte: o objeto do app com os olhos do DuDoo, num quadrado na cor do
 * app. É o que aparece no trilho de apps (`SuiteRail`) e onde um app aponta para outro. A regra
 * está em `docs/marca.md` ("O ícone de cada app"); a bancada para ver e baixar é a da marca
 * (`/marca.html`).
 *
 * Duas tintas, como o mascote:
 * - **Tinta escura** (fundo claro: limão, ciano, laranja, coral): o corpo cheio, o olho é um
 *   furo (mostra o fundo) e a pupila é tinta.
 * - **Tinta clara** (fundo escuro: o roxo, o neutro do trilho): o desenho inverso, como o
 *   `deckdoo-mark-inverse`. O corpo vira contorno, o branco do olho é pintado e sai da borda
 *   como um círculo inteiro, e a pupila é furo. A pupila nunca fica branca.
 */

/** Um pedaço do desenho, num quadro de 24 × 24. */
export type AppIconPiece =
  /** Corpo: cheio na tinta escura, contorno na clara. */
  | { kind: "body"; d: string }
  /** Traço (a alça da sacola, as abas da agenda): igual nas duas. */
  | { kind: "line"; d: string; w: number }
  /** Recorte no corpo (uma barra): furo na escura, traço na clara. */
  | { kind: "cut"; d: string; w: number }
  /** Furo cheio (um ponto): furo na escura, cheio na clara. */
  | { kind: "hole"; d: string };

/**
 * O desenho de um ícone: as peças e os olhos (os centros em x, a altura e o raio). Medidas do
 * mascote: o olho tem ~1/5 da largura do corpo e a pupila, ~2/5 do olho; o da direita passa da
 * borda. Nada ao lado dos olhos (vira orelha) nem embaixo deles (vira boca ou nariz).
 */
export interface AppIconShape {
  pieces: AppIconPiece[];
  eyes: [number, number];
  y: number;
  r: number;
}

/** Retângulo de cantos redondos como `path`, para desenhar peças. */
export function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const iw = w - 2 * r;
  const ih = h - 2 * r;
  return (
    `M${x + r} ${y}h${iw}a${r} ${r} 0 0 1 ${r} ${r}v${ih}a${r} ${r} 0 0 1 ${-r} ${r}` +
    `h${-iw}a${r} ${r} 0 0 1 ${-r} ${-r}v${-ih}a${r} ${r} 0 0 1 ${r} ${-r}z`
  );
}

const rr = roundedRectPath;

/** Os desenhos dos apps da suíte. */
export const APP_ICON_SHAPES = {
  /** Slides: o slide. */
  slides: {
    pieces: [{ kind: "body", d: rr(0.5, 3.5, 22, 16, 3.4) }],
    eyes: [8.8, 19],
    y: 10.6,
    r: 4.3,
  },
  /** Marketing: o marcador de salvar post. O recorte embaixo é a borda, não boca. */
  marketing: {
    pieces: [
      {
        kind: "body",
        d: "M4.3 0.5h15.4a2.8 2.8 0 0 1 2.8 2.8V23.5L12 17.4 1.5 23.5V3.3A2.8 2.8 0 0 1 4.3 0.5z",
      },
    ],
    eyes: [8.4, 19],
    y: 8.6,
    r: 3.9,
  },
  /** Pages: as seções da página, o menu fino em cima e o bloco grande com os olhos. */
  pages: {
    pieces: [
      { kind: "body", d: rr(0.5, 0.5, 22, 3.4, 1.7) },
      { kind: "body", d: rr(0.5, 6, 22, 17.5, 3.2) },
    ],
    eyes: [8.6, 19],
    y: 12.8,
    r: 4,
  },
  /** Works (o CRM): a agenda de contatos. */
  works: {
    pieces: [
      { kind: "body", d: rr(4, 0.5, 18, 23, 3) },
      { kind: "line", d: "M2.7 6.2h2M2.7 12h2M2.7 17.8h2", w: 2.4 },
    ],
    eyes: [10.4, 19.6],
    y: 9.4,
    r: 3.9,
  },
  /** Commerce: a sacola. */
  commerce: {
    pieces: [
      { kind: "body", d: "M3.5 8h17l-.9 13a2.6 2.6 0 0 1-2.6 2.5H7a2.6 2.6 0 0 1-2.6-2.5z" },
      { kind: "line", d: "M8 8.6V6.5a4 4 0 0 1 8 0v2.1", w: 2.2 },
    ],
    eyes: [9, 18.6],
    y: 15.2,
    r: 3.9,
  },
} satisfies Record<string, AppIconShape>;

/** Um app da suíte: o nome, a cor (o acento dele), o desenho do ícone e o lockup. */
export interface SuiteApp {
  /** O `slug` do serviço no control plane (`GET /api/me/services`). */
  slug: string;
  /** O nome curto, sem o "DeckDoo": vai na dica e no rótulo acessível. */
  name: string;
  /** A cor do quadrado, em hex: o acento do app. */
  color: string;
  shape: AppIconShape;
  lockup?: LockupApp;
}

export type SuiteAppSlug = keyof typeof APP_ICON_SHAPES;

/**
 * Os apps da suíte. Slides, Marketing e Pages estão no acento de cada um; Works e Commerce ainda
 * não têm acento decidido e saem numa cor provisória (laranja e coral).
 */
export const SUITE_APPS: Record<SuiteAppSlug, SuiteApp> = {
  slides: {
    slug: "slides",
    name: "Slides",
    color: BRAND.lime,
    shape: APP_ICON_SHAPES.slides,
    lockup: LOCKUP_SLIDES,
  },
  marketing: {
    slug: "marketing",
    name: "Marketing",
    color: BRAND.purple,
    shape: APP_ICON_SHAPES.marketing,
    lockup: LOCKUP_MARKETING,
  },
  pages: {
    slug: "pages",
    name: "Pages",
    color: BRAND.cyan,
    shape: APP_ICON_SHAPES.pages,
    lockup: LOCKUP_PAGES,
  },
  works: {
    slug: "works",
    name: "Works",
    color: BRAND.orange,
    shape: APP_ICON_SHAPES.works,
    lockup: LOCKUP_WORKS,
  },
  commerce: {
    slug: "commerce",
    name: "Commerce",
    color: BRAND.coral,
    shape: APP_ICON_SHAPES.commerce,
    lockup: LOCKUP_COMMERCE,
  },
};

/** O app da suíte pelo `slug`, ou `undefined` (um serviço externo, um app sem ícone ainda). */
export function suiteApp(slug: string): SuiteApp | undefined {
  return (SUITE_APPS as Record<string, SuiteApp | undefined>)[slug];
}

/** A tinta sobre a cor: marinho nas claras, papel nas escuras. */
function inkOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return BRAND.ink;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1]!.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
  return lum > 0.3 ? BRAND.ink : BRAND.paper;
}

/**
 * A espessura do contorno no desenho inverso. O `deckdoo-mark-inverse` tem ~1/10 do corpo (1,9
 * no quadro de 24); um pouco mais grosso, para o traço segurar em 28 px.
 */
const OUTLINE = 2.4;

/** O quadro do ícone: o quadrado de 100, cantos de 28 (os do `AppIcon`), o desenho em 70. */
const TILE = 100;
const TILE_RADIUS = 28;
const GLYPH = 70;

function Glyph({
  shape,
  inverse,
  maskId,
}: {
  shape: AppIconShape;
  inverse: boolean;
  maskId: string;
}) {
  const s = shape;
  // A pupila puxa um pouco para a direita e para cima: ele espia.
  const pupils = s.eyes.map((x) => ({ cx: x + s.r * 0.18, cy: s.y - s.r * 0.12, r: s.r * 0.42 }));
  return (
    <>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-3" y="-3" width="30" height="30">
        <rect x="-3" y="-3" width="30" height="30" fill="#fff" />
        {/* O que sai do corpo: na escura, os furos, os recortes e o olho; na clara, a pupila. */}
        {inverse
          ? pupils.map((p) => <circle key={p.cx} {...p} fill="#000" />)
          : s.pieces.map((piece, i) =>
              piece.kind === "hole" ? (
                <path key={i} d={piece.d} fill="#000" />
              ) : piece.kind === "cut" ? (
                <path key={i} d={piece.d} fill="none" stroke="#000" strokeWidth={piece.w} />
              ) : null,
            )}
        {!inverse && s.eyes.map((x) => <circle key={x} cx={x} cy={s.y} r={s.r} fill="#000" />)}
      </mask>
      <g
        mask={`url(#${maskId})`}
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {s.pieces.map((piece, i) => {
          if (piece.kind === "body")
            return inverse ? (
              <path key={i} d={piece.d} fill="none" strokeWidth={OUTLINE} />
            ) : (
              <path key={i} d={piece.d} stroke="none" />
            );
          if (piece.kind === "line")
            return <path key={i} d={piece.d} fill="none" strokeWidth={piece.w} />;
          if (!inverse) return null;
          // Na clara, o furo vira cheio e o recorte vira traço.
          return piece.kind === "hole" ? (
            <path key={i} d={piece.d} stroke="none" />
          ) : (
            <path key={i} d={piece.d} fill="none" strokeWidth={piece.w} />
          );
        })}
        {/* Na clara, o branco do olho pintado (a pupila sai pela máscara). */}
        {inverse && s.eyes.map((x) => <circle key={x} cx={x} cy={s.y} r={s.r} stroke="none" />)}
      </g>
      {!inverse && pupils.map((p) => <circle key={p.cx} {...p} fill="currentColor" />)}
    </>
  );
}

/**
 * O ícone de um app da suíte: o quadrado na cor do app com o objeto e os olhos do DuDoo. É um
 * `svg` só (o quadrado é um `rect`), então serve para salvar como arquivo.
 *
 * `app` é um `SuiteApp` (o de `SUITE_APPS`, ou um próprio) ou o `slug`. Um `slug` sem ícone
 * (um serviço externo) sai com a inicial do nome no quadrado neutro.
 *
 * `neutral`: o quadrado neutro e o desenho em cinza, no lugar da cor do app (o trilho pinta só o
 * app atual). Fundo e tinta vêm de `--dd-app-icon-neutral` e `--dd-app-icon-neutral-ink`; o
 * neutro é escuro, e o desenho é o inverso.
 */
export function SuiteAppIcon({
  app,
  size = 40,
  neutral = false,
  name,
  className,
}: {
  app: SuiteApp | string;
  size?: number;
  neutral?: boolean;
  /** O rótulo acessível. Padrão: o nome do app. `""` deixa o ícone decorativo. */
  name?: string;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const resolved = typeof app === "string" ? suiteApp(app) : app;
  const label = name ?? resolved?.name ?? (typeof app === "string" ? app : "");
  const decorative = label === "";
  const plain = neutral || !resolved;
  const ink = plain ? undefined : inkOn(resolved.color);
  const scale = GLYPH / 24;
  const offset = (TILE - GLYPH) / 2;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className ? `dd-app-mark ${className}` : "dd-app-mark"}
      data-neutral={plain || undefined}
      width={size}
      height={size}
      viewBox={`0 0 ${TILE} ${TILE}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      style={ink ? { color: ink } : undefined}
    >
      <rect
        className="dd-app-mark-tile"
        width={TILE}
        height={TILE}
        rx={TILE_RADIUS}
        fill={plain ? undefined : resolved.color}
      />
      {resolved ? (
        <g transform={`translate(${offset} ${offset}) scale(${scale})`}>
          <Glyph
            shape={resolved.shape}
            inverse={plain || ink !== BRAND.ink}
            maskId={`dd-app-mark-${id}`}
          />
        </g>
      ) : (
        <text
          x={TILE / 2}
          y={TILE / 2}
          dy="0.35em"
          textAnchor="middle"
          fontSize={46}
          fontWeight={600}
          fill="currentColor"
        >
          {label.trim().charAt(0).toUpperCase()}
        </text>
      )}
    </svg>
  );
}

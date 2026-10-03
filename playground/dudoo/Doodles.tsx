import type { ReactNode } from "react";
import {
  BRAND,
  DUDOO_MOODS,
  DuDooFace,
  curl,
  dudooExpression,
  sketch,
  sparkle,
  type DuDooExpression,
} from "@deckdoo/design";

/**
 * As cenas de exemplo do ateliê, feitas com o rabisco do pacote (`sketch`, `sparkle`, `curl`) e
 * o `DuDooFace`. São exemplo, não peça: cada app desenha as suas com as mesmas regras
 * (`docs/marca.md`).
 */

const INK = "var(--dd-ink)";
const STROKE = 2.4;

type Hand = ReturnType<typeof sketch>;

export function Scene({
  w = 260,
  h = 190,
  seed = 1,
  label,
  children,
}: {
  w?: number;
  h?: number;
  seed?: number;
  label: string;
  children: (h: Hand) => ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label={label}
      style={{ display: "block", overflow: "visible" }}
    >
      {children(sketch(seed))}
    </svg>
  );
}

function Line({ d, w = STROKE, color = INK }: { d: string; w?: number; color?: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Um slide: retângulo de canto mole, inclinado, com fundo para tapar o que está atrás. */
function Card({
  h,
  x,
  y,
  w,
  ht,
  rot = 0,
  children,
}: {
  h: Hand;
  x: number;
  y: number;
  w: number;
  ht: number;
  rot?: number;
  children?: ReactNode;
}) {
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + ht / 2})`}>
      <rect x={x + 1} y={y + 1} width={w - 2} height={ht - 2} rx={7} fill="var(--dd-surface)" />
      <Line d={h.rect(x, y, w, ht)} />
      {children}
    </g>
  );
}

/** O DuDoo dentro de uma cena: posição do canto de cima à esquerda e altura. */
function Dudoo({ x, y, size, e }: { x: number; y: number; size: number; e: DuDooExpression }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <DuDooFace size={size} mood={e} />
    </g>
  );
}

/* ——— O kit, peça por peça ——— */

export type KitKind = "laco" | "brilho" | "enfase" | "mancha" | "cartao" | "rabisco";

export function KitPiece({ kind }: { kind: KitKind }) {
  return (
    <Scene w={120} h={80} seed={kind.length * 7} label={kind}>
      {(h) => {
        switch (kind) {
          case "laco":
            return <Line d={curl(14, 48, 4, 1.25)} />;
          case "brilho":
            return (
              <>
                <path d={sparkle(48, 40, 18)} fill={INK} />
                <path d={sparkle(80, 26, 9)} fill={BRAND.lime} />
                <path d={sparkle(84, 56, 6)} fill={INK} />
              </>
            );
          case "enfase":
            return (
              <>
                <circle cx={60} cy={50} r={6} fill={INK} />
                <Line d={h.ticks(60, 50, -90, 12, 12, 32)} />
              </>
            );
          case "mancha":
            return (
              <>
                <path d={h.blob(40, 22, 52, 44)} fill={BRAND.lime} />
                <Line d={h.rect(30, 14, 50, 44, 8)} />
              </>
            );
          case "cartao":
            return (
              <Card h={h} x={28} y={14} w={64} ht={48} rot={-5}>
                <Line
                  d={h.lines(
                    [
                      [38, 28],
                      [66, 28],
                    ],
                    [
                      [38, 36],
                      [78, 36],
                    ],
                    [
                      [38, 44],
                      [58, 44],
                    ],
                  )}
                  w={2}
                />
              </Card>
            );
          case "rabisco":
            return <Line d="M14,52c10-18,18-24,24-12s10,14,18-4s12-20,20-6s10,12,18,2s8-10,12-4" />;
        }
      }}
    </Scene>
  );
}

/* ——— As cenas ——— */

/** Primeiro deck: o DuDoo olha, empolgado, para um slide em branco. */
export function SceneFirstDeck() {
  return (
    <Scene seed={11} label="O DuDoo olhando para um slide em branco">
      {(h) => (
        <>
          <path d={h.blob(122, 38, 112, 78)} fill={BRAND.lime} transform="rotate(-3 176 75)" />
          <Card h={h} x={110} y={28} w={112} ht={78} rot={-6}>
            <Line
              d={h.lines(
                [
                  [166, 56],
                  [166, 78],
                ],
                [
                  [155, 67],
                  [177, 67],
                ],
              )}
              w={3}
            />
          </Card>
          <path d={sparkle(238, 22, 9)} fill={INK} />
          <path d={sparkle(96, 26, 6)} fill={INK} />
          <Line d={curl(150, 150, 3, 1)} />
          <Line d={h.ticks(36, 80, -110, 4, 9, 30)} />
          <Dudoo
            x={22}
            y={88}
            size={82}
            e={dudooExpression({ look: [0.9, -0.55], pupil: 0.8, both: { size: 1.1 } })}
          />
        </>
      )}
    </Scene>
  );
}

/** Gerando: o DuDoo pensa e o laço monta os slides. */
export function SceneGenerating() {
  return (
    <Scene seed={23} label="O DuDoo pensando enquanto os slides se montam">
      {(h) => (
        <>
          <Card h={h} x={150} y={24} w={80} ht={56} rot={10} />
          <Card h={h} x={138} y={38} w={80} ht={56} rot={2} />
          <Card h={h} x={126} y={54} w={80} ht={56} rot={-7}>
            {/* O gráfico entrando: a mancha ainda pela metade. */}
            <path d={h.blob(140, 88, 34, 12, 4)} fill={BRAND.cyan} />
            <Line
              d={h.lines(
                [
                  [138, 70],
                  [172, 70],
                ],
                [
                  [138, 79],
                  [186, 79],
                ],
                [
                  [138, 94],
                  [194, 94],
                ],
              )}
              w={2}
            />
          </Card>
          {/* Sai da cabeça dele e vira laço até os slides. */}
          <Line d={`M84,70c6-26,18-36,32-30${curl(116, 40, 1, 1).replace(/^M[^c]+/, "")}`} />
          <Dudoo x={22} y={78} size={92} e={DUDOO_MOODS.pensando} />
        </>
      )}
    </Scene>
  );
}

/** Pronto: o DuDoo pisca, inclinado, com o deck feito ao lado. */
export function SceneDone() {
  return (
    <Scene seed={37} label="O DuDoo piscando ao lado de um deck pronto">
      {(h) => (
        <>
          <path d={h.blob(148, 54, 84, 64)} fill={BRAND.lime} transform="rotate(8 188 84)" />
          <Card h={h} x={138} y={44} w={84} ht={64} rot={4}>
            <Line
              d={h.poly([
                [164, 77],
                [174, 87],
                [194, 65],
              ])}
              w={3.2}
            />
          </Card>
          <Line
            d={h.lines(
              [
                [118, 30],
                [124, 22],
              ],
              [
                [132, 22],
                [134, 12],
              ],
              [
                [146, 30],
                [154, 24],
              ],
            )}
          />
          <path d={sparkle(232, 30, 10)} fill={INK} />
          <path d={sparkle(120, 132, 6)} fill={INK} />
          <path d={sparkle(244, 128, 6)} fill={BRAND.lime} />
          <Dudoo
            x={30}
            y={60}
            size={98}
            e={dudooExpression({ ...DUDOO_MOODS.piscada, lean: -8 })}
          />
        </>
      )}
    </Scene>
  );
}

/** Sem resultado: a lupa sobre a página vazia. Sem DuDoo: é a interface falando. */
export function SceneNoResults() {
  return (
    <Scene seed={41} label="Uma lupa sobre uma página vazia">
      {(h) => (
        <>
          <Card h={h} x={70} y={30} w={100} ht={124} rot={-4}>
            <Line
              d={h.lines(
                [
                  [86, 54],
                  [130, 54],
                ],
                [
                  [86, 66],
                  [152, 66],
                ],
                [
                  [86, 78],
                  [116, 78],
                ],
              )}
              w={2}
            />
          </Card>
          <path d={h.blob(146, 80, 60, 60, 26)} fill={BRAND.cyan} />
          <Line d={h.circle(170, 104, 30)} />
          <Line d={h.line([192, 126], [218, 152])} w={6} />
          <Line d={h.ticks(170, 104, -60, 38, 8, 26)} />
          <Line d={curl(28, 150, 2, 0.9)} />
        </>
      )}
    </Scene>
  );
}

/** Tudo em dia: a caixa aberta e vazia. Sem DuDoo. */
export function SceneAllClear() {
  return (
    <Scene seed={53} label="Uma caixa aberta e vazia">
      {(h) => (
        <>
          <path d={h.blob(90, 120, 98, 40, 4)} fill={BRAND.lime} />
          <Line
            d={h.poly([
              [84, 96],
              [180, 96],
              [180, 154],
              [84, 154],
              [84, 94],
            ])}
          />
          <Line
            d={h.poly([
              [84, 96],
              [58, 74],
              [82, 66],
              [108, 88],
            ])}
          />
          <Line
            d={h.poly([
              [180, 96],
              [206, 74],
              [182, 66],
              [156, 88],
            ])}
          />
          <Line
            d={h.lines(
              [
                [100, 140],
                [118, 140],
              ],
              [
                [150, 136],
                [164, 136],
              ],
              [
                [150, 142],
                [160, 142],
              ],
            )}
            w={2}
          />
          <Line d={curl(122, 74, 2, 1)} />
          <path d={sparkle(146, 34, 10)} fill={INK} />
          <path d={sparkle(212, 48, 6)} fill={INK} />
          <path d={sparkle(52, 44, 5)} fill={BRAND.lime} />
        </>
      )}
    </Scene>
  );
}

/** Sem acesso: o cadeado, sóbrio. Sem DuDoo, sem brilho, sem cor da paleta. */
export function SceneLocked() {
  return (
    <Scene seed={67} label="Um cadeado fechado">
      {(h) => (
        <>
          <path d={h.blob(105, 91, 60, 50, 9)} fill="var(--dd-sunken)" />
          <Line d="M110,86v-16a20,20 0 0 1 40,0v16" />
          <Line d={h.rect(100, 86, 60, 50, 9)} />
          <Line d={h.line([130, 104], [130, 116])} w={3.2} />
        </>
      )}
    </Scene>
  );
}

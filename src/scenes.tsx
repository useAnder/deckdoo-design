import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  DUDOO_MOODS,
  DuDooFace,
  dudooExpression,
  type DuDooExpression,
  type DuDooMood,
} from "./dudoo.js";
import { curl, sketch, sparkle } from "./sketch.js";

/**
 * As cenas da suíte, em rabisco: as peças para desenhar uma (`Scene`, `SceneLine`,
 * `SceneCard`, `SceneDuDoo`) e as prontas que todo app usa (estado vazio, busca sem resultado,
 * tudo em dia, sem acesso, gerando, pronto). Receita e regras em `docs/ilustracao.md`.
 *
 * Tudo sai dos tokens: o traço é `--dd-ink`, o fundo dos cartões é `--dd-surface`, a mancha é o
 * acento do app (`color` troca) e o DuDoo escolhe as cores pelo fundo. Funciona nos dois temas
 * sem fazer nada.
 */

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

const INK = "var(--dd-ink)";
const ACCENT = "var(--dd-accent)";

/** O traço padrão; detalhe (linha de texto) vai a 2, ênfase (visto, "+") a 3. */
export const SCENE_STROKE = 2.4;

export type Sketch = ReturnType<typeof sketch>;

/* ——— As peças ——— */

/**
 * A moldura de uma cena: um SVG de 260 × 190 (por padrão) que ocupa a largura do pai. O
 * `children` recebe o lápis (`sketch(seed)`); mesma semente, mesmo desenho.
 */
export function Scene({
  label,
  w = 260,
  h = 190,
  seed = 1,
  children,
}: {
  /** O que a cena mostra, para leitor de tela ("Uma caixa aberta e vazia"). */
  label: string;
  w?: number;
  h?: number;
  seed?: number;
  children: (s: Sketch) => ReactNode;
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

/** Um traço em tinta, de ponta redonda. */
export function SceneLine({
  d,
  width = SCENE_STROKE,
  color = INK,
}: {
  d: string;
  width?: number;
  color?: string;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/**
 * O cartão: o slide, a página, o objeto da suíte. Retângulo à mão, inclinado, com fundo de
 * painel para tapar o que estiver atrás (a mancha, outro cartão).
 */
export function SceneCard({
  s,
  x,
  y,
  w,
  h,
  rot = 0,
  children,
}: {
  s: Sketch;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  children?: ReactNode;
}) {
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}>
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={7} fill="var(--dd-surface)" />
      <SceneLine d={s.rect(x, y, w, h)} />
      {children}
    </g>
  );
}

/**
 * O rosto do DuDoo nas cenas. Quem anima a cena troca o `DuDooFace` parado por um que se mexe
 * (chega neutro e, assentado, faz a cara da cena); sem nada, é o desenho parado.
 */
export const SceneDuDooFace = createContext<ComponentType<{
  mood: DuDooMood | DuDooExpression;
  size: number;
}> | null>(null);

/** O DuDoo dentro da cena: o canto de cima à esquerda e a altura. Em tinta, ou contorno no escuro. */
export function SceneDuDoo({
  x,
  y,
  size,
  mood = "neutro",
}: {
  x: number;
  y: number;
  size: number;
  mood?: DuDooMood | DuDooExpression;
}) {
  const Face = useContext(SceneDuDooFace);
  return (
    <g transform={`translate(${x} ${y})`}>
      {Face ? <Face size={size} mood={mood} /> : <DuDooFace size={size} mood={mood} title="" />}
    </g>
  );
}

/* ——— Os objetos do estado vazio ——— */

/**
 * O objeto da cena: o que falta na tela vazia ("Nenhum arquivo ainda" é `"arquivo"`), o que o
 * DuDoo está montando (`SceneGenerating`) e o que ficou pronto (`SceneDone`).
 *
 * Da suíte toda: `slide`, `arquivo`, `pasta`, `lista`, `grafico`, `mensagem`. Do site (Pages):
 * `site`. Das redes (Marketing): `post`, `carrossel`. Do planejamento e da agenda (Marketing e
 * CRM): `calendario`. Do funil de vendas (CRM): `funil`.
 */
export type SceneObject =
  | "slide"
  | "arquivo"
  | "pasta"
  | "lista"
  | "grafico"
  | "mensagem"
  | "site"
  | "post"
  | "carrossel"
  | "calendario"
  | "funil";

/** Largura e altura de cada objeto; o que não está aqui é paisagem, 112 × 78. */
const SIZE: Partial<Record<SceneObject, [number, number]>> = {
  arquivo: [82, 104],
  post: [84, 100],
  calendario: [104, 88],
  funil: [112, 84],
};
const sizeOf = (kind: SceneObject) => SIZE[kind] ?? [112, 78];

/** A caixa da mancha atrás do objeto: deslocada dele, e só onde ele tem corpo (o funil afina). */
function blobBox(kind: SceneObject, x: number, y: number, w: number, h: number) {
  if (kind === "funil") return [x + 12, y + 8, w - 8, h * 0.6] as const;
  // Só atrás dos cards: as bolinhas ficam no papel.
  if (kind === "carrossel") return [x + 10, y + 12, w, h * 0.72] as const;
  return [x + 10, y + 9, w, h] as const;
}

/** Empolgado, olhando para o objeto em cima, à direita. */
const LOOKING_UP = dudooExpression({ look: [0.9, -0.55], pupil: 0.8, both: { size: 1.1 } });

/**
 * O trabalho no objeto: a cor dele (a mancha que entra) e se está se fazendo (`loop`, a espera)
 * ou pronto. Sem trabalho, o objeto é o do estado vazio.
 */
interface Work {
  color: string;
  loop: boolean;
}

interface ObjectProps {
  s: Sketch;
  kind: SceneObject;
  x: number;
  y: number;
  w: number;
  h: number;
  work?: Work;
}

/** O trabalho entrando no objeto: em loop na espera, parado no pronto. */
function Doing({ work, children }: { work: Work; children: ReactNode }) {
  return work.loop ? <g data-dd-draw="loop">{children}</g> : <>{children}</>;
}

/** O coração da curtida, à mão: fecha passando um tico do ponto. Para traço. */
function heart(cx: number, cy: number, r: number) {
  return `M${cx},${cy + r}C${cx - r * 1.9},${cy - r * 0.1} ${cx - r * 0.9},${cy - r * 1.6} ${cx},${cy - r * 0.45}C${cx + r * 0.9},${cy - r * 1.6} ${cx + r * 1.9},${cy - r * 0.1} ${cx + r * 0.25},${cy + r * 1.1}`;
}

/* As folhas dos objetos que não são cartão: papel e contorno, na ordem em que a mão desenha. */

function filePaper(s: Sketch, x: number, y: number, w: number, h: number) {
  const k = 16;
  const outline: [number, number][] = [
    [x, y],
    [x + w - k, y],
    [x + w, y + k],
    [x + w, y + h],
    [x, y + h],
    [x, y - 1],
  ];
  return (
    <>
      <path d={`M${outline.map((p) => p.join(",")).join("L")}Z`} fill="var(--dd-surface)" />
      <SceneLine d={s.poly(outline)} />
      <SceneLine
        d={s.poly([
          [x + w - k, y],
          [x + w - k, y + k],
          [x + w, y + k],
        ])}
      />
    </>
  );
}

function folderPaper(s: Sketch, x: number, y: number, w: number, h: number) {
  const tab: [number, number][] = [
    [x, y + 12],
    [x, y],
    [x + w * 0.36, y],
    [x + w * 0.44, y + 12],
  ];
  return (
    <>
      <path
        d={`M${x},${y}h${w * 0.36}l${w * 0.08},12h${w * 0.56}v${h - 12}h${-w}Z`}
        fill="var(--dd-surface)"
      />
      <SceneLine d={s.poly(tab)} />
      <SceneLine d={s.rect(x, y + 12, w, h - 12, 6)} />
    </>
  );
}

function bubblePaper(s: Sketch, x: number, y: number, w: number, h: number) {
  return (
    <>
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 14} rx={7} fill="var(--dd-surface)" />
      <SceneLine d={s.rect(x, y, w, h - 14, 10)} />
      <SceneLine
        d={s.poly([
          [x + 22, y + h - 14],
          [x + 18, y + h],
          [x + 38, y + h - 14],
        ])}
      />
    </>
  );
}

/** O site: a janela do navegador (a barra e as três bolinhas) com a página dentro. */
function SiteArt({ s, x, y, w, h, work }: ObjectProps) {
  const bar = y + 16;
  const img = { x: x + w - 42, y: bar + 11, w: 28, h: h - 38 };
  const page = (
    <>
      {work && <path d={s.blob(img.x + 3, img.y + 3, img.w - 6, img.h - 6, 5)} fill={work.color} />}
      <SceneLine d={s.rect(img.x, img.y, img.w, img.h, 5)} width={2} />
      <SceneLine d={s.line([x + 14, bar + 17], [x + w * 0.56, bar + 17])} width={3} />
      <SceneLine d={s.line([x + 14, bar + 28], [x + w * 0.46, bar + 28])} width={2} />
      <SceneLine d={s.rect(x + 14, bar + 38, 30, 12, 6)} width={2} />
    </>
  );
  return (
    <SceneCard s={s} x={x} y={y} w={w} h={h}>
      <SceneLine d={s.line([x, bar], [x + w, bar])} width={2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 11 + i * 8} cy={y + 8.5} r={2.2} fill={INK} />
      ))}
      {work ? <Doing work={work}>{page}</Doing> : page}
    </SceneCard>
  );
}

/** O post: a imagem (o sol e o morro), a curtida e a legenda. */
function PostArt({ s, x, y, w, h, work }: ObjectProps) {
  const f = { x: x + 8, y: y + 8, w: w - 16, h: h * 0.54 };
  const base = f.y + f.h;
  const [like, caption] = [y + h * 0.75, y + h * 0.87];
  const post = (
    <>
      {work && <path d={s.blob(f.x + 3, f.y + 3, f.w - 6, f.h - 6, 5)} fill={work.color} />}
      <SceneLine d={s.rect(f.x, f.y, f.w, f.h, 5)} width={2} />
      <SceneLine d={s.circle(f.x + f.w - 13, f.y + 13, 5)} width={2} />
      <SceneLine
        d={s.poly([
          [f.x + 4, base - 5],
          [f.x + f.w * 0.32, f.y + f.h * 0.45],
          [f.x + f.w * 0.54, f.y + f.h * 0.72],
          [f.x + f.w * 0.7, f.y + f.h * 0.56],
          [f.x + f.w - 4, base - 6],
        ])}
        width={2}
      />
      <SceneLine d={heart(x + 15, like, 4.5)} width={2} />
      <SceneLine
        d={s.lines(
          [
            [x + 27, like],
            [x + w - 12, like],
          ],
          [
            [x + 11, caption],
            [x + w - 28, caption],
          ],
        )}
        width={2}
      />
    </>
  );
  return (
    <SceneCard s={s} x={x} y={y} w={w} h={h}>
      {work ? <Doing work={work}>{post}</Doing> : post}
    </SceneCard>
  );
}

/** O carrossel: o card da frente entre os dois vizinhos, e as bolinhas de onde você está. */
function CarouselArt({ s, x, y, w, h, work }: ObjectProps) {
  const side = Math.round(h * 0.6);
  const c = Math.round(h * 0.8);
  const fx = x + (w - c) / 2;
  const dots = y + h - 4;
  const mid = x + w / 2;
  const front = (
    <>
      {work && <path d={s.blob(fx + 7, y + 9, c - 20, 14, 4)} fill={work.color} />}
      <SceneLine d={s.line([fx + 10, y + 16], [fx + c - 16, y + 16])} width={3} />
      <SceneLine
        d={s.lines(
          [
            [fx + 10, y + 31],
            [fx + c - 10, y + 31],
          ],
          [
            [fx + 10, y + 42],
            [fx + c - 24, y + 42],
          ],
        )}
        width={2}
      />
    </>
  );
  const next = (
    <SceneLine d={`${s.circle(mid, dots, 2.4)}${s.circle(mid + 9, dots, 2.4)}`} width={1.8} />
  );
  return (
    <g>
      <SceneCard s={s} x={x} y={y + (c - side) / 2} w={side} h={side} rot={-5} />
      <SceneCard s={s} x={x + w - side} y={y + (c - side) / 2} w={side} h={side} rot={5} />
      <SceneCard s={s} x={fx} y={y} w={c} h={c}>
        {work ? <Doing work={work}>{front}</Doing> : front}
      </SceneCard>
      <circle cx={mid - 9} cy={dots} r={2.6} fill={INK} />
      {work ? <Doing work={work}>{next}</Doing> : next}
    </g>
  );
}

/**
 * O calendário: as argolas, o cabeçalho e a grade da semana. Com trabalho, os dias ganham post
 * (a cor e a linha): o planejamento, a agenda.
 */
function CalendarArt({ s, x, y, w, h, work }: ObjectProps) {
  const top = y + 22;
  const cw = w / 4;
  const ch = (h - 22) / 3;
  const days: [number, number][] = [
    [0, 0],
    [2, 0],
    [1, 1],
    [3, 1],
    [2, 2],
  ];
  return (
    <SceneCard s={s} x={x} y={y} w={w} h={h}>
      <SceneLine
        d={s.lines(
          [
            [x + 24, y - 7],
            [x + 24, y + 9],
          ],
          [
            [x + w - 24, y - 7],
            [x + w - 24, y + 9],
          ],
        )}
        width={3}
      />
      <SceneLine d={s.line([x, top], [x + w, top])} width={2} />
      <SceneLine
        d={s.lines(
          [
            [x + 4, top + ch],
            [x + w - 4, top + ch],
          ],
          [
            [x + 4, top + 2 * ch],
            [x + w - 4, top + 2 * ch],
          ],
          ...[1, 2, 3].map((i): [[number, number], [number, number]] => [
            [x + i * cw, top + 4],
            [x + i * cw, y + h - 4],
          ]),
        )}
        width={2}
      />
      {work && (
        <Doing work={work}>
          {days.map(([c, r]) => (
            <path
              key={`${c}${r}`}
              d={s.blob(x + c * cw + 4, top + r * ch + 4, cw - 8, ch - 8, 4)}
              fill={work.color}
            />
          ))}
          <SceneLine
            d={s.lines(
              ...days.map(([c, r]): [[number, number], [number, number]] => [
                [x + c * cw + 7, top + r * ch + ch / 2],
                [x + c * cw + cw - 8, top + r * ch + ch / 2],
              ]),
            )}
            width={2}
          />
        </Doing>
      )}
    </SceneCard>
  );
}

/**
 * O funil de vendas: a boca larga, as etapas e o bico. Com trabalho, os contatos entram por cima
 * e o negócio sai por baixo.
 */
function FunnelArt({ s, x, y, w, h, work }: ObjectProps) {
  const neck = w * 0.12;
  const mid = x + w / 2;
  const cone = y + h * 0.62;
  const outline: [number, number][] = [
    [x, y],
    [x + w, y],
    [mid + neck, cone],
    [mid + neck, y + h],
    [mid - neck, y + h],
    [mid - neck, cone],
    [x, y - 1],
  ];
  /** A largura do funil numa altura: `f` de 0 (a boca) a 1 (o começo do bico). */
  const band = (f: number): [[number, number], [number, number]] => {
    const half = w / 2 - f * (w / 2 - neck);
    const by = y + f * (cone - y);
    return [
      [mid - half + 4, by],
      [mid + half - 4, by],
    ];
  };
  return (
    <g>
      <path d={`M${outline.map((p) => p.join(",")).join("L")}Z`} fill="var(--dd-surface)" />
      <SceneLine d={s.poly(outline)} />
      <SceneLine d={s.lines(band(0.34), band(0.68))} width={2} />
      {work && (
        <Doing work={work}>
          <path
            d={s.blob(x + w * 0.17, y + 5, w * 0.66, (cone - y) * 0.34 - 9, 5)}
            fill={work.color}
          />
          <SceneLine
            d={`${s.circle(mid - 24, y - 13, 4)}${s.circle(mid + 2, y - 21, 4)}${s.circle(mid + 26, y - 11, 4)}`}
            width={2}
          />
          <SceneLine d={s.circle(mid, y + h + 10, 4)} width={2} />
        </Doing>
      )}
    </g>
  );
}

/** Os objetos de sempre com trabalho: a cor entra como marca-texto, gráfico, rótulo. */
function ClassicWork({ s, kind, x, y, w, h, work }: ObjectProps & { work: Work }) {
  /** O marca-texto atrás de uma linha de texto. */
  const mark = (x1: number, ly: number, len: number) => (
    <path d={s.blob(x1 - 4, ly - 6, len + 8, 12, 4)} fill={work.color} />
  );
  switch (kind) {
    case "slide":
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          <Doing work={work}>
            <path d={s.blob(x + 16, y + h - 34, w * 0.34, 15, 4)} fill={work.color} />
            <SceneLine
              d={s.lines(
                [
                  [x + 14, y + 18],
                  [x + w * 0.5, y + 18],
                ],
                [
                  [x + 14, y + 30],
                  [x + w * 0.66, y + 30],
                ],
                [
                  [x + 14, y + h - 26],
                  [x + w - 16, y + h - 26],
                ],
              )}
              width={2}
            />
          </Doing>
        </SceneCard>
      );
    case "arquivo":
      return (
        <g>
          {filePaper(s, x, y, w, h)}
          <Doing work={work}>
            {mark(x + 14, y + 34, w - 36)}
            <SceneLine
              d={s.lines(
                [
                  [x + 14, y + 34],
                  [x + w - 22, y + 34],
                ],
                [
                  [x + 14, y + 46],
                  [x + w - 14, y + 46],
                ],
                [
                  [x + 14, y + 58],
                  [x + w - 34, y + 58],
                ],
              )}
              width={2}
            />
          </Doing>
        </g>
      );
    case "pasta":
      return (
        <g>
          {folderPaper(s, x, y, w, h)}
          <Doing work={work}>
            <path d={s.blob(x + w * 0.3, y + h * 0.42, w * 0.4, 20, 5)} fill={work.color} />
            <SceneLine
              d={s.line([x + w * 0.36, y + h * 0.42 + 10], [x + w * 0.62, y + h * 0.42 + 10])}
              width={2}
            />
          </Doing>
        </g>
      );
    case "lista":
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          <Doing work={work}>
            {mark(x + 32, y + 18, w - 50)}
            {[0, 1, 2].map((i) => {
              const ry = y + 18 + i * ((h - 30) / 2);
              return (
                <g key={i}>
                  <SceneLine d={s.circle(x + 18, ry, 5)} width={2} />
                  <SceneLine d={s.line([x + 32, ry], [x + w - 18 - (i % 2) * 22, ry])} width={2} />
                </g>
              );
            })}
          </Doing>
        </SceneCard>
      );
    case "grafico": {
      const bars = [0.45, 0.7, 0.3, 0.85].map((v, i): [[number, number], [number, number]] => {
        const bx = x + 22 + i * ((w - 44) / 3);
        return [
          [bx, y + h - 14],
          [bx, y + h - 14 - v * (h - 30)],
        ];
      });
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          <SceneLine d={s.line([x + 12, y + h - 14], [x + w - 12, y + h - 14])} width={2} />
          <Doing work={work}>
            <SceneLine d={s.lines(...bars.slice(0, 3))} width={6} />
            <SceneLine d={s.line(...bars[3]!)} width={6} color={work.color} />
          </Doing>
        </SceneCard>
      );
    }
    case "mensagem":
      return (
        <g>
          {bubblePaper(s, x, y, w, h)}
          <Doing work={work}>
            {mark(x + 16, y + 22, w - 38)}
            <SceneLine
              d={s.lines(
                [
                  [x + 16, y + 22],
                  [x + w - 22, y + 22],
                ],
                [
                  [x + 16, y + 36],
                  [x + w - 40, y + 36],
                ],
              )}
              width={2}
            />
          </Doing>
        </g>
      );
    default:
      // Os objetos novos desenham o próprio trabalho (`ObjectArt`).
      return null;
  }
}

function ObjectArt(props: ObjectProps) {
  const { s, kind, x, y, w, h, work } = props;
  switch (kind) {
    case "site":
      return <SiteArt {...props} />;
    case "post":
      return <PostArt {...props} />;
    case "carrossel":
      return <CarouselArt {...props} />;
    case "calendario":
      return <CalendarArt {...props} />;
    case "funil":
      return <FunnelArt {...props} />;
  }
  if (work) return <ClassicWork {...props} work={work} />;
  switch (kind) {
    case "slide":
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          <SceneLine
            d={s.lines(
              [
                [x + w / 2, y + h / 2 - 11],
                [x + w / 2, y + h / 2 + 11],
              ],
              [
                [x + w / 2 - 11, y + h / 2],
                [x + w / 2 + 11, y + h / 2],
              ],
            )}
            width={3}
          />
        </SceneCard>
      );
    case "arquivo":
      return (
        <g>
          {filePaper(s, x, y, w, h)}
          <SceneLine
            d={s.lines(
              [
                [x + 14, y + 34],
                [x + w - 22, y + 34],
              ],
              [
                [x + 14, y + 46],
                [x + w - 14, y + 46],
              ],
              [
                [x + 14, y + 58],
                [x + w - 34, y + 58],
              ],
            )}
            width={2}
          />
        </g>
      );
    case "pasta":
      return <g>{folderPaper(s, x, y, w, h)}</g>;
    case "lista":
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          {[0, 1, 2].map((i) => {
            const ry = y + 18 + i * ((h - 30) / 2);
            return (
              <g key={i}>
                <SceneLine d={s.circle(x + 18, ry, 5)} width={2} />
                <SceneLine d={s.line([x + 32, ry], [x + w - 18 - (i % 2) * 22, ry])} width={2} />
              </g>
            );
          })}
        </SceneCard>
      );
    case "grafico":
      return (
        <SceneCard s={s} x={x} y={y} w={w} h={h}>
          <SceneLine
            d={s.lines(
              ...[0.45, 0.7, 0.3, 0.85].map((v, i): [[number, number], [number, number]] => {
                const bx = x + 22 + i * ((w - 44) / 3);
                return [
                  [bx, y + h - 14],
                  [bx, y + h - 14 - v * (h - 30)],
                ];
              }),
            )}
            width={6}
          />
          <SceneLine d={s.line([x + 12, y + h - 14], [x + w - 12, y + h - 14])} width={2} />
        </SceneCard>
      );
    case "mensagem":
      return (
        <g>
          {bubblePaper(s, x, y, w, h)}
          <SceneLine
            d={s.lines(
              [
                [x + 16, y + 22],
                [x + w - 22, y + 22],
              ],
              [
                [x + 16, y + 36],
                [x + w - 40, y + 36],
              ],
            )}
            width={2}
          />
        </g>
      );
  }
}

/* ——— As cenas prontas ——— */

interface SceneProps {
  /** A cor da mancha. Padrão: o acento do app. Uma cor da paleta por cena. */
  color?: string;
}

/**
 * Nada aqui ainda: o objeto que falta, com a mancha de cor. Com `dudoo`, ele aparece olhando,
 * empolgado, para o objeto: só quando a ação da tela é dele ("Gerar com IA"). Sem, a cena é da
 * interface.
 */
export function SceneEmpty({
  object = "slide",
  dudoo = false,
  color = ACCENT,
  label,
}: SceneProps & { object?: SceneObject; dudoo?: boolean; label?: string }) {
  const [w, h] = sizeOf(object);
  const [ocx, ocy] = dudoo ? [170, 72] : [130, 84];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const rot = dudoo ? -6 : -4;
  return (
    <Scene seed={11} label={label ?? "Nada aqui ainda"}>
      {(s) => (
        <>
          <path
            d={s.blob(...blobBox(object, x, y, w, h))}
            fill={color}
            transform={`rotate(-3 ${ocx} ${ocy})`}
          />
          <g transform={`rotate(${rot} ${ocx} ${ocy})`}>
            <ObjectArt s={s} kind={object} x={x} y={y} w={w} h={h} />
          </g>
          <path d={sparkle(x + w + 14, y - 8, 9)} fill={INK} />
          <path d={sparkle(x - 12, y - 4, 6)} fill={dudoo ? INK : color} />
          {dudoo ? (
            <>
              <SceneLine d={curl(150, 150, 3, 1)} />
              {/* A empolgação dele: quem anima a cena desenha isto depois que ele chega. */}
              <g data-dd-draw="dudoo">
                <SceneLine d={s.ticks(36, 80, -110, 4, 9, 30)} />
              </g>
              <SceneDuDoo x={22} y={88} size={82} mood={LOOKING_UP} />
            </>
          ) : (
            <>
              <SceneLine d={curl(x - 46, y + h + 18, 2, 0.9)} />
              <SceneLine d={s.ticks(x + w + 6, y + h + 4, 20, 6, 8, 30)} />
            </>
          )}
        </>
      )}
    </Scene>
  );
}

/** O que o DuDoo monta, para o leitor de tela: enquanto "o site se monta", com "o site pronto". */
const WORK_LABEL: Record<SceneObject, { making: string; done: string }> = {
  slide: { making: "os slides se montam", done: "os slides prontos" },
  arquivo: { making: "o texto se escreve", done: "o texto pronto" },
  pasta: { making: "a pasta se organiza", done: "a pasta organizada" },
  lista: { making: "a lista se organiza", done: "a lista pronta" },
  grafico: { making: "o relatório se monta", done: "o relatório pronto" },
  mensagem: { making: "a resposta se escreve", done: "a resposta pronta" },
  site: { making: "o site se monta", done: "o site pronto" },
  post: { making: "os posts se montam", done: "os posts prontos" },
  carrossel: { making: "o carrossel se monta", done: "o carrossel pronto" },
  calendario: { making: "o planejamento se monta", done: "o planejamento pronto" },
  funil: { making: "o funil se organiza", done: "o funil organizado" },
};

/** Quantas cópias atrás do objeto que se monta: os posts são vários, o funil é um só. */
const STACK: Partial<Record<SceneObject, number>> = {
  arquivo: 2,
  post: 2,
  site: 1,
  lista: 1,
  grafico: 1,
};

/** O pensamento: sai da cabeça do DuDoo e vira laço até o que se monta. */
const THOUGHT = `M84,70c6-26,18-36,32-30${curl(116, 40, 1, 1).replace(/^M[^c]+/, "")}`;

/**
 * Gerando: o DuDoo pensa e o laço monta o trabalho. Para a espera de uma ação dele. `object`
 * diz o que se monta (padrão: os slides): `"site"` é "Criando o site", `"calendario"` é "Fazendo
 * o planejamento".
 */
export function SceneGenerating({
  object = "slide",
  color = ACCENT,
}: SceneProps & { object?: SceneObject }) {
  if (object !== "slide") return <GeneratingObject object={object} color={color} />;
  return (
    <Scene seed={23} label="O DuDoo pensando enquanto os slides se montam">
      {(s) => (
        <>
          <SceneCard s={s} x={150} y={24} w={80} h={56} rot={10} />
          <SceneCard s={s} x={138} y={38} w={80} h={56} rot={2} />
          <SceneCard s={s} x={126} y={54} w={80} h={56} rot={-7}>
            {/* O slide se montando. Quem anima a cena desenha este grupo em loop. */}
            <g data-dd-draw="loop">
              {/* O gráfico entrando: a mancha ainda pela metade. */}
              <path d={s.blob(140, 88, 34, 12, 4)} fill={color} />
              <SceneLine
                d={s.lines(
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
                width={2}
              />
            </g>
          </SceneCard>
          {/* Sai da cabeça dele e vira laço até os slides. */}
          <SceneLine d={THOUGHT} />
          <SceneDuDoo x={22} y={78} size={92} mood="pensando" />
        </>
      )}
    </Scene>
  );
}

function GeneratingObject({ object, color }: { object: SceneObject; color: string }) {
  const [w, h] = sizeOf(object);
  // O alto do objeto fica logo abaixo do laço; o mais alto desce.
  const [ocx, ocy] = [180, 84 + (h - 78) / 2];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const stack = STACK[object] ?? 0;
  return (
    <Scene seed={23} label={`O DuDoo pensando enquanto ${WORK_LABEL[object].making}`}>
      {(s) => (
        <>
          {Array.from({ length: stack }, (_, i) => stack - i).map((k) => (
            <SceneCard key={k} s={s} x={x + 12 * k} y={y - 12 * k} w={w} h={h} rot={-6 + 8 * k} />
          ))}
          {/* O trabalho se montando: quem anima a cena desenha a parte dele em loop. */}
          <g transform={`rotate(-6 ${ocx} ${ocy})`}>
            <ObjectArt s={s} kind={object} x={x} y={y} w={w} h={h} work={{ color, loop: true }} />
          </g>
          <SceneLine d={THOUGHT} />
          <SceneDuDoo x={22} y={78} size={92} mood="pensando" />
        </>
      )}
    </Scene>
  );
}

/**
 * Pronto: o DuDoo pisca, inclinado, com o trabalho feito ao lado. Para o marco. Sem `object`, o
 * trabalho é o cartão com o visto; com, é o objeto pronto com o selo ("Pronto: 5 seções" é
 * `"site"`).
 */
export function SceneDone({ object, color = ACCENT }: SceneProps & { object?: SceneObject }) {
  if (object) return <DoneObject object={object} color={color} />;
  return (
    <Scene seed={37} label="O DuDoo piscando ao lado do trabalho pronto">
      {(s) => (
        <>
          <path d={s.blob(148, 54, 84, 64)} fill={color} transform="rotate(8 188 84)" />
          <SceneCard s={s} x={138} y={44} w={84} h={64} rot={4}>
            <SceneLine
              d={s.poly([
                [164, 77],
                [174, 87],
                [194, 65],
              ])}
              width={3.2}
            />
          </SceneCard>
          <SceneLine
            d={s.lines(
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
          <path d={sparkle(244, 128, 6)} fill={color} />
          <SceneDuDoo x={30} y={60} size={98} mood={{ ...DUDOO_MOODS.piscada, lean: -8 }} />
        </>
      )}
    </Scene>
  );
}

function DoneObject({ object, color }: { object: SceneObject; color: string }) {
  const [w, h] = sizeOf(object);
  const [ocx, ocy] = [180, 82];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  /** O selo de pronto, no canto de baixo do objeto. */
  const [bx, by, br] = [x + w - 4, y + h - 2, 14];
  return (
    <Scene seed={37} label={`O DuDoo piscando, com ${WORK_LABEL[object].done} ao lado`}>
      {(s) => (
        <>
          <path
            d={s.blob(...blobBox(object, x, y, w, h))}
            fill={color}
            transform={`rotate(6 ${ocx} ${ocy})`}
          />
          <g transform={`rotate(4 ${ocx} ${ocy})`}>
            <ObjectArt s={s} kind={object} x={x} y={y} w={w} h={h} work={{ color, loop: false }} />
            <circle cx={bx} cy={by} r={br - 1} fill="var(--dd-surface)" />
            <SceneLine d={s.circle(bx, by, br)} />
            <SceneLine
              d={s.poly([
                [bx - 6, by],
                [bx - 1.5, by + 4.5],
                [bx + 6.5, by - 5],
              ])}
              width={3}
            />
          </g>
          <SceneLine
            d={s.lines(
              [
                [x - 20, y - 12],
                [x - 14, y - 20],
              ],
              [
                [x - 6, y - 20],
                [x - 4, y - 30],
              ],
              [
                [x + 8, y - 12],
                [x + 16, y - 18],
              ],
            )}
          />
          <path d={sparkle(x + w + 4, y - 12, 10)} fill={INK} />
          <path d={sparkle(120, 140, 6)} fill={INK} />
          <SceneDuDoo x={30} y={60} size={98} mood={{ ...DUDOO_MOODS.piscada, lean: -8 }} />
        </>
      )}
    </Scene>
  );
}

/** Busca sem resultado: a lupa sobre a página vazia. Sem DuDoo: é a interface falando. */
export function SceneNoResults({ color = ACCENT }: SceneProps) {
  return (
    <Scene seed={41} label="Uma lupa sobre uma página vazia">
      {(s) => (
        <>
          <SceneCard s={s} x={70} y={30} w={100} h={124} rot={-4}>
            <SceneLine
              d={s.lines(
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
              width={2}
            />
          </SceneCard>
          <path d={s.blob(146, 80, 60, 60, 26)} fill={color} />
          <SceneLine d={s.circle(170, 104, 30)} />
          <SceneLine d={s.line([192, 126], [218, 152])} width={6} />
          <SceneLine d={s.ticks(170, 104, -60, 38, 8, 26)} />
          <SceneLine d={curl(28, 150, 2, 0.9)} />
        </>
      )}
    </Scene>
  );
}

/** Tudo em dia: a caixa aberta e vazia. Sem DuDoo. */
export function SceneAllClear({ color = ACCENT }: SceneProps) {
  return (
    <Scene seed={53} label="Uma caixa aberta e vazia">
      {(s) => (
        <>
          <path d={s.blob(90, 120, 98, 40, 4)} fill={color} />
          <SceneLine
            d={s.poly([
              [84, 96],
              [180, 96],
              [180, 154],
              [84, 154],
              [84, 94],
            ])}
          />
          <SceneLine
            d={s.poly([
              [84, 96],
              [58, 74],
              [82, 66],
              [108, 88],
            ])}
          />
          <SceneLine
            d={s.poly([
              [180, 96],
              [206, 74],
              [182, 66],
              [156, 88],
            ])}
          />
          <SceneLine
            d={s.lines(
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
            width={2}
          />
          <SceneLine d={curl(122, 74, 2, 1)} />
          <path d={sparkle(146, 34, 10)} fill={INK} />
          <path d={sparkle(212, 48, 6)} fill={INK} />
          <path d={sparkle(52, 44, 5)} fill={color} />
        </>
      )}
    </Scene>
  );
}

/** Sem acesso: o cadeado, sóbrio. Intensidade Sério: sem DuDoo, sem brilho, sem cor da paleta. */
export function SceneLocked() {
  return (
    <Scene seed={67} label="Um cadeado fechado">
      {(s) => (
        <>
          <path d={s.blob(105, 91, 60, 50, 9)} fill="var(--dd-sunken)" />
          <SceneLine d="M110,86v-16a20,20 0 0 1 40,0v16" />
          <SceneLine d={s.rect(100, 86, 60, 50, 9)} />
          <SceneLine d={s.line([130, 104], [130, 116])} width={3.2} />
        </>
      )}
    </Scene>
  );
}

/* ——— O estado vazio ——— */

/**
 * A tela sem conteúdo, centrada: a cena, o título, o texto e a ação. O texto segue a voz
 * (`docs/marca.md`): o que está acontecendo e o que fazer, sem "Ops!".
 */
export function EmptyState({
  art,
  title,
  action,
  className,
  children,
  ...rest
}: {
  /** A cena (`<SceneEmpty object="arquivo" />`), ou nada. */
  art?: ReactNode;
  title: ReactNode;
  /** O botão (ou os botões) do que fazer agora. */
  action?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "title">) {
  return (
    <div className={cx("dd-empty", className)} {...rest}>
      {art && <div className="dd-empty-art">{art}</div>}
      <p className="dd-empty-title">{title}</p>
      {children && <div className="dd-empty-text">{children}</div>}
      {action && <div className="dd-empty-action">{action}</div>}
    </div>
  );
}

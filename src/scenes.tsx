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

/** O que falta na tela vazia: "Nenhum arquivo ainda" é `"arquivo"`. */
export type SceneObject = "slide" | "arquivo" | "pasta" | "lista" | "grafico" | "mensagem";

const PORTRAIT: SceneObject[] = ["arquivo"];

/** Empolgado, olhando para o objeto em cima, à direita. */
const LOOKING_UP = dudooExpression({ look: [0.9, -0.55], pupil: 0.8, both: { size: 1.1 } });

function ObjectArt({
  s,
  kind,
  x,
  y,
  w,
  h,
}: {
  s: Sketch;
  kind: SceneObject;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const fill = "var(--dd-surface)";
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
    case "arquivo": {
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
        <g>
          <path d={`M${outline.map((p) => p.join(",")).join("L")}Z`} fill={fill} />
          <SceneLine d={s.poly(outline)} />
          <SceneLine
            d={s.poly([
              [x + w - k, y],
              [x + w - k, y + k],
              [x + w, y + k],
            ])}
          />
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
    }
    case "pasta": {
      const tab: [number, number][] = [
        [x, y + 12],
        [x, y],
        [x + w * 0.36, y],
        [x + w * 0.44, y + 12],
      ];
      return (
        <g>
          <path
            d={`M${x},${y}h${w * 0.36}l${w * 0.08},12h${w * 0.56}v${h - 12}h${-w}Z`}
            fill={fill}
          />
          <SceneLine d={s.poly(tab)} />
          <SceneLine d={s.rect(x, y + 12, w, h - 12, 6)} />
        </g>
      );
    }
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
          <rect x={x + 1} y={y + 1} width={w - 2} height={h - 14} rx={7} fill={fill} />
          <SceneLine d={s.rect(x, y, w, h - 14, 10)} />
          <SceneLine
            d={s.poly([
              [x + 22, y + h - 14],
              [x + 18, y + h],
              [x + 38, y + h - 14],
            ])}
          />
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
  const portrait = PORTRAIT.includes(object);
  const w = portrait ? 82 : 112;
  const h = portrait ? 104 : 78;
  const [ocx, ocy] = dudoo ? [170, 72] : [130, 84];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const rot = dudoo ? -6 : -4;
  return (
    <Scene seed={11} label={label ?? "Nada aqui ainda"}>
      {(s) => (
        <>
          <path
            d={s.blob(x + 10, y + 9, w, h)}
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
              <SceneLine d={s.ticks(36, 80, -110, 4, 9, 30)} />
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

/** Gerando: o DuDoo pensa e o laço monta os slides. Para a espera de uma ação dele. */
export function SceneGenerating({ color = ACCENT }: SceneProps) {
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
          <SceneLine d={`M84,70c6-26,18-36,32-30${curl(116, 40, 1, 1).replace(/^M[^c]+/, "")}`} />
          <SceneDuDoo x={22} y={78} size={92} mood="pensando" />
        </>
      )}
    </Scene>
  );
}

/** Pronto: o DuDoo pisca, inclinado, com o trabalho feito ao lado. Para o marco. */
export function SceneDone({ color = ACCENT }: SceneProps) {
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

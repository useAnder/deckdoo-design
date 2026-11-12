import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  MantineProvider,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  isLightColor,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  ArrowLeft,
  ArrowsLeftRight,
  Briefcase,
  Check,
  Columns,
  Copy,
  Desktop,
  DownloadSimple,
  Eye,
  FileText,
  Globe,
  Lightning,
  Megaphone,
  Moon,
  Presentation,
  ShoppingBag,
  StackSimple,
  Sun,
  TextT,
} from "@phosphor-icons/react";
import {
  DECKDOO_BRAND,
  DECKDOO_WORD,
  DesignProvider,
  LOCKUP_COMMERCE,
  LOCKUP_MARKETING,
  LOCKUP_PAGES,
  LOCKUP_SITES,
  LOCKUP_SLIDES,
  LOCKUP_SPEC,
  LOCKUP_WORKS,
  Logo,
  MARK_PUPIL,
  NavItem,
  NavSection,
  SideBar,
  Status,
  buildTheme,
  lockupHasMark,
  lockupLayout,
  lockupWeight,
  useSideCollapsed,
  wordTransform,
  type Accent,
  type Corners,
  type LockupApp,
  type LockupMetrics,
  type LockupSpec,
  type LockupVersion,
} from "@deckdoo/design";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import markLightSvg from "../../src/brand/deckdoo-mark.svg?raw";
import markDarkSvg from "../../src/brand/deckdoo-mark-inverse.svg?raw";
import { textOutline } from "./outline.js";
import "../kitchen.css";
import "./marca.css";

/**
 * A bancada da marca: o mascote com o nome de cada app da suíte. A barra lateral é a de um app
 * de verdade: o logo em teste fica no lugar dele, e os botões e ajustes ficam na navegação.
 * Serve para decidir fonte, peso, tamanho e espaços antes de a marca de cada app virar SVG.
 *
 * As versões:
 * - compacta: mascote + nome;
 * - empilhada: mascote + nome, com o "DeckDoo" embaixo;
 * - lado a lado: o logotipo inteiro (mascote + "DeckDoo") e o nome depois;
 * - sem o mascote: nome e "DeckDoo", empilhados ou em linha;
 * - só o mascote.
 */

/* ——— O que se ajusta ——— */

type Version = "compacta" | "empilhada" | "lado" | "texto" | "icone";
type Align = "centro" | "olhos" | "topo" | "base";
type FontKey = "figtree" | "jakarta";
type On = "light" | "dark";

interface Look {
  version: Version;
  name: string;
  font: FontKey;
  weight: number;
  /** Ajusta o peso ao tamanho: abaixo de 56px de ícone engrossa até 400. */
  autoWeight: boolean;
  /** Espaço entre letras, em em. */
  tracking: number;
  /** Compacta: maiúscula do nome / altura do ícone, espaço em pupilas, alinhamento. */
  cCap: number;
  cGap: number;
  cAlign: Align;
  /** Empilhada: maiúscula do nome e do "DeckDoo" (/ ícone), espaço em pupilas, recorte. */
  sCap: number;
  sWord: number;
  sGap: number;
  /** Onde a descendente do nome passa sobre o "DeckDoo", abre um respiro nele. */
  sKnock: boolean;
  /** Lado a lado: maiúscula do nome / maiúscula do "DeckDoo", espaço em pupilas, fio. */
  lCap: number;
  lGap: number;
  lSep: boolean;
  /** Sem o mascote: o arranjo. */
  tLayout: "empilhado" | "linha";
  /** Altura do ícone na barra lateral. */
  sideH: number;
  guides: boolean;
}

const FONTS: Record<FontKey, { family: string; label: string; min: number; max: number }> = {
  figtree: { family: "Figtree Variable", label: "Figtree", min: 300, max: 900 },
  jakarta: { family: "Plus Jakarta Sans Variable", label: "Jakarta", min: 200, max: 800 },
};

/** O que está no pacote (`LOCKUP_SPEC`): o ponto de partida "Escolhido". */
const PRESET_SUGESTAO: Look = {
  version: "compacta",
  name: "Slides",
  font: "figtree",
  weight: LOCKUP_SPEC.weight,
  autoWeight: LOCKUP_SPEC.autoWeight,
  tracking: LOCKUP_SPEC.tracking,
  cCap: LOCKUP_SPEC.compact.cap,
  cGap: LOCKUP_SPEC.compact.gap,
  cAlign: ({ center: "centro", eyes: "olhos", top: "topo", baseline: "base" } as const)[
    LOCKUP_SPEC.compact.align
  ],
  sCap: LOCKUP_SPEC.stacked.cap,
  sWord: LOCKUP_SPEC.stacked.word,
  sGap: LOCKUP_SPEC.stacked.gap,
  sKnock: LOCKUP_SPEC.stacked.knock,
  lCap: LOCKUP_SPEC.inline.cap,
  lGap: LOCKUP_SPEC.inline.gap,
  lSep: LOCKUP_SPEC.inline.rule,
  tLayout: "empilhado",
  sideH: 28,
  guides: false,
};

/** A primeira folha de teste (Jakarta ExtraLight), medida na imagem. */
const PRESET_TESTE: Partial<Look> = {
  font: "jakarta",
  weight: 200,
  autoWeight: false,
  tracking: 0,
  cCap: 0.72,
  cGap: 0.6,
  cAlign: "centro",
  sCap: 0.54,
  sWord: 0.25,
  sGap: 0.85,
};

const SEGMENTS = [
  { name: "Slides", icon: Presentation },
  { name: "Works", icon: Briefcase },
  { name: "Marketing", icon: Megaphone },
  { name: "Sites", icon: Globe },
  { name: "Pages", icon: FileText },
  { name: "Commerce", icon: ShoppingBag },
  { name: "Desktop", icon: Desktop },
  { name: "InteliSuper", icon: Lightning },
];

const VERSIONS: { value: Version; label: string; icon: typeof Eye }[] = [
  { value: "compacta", label: "Compacta", icon: ArrowsLeftRight },
  { value: "empilhada", label: "Empilhada", icon: StackSimple },
  { value: "lado", label: "Lado a lado", icon: Columns },
  { value: "texto", label: "Sem o mascote", icon: TextT },
  { value: "icone", label: "Só o mascote", icon: Eye },
];

const ALIGN_OPTIONS = [
  { value: "centro", label: "Centro do ícone" },
  { value: "olhos", label: "Linha dos olhos" },
  { value: "topo", label: "Topo do ícone" },
  { value: "base", label: "Base do ícone" },
];

/* ——— Medidas: a geometria vem do pacote (`lockupLayout`), a mesma do `Logo` ——— */

/** Diâmetro do olho de dentro / altura do mascote: a área de proteção das guias. */
const MARK_EYE = 48.26 / 125.3;

function markRatio(on: On): number {
  const { light, dark = light } = DECKDOO_BRAND.mark;
  return on === "dark" ? dark.ratio : light.ratio;
}

const ALIGN_SPEC: Record<Align, LockupSpec["compact"]["align"]> = {
  centro: "center",
  olhos: "eyes",
  topo: "top",
  base: "baseline",
};

/** Os ajustes da bancada no formato do pacote (`LOCKUP_SPEC`). */
function specOf(look: Look): LockupSpec {
  return {
    weight: look.weight,
    autoWeight: look.autoWeight,
    tracking: look.tracking,
    compact: { cap: look.cCap, gap: look.cGap, align: ALIGN_SPEC[look.cAlign] },
    stacked: { cap: look.sCap, word: look.sWord, gap: look.sGap, knock: look.sKnock },
    inline: { cap: look.lCap, gap: look.lGap, rule: look.lSep },
  };
}

function versionOf(look: Look): LockupVersion {
  if (look.version === "compacta") return "compact";
  if (look.version === "empilhada") return "stacked";
  if (look.version === "lado") return "inline";
  return look.tLayout === "empilhado" ? "text-stacked" : "text-inline";
}

/* ——— Medir o texto ——— */

// A fonte chega depois da primeira pintura; cada carga muda a época e as medidas se refazem.
const FontEpoch = createContext(0);

function useFontEpoch(): number {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    let alive = true;
    const bump = () => alive && setEpoch((e) => e + 1);
    const specs = Object.values(FONTS).flatMap((f) => [
      `${f.min} 100px "${f.family}"`,
      `${f.max} 100px "${f.family}"`,
    ]);
    Promise.all(specs.map((s) => document.fonts.load(s)))
      .catch(() => undefined)
      .finally(bump);
    document.fonts.addEventListener("loadingdone", bump);
    return () => {
      alive = false;
      document.fonts.removeEventListener("loadingdone", bump);
    };
  }, []);
  return epoch;
}

const measureCache = new Map<string, LockupMetrics>();
let measureCtx: CanvasRenderingContext2D | null = null;

/** O nome medido na fonte ao vivo, no formato que o `lockupLayout` lê. */
function measure(family: string, weight: number, text: string, tracking: number, epoch: number) {
  const key = `${family}|${weight}|${text}|${tracking}|${epoch}`;
  const hit = measureCache.get(key);
  if (hit) return hit;
  measureCtx ??= document.createElement("canvas").getContext("2d");
  const ctx = measureCtx!;
  ctx.font = `${weight} 100px "${family}"`;
  ctx.letterSpacing = "0px";
  const cap = ctx.measureText("H");
  ctx.letterSpacing = `${tracking * 100}px`;
  const m = ctx.measureText(text);
  const chars = [...text];
  const box: LockupMetrics = {
    capFrac: cap.actualBoundingBoxAscent / 100 || 0.7,
    inkLeft: -m.actualBoundingBoxLeft / 100,
    inkRight: m.actualBoundingBoxRight / 100,
    ascent: m.actualBoundingBoxAscent / 100,
    glyphs: chars.map((ch, i) => {
      const pen = ctx.measureText(chars.slice(0, i).join("")).width;
      const g = ctx.measureText(ch);
      return [
        (pen - g.actualBoundingBoxLeft) / 100,
        (pen + g.actualBoundingBoxRight) / 100,
        g.actualBoundingBoxDescent / 100,
      ] as const;
    }),
  };
  measureCache.set(key, box);
  return box;
}

function effectiveWeight(look: Look, iconH: number): number {
  const { min, max } = FONTS[look.font];
  return Math.min(max, Math.max(min, lockupWeight(iconH, specOf(look))));
}

/* ——— A geometria do lockup ——— */

/** O lockup em coordenadas absolutas (mascote em x = 0), para as guias e o SVG. */
interface Geo {
  W: number;
  /** A altura de referência: a do ícone (sem o mascote, a que ele teria). */
  H: number;
  pupil: number;
  weight: number;
  minY: number;
  maxY: number;
  name: string;
  mark?: { w: number; h: number; on: On };
  gap?: { x: number; w: number };
  text?: { x: number; baseline: number; size: number; capH: number; inkLeft: number };
  word?: { x: number; baseline: number; scale: number };
  sep?: { x: number; y1: number; y2: number; w: number };
  /** Empilhada: da descendente do nome ao topo da letra do "DeckDoo" embaixo dela. */
  clearance?: number;
  /** A espessura do recorte no "DeckDoo", quando ele vai. */
  knock?: number;
}

function lockupGeo(look: Look, iconH: number, on: On, epoch: number, weight?: number): Geo {
  const font = FONTS[look.font];
  const pupil = iconH * MARK_PUPIL;
  const w = weight ?? effectiveWeight(look, iconH);
  const name = look.name.trim() || "Nome";
  const markW = iconH * markRatio(on);
  const geo: Geo = { W: markW, H: iconH, pupil, weight: w, minY: 0, maxY: iconH, name };
  if (look.version === "icone") return { ...geo, mark: { w: markW, h: iconH, on } };

  const version = versionOf(look);
  const m = measure(font.family, w, name, look.tracking, epoch);
  const b = lockupLayout(version, iconH, m, specOf(look));
  // O pacote mede o bloco a partir do fim do mascote; aqui tudo vai para x absoluto.
  const withMark = lockupHasMark(version);
  const ox = withMark ? markW + b.gap : 0;
  return {
    ...geo,
    W: ox + b.width,
    minY: b.minY,
    maxY: b.maxY,
    ...(withMark && { mark: { w: markW, h: iconH, on }, gap: { x: markW, w: b.gap } }),
    text: { ...b.text, x: ox + b.text.x, inkLeft: ox },
    ...(b.word && { word: { ...b.word, x: ox + b.word.x } }),
    ...(b.rule && {
      sep: { x: ox + b.rule.x, y1: b.rule.y1, y2: b.rule.y2, w: b.rule.width },
    }),
    ...(b.clearance !== undefined && { clearance: b.clearance }),
    ...(b.knock !== undefined && { knock: b.knock }),
  };
}

/* ——— O lockup ——— */

function Lockup({
  look,
  iconH,
  on,
  weight,
  guides = look.guides,
}: {
  look: Look;
  iconH: number;
  on: On;
  /** Força o peso (a grade de pesos); sem ele, vale o do ajuste. */
  weight?: number;
  guides?: boolean;
}) {
  const epoch = useContext(FontEpoch);
  const maskId = useId();
  const g = lockupGeo(look, iconH, on, epoch, weight);
  const font = FONTS[look.font];
  const label = look.version === "icone" ? "DeckDoo" : `${g.name}, DeckDoo`;
  const knock = g.knock !== undefined && g.text && g.word;
  const textProps = g.text && {
    x: g.text.x,
    y: g.text.baseline,
    fontFamily: `"${font.family}"`,
    fontWeight: g.weight,
    fontSize: g.text.size,
    letterSpacing: look.tracking * g.text.size,
  };
  return (
    <span
      className="bm-lockup"
      role="img"
      aria-label={label}
      style={{ width: g.W, height: g.H, marginTop: -g.minY, marginBottom: g.maxY - g.H }}
    >
      {g.mark && (
        <span className="bm-lockup-mark">
          <Logo variant="mark" height={g.mark.h} on={g.mark.on} label="" />
        </span>
      )}
      <svg
        className="bm-lockup-type"
        width={g.W}
        height={g.H}
        viewBox={`0 0 ${g.W} ${g.H}`}
        overflow="visible"
        aria-hidden
      >
        {knock && textProps && (
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-g.W}
            y={-g.H}
            width={g.W * 3}
            height={g.H * 3}
          >
            <rect x={-g.W} y={-g.H} width={g.W * 3} height={g.H * 3} fill="white" />
            <text
              {...textProps}
              fill="black"
              stroke="black"
              strokeWidth={g.knock}
              strokeLinejoin="round"
            >
              {g.name}
            </text>
          </mask>
        )}
        {textProps && (
          <text {...textProps} fill="currentColor">
            {g.name}
          </text>
        )}
        {g.word && (
          <g mask={knock ? `url(#${maskId})` : undefined}>
            <g transform={wordTransform(g.word)} fill="currentColor">
              {DECKDOO_WORD.paths.map((d) => (
                <path key={d.slice(0, 12)} d={d} />
              ))}
            </g>
          </g>
        )}
        {g.sep && (
          <line
            x1={g.sep.x}
            x2={g.sep.x}
            y1={g.sep.y1}
            y2={g.sep.y2}
            stroke="currentColor"
            strokeWidth={g.sep.w}
          />
        )}
        {guides && <Guides g={g} />}
      </svg>
    </span>
  );
}

/** As guias: caixa do ícone, espaço até a tinta, linhas de maiúscula e base, área de proteção. */
function Guides({ g }: { g: Geo }) {
  const clear = g.H * MARK_EYE;
  const sw = Math.max(0.5, Math.min(1, g.H / 60));
  const line = (y: number, key: string) => (
    <line key={key} x1={0} x2={g.W} y1={y} y2={y} className="bm-guide-line" strokeWidth={sw} />
  );
  const wordCap = g.word && (DECKDOO_WORD.baseline - DECKDOO_WORD.capTop) * g.word.scale;
  return (
    <g className="bm-guides">
      <rect
        x={-clear}
        y={g.minY - clear}
        width={g.W + 2 * clear}
        height={g.maxY - g.minY + 2 * clear}
        className="bm-guide-clear"
        strokeWidth={sw}
      />
      {g.mark && (
        <rect
          x={0}
          y={0}
          width={g.mark.w}
          height={g.mark.h}
          className="bm-guide-box"
          strokeWidth={sw}
        />
      )}
      {g.gap && g.gap.w > 0 && (
        <rect
          x={g.gap.x}
          y={g.minY}
          width={g.gap.w}
          height={g.maxY - g.minY}
          className="bm-guide-gap"
        />
      )}
      {g.text && line(g.text.baseline - g.text.capH, "cap")}
      {g.text && line(g.text.baseline, "base")}
      {g.word && wordCap && line(g.word.baseline - wordCap, "wcap")}
      {g.word && line(g.word.baseline, "wbase")}
      {g.clearance !== undefined && g.clearance < 0.5 && g.text && (
        <rect
          x={g.text.inkLeft}
          y={g.text.baseline}
          width={g.W - g.text.inkLeft}
          height={Math.max(1, g.maxY - g.text.baseline)}
          className="bm-guide-hit"
        />
      )}
    </g>
  );
}

/* ——— O SVG para baixar ——— */

function markInner(raw: string): { viewBox: string; paths: string[] } {
  const viewBox = /viewBox="([^"]+)"/.exec(raw)?.[1] ?? "0 0 114.4 125.3";
  const paths = [...raw.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]!);
  return { viewBox, paths };
}

const MARK_SHAPES = { light: markInner(markLightSvg), dark: markInner(markDarkSvg) };

/** O lockup do palco como SVG avulso: texto em contorno, sem guias, na cor do fundo escolhido. */
async function lockupSvg(look: Look, g: Geo, color: string): Promise<string> {
  const r = (v: number) => +v.toFixed(2);
  const out: string[] = [];
  const defs: string[] = [];
  let namePath = "";
  if (g.text) {
    const d = await textOutline(look.font, g.weight, g.name, g.text.size, look.tracking);
    namePath = `<path transform="translate(${r(g.text.x)} ${r(g.text.baseline)})" d="${d}"/>`;
  }
  if (g.mark) {
    const shape = MARK_SHAPES[g.mark.on];
    out.push(
      `<svg x="0" y="0" width="${r(g.mark.w)}" height="${r(g.mark.h)}" viewBox="${shape.viewBox}">${shape.paths
        .map((d) => `<path d="${d}"/>`)
        .join("")}</svg>`,
    );
  }
  if (namePath) out.push(namePath);
  if (g.word) {
    const knock = g.knock !== undefined && namePath;
    if (knock) {
      const big = { x: -g.W, y: -g.H, w: g.W * 3, h: g.H * 3 };
      defs.push(
        `<mask id="recorte" maskUnits="userSpaceOnUse" x="${r(big.x)}" y="${r(big.y)}" width="${r(big.w)}" height="${r(big.h)}">` +
          `<rect x="${r(big.x)}" y="${r(big.y)}" width="${r(big.w)}" height="${r(big.h)}" fill="#fff"/>` +
          `<g fill="#000" stroke="#000" stroke-width="${r(g.knock ?? 0)}" stroke-linejoin="round">${namePath}</g>` +
          `</mask>`,
      );
    }
    out.push(
      `<g${knock ? ' mask="url(#recorte)"' : ""}><g transform="${wordTransform(g.word)}">${DECKDOO_WORD.paths
        .map((d) => `<path d="${d}"/>`)
        .join("")}</g></g>`,
    );
  }
  if (g.sep) {
    out.push(
      `<rect x="${r(g.sep.x - g.sep.w / 2)}" y="${r(g.sep.y1)}" width="${r(g.sep.w)}" height="${r(g.sep.y2 - g.sep.y1)}"/>`,
    );
  }
  const h = g.maxY - g.minY;
  const title = look.version === "icone" ? "DeckDoo" : `${g.name} DeckDoo`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${r(g.minY)} ${r(g.W)} ${r(h)}" width="${r(g.W)}" height="${r(h)}">`,
    `<title>${title}</title>`,
    defs.length ? `<defs>${defs.join("")}</defs>` : "",
    `<g fill="${color}">${out.join("")}</g>`,
    `</svg>`,
  ].join("");
}

function slug(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "nome"
  );
}

/* ——— A página ——— */

export function BancadaRoot() {
  // As mesmas chaves da cozinha: a bancada abre com o acento e os cantos de lá.
  const [accent] = useLocalStorage<Accent>({ key: "dd-k-accent", defaultValue: "lime" });
  const [corners] = useLocalStorage<Corners>({ key: "dd-k-corners", defaultValue: "pilula" });
  const theme = useMemo(() => buildTheme({ accent, corners }), [accent, corners]);
  const epoch = useFontEpoch();

  useEffect(() => {
    document.title = "Bancada da marca · DeckDoo Design";
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <FontEpoch value={epoch}>
        <Bancada />
      </FontEpoch>
    </MantineProvider>
  );
}

/**
 * Qual desenho do mascote vai em cada fundo. A regra é a tinta: tinta escura (painel claro,
 * acento claro como o limão) leva o mascote cheio; tinta clara (painel escuro, cartão invertido,
 * acento escuro como o roxo) leva o invertido. O mascote nunca tem a pupila branca.
 */
function useOn() {
  const scheme = useComputedColorScheme("light");
  const theme = useMantineTheme();
  const accent = theme.colors[theme.primaryColor]?.[6];
  const panel: On = scheme === "dark" ? "dark" : "light";
  const inverse: On = scheme === "dark" ? "light" : "dark";
  const onAccent: On = !accent || isLightColor(accent, theme.luminanceThreshold) ? "light" : "dark";
  return { panel, inverse, accent: onAccent };
}

type SetLook = (patch: Partial<Look>) => void;

function Bancada() {
  const [stored, setLook] = useLocalStorage<Look>({
    key: "dd-marca-look",
    defaultValue: PRESET_SUGESTAO,
  });
  // Ajuste salvo de uma versão anterior da página: completa com o padrão.
  const look = { ...PRESET_SUGESTAO, ...stored };
  const set: SetLook = (patch) => setLook({ ...look, ...patch });
  const on = useOn();

  return (
    <div className="dd-root dd-frame ks bm" lang="pt-BR">
      <SideBar
        brand={<Lockup look={look} iconH={look.sideH} on={on.panel} guides={false} />}
        brandCollapsed={
          <Lockup look={{ ...look, version: "icone" }} iconH={30} on={on.panel} guides={false} />
        }
        top={<Presets look={look} set={set} />}
        foot={<Foot look={look} />}
      >
        <NavSection label="Versão">
          {VERSIONS.map((v) => (
            <NavItem
              key={v.value}
              icon={<v.icon size={18} />}
              label={v.label}
              active={look.version === v.value}
              onClick={() => set({ version: v.value })}
            />
          ))}
        </NavSection>

        <NavSection label="Segmento">
          {SEGMENTS.map((s) => (
            <NavItem
              key={s.name}
              icon={<s.icon size={18} />}
              label={s.name}
              active={look.name === s.name}
              onClick={() => set({ name: s.name })}
            />
          ))}
          <OtherName look={look} set={set} />
        </NavSection>

        <NavSection label="Ajustes">
          <Adjust look={look} set={set} />
        </NavSection>
      </SideBar>

      <main className="dd-main ks-main">
        <header className="ks-top">
          <div>
            <Anchor href="/" size="xs" className="dd-muted bm-back">
              <ArrowLeft size={12} /> Cozinha
            </Anchor>
            <Group gap="sm">
              <Title order={1} fz={28}>
                Bancada da marca
              </Title>
              <Status tone="info">Rascunho</Status>
            </Group>
          </div>
          <ThemeToggle />
        </header>

        <Stage look={look} />
        <Scale look={look} />
        <Weights look={look} />
        <Family look={look} />
        <InPackage look={look} />
      </main>
    </div>
  );
}

function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      size="lg"
      aria-label={colorScheme === "dark" ? "Tema claro" : "Tema escuro"}
      onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
    >
      {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
  );
}

/* ——— A barra lateral ——— */

function Presets({ look, set }: { look: Look; set: SetLook }) {
  const collapsed = useSideCollapsed();
  if (collapsed) return null;
  return (
    <div className="bm-presets">
      <Text size="xs" className="dd-muted">
        Ponto de partida
      </Text>
      <Group gap={6} grow>
        <Button size="compact-sm" variant="default" onClick={() => set(PRESET_TESTE)}>
          1º teste
        </Button>
        <Button
          size="compact-sm"
          variant="default"
          onClick={() =>
            set({ ...PRESET_SUGESTAO, version: look.version, name: look.name, guides: look.guides })
          }
        >
          Escolhido
        </Button>
      </Group>
    </div>
  );
}

function OtherName({ look, set }: { look: Look; set: SetLook }) {
  const collapsed = useSideCollapsed();
  if (collapsed) return null;
  const custom = !SEGMENTS.some((s) => s.name === look.name);
  return (
    <TextInput
      className="bm-other"
      size="xs"
      placeholder="Outro nome…"
      aria-label="Outro nome de app"
      value={custom ? look.name : ""}
      onChange={(e) => set({ name: e.currentTarget.value })}
    />
  );
}

function Knob({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  return (
    <div className="bm-knob">
      <div className="bm-knob-head">
        <Text size="xs">{label}</Text>
        <Text size="xs" className="dd-muted bm-mono">
          {value}
        </Text>
      </div>
      {children}
    </div>
  );
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

function Range({
  label,
  value,
  shown,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  shown: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <Knob label={label} value={shown}>
      <Slider
        size="sm"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        label={null}
      />
    </Knob>
  );
}

function Adjust({ look, set }: { look: Look; set: SetLook }) {
  const collapsed = useSideCollapsed();
  if (collapsed) return null;
  const font = FONTS[look.font];
  const v = look.version;
  const stacked = v === "empilhada" || (v === "texto" && look.tLayout === "empilhado");
  const inline = v === "lado" || (v === "texto" && look.tLayout === "linha");
  return (
    <Stack gap={14} className="bm-adjust">
      {v !== "icone" && (
        <>
          <Knob label="Fonte" value="">
            <SegmentedControl
              size="xs"
              fullWidth
              value={look.font}
              onChange={(key) => {
                const next = FONTS[key as FontKey];
                set({
                  font: key as FontKey,
                  weight: Math.min(next.max, Math.max(next.min, look.weight)),
                });
              }}
              data={Object.entries(FONTS).map(([value, f]) => ({ value, label: f.label }))}
            />
          </Knob>
          <Range
            label="Peso"
            value={look.weight}
            shown={String(look.weight)}
            min={font.min}
            max={font.max}
            step={50}
            onChange={(weight) => set({ weight })}
          />
          <Switch
            size="xs"
            label="Engrossar em tamanho pequeno"
            description="Abaixo de 56px sobe até 400"
            checked={look.autoWeight}
            onChange={(e) => set({ autoWeight: e.currentTarget.checked })}
          />
          <Range
            label="Entre letras"
            value={look.tracking}
            shown={`${look.tracking.toFixed(3)} em`}
            min={-0.04}
            max={0.08}
            step={0.005}
            onChange={(tracking) => set({ tracking })}
          />
        </>
      )}

      {v === "texto" && (
        <Knob label="Arranjo" value="">
          <SegmentedControl
            size="xs"
            fullWidth
            value={look.tLayout}
            onChange={(t) => set({ tLayout: t as Look["tLayout"] })}
            data={[
              { value: "empilhado", label: "Empilhado" },
              { value: "linha", label: "Em linha" },
            ]}
          />
        </Knob>
      )}

      {v === "compacta" && (
        <>
          <Range
            label="Tamanho do nome"
            value={look.cCap}
            shown={pct(look.cCap)}
            min={0.4}
            max={0.95}
            step={0.01}
            onChange={(cCap) => set({ cCap })}
          />
          <Range
            label="Espaço, em pupilas"
            value={look.cGap}
            shown={look.cGap.toFixed(2)}
            min={0}
            max={2.5}
            step={0.05}
            onChange={(cGap) => set({ cGap })}
          />
          <Select
            size="xs"
            label="Alinhar a maiúscula com"
            data={ALIGN_OPTIONS}
            value={look.cAlign}
            onChange={(a) => a && set({ cAlign: a as Align })}
            allowDeselect={false}
            comboboxProps={{ withinPortal: true }}
          />
        </>
      )}

      {stacked && (
        <>
          <Range
            label="Tamanho do nome"
            value={look.sCap}
            shown={pct(look.sCap)}
            min={0.3}
            max={0.75}
            step={0.01}
            onChange={(sCap) => set({ sCap })}
          />
          <Range
            label="Tamanho do DeckDoo"
            value={look.sWord}
            shown={pct(look.sWord)}
            min={0.15}
            max={0.45}
            step={0.01}
            onChange={(sWord) => set({ sWord })}
          />
          {v === "empilhada" && (
            <Range
              label="Espaço, em pupilas"
              value={look.sGap}
              shown={look.sGap.toFixed(2)}
              min={0}
              max={2.5}
              step={0.05}
              onChange={(sGap) => set({ sGap })}
            />
          )}
          <Switch
            size="xs"
            label="Recortar o DeckDoo na descendente"
            description="Onde o g, p ou y passa por cima, abre um respiro"
            checked={look.sKnock}
            onChange={(e) => set({ sKnock: e.currentTarget.checked })}
          />
        </>
      )}

      {inline && (
        <>
          <Range
            label="Nome ÷ DeckDoo"
            value={look.lCap}
            shown={pct(look.lCap)}
            min={0.6}
            max={1.3}
            step={0.01}
            onChange={(lCap) => set({ lCap })}
          />
          <Range
            label="Espaço, em pupilas"
            value={look.lGap}
            shown={look.lGap.toFixed(2)}
            min={0.3}
            max={4}
            step={0.05}
            onChange={(lGap) => set({ lGap })}
          />
          <Switch
            size="xs"
            label="Fio entre os dois"
            checked={look.lSep}
            onChange={(e) => set({ lSep: e.currentTarget.checked })}
          />
        </>
      )}

      <Range
        label="Altura do ícone na barra"
        value={look.sideH}
        shown={`${look.sideH}px`}
        min={18}
        max={56}
        step={1}
        onChange={(sideH) => set({ sideH })}
      />
      <Switch
        size="xs"
        label="Guias"
        description="Caixa do ícone, espaço, maiúscula, base e área de proteção"
        checked={look.guides}
        onChange={(e) => set({ guides: e.currentTarget.checked })}
      />
    </Stack>
  );
}

function Foot({ look }: { look: Look }) {
  const collapsed = useSideCollapsed();
  const [copied, setCopied] = useState(false);
  if (collapsed) return null;
  const copy = async () => {
    try {
      // No formato do `LOCKUP_SPEC` (src/lockup-spec.ts), pronto para colar lá.
      await navigator.clipboard.writeText(
        `export const LOCKUP_SPEC: LockupSpec = ${JSON.stringify(specOf(look), null, 2)};\n`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Sem permissão de área de transferência: não faz nada.
    }
  };
  return (
    <Button
      variant="default"
      size="sm"
      fullWidth
      leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
      onClick={copy}
    >
      {copied ? "Copiado" : "Copiar ajustes"}
    </Button>
  );
}

/* ——— As seções ——— */

function Section({
  id,
  title,
  note,
  aside,
  children,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ks-section">
      <div className="bm-section-head">
        <div className="ks-section-head">
          <Title order={2}>{title}</Title>
          {note && <Text className="dd-muted">{note}</Text>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

type Ground = "panel" | "inverse" | "accent";

function groundClass(ground: Ground) {
  return ground === "inverse"
    ? "dd-panel dd-inverse"
    : ground === "accent"
      ? "dd-panel dd-accent"
      : "dd-panel";
}

/**
 * Para que tamanho é o SVG. O arquivo não sabe em que tamanho vai ser mostrado, então o peso do
 * tamanho pequeno vai junto, no arquivo: um SVG por faixa, como as versões de tamanho pequeno.
 */
type UseSize = "grande" | "32" | "24" | "20" | "16";

const USE_OPTIONS: { value: UseSize; label: string }[] = [
  { value: "grande", label: "Uso grande (56px+)" },
  { value: "32", label: "Uso a 32px" },
  { value: "24", label: "Uso a 24px" },
  { value: "20", label: "Uso a 20px" },
  { value: "16", label: "Uso a 16px" },
];

function Stage({ look }: { look: Look }) {
  const [size, setSize] = useLocalStorage({ key: "dd-marca-stage", defaultValue: 120 });
  const [ground, setGround] = useLocalStorage<Ground>({
    key: "dd-marca-ground",
    defaultValue: "panel",
  });
  const [use, setUse] = useLocalStorage<UseSize>({ key: "dd-marca-uso", defaultValue: "grande" });
  const [busy, setBusy] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const on = useOn();
  const epoch = useContext(FontEpoch);
  const groundOn: On = on[ground];
  // O SVG sai no tamanho de uso, com o peso desse tamanho; o palco mostra esse peso ampliado.
  const useH = use === "grande" ? size : Number(use);
  const useWeight = effectiveWeight(look, useH);
  const g = lockupGeo(look, size, groundOn, epoch, useWeight);
  const side = lockupGeo(look, look.sideH, on.panel, epoch);

  const download = async () => {
    const el = stageRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const out = lockupGeo(look, useH, groundOn, epoch, useWeight);
      const svg = await lockupSvg(look, out, getComputedStyle(el).color);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const a = document.createElement("a");
      const fundo = groundOn === "dark" ? "escuro" : "claro";
      const who = look.version === "icone" ? "" : `-${slug(g.name)}`;
      const scale = use === "grande" ? "grande" : `${use}px`;
      a.href = url;
      a.download = `deckdoo${who}-${look.version}-${fundo}-${scale}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      id="palco"
      title="Palco"
      note="O lockup grande, com as medidas. Ligue as guias na barra para ver onde cada coisa encosta."
      aside={
        <Group gap="xs">
          <SegmentedControl
            size="xs"
            value={ground}
            onChange={(v) => setGround(v as Ground)}
            data={[
              { value: "panel", label: "Painel" },
              { value: "inverse", label: "Invertido" },
              { value: "accent", label: "Acento" },
            ]}
          />
          <Select
            size="xs"
            w={150}
            aria-label="Tamanho de uso do SVG"
            data={USE_OPTIONS}
            value={use}
            onChange={(v) => v && setUse(v as UseSize)}
            allowDeselect={false}
          />
          <Button
            size="xs"
            variant="default"
            leftSection={<DownloadSimple size={14} />}
            loading={busy}
            onClick={download}
          >
            Baixar SVG
          </Button>
        </Group>
      }
    >
      <div className="bm-stage-grid">
        <div ref={stageRef} className={`${groundClass(ground)} bm-stage`}>
          <Lockup look={look} iconH={size} on={groundOn} weight={useWeight} />
        </div>
        <div className="dd-block bm-readout">
          <Range
            label="Altura do ícone"
            value={size}
            shown={`${size}px`}
            min={48}
            max={220}
            step={2}
            onChange={setSize}
          />
          <dl>
            <Row
              k={use === "grande" ? "Peso aplicado" : `Peso para ${use}px`}
              v={g.text ? String(g.weight) : "—"}
            />
            <Row k="O SVG sai com" v={`${useH}px de ícone`} />
            <Row k="Corpo do texto" v={g.text ? `${g.text.size.toFixed(1)}px` : "—"} />
            <Row k="Maiúscula" v={g.text ? `${g.text.capH.toFixed(1)}px` : "—"} />
            <Row k="Espaço depois do mascote" v={g.gap ? `${g.gap.w.toFixed(1)}px` : "—"} />
            <Row k="Pupila (unidade)" v={`${g.pupil.toFixed(1)}px`} />
            <Row k="Largura total" v={`${g.W.toFixed(0)}px`} />
            {g.word && g.text && g.text.baseline < g.word.baseline && (
              <Row
                k="Folga sobre o DeckDoo"
                v={g.clearance === undefined ? "não cruza" : `${g.clearance.toFixed(1)}px`}
                warn={g.clearance !== undefined && g.clearance < 0.5}
              />
            )}
          </dl>
          <Text size="xs" className="dd-muted">
            Na barra ({look.sideH}px):{" "}
            {side.text
              ? `texto de ${side.text.size.toFixed(1)}px, peso ${side.weight}`
              : "só o mascote"}
            {side.clearance !== undefined && side.clearance < 0.5 && ", a descendente encosta"}.
          </Text>
        </div>
      </div>
    </Section>
  );
}

function Row({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="bm-row" data-warn={warn || undefined}>
      <dt>{k}</dt>
      <dd className="bm-mono">{v}</dd>
    </div>
  );
}

const SCALE_SIZES = [16, 20, 24, 32, 48, 64];

function Scale({ look }: { look: Look }) {
  const on = useOn();
  return (
    <Section
      id="escala"
      title="Em escala"
      note="O mesmo lockup do cabeçalho do app ao cartaz. A altura é a do ícone; o peso segue o ajuste (e engrossa no pequeno, se estiver ligado)."
    >
      <div className="bm-scale">
        {SCALE_SIZES.map((h) => (
          <div key={h} className="bm-scale-row">
            <Text size="xs" className="dd-muted bm-mono bm-scale-label">
              {h}px
            </Text>
            <div className="dd-panel bm-cell">
              <Lockup look={look} iconH={h} on={on.panel} />
            </div>
            <div className="dd-panel dd-inverse bm-cell">
              <Lockup look={look} iconH={h} on={on.inverse} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const WEIGHT_SIZES = [16, 24, 48];

function Weights({ look }: { look: Look }) {
  const on = useOn();
  const font = FONTS[look.font];
  const weights = [200, 300, 400, 500, 600].filter((w) => w >= font.min && w <= font.max);
  const shown = look.version === "icone" ? { ...look, version: "compacta" as const } : look;
  return (
    <Section
      id="pesos"
      title="Pesos lado a lado"
      note={`${font.label} em cada peso, em três tamanhos, no claro e no escuro. É aqui que dá para ver onde o traço fino começa a sumir.`}
    >
      <div className="bm-weights">
        {(["panel", "inverse"] as const).map((ground) => (
          <div key={ground} className={`${groundClass(ground)} bm-weights-grid`}>
            <span />
            {WEIGHT_SIZES.map((h) => (
              <Text key={h} size="xs" className="dd-muted bm-mono">
                {h}px
              </Text>
            ))}
            {weights.map((w) => (
              <WeightRow key={w} look={shown} weight={w} on={on[ground]} />
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

function WeightRow({ look, weight, on }: { look: Look; weight: number; on: On }) {
  return (
    <>
      <Text size="xs" className="dd-muted bm-mono">
        {weight}
      </Text>
      {WEIGHT_SIZES.map((h) => (
        <div key={h} className="bm-weights-cell">
          <Lockup look={look} iconH={h} on={on} weight={weight} />
        </div>
      ))}
    </>
  );
}

const FAMILY_COLUMNS: { label: string; size: number; patch: Partial<Look> }[] = [
  { label: "Compacta · 32px", size: 32, patch: { version: "compacta" } },
  { label: "Empilhada · 56px", size: 56, patch: { version: "empilhada" } },
  { label: "Lado a lado · 32px", size: 32, patch: { version: "lado" } },
  {
    label: "Sem o mascote, empilhado · 56px",
    size: 56,
    patch: { version: "texto", tLayout: "empilhado" },
  },
  {
    label: "Sem o mascote, em linha · 32px",
    size: 32,
    patch: { version: "texto", tLayout: "linha" },
  },
];

function Family({ look }: { look: Look }) {
  const on = useOn();
  const epoch = useContext(FontEpoch);
  const names = SEGMENTS.map((s) => s.name);
  if (!names.includes(look.name) && look.name.trim()) names.push(look.name.trim());
  return (
    <Section
      id="familia"
      title="A família"
      note="Todos os apps com o mesmo ajuste, como na folha de teste. Nas empilhadas, o aviso marca onde uma descendente cai em cima de uma letra do DeckDoo; a que cai depois dele não conta."
    >
      <div className="dd-panel bm-family">
        {FAMILY_COLUMNS.map((col) => (
          <Stack key={col.label} gap={col.size > 40 ? 26 : 22}>
            <Text className="dd-eyebrow">{col.label}</Text>
            {names.map((n) => {
              const l = { ...look, ...col.patch, name: n };
              const g = lockupGeo(l, col.size, on.panel, epoch);
              const hit = g.clearance !== undefined && g.clearance < 0.5;
              return (
                <Group key={n} gap="md" wrap="nowrap">
                  <Lockup look={l} iconH={col.size} on={on.panel} />
                  {hit && !l.sKnock && <Status tone="attention">Encosta</Status>}
                  {hit && l.sKnock && <Status tone="info">Recortado</Status>}
                </Group>
              );
            })}
          </Stack>
        ))}
      </div>
    </Section>
  );
}

/* ——— O que o pacote entrega ——— */

const PACKAGE_APPS: LockupApp[] = [
  LOCKUP_SLIDES,
  LOCKUP_WORKS,
  LOCKUP_MARKETING,
  LOCKUP_SITES,
  LOCKUP_PAGES,
  LOCKUP_COMMERCE,
];

const PACKAGE_VERSIONS: { version: LockupVersion; label: string; height: number }[] = [
  { version: "compact", label: "compact · 28px", height: 28 },
  { version: "stacked", label: "stacked · 48px", height: 48 },
  { version: "inline", label: "inline · 24px", height: 24 },
  { version: "text-stacked", label: "text-stacked · 48px", height: 48 },
  { version: "text-inline", label: "text-inline · 24px", height: 24 },
];

/** Onde os ajustes da bancada diferem do `LOCKUP_SPEC` do pacote. */
function specDiff(look: Look): string[] {
  const now = specOf(look);
  const diff: string[] = [];
  const walk = (a: object, b: object, path: string) => {
    for (const [k, v] of Object.entries(a)) {
      const w = (b as Record<string, unknown>)[k];
      if (v && typeof v === "object") walk(v, w as object, `${path}${k}.`);
      else if (v !== w) diff.push(`${path}${k}: ${String(w)} → ${String(v)}`);
    }
  };
  walk(LOCKUP_SPEC, now, "");
  return diff;
}

function InPackage({ look }: { look: Look }) {
  const diff = specDiff(look);
  return (
    <Section
      id="pacote"
      title="No pacote"
      note={
        <>
          O <code>{"<Logo app={LOCKUP_SLIDES} variant=…>"}</code> de verdade, com o nome em contorno
          gerado por <code>pnpm lockup</code> e as medidas do <code>LOCKUP_SPEC</code>. Os ajustes
          da barra não mexem aqui: para levar, cole o “Copiar ajustes” em{" "}
          <code>src/lockup-spec.ts</code> e rode <code>pnpm lockup</code>.
        </>
      }
      aside={
        diff.length === 0 ? (
          <Status tone="ok">Bancada igual ao pacote</Status>
        ) : (
          <Status tone="attention">{`${diff.length} ajuste(s) fora do pacote`}</Status>
        )
      }
    >
      {diff.length > 0 && (
        <Text size="sm" className="dd-muted bm-mono bm-diff">
          {diff.join(" · ")}
        </Text>
      )}
      <div className="dd-panel bm-family">
        {PACKAGE_VERSIONS.map((col) => (
          <Stack key={col.version} gap={col.height > 40 ? 24 : 20}>
            <Text className="dd-eyebrow">{col.label}</Text>
            {PACKAGE_APPS.map((app) => (
              <Logo key={app.name} app={app} variant={col.version} height={col.height} />
            ))}
          </Stack>
        ))}
      </div>
      <Group gap="md" mt="md" wrap="wrap">
        <div className="dd-panel dd-inverse bm-cell">
          <Logo app={LOCKUP_SLIDES} height={32} />
        </div>
        <div className="dd-panel dd-accent bm-cell">
          <Logo app={LOCKUP_SLIDES} height={32} />
        </div>
        <div className="dd-panel bm-cell">
          {/* Nome fora da lista: sai com a fonte da página, sem contorno. */}
          <DesignProvider app={look.name.trim() || "Nome"}>
            <Logo height={32} />
          </DesignProvider>
        </div>
      </Group>
    </Section>
  );
}

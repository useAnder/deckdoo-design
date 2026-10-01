import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Modal,
  Paper,
  Progress,
  SegmentedControl,
  Tabs,
  Textarea,
  TextInput,
  Select,
  Switch,
  Tooltip,
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor,
  type VariantColorsResolver,
  type MantineColorsTuple,
} from "@mantine/core";

/**
 * O padrão visual da suíte, nascido no DeckDoo (a bancada é a cozinha, em `playground/`).
 *
 * A paleta vem de `EloquentSlides/docs/branding/color-pallete.svg`; o desenho (painéis brancos
 * sobre fundo cinza, pílulas, cartão escuro da IA, acento em limão) vem das referências da mesma
 * pasta. Os valores que as telas leem fora do Mantine (fundo, superfícies, cantos) estão em
 * `tokens.css`.
 */

/** A paleta da marca, como veio do arquivo. Os nomes são os que a gente usa no código. */
export const BRAND = {
  ink: "#0e172a",
  navy: "#0f1a3a",
  lime: "#a2ff00",
  cyan: "#00d4ff",
  sky: "#00c3ff",
  yellow: "#ffea2e",
  orange: "#ff7a00",
  coral: "#ff6f61",
  magenta: "#e6007a",
  purple: "#5e17eb",
  paper: "#fbfcf8",
  mist: "#eff7f6",
} as const;

export type BrandColor = keyof typeof BRAND;

function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa
    .map((v, i) =>
      Math.round(v + ((pb[i] ?? 0) - v) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * Dez tons a partir da cor da marca, que fica no 6 (o `primaryShade`): os claros puxam para o
 * branco, os escuros para o azul-tinta — nunca para o preto puro, que acinzenta a cor.
 */
function ramp(base: string): MantineColorsTuple {
  const tints = [0.08, 0.18, 0.32, 0.48, 0.64, 0.82];
  const shades = [0.22, 0.42, 0.6];
  return [
    ...tints.map((t) => mix("#ffffff", base, t)),
    base,
    ...shades.map((t) => mix(base, BRAND.ink, t)),
  ] as unknown as MantineColorsTuple;
}

/** Neutros frios, para conversarem com o texto azul-tinta. */
const gray: MantineColorsTuple = [
  "#f7f8f9",
  "#eff1f3",
  "#e3e6ea",
  "#d0d5db",
  "#aab1bb",
  "#7f8795",
  "#5a6372",
  "#3f4757",
  "#262e3f",
  "#141b2c",
];

/** O "escuro" do Mantine é a escala do azul-tinta: no modo escuro o fundo é marinho, não cinza. */
const dark: MantineColorsTuple = [
  "#e8ebf2",
  "#c3c9d6",
  "#97a0b4",
  "#6c7690",
  "#4b5672",
  "#33405e",
  "#223050",
  "#172340",
  "#0e172a",
  "#080e1c",
];

/** Tinta: o "preto" das pílulas ativas e dos botões escuros. `ink.9` é a cor da marca. */
const ink: MantineColorsTuple = [
  "#e9ecf3",
  "#cdd3e1",
  "#a8b1c8",
  "#7f8baa",
  "#5a6890",
  "#3d4c76",
  "#28375e",
  "#1b2848",
  "#141f3a",
  "#0e172a",
];

/**
 * Variante "light" (fundo clarinho da cor): o texto vai no tom mais escuro da própria cor. O
 * padrão do Mantine usa o tom do meio, e limão sobre limão-claro some.
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);
  if (input.variant !== "light") return colors;
  const parsed = parseThemeColor({
    color: input.color ?? input.theme.primaryColor,
    theme: input.theme,
  });
  if (!parsed.isThemeColor) return colors;
  return {
    ...colors,
    color: `light-dark(var(--mantine-color-${parsed.color}-9), var(--mantine-color-${parsed.color}-3))`,
    hoverColor: `light-dark(var(--mantine-color-${parsed.color}-9), var(--mantine-color-${parsed.color}-3))`,
  };
};

/**
 * `color="inverse"`: tinta no claro, papel no escuro — o botão forte que não é o acento. Não é
 * uma cor do Mantine; os componentes abaixo leem os tokens `--dd-inverse*` direto.
 */
export const INVERSE = "inverse";

export type Corners = "pilula" | "suave";

/** Uma cor da paleta pelo nome, ou qualquer hex (`#rgb` ou `#rrggbb`). */
export type Accent = BrandColor | `#${string}`;

export interface ThemeOptions {
  /** A cor de destaque do app. Padrão: limão. */
  accent?: Accent;
  corners?: Corners;
}

/** O hex do acento, com seis dígitos e em minúsculas. Nome fora da paleta ou hex torto é erro. */
export function accentHex(accent: Accent): string {
  if (!accent.startsWith("#")) {
    const named = BRAND[accent as BrandColor] as string | undefined;
    if (!named)
      throw new Error(`Acento desconhecido: "${accent}". Use um nome da paleta ou um hex.`);
    return named;
  }
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(accent);
  if (short)
    return `#${short
      .slice(1)
      .map((c) => c + c)
      .join("")}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(accent)) return accent.toLowerCase();
  throw new Error(`Acento inválido: "${accent}". O hex precisa de 3 ou 6 dígitos.`);
}

const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const MONO_STACK = "'Geist Mono', ui-monospace, 'Cascadia Code', monospace";

export function buildTheme({ accent = "lime", corners = "pilula" }: ThemeOptions = {}) {
  // Controles (botão, campo, aba): pílula inteira ou canto suave. Painéis sempre arredondados.
  const control = corners === "pilula" ? "xl" : "md";

  return createTheme({
    primaryColor: "accent",
    primaryShade: { light: 6, dark: 6 },
    colors: {
      accent: ramp(accentHex(accent)),
      lime: ramp(BRAND.lime),
      cyan: ramp(BRAND.sky),
      yellow: ramp(BRAND.yellow),
      orange: ramp(BRAND.orange),
      coral: ramp(BRAND.coral),
      magenta: ramp(BRAND.magenta),
      purple: ramp(BRAND.purple),
      ink,
      gray,
      dark,
    },
    // Limão, amarelo e ciano são claros demais para texto branco: o Mantine escolhe a tinta.
    variantColorResolver,
    autoContrast: true,
    luminanceThreshold: 0.4,
    black: BRAND.ink,
    white: "#ffffff",
    fontFamily: `Figtree, ${FONT_STACK}`,
    fontFamilyMonospace: MONO_STACK,
    headings: {
      fontFamily: `Figtree, ${FONT_STACK}`,
      fontWeight: "600",
      sizes: {
        h1: { fontSize: "2.25rem", lineHeight: "1.15" },
        h2: { fontSize: "1.625rem", lineHeight: "1.2" },
        h3: { fontSize: "1.25rem", lineHeight: "1.3" },
        h4: { fontSize: "1.0625rem", lineHeight: "1.35" },
      },
    },
    radius: { xs: "6px", sm: "10px", md: "14px", lg: "20px", xl: "28px" },
    defaultRadius: "md",
    spacing: { xs: "8px", sm: "12px", md: "16px", lg: "24px", xl: "32px" },
    shadows: {
      xs: "0 1px 2px rgb(14 23 42 / 0.05)",
      sm: "0 1px 3px rgb(14 23 42 / 0.06), 0 1px 2px rgb(14 23 42 / 0.04)",
      md: "0 8px 24px -8px rgb(14 23 42 / 0.12)",
      lg: "0 24px 48px -16px rgb(14 23 42 / 0.22)",
      xl: "0 32px 64px -20px rgb(14 23 42 / 0.3)",
    },
    components: {
      Button: Button.extend({
        defaultProps: { radius: control },
        vars: (_theme, props) => {
          if (props.color === INVERSE) {
            return {
              root: {
                "--button-bg": "var(--dd-inverse)",
                "--button-hover": "var(--dd-inverse-hover)",
                "--button-color": "var(--dd-on-inverse)",
              },
            };
          }
          // Botão só de texto nunca vai de limão sobre branco (ilegível): vai de tinta.
          return (props.variant === "subtle" || props.variant === "transparent") && !props.color
            ? { root: { "--button-color": "var(--dd-ink)" } }
            : { root: {} };
        },
      }),
      ActionIcon: ActionIcon.extend({
        defaultProps: { radius: "xl", variant: "default" },
        vars: (_theme, props) =>
          props.color === INVERSE
            ? {
                root: {
                  "--ai-bg": "var(--dd-inverse)",
                  "--ai-hover": "var(--dd-inverse-hover)",
                  "--ai-color": "var(--dd-on-inverse)",
                },
              }
            : { root: {} },
      }),
      Switch: Switch.extend({
        vars: (_theme, props) =>
          props.color === INVERSE
            ? { root: { "--switch-color": "var(--dd-inverse)" } }
            : { root: {} },
      }),
      Progress: Progress.extend({
        vars: (_theme, props) =>
          props.color === INVERSE
            ? { root: {}, section: { "--progress-section-color": "var(--dd-inverse)" } }
            : { root: {}, section: {} },
      }),
      Avatar: Avatar.extend({
        vars: (_theme, props) =>
          props.color === INVERSE
            ? {
                root: {
                  "--avatar-bg": "var(--dd-inverse)",
                  "--avatar-color": "var(--dd-on-inverse)",
                },
              }
            : { root: {} },
      }),
      Badge: Badge.extend({
        defaultProps: { radius: "xl", variant: "light" },
        styles: { root: { textTransform: "none", fontWeight: 500, letterSpacing: 0 } },
      }),
      TextInput: TextInput.extend({ defaultProps: { radius: control } }),
      Select: Select.extend({ defaultProps: { radius: control } }),
      Textarea: Textarea.extend({ defaultProps: { radius: "md" } }),
      SegmentedControl: SegmentedControl.extend({ defaultProps: { radius: control } }),
      Checkbox: Checkbox.extend({ defaultProps: { radius: "xs" } }),
      Tabs: Tabs.extend({ defaultProps: { radius: control } }),
      Paper: Paper.extend({ defaultProps: { radius: "xl" } }),
      Card: Card.extend({ defaultProps: { radius: "xl", padding: "lg" } }),
      Modal: Modal.extend({ defaultProps: { radius: "xl", padding: "lg", centered: true } }),
      Tooltip: Tooltip.extend({
        defaultProps: { radius: "sm" },
        vars: () => ({
          tooltip: {
            "--tooltip-bg": "var(--dd-inverse)",
            "--tooltip-color": "var(--dd-on-inverse)",
          },
        }),
      }),
      Anchor: Anchor.extend({ defaultProps: { c: "var(--dd-ink)", underline: "hover" } }),
    },
  });
}

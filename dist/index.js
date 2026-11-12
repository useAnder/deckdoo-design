// src/theme.ts
import {
  ActionIcon,
  Anchor,
  Autocomplete,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  FileInput,
  Modal,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Paper,
  PasswordInput,
  SegmentedControl,
  Tabs,
  Textarea,
  TextInput,
  Select,
  Switch,
  TagsInput,
  Tooltip,
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor
} from "@mantine/core";
var BRAND = {
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
  mist: "#eff7f6"
};
function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map(
    (v, i) => Math.round(v + ((pb[i] ?? 0) - v) * t).toString(16).padStart(2, "0")
  ).join("")}`;
}
function ramp(base) {
  const tints = [0.08, 0.18, 0.32, 0.48, 0.64, 0.82];
  const shades = [0.22, 0.42, 0.6];
  return [
    ...tints.map((t) => mix("#ffffff", base, t)),
    base,
    ...shades.map((t) => mix(base, BRAND.ink, t))
  ];
}
var gray = [
  "#f7f8f9",
  "#eff1f3",
  "#e3e6ea",
  "#d0d5db",
  "#aab1bb",
  "#7f8795",
  "#5a6372",
  "#3f4757",
  "#262e3f",
  "#141b2c"
];
var dark = [
  "#e8ebf2",
  "#c3c9d6",
  "#97a0b4",
  "#6c7690",
  "#4b5672",
  "#33405e",
  "#223050",
  "#172340",
  "#0e172a",
  "#080e1c"
];
var ink = [
  "#e9ecf3",
  "#cdd3e1",
  "#a8b1c8",
  "#7f8baa",
  "#5a6890",
  "#3d4c76",
  "#28375e",
  "#1b2848",
  "#141f3a",
  "#0e172a"
];
var variantColorResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);
  if (input.variant !== "light") return colors;
  const parsed = parseThemeColor({
    color: input.color ?? input.theme.primaryColor,
    theme: input.theme
  });
  if (!parsed.isThemeColor) return colors;
  return {
    ...colors,
    color: `light-dark(var(--mantine-color-${parsed.color}-9), var(--mantine-color-${parsed.color}-3))`,
    hoverColor: `light-dark(var(--mantine-color-${parsed.color}-9), var(--mantine-color-${parsed.color}-3))`
  };
};
var INVERSE = "inverse";
var CORNERS = {
  pilula: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "20px",
    xl: "28px",
    control: "999px",
    pill: "999px"
  },
  suave: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "20px",
    xl: "28px",
    control: "14px",
    pill: "999px"
  },
  sutil: { xs: "4px", sm: "6px", md: "8px", lg: "12px", xl: "16px", control: "8px", pill: "8px" },
  reto: { xs: "0px", sm: "0px", md: "0px", lg: "0px", xl: "0px", control: "0px", pill: "0px" }
};
function accentHex(accent) {
  if (!accent.startsWith("#")) {
    const named2 = BRAND[accent];
    if (!named2)
      throw new Error(`Acento desconhecido: "${accent}". Use um nome da paleta ou um hex.`);
    return named2;
  }
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(accent);
  if (short)
    return `#${short.slice(1).map((c) => c + c).join("")}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(accent)) return accent.toLowerCase();
  throw new Error(`Acento inv\xE1lido: "${accent}". O hex precisa de 3 ou 6 d\xEDgitos.`);
}
var FONT_STACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";
var MONO_STACK = "'Geist Mono', ui-monospace, 'Cascadia Code', monospace";
function buildTheme({ accent = "lime", corners = "pilula" } = {}) {
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
      dark
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
        h4: { fontSize: "1.0625rem", lineHeight: "1.35" }
      }
    },
    // `control` e `pill` não são chaves do Mantine, mas ele emite toda chave como variável CSS.
    radius: CORNERS[corners],
    defaultRadius: "md",
    spacing: { xs: "8px", sm: "12px", md: "16px", lg: "24px", xl: "32px" },
    shadows: {
      xs: "0 1px 2px rgb(14 23 42 / 0.05)",
      sm: "0 1px 3px rgb(14 23 42 / 0.06), 0 1px 2px rgb(14 23 42 / 0.04)",
      md: "0 8px 24px -8px rgb(14 23 42 / 0.12)",
      lg: "0 24px 48px -16px rgb(14 23 42 / 0.22)",
      xl: "0 32px 64px -20px rgb(14 23 42 / 0.3)"
    },
    components: {
      Button: Button.extend({
        defaultProps: { radius: "control" },
        vars: (_theme, props) => {
          if (props.color === INVERSE) {
            return {
              root: {
                "--button-bg": "var(--dd-inverse)",
                "--button-hover": "var(--dd-inverse-hover)",
                "--button-color": "var(--dd-on-inverse)"
              }
            };
          }
          return (props.variant === "subtle" || props.variant === "transparent") && !props.color ? { root: { "--button-color": "var(--dd-ink)" } } : { root: {} };
        }
      }),
      ActionIcon: ActionIcon.extend({
        defaultProps: { radius: "pill", variant: "default" },
        vars: (_theme, props) => props.color === INVERSE ? {
          root: {
            "--ai-bg": "var(--dd-inverse)",
            "--ai-hover": "var(--dd-inverse-hover)",
            "--ai-color": "var(--dd-on-inverse)"
          }
        } : { root: {} }
      }),
      Switch: Switch.extend({
        vars: (_theme, props) => props.color === INVERSE ? { root: { "--switch-color": "var(--dd-inverse)" } } : { root: {} }
      }),
      // O `Progress` com `color="inverse"` não passa por aqui: o `Progress` tira o `color` das props
      // que repassa ao `Root`, e é o `Root` que resolve `vars` e `styles` do tema; a barra grava
      // `--progress-section-color` no próprio estilo inline. Testado: nem `vars` nem `styles` do tema
      // chegam a ela. O conserto é uma regra em `design.css` (`.mantine-Progress-section`).
      Avatar: Avatar.extend({
        vars: (_theme, props) => props.color === INVERSE ? {
          root: {
            "--avatar-bg": "var(--dd-inverse)",
            "--avatar-color": "var(--dd-on-inverse)"
          }
        } : { root: {} }
      }),
      Badge: Badge.extend({
        defaultProps: { radius: "pill", variant: "light" },
        styles: { root: { textTransform: "none", fontWeight: 500, letterSpacing: 0 } }
      }),
      // Todo campo de uma linha é controle, não só o `TextInput`: cada componente do Mantine
      // tem o próprio padrão, e o que fica de fora cai no `defaultRadius` (canto 14). Foi
      // assim que o campo de senha destoou do e-mail ao lado no login do Hub. Campo novo
      // de uma linha entra aqui; o `Textarea`, de várias, fica no canto de bloco.
      TextInput: TextInput.extend({ defaultProps: { radius: "control" } }),
      PasswordInput: PasswordInput.extend({ defaultProps: { radius: "control" } }),
      NumberInput: NumberInput.extend({ defaultProps: { radius: "control" } }),
      Select: Select.extend({ defaultProps: { radius: "control" } }),
      MultiSelect: MultiSelect.extend({ defaultProps: { radius: "control" } }),
      Autocomplete: Autocomplete.extend({ defaultProps: { radius: "control" } }),
      TagsInput: TagsInput.extend({ defaultProps: { radius: "control" } }),
      NativeSelect: NativeSelect.extend({ defaultProps: { radius: "control" } }),
      FileInput: FileInput.extend({ defaultProps: { radius: "control" } }),
      Textarea: Textarea.extend({ defaultProps: { radius: "md" } }),
      SegmentedControl: SegmentedControl.extend({ defaultProps: { radius: "control" } }),
      Checkbox: Checkbox.extend({ defaultProps: { radius: "xs" } }),
      Tabs: Tabs.extend({ defaultProps: { radius: "control" } }),
      Paper: Paper.extend({ defaultProps: { radius: "xl" } }),
      Card: Card.extend({ defaultProps: { radius: "xl", padding: "lg" } }),
      Modal: Modal.extend({ defaultProps: { radius: "xl", padding: "lg", centered: true } }),
      Tooltip: Tooltip.extend({
        defaultProps: { radius: "sm" },
        vars: () => ({
          tooltip: {
            "--tooltip-bg": "var(--dd-inverse)",
            "--tooltip-color": "var(--dd-on-inverse)"
          }
        })
      }),
      Anchor: Anchor.extend({ defaultProps: { c: "var(--dd-ink)", underline: "hover" } })
    }
  });
}

// src/brand.tsx
import { createContext, useContext } from "react";

// src/brand/deckdoo-logotype.svg
var deckdoo_logotype_default = "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%20%3Csvg%20id%3D%22Camada_2%22%20data-name%3D%22Camada%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20723.96%20125.3%22%3E%20%3Cdefs%3E%20%3Cstyle%3E%20.cls-1%20%7B%20fill%3A%20%230e172a%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fdefs%3E%20%3Cg%20id%3D%22Camada_1-2%22%20data-name%3D%22Camada%201%22%3E%20%3Cg%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M197.37%2C21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97%2C0%2C17.13-2.04%2C24.47-6.12%2C7.34-4.08%2C13.09-9.7%2C17.26-16.86%2C4.17-7.16%2C6.25-15.13%2C6.25-23.92s-2.08-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM196.35%2C76.88c-2.4%2C4.21-5.69%2C7.52-9.86%2C9.92-4.17%2C2.4-8.83%2C3.6-14%2C3.6h-16.04v-55.46h16.04c5.17%2C0%2C9.83%2C1.2%2C14%2C3.6%2C4.17%2C2.4%2C7.45%2C5.71%2C9.86%2C9.92%2C2.4%2C4.21%2C3.6%2C8.95%2C3.6%2C14.2s-1.2%2C9.99-3.6%2C14.21Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M286.27%2C43.37c-5.71-3.17-12.01-4.76-18.89-4.76s-13.44%2C1.59-19.1%2C4.76c-5.66%2C3.17-10.13%2C7.52-13.39%2C13.05-3.26%2C5.53-4.89%2C11.69-4.89%2C18.49s1.63%2C12.96%2C4.89%2C18.49c3.26%2C5.53%2C7.72%2C9.88%2C13.39%2C13.05%2C5.66%2C3.17%2C12.03%2C4.76%2C19.1%2C4.76%2C8.52%2C0%2C16.02-2.2%2C22.5-6.59%2C6.48-4.39%2C10.94-10.26%2C13.39-17.6h-20.39c-1.18%2C2.17-3.15%2C3.96-5.91%2C5.37-2.77%2C1.41-5.87%2C2.11-9.31%2C2.11s-6.52-.82-9.24-2.45-4.85-3.92-6.39-6.86c-.63-1.21-1.13-2.5-1.5-3.87h53.7c.27-1.63.41-3.67.41-6.12%2C0-6.89-1.63-13.12-4.89-18.69s-7.75-9.94-13.46-13.12ZM258.27%2C57.78c2.72-1.63%2C5.75-2.45%2C9.11-2.45s6.23.77%2C8.9%2C2.31c2.67%2C1.54%2C4.78%2C3.72%2C6.32%2C6.52.68%2C1.23%2C1.19%2C2.55%2C1.57%2C3.94h-33.55c.34-1.19.78-2.32%2C1.32-3.4%2C1.5-2.99%2C3.6-5.3%2C6.32-6.93Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M340.43%2C59.41c2.67-1.54%2C5.69-2.31%2C9.04-2.31%2C3.71%2C0%2C7%2C.98%2C9.86%2C2.92%2C2.85%2C1.95%2C4.96%2C4.51%2C6.32%2C7.68h20.39c-1.09-5.62-3.33-10.62-6.73-15.02-3.4-4.39-7.68-7.84-12.85-10.33-5.17-2.49-10.83-3.74-16.99-3.74-7.07%2C0-13.44%2C1.59-19.1%2C4.76-5.66%2C3.17-10.13%2C7.52-13.39%2C13.05-3.26%2C5.53-4.89%2C11.69-4.89%2C18.49s1.63%2C12.96%2C4.89%2C18.49c3.26%2C5.53%2C7.72%2C9.88%2C13.39%2C13.05%2C5.66%2C3.17%2C12.03%2C4.76%2C19.1%2C4.76%2C6.16%2C0%2C11.83-1.25%2C16.99-3.74%2C5.17-2.49%2C9.45-5.93%2C12.85-10.33%2C3.4-4.39%2C5.64-9.4%2C6.73-15.02h-20.39c-1.36%2C3.17-3.47%2C5.73-6.32%2C7.68-2.86%2C1.95-6.14%2C2.92-9.86%2C2.92-3.35%2C0-6.37-.77-9.04-2.31-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39%2C2.31-9.11c1.54-2.72%2C3.65-4.85%2C6.32-6.39Z%22%2F%3E%20%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22462.98%2040.25%20440%2040.25%20423.85%2065.94%20416.76%2065.94%20416.76%2011.7%20397.59%2011.7%20397.59%20109.57%20416.76%20109.57%20416.76%2083.34%20423.79%2083.34%20440.55%20109.57%20463.93%20109.57%20439.63%2074.7%20462.98%2040.25%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M534.2%2C21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97%2C0%2C17.13-2.04%2C24.47-6.12%2C7.34-4.08%2C13.09-9.7%2C17.26-16.86%2C4.17-7.16%2C6.25-15.13%2C6.25-23.92s-2.09-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM533.18%2C76.88c-2.4%2C4.21-5.69%2C7.52-9.85%2C9.92-4.17%2C2.4-8.84%2C3.6-14%2C3.6h-16.04v-55.46h16.04c5.17%2C0%2C9.83%2C1.2%2C14%2C3.6%2C4.17%2C2.4%2C7.45%2C5.71%2C9.85%2C9.92%2C2.4%2C4.21%2C3.6%2C8.95%2C3.6%2C14.2s-1.2%2C9.99-3.6%2C14.21Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M623.24%2C43.37c-5.71-3.17-12.05-4.76-19.03-4.76s-13.32%2C1.59-19.03%2C4.76c-5.71%2C3.17-10.2%2C7.52-13.46%2C13.05-3.26%2C5.53-4.89%2C11.69-4.89%2C18.49s1.63%2C12.96%2C4.89%2C18.49c3.26%2C5.53%2C7.75%2C9.88%2C13.46%2C13.05%2C5.71%2C3.17%2C12.05%2C4.76%2C19.03%2C4.76s13.32-1.59%2C19.03-4.76c5.71-3.17%2C10.17-7.52%2C13.39-13.05%2C3.22-5.53%2C4.83-11.69%2C4.83-18.49s-1.61-12.96-4.83-18.49c-3.22-5.53-7.68-9.88-13.39-13.05ZM619.43%2C84.02c-1.54%2C2.72-3.65%2C4.85-6.32%2C6.39-2.67%2C1.54-5.64%2C2.31-8.9%2C2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39%2C2.31-9.11c1.54-2.72%2C3.65-4.85%2C6.32-6.39%2C2.67-1.54%2C5.64-2.31%2C8.9-2.31s6.37.77%2C9.04%2C2.31c2.67%2C1.54%2C4.78%2C3.67%2C6.32%2C6.39%2C1.54%2C2.72%2C2.31%2C5.76%2C2.31%2C9.11s-.77%2C6.39-2.31%2C9.11Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M719.13%2C56.42c-3.22-5.53-7.68-9.88-13.39-13.05-5.71-3.17-12.05-4.76-19.03-4.76s-13.32%2C1.59-19.03%2C4.76c-5.71%2C3.17-10.2%2C7.52-13.46%2C13.05-3.26%2C5.53-4.89%2C11.69-4.89%2C18.49s1.63%2C12.96%2C4.89%2C18.49c3.26%2C5.53%2C7.75%2C9.88%2C13.46%2C13.05%2C5.71%2C3.17%2C12.05%2C4.76%2C19.03%2C4.76s13.32-1.59%2C19.03-4.76c5.71-3.17%2C10.17-7.52%2C13.39-13.05%2C3.22-5.53%2C4.83-11.69%2C4.83-18.49s-1.61-12.96-4.83-18.49ZM701.94%2C84.02c-1.54%2C2.72-3.65%2C4.85-6.32%2C6.39-2.67%2C1.54-5.64%2C2.31-8.9%2C2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39%2C2.31-9.11c1.54-2.72%2C3.65-4.85%2C6.32-6.39%2C2.67-1.54%2C5.64-2.31%2C8.9-2.31s6.37.77%2C9.04%2C2.31c2.67%2C1.54%2C4.78%2C3.67%2C6.32%2C6.39%2C1.54%2C2.72%2C2.31%2C5.76%2C2.31%2C9.11s-.77%2C6.39-2.31%2C9.11Z%22%2F%3E%20%3C%2Fg%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M89.9%2C37.81c-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59Z%22%2F%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M47.52%2C34.22c-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M114.39%2C61.66c-.99.77-2.04%2C1.49-3.18%2C2.12-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.36-1.87%2C7.09-2.9%2C11.16-3.1-4.13-4.25-8.87-7.89-14.27-10.89C73%2C2.72%2C62.04%2C0%2C49.94%2C0h-28.99C9.38%2C0%2C0%2C9.38%2C0%2C20.95v83.4c0%2C11.57%2C9.38%2C20.95%2C20.95%2C20.95h28.99c12.1%2C0%2C23.06-2.72%2C32.87-8.17%2C9.81-5.45%2C17.52-12.95%2C23.15-22.52%2C5.63-9.56%2C8.44-20.22%2C8.44-31.96%2C0-.33-.01-.66-.01-.99ZM63.98%2C55.17c-2.15%2C3.65-5.11%2C6.52-8.88%2C8.61-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.77-2.09%2C7.98-3.14%2C12.65-3.14s8.88%2C1.05%2C12.65%2C3.14c3.77%2C2.09%2C6.73%2C4.96%2C8.88%2C8.61%2C2.15%2C3.65%2C3.23%2C7.71%2C3.23%2C12.2s-1.08%2C8.55-3.23%2C12.2Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E";

// src/brand/deckdoo-logotype-inverse.svg
var deckdoo_logotype_inverse_default = "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%20%3Csvg%20id%3D%22Camada_2%22%20data-name%3D%22Camada%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20390.64%2079.53%22%3E%20%3Cdefs%3E%20%3Cstyle%3E%20.cls-1%20%7B%20fill%3A%20%23fff%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fdefs%3E%20%3Cg%20id%3D%22Camada_1-2%22%20data-name%3D%22Camada%201%22%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M115.23%2C18.45c-3.84-2.13-8.1-3.2-12.8-3.2h-19.27v49.05h19.27c4.69%2C0%2C8.96-1.07%2C12.8-3.2%2C3.84-2.13%2C6.85-5.07%2C9.03-8.82%2C2.18-3.74%2C3.27-7.91%2C3.27-12.51s-1.09-8.77-3.27-12.51c-2.18-3.74-5.19-6.68-9.03-8.82ZM114.69%2C47.21c-1.26%2C2.2-2.97%2C3.93-5.15%2C5.19-2.18%2C1.26-4.62%2C1.88-7.32%2C1.88h-8.39v-29.01h8.39c2.7%2C0%2C5.14.63%2C7.32%2C1.88%2C2.18%2C1.26%2C3.9%2C2.99%2C5.15%2C5.19%2C1.26%2C2.2%2C1.88%2C4.68%2C1.88%2C7.43s-.63%2C5.23-1.88%2C7.43Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M161.72%2C29.68c-2.99-1.66-6.28-2.49-9.88-2.49s-7.03.83-9.99%2C2.49c-2.96%2C1.66-5.3%2C3.93-7%2C6.82-1.71%2C2.89-2.56%2C6.11-2.56%2C9.67s.85%2C6.78%2C2.56%2C9.67c1.71%2C2.89%2C4.04%2C5.17%2C7%2C6.83%2C2.96%2C1.66%2C6.29%2C2.49%2C9.99%2C2.49%2C4.45%2C0%2C8.38-1.15%2C11.77-3.45%2C3.39-2.3%2C5.72-5.37%2C7-9.21h-10.66c-.62%2C1.14-1.65%2C2.07-3.09%2C2.81-1.45.74-3.07%2C1.1-4.87%2C1.1s-3.41-.43-4.83-1.28-2.54-2.05-3.34-3.59c-.33-.63-.59-1.31-.79-2.03h28.08c.14-.85.21-1.92.21-3.2%2C0-3.6-.85-6.86-2.56-9.78s-4.05-5.2-7.04-6.86ZM147.07%2C37.22c1.42-.85%2C3.01-1.28%2C4.76-1.28s3.26.4%2C4.66%2C1.21c1.4.81%2C2.5%2C1.94%2C3.31%2C3.41.35.65.62%2C1.33.82%2C2.06h-17.55c.18-.62.41-1.21.69-1.78.78-1.56%2C1.88-2.77%2C3.31-3.63Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M190.05%2C38.07c1.4-.81%2C2.97-1.21%2C4.73-1.21%2C1.94%2C0%2C3.66.51%2C5.15%2C1.53%2C1.49%2C1.02%2C2.59%2C2.36%2C3.31%2C4.02h10.66c-.57-2.94-1.74-5.56-3.52-7.86-1.78-2.3-4.02-4.1-6.72-5.4-2.7-1.3-5.66-1.96-8.89-1.96-3.7%2C0-7.03.83-9.99%2C2.49-2.96%2C1.66-5.3%2C3.93-7%2C6.82-1.71%2C2.89-2.56%2C6.11-2.56%2C9.67s.85%2C6.78%2C2.56%2C9.67c1.71%2C2.89%2C4.04%2C5.17%2C7%2C6.83%2C2.96%2C1.66%2C6.29%2C2.49%2C9.99%2C2.49%2C3.22%2C0%2C6.19-.65%2C8.89-1.95%2C2.7-1.3%2C4.94-3.1%2C6.72-5.4%2C1.78-2.3%2C2.95-4.92%2C3.52-7.86h-10.66c-.71%2C1.66-1.81%2C3-3.31%2C4.02-1.49%2C1.02-3.21%2C1.53-5.15%2C1.53-1.75%2C0-3.33-.4-4.73-1.21-1.4-.81-2.5-1.92-3.31-3.34-.81-1.42-1.21-3.01-1.21-4.76s.4-3.34%2C1.21-4.76c.81-1.42%2C1.91-2.53%2C3.31-3.34Z%22%2F%3E%20%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22254.14%2028.05%20242.12%2028.05%20233.68%2041.49%20229.97%2041.49%20229.97%2013.12%20219.94%2013.12%20219.94%2064.31%20229.97%2064.31%20229.97%2050.59%20233.65%2050.59%20242.41%2064.31%20254.64%2064.31%20241.93%2046.07%20254.14%2028.05%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M291.39%2C18.45c-3.84-2.13-8.1-3.2-12.8-3.2h-19.27v49.05h19.27c4.69%2C0%2C8.96-1.07%2C12.8-3.2%2C3.84-2.13%2C6.85-5.07%2C9.03-8.82%2C2.18-3.74%2C3.27-7.91%2C3.27-12.51s-1.09-8.77-3.27-12.51c-2.18-3.74-5.19-6.68-9.03-8.82ZM290.86%2C47.21c-1.26%2C2.2-2.97%2C3.93-5.15%2C5.19-2.18%2C1.26-4.62%2C1.88-7.32%2C1.88h-8.39v-29.01h8.39c2.7%2C0%2C5.14.63%2C7.32%2C1.88%2C2.18%2C1.26%2C3.9%2C2.99%2C5.15%2C5.19%2C1.26%2C2.2%2C1.88%2C4.68%2C1.88%2C7.43s-.63%2C5.23-1.88%2C7.43Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M337.96%2C29.68c-2.99-1.66-6.3-2.49-9.95-2.49s-6.97.83-9.95%2C2.49c-2.99%2C1.66-5.33%2C3.93-7.04%2C6.82-1.71%2C2.89-2.56%2C6.11-2.56%2C9.67s.85%2C6.78%2C2.56%2C9.67c1.71%2C2.89%2C4.05%2C5.17%2C7.04%2C6.83%2C2.99%2C1.66%2C6.3%2C2.49%2C9.95%2C2.49s6.97-.83%2C9.95-2.49c2.99-1.66%2C5.32-3.93%2C7-6.83%2C1.68-2.89%2C2.52-6.11%2C2.52-9.67s-.84-6.78-2.52-9.67c-1.68-2.89-4.02-5.17-7-6.82ZM335.97%2C50.94c-.81%2C1.42-1.91%2C2.54-3.31%2C3.34-1.4.81-2.95%2C1.21-4.66%2C1.21s-3.33-.4-4.73-1.21c-1.4-.81-2.5-1.92-3.31-3.34-.81-1.42-1.21-3.01-1.21-4.76s.4-3.34%2C1.21-4.76c.81-1.42%2C1.91-2.53%2C3.31-3.34%2C1.4-.81%2C2.95-1.21%2C4.66-1.21s3.33.4%2C4.73%2C1.21c1.4.81%2C2.5%2C1.92%2C3.31%2C3.34.81%2C1.42%2C1.21%2C3.01%2C1.21%2C4.76s-.4%2C3.34-1.21%2C4.76Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M388.11%2C36.51c-1.68-2.89-4.02-5.17-7-6.82-2.99-1.66-6.3-2.49-9.95-2.49s-6.97.83-9.95%2C2.49c-2.99%2C1.66-5.33%2C3.93-7.04%2C6.82-1.71%2C2.89-2.56%2C6.11-2.56%2C9.67s.85%2C6.78%2C2.56%2C9.67c1.71%2C2.89%2C4.05%2C5.17%2C7.04%2C6.83%2C2.99%2C1.66%2C6.3%2C2.49%2C9.95%2C2.49s6.97-.83%2C9.95-2.49c2.99-1.66%2C5.32-3.93%2C7-6.83%2C1.68-2.89%2C2.52-6.11%2C2.52-9.67s-.84-6.78-2.52-9.67ZM379.12%2C50.94c-.81%2C1.42-1.91%2C2.54-3.31%2C3.34-1.4.81-2.95%2C1.21-4.66%2C1.21s-3.33-.4-4.73-1.21c-1.4-.81-2.5-1.92-3.31-3.34-.81-1.42-1.21-3.01-1.21-4.76s.4-3.34%2C1.21-4.76c.81-1.42%2C1.91-2.53%2C3.31-3.34%2C1.4-.81%2C2.95-1.21%2C4.66-1.21s3.33.4%2C4.73%2C1.21c1.4.81%2C2.5%2C1.92%2C3.31%2C3.34.81%2C1.42%2C1.21%2C3.01%2C1.21%2C4.76s-.4%2C3.34-1.21%2C4.76Z%22%2F%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M40.46%2C23.09c-1.13-1.91-2.67-3.41-4.64-4.5-1.97-1.09-4.18-1.64-6.61-1.64s-4.64.55-6.61%2C1.64c-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c1.97-1.09%2C3.52-2.6%2C4.64-4.5%2C1.13-1.91%2C1.69-4.03%2C1.69-6.38s-.56-4.47-1.69-6.38ZM33.73%2C32.17c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M68.45%2C19.5c-3.57-6.07-8.53-10.9-14.74-14.34C47.55%2C1.73%2C40.62%2C0%2C33.12%2C0h-15.16C8.06%2C0%2C0%2C8.05%2C0%2C17.96v43.62c0%2C9.9%2C8.06%2C17.96%2C17.96%2C17.96h15.16c7.51%2C0%2C14.43-1.73%2C20.59-5.16%2C6.21-3.45%2C11.17-8.28%2C14.74-14.34%2C3.57-6.07%2C5.38-12.89%2C5.38-20.27s-1.81-14.2-5.38-20.27ZM61.2%2C24.9c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68ZM62.42%2C56.48c-2.94%2C5-6.98%2C8.93-12.11%2C11.78-5.13%2C2.85-10.86%2C4.27-17.19%2C4.27h-15.16c-6.05%2C0-10.96-4.91-10.96-10.96V17.96c0-6.05%2C4.91-10.96%2C10.96-10.96h15.16c6.33%2C0%2C12.06%2C1.42%2C17.19%2C4.27%2C2.82%2C1.57%2C5.3%2C3.47%2C7.46%2C5.7-2.13.1-4.08.64-5.84%2C1.62-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c.59-.33%2C1.15-.7%2C1.66-1.11%2C0%2C.17%2C0%2C.34%2C0%2C.52%2C0%2C6.14-1.47%2C11.71-4.42%2C16.72Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E";

// src/brand/deckdoo-mark.svg
var deckdoo_mark_default = "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%20%3Csvg%20id%3D%22Camada_2%22%20data-name%3D%22Camada%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20114.4%20125.3%22%3E%20%3Cdefs%3E%20%3Cstyle%3E%20.cls-1%20%7B%20fill%3A%20%230e172a%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fdefs%3E%20%3Cg%20id%3D%22Camada_1-2%22%20data-name%3D%22Camada%201%22%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M89.9%2C37.81c-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59Z%22%2F%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M47.52%2C34.22c-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M114.39%2C61.66c-.99.77-2.04%2C1.49-3.18%2C2.12-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.36-1.87%2C7.09-2.9%2C11.16-3.1-4.13-4.25-8.87-7.89-14.27-10.89C73%2C2.72%2C62.04%2C0%2C49.94%2C0h-28.99C9.38%2C0%2C0%2C9.38%2C0%2C20.95v83.4c0%2C11.57%2C9.38%2C20.95%2C20.95%2C20.95h28.99c12.1%2C0%2C23.06-2.72%2C32.87-8.17%2C9.81-5.45%2C17.52-12.95%2C23.15-22.52%2C5.63-9.56%2C8.44-20.22%2C8.44-31.96%2C0-.33-.01-.66-.01-.99ZM63.98%2C55.17c-2.15%2C3.65-5.11%2C6.52-8.88%2C8.61-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.77-2.09%2C7.98-3.14%2C12.65-3.14s8.88%2C1.05%2C12.65%2C3.14c3.77%2C2.09%2C6.73%2C4.96%2C8.88%2C8.61%2C2.15%2C3.65%2C3.23%2C7.71%2C3.23%2C12.2s-1.08%2C8.55-3.23%2C12.2Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E";

// src/brand/deckdoo-mark-inverse.svg
var deckdoo_mark_inverse_default = "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%20%3Csvg%20id%3D%22Camada_2%22%20data-name%3D%22Camada%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2073.83%2079.53%22%3E%20%3Cdefs%3E%20%3Cstyle%3E%20.cls-1%20%7B%20fill%3A%20%23fff%3B%20%7D%20%3C%2Fstyle%3E%20%3C%2Fdefs%3E%20%3Cg%20id%3D%22Camada_1-2%22%20data-name%3D%22Camada%201%22%3E%20%3Cg%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M40.46%2C23.09c-1.13-1.91-2.67-3.41-4.64-4.5-1.97-1.09-4.18-1.64-6.61-1.64s-4.64.55-6.61%2C1.64c-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c1.97-1.09%2C3.52-2.6%2C4.64-4.5%2C1.13-1.91%2C1.69-4.03%2C1.69-6.38s-.56-4.47-1.69-6.38ZM33.73%2C32.17c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7Z%22%2F%3E%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M68.45%2C19.5c-3.57-6.07-8.53-10.9-14.74-14.34C47.55%2C1.73%2C40.62%2C0%2C33.12%2C0h-15.16C8.06%2C0%2C0%2C8.05%2C0%2C17.96v43.62c0%2C9.9%2C8.06%2C17.96%2C17.96%2C17.96h15.16c7.51%2C0%2C14.43-1.73%2C20.59-5.16%2C6.21-3.45%2C11.17-8.28%2C14.74-14.34%2C3.57-6.07%2C5.38-12.89%2C5.38-20.27s-1.81-14.2-5.38-20.27ZM61.2%2C24.9c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68ZM62.42%2C56.48c-2.94%2C5-6.98%2C8.93-12.11%2C11.78-5.13%2C2.85-10.86%2C4.27-17.19%2C4.27h-15.16c-6.05%2C0-10.96-4.91-10.96-10.96V17.96c0-6.05%2C4.91-10.96%2C10.96-10.96h15.16c6.33%2C0%2C12.06%2C1.42%2C17.19%2C4.27%2C2.82%2C1.57%2C5.3%2C3.47%2C7.46%2C5.7-2.13.1-4.08.64-5.84%2C1.62-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c.59-.33%2C1.15-.7%2C1.66-1.11%2C0%2C.17%2C0%2C.34%2C0%2C.52%2C0%2C6.14-1.47%2C11.71-4.42%2C16.72Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E";

// src/brand.tsx
import { jsx } from "react/jsx-runtime";
var DECKDOO_BRAND = {
  name: "DeckDoo",
  type: {
    light: { url: deckdoo_logotype_default, ratio: 723.96 / 125.3 },
    dark: { url: deckdoo_logotype_inverse_default, ratio: 390.64 / 79.53 }
  },
  mark: {
    light: { url: deckdoo_mark_default, ratio: 114.4 / 125.3 },
    dark: { url: deckdoo_mark_inverse_default, ratio: 73.83 / 79.53 }
  }
};
var BrandContext = createContext(DECKDOO_BRAND);
var AppContext = createContext(void 0);
function DesignProvider({
  brand,
  app,
  children
}) {
  return /* @__PURE__ */ jsx(BrandContext.Provider, { value: brand ?? DECKDOO_BRAND, children: /* @__PURE__ */ jsx(AppContext.Provider, { value: app, children }) });
}
function useBrand() {
  return useContext(BrandContext);
}
function useLockupApp() {
  return useContext(AppContext);
}

// src/lockup-spec.ts
var LOCKUP_SPEC = {
  weight: 300,
  autoWeight: true,
  tracking: 0,
  compact: { cap: 0.62, gap: 1, align: "center" },
  stacked: { cap: 0.62, word: 0.26, gap: 0.95, knock: false },
  inline: { cap: 1, gap: 0.75, rule: false }
};
var LARGE = 56;
var SMALL = 20;
var HEAVY = 400;
function lockupWeight(height, spec = LOCKUP_SPEC) {
  const w = spec.weight;
  if (!spec.autoWeight || height >= LARGE) return w;
  const heavy = Math.max(w, HEAVY);
  if (height <= SMALL) return heavy;
  const t = (height - SMALL) / (LARGE - SMALL);
  return Math.round((heavy + (w - heavy) * t) / 10) * 10;
}
function lockupWeights(spec = LOCKUP_SPEC) {
  if (!spec.autoWeight) return [spec.weight];
  const heavy = Math.max(spec.weight, HEAVY);
  const mid = Math.round((spec.weight + heavy) / 20) * 10;
  return [.../* @__PURE__ */ new Set([spec.weight, mid, heavy])];
}

// src/word.ts
var DECKDOO_WORD = {
  /** Onde a tinta começa e termina na horizontal. */
  left: 136.06,
  right: 723.96,
  /** Topo do "k" (a ascendente passa da maiúscula), topo do "D" e linha de base. */
  ascender: 11.7,
  capTop: 15.78,
  baseline: 109.57,
  /** O "o" passa um pouco da base. */
  bottom: 111.7,
  paths: [
    "M197.37,21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97,0,17.13-2.04,24.47-6.12,7.34-4.08,13.09-9.7,17.26-16.86,4.17-7.16,6.25-15.13,6.25-23.92s-2.08-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM196.35,76.88c-2.4,4.21-5.69,7.52-9.86,9.92-4.17,2.4-8.83,3.6-14,3.6h-16.04v-55.46h16.04c5.17,0,9.83,1.2,14,3.6,4.17,2.4,7.45,5.71,9.86,9.92,2.4,4.21,3.6,8.95,3.6,14.2s-1.2,9.99-3.6,14.21Z",
    "M286.27,43.37c-5.71-3.17-12.01-4.76-18.89-4.76s-13.44,1.59-19.1,4.76c-5.66,3.17-10.13,7.52-13.39,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.72,9.88,13.39,13.05,5.66,3.17,12.03,4.76,19.1,4.76,8.52,0,16.02-2.2,22.5-6.59,6.48-4.39,10.94-10.26,13.39-17.6h-20.39c-1.18,2.17-3.15,3.96-5.91,5.37-2.77,1.41-5.87,2.11-9.31,2.11s-6.52-.82-9.24-2.45-4.85-3.92-6.39-6.86c-.63-1.21-1.13-2.5-1.5-3.87h53.7c.27-1.63.41-3.67.41-6.12,0-6.89-1.63-13.12-4.89-18.69s-7.75-9.94-13.46-13.12ZM258.27,57.78c2.72-1.63,5.75-2.45,9.11-2.45s6.23.77,8.9,2.31c2.67,1.54,4.78,3.72,6.32,6.52.68,1.23,1.19,2.55,1.57,3.94h-33.55c.34-1.19.78-2.32,1.32-3.4,1.5-2.99,3.6-5.3,6.32-6.93Z",
    "M340.43,59.41c2.67-1.54,5.69-2.31,9.04-2.31,3.71,0,7,.98,9.86,2.92,2.85,1.95,4.96,4.51,6.32,7.68h20.39c-1.09-5.62-3.33-10.62-6.73-15.02-3.4-4.39-7.68-7.84-12.85-10.33-5.17-2.49-10.83-3.74-16.99-3.74-7.07,0-13.44,1.59-19.1,4.76-5.66,3.17-10.13,7.52-13.39,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.72,9.88,13.39,13.05,5.66,3.17,12.03,4.76,19.1,4.76,6.16,0,11.83-1.25,16.99-3.74,5.17-2.49,9.45-5.93,12.85-10.33,3.4-4.39,5.64-9.4,6.73-15.02h-20.39c-1.36,3.17-3.47,5.73-6.32,7.68-2.86,1.95-6.14,2.92-9.86,2.92-3.35,0-6.37-.77-9.04-2.31-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39Z",
    "M462.98,40.25L440,40.25L423.85,65.94L416.76,65.94L416.76,11.7L397.59,11.7L397.59,109.57L416.76,109.57L416.76,83.34L423.79,83.34L440.55,109.57L463.93,109.57L439.63,74.7L462.98,40.25Z",
    "M534.2,21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97,0,17.13-2.04,24.47-6.12,7.34-4.08,13.09-9.7,17.26-16.86,4.17-7.16,6.25-15.13,6.25-23.92s-2.09-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM533.18,76.88c-2.4,4.21-5.69,7.52-9.85,9.92-4.17,2.4-8.84,3.6-14,3.6h-16.04v-55.46h16.04c5.17,0,9.83,1.2,14,3.6,4.17,2.4,7.45,5.71,9.85,9.92,2.4,4.21,3.6,8.95,3.6,14.2s-1.2,9.99-3.6,14.21Z",
    "M623.24,43.37c-5.71-3.17-12.05-4.76-19.03-4.76s-13.32,1.59-19.03,4.76c-5.71,3.17-10.2,7.52-13.46,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.75,9.88,13.46,13.05,5.71,3.17,12.05,4.76,19.03,4.76s13.32-1.59,19.03-4.76c5.71-3.17,10.17-7.52,13.39-13.05,3.22-5.53,4.83-11.69,4.83-18.49s-1.61-12.96-4.83-18.49c-3.22-5.53-7.68-9.88-13.39-13.05ZM619.43,84.02c-1.54,2.72-3.65,4.85-6.32,6.39-2.67,1.54-5.64,2.31-8.9,2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39,2.67-1.54,5.64-2.31,8.9-2.31s6.37.77,9.04,2.31c2.67,1.54,4.78,3.67,6.32,6.39,1.54,2.72,2.31,5.76,2.31,9.11s-.77,6.39-2.31,9.11Z",
    "M719.13,56.42c-3.22-5.53-7.68-9.88-13.39-13.05-5.71-3.17-12.05-4.76-19.03-4.76s-13.32,1.59-19.03,4.76c-5.71,3.17-10.2,7.52-13.46,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.75,9.88,13.46,13.05,5.71,3.17,12.05,4.76,19.03,4.76s13.32-1.59,19.03-4.76c5.71-3.17,10.17-7.52,13.39-13.05,3.22-5.53,4.83-11.69,4.83-18.49s-1.61-12.96-4.83-18.49ZM701.94,84.02c-1.54,2.72-3.65,4.85-6.32,6.39-2.67,1.54-5.64,2.31-8.9,2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39,2.67-1.54,5.64-2.31,8.9-2.31s6.37.77,9.04,2.31c2.67,1.54,4.78,3.67,6.32,6.39,1.54,2.72,2.31,5.76,2.31,9.11s-.77,6.39-2.31,9.11Z"
  ],
  /**
   * O topo de cada letra: [início, fim, topo]. O "k" vai em duas partes, a haste alta e o braço
   * na altura do "e". Serve para saber se a descendente do nome cai em cima de uma letra.
   */
  profile: [
    [136.06, 220.88, 15.78],
    [230, 304.64, 38.61],
    [312.09, 386.04, 38.61],
    [397.59, 416.76, 11.7],
    [416.76, 463.93, 40.25],
    [472.89, 557.71, 15.78],
    [566.83, 641.46, 38.61],
    [649.33, 723.96, 38.61]
  ]
};

// src/lockup.ts
var LOCKUP_VERSIONS = [
  "compact",
  "stacked",
  "inline",
  "text-stacked",
  "text-inline"
];
var MARK_W = 114.4;
var MARK_H = 125.3;
var MARK_PUPIL = 19.6 / MARK_H;
var MARK_EYES = 42.97 / MARK_H;
function lockupHasMark(version) {
  return !version.startsWith("text-");
}
function lockupLayout(version, height, m, spec = LOCKUP_SPEC) {
  const pupil = height * MARK_PUPIL;
  const withMark = lockupHasMark(version);
  let minY = 0;
  let maxY = height;
  let width = 0;
  const placeText = (capH, inkLeft, baseline2) => {
    const size = capH / m.capFrac;
    width = Math.max(width, inkLeft + (m.inkRight - m.inkLeft) * size);
    minY = Math.min(minY, baseline2 - m.ascent * size);
    const lowest = Math.max(0, ...m.glyphs.map((g) => g[2]));
    maxY = Math.max(maxY, baseline2 + lowest * size);
    return { x: inkLeft - m.inkLeft * size, baseline: baseline2, size, capH };
  };
  const placeWord = (x, baseline2, scale2) => {
    width = Math.max(width, x + (DECKDOO_WORD.right - DECKDOO_WORD.left) * scale2);
    maxY = Math.max(maxY, baseline2 + (DECKDOO_WORD.bottom - DECKDOO_WORD.baseline) * scale2);
    return { x, baseline: baseline2, scale: scale2 };
  };
  if (version === "compact") {
    const { cap: cap2, gap: gap2, align } = spec.compact;
    const capH = height * cap2;
    let baseline2 = height / 2 + capH / 2;
    if (align === "eyes") baseline2 = height * MARK_EYES + capH / 2;
    else if (align === "top") baseline2 = capH;
    else if (align === "baseline") baseline2 = height;
    const text2 = placeText(capH, 0, baseline2);
    return { gap: gap2 * pupil, width, minY, maxY, text: text2 };
  }
  if (version === "stacked" || version === "text-stacked") {
    const { cap: cap2, word: wordCap2, gap: gap2, knock } = spec.stacked;
    const capH = height * cap2;
    const text2 = placeText(capH, 0, capH);
    const scale2 = height * wordCap2 / (DECKDOO_WORD.baseline - DECKDOO_WORD.capTop);
    const word2 = placeWord(0, height, scale2);
    let clearance = Infinity;
    for (const [g0, g1, descent] of m.glyphs) {
      const gx0 = text2.x + g0 * text2.size;
      const gx1 = text2.x + g1 * text2.size;
      const bottom = text2.baseline + descent * text2.size;
      for (const [a, b, top] of DECKDOO_WORD.profile) {
        const lx0 = (a - DECKDOO_WORD.left) * scale2;
        const lx1 = (b - DECKDOO_WORD.left) * scale2;
        if (gx1 <= lx0 || gx0 >= lx1) continue;
        clearance = Math.min(clearance, height - (DECKDOO_WORD.baseline - top) * scale2 - bottom);
      }
    }
    return {
      gap: withMark ? gap2 * pupil : 0,
      width,
      minY,
      maxY,
      text: text2,
      word: word2,
      ...clearance !== Infinity && { clearance },
      ...knock && clearance < pupil && { knock: pupil * 0.66 }
    };
  }
  const { cap, gap, rule } = spec.inline;
  const scale = height / MARK_H;
  const baseline = DECKDOO_WORD.baseline * scale;
  const word = placeWord(0, baseline, scale);
  const wordRight = (DECKDOO_WORD.right - DECKDOO_WORD.left) * scale;
  const wordCap = (DECKDOO_WORD.baseline - DECKDOO_WORD.capTop) * scale;
  const gapPx = gap * pupil;
  const text = placeText(wordCap * cap, wordRight + gapPx, baseline);
  return {
    gap: withMark ? (DECKDOO_WORD.left - MARK_W) * scale : 0,
    width,
    minY,
    maxY,
    text,
    word,
    ...rule && {
      rule: {
        x: wordRight + gapPx / 2,
        y1: baseline - wordCap,
        y2: baseline,
        width: Math.max(1, wordCap * 0.045)
      }
    }
  };
}
function pickOutline(outlines, weight) {
  let best;
  for (const o of outlines ?? []) {
    if (!best || Math.abs(o.weight - weight) < Math.abs(best.weight - weight)) best = o;
  }
  return best;
}
function wordTransform(word) {
  const { x, baseline, scale } = word;
  return `translate(${x - DECKDOO_WORD.left * scale} ${baseline - DECKDOO_WORD.baseline * scale}) scale(${scale})`;
}

// src/lockup-names.ts
var LOCKUP_COMMERCE = {
  name: "Commerce",
  outlines: [
    {
      weight: 300,
      d: "M389 12Q290 12 214 -34Q137 -81 94 -162Q50 -244 50 -350Q50 -456 93 -537Q136 -619 212 -665Q288 -712 386 -712Q445 -712 502 -690Q558 -669 604 -630Q650 -592 675 -542L622 -509Q601 -552 564 -584Q526 -617 480 -635Q434 -654 386 -654Q307 -654 246 -615Q184 -576 149 -507Q114 -439 114 -350Q114 -260 149 -191Q184 -122 247 -83Q309 -44 389 -44Q438 -44 484 -64Q530 -85 568 -121Q605 -157 626 -203L679 -170Q653 -117 608 -75Q562 -34 505 -11Q448 12 389 12ZM1010 12Q938 12 883 -21Q827 -55 796 -114Q764 -173 764 -250Q764 -327 795 -386Q826 -445 882 -478Q937 -512 1008 -512Q1080 -512 1136 -478Q1191 -445 1222 -386Q1253 -327 1253 -250Q1253 -173 1222 -114Q1191 -55 1136 -21Q1081 12 1010 12ZM1010 -43Q1064 -43 1105 -69Q1146 -96 1170 -142Q1193 -189 1193 -250Q1193 -311 1170 -357Q1146 -404 1104 -430Q1062 -457 1008 -457Q954 -457 913 -430Q871 -404 848 -357Q824 -311 824 -250Q824 -189 848 -142Q872 -96 914 -69Q956 -43 1010 -43ZM1373 0L1373 -500L1429 -500L1432 -428Q1455 -469 1492 -490Q1528 -512 1577 -512Q1636 -512 1679 -483Q1722 -455 1741 -396Q1762 -452 1803 -482Q1843 -512 1901 -512Q1983 -512 2033 -456Q2082 -400 2081 -286L2081 0L2021 0L2021 -256Q2021 -339 2004 -382Q1986 -425 1957 -440Q1928 -456 1891 -456Q1828 -456 1793 -403Q1757 -351 1757 -257L1757 0L1697 0L1697 -256Q1697 -339 1680 -382Q1662 -425 1633 -440Q1604 -456 1567 -456Q1504 -456 1469 -403Q1433 -351 1433 -257L1433 0ZM2216 0L2216 -500L2272 -500L2275 -428Q2298 -469 2335 -490Q2371 -512 2420 -512Q2479 -512 2522 -483Q2565 -455 2584 -396Q2605 -452 2646 -482Q2686 -512 2744 -512Q2826 -512 2876 -456Q2925 -400 2924 -286L2924 0L2864 0L2864 -256Q2864 -339 2847 -382Q2829 -425 2800 -440Q2771 -456 2734 -456Q2671 -456 2636 -403Q2600 -351 2600 -257L2600 0L2540 0L2540 -256Q2540 -339 2523 -382Q2505 -425 2476 -440Q2447 -456 2410 -456Q2347 -456 2312 -403Q2276 -351 2276 -257L2276 0ZM3275 12Q3203 12 3148 -21Q3092 -55 3061 -114Q3029 -173 3029 -250Q3029 -327 3060 -386Q3091 -445 3146 -478Q3200 -512 3270 -512Q3341 -512 3391 -477Q3440 -443 3466 -382Q3492 -322 3492 -243L3088 -243Q3093 -148 3144 -95Q3194 -43 3275 -43Q3333 -43 3374 -71Q3414 -100 3437 -145L3487 -114Q3468 -77 3438 -48Q3407 -20 3366 -4Q3325 12 3275 12ZM3094 -298L3427 -298Q3424 -346 3404 -381Q3384 -417 3350 -437Q3316 -457 3270 -457Q3225 -457 3186 -437Q3147 -417 3123 -381Q3098 -345 3094 -298ZM3602 0L3602 -500L3662 -500L3662 -412Q3691 -459 3739 -480Q3787 -502 3839 -502L3839 -447Q3795 -447 3755 -431Q3714 -416 3688 -379Q3662 -343 3662 -280L3662 0ZM4140 12Q4068 12 4013 -21Q3957 -55 3926 -114Q3894 -173 3894 -250Q3894 -327 3925 -386Q3956 -445 4012 -478Q4067 -512 4138 -512Q4209 -512 4264 -480Q4319 -449 4349 -393L4297 -365Q4274 -408 4233 -432Q4191 -457 4138 -457Q4084 -457 4043 -430Q4001 -404 3978 -357Q3954 -311 3954 -250Q3954 -189 3978 -142Q4002 -96 4044 -69Q4086 -43 4140 -43Q4194 -43 4236 -70Q4278 -98 4300 -147L4353 -119Q4323 -58 4268 -23Q4212 12 4140 12ZM4679 12Q4607 12 4552 -21Q4496 -55 4465 -114Q4433 -173 4433 -250Q4433 -327 4464 -386Q4495 -445 4550 -478Q4604 -512 4674 -512Q4745 -512 4795 -477Q4844 -443 4870 -382Q4896 -322 4896 -243L4492 -243Q4497 -148 4548 -95Q4598 -43 4679 -43Q4737 -43 4778 -71Q4818 -100 4841 -145L4891 -114Q4872 -77 4842 -48Q4811 -20 4770 -4Q4729 12 4679 12ZM4498 -298L4831 -298Q4828 -346 4808 -381Q4788 -417 4754 -437Q4720 -457 4674 -457Q4629 -457 4590 -437Q4551 -417 4527 -381Q4502 -345 4498 -298Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.05,
        inkRight: 4.896,
        ascent: 0.712,
        glyphs: [
          [0.05, 0.679, 0.012],
          [0.764, 1.253, 0.012],
          [1.373, 2.081, 0],
          [2.216, 2.924, 0],
          [3.029, 3.492, 0.012],
          [3.602, 3.839, 0],
          [3.894, 4.353, 0.012],
          [4.433, 4.896, 0.012]
        ]
      }
    },
    {
      weight: 350,
      d: "M388 12Q289 12 212 -34Q135 -81 92 -162Q48 -244 48 -350Q48 -456 91 -537Q134 -619 211 -665Q287 -712 386 -712Q447 -712 504 -690Q561 -668 607 -628Q653 -589 678 -538L615 -503Q594 -545 558 -577Q522 -609 478 -627Q433 -645 386 -645Q309 -645 250 -607Q190 -569 156 -502Q122 -436 122 -350Q122 -263 156 -196Q190 -129 251 -91Q311 -54 389 -54Q437 -54 482 -73Q526 -93 562 -128Q598 -163 619 -208L682 -173Q656 -119 611 -77Q565 -35 507 -11Q449 12 388 12ZM1011 12Q939 12 883 -21Q826 -55 795 -114Q763 -173 763 -250Q763 -327 794 -386Q825 -445 882 -478Q938 -512 1009 -512Q1082 -512 1138 -478Q1194 -445 1225 -386Q1256 -327 1256 -250Q1256 -173 1225 -114Q1194 -55 1139 -21Q1083 12 1011 12ZM1011 -52Q1063 -52 1102 -77Q1141 -103 1164 -147Q1186 -192 1186 -250Q1186 -308 1164 -352Q1141 -397 1101 -422Q1061 -448 1009 -448Q958 -448 918 -422Q878 -397 856 -352Q833 -308 833 -250Q833 -192 856 -147Q879 -103 920 -77Q960 -52 1011 -52ZM1371 0L1371 -500L1437 -500L1440 -429Q1463 -470 1500 -491Q1536 -512 1585 -512Q1644 -512 1687 -484Q1729 -456 1748 -397Q1770 -453 1810 -482Q1850 -512 1908 -512Q1991 -512 2040 -456Q2089 -400 2088 -286L2088 0L2018 0L2018 -256Q2018 -334 2001 -375Q1984 -416 1957 -431Q1929 -446 1894 -447Q1833 -447 1799 -397Q1765 -347 1765 -258L1765 0L1695 0L1695 -256Q1695 -334 1678 -375Q1661 -416 1634 -431Q1606 -446 1571 -447Q1510 -447 1476 -397Q1442 -347 1442 -258L1442 0ZM2218 0L2218 -500L2284 -500L2287 -429Q2310 -470 2347 -491Q2383 -512 2432 -512Q2491 -512 2534 -484Q2576 -456 2595 -397Q2617 -453 2657 -482Q2697 -512 2755 -512Q2838 -512 2887 -456Q2936 -400 2935 -286L2935 0L2865 0L2865 -256Q2865 -334 2848 -375Q2831 -416 2804 -431Q2776 -446 2741 -447Q2680 -447 2646 -397Q2612 -347 2612 -258L2612 0L2542 0L2542 -256Q2542 -334 2525 -375Q2508 -416 2481 -431Q2453 -446 2418 -447Q2357 -447 2323 -397Q2289 -347 2289 -258L2289 0ZM3283 12Q3211 12 3155 -21Q3099 -55 3068 -114Q3036 -173 3036 -250Q3036 -327 3068 -386Q3099 -445 3154 -478Q3209 -512 3280 -512Q3350 -512 3401 -477Q3451 -443 3478 -381Q3505 -320 3505 -239L3106 -239Q3111 -150 3160 -101Q3208 -52 3285 -52Q3340 -52 3379 -79Q3417 -106 3439 -148L3499 -115Q3479 -78 3449 -49Q3418 -20 3376 -4Q3334 12 3283 12ZM3112 -300L3429 -300Q3426 -346 3407 -379Q3387 -412 3355 -430Q3322 -449 3279 -449Q3237 -449 3200 -430Q3163 -412 3140 -378Q3116 -345 3112 -300ZM3610 0L3610 -500L3681 -500L3681 -411Q3710 -458 3758 -480Q3806 -502 3858 -502L3858 -437Q3813 -437 3773 -422Q3732 -407 3707 -372Q3681 -337 3681 -278L3681 0ZM4160 12Q4087 12 4031 -21Q3975 -55 3943 -114Q3911 -173 3911 -250Q3911 -327 3943 -386Q3974 -445 4030 -478Q4086 -512 4158 -512Q4230 -512 4286 -479Q4341 -447 4371 -390L4309 -359Q4287 -400 4248 -423Q4208 -447 4157 -447Q4106 -447 4066 -422Q4026 -397 4004 -352Q3981 -308 3981 -250Q3981 -192 4004 -147Q4027 -103 4068 -78Q4108 -53 4159 -53Q4211 -53 4251 -79Q4291 -105 4312 -152L4375 -122Q4345 -59 4289 -23Q4233 12 4160 12ZM4698 12Q4626 12 4570 -21Q4514 -55 4483 -114Q4451 -173 4451 -250Q4451 -327 4483 -386Q4514 -445 4569 -478Q4624 -512 4695 -512Q4765 -512 4816 -477Q4866 -443 4893 -381Q4920 -320 4920 -239L4521 -239Q4526 -150 4575 -101Q4623 -52 4700 -52Q4755 -52 4794 -79Q4832 -106 4854 -148L4914 -115Q4894 -78 4864 -49Q4833 -20 4791 -4Q4749 12 4698 12ZM4527 -300L4844 -300Q4841 -346 4822 -379Q4802 -412 4770 -430Q4737 -449 4694 -449Q4652 -449 4615 -430Q4578 -412 4555 -378Q4531 -345 4527 -300Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.048,
        inkRight: 4.92,
        ascent: 0.712,
        glyphs: [
          [0.048, 0.682, 0.012],
          [0.763, 1.256, 0.012],
          [1.371, 2.088, 0],
          [2.218, 2.935, 0],
          [3.036, 3.505, 0.012],
          [3.61, 3.858, 0],
          [3.911, 4.375, 0.012],
          [4.451, 4.92, 0.012]
        ]
      }
    },
    {
      weight: 400,
      d: "M388 12Q288 12 211 -34Q134 -81 90 -162Q46 -244 46 -350Q46 -456 90 -537Q133 -619 210 -665Q286 -712 385 -712Q448 -712 506 -689Q564 -667 610 -626Q656 -586 681 -533L608 -496Q588 -538 553 -569Q518 -600 475 -617Q432 -635 385 -635Q312 -635 254 -598Q196 -562 164 -498Q131 -434 131 -350Q131 -266 164 -201Q197 -136 256 -99Q314 -63 388 -63Q436 -63 479 -82Q522 -102 557 -136Q591 -170 611 -214L685 -177Q659 -122 614 -79Q568 -36 510 -12Q451 12 388 12ZM1012 12Q939 12 883 -21Q826 -55 794 -114Q762 -173 762 -250Q762 -327 794 -386Q825 -445 882 -478Q938 -512 1010 -512Q1084 -512 1141 -478Q1197 -445 1229 -386Q1260 -327 1260 -250Q1260 -173 1229 -114Q1197 -55 1141 -21Q1085 12 1012 12ZM1012 -62Q1062 -62 1099 -86Q1136 -110 1158 -152Q1179 -194 1179 -250Q1179 -306 1158 -348Q1136 -390 1098 -414Q1060 -438 1010 -438Q961 -438 924 -414Q886 -390 865 -348Q843 -306 843 -250Q843 -195 865 -152Q886 -110 925 -86Q963 -62 1012 -62ZM1371 0L1371 -500L1446 -500L1450 -430Q1473 -470 1509 -491Q1545 -512 1593 -512Q1653 -512 1696 -484Q1738 -456 1757 -399Q1778 -454 1819 -483Q1859 -512 1915 -512Q1999 -512 2048 -456Q2096 -400 2095 -286L2095 0L2015 0L2015 -256Q2015 -330 2000 -369Q1984 -408 1958 -422Q1932 -437 1898 -437Q1839 -437 1806 -390Q1773 -344 1773 -259L1773 0L1693 0L1693 -256Q1693 -330 1678 -369Q1662 -408 1636 -422Q1609 -437 1575 -437Q1517 -437 1484 -390Q1451 -344 1451 -259L1451 0ZM2222 0L2222 -500L2297 -500L2301 -430Q2324 -470 2360 -491Q2396 -512 2444 -512Q2504 -512 2547 -484Q2589 -456 2608 -399Q2629 -454 2670 -483Q2710 -512 2766 -512Q2850 -512 2899 -456Q2947 -400 2946 -286L2946 0L2866 0L2866 -256Q2866 -330 2851 -369Q2835 -408 2809 -422Q2783 -437 2749 -437Q2690 -437 2657 -390Q2624 -344 2624 -259L2624 0L2544 0L2544 -256Q2544 -330 2529 -369Q2513 -408 2487 -422Q2460 -437 2426 -437Q2368 -437 2335 -390Q2302 -344 2302 -259L2302 0ZM3292 12Q3219 12 3163 -21Q3107 -55 3076 -114Q3044 -173 3044 -250Q3044 -327 3076 -386Q3107 -445 3163 -478Q3218 -512 3290 -512Q3360 -512 3411 -477Q3462 -443 3490 -381Q3518 -319 3518 -235L3125 -235Q3130 -153 3177 -107Q3224 -61 3296 -61Q3349 -61 3386 -86Q3422 -111 3442 -152L3511 -117Q3492 -78 3461 -49Q3429 -20 3387 -4Q3344 12 3292 12ZM3131 -302L3432 -302Q3429 -345 3410 -376Q3390 -407 3359 -424Q3328 -441 3289 -441Q3251 -441 3216 -424Q3181 -408 3158 -376Q3135 -345 3131 -302ZM3619 0L3619 -500L3699 -500L3699 -411Q3729 -458 3777 -480Q3824 -502 3876 -502L3876 -427Q3832 -427 3792 -412Q3751 -398 3725 -365Q3699 -332 3699 -275L3699 0ZM4180 12Q4106 12 4049 -21Q3992 -55 3960 -114Q3928 -173 3928 -250Q3928 -327 3960 -386Q3991 -445 4048 -478Q4105 -512 4178 -512Q4250 -512 4307 -479Q4364 -446 4394 -386L4321 -353Q4301 -393 4263 -415Q4225 -438 4176 -438Q4127 -438 4090 -414Q4052 -390 4031 -347Q4009 -305 4009 -250Q4009 -195 4031 -152Q4052 -110 4091 -86Q4129 -62 4178 -62Q4227 -62 4266 -87Q4304 -112 4324 -157L4397 -124Q4367 -60 4310 -24Q4253 12 4180 12ZM4717 12Q4644 12 4588 -21Q4532 -55 4501 -114Q4469 -173 4469 -250Q4469 -327 4501 -386Q4532 -445 4588 -478Q4643 -512 4715 -512Q4785 -512 4836 -477Q4887 -443 4915 -381Q4943 -319 4943 -235L4550 -235Q4555 -153 4602 -107Q4649 -61 4721 -61Q4774 -61 4811 -86Q4847 -111 4867 -152L4936 -117Q4917 -78 4886 -49Q4854 -20 4812 -4Q4769 12 4717 12ZM4556 -302L4857 -302Q4854 -345 4835 -376Q4815 -407 4784 -424Q4753 -441 4714 -441Q4676 -441 4641 -424Q4606 -408 4583 -376Q4560 -345 4556 -302Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.046,
        inkRight: 4.943,
        ascent: 0.712,
        glyphs: [
          [0.046, 0.685, 0.012],
          [0.762, 1.26, 0.012],
          [1.371, 2.095, 0],
          [2.222, 2.946, 0],
          [3.044, 3.518, 0.012],
          [3.619, 3.876, 0],
          [3.928, 4.397, 0.012],
          [4.469, 4.943, 0.012]
        ]
      }
    }
  ]
};
var LOCKUP_MARKETING = {
  name: "Marketing",
  outlines: [
    {
      weight: 300,
      d: "M100 0L100 -700L164 -700L421 -320L677 -700L741 -700L741 0L677 0L677 -594L420 -211L164 -592L164 0ZM1073 12Q985 12 936 -28Q886 -69 886 -141Q886 -215 936 -256Q985 -297 1073 -297L1221 -297Q1217 -377 1184 -417Q1151 -457 1083 -457Q1038 -457 1008 -439Q977 -421 957 -383L903 -407Q924 -443 951 -466Q977 -489 1010 -500Q1043 -512 1083 -512Q1150 -512 1194 -485Q1238 -458 1260 -404Q1282 -350 1282 -268L1282 0L1227 0L1222 -70Q1199 -31 1161 -9Q1123 12 1073 12ZM1069 -43Q1117 -43 1152 -62Q1186 -82 1204 -120Q1222 -158 1222 -214L1222 -242L1081 -242Q1009 -242 978 -215Q946 -189 946 -141Q946 -95 979 -69Q1011 -43 1069 -43ZM1417 0L1417 -500L1477 -500L1477 -412Q1506 -459 1554 -480Q1602 -502 1654 -502L1654 -447Q1610 -447 1570 -431Q1529 -416 1503 -379Q1477 -343 1477 -280L1477 0ZM1739 0L1739 -700L1799 -700L1799 -258L2029 -500L2107 -500L1922 -304L2129 0L2052 0L1881 -261L1799 -174L1799 0ZM2415 12Q2343 12 2288 -21Q2232 -55 2201 -114Q2169 -173 2169 -250Q2169 -327 2200 -386Q2231 -445 2286 -478Q2340 -512 2410 -512Q2481 -512 2531 -477Q2580 -443 2606 -382Q2632 -322 2632 -243L2228 -243Q2233 -148 2284 -95Q2334 -43 2415 -43Q2473 -43 2514 -71Q2554 -100 2577 -145L2627 -114Q2608 -77 2578 -48Q2547 -20 2506 -4Q2465 12 2415 12ZM2234 -298L2567 -298Q2564 -346 2544 -381Q2524 -417 2490 -437Q2456 -457 2410 -457Q2365 -457 2326 -437Q2287 -417 2263 -381Q2238 -345 2234 -298ZM2923 12Q2854 12 2815 -24Q2776 -61 2776 -128L2776 -445L2687 -445L2687 -500L2776 -500L2776 -656L2836 -656L2836 -500L2995 -500L2995 -445L2836 -445L2836 -128Q2836 -88 2859 -65Q2882 -43 2923 -43Q2935 -43 2947 -46Q2958 -50 2980 -65L3005 -13Q2978 3 2960 8Q2942 12 2923 12ZM3114 0L3114 -500L3174 -500L3174 0ZM3145 -630Q3129 -630 3117 -642Q3105 -654 3105 -670Q3105 -687 3117 -698Q3129 -710 3145 -710Q3162 -710 3174 -698Q3185 -687 3185 -670Q3185 -654 3174 -642Q3162 -630 3145 -630ZM3330 0L3330 -500L3386 -500L3389 -422Q3414 -466 3455 -489Q3496 -512 3552 -512Q3610 -512 3655 -488Q3699 -465 3725 -414Q3750 -363 3749 -279L3749 0L3689 0L3689 -256Q3689 -339 3670 -382Q3650 -425 3617 -440Q3583 -456 3541 -456Q3470 -456 3430 -403Q3390 -351 3390 -257L3390 0ZM4075 212Q4030 212 3992 202Q3954 192 3928 181Q3902 169 3892 164L3914 114Q3926 121 3951 132Q3975 142 4008 150Q4040 157 4075 157Q4127 157 4168 136Q4209 115 4233 70Q4256 25 4256 -46L4256 -101Q4228 -54 4183 -27Q4137 0 4080 0Q4014 0 3963 -33Q3912 -66 3883 -124Q3854 -183 3854 -258Q3854 -333 3883 -390Q3912 -447 3963 -479Q4014 -512 4080 -512Q4137 -512 4183 -486Q4228 -460 4256 -413L4256 -500L4316 -500L4316 -46Q4316 41 4284 99Q4251 156 4196 184Q4141 212 4075 212ZM4092 -53Q4140 -53 4177 -79Q4214 -106 4235 -152Q4256 -198 4256 -258Q4256 -317 4235 -362Q4214 -408 4177 -434Q4140 -460 4091 -460Q4039 -460 3999 -434Q3959 -408 3937 -362Q3914 -317 3914 -258Q3914 -198 3937 -152Q3960 -106 4000 -79Q4040 -53 4092 -53Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.1,
        inkRight: 4.316,
        ascent: 0.71,
        glyphs: [
          [0.1, 0.741, 0],
          [0.886, 1.282, 0.012],
          [1.417, 1.654, 0],
          [1.739, 2.129, 0],
          [2.169, 2.632, 0.012],
          [2.687, 3.005, 0.012],
          [3.105, 3.185, 0],
          [3.33, 3.749, 0],
          [3.854, 4.316, 0.212]
        ]
      }
    },
    {
      weight: 350,
      d: "M97 0L97 -700L172 -700L422 -331L671 -700L747 -700L747 0L672 0L672 -579L421 -205L171 -577L171 0ZM1073 12Q985 12 936 -28Q886 -69 886 -141Q886 -216 936 -257Q986 -298 1075 -298L1219 -298Q1215 -373 1184 -411Q1152 -449 1088 -449Q1044 -449 1015 -431Q985 -414 965 -377L902 -403Q922 -439 949 -463Q975 -487 1010 -499Q1044 -512 1088 -512Q1156 -512 1201 -484Q1246 -457 1268 -403Q1290 -350 1290 -269L1290 0L1225 0L1221 -68Q1198 -30 1161 -9Q1123 12 1073 12ZM1073 -51Q1119 -51 1152 -69Q1185 -88 1203 -124Q1220 -161 1220 -212L1220 -237L1089 -237Q1018 -237 987 -212Q956 -187 956 -142Q956 -99 987 -75Q1018 -51 1073 -51ZM1420 0L1420 -500L1491 -500L1491 -411Q1520 -458 1568 -480Q1616 -502 1668 -502L1668 -437Q1623 -437 1583 -422Q1542 -407 1517 -372Q1491 -337 1491 -278L1491 0ZM1750 0L1750 -700L1821 -700L1821 -266L2042 -500L2131 -500L1946 -302L2152 0L2064 0L1899 -252L1821 -168L1821 0ZM2435 12Q2363 12 2307 -21Q2251 -55 2220 -114Q2188 -173 2188 -250Q2188 -327 2220 -386Q2251 -445 2306 -478Q2361 -512 2432 -512Q2502 -512 2553 -477Q2603 -443 2630 -381Q2657 -320 2657 -239L2258 -239Q2263 -150 2312 -101Q2360 -52 2437 -52Q2492 -52 2531 -79Q2569 -106 2591 -148L2651 -115Q2631 -78 2601 -49Q2570 -20 2528 -4Q2486 12 2435 12ZM2264 -300L2581 -300Q2578 -346 2559 -379Q2539 -412 2507 -430Q2474 -449 2431 -449Q2389 -449 2352 -430Q2315 -412 2292 -378Q2268 -345 2264 -300ZM2947 12Q2876 12 2837 -25Q2797 -62 2797 -131L2797 -437L2709 -437L2709 -500L2797 -500L2797 -656L2867 -656L2867 -500L3021 -500L3021 -437L2867 -437L2867 -135Q2867 -96 2889 -74Q2911 -52 2950 -52Q2961 -52 2973 -56Q2984 -60 3005 -74L3033 -15Q3007 1 2987 7Q2967 12 2947 12ZM3140 0L3140 -500L3210 -500L3210 0ZM3176 -623Q3158 -623 3145 -636Q3131 -650 3131 -668Q3131 -687 3145 -700Q3158 -713 3176 -713Q3195 -713 3208 -700Q3221 -687 3221 -668Q3221 -650 3208 -636Q3195 -623 3176 -623ZM3361 0L3361 -500L3427 -500L3430 -423Q3455 -467 3496 -489Q3536 -512 3591 -512Q3649 -512 3694 -488Q3738 -465 3763 -414Q3788 -363 3787 -280L3787 0L3717 0L3717 -256Q3717 -334 3699 -375Q3680 -416 3648 -431Q3616 -446 3576 -447Q3508 -447 3470 -397Q3432 -347 3432 -258L3432 0ZM4113 212Q4067 212 4028 203Q3989 193 3963 181Q3936 169 3925 163L3951 105Q3963 112 3988 123Q4012 133 4044 141Q4076 149 4112 149Q4163 149 4203 129Q4242 108 4265 65Q4287 22 4287 -47L4287 -101Q4260 -55 4215 -28Q4170 -2 4114 -2Q4047 -2 3997 -34Q3946 -67 3917 -125Q3888 -183 3888 -258Q3888 -333 3917 -390Q3946 -447 3997 -479Q4047 -512 4114 -512Q4170 -512 4215 -486Q4260 -461 4287 -414L4287 -500L4357 -500L4357 -47Q4357 39 4325 97Q4292 155 4237 184Q4181 212 4113 212ZM4130 -63Q4176 -63 4211 -88Q4246 -114 4266 -157Q4286 -201 4286 -258Q4286 -315 4266 -358Q4246 -401 4211 -426Q4175 -451 4129 -451Q4079 -451 4041 -426Q4003 -401 3982 -358Q3960 -315 3960 -258Q3960 -201 3982 -157Q4003 -114 4042 -88Q4080 -63 4130 -63Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.097,
        inkRight: 4.3571,
        ascent: 0.713,
        glyphs: [
          [0.097, 0.747, 0],
          [0.886, 1.29, 0.012],
          [1.42, 1.668, 0],
          [1.75, 2.152, 0],
          [2.1881, 2.6571, 0.012],
          [2.7091, 3.0331, 0.012],
          [3.1311, 3.2211, 0],
          [3.3611, 3.7871, 0],
          [3.8881, 4.3571, 0.212]
        ]
      }
    },
    {
      weight: 400,
      d: "M93 0L93 -700L181 -700L423 -342L665 -700L752 -700L752 0L668 0L668 -564L423 -199L178 -562L178 0ZM1074 12Q986 12 937 -28Q887 -69 887 -141Q887 -217 938 -257Q988 -298 1079 -298L1218 -298Q1213 -369 1183 -404Q1153 -440 1093 -440Q1052 -440 1023 -423Q993 -407 974 -371L902 -399Q921 -434 948 -459Q975 -485 1011 -498Q1047 -512 1093 -512Q1163 -512 1209 -484Q1254 -457 1277 -403Q1300 -350 1299 -271L1298 0L1224 0L1220 -67Q1198 -29 1161 -8Q1124 12 1074 12ZM1078 -58Q1121 -58 1153 -76Q1185 -95 1203 -129Q1220 -163 1220 -211L1220 -231L1097 -231Q1027 -231 998 -208Q968 -185 968 -142Q968 -103 997 -80Q1026 -58 1078 -58ZM1426 0L1426 -500L1506 -500L1506 -411Q1536 -458 1584 -480Q1631 -502 1683 -502L1683 -427Q1639 -427 1599 -412Q1558 -398 1532 -365Q1506 -332 1506 -275L1506 0ZM1764 0L1764 -700L1844 -700L1844 -274L2057 -500L2158 -500L1972 -300L2178 0L2079 0L1919 -242L1844 -163L1844 0ZM2457 12Q2384 12 2328 -21Q2272 -55 2241 -114Q2209 -173 2209 -250Q2209 -327 2241 -386Q2272 -445 2328 -478Q2383 -512 2455 -512Q2525 -512 2576 -477Q2627 -443 2655 -381Q2683 -319 2683 -235L2290 -235Q2295 -153 2342 -107Q2389 -61 2461 -61Q2514 -61 2551 -86Q2587 -111 2607 -152L2676 -117Q2657 -78 2626 -49Q2594 -20 2552 -4Q2509 12 2457 12ZM2296 -302L2597 -302Q2594 -345 2575 -376Q2555 -407 2524 -424Q2493 -441 2454 -441Q2416 -441 2381 -424Q2346 -408 2323 -376Q2300 -345 2296 -302ZM2972 12Q2899 12 2859 -26Q2819 -64 2819 -133L2819 -429L2732 -429L2732 -500L2819 -500L2819 -656L2899 -656L2899 -500L3049 -500L3049 -429L2899 -429L2899 -141Q2899 -103 2920 -82Q2940 -62 2977 -62Q2989 -62 3001 -65Q3012 -69 3031 -83L3062 -18Q3036 -1 3015 6Q2994 12 2972 12ZM3167 0L3167 -500L3247 -500L3247 0ZM3208 -616Q3188 -616 3173 -631Q3158 -646 3158 -666Q3158 -687 3173 -701Q3188 -716 3208 -716Q3229 -716 3244 -701Q3258 -687 3258 -666Q3258 -646 3244 -631Q3229 -616 3208 -616ZM3394 0L3394 -500L3469 -500L3473 -425Q3498 -467 3538 -489Q3578 -512 3631 -512Q3690 -512 3734 -488Q3777 -465 3802 -414Q3826 -363 3825 -280L3825 0L3745 0L3745 -256Q3745 -330 3728 -369Q3711 -408 3681 -422Q3651 -437 3613 -437Q3547 -437 3511 -390Q3474 -344 3474 -259L3474 0ZM4152 212Q4104 212 4065 203Q4025 193 3998 182Q3970 170 3958 162L3988 97Q4001 104 4025 115Q4049 125 4082 133Q4114 140 4151 140Q4199 140 4238 121Q4276 101 4298 60Q4319 18 4319 -47L4319 -100Q4292 -55 4248 -29Q4204 -4 4149 -4Q4082 -4 4031 -36Q3980 -68 3952 -125Q3923 -183 3923 -257Q3923 -333 3952 -390Q3980 -448 4031 -480Q4082 -512 4149 -512Q4204 -512 4248 -487Q4292 -462 4319 -416L4319 -500L4399 -500L4399 -48Q4399 38 4367 96Q4335 154 4279 183Q4223 212 4152 212ZM4168 -73Q4212 -73 4246 -97Q4280 -121 4299 -162Q4318 -204 4318 -259Q4318 -312 4299 -353Q4279 -395 4246 -418Q4212 -442 4167 -442Q4120 -442 4084 -418Q4047 -395 4027 -353Q4006 -312 4006 -259Q4006 -204 4027 -162Q4048 -121 4085 -97Q4121 -73 4168 -73Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.093,
        inkRight: 4.3992,
        ascent: 0.716,
        glyphs: [
          [0.093, 0.752, 0],
          [0.887, 1.299, 0.012],
          [1.426, 1.683, 0],
          [1.764, 2.178, 0],
          [2.2092, 2.6832, 0.012],
          [2.7322, 3.0622, 0.012],
          [3.1582, 3.2582, 0],
          [3.3942, 3.8252, 0],
          [3.9232, 4.3992, 0.212]
        ]
      }
    }
  ]
};
var LOCKUP_PAGES = {
  name: "Pages",
  outlines: [
    {
      weight: 300,
      d: "M100 0L100 -700L315 -700Q381 -700 432 -672Q483 -645 512 -596Q540 -547 540 -483Q540 -420 515 -371Q489 -322 445 -294Q400 -266 342 -266L164 -266L164 0ZM164 -325L342 -325Q401 -325 439 -369Q477 -413 477 -483Q477 -554 432 -598Q386 -642 315 -642L164 -642ZM792 12Q704 12 655 -28Q605 -69 605 -141Q605 -215 655 -256Q704 -297 792 -297L940 -297Q936 -377 903 -417Q870 -457 802 -457Q757 -457 727 -439Q696 -421 676 -383L622 -407Q643 -443 670 -466Q696 -489 729 -500Q762 -512 802 -512Q869 -512 913 -485Q957 -458 979 -404Q1001 -350 1001 -268L1001 0L946 0L941 -70Q918 -31 880 -9Q842 12 792 12ZM788 -43Q836 -43 871 -62Q905 -82 923 -120Q941 -158 941 -214L941 -242L800 -242Q728 -242 697 -215Q665 -189 665 -141Q665 -95 698 -69Q730 -43 788 -43ZM1327 212Q1282 212 1244 202Q1206 192 1180 181Q1154 169 1144 164L1166 114Q1178 121 1203 132Q1227 142 1260 150Q1292 157 1327 157Q1379 157 1420 136Q1461 115 1485 70Q1508 25 1508 -46L1508 -101Q1480 -54 1435 -27Q1389 0 1332 0Q1266 0 1215 -33Q1164 -66 1135 -124Q1106 -183 1106 -258Q1106 -333 1135 -390Q1164 -447 1215 -479Q1266 -512 1332 -512Q1389 -512 1435 -486Q1480 -460 1508 -413L1508 -500L1568 -500L1568 -46Q1568 41 1536 99Q1503 156 1448 184Q1393 212 1327 212ZM1344 -53Q1392 -53 1429 -79Q1466 -106 1487 -152Q1508 -198 1508 -258Q1508 -317 1487 -362Q1466 -408 1429 -434Q1392 -460 1343 -460Q1291 -460 1251 -434Q1211 -408 1189 -362Q1166 -317 1166 -258Q1166 -198 1189 -152Q1212 -106 1252 -79Q1292 -53 1344 -53ZM1934 12Q1862 12 1807 -21Q1751 -55 1720 -114Q1688 -173 1688 -250Q1688 -327 1719 -386Q1750 -445 1805 -478Q1859 -512 1929 -512Q2000 -512 2050 -477Q2099 -443 2125 -382Q2151 -322 2151 -243L1747 -243Q1752 -148 1803 -95Q1853 -43 1934 -43Q1992 -43 2033 -71Q2073 -100 2096 -145L2146 -114Q2127 -77 2097 -48Q2066 -20 2025 -4Q1984 12 1934 12ZM1753 -298L2086 -298Q2083 -346 2063 -381Q2043 -417 2009 -437Q1975 -457 1929 -457Q1884 -457 1845 -437Q1806 -417 1782 -381Q1757 -345 1753 -298ZM2431 12Q2374 12 2333 -5Q2292 -22 2267 -49Q2241 -76 2231 -105L2285 -125Q2302 -88 2340 -65Q2377 -43 2420 -43Q2473 -43 2510 -65Q2547 -87 2547 -127Q2547 -163 2520 -186Q2493 -209 2440 -223L2391 -236Q2324 -254 2288 -288Q2251 -323 2251 -366Q2251 -435 2297 -473Q2342 -512 2434 -512Q2477 -512 2512 -499Q2546 -487 2571 -464Q2595 -441 2607 -409L2553 -386Q2537 -425 2506 -441Q2475 -457 2425 -457Q2372 -457 2342 -434Q2311 -412 2311 -371Q2311 -349 2336 -327Q2360 -306 2409 -293L2452 -282Q2501 -270 2536 -247Q2570 -225 2589 -196Q2607 -167 2607 -132Q2607 -87 2584 -54Q2561 -22 2522 -5Q2482 12 2431 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.1,
        inkRight: 2.607,
        ascent: 0.7,
        glyphs: [
          [0.1, 0.54, 0],
          [0.605, 1.001, 0.012],
          [1.106, 1.568, 0.212],
          [1.688, 2.151, 0.012],
          [2.231, 2.607, 0.012]
        ]
      }
    },
    {
      weight: 350,
      d: "M97 0L97 -700L318 -700Q385 -700 437 -672Q489 -644 518 -594Q547 -545 547 -481Q547 -417 521 -367Q494 -318 448 -289Q402 -261 343 -261L171 -261L171 0ZM171 -330L342 -330Q400 -330 437 -372Q473 -414 473 -481Q473 -549 430 -591Q386 -633 318 -633L171 -633ZM795 12Q707 12 658 -28Q608 -69 608 -141Q608 -216 658 -257Q708 -298 797 -298L941 -298Q937 -373 906 -411Q874 -449 810 -449Q766 -449 737 -431Q707 -414 687 -377L624 -403Q644 -439 671 -463Q697 -487 732 -499Q766 -512 810 -512Q878 -512 923 -484Q968 -457 990 -403Q1012 -350 1012 -269L1012 0L947 0L943 -68Q920 -30 883 -9Q845 12 795 12ZM795 -51Q841 -51 874 -69Q907 -88 925 -124Q942 -161 942 -212L942 -237L811 -237Q740 -237 709 -212Q678 -187 678 -142Q678 -99 709 -75Q740 -51 795 -51ZM1338 212Q1292 212 1253 203Q1214 193 1188 181Q1161 169 1150 163L1176 105Q1188 112 1213 123Q1237 133 1269 141Q1301 149 1337 149Q1388 149 1428 129Q1467 108 1490 65Q1512 22 1512 -47L1512 -101Q1485 -55 1440 -28Q1395 -2 1339 -2Q1272 -2 1222 -34Q1171 -67 1142 -125Q1113 -183 1113 -258Q1113 -333 1142 -390Q1171 -447 1222 -479Q1272 -512 1339 -512Q1395 -512 1440 -486Q1485 -461 1512 -414L1512 -500L1582 -500L1582 -47Q1582 39 1550 97Q1517 155 1462 184Q1406 212 1338 212ZM1355 -63Q1401 -63 1436 -88Q1471 -114 1491 -157Q1511 -201 1511 -258Q1511 -315 1491 -358Q1471 -401 1436 -426Q1400 -451 1354 -451Q1304 -451 1266 -426Q1228 -401 1207 -358Q1185 -315 1185 -258Q1185 -201 1207 -157Q1228 -114 1267 -88Q1305 -63 1355 -63ZM1945 12Q1873 12 1817 -21Q1761 -55 1730 -114Q1698 -173 1698 -250Q1698 -327 1730 -386Q1761 -445 1816 -478Q1871 -512 1942 -512Q2012 -512 2063 -477Q2113 -443 2140 -381Q2167 -320 2167 -239L1768 -239Q1773 -150 1822 -101Q1870 -52 1947 -52Q2002 -52 2041 -79Q2079 -106 2101 -148L2161 -115Q2141 -78 2111 -49Q2080 -20 2038 -4Q1996 12 1945 12ZM1774 -300L2091 -300Q2088 -346 2069 -379Q2049 -412 2017 -430Q1984 -449 1941 -449Q1899 -449 1862 -430Q1825 -412 1802 -378Q1778 -345 1774 -300ZM2445 12Q2389 12 2348 -4Q2307 -21 2281 -48Q2254 -75 2243 -106L2305 -130Q2322 -95 2358 -73Q2394 -52 2435 -52Q2486 -52 2520 -72Q2554 -92 2554 -129Q2554 -163 2529 -184Q2504 -205 2455 -217L2406 -230Q2338 -248 2301 -283Q2264 -319 2264 -364Q2264 -434 2310 -473Q2356 -512 2448 -512Q2492 -512 2527 -499Q2562 -487 2587 -463Q2612 -440 2624 -408L2563 -381Q2548 -417 2518 -433Q2487 -449 2440 -449Q2391 -449 2363 -428Q2334 -407 2334 -368Q2334 -348 2357 -328Q2380 -308 2426 -296L2472 -285Q2521 -273 2555 -250Q2589 -227 2607 -197Q2624 -168 2624 -133Q2624 -88 2601 -55Q2578 -23 2538 -5Q2497 12 2445 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.097,
        inkRight: 2.624,
        ascent: 0.7,
        glyphs: [
          [0.097, 0.547, 0],
          [0.608, 1.012, 0.012],
          [1.113, 1.582, 0.212],
          [1.698, 2.167, 0.012],
          [2.243, 2.624, 0.012]
        ]
      }
    },
    {
      weight: 400,
      d: "M93 0L93 -700L321 -700Q389 -700 442 -672Q494 -644 524 -594Q553 -544 553 -478Q553 -414 526 -364Q499 -314 452 -285Q405 -257 343 -257L178 -257L178 0ZM178 -334L343 -334Q398 -334 434 -374Q469 -415 469 -478Q469 -543 428 -583Q386 -623 320 -623L178 -623ZM797 12Q709 12 660 -28Q610 -69 610 -141Q610 -217 661 -257Q711 -298 802 -298L941 -298Q936 -369 906 -404Q876 -440 816 -440Q775 -440 746 -423Q716 -407 697 -371L625 -399Q644 -434 671 -459Q698 -485 734 -498Q770 -512 816 -512Q886 -512 932 -484Q977 -457 1000 -403Q1023 -350 1022 -271L1021 0L947 0L943 -67Q921 -29 884 -8Q847 12 797 12ZM801 -58Q844 -58 876 -76Q908 -95 926 -129Q943 -163 943 -211L943 -231L820 -231Q750 -231 721 -208Q691 -185 691 -142Q691 -103 720 -80Q749 -58 801 -58ZM1349 212Q1301 212 1262 203Q1222 193 1195 182Q1167 170 1155 162L1185 97Q1198 104 1222 115Q1246 125 1279 133Q1311 140 1348 140Q1396 140 1435 121Q1473 101 1495 60Q1516 18 1516 -47L1516 -100Q1489 -55 1445 -29Q1401 -4 1346 -4Q1279 -4 1228 -36Q1177 -68 1149 -125Q1120 -183 1120 -257Q1120 -333 1149 -390Q1177 -448 1228 -480Q1279 -512 1346 -512Q1401 -512 1445 -487Q1489 -462 1516 -416L1516 -500L1596 -500L1596 -48Q1596 38 1564 96Q1532 154 1476 183Q1420 212 1349 212ZM1365 -73Q1409 -73 1443 -97Q1477 -121 1496 -162Q1515 -204 1515 -259Q1515 -312 1496 -353Q1476 -395 1443 -418Q1409 -442 1364 -442Q1317 -442 1281 -418Q1244 -395 1224 -353Q1203 -312 1203 -259Q1203 -204 1224 -162Q1245 -121 1282 -97Q1318 -73 1365 -73ZM1955 12Q1882 12 1826 -21Q1770 -55 1739 -114Q1707 -173 1707 -250Q1707 -327 1739 -386Q1770 -445 1826 -478Q1881 -512 1953 -512Q2023 -512 2074 -477Q2125 -443 2153 -381Q2181 -319 2181 -235L1788 -235Q1793 -153 1840 -107Q1887 -61 1959 -61Q2012 -61 2049 -86Q2085 -111 2105 -152L2174 -117Q2155 -78 2124 -49Q2092 -20 2050 -4Q2007 12 1955 12ZM1794 -302L2095 -302Q2092 -345 2073 -376Q2053 -407 2022 -424Q1991 -441 1952 -441Q1914 -441 1879 -424Q1844 -408 1821 -376Q1798 -345 1794 -302ZM2457 12Q2402 12 2361 -4Q2320 -21 2293 -48Q2265 -75 2253 -107L2323 -136Q2340 -102 2374 -81Q2408 -60 2449 -60Q2496 -60 2528 -78Q2560 -97 2560 -131Q2560 -162 2537 -181Q2513 -200 2467 -212L2419 -225Q2351 -243 2313 -279Q2275 -316 2275 -362Q2275 -433 2322 -472Q2368 -512 2460 -512Q2504 -512 2540 -499Q2576 -486 2602 -462Q2628 -439 2640 -407L2570 -376Q2557 -410 2527 -425Q2497 -440 2454 -440Q2408 -440 2382 -420Q2356 -401 2356 -366Q2356 -346 2378 -328Q2399 -311 2441 -300L2491 -287Q2540 -275 2573 -251Q2606 -228 2623 -198Q2640 -168 2640 -134Q2640 -89 2616 -56Q2592 -23 2551 -5Q2510 12 2457 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.093,
        inkRight: 2.64,
        ascent: 0.7,
        glyphs: [
          [0.093, 0.553, 0],
          [0.61, 1.022, 0.012],
          [1.12, 1.596, 0.212],
          [1.707, 2.181, 0.012],
          [2.253, 2.64, 0.012]
        ]
      }
    }
  ]
};
var LOCKUP_SITES = {
  name: "Sites",
  outlines: [
    {
      weight: 300,
      d: "M319 12Q260 12 216 0Q171 -13 139 -35Q107 -57 87 -84Q66 -111 55 -141L115 -164Q132 -117 182 -81Q232 -46 304 -46Q396 -46 447 -81Q498 -117 498 -175Q498 -231 451 -264Q404 -298 329 -317L258 -335Q212 -347 173 -369Q133 -392 109 -427Q85 -462 85 -513Q85 -607 145 -659Q205 -712 320 -712Q389 -712 439 -688Q489 -665 520 -630Q550 -596 560 -561L501 -538Q479 -593 430 -623Q380 -654 310 -654Q236 -654 193 -618Q149 -582 149 -521Q149 -466 183 -438Q217 -411 272 -397L343 -380Q449 -355 506 -300Q562 -246 562 -184Q562 -131 535 -86Q508 -42 454 -15Q400 12 319 12ZM696 0L696 -500L756 -500L756 0ZM727 -630Q711 -630 699 -642Q687 -654 687 -670Q687 -687 699 -698Q711 -710 727 -710Q744 -710 756 -698Q767 -687 767 -670Q767 -654 756 -642Q744 -630 727 -630ZM1093 12Q1024 12 985 -24Q946 -61 946 -128L946 -445L857 -445L857 -500L946 -500L946 -656L1006 -656L1006 -500L1165 -500L1165 -445L1006 -445L1006 -128Q1006 -88 1029 -65Q1052 -43 1093 -43Q1105 -43 1117 -46Q1128 -50 1150 -65L1175 -13Q1148 3 1130 8Q1112 12 1093 12ZM1496 12Q1424 12 1369 -21Q1313 -55 1282 -114Q1250 -173 1250 -250Q1250 -327 1281 -386Q1312 -445 1367 -478Q1421 -512 1491 -512Q1562 -512 1612 -477Q1661 -443 1687 -382Q1713 -322 1713 -243L1309 -243Q1314 -148 1365 -95Q1415 -43 1496 -43Q1554 -43 1595 -71Q1635 -100 1658 -145L1708 -114Q1689 -77 1659 -48Q1628 -20 1587 -4Q1546 12 1496 12ZM1315 -298L1648 -298Q1645 -346 1625 -381Q1605 -417 1571 -437Q1537 -457 1491 -457Q1446 -457 1407 -437Q1368 -417 1344 -381Q1319 -345 1315 -298ZM1993 12Q1936 12 1895 -5Q1854 -22 1829 -49Q1803 -76 1793 -105L1847 -125Q1864 -88 1902 -65Q1939 -43 1982 -43Q2035 -43 2072 -65Q2109 -87 2109 -127Q2109 -163 2082 -186Q2055 -209 2002 -223L1953 -236Q1886 -254 1850 -288Q1813 -323 1813 -366Q1813 -435 1859 -473Q1904 -512 1996 -512Q2039 -512 2074 -499Q2108 -487 2133 -464Q2157 -441 2169 -409L2115 -386Q2099 -425 2068 -441Q2037 -457 1987 -457Q1934 -457 1904 -434Q1873 -412 1873 -371Q1873 -349 1898 -327Q1922 -306 1971 -293L2014 -282Q2063 -270 2098 -247Q2132 -225 2151 -196Q2169 -167 2169 -132Q2169 -87 2146 -54Q2123 -22 2084 -5Q2044 12 1993 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.055,
        inkRight: 2.169,
        ascent: 0.712,
        glyphs: [
          [0.055, 0.562, 0.012],
          [0.687, 0.767, 0],
          [0.857, 1.175, 0.012],
          [1.25, 1.713, 0.012],
          [1.793, 2.169, 0.012]
        ]
      }
    },
    {
      weight: 350,
      d: "M318 12Q260 12 215 0Q170 -13 138 -35Q105 -58 84 -85Q63 -112 53 -142L123 -168Q140 -123 188 -89Q235 -55 304 -54Q390 -54 439 -88Q488 -122 488 -177Q488 -230 444 -262Q399 -294 328 -312L254 -331Q208 -343 169 -366Q129 -389 106 -424Q82 -460 82 -511Q82 -606 143 -659Q203 -712 319 -712Q387 -712 438 -689Q488 -666 519 -631Q550 -597 561 -560L491 -534Q471 -586 424 -616Q377 -646 310 -646Q239 -646 198 -611Q156 -577 156 -519Q156 -467 189 -440Q221 -414 274 -401L348 -383Q451 -358 507 -303Q563 -249 563 -186Q563 -131 536 -86Q508 -42 454 -15Q399 12 318 12ZM693 0L693 -500L763 -500L763 0ZM729 -623Q711 -623 698 -636Q684 -650 684 -668Q684 -687 698 -700Q711 -713 729 -713Q748 -713 761 -700Q774 -687 774 -668Q774 -650 761 -636Q748 -623 729 -623ZM1099 12Q1028 12 989 -25Q949 -62 949 -131L949 -437L861 -437L861 -500L949 -500L949 -656L1019 -656L1019 -500L1173 -500L1173 -437L1019 -437L1019 -135Q1019 -96 1041 -74Q1063 -52 1102 -52Q1113 -52 1125 -56Q1136 -60 1157 -74L1185 -15Q1159 1 1139 7Q1119 12 1099 12ZM1504 12Q1432 12 1376 -21Q1320 -55 1288 -114Q1257 -173 1257 -250Q1257 -327 1288 -386Q1320 -445 1375 -478Q1430 -512 1501 -512Q1571 -512 1621 -477Q1672 -443 1699 -381Q1726 -320 1726 -239L1327 -239Q1332 -150 1380 -101Q1429 -52 1506 -52Q1561 -52 1599 -79Q1638 -106 1660 -148L1720 -115Q1700 -78 1669 -49Q1639 -20 1597 -4Q1555 12 1504 12ZM1333 -300L1650 -300Q1647 -346 1627 -379Q1608 -412 1575 -430Q1543 -449 1500 -449Q1458 -449 1421 -430Q1384 -412 1360 -378Q1337 -345 1333 -300ZM2004 12Q1948 12 1907 -4Q1866 -21 1839 -48Q1813 -75 1802 -106L1864 -130Q1881 -95 1917 -73Q1953 -52 1994 -52Q2045 -52 2079 -72Q2113 -92 2113 -129Q2113 -163 2088 -184Q2063 -205 2014 -217L1965 -230Q1897 -248 1860 -283Q1823 -319 1823 -364Q1823 -434 1869 -473Q1915 -512 2007 -512Q2051 -512 2086 -499Q2121 -487 2146 -463Q2171 -440 2183 -408L2122 -381Q2107 -417 2076 -433Q2046 -449 1999 -449Q1950 -449 1921 -428Q1893 -407 1893 -368Q1893 -348 1916 -328Q1939 -308 1985 -296L2031 -285Q2080 -273 2114 -250Q2148 -227 2165 -197Q2183 -168 2183 -133Q2183 -88 2160 -55Q2137 -23 2096 -5Q2056 12 2004 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.053,
        inkRight: 2.1827,
        ascent: 0.713,
        glyphs: [
          [0.053, 0.563, 0.012],
          [0.684, 0.774, 0],
          [0.861, 1.185, 0.012],
          [1.2568, 1.7257, 0.012],
          [1.8017, 2.1827, 0.012]
        ]
      }
    },
    {
      weight: 400,
      d: "M317 12Q259 12 214 0Q169 -13 136 -35Q103 -58 82 -85Q61 -113 51 -144L132 -172Q147 -128 193 -95Q238 -63 304 -63Q385 -63 431 -95Q477 -127 477 -180Q477 -229 436 -259Q395 -290 328 -307L251 -327Q204 -339 165 -362Q125 -386 102 -422Q78 -459 78 -510Q78 -605 140 -658Q201 -712 317 -712Q386 -712 436 -689Q486 -667 518 -632Q549 -598 562 -558L482 -530Q463 -580 418 -608Q373 -637 309 -637Q242 -637 203 -604Q163 -572 163 -516Q163 -468 194 -442Q225 -417 275 -405L352 -386Q454 -362 509 -306Q563 -251 563 -187Q563 -132 535 -86Q507 -41 453 -14Q398 12 317 12ZM689 0L689 -500L769 -500L769 0ZM730 -616Q710 -616 695 -631Q680 -646 680 -666Q680 -687 695 -701Q710 -716 730 -716Q751 -716 766 -701Q780 -687 780 -666Q780 -646 766 -631Q751 -616 730 -616ZM1104 12Q1031 12 991 -26Q951 -64 951 -133L951 -429L864 -429L864 -500L951 -500L951 -656L1031 -656L1031 -500L1181 -500L1181 -429L1031 -429L1031 -141Q1031 -103 1052 -82Q1072 -62 1109 -62Q1121 -62 1133 -65Q1144 -69 1163 -83L1194 -18Q1168 -1 1147 6Q1126 12 1104 12ZM1511 12Q1438 12 1382 -21Q1326 -55 1294 -114Q1263 -173 1263 -250Q1263 -327 1294 -386Q1326 -445 1381 -478Q1437 -512 1509 -512Q1579 -512 1630 -477Q1681 -443 1709 -381Q1737 -319 1737 -235L1344 -235Q1349 -153 1396 -107Q1443 -61 1515 -61Q1568 -61 1604 -86Q1641 -111 1661 -152L1730 -117Q1711 -78 1679 -49Q1648 -20 1605 -4Q1563 12 1511 12ZM1350 -302L1651 -302Q1648 -345 1628 -376Q1609 -407 1578 -424Q1547 -441 1508 -441Q1470 -441 1435 -424Q1400 -408 1377 -376Q1354 -345 1350 -302ZM2013 12Q1958 12 1917 -4Q1876 -21 1848 -48Q1821 -75 1809 -107L1879 -136Q1896 -102 1930 -81Q1964 -60 2005 -60Q2052 -60 2084 -78Q2116 -97 2116 -131Q2116 -162 2092 -181Q2069 -200 2023 -212L1975 -225Q1907 -243 1869 -279Q1831 -316 1831 -362Q1831 -433 1877 -472Q1924 -512 2016 -512Q2060 -512 2096 -499Q2132 -486 2158 -462Q2184 -439 2196 -407L2126 -376Q2113 -410 2083 -425Q2053 -440 2010 -440Q1964 -440 1938 -420Q1912 -401 1912 -366Q1912 -346 1933 -328Q1955 -311 1997 -300L2047 -287Q2096 -275 2129 -251Q2162 -228 2179 -198Q2196 -168 2196 -134Q2196 -89 2172 -56Q2148 -23 2107 -5Q2066 12 2013 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.051,
        inkRight: 2.1955,
        ascent: 0.716,
        glyphs: [
          [0.051, 0.563, 0.012],
          [0.68, 0.78, 0],
          [0.864, 1.194, 0.012],
          [1.2625, 1.7365, 0.012],
          [1.8085, 2.1955, 0.012]
        ]
      }
    }
  ]
};
var LOCKUP_SLIDES = {
  name: "Slides",
  outlines: [
    {
      weight: 300,
      d: "M319 12Q260 12 216 0Q171 -13 139 -35Q107 -57 87 -84Q66 -111 55 -141L115 -164Q132 -117 182 -81Q232 -46 304 -46Q396 -46 447 -81Q498 -117 498 -175Q498 -231 451 -264Q404 -298 329 -317L258 -335Q212 -347 173 -369Q133 -392 109 -427Q85 -462 85 -513Q85 -607 145 -659Q205 -712 320 -712Q389 -712 439 -688Q489 -665 520 -630Q550 -596 560 -561L501 -538Q479 -593 430 -623Q380 -654 310 -654Q236 -654 193 -618Q149 -582 149 -521Q149 -466 183 -438Q217 -411 272 -397L343 -380Q449 -355 506 -300Q562 -246 562 -184Q562 -131 535 -86Q508 -42 454 -15Q400 12 319 12ZM692 0L692 -700L752 -700L752 0ZM906 0L906 -500L966 -500L966 0ZM937 -630Q921 -630 909 -642Q897 -654 897 -670Q897 -687 909 -698Q921 -710 937 -710Q954 -710 966 -698Q977 -687 977 -670Q977 -654 966 -642Q954 -630 937 -630ZM1318 12Q1252 12 1201 -21Q1150 -55 1121 -114Q1092 -174 1092 -250Q1092 -327 1121 -386Q1150 -445 1201 -478Q1252 -512 1318 -512Q1375 -512 1421 -484Q1466 -457 1494 -409L1494 -700L1554 -700L1554 0L1497 0L1494 -91Q1466 -43 1421 -15Q1375 12 1318 12ZM1330 -42Q1378 -42 1415 -68Q1452 -95 1473 -142Q1494 -189 1494 -249L1494 -250Q1494 -311 1473 -358Q1452 -405 1415 -431Q1378 -458 1329 -458Q1277 -458 1237 -431Q1197 -405 1175 -358Q1152 -311 1152 -250Q1152 -189 1175 -142Q1198 -95 1238 -68Q1278 -42 1330 -42ZM1920 12Q1848 12 1793 -21Q1737 -55 1706 -114Q1674 -173 1674 -250Q1674 -327 1705 -386Q1736 -445 1791 -478Q1845 -512 1915 -512Q1986 -512 2036 -477Q2085 -443 2111 -382Q2137 -322 2137 -243L1733 -243Q1738 -148 1789 -95Q1839 -43 1920 -43Q1978 -43 2019 -71Q2059 -100 2082 -145L2132 -114Q2113 -77 2083 -48Q2052 -20 2011 -4Q1970 12 1920 12ZM1739 -298L2072 -298Q2069 -346 2049 -381Q2029 -417 1995 -437Q1961 -457 1915 -457Q1870 -457 1831 -437Q1792 -417 1768 -381Q1743 -345 1739 -298ZM2417 12Q2360 12 2319 -5Q2278 -22 2253 -49Q2227 -76 2217 -105L2271 -125Q2288 -88 2326 -65Q2363 -43 2406 -43Q2459 -43 2496 -65Q2533 -87 2533 -127Q2533 -163 2506 -186Q2479 -209 2426 -223L2377 -236Q2310 -254 2274 -288Q2237 -323 2237 -366Q2237 -435 2283 -473Q2328 -512 2420 -512Q2463 -512 2498 -499Q2532 -487 2557 -464Q2581 -441 2593 -409L2539 -386Q2523 -425 2492 -441Q2461 -457 2411 -457Q2358 -457 2328 -434Q2297 -412 2297 -371Q2297 -349 2322 -327Q2346 -306 2395 -293L2438 -282Q2487 -270 2522 -247Q2556 -225 2575 -196Q2593 -167 2593 -132Q2593 -87 2570 -54Q2547 -22 2508 -5Q2468 12 2417 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.055,
        inkRight: 2.593,
        ascent: 0.712,
        glyphs: [
          [0.055, 0.562, 0.012],
          [0.692, 0.752, 0],
          [0.897, 0.977, 0],
          [1.092, 1.554, 0.012],
          [1.674, 2.137, 0.012],
          [2.217, 2.593, 0.012]
        ]
      }
    },
    {
      weight: 350,
      d: "M318 12Q260 12 215 0Q170 -13 138 -35Q105 -58 84 -85Q63 -112 53 -142L123 -168Q140 -123 188 -89Q235 -55 304 -54Q390 -54 439 -88Q488 -122 488 -177Q488 -230 444 -262Q399 -294 328 -312L254 -331Q208 -343 169 -366Q129 -389 106 -424Q82 -460 82 -511Q82 -606 143 -659Q203 -712 319 -712Q387 -712 438 -689Q488 -666 519 -631Q550 -597 561 -560L491 -534Q471 -586 424 -616Q377 -646 310 -646Q239 -646 198 -611Q156 -577 156 -519Q156 -467 189 -440Q221 -414 274 -401L348 -383Q451 -358 507 -303Q563 -249 563 -186Q563 -131 536 -86Q508 -42 454 -15Q399 12 318 12ZM688 0L688 -700L759 -700L759 0ZM908 0L908 -500L978 -500L978 0ZM944 -623Q926 -623 913 -636Q899 -650 899 -668Q899 -687 913 -700Q926 -713 944 -713Q963 -713 976 -700Q989 -687 989 -668Q989 -650 976 -636Q963 -623 944 -623ZM1326 12Q1259 12 1209 -21Q1158 -55 1129 -114Q1100 -173 1100 -250Q1100 -328 1129 -386Q1158 -445 1209 -478Q1259 -512 1326 -512Q1382 -512 1427 -485Q1471 -459 1498 -412L1498 -700L1568 -700L1568 0L1502 0L1499 -88Q1471 -41 1427 -14Q1382 12 1326 12ZM1341 -51Q1387 -51 1423 -76Q1458 -102 1478 -146Q1498 -191 1498 -248L1498 -251Q1498 -309 1478 -353Q1458 -398 1423 -423Q1387 -449 1340 -449Q1290 -449 1252 -423Q1214 -398 1193 -353Q1171 -308 1171 -250Q1171 -192 1193 -147Q1215 -102 1253 -76Q1291 -51 1341 -51ZM1931 12Q1859 12 1803 -21Q1747 -55 1716 -114Q1684 -173 1684 -250Q1684 -327 1716 -386Q1747 -445 1802 -478Q1857 -512 1928 -512Q1998 -512 2049 -477Q2099 -443 2126 -381Q2153 -320 2153 -239L1754 -239Q1759 -150 1808 -101Q1856 -52 1933 -52Q1988 -52 2027 -79Q2065 -106 2087 -148L2147 -115Q2127 -78 2097 -49Q2066 -20 2024 -4Q1982 12 1931 12ZM1760 -300L2077 -300Q2074 -346 2055 -379Q2035 -412 2003 -430Q1970 -449 1927 -449Q1885 -449 1848 -430Q1811 -412 1788 -378Q1764 -345 1760 -300ZM2431 12Q2375 12 2334 -4Q2293 -21 2267 -48Q2240 -75 2229 -106L2291 -130Q2308 -95 2344 -73Q2380 -52 2421 -52Q2472 -52 2506 -72Q2540 -92 2540 -129Q2540 -163 2515 -184Q2490 -205 2441 -217L2392 -230Q2324 -248 2287 -283Q2250 -319 2250 -364Q2250 -434 2296 -473Q2342 -512 2434 -512Q2478 -512 2513 -499Q2548 -487 2573 -463Q2598 -440 2610 -408L2549 -381Q2534 -417 2504 -433Q2473 -449 2426 -449Q2377 -449 2349 -428Q2320 -407 2320 -368Q2320 -348 2343 -328Q2366 -308 2412 -296L2458 -285Q2507 -273 2541 -250Q2575 -227 2593 -197Q2610 -168 2610 -133Q2610 -88 2587 -55Q2564 -23 2524 -5Q2483 12 2431 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.053,
        inkRight: 2.61,
        ascent: 0.713,
        glyphs: [
          [0.053, 0.563, 0.012],
          [0.688, 0.759, 0],
          [0.899, 0.989, 0],
          [1.1, 1.568, 0.012],
          [1.684, 2.153, 0.012],
          [2.229, 2.61, 0.012]
        ]
      }
    },
    {
      weight: 400,
      d: "M317 12Q259 12 214 0Q169 -13 136 -35Q103 -58 82 -85Q61 -113 51 -144L132 -172Q147 -128 193 -95Q238 -63 304 -63Q385 -63 431 -95Q477 -127 477 -180Q477 -229 436 -259Q395 -290 328 -307L251 -327Q204 -339 165 -362Q125 -386 102 -422Q78 -459 78 -510Q78 -605 140 -658Q201 -712 317 -712Q386 -712 436 -689Q486 -667 518 -632Q549 -598 562 -558L482 -530Q463 -580 418 -608Q373 -637 309 -637Q242 -637 203 -604Q163 -572 163 -516Q163 -468 194 -442Q225 -417 275 -405L352 -386Q454 -362 509 -306Q563 -251 563 -187Q563 -132 535 -86Q507 -41 453 -14Q398 12 317 12ZM684 0L684 -700L764 -700L764 0ZM909 0L909 -500L989 -500L989 0ZM950 -616Q930 -616 915 -631Q900 -646 900 -666Q900 -687 915 -701Q930 -716 950 -716Q971 -716 986 -701Q1000 -687 1000 -666Q1000 -646 986 -631Q971 -616 950 -616ZM1333 12Q1266 12 1215 -21Q1164 -54 1136 -113Q1107 -173 1107 -250Q1107 -328 1136 -387Q1164 -446 1215 -479Q1266 -512 1333 -512Q1388 -512 1432 -486Q1475 -461 1502 -416L1502 -700L1582 -700L1582 0L1506 0L1502 -85Q1475 -40 1432 -14Q1388 12 1333 12ZM1351 -61Q1395 -61 1429 -84Q1462 -108 1482 -150Q1501 -193 1502 -246L1502 -253Q1501 -307 1482 -349Q1462 -392 1428 -415Q1394 -439 1350 -439Q1303 -439 1266 -415Q1229 -391 1209 -348Q1188 -305 1188 -250Q1188 -195 1209 -152Q1230 -109 1267 -85Q1304 -61 1351 -61ZM1941 12Q1868 12 1812 -21Q1756 -55 1725 -114Q1693 -173 1693 -250Q1693 -327 1725 -386Q1756 -445 1812 -478Q1867 -512 1939 -512Q2009 -512 2060 -477Q2111 -443 2139 -381Q2167 -319 2167 -235L1774 -235Q1779 -153 1826 -107Q1873 -61 1945 -61Q1998 -61 2035 -86Q2071 -111 2091 -152L2160 -117Q2141 -78 2110 -49Q2078 -20 2036 -4Q1993 12 1941 12ZM1780 -302L2081 -302Q2078 -345 2059 -376Q2039 -407 2008 -424Q1977 -441 1938 -441Q1900 -441 1865 -424Q1830 -408 1807 -376Q1784 -345 1780 -302ZM2443 12Q2388 12 2347 -4Q2306 -21 2279 -48Q2251 -75 2239 -107L2309 -136Q2326 -102 2360 -81Q2394 -60 2435 -60Q2482 -60 2514 -78Q2546 -97 2546 -131Q2546 -162 2523 -181Q2499 -200 2453 -212L2405 -225Q2337 -243 2299 -279Q2261 -316 2261 -362Q2261 -433 2308 -472Q2354 -512 2446 -512Q2490 -512 2526 -499Q2562 -486 2588 -462Q2614 -439 2626 -407L2556 -376Q2543 -410 2513 -425Q2483 -440 2440 -440Q2394 -440 2368 -420Q2342 -401 2342 -366Q2342 -346 2364 -328Q2385 -311 2427 -300L2477 -287Q2526 -275 2559 -251Q2592 -228 2609 -198Q2626 -168 2626 -134Q2626 -89 2602 -56Q2578 -23 2537 -5Q2496 12 2443 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.051,
        inkRight: 2.626,
        ascent: 0.716,
        glyphs: [
          [0.051, 0.563, 0.012],
          [0.684, 0.764, 0],
          [0.9, 1, 0],
          [1.107, 1.582, 0.012],
          [1.693, 2.167, 0.012],
          [2.239, 2.626, 0.012]
        ]
      }
    }
  ]
};
var LOCKUP_WORKS = {
  name: "Works",
  outlines: [
    {
      weight: 300,
      d: "M226 0L10 -700L74 -700L261 -98L443 -700L507 -700L685 -98L876 -700L940 -700L719 0L649 0L475 -593L296 0ZM1201 12Q1129 12 1074 -21Q1018 -55 987 -114Q955 -173 955 -250Q955 -327 986 -386Q1017 -445 1073 -478Q1128 -512 1199 -512Q1271 -512 1327 -478Q1382 -445 1413 -386Q1444 -327 1444 -250Q1444 -173 1413 -114Q1382 -55 1327 -21Q1272 12 1201 12ZM1201 -43Q1255 -43 1296 -69Q1337 -96 1361 -142Q1384 -189 1384 -250Q1384 -311 1361 -357Q1337 -404 1295 -430Q1253 -457 1199 -457Q1145 -457 1104 -430Q1062 -404 1039 -357Q1015 -311 1015 -250Q1015 -189 1039 -142Q1063 -96 1105 -69Q1147 -43 1201 -43ZM1564 0L1564 -500L1624 -500L1624 -412Q1653 -459 1701 -480Q1749 -502 1801 -502L1801 -447Q1757 -447 1717 -431Q1676 -416 1650 -379Q1624 -343 1624 -280L1624 0ZM1886 0L1886 -700L1946 -700L1946 -258L2176 -500L2254 -500L2069 -304L2276 0L2199 0L2028 -261L1946 -174L1946 0ZM2521 12Q2464 12 2423 -5Q2382 -22 2357 -49Q2331 -76 2321 -105L2375 -125Q2392 -88 2430 -65Q2467 -43 2510 -43Q2563 -43 2600 -65Q2637 -87 2637 -127Q2637 -163 2610 -186Q2583 -209 2530 -223L2481 -236Q2414 -254 2378 -288Q2341 -323 2341 -366Q2341 -435 2387 -473Q2432 -512 2524 -512Q2567 -512 2602 -499Q2636 -487 2661 -464Q2685 -441 2697 -409L2643 -386Q2627 -425 2596 -441Q2565 -457 2515 -457Q2462 -457 2432 -434Q2401 -412 2401 -371Q2401 -349 2426 -327Q2450 -306 2499 -293L2542 -282Q2591 -270 2626 -247Q2660 -225 2679 -196Q2697 -167 2697 -132Q2697 -87 2674 -54Q2651 -22 2612 -5Q2572 12 2521 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.01,
        inkRight: 2.697,
        ascent: 0.7,
        glyphs: [
          [0.01, 0.94, 0],
          [0.955, 1.444, 0.012],
          [1.564, 1.801, 0],
          [1.886, 2.276, 0],
          [2.321, 2.697, 0.012]
        ]
      }
    },
    {
      weight: 350,
      d: "M224 0L10 -700L84 -700L265 -114L440 -700L514 -700L687 -115L871 -700L945 -700L726 0L646 0L477 -578L305 0ZM1206 12Q1134 12 1078 -21Q1021 -55 990 -114Q958 -173 958 -250Q958 -327 989 -386Q1020 -445 1077 -478Q1133 -512 1204 -512Q1277 -512 1333 -478Q1389 -445 1420 -386Q1451 -327 1451 -250Q1451 -173 1420 -114Q1389 -55 1334 -21Q1278 12 1206 12ZM1206 -52Q1258 -52 1297 -77Q1336 -103 1359 -147Q1381 -192 1381 -250Q1381 -308 1359 -352Q1336 -397 1296 -422Q1256 -448 1204 -448Q1153 -448 1113 -422Q1073 -397 1051 -352Q1028 -308 1028 -250Q1028 -192 1051 -147Q1074 -103 1115 -77Q1155 -52 1206 -52ZM1566 0L1566 -500L1637 -500L1637 -411Q1666 -458 1714 -480Q1762 -502 1814 -502L1814 -437Q1769 -437 1729 -422Q1688 -407 1663 -372Q1637 -337 1637 -278L1637 0ZM1896 0L1896 -700L1967 -700L1967 -266L2188 -500L2277 -500L2092 -302L2298 0L2210 0L2045 -252L1967 -168L1967 0ZM2544 12Q2488 12 2447 -4Q2406 -21 2380 -48Q2353 -75 2342 -106L2404 -130Q2421 -95 2457 -73Q2493 -52 2534 -52Q2585 -52 2619 -72Q2653 -92 2653 -129Q2653 -163 2628 -184Q2603 -205 2554 -217L2505 -230Q2437 -248 2400 -283Q2363 -319 2363 -364Q2363 -434 2409 -473Q2455 -512 2547 -512Q2591 -512 2626 -499Q2661 -487 2686 -463Q2711 -440 2723 -408L2662 -381Q2647 -417 2617 -433Q2586 -449 2539 -449Q2490 -449 2462 -428Q2433 -407 2433 -368Q2433 -348 2456 -328Q2479 -308 2525 -296L2571 -285Q2620 -273 2654 -250Q2688 -227 2706 -197Q2723 -168 2723 -133Q2723 -88 2700 -55Q2677 -23 2637 -5Q2596 12 2544 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 0.01,
        inkRight: 2.723,
        ascent: 0.7,
        glyphs: [
          [0.01, 0.945, 0],
          [0.958, 1.451, 0.012],
          [1.566, 1.814, 0],
          [1.896, 2.298, 0],
          [2.342, 2.723, 0.012]
        ]
      }
    },
    {
      weight: 400,
      d: "M223 0L9 -700L94 -700L269 -129L438 -700L522 -700L688 -131L865 -700L950 -700L733 0L642 0L480 -563L313 0ZM1211 12Q1138 12 1082 -21Q1025 -55 993 -114Q961 -173 961 -250Q961 -327 993 -386Q1024 -445 1081 -478Q1137 -512 1209 -512Q1283 -512 1340 -478Q1396 -445 1428 -386Q1459 -327 1459 -250Q1459 -173 1428 -114Q1396 -55 1340 -21Q1284 12 1211 12ZM1211 -62Q1261 -62 1298 -86Q1335 -110 1357 -152Q1378 -194 1378 -250Q1378 -306 1357 -348Q1335 -390 1297 -414Q1259 -438 1209 -438Q1160 -438 1123 -414Q1085 -390 1064 -348Q1042 -306 1042 -250Q1042 -195 1064 -152Q1085 -110 1124 -86Q1162 -62 1211 -62ZM1570 0L1570 -500L1650 -500L1650 -411Q1680 -458 1728 -480Q1775 -502 1827 -502L1827 -427Q1783 -427 1743 -412Q1702 -398 1676 -365Q1650 -332 1650 -275L1650 0ZM1908 0L1908 -700L1988 -700L1988 -274L2201 -500L2302 -500L2116 -300L2322 0L2223 0L2063 -242L1988 -163L1988 0ZM2568 12Q2513 12 2472 -4Q2431 -21 2404 -48Q2376 -75 2364 -107L2434 -136Q2451 -102 2485 -81Q2519 -60 2560 -60Q2607 -60 2639 -78Q2671 -97 2671 -131Q2671 -162 2648 -181Q2624 -200 2578 -212L2530 -225Q2462 -243 2424 -279Q2386 -316 2386 -362Q2386 -433 2433 -472Q2479 -512 2571 -512Q2615 -512 2651 -499Q2687 -486 2713 -462Q2739 -439 2751 -407L2681 -376Q2668 -410 2638 -425Q2608 -440 2565 -440Q2519 -440 2493 -420Q2467 -401 2467 -366Q2467 -346 2489 -328Q2510 -311 2552 -300L2602 -287Q2651 -275 2684 -251Q2717 -228 2734 -198Q2751 -168 2751 -134Q2751 -89 2727 -56Q2703 -23 2662 -5Q2621 12 2568 12Z",
      metrics: {
        capFrac: 0.7,
        inkLeft: 9e-3,
        inkRight: 2.751,
        ascent: 0.7,
        glyphs: [
          [9e-3, 0.95, 0],
          [0.961, 1.459, 0.012],
          [1.57, 1.827, 0],
          [1.908, 2.322, 0],
          [2.364, 2.751, 0.012]
        ]
      }
    }
  ]
};

// src/app-icons.tsx
import { useId } from "react";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function roundedRectPath(x, y, w, h, r) {
  const iw = w - 2 * r;
  const ih = h - 2 * r;
  return `M${x + r} ${y}h${iw}a${r} ${r} 0 0 1 ${r} ${r}v${ih}a${r} ${r} 0 0 1 ${-r} ${r}h${-iw}a${r} ${r} 0 0 1 ${-r} ${-r}v${-ih}a${r} ${r} 0 0 1 ${r} ${-r}z`;
}
var rr = roundedRectPath;
var APP_ICON_SHAPES = {
  /** Slides: o slide. */
  slides: {
    pieces: [{ kind: "body", d: rr(0.5, 3.5, 22, 16, 3.4) }],
    eyes: [8.8, 19],
    y: 10.6,
    r: 4.3
  },
  /** Marketing: o marcador de salvar post. O recorte embaixo é a borda, não boca. */
  marketing: {
    pieces: [
      {
        kind: "body",
        d: "M4.3 0.5h15.4a2.8 2.8 0 0 1 2.8 2.8V23.5L12 17.4 1.5 23.5V3.3A2.8 2.8 0 0 1 4.3 0.5z"
      }
    ],
    eyes: [8.4, 19],
    y: 8.6,
    r: 3.9
  },
  /** Pages: as seções da página, o menu fino em cima e o bloco grande com os olhos. */
  pages: {
    pieces: [
      { kind: "body", d: rr(0.5, 0.5, 22, 3.4, 1.7) },
      { kind: "body", d: rr(0.5, 6, 22, 17.5, 3.2) }
    ],
    eyes: [8.6, 19],
    y: 12.8,
    r: 4
  },
  /** Works (o CRM): a agenda de contatos. */
  works: {
    pieces: [
      { kind: "body", d: rr(4, 0.5, 18, 23, 3) },
      { kind: "line", d: "M2.7 6.2h2M2.7 12h2M2.7 17.8h2", w: 2.4 }
    ],
    eyes: [10.4, 19.6],
    y: 9.4,
    r: 3.9
  },
  /** Commerce: a sacola. */
  commerce: {
    pieces: [
      { kind: "body", d: "M3.5 8h17l-.9 13a2.6 2.6 0 0 1-2.6 2.5H7a2.6 2.6 0 0 1-2.6-2.5z" },
      { kind: "line", d: "M8 8.6V6.5a4 4 0 0 1 8 0v2.1", w: 2.2 }
    ],
    eyes: [9, 18.6],
    y: 15.2,
    r: 3.9
  }
};
var SUITE_APPS = {
  slides: {
    slug: "slides",
    name: "Slides",
    color: BRAND.lime,
    shape: APP_ICON_SHAPES.slides,
    lockup: LOCKUP_SLIDES
  },
  marketing: {
    slug: "marketing",
    name: "Marketing",
    color: BRAND.purple,
    shape: APP_ICON_SHAPES.marketing,
    lockup: LOCKUP_MARKETING
  },
  pages: {
    slug: "pages",
    name: "Pages",
    color: BRAND.cyan,
    shape: APP_ICON_SHAPES.pages,
    lockup: LOCKUP_PAGES
  },
  works: {
    slug: "works",
    name: "Works",
    color: BRAND.orange,
    shape: APP_ICON_SHAPES.works,
    lockup: LOCKUP_WORKS
  },
  commerce: {
    slug: "commerce",
    name: "Commerce",
    color: BRAND.coral,
    shape: APP_ICON_SHAPES.commerce,
    lockup: LOCKUP_COMMERCE
  }
};
function suiteApp(slug) {
  return SUITE_APPS[slug];
}
function inkOn(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return BRAND.ink;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
  return lum > 0.3 ? BRAND.ink : BRAND.paper;
}
var OUTLINE = 2.4;
var TILE = 100;
var TILE_RADIUS = 28;
var GLYPH = 70;
function Glyph({
  shape,
  inverse,
  maskId
}) {
  const s = shape;
  const pupils = s.eyes.map((x) => ({ cx: x + s.r * 0.18, cy: s.y - s.r * 0.12, r: s.r * 0.42 }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: "-3", y: "-3", width: "30", height: "30", children: [
      /* @__PURE__ */ jsx2("rect", { x: "-3", y: "-3", width: "30", height: "30", fill: "#fff" }),
      inverse ? pupils.map((p) => /* @__PURE__ */ jsx2("circle", { ...p, fill: "#000" }, p.cx)) : s.pieces.map(
        (piece, i) => piece.kind === "hole" ? /* @__PURE__ */ jsx2("path", { d: piece.d, fill: "#000" }, i) : piece.kind === "cut" ? /* @__PURE__ */ jsx2("path", { d: piece.d, fill: "none", stroke: "#000", strokeWidth: piece.w }, i) : null
      ),
      !inverse && s.eyes.map((x) => /* @__PURE__ */ jsx2("circle", { cx: x, cy: s.y, r: s.r, fill: "#000" }, x))
    ] }),
    /* @__PURE__ */ jsxs(
      "g",
      {
        mask: `url(#${maskId})`,
        fill: "currentColor",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          s.pieces.map((piece, i) => {
            if (piece.kind === "body")
              return inverse ? /* @__PURE__ */ jsx2("path", { d: piece.d, fill: "none", strokeWidth: OUTLINE }, i) : /* @__PURE__ */ jsx2("path", { d: piece.d, stroke: "none" }, i);
            if (piece.kind === "line")
              return /* @__PURE__ */ jsx2("path", { d: piece.d, fill: "none", strokeWidth: piece.w }, i);
            if (!inverse) return null;
            return piece.kind === "hole" ? /* @__PURE__ */ jsx2("path", { d: piece.d, stroke: "none" }, i) : /* @__PURE__ */ jsx2("path", { d: piece.d, fill: "none", strokeWidth: piece.w }, i);
          }),
          inverse && s.eyes.map((x) => /* @__PURE__ */ jsx2("circle", { cx: x, cy: s.y, r: s.r, stroke: "none" }, x))
        ]
      }
    ),
    !inverse && pupils.map((p) => /* @__PURE__ */ jsx2("circle", { ...p, fill: "currentColor" }, p.cx))
  ] });
}
function SuiteAppIcon({
  app,
  size = 40,
  neutral = false,
  name,
  className
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const resolved = typeof app === "string" ? suiteApp(app) : app;
  const label = name ?? resolved?.name ?? (typeof app === "string" ? app : "");
  const decorative = label === "";
  const plain = neutral || !resolved;
  const ink2 = plain ? void 0 : inkOn(resolved.color);
  const scale = GLYPH / 24;
  const offset = (TILE - GLYPH) / 2;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      className: className ? `dd-app-mark ${className}` : "dd-app-mark",
      "data-neutral": plain || void 0,
      width: size,
      height: size,
      viewBox: `0 0 ${TILE} ${TILE}`,
      role: decorative ? void 0 : "img",
      "aria-label": decorative ? void 0 : label,
      "aria-hidden": decorative || void 0,
      style: ink2 ? { color: ink2 } : void 0,
      children: [
        /* @__PURE__ */ jsx2(
          "rect",
          {
            className: "dd-app-mark-tile",
            width: TILE,
            height: TILE,
            rx: TILE_RADIUS,
            fill: plain ? void 0 : resolved.color
          }
        ),
        resolved ? /* @__PURE__ */ jsx2("g", { transform: `translate(${offset} ${offset}) scale(${scale})`, children: /* @__PURE__ */ jsx2(
          Glyph,
          {
            shape: resolved.shape,
            inverse: plain || ink2 !== BRAND.ink,
            maskId: `dd-app-mark-${id}`
          }
        ) }) : /* @__PURE__ */ jsx2(
          "text",
          {
            x: TILE / 2,
            y: TILE / 2,
            dy: "0.35em",
            textAnchor: "middle",
            fontSize: 46,
            fontWeight: 600,
            fill: "currentColor",
            children: label.trim().charAt(0).toUpperCase()
          }
        )
      ]
    }
  );
}

// src/suite-rail.tsx
import { useCallback, useState } from "react";
import { ActionIcon as ActionIcon2, Tooltip as Tooltip2, UnstyledButton } from "@mantine/core";
import { CaretLineLeft, DotsNine } from "@phosphor-icons/react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var SUITE_RAIL_LABELS = {
  nav: "Apps da su\xEDte",
  here: "voc\xEA est\xE1 aqui",
  collapse: "Recolher os apps",
  expand: "Mostrar os apps"
};
var STORAGE_KEY = "dd-suite-rail-collapsed";
function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
function SuiteRail({
  services,
  currentSlug,
  onSelect,
  collapsed: controlled,
  onCollapsedChange,
  labels,
  children,
  className
}) {
  const text = { ...SUITE_RAIL_LABELS, ...labels };
  const [stored, setStored] = useState(readStored);
  const collapsed = controlled ?? stored;
  const [hover, setHover] = useState(null);
  const setCollapsed = useCallback(
    (next) => {
      if (controlled === void 0) {
        setStored(next);
        try {
          localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        } catch {
        }
      }
      onCollapsedChange?.(next);
    },
    [controlled, onCollapsedChange]
  );
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: className ? `dd-suite-shell ${className}` : "dd-suite-shell",
      "data-collapsed": collapsed || void 0,
      children: [
        /* @__PURE__ */ jsxs2("nav", { className: "dd-suite-rail", "aria-label": text.nav, inert: collapsed, children: [
          services.map((service) => {
            const here = service.slug === currentSlug;
            const app = suiteApp(service.slug);
            const label = app?.name ?? service.name;
            const item = /* @__PURE__ */ jsx3(
              SuiteAppIcon,
              {
                app: app ?? service.name,
                size: 32,
                neutral: !here && hover !== service.slug,
                name: ""
              }
            );
            return (
              // A dica toma o `onMouseEnter` do link: o passar do mouse vem do invólucro.
              /* @__PURE__ */ jsx3(
                "span",
                {
                  className: "dd-suite-rail-slot",
                  onMouseEnter: () => setHover(service.slug),
                  onMouseLeave: () => setHover(null),
                  onFocus: () => setHover(service.slug),
                  onBlur: () => setHover(null),
                  children: /* @__PURE__ */ jsx3(
                    Tooltip2,
                    {
                      label: here ? `${label} \xB7 ${text.here}` : label,
                      position: "right",
                      offset: 12,
                      children: /* @__PURE__ */ jsx3(
                        UnstyledButton,
                        {
                          component: "a",
                          href: service.href,
                          className: "dd-suite-rail-item",
                          "aria-label": label,
                          "aria-current": here ? "page" : void 0,
                          "data-current": here || void 0,
                          onClick: (event) => onSelect?.(service, event),
                          children: item
                        }
                      )
                    }
                  )
                },
                service.slug
              )
            );
          }),
          /* @__PURE__ */ jsx3(Tooltip2, { label: text.collapse, position: "right", offset: 12, children: /* @__PURE__ */ jsx3(
            UnstyledButton,
            {
              className: "dd-suite-rail-fold",
              "aria-label": text.collapse,
              onClick: () => setCollapsed(true),
              children: /* @__PURE__ */ jsx3(CaretLineLeft, { size: 16 })
            }
          ) })
        ] }),
        collapsed && /* @__PURE__ */ jsx3(Tooltip2, { label: text.expand, position: "right", offset: 8, children: /* @__PURE__ */ jsx3(
          ActionIcon2,
          {
            variant: "default",
            size: 22,
            className: "dd-suite-rail-open",
            "aria-label": text.expand,
            onClick: () => setCollapsed(false),
            children: /* @__PURE__ */ jsx3(DotsNine, { size: 13, weight: "bold" })
          }
        ) }),
        children
      ]
    }
  );
}

// src/components.tsx
import { isLightColor, useMantineTheme as useMantineTheme2 } from "@mantine/core";
import { Check } from "@phosphor-icons/react";

// src/lockup-view.tsx
import { useEffect, useId as useId2, useState as useState2 } from "react";
import { useMantineTheme } from "@mantine/core";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function LockupView({
  version,
  height,
  app,
  mark,
  label,
  color
}) {
  const maskId = useId2();
  const theme = useMantineTheme();
  const weight = lockupWeight(height);
  const outline = pickOutline(app.outlines, weight);
  const live = useLiveMetrics(outline ? null : app.name, weight, theme.fontFamily ?? "sans-serif");
  const metrics = outline?.metrics ?? live;
  if (!metrics) {
    return /* @__PURE__ */ jsx4("span", { role: "img", "aria-label": label, className: "dd-lockup", style: { height, color }, children: lockupHasMark(version) && mark });
  }
  const b = lockupLayout(version, height, metrics);
  const nameProps = outline ? {
    d: outline.d,
    transform: `translate(${b.text.x} ${b.text.baseline}) scale(${b.text.size / 1e3})`
  } : null;
  const textProps = {
    x: b.text.x,
    y: b.text.baseline,
    fontFamily: theme.fontFamily,
    fontWeight: weight,
    fontSize: b.text.size
  };
  const name = nameProps ? /* @__PURE__ */ jsx4("path", { ...nameProps }) : /* @__PURE__ */ jsx4("text", { ...textProps, children: app.name });
  return /* @__PURE__ */ jsxs3("span", { role: "img", "aria-label": label, className: "dd-lockup", style: { height, color }, children: [
    lockupHasMark(version) && mark,
    /* @__PURE__ */ jsxs3(
      "svg",
      {
        className: "dd-lockup-type",
        width: b.width,
        height,
        viewBox: `0 0 ${b.width} ${height}`,
        style: { marginLeft: b.gap },
        "aria-hidden": true,
        children: [
          b.knock && /* @__PURE__ */ jsxs3(
            "mask",
            {
              id: maskId,
              maskUnits: "userSpaceOnUse",
              x: -b.width,
              y: -height,
              width: b.width * 3,
              height: height * 3,
              children: [
                /* @__PURE__ */ jsx4("rect", { x: -b.width, y: -height, width: b.width * 3, height: height * 3, fill: "#fff" }),
                /* @__PURE__ */ jsx4(
                  "g",
                  {
                    fill: "#000",
                    stroke: "#000",
                    strokeWidth: nameProps ? b.knock * 1e3 / b.text.size : b.knock,
                    strokeLinejoin: "round",
                    children: name
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs3("g", { fill: "currentColor", children: [
            name,
            b.word && /* @__PURE__ */ jsx4("g", { mask: b.knock ? `url(#${maskId})` : void 0, children: /* @__PURE__ */ jsx4("g", { transform: wordTransform(b.word), children: DECKDOO_WORD.paths.map((d) => /* @__PURE__ */ jsx4("path", { d }, d.slice(0, 16))) }) }),
            b.rule && /* @__PURE__ */ jsx4(
              "rect",
              {
                x: b.rule.x - b.rule.width / 2,
                y: b.rule.y1,
                width: b.rule.width,
                height: b.rule.y2 - b.rule.y1
              }
            )
          ] })
        ]
      }
    )
  ] });
}
var measureCtx;
function measureLive(name, weight, family) {
  if (typeof document === "undefined") return null;
  measureCtx ??= document.createElement("canvas").getContext("2d");
  const ctx = measureCtx;
  if (!ctx) return null;
  ctx.font = `${weight} 100px ${family}`;
  const cap = ctx.measureText("H");
  const all = ctx.measureText(name);
  const chars = [...name];
  return {
    capFrac: cap.actualBoundingBoxAscent / 100 || 0.7,
    inkLeft: -all.actualBoundingBoxLeft / 100,
    inkRight: all.actualBoundingBoxRight / 100,
    ascent: all.actualBoundingBoxAscent / 100,
    glyphs: chars.map((ch, i) => {
      const pen = ctx.measureText(chars.slice(0, i).join("")).width;
      const g = ctx.measureText(ch);
      return [
        (pen - g.actualBoundingBoxLeft) / 100,
        (pen + g.actualBoundingBoxRight) / 100,
        g.actualBoundingBoxDescent / 100
      ];
    })
  };
}
function useLiveMetrics(name, weight, family) {
  const [epoch, setEpoch] = useState2(0);
  useEffect(() => {
    if (name === null || typeof document === "undefined" || !document.fonts) return;
    const bump = () => setEpoch((e) => e + 1);
    document.fonts.addEventListener("loadingdone", bump);
    return () => document.fonts.removeEventListener("loadingdone", bump);
  }, [name]);
  return name === null || epoch < 0 ? null : measureLive(name, weight, family);
}

// src/side.tsx
import {
  createContext as createContext2,
  useCallback as useCallback2,
  useContext as useContext2,
  useEffect as useEffect3,
  useRef as useRef2,
  useState as useState3
} from "react";
import { ActionIcon as ActionIcon3, Collapse, Popover, Tooltip as Tooltip3 } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { CaretDown, CaretRight, SidebarSimple } from "@phosphor-icons/react";

// src/scroll.tsx
import { useEffect as useEffect2, useRef } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function useScrollFade() {
  const ref = useRef(null);
  useEffect2(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const top = el.scrollTop > 1;
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      el.toggleAttribute("data-fade-top", top);
      el.toggleAttribute("data-fade-bottom", bottom);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    const watch = () => {
      if (!resize) return;
      resize.disconnect();
      resize.observe(el);
      for (const child of Array.from(el.children)) resize.observe(child);
    };
    watch();
    const mutations = new MutationObserver(() => {
      watch();
      update();
    });
    mutations.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "data-open", "hidden"]
    });
    return () => {
      el.removeEventListener("scroll", update);
      resize?.disconnect();
      mutations.disconnect();
    };
  }, []);
  return ref;
}
function SideScroll({ className, ...rest }) {
  const ref = useScrollFade();
  return /* @__PURE__ */ jsx5(
    "div",
    {
      ref,
      className: className ? `dd-side-scroll dd-scroll-fade ${className}` : "dd-side-scroll dd-scroll-fade",
      ...rest
    }
  );
}

// src/side.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var CollapsedContext = createContext2(false);
function useSideCollapsed() {
  return useContext2(CollapsedContext);
}
var STORAGE_KEY2 = "dd-side-collapsed";
function readStored2() {
  try {
    return localStorage.getItem(STORAGE_KEY2) === "1";
  } catch {
    return false;
  }
}
var SIDE_LABELS = {
  nav: "Navega\xE7\xE3o",
  collapse: "Recolher a barra",
  expand: "Abrir a barra"
};
function SideBar({
  brand,
  brandCollapsed,
  top,
  foot,
  children,
  collapsible = true,
  collapsed: controlled,
  onCollapsedChange,
  labels,
  className
}) {
  const text = { ...SIDE_LABELS, ...labels };
  const [stored, setStored] = useState3(() => collapsible && readStored2());
  const narrow = useMediaQuery("(max-width: 48em)", false, { getInitialValueInEffect: false });
  const canCollapse = collapsible && !narrow;
  const collapsed = canCollapse && (controlled ?? stored);
  const toggle = useCallback2(() => {
    const next = !collapsed;
    if (controlled === void 0) {
      setStored(next);
      try {
        localStorage.setItem(STORAGE_KEY2, next ? "1" : "0");
      } catch {
      }
    }
    onCollapsedChange?.(next);
  }, [collapsed, controlled, onCollapsedChange]);
  useEffect3(() => {
    if (!canCollapse) return;
    const onKey = (event) => {
      if (event.key !== "[" || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"))
        return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canCollapse, toggle]);
  const label = collapsed ? text.expand : text.collapse;
  return /* @__PURE__ */ jsx6(CollapsedContext, { value: collapsed, children: /* @__PURE__ */ jsxs4(
    "aside",
    {
      className: className ? `dd-side dd-panel ${className}` : "dd-side dd-panel",
      "data-collapsed": collapsed || void 0,
      children: [
        /* @__PURE__ */ jsxs4("div", { className: "dd-side-head", children: [
          /* @__PURE__ */ jsx6("span", { className: "dd-side-brand", children: collapsed ? brandCollapsed : brand }),
          canCollapse && /* @__PURE__ */ jsx6(Tooltip3, { label: `${label} ( [ )`, position: "right", offset: 8, children: /* @__PURE__ */ jsx6(
            ActionIcon3,
            {
              variant: collapsed ? "default" : "subtle",
              color: collapsed ? void 0 : "gray",
              size: collapsed ? 22 : "md",
              className: "dd-side-collapse",
              onClick: toggle,
              "aria-label": label,
              "aria-expanded": !collapsed,
              children: /* @__PURE__ */ jsx6(SidebarSimple, { size: collapsed ? 13 : 18 })
            }
          ) })
        ] }),
        top && /* @__PURE__ */ jsx6("div", { className: "dd-side-top", children: top }),
        /* @__PURE__ */ jsx6(SideScroll, { children: /* @__PURE__ */ jsx6("nav", { className: "dd-side-nav", "aria-label": text.nav, children }) }),
        foot && /* @__PURE__ */ jsx6("div", { className: "dd-side-foot", children: foot })
      ]
    }
  ) });
}
function SideTip({ label, children }) {
  const collapsed = useSideCollapsed();
  return /* @__PURE__ */ jsx6(Tooltip3, { label, position: "right", offset: 12, disabled: !collapsed, openDelay: 80, children });
}
function NavSection({ label, children }) {
  return /* @__PURE__ */ jsxs4("div", { className: "dd-nav-section", children: [
    label && /* @__PURE__ */ jsx6("div", { className: "dd-eyebrow dd-side-label", children: label }),
    children
  ] });
}
function NavGroup({
  icon,
  label,
  defaultOpen = false,
  active: active2,
  open: controlledOpen,
  onOpenChange,
  itemsId,
  children
}) {
  const collapsed = useSideCollapsed();
  const [ownOpen, setOwnOpen] = useState3(defaultOpen || !!active2);
  const open = controlledOpen ?? ownOpen;
  const setOpen = (next) => {
    if (controlledOpen === void 0) setOwnOpen(next);
    onOpenChange?.(next);
  };
  const [flyout, setFlyout] = useState3(false);
  const closeTimer = useRef2(void 0);
  const hoverOpen = () => {
    clearTimeout(closeTimer.current);
    setFlyout(true);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setFlyout(false), 140);
  };
  useEffect3(() => () => clearTimeout(closeTimer.current), []);
  if (collapsed) {
    return /* @__PURE__ */ jsxs4(
      Popover,
      {
        opened: flyout,
        onChange: setFlyout,
        position: "right-start",
        offset: 12,
        withinPortal: true,
        shadow: "md",
        children: [
          /* @__PURE__ */ jsx6(Popover.Target, { children: /* @__PURE__ */ jsxs4(
            "button",
            {
              type: "button",
              className: "dd-nav-item dd-nav-group-head",
              "data-has-active": active2 || void 0,
              "aria-label": label,
              "aria-expanded": flyout,
              onClick: hoverOpen,
              onMouseEnter: hoverOpen,
              onMouseLeave: hoverClose,
              children: [
                icon,
                /* @__PURE__ */ jsx6("span", { className: "dd-nav-text", children: label }),
                /* @__PURE__ */ jsx6(CaretRight, { size: 10, className: "dd-nav-flyout-caret" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs4(
            Popover.Dropdown,
            {
              className: "dd-flyout",
              onClick: () => setFlyout(false),
              onMouseEnter: hoverOpen,
              onMouseLeave: hoverClose,
              children: [
                /* @__PURE__ */ jsx6("div", { className: "dd-eyebrow dd-flyout-label", children: label }),
                /* @__PURE__ */ jsx6(CollapsedContext, { value: false, children })
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: "dd-nav-group",
      "data-open": open || void 0,
      "data-has-active": active2 || void 0,
      children: [
        /* @__PURE__ */ jsxs4(
          "button",
          {
            type: "button",
            className: "dd-nav-item dd-nav-group-head",
            "aria-expanded": open,
            "aria-controls": itemsId,
            onClick: () => setOpen(!open),
            title: label,
            children: [
              icon,
              /* @__PURE__ */ jsx6("span", { className: "dd-nav-text", children: label }),
              /* @__PURE__ */ jsx6(CaretDown, { size: 14, className: "dd-nav-caret" })
            ]
          }
        ),
        /* @__PURE__ */ jsx6(Collapse, { expanded: open, children: /* @__PURE__ */ jsx6("div", { className: "dd-nav-group-body", id: itemsId, children }) })
      ]
    }
  );
}

// src/dudoo.tsx
import { useId as useId3 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var VIEW = { w: 114.4, h: 125.3 };
var BODY = "M20.95,0H49.94C62.04,0,73,2.72,82.81,8.17C92.62,13.62,100.33,21.12,105.96,30.69C111.59,40.25,114.4,50.91,114.4,62.65C114.4,74.39,111.59,85.05,105.96,94.61C100.33,104.18,92.62,111.68,82.81,117.13C73,122.58,62.04,125.3,49.94,125.3H20.95C9.38,125.3,0,115.92,0,104.35V20.95C0,9.38,9.38,0,20.95,0Z";
var EYES = {
  left: { cx: 42.45, cy: 42.97 },
  right: { cx: 98.56, cy: 42.97 }
};
var EYE_RX = 24.6;
var EYE_RY = 24;
var PUPIL_R = 10.05;
var LINE = 8.5;
var MAX_SHUT = 0.9;
var CLOSED = 0.7;
var OPEN = { size: 1, top: 0, tilt: 0, bottom: 0 };
var NEUTRAL = { look: [0, 0], pupil: 1, left: OPEN, right: OPEN, lean: 0 };
function dudooExpression(e) {
  const { left, right, both, ...rest } = e;
  return {
    ...NEUTRAL,
    ...rest,
    left: { ...OPEN, ...both, ...left },
    right: { ...OPEN, ...both, ...right }
  };
}
var DUDOO_MOODS = {
  neutro: NEUTRAL,
  olhando: dudooExpression({ look: [-1, 0.1] }),
  pensando: dudooExpression({ look: [0.75, -0.75], both: { top: 0.12 } }),
  curioso: dudooExpression({ look: [0.35, -0.2], left: { size: 0.82 }, right: { size: 1.12 } }),
  "de-canto": dudooExpression({ look: [-0.9, 0.15], both: { top: 0.42 } }),
  focado: dudooExpression({
    look: [0, 0.25],
    left: { top: 0.3, tilt: 14 },
    right: { top: 0.3, tilt: -14 }
  }),
  empolgado: dudooExpression({ pupil: 0.72, both: { size: 1.12 } }),
  feliz: dudooExpression({ both: { arc: 1 } }),
  piscada: dudooExpression({ look: [-0.35, -0.15], right: { arc: 1 } }),
  esperando: dudooExpression({ look: [-0.2, 0.9], both: { top: 0.55 } }),
  dormindo: dudooExpression({ both: { arc: -0.6 } }),
  confuso: dudooExpression({
    left: { look: [-0.7, -0.7], size: 1.05 },
    right: { look: [0.6, 0.6], size: 0.9, top: 0.2 }
  })
};
var resolve = (mood) => typeof mood === "string" ? DUDOO_MOODS[mood] : mood;
function eyeGeometry(side, eye, ex) {
  const { cx: cx3, cy } = EYES[side];
  const rx = EYE_RX * eye.size;
  const ry = EYE_RY * eye.size;
  const shut = eye.top + eye.bottom;
  const scale = shut > MAX_SHUT ? MAX_SHUT / shut : 1;
  const topY = cy - ry + eye.top * scale * 2 * ry;
  const bottomY = cy + ry - eye.bottom * scale * 2 * ry;
  const pr = PUPIL_R * ex.pupil;
  const travel = Math.max(0, Math.min(rx, ry) - pr - 2.5);
  let [lx, ly] = eye.look ?? ex.look;
  const len = Math.hypot(lx, ly);
  if (len > 1) {
    lx /= len;
    ly /= len;
  }
  const closed2 = eye.arc !== void 0;
  const w = rx * 0.78;
  const lift = (eye.arc ?? 0) * ry * 0.5;
  return {
    cx: cx3,
    cy,
    rx,
    ry,
    topY,
    bottomY,
    px: cx3 + lx * travel,
    py: cy + ly * travel,
    pr,
    pupil: !closed2 && shut < CLOSED,
    closed: closed2,
    arc: `M${cx3 - w},${cy + lift * 0.5}Q${cx3},${cy - lift * 1.5} ${cx3 + w},${cy + lift * 0.5}`,
    stroke: 7.5 * eye.size
  };
}
function DuDooFace({
  mood = "neutro",
  size = 96,
  color = "var(--dd-dudoo-body, currentColor)",
  line = "var(--dd-dudoo-line, transparent)",
  pupil = color,
  sclera = line,
  className,
  style,
  title = "DuDoo"
}) {
  const id = useId3().replace(/[^\w-]/g, "");
  const ex = resolve(mood);
  const eyes = ["left", "right"].map((side) => ({
    side,
    eye: ex[side],
    g: eyeGeometry(side, ex[side], ex)
  }));
  const open = (side, child) => /* @__PURE__ */ jsx7("g", { clipPath: `url(#${id}-${side}-top)`, children: /* @__PURE__ */ jsx7("g", { clipPath: `url(#${id}-${side}-bottom)`, children: child }) }, side);
  return /* @__PURE__ */ jsxs5(
    "svg",
    {
      viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
      height: size,
      width: size * VIEW.w / VIEW.h,
      className,
      style: { overflow: "visible", ...style },
      role: title ? "img" : void 0,
      "aria-label": title || void 0,
      "aria-hidden": title ? void 0 : true,
      children: [
        /* @__PURE__ */ jsxs5("defs", { children: [
          eyes.map(({ side, eye, g }) => /* @__PURE__ */ jsxs5("g", { children: [
            /* @__PURE__ */ jsx7("clipPath", { id: `${id}-${side}-top`, children: /* @__PURE__ */ jsx7(
              "rect",
              {
                x: g.cx - 80,
                y: g.topY,
                width: 160,
                height: 160,
                transform: `rotate(${eye.tilt} ${g.cx} ${g.topY})`
              }
            ) }),
            /* @__PURE__ */ jsx7("clipPath", { id: `${id}-${side}-bottom`, children: /* @__PURE__ */ jsx7("rect", { x: g.cx - 80, y: g.bottomY - 160, width: 160, height: 160 }) }),
            /* @__PURE__ */ jsx7("clipPath", { id: `${id}-${side}-ball`, children: /* @__PURE__ */ jsx7("ellipse", { cx: g.cx, cy: g.cy, rx: g.rx, ry: g.ry }) })
          ] }, side)),
          /* @__PURE__ */ jsx7("clipPath", { id: `${id}-d`, children: /* @__PURE__ */ jsx7("path", { d: BODY }) }),
          /* @__PURE__ */ jsxs5("mask", { id: `${id}-body`, maskUnits: "userSpaceOnUse", x: -20, y: -20, width: 160, height: 170, children: [
            /* @__PURE__ */ jsx7("path", { d: BODY, fill: "#fff" }),
            eyes.map(
              ({ side, g }) => g.closed ? /* @__PURE__ */ jsx7(
                "path",
                {
                  d: g.arc,
                  fill: "none",
                  stroke: "#000",
                  strokeWidth: g.stroke,
                  strokeLinecap: "round"
                },
                side
              ) : open(side, /* @__PURE__ */ jsx7("ellipse", { cx: g.cx, cy: g.cy, rx: g.rx, ry: g.ry, fill: "#000" }))
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("g", { transform: ex.lean ? `rotate(${ex.lean} 57.2 62.65)` : void 0, children: [
          eyes.map(
            ({ side, g }) => !g.closed && open(side, /* @__PURE__ */ jsx7("ellipse", { cx: g.cx, cy: g.cy, rx: g.rx, ry: g.ry, fill: sclera }))
          ),
          /* @__PURE__ */ jsx7("path", { d: BODY, fill: line }),
          /* @__PURE__ */ jsx7("path", { d: BODY, fill: color, mask: `url(#${id}-body)` }),
          /* @__PURE__ */ jsx7(
            "path",
            {
              d: BODY,
              fill: "none",
              stroke: line,
              strokeWidth: LINE * 2,
              clipPath: `url(#${id}-d)`
            }
          ),
          eyes.map(
            ({ side, g }) => g.pupil && open(
              side,
              /* @__PURE__ */ jsx7("g", { clipPath: `url(#${id}-${side}-ball)`, children: /* @__PURE__ */ jsx7("circle", { cx: g.px, cy: g.py, r: g.pr, fill: pupil }) })
            )
          )
        ] })
      ]
    }
  );
}

// src/brand/dudoo-tile.svg
var dudoo_tile_default = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%20%3C!--%20O%20papel%20de%20parede%20do%20DuDoo%20no%20claro%3A%20o%20mascote%20repetido%2C%20como%20o%20fundo%20de%20uma%20conversa.%20Vira%20m%C3%A1scara%20(%60DuDooWall%60).%20--%3E%20%3Cdefs%3E%20%3Cg%20id%3D%22m%22%3E%20%3Cpath%20d%3D%22M89.9%2C37.81c-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59Z%22%2F%3E%20%3Cpath%20d%3D%22M47.52%2C34.22c-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63Z%22%2F%3E%20%3Cpath%20d%3D%22M114.39%2C61.66c-.99.77-2.04%2C1.49-3.18%2C2.12-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.36-1.87%2C7.09-2.9%2C11.16-3.1-4.13-4.25-8.87-7.89-14.27-10.89C73%2C2.72%2C62.04%2C0%2C49.94%2C0h-28.99C9.38%2C0%2C0%2C9.38%2C0%2C20.95v83.4c0%2C11.57%2C9.38%2C20.95%2C20.95%2C20.95h28.99c12.1%2C0%2C23.06-2.72%2C32.87-8.17%2C9.81-5.45%2C17.52-12.95%2C23.15-22.52%2C5.63-9.56%2C8.44-20.22%2C8.44-31.96%2C0-.33-.01-.66-.01-.99ZM63.98%2C55.17c-2.15%2C3.65-5.11%2C6.52-8.88%2C8.61-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.77-2.09%2C7.98-3.14%2C12.65-3.14s8.88%2C1.05%2C12.65%2C3.14c3.77%2C2.09%2C6.73%2C4.96%2C8.88%2C8.61%2C2.15%2C3.65%2C3.23%2C7.71%2C3.23%2C12.2s-1.08%2C8.55-3.23%2C12.2Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fdefs%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(18%2022)%20rotate(-14%2010.0%2011.0)%20scale(0.1756)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(92%2010)%20rotate(10%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%2040)%20rotate(6%2013.7%2015.0)%20scale(0.2394)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(236%2018)%20rotate(-20%208.2%209.0)%20scale(0.1437)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(270%2092)%20rotate(16%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(40%20104)%20rotate(24%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(110%2092)%20rotate(-8%2011.9%2013.0)%20scale(0.2075)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(196%20112)%20rotate(-24%207.3%208.0)%20scale(0.1277)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(250%20160)%20rotate(12%2011.9%2013.0)%20scale(0.2075)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(20%20176)%20rotate(8%2012.8%2014.0)%20scale(0.2235)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(96%20170)%20rotate(-18%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%20190)%20rotate(20%209.1%2010.0)%20scale(0.1596)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(214%20222)%20rotate(-6%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(60%20240)%20rotate(-22%208.2%209.0)%20scale(0.1437)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(130%20252)%20rotate(4%2011.0%2012.0)%20scale(0.1915)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(256%20256)%20rotate(26%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3C%2Fsvg%3E";

// src/brand/dudoo-tile-inverse.svg
var dudoo_tile_inverse_default = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%20%3C!--%20O%20papel%20de%20parede%20do%20DuDoo%20no%20escuro%3A%20o%20mascote%20inverso%2C%20nas%20mesmas%20posi%C3%A7%C3%B5es%20do%20claro.%20Vira%20m%C3%A1scara%20(%60DuDooWall%60).%20--%3E%20%3Cdefs%3E%20%3Cg%20id%3D%22m%22%3E%20%3Cpath%20d%3D%22M40.46%2C23.09c-1.13-1.91-2.67-3.41-4.64-4.5-1.97-1.09-4.18-1.64-6.61-1.64s-4.64.55-6.61%2C1.64c-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c1.97-1.09%2C3.52-2.6%2C4.64-4.5%2C1.13-1.91%2C1.69-4.03%2C1.69-6.38s-.56-4.47-1.69-6.38ZM33.73%2C32.17c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7Z%22%2F%3E%20%3Cpath%20d%3D%22M68.45%2C19.5c-3.57-6.07-8.53-10.9-14.74-14.34C47.55%2C1.73%2C40.62%2C0%2C33.12%2C0h-15.16C8.06%2C0%2C0%2C8.05%2C0%2C17.96v43.62c0%2C9.9%2C8.06%2C17.96%2C17.96%2C17.96h15.16c7.51%2C0%2C14.43-1.73%2C20.59-5.16%2C6.21-3.45%2C11.17-8.28%2C14.74-14.34%2C3.57-6.07%2C5.38-12.89%2C5.38-20.27s-1.81-14.2-5.38-20.27ZM61.2%2C24.9c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68ZM62.42%2C56.48c-2.94%2C5-6.98%2C8.93-12.11%2C11.78-5.13%2C2.85-10.86%2C4.27-17.19%2C4.27h-15.16c-6.05%2C0-10.96-4.91-10.96-10.96V17.96c0-6.05%2C4.91-10.96%2C10.96-10.96h15.16c6.33%2C0%2C12.06%2C1.42%2C17.19%2C4.27%2C2.82%2C1.57%2C5.3%2C3.47%2C7.46%2C5.7-2.13.1-4.08.64-5.84%2C1.62-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c.59-.33%2C1.15-.7%2C1.66-1.11%2C0%2C.17%2C0%2C.34%2C0%2C.52%2C0%2C6.14-1.47%2C11.71-4.42%2C16.72Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fdefs%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(18%2022)%20rotate(-14%2010.2%2011.0)%20scale(0.2766)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(92%2010)%20rotate(10%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%2040)%20rotate(6%2013.9%2015.0)%20scale(0.3772)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(236%2018)%20rotate(-20%208.4%209.0)%20scale(0.2263)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(270%2092)%20rotate(16%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(40%20104)%20rotate(24%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(110%2092)%20rotate(-8%2012.1%2013.0)%20scale(0.3269)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(196%20112)%20rotate(-24%207.4%208.0)%20scale(0.2012)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(250%20160)%20rotate(12%2012.1%2013.0)%20scale(0.3269)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(20%20176)%20rotate(8%2013.0%2014.0)%20scale(0.3521)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(96%20170)%20rotate(-18%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%20190)%20rotate(20%209.3%2010.0)%20scale(0.2515)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(214%20222)%20rotate(-6%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(60%20240)%20rotate(-22%208.4%209.0)%20scale(0.2263)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(130%20252)%20rotate(4%2011.1%2012.0)%20scale(0.3018)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(256%20256)%20rotate(26%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3C%2Fsvg%3E";

// src/components.tsx
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var cx = (...names) => names.filter(Boolean).join(" ");
function Panel({
  title,
  actions,
  className,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxs6("section", { className: cx("dd-panel", className), ...rest, children: [
    (title || actions) && /* @__PURE__ */ jsxs6("header", { className: "dd-panel-head", children: [
      typeof title === "string" ? /* @__PURE__ */ jsx8("h3", { style: { margin: 0 }, children: title }) : title,
      actions
    ] }),
    children
  ] });
}
function Block({ className, ...rest }) {
  return /* @__PURE__ */ jsx8("div", { className: cx("dd-block", className), ...rest });
}
function Count({ children }) {
  return /* @__PURE__ */ jsx8("span", { className: "dd-count", children });
}
function NavItem({
  component,
  icon,
  label,
  count,
  active: active2,
  className,
  ...rest
}) {
  const collapsed = useSideCollapsed();
  const Root = component ?? "button";
  return /* @__PURE__ */ jsx8(SideTip, { label: count !== void 0 ? `${label} \xB7 ${count}` : label, children: /* @__PURE__ */ jsxs6(
    Root,
    {
      type: Root === "button" ? "button" : void 0,
      className: cx("dd-nav-item", className),
      "data-active": active2 || void 0,
      "aria-current": active2 ? "page" : void 0,
      "aria-label": collapsed ? label : void 0,
      title: collapsed ? void 0 : label,
      ...rest,
      children: [
        icon,
        /* @__PURE__ */ jsx8("span", { className: "dd-nav-text", children: label }),
        count !== void 0 && /* @__PURE__ */ jsx8(Count, { children: count })
      ]
    }
  ) });
}
function PillTabs({
  tabs,
  value,
  onChange,
  leading
}) {
  return /* @__PURE__ */ jsxs6("div", { className: "dd-tabs", role: "tablist", children: [
    leading,
    tabs.map((tab) => /* @__PURE__ */ jsxs6(
      "button",
      {
        type: "button",
        role: "tab",
        className: "dd-tab",
        "aria-selected": tab.value === value,
        "data-active": tab.value === value || void 0,
        onClick: () => onChange(tab.value),
        children: [
          tab.icon,
          tab.label,
          tab.count !== void 0 && /* @__PURE__ */ jsx8(Count, { children: tab.count })
        ]
      },
      tab.value
    ))
  ] });
}
function Status({ tone, children }) {
  return /* @__PURE__ */ jsx8("span", { className: "dd-status", "data-tone": tone, children });
}
function Stat({
  label,
  value,
  hint,
  active: active2
}) {
  return /* @__PURE__ */ jsxs6("div", { className: "dd-stat", "data-active": active2 || void 0, children: [
    /* @__PURE__ */ jsx8("span", { className: "dd-muted", style: { fontSize: 13 }, children: label }),
    /* @__PURE__ */ jsx8("span", { className: "dd-stat-value", children: value }),
    hint && /* @__PURE__ */ jsx8("span", { className: "dd-muted", style: { fontSize: 12 }, children: hint })
  ] });
}
function Steps({ steps }) {
  return /* @__PURE__ */ jsx8("ol", { className: "dd-steps", style: { margin: 0, listStyle: "none" }, children: steps.map((step) => /* @__PURE__ */ jsxs6(
    "li",
    {
      className: "dd-step",
      "data-state": step.state,
      "aria-current": step.state === "current" ? "step" : void 0,
      children: [
        /* @__PURE__ */ jsx8("span", { className: "dd-step-dot", children: step.state === "done" && /* @__PURE__ */ jsx8(Check, { size: 12, weight: "bold" }) }),
        /* @__PURE__ */ jsx8("strong", { style: { fontWeight: 500 }, children: step.label }),
        /* @__PURE__ */ jsx8("span", { className: "dd-mono dd-faint", children: step.when })
      ]
    },
    step.label
  )) });
}
function Dots({ value, total = 10 }) {
  const on = Math.round(value * total);
  return /* @__PURE__ */ jsx8(
    "span",
    {
      className: "dd-dots",
      role: "meter",
      "aria-valuenow": Math.round(value * 100),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: Array.from({ length: total }, (_, i) => /* @__PURE__ */ jsx8("span", { "data-off": i >= on || void 0 }, i))
    }
  );
}
function LogoShape({
  shape,
  url,
  ratio,
  height
}) {
  return /* @__PURE__ */ jsx8(
    "span",
    {
      "aria-hidden": true,
      className: "dd-logo",
      "data-shape": shape,
      style: {
        width: Math.round(height * ratio),
        height,
        // Com aspas: o SVG pode chegar como data URI, que sem elas quebra o `url()`.
        maskImage: `url("${url}")`,
        WebkitMaskImage: `url("${url}")`
      }
    }
  );
}
function useAccentInk() {
  const theme = useMantineTheme2();
  const accent = theme.colors[theme.primaryColor]?.[6];
  return !accent || isLightColor(accent, theme.luminanceThreshold) ? "dark" : "light";
}
function Logo({
  variant,
  height = 28,
  on,
  color,
  label,
  app
}) {
  const brand = useBrand();
  const provided = useLockupApp();
  const accentInk = useAccentInk();
  const given = app ?? provided;
  const lockupApp = brand === DECKDOO_BRAND && given ? typeof given === "string" ? { name: given } : given : null;
  const v = variant ?? (lockupApp ? "compact" : "type");
  const shapes = (form) => {
    const { light, dark: dark2 = light } = brand[form];
    return [
      /* @__PURE__ */ jsx8(LogoShape, { shape: "light", height, ...light }, "light"),
      /* @__PURE__ */ jsx8(LogoShape, { shape: "dark", height, ...dark2 }, "dark")
    ];
  };
  if (v !== "type" && v !== "mark") {
    if (lockupApp) {
      return /* @__PURE__ */ jsx8(
        LockupView,
        {
          version: v,
          height,
          app: lockupApp,
          label: label ?? `${brand.name} ${lockupApp.name}`,
          color,
          mark: /* @__PURE__ */ jsx8("span", { className: "dd-logo-switch", "data-on": on, "data-accent-ink": accentInk, "aria-hidden": true, children: shapes("mark") })
        }
      );
    }
  }
  return /* @__PURE__ */ jsx8(
    "span",
    {
      role: "img",
      "aria-label": label ?? brand.name,
      className: "dd-logo-switch",
      "data-on": on,
      "data-accent-ink": accentInk,
      style: { color },
      children: shapes(v === "mark" ? "mark" : "type")
    }
  );
}
function AppIcon({ size = 40 }) {
  const ink2 = useAccentInk();
  return /* @__PURE__ */ jsx8("span", { className: "dd-app-icon", style: { width: size, height: size, borderRadius: size * 0.28 }, children: /* @__PURE__ */ jsx8(
    Logo,
    {
      variant: "mark",
      on: ink2 === "dark" ? "light" : "dark",
      height: Math.round(size * 0.56),
      color: "var(--dd-on-accent)"
    }
  ) });
}
function DuDoo({
  size = 32,
  mood = "neutro"
}) {
  const ex = typeof mood === "string" ? DUDOO_MOODS[mood] : mood;
  return /* @__PURE__ */ jsx8("span", { className: "dd-dudoo", role: "img", "aria-label": "DuDoo", style: { width: size, height: size }, children: /* @__PURE__ */ jsx8(
    DuDooFace,
    {
      size: Math.round(size * 0.56),
      mood: ex.lean ? { ...ex, lean: 0 } : ex,
      color: "var(--dd-dudoo-ink)",
      pupil: "#0e172a",
      line: "transparent",
      sclera: "var(--dd-dudoo-white)",
      title: ""
    }
  ) });
}
function DuDooWall({ className, style, ...rest }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      className: cx("dd-wall", className),
      style: {
        ...style,
        ["--dd-wall-light"]: `url("${dudoo_tile_default}")`,
        ["--dd-wall-dark"]: `url("${dudoo_tile_inverse_default}")`
      },
      ...rest
    }
  );
}
function ChatBubble({
  from,
  avatar = true,
  mood,
  children
}) {
  const mine = from === "you";
  return /* @__PURE__ */ jsxs6("div", { className: "dd-chat-row", "data-mine": mine || void 0, children: [
    !mine && (avatar ? /* @__PURE__ */ jsx8(DuDoo, { size: 28, mood }) : /* @__PURE__ */ jsx8("span", { className: "dd-chat-gap" })),
    /* @__PURE__ */ jsx8("div", { className: "dd-bubble", "data-mine": mine || void 0, children })
  ] });
}

// src/motion.ts
import { useEffect as useEffect4, useRef as useRef3, useState as useState4 } from "react";
var DUDOO_INTENSITY = {
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
  piscada: "festa"
};
var easeOut = (t) => 1 - (1 - t) ** 3;
var easeInOut = (t) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
var easeIn = (t) => t ** 2;
var spring = (t) => t >= 1 ? 1 : 1 - Math.exp(-4.2 * t) * Math.cos(Math.PI * 3 * t);
var DUDOO_TIMING = {
  trabalho: { ms: 240, ease: easeOut, pop: 0 },
  neutro: { ms: 340, ease: easeInOut, pop: 0 },
  festa: { ms: 560, ease: spring, pop: 0.1 }
};
var DUDOO_REDUCED_TIMING = {
  ms: 120,
  ease: easeOut,
  pop: 0
};
var WINK = {
  close: { ...DUDOO_TIMING.festa, ms: 170 },
  hold: 0,
  open: { ...DUDOO_TIMING.trabalho, ms: 150 }
};
var LOOK_LEAD = 0.55;
var SHUT = { top: 0.45, bottom: 0.45, tilt: 0 };
var BLINK = { top: 0.64, bottom: 0.26 };
var lerp = (a, b, t) => a + (b - a) * t;
var lerp2 = (a, b, t) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t)
];
var clamp01 = (t) => Math.max(0, Math.min(1, t));
var rand = (min, max) => min + Math.random() * (max - min);
var resolve2 = (m) => typeof m === "string" ? DUDOO_MOODS[m] : m;
function toFrame(e) {
  const eye = (d) => ({ ...d, look: d.look ?? e.look });
  return { pupil: e.pupil, lean: e.lean, left: eye(e.left), right: eye(e.right) };
}
function toExpression(f) {
  return { look: f.left.look, pupil: f.pupil, lean: f.lean, left: f.left, right: f.right };
}
var closed = (e) => e.arc !== void 0;
function mixOpen(a, b, t, tl) {
  return {
    size: lerp(a.size, b.size, t),
    top: lerp(a.top, b.top, t),
    tilt: lerp(a.tilt, b.tilt, t),
    bottom: lerp(a.bottom, b.bottom, t),
    look: lerp2(a.look, b.look, tl)
  };
}
function mixEye(a, b, u, ease) {
  const t = ease(u);
  const tl = ease(clamp01(u / LOOK_LEAD));
  if (closed(a) === closed(b)) {
    const eye = mixOpen(a, b, t, tl);
    return closed(a) ? { ...eye, arc: lerp(a.arc, b.arc, t) } : eye;
  }
  const mid = lerp(a.size, b.size, 0.5);
  const first = u < 0.5;
  const k = first ? easeIn(u / 0.5) : (closed(a) ? easeOut : ease)((u - 0.5) / 0.5);
  if (!closed(a)) {
    if (first) return { ...mixOpen(a, { ...a, ...SHUT, size: mid }, k, k), look: a.look };
    return { ...b, size: lerp(mid, b.size, k), arc: b.arc * k };
  }
  if (first) return { ...a, size: lerp(a.size, mid, k), arc: a.arc * (1 - k) };
  return mixOpen({ ...b, ...SHUT, size: mid }, b, k, k);
}
function mixFrame(a, b, u, ease, pop2 = 0) {
  const t = ease(u);
  const grow = pop2 * Math.sin(Math.PI * clamp01(u / 0.6));
  const eye = (e) => grow ? { ...e, size: e.size + grow } : e;
  return {
    pupil: lerp(a.pupil, b.pupil, t),
    lean: lerp(a.lean, b.lean, t),
    left: eye(mixEye(a.left, b.left, u, ease)),
    right: eye(mixEye(a.right, b.right, u, ease))
  };
}
var IDLE = {
  // Monta a ideia: a pupila salta de um ponto a outro, sempre para cima.
  pensando: {
    away: () => [rand(-0.85, 0.9), rand(-0.9, -0.35)],
    hold: [500, 1300]
  },
  // De vez em quando, uma olhada de lado, e volta.
  neutro: {
    away: ([x, y]) => [x + rand(0.25, 0.5) * (Math.random() < 0.5 ? -1 : 1), y + rand(-0.2, 0.15)],
    hold: [700, 1300],
    home: [4e3, 8e3]
  },
  // Entediado: o olhar escorrega pelo chão.
  esperando: {
    away: ([x, y]) => [x + rand(-0.6, 0.6), y],
    hold: [1400, 2400],
    home: [3e3, 6e3]
  },
  // Revisando: lê, linha a linha, da esquerda para a direita.
  focado: {
    away: ([, y]) => [rand(-0.5, 0.5), y + rand(-0.1, 0.15)],
    hold: [350, 700],
    home: [1200, 2400]
  },
  // Aponta com o olhar: fica no alvo, reajustando de leve, como quem confere.
  olhando: {
    away: ([x, y]) => [x + rand(-0.12, 0.08), y + rand(-0.15, 0.15)],
    hold: [700, 1500]
  },
  // A pergunta: olha para você, esperando a resposta, e volta para o assunto.
  curioso: {
    away: () => [rand(-0.12, 0.12), rand(-0.05, 0.12)],
    hold: [900, 1500],
    home: [1600, 2800]
  },
  // A segunda olhada: volta para você um instante e torna a olhar de lado.
  "de-canto": {
    away: () => [rand(-0.05, 0.15), rand(-0.05, 0.1)],
    hold: [350, 550],
    home: [2200, 4e3]
  },
  // Não para quieto.
  empolgado: {
    away: () => [rand(-0.45, 0.45), rand(-0.35, 0.3)],
    hold: [250, 650]
  },
  // Procura o sentido: o olhar vaga, sem achar onde parar.
  confuso: {
    away: ([x, y]) => [x + rand(-0.3, 0.3), y + rand(-0.3, 0.3)],
    hold: [500, 1100]
  },
  // Depois da piscada, o olho reabre e ele fica como no neutro.
  piscada: {
    away: ([x, y]) => [x + rand(0.25, 0.5) * (Math.random() < 0.5 ? -1 : 1), y + rand(-0.2, 0.15)],
    hold: [700, 1300],
    home: [3e3, 6e3]
  }
};
var BREATH_MS = 3600;
var CHUCKLE_MS = 380;
var CHUCKLE_EVERY = [1800, 3600];
var WINK_OPEN = dudooExpression({ look: DUDOO_MOODS.piscada.look });
var SACCADE_MS = 110;
var BLINK_MS = { close: 70, hold: 30, open: 110 };
var BLINK_EVERY = [2600, 6500];
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState4(
    () => typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false)
  );
  useEffect4(() => {
    const q = typeof window !== "undefined" ? window.matchMedia?.("(prefers-reduced-motion: reduce)") : void 0;
    if (!q) return;
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}
var DuDooMotion = class {
  clock = 0;
  from;
  to;
  name;
  start = -Infinity;
  ms = 1;
  ease = easeOut;
  pop = 0;
  last;
  /** A piscadinha já reabriu o olho. */
  winked = false;
  chuckleAt = -Infinity;
  nextChuckle = 0;
  // O olhar solto: de onde, para onde, quando saiu e quando sai de novo.
  look = {
    from: [0, 0],
    to: [0, 0],
    at: 0,
    next: 0
  };
  away = false;
  blinkAt = -Infinity;
  nextBlink = rand(...BLINK_EVERY);
  double = false;
  constructor(mood) {
    this.from = this.to = this.last = toFrame(resolve2(mood));
    this.name = typeof mood === "string" ? mood : void 0;
  }
  /** Mood novo: a troca parte de onde ele está agora, não do mood anterior. */
  set(mood, intensity) {
    const name = typeof mood === "string" ? mood : void 0;
    this.name = name;
    this.winked = false;
    const timing = name === "piscada" ? WINK.close : DUDOO_TIMING[intensity ?? (name ? DUDOO_INTENSITY[name] : "trabalho")];
    this.tween(resolve2(mood), timing);
    this.nextChuckle = this.clock + this.ms + rand(...CHUCKLE_EVERY);
  }
  /** Movimento reduzido: as próximas trocas saem curtas e sem mola. */
  reduced = false;
  /** A troca em si: de onde ele está agora até `target`, sem mudar o nome do mood. */
  tween(target, chosen) {
    const timing = this.reduced ? DUDOO_REDUCED_TIMING : chosen;
    this.from = this.last;
    this.to = toFrame(target);
    this.start = this.clock;
    const crossing = ["left", "right"].some(
      (side) => closed(this.from[side]) !== closed(this.to[side])
    );
    this.ms = timing.ms * (crossing ? 1.35 : 1);
    this.ease = timing.ease;
    this.pop = timing.pop;
    const home = this.to.left.look;
    const cfg = this.name ? IDLE[this.name] : void 0;
    const wait = cfg ? rand(...cfg.home ?? cfg.hold) : 0;
    this.look = { from: home, to: home, at: 0, next: this.clock + this.ms + wait };
    this.away = false;
  }
  /**
   * Avança `dt` ms e devolve o quadro. `gesture` deixa a piscadinha reabrir; sem ele (a fala
   * antiga do chat), ela fica fechada, como o desenho.
   */
  advance(dt, {
    blink = true,
    idle = true,
    gesture
  } = {}) {
    gesture ??= idle;
    this.clock += dt;
    const c = this.clock;
    if (gesture && this.name === "piscada" && !this.winked && c - this.start >= this.ms + WINK.hold) {
      this.winked = true;
      this.tween(WINK_OPEN, WINK.open);
    }
    const u = clamp01((c - this.start) / this.ms);
    let f = u < 1 ? mixFrame(this.from, this.to, u, this.ease, this.pop) : this.to;
    const settled = u >= 1;
    const cfg = this.name ? IDLE[this.name] : void 0;
    if (idle && settled && cfg) {
      const home = this.to.left.look;
      if (c >= this.look.next) {
        const goAway = !cfg.home || !this.away;
        this.look = {
          from: this.saccade(c),
          to: goAway ? cfg.away(home) : home,
          at: c,
          next: c + rand(...goAway || !cfg.home ? cfg.hold : cfg.home)
        };
        this.away = goAway;
      }
      const look = this.saccade(c);
      const [dx, dy] = [look[0] - home[0], look[1] - home[1]];
      const shift = (e) => ({ ...e, look: [e.look[0] + dx, e.look[1] + dy] });
      f = { ...f, left: shift(f.left), right: shift(f.right) };
    }
    if (idle && settled && this.name === "dormindo") {
      const k = 1 + 0.18 * Math.sin(c / BREATH_MS * Math.PI * 2);
      const breathe = (e) => closed(e) ? { ...e, arc: e.arc * k } : e;
      f = { ...f, left: breathe(f.left), right: breathe(f.right) };
    }
    if (idle && settled && this.name === "feliz") {
      if (c >= this.nextChuckle) {
        this.chuckleAt = c;
        this.nextChuckle = c + rand(...CHUCKLE_EVERY);
      }
      const p = (c - this.chuckleAt) / CHUCKLE_MS;
      if (p < 1) {
        const k = 1 + 0.28 * Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p * 0.5);
        const laugh = (e) => closed(e) ? { ...e, arc: e.arc * k } : e;
        f = { ...f, left: laugh(f.left), right: laugh(f.right) };
      }
    }
    this.last = f;
    const open = !closed(f.left) && !closed(f.right);
    if (blink && settled && open && c >= this.nextBlink) {
      this.blinkAt = c;
      this.double = Math.random() < 0.2;
      this.nextBlink = c + rand(...BLINK_EVERY);
    }
    const b = blinkAmount(c - this.blinkAt) || (this.double ? blinkAmount(c - this.blinkAt - 260) : 0);
    if (b > 0 && open) {
      const shut = (e) => ({
        ...e,
        top: lerp(e.top, Math.max(e.top, BLINK.top), b),
        bottom: lerp(e.bottom, BLINK.bottom, b),
        tilt: lerp(e.tilt, 0, b)
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
  saccade(c) {
    return lerp2(this.look.from, this.look.to, easeOut(clamp01((c - this.look.at) / SACCADE_MS)));
  }
};
function useDuDooMotion(mood, { blink = true, idle = true, reduced, speed = 1, intensity } = {}) {
  const systemReduced = usePrefersReducedMotion();
  const less = reduced ?? systemReduced;
  const [shown, setShown] = useState4(() => resolve2(mood));
  const [motion] = useState4(() => new DuDooMotion(mood));
  motion.reduced = less;
  const wander = idle && !less;
  const opts = useRef3({ blink, idle: wander, gesture: idle, speed });
  opts.current = { blink, idle: wander, gesture: idle, speed };
  const key = typeof mood === "string" ? mood : JSON.stringify(mood);
  useEffect4(() => {
    motion.set(mood, intensity);
  }, [key]);
  const wanderOnce = useRef3(wander);
  useEffect4(() => {
    if (wanderOnce.current === wander) return;
    wanderOnce.current = wander;
    if (!wander) motion.set(mood, intensity);
  }, [wander]);
  useEffect4(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now2) => {
      const o = opts.current;
      const f = motion.advance(Math.min(now2 - prev, 64) * o.speed, o);
      prev = now2;
      setShown((p) => same(p, f) ? p : f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motion]);
  return shown;
}
function blinkAmount(t) {
  const { close, hold, open } = BLINK_MS;
  if (t < 0 || t > close + hold + open) return 0;
  if (t < close) return easeIn(t / close);
  if (t < close + hold) return 1;
  return 1 - easeOut((t - close - hold) / open);
}
function same(a, b) {
  const eq = (x, y) => Math.abs(x - y) < 1e-4;
  const eye = (e, g) => {
    const [el, gl] = [e.look ?? a.look, g.look ?? b.look];
    return eq(e.size, g.size) && eq(e.top, g.top) && eq(e.tilt, g.tilt) && eq(e.bottom, g.bottom) && e.arc === g.arc && eq(el[0], gl[0]) && eq(el[1], gl[1]);
  };
  return eq(a.pupil, b.pupil) && eq(a.lean, b.lean) && eye(a.left, b.left) && eye(a.right, b.right);
}

// src/draw.tsx
import {
  createContext as createContext4,
  useContext as useContext4,
  useEffect as useEffect5,
  useLayoutEffect,
  useMemo,
  useRef as useRef4,
  useState as useState5
} from "react";

// src/scenes.tsx
import {
  createContext as createContext3,
  useContext as useContext3
} from "react";

// src/sketch.ts
function random(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var n = (v) => Math.round(v * 10) / 10;
var pt = ([x, y]) => `${n(x)},${n(y)}`;
function smooth(points, closed2 = false) {
  const len = points.length;
  const at = (i) => closed2 ? points[(i + len) % len] : points[Math.max(0, Math.min(len - 1, i))];
  let d = `M${pt(points[0])}`;
  const segments = closed2 ? len : len - 1;
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return closed2 ? `${d}Z` : d;
}
function sketch(seed) {
  const r = random(seed);
  const jitter = (a) => (r() * 2 - 1) * a;
  const nudge = ([x, y], a) => [x + jitter(a), y + jitter(a)];
  const bow = (a, b, amount = 0.035) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const k = len * amount * (0.4 + r() * 0.6) * (r() < 0.5 ? -1 : 1);
    const mid = [
      (a[0] + b[0]) / 2 + -(b[1] - a[1]) / len * k,
      (a[1] + b[1]) / 2 + (b[0] - a[0]) / len * k
    ];
    return `Q${pt(mid)} ${pt(b)}`;
  };
  const line = (a, b, amount) => {
    const s = nudge(a, 0.6);
    return `M${pt(s)}${bow(s, nudge(b, 0.6), amount)}`;
  };
  const lines = (...segments) => segments.map(([a, b]) => line(a, b)).join("");
  return {
    line,
    /** Várias linhas soltas. */
    lines,
    /** Três traços de ênfase saindo de um ponto, a partir do ângulo `from` (em graus). */
    ticks(cx3, cy, from, r2 = 8, len = 7, spread = 28) {
      return lines(
        ...[-1, 0, 1].map((i) => {
          const a = (from + i * spread) * Math.PI / 180;
          return [
            [cx3 + Math.cos(a) * r2, cy + Math.sin(a) * r2],
            [cx3 + Math.cos(a) * (r2 + len), cy + Math.sin(a) * (r2 + len)]
          ];
        })
      );
    },
    /** Linha quebrada (seta, visto, aba de caixa): cada trecho arqueado, cantos vivos. */
    poly(points) {
      const ps = points.map((p) => nudge(p, 0.6));
      return `M${pt(ps[0])}${ps.slice(1).map((p, i) => bow(ps[i], p)).join("")}`;
    },
    /** Retângulo de canto mole, que passa do começo antes de terminar. */
    rect(x, y, w, h, rad = 7) {
      const c = [
        nudge([x + w, y], 0.8),
        nudge([x + w, y + h], 0.8),
        nudge([x, y + h], 0.8),
        nudge([x, y], 0.8)
      ];
      const [tr, br, bl, tl] = c;
      const start = [x + rad + 4 + jitter(2), y + jitter(1)];
      let d = `M${pt(start)}`;
      d += bow(start, [tr[0] - rad, tr[1]]) + `Q${pt(tr)} ${pt([tr[0], tr[1] + rad])}`;
      d += bow([tr[0], tr[1] + rad], [br[0], br[1] - rad]) + `Q${pt(br)} ${pt([br[0] - rad, br[1]])}`;
      d += bow([br[0] - rad, br[1]], [bl[0] + rad, bl[1]]) + `Q${pt(bl)} ${pt([bl[0], bl[1] - rad])}`;
      d += bow([bl[0], bl[1] - rad], [tl[0], tl[1] + rad]) + `Q${pt(tl)} ${pt([tl[0] + rad, tl[1]])}`;
      const tail = [start[0] + 6 + r() * 8, start[1] + 1.2 + r()];
      return d + bow([tl[0] + rad, tl[1]], tail, 0.02);
    },
    /** Círculo que dá uma volta e um pouco, fechando por dentro. */
    circle(cx3, cy, rad) {
      const a0 = r() * Math.PI * 2;
      const steps = 11;
      const sweep = Math.PI * 2 + 0.55;
      const points = Array.from({ length: steps + 1 }, (_, i) => {
        const a = a0 + sweep * i / steps;
        const rr2 = rad * (1 + jitter(0.03)) * (i === steps ? 0.93 : 1);
        return [cx3 + Math.cos(a) * rr2, cy + Math.sin(a) * rr2];
      });
      return smooth(points);
    },
    /** Mancha de cor: um retângulo recortado à mão, de borda mole. */
    blob(x, y, w, h, rad = 8) {
      const i = rad * 0.45;
      const points = [
        [x + i, y + i],
        [x + w / 2, y],
        [x + w - i, y + i],
        [x + w, y + h / 2],
        [x + w - i, y + h - i],
        [x + w / 2, y + h],
        [x + i, y + h - i],
        [x, y + h / 2]
      ].map((p) => nudge(p, 1.4));
      return smooth(points, true);
    }
  };
}
function sparkle(cx3, cy, r) {
  const k = r * 0.14;
  return `M${cx3},${cy - r}Q${cx3 + k},${cy - k} ${cx3 + r},${cy}Q${cx3 + k},${cy + k} ${cx3},${cy + r}Q${cx3 - k},${cy + k} ${cx3 - r},${cy}Q${cx3 - k},${cy - k} ${cx3},${cy - r}Z`;
}
function curl(x, y, n2, scale = 1) {
  const s = scale;
  let d = `M${x},${y}`;
  for (let i = 0; i < n2; i++) {
    d += `c${8 * s},0 ${14 * s},${-6 * s} ${12 * s},${-11 * s}c${-2 * s},${-5 * s} ${-9 * s},${-4 * s} ${-9 * s},${2 * s}c0,${6 * s} ${6 * s},${9 * s} ${13 * s},${9 * s}`;
  }
  return d;
}

// src/scenes.tsx
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var cx2 = (...names) => names.filter(Boolean).join(" ");
var INK = "var(--dd-ink)";
var ACCENT = "var(--dd-accent)";
var SCENE_STROKE = 2.4;
function Scene({
  label,
  w = 260,
  h = 190,
  seed = 1,
  children
}) {
  return /* @__PURE__ */ jsx9(
    "svg",
    {
      viewBox: `0 0 ${w} ${h}`,
      width: "100%",
      role: "img",
      "aria-label": label,
      style: { display: "block", overflow: "visible" },
      children: children(sketch(seed))
    }
  );
}
function SceneLine({
  d,
  width = SCENE_STROKE,
  color = INK
}) {
  return /* @__PURE__ */ jsx9(
    "path",
    {
      d,
      fill: "none",
      stroke: color,
      strokeWidth: width,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  );
}
function SceneCard({
  s,
  x,
  y,
  w,
  h,
  rot = 0,
  children
}) {
  return /* @__PURE__ */ jsxs7("g", { transform: rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : void 0, children: [
    /* @__PURE__ */ jsx9("rect", { x: x + 1, y: y + 1, width: w - 2, height: h - 2, rx: 7, fill: "var(--dd-surface)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(x, y, w, h) }),
    children
  ] });
}
var SceneDuDooFace = createContext3(null);
function SceneDuDoo({
  x,
  y,
  size,
  mood = "neutro"
}) {
  const Face = useContext3(SceneDuDooFace);
  return /* @__PURE__ */ jsx9("g", { transform: `translate(${x} ${y})`, children: Face ? /* @__PURE__ */ jsx9(Face, { size, mood }) : /* @__PURE__ */ jsx9(DuDooFace, { size, mood, title: "" }) });
}
var SIZE = {
  arquivo: [82, 104],
  post: [84, 100],
  calendario: [104, 88],
  funil: [112, 84],
  persona: [88, 100]
};
var sizeOf = (kind) => SIZE[kind] ?? [112, 78];
function blobBox(kind, x, y, w, h) {
  if (kind === "funil") return [x + 12, y + 8, w - 8, h * 0.6];
  if (kind === "carrossel") return [x + 10, y + 12, w, h * 0.72];
  return [x + 10, y + 9, w, h];
}
var LOOKING_UP = dudooExpression({ look: [0.9, -0.55], pupil: 0.8, both: { size: 1.1 } });
function Doing({ work, children }) {
  return work.loop ? /* @__PURE__ */ jsx9("g", { "data-dd-draw": "loop", children }) : /* @__PURE__ */ jsx9(Fragment2, { children });
}
function heart(cx3, cy, r) {
  return `M${cx3},${cy + r}C${cx3 - r * 1.9},${cy - r * 0.1} ${cx3 - r * 0.9},${cy - r * 1.6} ${cx3},${cy - r * 0.45}C${cx3 + r * 0.9},${cy - r * 1.6} ${cx3 + r * 1.9},${cy - r * 0.1} ${cx3 + r * 0.25},${cy + r * 1.1}`;
}
function filePaper(s, x, y, w, h) {
  const k = 16;
  const outline = [
    [x, y],
    [x + w - k, y],
    [x + w, y + k],
    [x + w, y + h],
    [x, y + h],
    [x, y - 1]
  ];
  return /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9("path", { d: `M${outline.map((p) => p.join(",")).join("L")}Z`, fill: "var(--dd-surface)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.poly(outline) }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [x + w - k, y],
          [x + w - k, y + k],
          [x + w, y + k]
        ])
      }
    )
  ] });
}
function folderPaper(s, x, y, w, h) {
  const tab = [
    [x, y + 12],
    [x, y],
    [x + w * 0.36, y],
    [x + w * 0.44, y + 12]
  ];
  return /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9(
      "path",
      {
        d: `M${x},${y}h${w * 0.36}l${w * 0.08},12h${w * 0.56}v${h - 12}h${-w}Z`,
        fill: "var(--dd-surface)"
      }
    ),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.poly(tab) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(x, y + 12, w, h - 12, 6) })
  ] });
}
function bubblePaper(s, x, y, w, h) {
  return /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9("rect", { x: x + 1, y: y + 1, width: w - 2, height: h - 14, rx: 7, fill: "var(--dd-surface)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(x, y, w, h - 14, 10) }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [x + 22, y + h - 14],
          [x + 18, y + h],
          [x + 38, y + h - 14]
        ])
      }
    )
  ] });
}
function SiteArt({ s, x, y, w, h, work }) {
  const bar = y + 16;
  const img = { x: x + w - 42, y: bar + 11, w: 28, h: h - 38 };
  const page = /* @__PURE__ */ jsxs7(Fragment2, { children: [
    work && /* @__PURE__ */ jsx9("path", { d: s.blob(img.x + 3, img.y + 3, img.w - 6, img.h - 6, 5), fill: work.color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(img.x, img.y, img.w, img.h, 5), width: 2 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 14, bar + 17], [x + w * 0.56, bar + 17]), width: 3 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 14, bar + 28], [x + w * 0.46, bar + 28]), width: 2 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(x + 14, bar + 38, 30, 12, 6), width: 2 })
  ] });
  return /* @__PURE__ */ jsxs7(SceneCard, { s, x, y, w, h, children: [
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x, bar], [x + w, bar]), width: 2 }),
    [0, 1, 2].map((i) => /* @__PURE__ */ jsx9("circle", { cx: x + 11 + i * 8, cy: y + 8.5, r: 2.2, fill: INK }, i)),
    work ? /* @__PURE__ */ jsx9(Doing, { work, children: page }) : page
  ] });
}
function PostArt({ s, x, y, w, h, work }) {
  const f = { x: x + 8, y: y + 8, w: w - 16, h: h * 0.54 };
  const base = f.y + f.h;
  const [like, caption] = [y + h * 0.75, y + h * 0.87];
  const post = /* @__PURE__ */ jsxs7(Fragment2, { children: [
    work && /* @__PURE__ */ jsx9("path", { d: s.blob(f.x + 3, f.y + 3, f.w - 6, f.h - 6, 5), fill: work.color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(f.x, f.y, f.w, f.h, 5), width: 2 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(f.x + f.w - 13, f.y + 13, 5), width: 2 }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [f.x + 4, base - 5],
          [f.x + f.w * 0.32, f.y + f.h * 0.45],
          [f.x + f.w * 0.54, f.y + f.h * 0.72],
          [f.x + f.w * 0.7, f.y + f.h * 0.56],
          [f.x + f.w - 4, base - 6]
        ]),
        width: 2
      }
    ),
    /* @__PURE__ */ jsx9(SceneLine, { d: heart(x + 15, like, 4.5), width: 2 }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [x + 27, like],
            [x + w - 12, like]
          ],
          [
            [x + 11, caption],
            [x + w - 28, caption]
          ]
        ),
        width: 2
      }
    )
  ] });
  return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: work ? /* @__PURE__ */ jsx9(Doing, { work, children: post }) : post });
}
function CarouselArt({ s, x, y, w, h, work }) {
  const side = Math.round(h * 0.6);
  const c = Math.round(h * 0.8);
  const fx = x + (w - c) / 2;
  const dots = y + h - 4;
  const mid = x + w / 2;
  const front = /* @__PURE__ */ jsxs7(Fragment2, { children: [
    work && /* @__PURE__ */ jsx9("path", { d: s.blob(fx + 7, y + 9, c - 20, 14, 4), fill: work.color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([fx + 10, y + 16], [fx + c - 16, y + 16]), width: 3 }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [fx + 10, y + 31],
            [fx + c - 10, y + 31]
          ],
          [
            [fx + 10, y + 42],
            [fx + c - 24, y + 42]
          ]
        ),
        width: 2
      }
    )
  ] });
  const next = /* @__PURE__ */ jsx9(SceneLine, { d: `${s.circle(mid, dots, 2.4)}${s.circle(mid + 9, dots, 2.4)}`, width: 1.8 });
  return /* @__PURE__ */ jsxs7("g", { children: [
    /* @__PURE__ */ jsx9(SceneCard, { s, x, y: y + (c - side) / 2, w: side, h: side, rot: -5 }),
    /* @__PURE__ */ jsx9(SceneCard, { s, x: x + w - side, y: y + (c - side) / 2, w: side, h: side, rot: 5 }),
    /* @__PURE__ */ jsx9(SceneCard, { s, x: fx, y, w: c, h: c, children: work ? /* @__PURE__ */ jsx9(Doing, { work, children: front }) : front }),
    /* @__PURE__ */ jsx9("circle", { cx: mid - 9, cy: dots, r: 2.6, fill: INK }),
    work ? /* @__PURE__ */ jsx9(Doing, { work, children: next }) : next
  ] });
}
function CalendarArt({ s, x, y, w, h, work }) {
  const top = y + 22;
  const cw = w / 4;
  const ch = (h - 22) / 3;
  const days = [
    [0, 0],
    [2, 0],
    [1, 1],
    [3, 1],
    [2, 2]
  ];
  return /* @__PURE__ */ jsxs7(SceneCard, { s, x, y, w, h, children: [
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [x + 24, y - 7],
            [x + 24, y + 9]
          ],
          [
            [x + w - 24, y - 7],
            [x + w - 24, y + 9]
          ]
        ),
        width: 3
      }
    ),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x, top], [x + w, top]), width: 2 }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [x + 4, top + ch],
            [x + w - 4, top + ch]
          ],
          [
            [x + 4, top + 2 * ch],
            [x + w - 4, top + 2 * ch]
          ],
          ...[1, 2, 3].map((i) => [
            [x + i * cw, top + 4],
            [x + i * cw, y + h - 4]
          ])
        ),
        width: 2
      }
    ),
    work && /* @__PURE__ */ jsxs7(Doing, { work, children: [
      days.map(([c, r]) => /* @__PURE__ */ jsx9(
        "path",
        {
          d: s.blob(x + c * cw + 4, top + r * ch + 4, cw - 8, ch - 8, 4),
          fill: work.color
        },
        `${c}${r}`
      )),
      /* @__PURE__ */ jsx9(
        SceneLine,
        {
          d: s.lines(
            ...days.map(([c, r]) => [
              [x + c * cw + 7, top + r * ch + ch / 2],
              [x + c * cw + cw - 8, top + r * ch + ch / 2]
            ])
          ),
          width: 2
        }
      )
    ] })
  ] });
}
function FunnelArt({ s, x, y, w, h, work }) {
  const neck = w * 0.12;
  const mid = x + w / 2;
  const cone = y + h * 0.62;
  const outline = [
    [x, y],
    [x + w, y],
    [mid + neck, cone],
    [mid + neck, y + h],
    [mid - neck, y + h],
    [mid - neck, cone],
    [x, y - 1]
  ];
  const band = (f) => {
    const half = w / 2 - f * (w / 2 - neck);
    const by = y + f * (cone - y);
    return [
      [mid - half + 4, by],
      [mid + half - 4, by]
    ];
  };
  return /* @__PURE__ */ jsxs7("g", { children: [
    /* @__PURE__ */ jsx9("path", { d: `M${outline.map((p) => p.join(",")).join("L")}Z`, fill: "var(--dd-surface)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.poly(outline) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.lines(band(0.34), band(0.68)), width: 2 }),
    work && /* @__PURE__ */ jsxs7(Doing, { work, children: [
      /* @__PURE__ */ jsx9(
        "path",
        {
          d: s.blob(x + w * 0.17, y + 5, w * 0.66, (cone - y) * 0.34 - 9, 5),
          fill: work.color
        }
      ),
      /* @__PURE__ */ jsx9(
        SceneLine,
        {
          d: `${s.circle(mid - 24, y - 13, 4)}${s.circle(mid + 2, y - 21, 4)}${s.circle(mid + 26, y - 11, 4)}`,
          width: 2
        }
      ),
      /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(mid, y + h + 10, 4), width: 2 })
    ] })
  ] });
}
function PersonaArt({ s, x, y, w, h, work }) {
  const mid = x + w / 2;
  const head = y + 27;
  const base = y + 60;
  const persona = /* @__PURE__ */ jsxs7(Fragment2, { children: [
    work && /* @__PURE__ */ jsx9("path", { d: s.blob(mid - 17, y + 11, 34, 34, 10), fill: work.color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(mid, head, 11) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: `M${mid - 20},${base}c0-12 8-18 20-18s20 6 20 18` }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 14, y + h - 26], [x + w - 28, y + h - 26]), width: 3 }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [x + 14, y + h - 14],
            [x + w - 14, y + h - 14]
          ],
          [
            [x + 14, y + h - 7],
            [x + w - 34, y + h - 7]
          ]
        ),
        width: 2
      }
    )
  ] });
  return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: work ? /* @__PURE__ */ jsx9(Doing, { work, children: persona }) : persona });
}
function VoiceArt({ s, x, y, h, work }) {
  const cy = y + h / 2;
  const outline = [
    [x + 6, cy - 10],
    [x + 24, cy - 10],
    [x + 44, cy - 26],
    [x + 44, cy + 26],
    [x + 24, cy + 10],
    [x + 6, cy + 10],
    [x + 6, cy - 11]
  ];
  const outer = /* @__PURE__ */ jsxs7(Fragment2, { children: [
    work && /* @__PURE__ */ jsx9("path", { d: s.blob(x + 54, cy - 28, 38, 56, 8), fill: work.color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: `M${x + 68},${cy - 21}q16,21 0,42` }),
    /* @__PURE__ */ jsx9(SceneLine, { d: `M${x + 80},${cy - 31}q22,31 0,62` })
  ] });
  return /* @__PURE__ */ jsxs7("g", { children: [
    /* @__PURE__ */ jsx9("path", { d: `M${outline.map((p) => p.join(",")).join("L")}Z`, fill: "var(--dd-surface)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.poly(outline) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 24, cy - 10], [x + 24, cy + 10]), width: 2 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: `M${x + 56},${cy - 11}q9,11 0,22` }),
    work ? /* @__PURE__ */ jsx9(Doing, { work, children: outer }) : outer
  ] });
}
function ClassicWork({ s, kind, x, y, w, h, work }) {
  const mark = (x1, ly, len) => /* @__PURE__ */ jsx9("path", { d: s.blob(x1 - 4, ly - 6, len + 8, 12, 4), fill: work.color });
  switch (kind) {
    case "slide":
      return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: /* @__PURE__ */ jsxs7(Doing, { work, children: [
        /* @__PURE__ */ jsx9("path", { d: s.blob(x + 16, y + h - 34, w * 0.34, 15, 4), fill: work.color }),
        /* @__PURE__ */ jsx9(
          SceneLine,
          {
            d: s.lines(
              [
                [x + 14, y + 18],
                [x + w * 0.5, y + 18]
              ],
              [
                [x + 14, y + 30],
                [x + w * 0.66, y + 30]
              ],
              [
                [x + 14, y + h - 26],
                [x + w - 16, y + h - 26]
              ]
            ),
            width: 2
          }
        )
      ] }) });
    case "arquivo":
      return /* @__PURE__ */ jsxs7("g", { children: [
        filePaper(s, x, y, w, h),
        /* @__PURE__ */ jsxs7(Doing, { work, children: [
          mark(x + 14, y + 34, w - 36),
          /* @__PURE__ */ jsx9(
            SceneLine,
            {
              d: s.lines(
                [
                  [x + 14, y + 34],
                  [x + w - 22, y + 34]
                ],
                [
                  [x + 14, y + 46],
                  [x + w - 14, y + 46]
                ],
                [
                  [x + 14, y + 58],
                  [x + w - 34, y + 58]
                ]
              ),
              width: 2
            }
          )
        ] })
      ] });
    case "pasta":
      return /* @__PURE__ */ jsxs7("g", { children: [
        folderPaper(s, x, y, w, h),
        /* @__PURE__ */ jsxs7(Doing, { work, children: [
          /* @__PURE__ */ jsx9("path", { d: s.blob(x + w * 0.3, y + h * 0.42, w * 0.4, 20, 5), fill: work.color }),
          /* @__PURE__ */ jsx9(
            SceneLine,
            {
              d: s.line([x + w * 0.36, y + h * 0.42 + 10], [x + w * 0.62, y + h * 0.42 + 10]),
              width: 2
            }
          )
        ] })
      ] });
    case "lista":
      return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: /* @__PURE__ */ jsxs7(Doing, { work, children: [
        mark(x + 32, y + 18, w - 50),
        [0, 1, 2].map((i) => {
          const ry = y + 18 + i * ((h - 30) / 2);
          return /* @__PURE__ */ jsxs7("g", { children: [
            /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(x + 18, ry, 5), width: 2 }),
            /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 32, ry], [x + w - 18 - i % 2 * 22, ry]), width: 2 })
          ] }, i);
        })
      ] }) });
    case "grafico": {
      const bars = [0.45, 0.7, 0.3, 0.85].map((v, i) => {
        const bx = x + 22 + i * ((w - 44) / 3);
        return [
          [bx, y + h - 14],
          [bx, y + h - 14 - v * (h - 30)]
        ];
      });
      return /* @__PURE__ */ jsxs7(SceneCard, { s, x, y, w, h, children: [
        /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 12, y + h - 14], [x + w - 12, y + h - 14]), width: 2 }),
        /* @__PURE__ */ jsxs7(Doing, { work, children: [
          /* @__PURE__ */ jsx9(SceneLine, { d: s.lines(...bars.slice(0, 3)), width: 6 }),
          /* @__PURE__ */ jsx9(SceneLine, { d: s.line(...bars[3]), width: 6, color: work.color })
        ] })
      ] });
    }
    case "mensagem":
      return /* @__PURE__ */ jsxs7("g", { children: [
        bubblePaper(s, x, y, w, h),
        /* @__PURE__ */ jsxs7(Doing, { work, children: [
          mark(x + 16, y + 22, w - 38),
          /* @__PURE__ */ jsx9(
            SceneLine,
            {
              d: s.lines(
                [
                  [x + 16, y + 22],
                  [x + w - 22, y + 22]
                ],
                [
                  [x + 16, y + 36],
                  [x + w - 40, y + 36]
                ]
              ),
              width: 2
            }
          )
        ] })
      ] });
    default:
      return null;
  }
}
function ObjectArt(props) {
  const { s, kind, x, y, w, h, work } = props;
  switch (kind) {
    case "site":
      return /* @__PURE__ */ jsx9(SiteArt, { ...props });
    case "post":
      return /* @__PURE__ */ jsx9(PostArt, { ...props });
    case "carrossel":
      return /* @__PURE__ */ jsx9(CarouselArt, { ...props });
    case "calendario":
      return /* @__PURE__ */ jsx9(CalendarArt, { ...props });
    case "funil":
      return /* @__PURE__ */ jsx9(FunnelArt, { ...props });
    case "persona":
      return /* @__PURE__ */ jsx9(PersonaArt, { ...props });
    case "voz":
      return /* @__PURE__ */ jsx9(VoiceArt, { ...props });
  }
  if (work) return /* @__PURE__ */ jsx9(ClassicWork, { ...props, work });
  switch (kind) {
    case "slide":
      return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: /* @__PURE__ */ jsx9(
        SceneLine,
        {
          d: s.lines(
            [
              [x + w / 2, y + h / 2 - 11],
              [x + w / 2, y + h / 2 + 11]
            ],
            [
              [x + w / 2 - 11, y + h / 2],
              [x + w / 2 + 11, y + h / 2]
            ]
          ),
          width: 3
        }
      ) });
    case "arquivo":
      return /* @__PURE__ */ jsxs7("g", { children: [
        filePaper(s, x, y, w, h),
        /* @__PURE__ */ jsx9(
          SceneLine,
          {
            d: s.lines(
              [
                [x + 14, y + 34],
                [x + w - 22, y + 34]
              ],
              [
                [x + 14, y + 46],
                [x + w - 14, y + 46]
              ],
              [
                [x + 14, y + 58],
                [x + w - 34, y + 58]
              ]
            ),
            width: 2
          }
        )
      ] });
    case "pasta":
      return /* @__PURE__ */ jsx9("g", { children: folderPaper(s, x, y, w, h) });
    case "lista":
      return /* @__PURE__ */ jsx9(SceneCard, { s, x, y, w, h, children: [0, 1, 2].map((i) => {
        const ry = y + 18 + i * ((h - 30) / 2);
        return /* @__PURE__ */ jsxs7("g", { children: [
          /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(x + 18, ry, 5), width: 2 }),
          /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 32, ry], [x + w - 18 - i % 2 * 22, ry]), width: 2 })
        ] }, i);
      }) });
    case "grafico":
      return /* @__PURE__ */ jsxs7(SceneCard, { s, x, y, w, h, children: [
        /* @__PURE__ */ jsx9(
          SceneLine,
          {
            d: s.lines(
              ...[0.45, 0.7, 0.3, 0.85].map((v, i) => {
                const bx = x + 22 + i * ((w - 44) / 3);
                return [
                  [bx, y + h - 14],
                  [bx, y + h - 14 - v * (h - 30)]
                ];
              })
            ),
            width: 6
          }
        ),
        /* @__PURE__ */ jsx9(SceneLine, { d: s.line([x + 12, y + h - 14], [x + w - 12, y + h - 14]), width: 2 })
      ] });
    case "mensagem":
      return /* @__PURE__ */ jsxs7("g", { children: [
        bubblePaper(s, x, y, w, h),
        /* @__PURE__ */ jsx9(
          SceneLine,
          {
            d: s.lines(
              [
                [x + 16, y + 22],
                [x + w - 22, y + 22]
              ],
              [
                [x + 16, y + 36],
                [x + w - 40, y + 36]
              ]
            ),
            width: 2
          }
        )
      ] });
  }
}
function SceneEmpty({
  object = "slide",
  dudoo = false,
  color = ACCENT,
  label
}) {
  const [w, h] = sizeOf(object);
  const [ocx, ocy] = dudoo ? [170, 72] : [130, 84];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const rot = dudoo ? -6 : -4;
  return /* @__PURE__ */ jsx9(Scene, { seed: 11, label: label ?? "Nada aqui ainda", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9(
      "path",
      {
        d: s.blob(...blobBox(object, x, y, w, h)),
        fill: color,
        transform: `rotate(-3 ${ocx} ${ocy})`
      }
    ),
    /* @__PURE__ */ jsx9("g", { transform: `rotate(${rot} ${ocx} ${ocy})`, children: /* @__PURE__ */ jsx9(ObjectArt, { s, kind: object, x, y, w, h }) }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(x + w + 14, y - 8, 9), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(x - 12, y - 4, 6), fill: dudoo ? INK : color }),
    dudoo ? /* @__PURE__ */ jsxs7(Fragment2, { children: [
      /* @__PURE__ */ jsx9(SceneLine, { d: curl(150, 150, 3, 1) }),
      /* @__PURE__ */ jsx9("g", { "data-dd-draw": "dudoo", children: /* @__PURE__ */ jsx9(SceneLine, { d: s.ticks(36, 80, -110, 4, 9, 30) }) }),
      /* @__PURE__ */ jsx9(SceneDuDoo, { x: 22, y: 88, size: 82, mood: LOOKING_UP })
    ] }) : /* @__PURE__ */ jsxs7(Fragment2, { children: [
      /* @__PURE__ */ jsx9(SceneLine, { d: curl(x - 46, y + h + 18, 2, 0.9) }),
      /* @__PURE__ */ jsx9(SceneLine, { d: s.ticks(x + w + 6, y + h + 4, 20, 6, 8, 30) })
    ] })
  ] }) });
}
var WORK_LABEL = {
  slide: { making: "os slides se montam", done: "os slides prontos" },
  arquivo: { making: "o texto se escreve", done: "o texto pronto" },
  pasta: { making: "a pasta se organiza", done: "a pasta organizada" },
  lista: { making: "a lista se organiza", done: "a lista pronta" },
  grafico: { making: "o relat\xF3rio se monta", done: "o relat\xF3rio pronto" },
  mensagem: { making: "a resposta se escreve", done: "a resposta pronta" },
  site: { making: "o site se monta", done: "o site pronto" },
  post: { making: "os posts se montam", done: "os posts prontos" },
  carrossel: { making: "o carrossel se monta", done: "o carrossel pronto" },
  calendario: { making: "o planejamento se monta", done: "o planejamento pronto" },
  funil: { making: "o funil se organiza", done: "o funil organizado" },
  persona: { making: "a persona se desenha", done: "a persona pronta" },
  voz: { making: "a voz se afina", done: "a voz escolhida" }
};
var STACK = {
  arquivo: 2,
  post: 2,
  persona: 1,
  site: 1,
  lista: 1,
  grafico: 1
};
var THOUGHT = `M84,70c6-26,18-36,32-30${curl(116, 40, 1, 1).replace(/^M[^c]+/, "")}`;
function SceneGenerating({
  object = "slide",
  color = ACCENT,
  label
}) {
  if (object !== "slide") return /* @__PURE__ */ jsx9(GeneratingObject, { object, color, label });
  return /* @__PURE__ */ jsx9(Scene, { seed: 23, label: label ?? "O DuDoo pensando enquanto os slides se montam", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9(SceneCard, { s, x: 150, y: 24, w: 80, h: 56, rot: 10 }),
    /* @__PURE__ */ jsx9(SceneCard, { s, x: 138, y: 38, w: 80, h: 56, rot: 2 }),
    /* @__PURE__ */ jsx9(SceneCard, { s, x: 126, y: 54, w: 80, h: 56, rot: -7, children: /* @__PURE__ */ jsxs7("g", { "data-dd-draw": "loop", children: [
      /* @__PURE__ */ jsx9("path", { d: s.blob(140, 88, 34, 12, 4), fill: color }),
      /* @__PURE__ */ jsx9(
        SceneLine,
        {
          d: s.lines(
            [
              [138, 70],
              [172, 70]
            ],
            [
              [138, 79],
              [186, 79]
            ],
            [
              [138, 94],
              [194, 94]
            ]
          ),
          width: 2
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: THOUGHT }),
    /* @__PURE__ */ jsx9(SceneDuDoo, { x: 22, y: 78, size: 92, mood: "pensando" })
  ] }) });
}
function GeneratingObject({
  object,
  color,
  label
}) {
  const [w, h] = sizeOf(object);
  const [ocx, ocy] = [180, 84 + (h - 78) / 2];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const stack = STACK[object] ?? 0;
  return /* @__PURE__ */ jsx9(Scene, { seed: 23, label: label ?? `O DuDoo pensando enquanto ${WORK_LABEL[object].making}`, children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    Array.from({ length: stack }, (_, i) => stack - i).map((k) => /* @__PURE__ */ jsx9(SceneCard, { s, x: x + 12 * k, y: y - 12 * k, w, h, rot: -6 + 8 * k }, k)),
    /* @__PURE__ */ jsx9("g", { transform: `rotate(-6 ${ocx} ${ocy})`, children: /* @__PURE__ */ jsx9(ObjectArt, { s, kind: object, x, y, w, h, work: { color, loop: true } }) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: THOUGHT }),
    /* @__PURE__ */ jsx9(SceneDuDoo, { x: 22, y: 78, size: 92, mood: "pensando" })
  ] }) });
}
function SceneDone({
  object,
  color = ACCENT,
  label
}) {
  if (object) return /* @__PURE__ */ jsx9(DoneObject, { object, color, label });
  return /* @__PURE__ */ jsx9(Scene, { seed: 37, label: label ?? "O DuDoo piscando ao lado do trabalho pronto", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9("path", { d: s.blob(148, 54, 84, 64), fill: color, transform: "rotate(8 188 84)" }),
    /* @__PURE__ */ jsx9(SceneCard, { s, x: 138, y: 44, w: 84, h: 64, rot: 4, children: /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [164, 77],
          [174, 87],
          [194, 65]
        ]),
        width: 3.2
      }
    ) }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [118, 30],
            [124, 22]
          ],
          [
            [132, 22],
            [134, 12]
          ],
          [
            [146, 30],
            [154, 24]
          ]
        )
      }
    ),
    /* @__PURE__ */ jsx9("path", { d: sparkle(232, 30, 10), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(120, 132, 6), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(244, 128, 6), fill: color }),
    /* @__PURE__ */ jsx9(SceneDuDoo, { x: 30, y: 60, size: 98, mood: { ...DUDOO_MOODS.piscada, lean: -8 } })
  ] }) });
}
function DoneObject({
  object,
  color,
  label
}) {
  const [w, h] = sizeOf(object);
  const [ocx, ocy] = [180, 82];
  const x = ocx - w / 2;
  const y = ocy - h / 2;
  const [bx, by, br] = [x + w - 4, y + h - 2, 14];
  return /* @__PURE__ */ jsx9(Scene, { seed: 37, label: label ?? `O DuDoo piscando, com ${WORK_LABEL[object].done} ao lado`, children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9(
      "path",
      {
        d: s.blob(...blobBox(object, x, y, w, h)),
        fill: color,
        transform: `rotate(6 ${ocx} ${ocy})`
      }
    ),
    /* @__PURE__ */ jsxs7("g", { transform: `rotate(4 ${ocx} ${ocy})`, children: [
      /* @__PURE__ */ jsx9(ObjectArt, { s, kind: object, x, y, w, h, work: { color, loop: false } }),
      /* @__PURE__ */ jsx9("circle", { cx: bx, cy: by, r: br - 1, fill: "var(--dd-surface)" }),
      /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(bx, by, br) }),
      /* @__PURE__ */ jsx9(
        SceneLine,
        {
          d: s.poly([
            [bx - 6, by],
            [bx - 1.5, by + 4.5],
            [bx + 6.5, by - 5]
          ]),
          width: 3
        }
      )
    ] }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [x - 20, y - 12],
            [x - 14, y - 20]
          ],
          [
            [x - 6, y - 20],
            [x - 4, y - 30]
          ],
          [
            [x + 8, y - 12],
            [x + 16, y - 18]
          ]
        )
      }
    ),
    /* @__PURE__ */ jsx9("path", { d: sparkle(x + w + 4, y - 12, 10), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(120, 140, 6), fill: INK }),
    /* @__PURE__ */ jsx9(SceneDuDoo, { x: 30, y: 60, size: 98, mood: { ...DUDOO_MOODS.piscada, lean: -8 } })
  ] }) });
}
function SceneNoResults({ color = ACCENT, label }) {
  return /* @__PURE__ */ jsx9(Scene, { seed: 41, label: label ?? "Uma lupa sobre uma p\xE1gina vazia", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9(SceneCard, { s, x: 70, y: 30, w: 100, h: 124, rot: -4, children: /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [86, 54],
            [130, 54]
          ],
          [
            [86, 66],
            [152, 66]
          ],
          [
            [86, 78],
            [116, 78]
          ]
        ),
        width: 2
      }
    ) }),
    /* @__PURE__ */ jsx9("path", { d: s.blob(146, 80, 60, 60, 26), fill: color }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.circle(170, 104, 30) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([192, 126], [218, 152]), width: 6 }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.ticks(170, 104, -60, 38, 8, 26) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: curl(28, 150, 2, 0.9) })
  ] }) });
}
function SceneAllClear({ color = ACCENT, label }) {
  return /* @__PURE__ */ jsx9(Scene, { seed: 53, label: label ?? "Uma caixa aberta e vazia", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9("path", { d: s.blob(90, 120, 98, 40, 4), fill: color }),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [84, 96],
          [180, 96],
          [180, 154],
          [84, 154],
          [84, 94]
        ])
      }
    ),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [84, 96],
          [58, 74],
          [82, 66],
          [108, 88]
        ])
      }
    ),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.poly([
          [180, 96],
          [206, 74],
          [182, 66],
          [156, 88]
        ])
      }
    ),
    /* @__PURE__ */ jsx9(
      SceneLine,
      {
        d: s.lines(
          [
            [100, 140],
            [118, 140]
          ],
          [
            [150, 136],
            [164, 136]
          ],
          [
            [150, 142],
            [160, 142]
          ]
        ),
        width: 2
      }
    ),
    /* @__PURE__ */ jsx9(SceneLine, { d: curl(122, 74, 2, 1) }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(146, 34, 10), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(212, 48, 6), fill: INK }),
    /* @__PURE__ */ jsx9("path", { d: sparkle(52, 44, 5), fill: color })
  ] }) });
}
function SceneLocked({ label }) {
  return /* @__PURE__ */ jsx9(Scene, { seed: 67, label: label ?? "Um cadeado fechado", children: (s) => /* @__PURE__ */ jsxs7(Fragment2, { children: [
    /* @__PURE__ */ jsx9("path", { d: s.blob(105, 91, 60, 50, 9), fill: "var(--dd-sunken)" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: "M110,86v-16a20,20 0 0 1 40,0v16" }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.rect(100, 86, 60, 50, 9) }),
    /* @__PURE__ */ jsx9(SceneLine, { d: s.line([130, 104], [130, 116]), width: 3.2 })
  ] }) });
}
function EmptyState({
  art,
  title,
  action,
  className,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxs7("div", { className: cx2("dd-empty", className), ...rest, children: [
    art && /* @__PURE__ */ jsx9("div", { className: "dd-empty-art", children: art }),
    /* @__PURE__ */ jsx9("p", { className: "dd-empty-title", children: title }),
    children && /* @__PURE__ */ jsx9("div", { className: "dd-empty-text", children }),
    action && /* @__PURE__ */ jsx9("div", { className: "dd-empty-action", children: action })
  ] });
}

// src/draw.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var HAND = 0.55;
var STROKE_MS = { min: 170, max: 520 };
var PEN_LIFT = -50;
var HAND_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";
var INK_MS = { min: 600, max: 1600, slowest: 3 };
var BLOB = { ms: 380, from: [-9, -7], ease: "cubic-bezier(0.2, 0.7, 0.3, 1)" };
var POP = { ms: 420, stagger: 80, ease: "cubic-bezier(0.3, 1.7, 0.5, 1)" };
var DOT_LEAD = 180;
var DUDOO = {
  ms: 620,
  /** De onde vem: abaixo, à esquerda, inclinado para a direita. */
  from: { x: -12, y: 12, tilt: 14 },
  /** O alto do arco, e quanto passa do prumo ali. */
  over: { x: -2, y: -4, tilt: -3, at: 0.55 },
  /** Em que ponto da chegada a mão começa: ele quase no lugar, já olhando. */
  inkAt: 0.6
};
var DUDOO_REACT = 200;
var LOOP = {
  hold: 1100,
  fade: 320,
  gap: 260,
  /** O slide se montando sem pressa. */
  ink: 1e3
};
var svgNS = "http://www.w3.org/2000/svg";
function roleOf(el, root) {
  if (el instanceof SVGSVGElement && el !== root) return "dudoo";
  if (!(el instanceof SVGGeometryElement)) return void 0;
  const stroke2 = el.getAttribute("stroke");
  const fill = el.getAttribute("fill");
  if (stroke2 && stroke2 !== "none" && (!fill || fill === "none")) return "traco";
  if (!fill || fill === "none") return void 0;
  if (el instanceof SVGRectElement || fill.includes("--dd-surface")) return "fundo";
  if (el instanceof SVGCircleElement) return "ponto";
  return fillRatio(el) > 0.5 ? "mancha" : "brilho";
}
function fillRatio(el) {
  const box = el.getBBox();
  if (!box.width || !box.height) return 0;
  let inside = 0;
  const n2 = 6;
  for (let i = 0; i < n2; i++) {
    for (let j = 0; j < n2; j++) {
      const p = new DOMPoint(
        box.x + (i + 0.5) / n2 * box.width,
        box.y + (j + 0.5) / n2 * box.height
      );
      if (el.isPointInFill(p)) inside++;
    }
  }
  return inside / (n2 * n2);
}
function split(el, made) {
  const d = el.getAttribute("d");
  if (!d || /m/.test(d)) return [el];
  const parts = d.split(/(?=M)/).filter((part) => part.trim());
  if (parts.length < 2) return [el];
  const copies = parts.map((part) => {
    const copy = el.cloneNode();
    copy.setAttribute("d", part);
    return copy;
  });
  el.after(...copies);
  el.style.visibility = "hidden";
  made.push({ original: el, copies });
  return copies;
}
function pieces(root, made) {
  const out = [];
  const walk = (node, group) => {
    for (const child of Array.from(node.children)) {
      if (!(child instanceof SVGElement) || child.namespaceURI !== svgNS) continue;
      if (child instanceof SVGDefsElement || child.tagName === "clipPath" || child.tagName === "mask")
        continue;
      const role = roleOf(child, root);
      if (role === "traco") for (const el of split(child, made)) out.push({ el, role, group });
      else if (role) out.push({ el: child, role, group });
      else if (child instanceof SVGGElement) {
        const mark = child.getAttribute("data-dd-draw");
        walk(child, group ?? (mark === "loop" || mark === "dudoo" ? mark : void 0));
      }
    }
  };
  walk(root, void 0);
  return out;
}
var strokeMs = (el) => {
  const len = el.getTotalLength();
  return { len, ms: Math.max(STROKE_MS.min, Math.min(STROKE_MS.max, len / HAND)) };
};
function drawOn(root, { delay = 0, speed = 1 } = {}) {
  const all = [];
  const time = (ms) => ms / speed;
  const made = [];
  const list = pieces(root, made);
  const once = list.filter((p) => !p.group);
  const looping = list.filter((p) => p.group === "loop");
  const reaction = list.filter((p) => p.group === "dudoo");
  const loopInk = looping.filter((p) => p.role === "traco").reduce((sum, p) => sum + strokeMs(p.el).ms + PEN_LIFT, 0);
  const rawInk = once.reduce(
    (sum, p) => sum + (p.role === "traco" ? strokeMs(p.el).ms + PEN_LIFT : p.role === "ponto" ? DOT_LEAD : 0),
    0
  ) + loopInk;
  const pace = rawInk <= 0 ? 1 : rawInk < INK_MS.min ? Math.min(INK_MS.slowest, INK_MS.min / rawInk) : rawInk > INK_MS.max ? INK_MS.max / rawInk : 1;
  const loopPace = loopInk > 0 ? Math.max(pace, LOOP.ink / loopInk) : pace;
  const dudoos = once.filter((p) => p.role === "dudoo");
  const look = dudoos[0] ? lookAtDrawing(dudoos[0].el, list) : void 0;
  for (const { el } of dudoos) all.push(land(el, time(delay), time));
  const landed = delay + DUDOO.ms;
  const dudooAt = dudoos.length ? time(landed) : 0;
  let t = dudoos.length ? delay + DUDOO.ms * DUDOO.inkAt : delay;
  let pendingFundo = [];
  let loopAt;
  for (const { el, role, group } of list) {
    if (group === "dudoo") continue;
    if (group === "loop") {
      if (loopAt === void 0) {
        loopAt = t;
        t += loopInk * loopPace;
      }
      continue;
    }
    if (role === "fundo") {
      pendingFundo.push(el);
      continue;
    }
    if (role === "ponto") {
      all.push(pop(el, time(t), time));
      t += DOT_LEAD;
      continue;
    }
    if (role !== "traco") continue;
    const { len, ms: raw } = strokeMs(el);
    const ms = raw * pace;
    for (const f of pendingFundo) {
      all.push(
        f.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: time(ms),
          delay: time(t),
          easing: "cubic-bezier(0.6, 0, 0.9, 0.6)",
          fill: "backwards"
        })
      );
    }
    pendingFundo = [];
    all.push(stroke(el, len, time(t), time(ms)));
    t += ms + PEN_LIFT * pace;
  }
  const inked = t - PEN_LIFT * pace;
  const blobAt = Math.max(delay, inked - 140);
  let settled = inked;
  for (const { el, role } of once) {
    if (role !== "mancha") continue;
    all.push(blob(el, time(blobAt), time(BLOB.ms)));
    settled = Math.max(settled, blobAt + BLOB.ms);
  }
  let popAt = Math.max(delay, inked - 60);
  for (const { el, role } of once) {
    if (role !== "brilho") continue;
    all.push(pop(el, time(popAt), time));
    settled = Math.max(settled, popAt + POP.ms / 2);
    popAt += POP.stagger;
  }
  const reactRaw = (loopAt !== void 0 ? landed : Math.max(landed, settled)) + DUDOO_REACT;
  const reactAt = dudoos.length ? time(reactRaw) : 0;
  if (dudoos.length) {
    let r = reactRaw;
    for (const p of reaction) {
      if (p.role === "traco") {
        const { len, ms: raw } = strokeMs(p.el);
        all.push(stroke(p.el, len, time(r), time(raw * pace)));
        r += raw * pace + PEN_LIFT * pace;
      } else if (p.role === "brilho" || p.role === "ponto") {
        all.push(pop(p.el, time(r), time));
        r += POP.stagger;
      }
    }
  }
  if (loopAt !== void 0) all.push(...loopOn(looping, loopAt, loopPace, time));
  let stopped = false;
  const restore = () => {
    for (const { original, copies } of made) {
      copies.forEach((c) => c.remove());
      original.style.visibility = "";
    }
    made.length = 0;
  };
  const stop = () => {
    stopped = true;
    all.forEach((a) => a.cancel());
    restore();
  };
  const finite = all.filter((a) => a.effect?.getTiming().iterations !== Infinity);
  if (loopAt === void 0)
    Promise.all(finite.map((a) => a.finished)).then(() => !stopped && restore()).catch(() => {
    });
  return { animations: all, stop, dudooAt, reactAt, look };
}
function land(el, delay, time) {
  el.style.transformBox = "fill-box";
  el.style.transformOrigin = "50% 50%";
  const { from, over } = DUDOO;
  return el.animate(
    [
      {
        offset: 0,
        opacity: 0,
        translate: `${from.x}px ${from.y}px`,
        rotate: `${from.tilt}deg`,
        easing: "cubic-bezier(0.2, 0.6, 0.4, 1)"
      },
      { offset: 0.22, opacity: 1 },
      {
        offset: over.at,
        translate: `${over.x}px ${over.y}px`,
        rotate: `${over.tilt}deg`,
        easing: "cubic-bezier(0.45, 0, 0.4, 1)"
      },
      { offset: 1, opacity: 1, translate: "0 0", rotate: "0deg" }
    ],
    { duration: time(DUDOO.ms), delay, fill: "backwards" }
  );
}
function lookAtDrawing(dudoo, list) {
  const f = dudoo.getBoundingClientRect();
  if (!f.width || !f.height) return void 0;
  let box;
  for (const { el, role, group } of list) {
    if (group === "dudoo" || role === "dudoo" || role === "brilho" || role === "ponto") continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    box = box ? {
      l: Math.min(box.l, r.left),
      t: Math.min(box.t, r.top),
      r: Math.max(box.r, r.right),
      b: Math.max(box.b, r.bottom)
    } : { l: r.left, t: r.top, r: r.right, b: r.bottom };
  }
  if (!box) return void 0;
  const dx = (box.l + box.r) / 2 - (f.left + f.width / 2);
  const dy = (box.t + box.b) / 2 - (f.top + f.height * 0.35);
  const len = Math.hypot(dx, dy);
  if (!len) return void 0;
  const round = (n2) => Math.round(n2 * 100) / 100;
  return [round(dx / len), round(dy / len)];
}
function stroke(el, len, delay, duration) {
  const dash = `${len} ${len}`;
  return el.animate(
    [
      { strokeDasharray: dash, strokeDashoffset: len },
      { strokeDasharray: dash, strokeDashoffset: 0 }
    ],
    { duration, delay, easing: HAND_EASE, fill: "backwards" }
  );
}
function pop(el, delay, time) {
  el.style.transformBox = "fill-box";
  el.style.transformOrigin = "center";
  return el.animate(
    [
      { opacity: 0, scale: "0", rotate: "-40deg" },
      { opacity: 1, scale: "1", rotate: "0deg" }
    ],
    { duration: time(POP.ms), delay, easing: POP.ease, fill: "backwards" }
  );
}
var SLIDE_FROM = `${BLOB.from[0]}px ${BLOB.from[1]}px`;
function blob(el, delay, duration) {
  return el.animate(
    [
      { opacity: 0, translate: SLIDE_FROM },
      { opacity: 1, translate: "0 0" }
    ],
    { duration, delay, easing: BLOB.ease, fill: "backwards" }
  );
}
function loopOn(looping, at, pace, time) {
  const strokes = looping.filter((p) => p.role === "traco").map((p) => ({ ...p, ...strokeMs(p.el) }));
  let t = 0;
  const drawn = strokes.map((s) => {
    const ms = s.ms * pace;
    const span = { start: t, end: t + ms };
    t += ms + PEN_LIFT * pace;
    return span;
  });
  const inked = t - PEN_LIFT * pace;
  const blobStart = Math.max(0, inked - 140);
  const fadeStart = Math.max(inked, blobStart + BLOB.ms) + LOOP.hold;
  const fadeEnd = fadeStart + LOOP.fade;
  const cycle = fadeEnd + LOOP.gap;
  const o = (ms) => ms / cycle;
  const timing = {
    duration: time(cycle),
    delay: time(at),
    iterations: Infinity,
    fill: "backwards"
  };
  const out = [];
  strokes.forEach((s, i) => {
    const { start, end } = drawn[i];
    const dash = `${s.len} ${s.len}`;
    out.push(
      s.el.animate(
        [
          { offset: 0, strokeDasharray: dash, strokeDashoffset: s.len, opacity: 1 },
          { offset: o(start), strokeDasharray: dash, strokeDashoffset: s.len, easing: HAND_EASE },
          { offset: o(end), strokeDasharray: dash, strokeDashoffset: 0 },
          { offset: o(fadeStart), strokeDasharray: dash, strokeDashoffset: 0, opacity: 1 },
          { offset: o(fadeEnd), strokeDasharray: dash, strokeDashoffset: 0, opacity: 0 },
          { offset: 1, strokeDasharray: dash, strokeDashoffset: s.len, opacity: 0 }
        ],
        timing
      )
    );
  });
  const from = SLIDE_FROM;
  for (const { el, role } of looping) {
    if (role !== "mancha") continue;
    out.push(
      el.animate(
        [
          { offset: 0, opacity: 0, translate: from },
          { offset: o(blobStart), opacity: 0, translate: from, easing: BLOB.ease },
          { offset: o(blobStart + BLOB.ms), opacity: 1, translate: "0 0" },
          { offset: o(fadeStart), opacity: 1, translate: "0 0" },
          { offset: o(fadeEnd), opacity: 0, translate: "0 0" },
          { offset: 1, opacity: 0, translate: from }
        ],
        timing
      )
    );
  }
  return out;
}
var DrawStage = createContext4(null);
function named(mood) {
  if (typeof mood === "string") return { mood, lean: 0 };
  const plain = JSON.stringify({ ...mood, lean: 0 });
  const name = Object.keys(DUDOO_MOODS).find(
    (k) => JSON.stringify({ ...DUDOO_MOODS[k], lean: 0 }) === plain
  );
  return name ? { mood: name, lean: mood.lean } : { mood, lean: 0 };
}
function SceneFace({ mood, size }) {
  const stage = useContext4(DrawStage);
  const reduced = usePrefersReducedMotion();
  const target = named(mood);
  const [reacted, setReacted] = useState5(true);
  useEffect5(() => {
    if (!stage || stage.still || !stage.run) return setReacted(true);
    setReacted(false);
    const id = window.setTimeout(() => setReacted(true), stage.reactAt);
    return () => window.clearTimeout(id);
  }, [stage?.run, stage?.still]);
  const watching = useMemo(
    () => stage?.look ? dudooExpression({ look: stage.look }) : "neutro",
    [stage?.look]
  );
  const e = useDuDooMotion(reacted ? target.mood : watching, { reduced: reduced || stage?.still });
  return /* @__PURE__ */ jsx10(DuDooFace, { size, mood: target.lean ? { ...e, lean: target.lean } : e, title: "" });
}
function DrawOn({
  replay = 0,
  still = false,
  speed = 1,
  delay = 0,
  children
}) {
  const ref = useRef4(null);
  const running = useRef4(() => {
  });
  const seen = useRef4(false);
  const [stage, setStage] = useState5({ run: 0, reactAt: 0, still });
  const play = () => {
    const svg = ref.current?.querySelector("svg");
    running.current();
    if (!svg || still) return;
    const { stop, reactAt, look } = drawOn(svg, { delay, speed });
    running.current = stop;
    setStage((s) => ({ run: s.run + 1, reactAt, look, still: false }));
  };
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (still) {
      running.current();
      el.style.visibility = "";
      setStage((s) => ({ ...s, still: true }));
      return;
    }
    if (!seen.current) {
      el.style.visibility = "hidden";
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          io.disconnect();
          seen.current = true;
          el.style.visibility = "";
          play();
        },
        { threshold: 0.5 }
      );
      io.observe(el);
      return () => io.disconnect();
    }
    play();
  }, [replay, still]);
  useEffect5(() => () => running.current(), []);
  return /* @__PURE__ */ jsx10(DrawStage.Provider, { value: stage, children: /* @__PURE__ */ jsx10(SceneDuDooFace.Provider, { value: SceneFace, children: /* @__PURE__ */ jsx10("div", { ref, children }) }) });
}

// src/rail.tsx
import {
  useEffect as useEffect6,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef5,
  useState as useState6
} from "react";
import { ActionIcon as ActionIcon4, Text, Tooltip as Tooltip4, UnstyledButton as UnstyledButton2 } from "@mantine/core";
import { X } from "@phosphor-icons/react";
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var DEFAULT_EVENT = "dd:abrir-gaveta";
var DRAWER_FLOAT_BELOW = 960;
function RailButton({ icon, label, active: active2 = false, className, ...rest }) {
  return /* @__PURE__ */ jsxs8(
    UnstyledButton2,
    {
      ...rest,
      className: className ? `dd-rail-item ${className}` : "dd-rail-item",
      "data-active": active2 || void 0,
      children: [
        /* @__PURE__ */ jsx11("span", { className: "dd-rail-icon", children: icon }),
        /* @__PURE__ */ jsx11("span", { className: "dd-rail-label", children: label })
      ]
    }
  );
}
function SideRail({
  items,
  open,
  onToggle,
  footer,
  label = "Gavetas",
  className
}) {
  return /* @__PURE__ */ jsxs8("nav", { className: className ? `dd-rail ${className}` : "dd-rail", "aria-label": label, children: [
    items.map((item) => {
      const button = /* @__PURE__ */ jsx11(
        RailButton,
        {
          icon: item.icon,
          label: item.label,
          active: open === item.key,
          "aria-pressed": open === item.key,
          "aria-disabled": item.off !== void 0 && open !== item.key,
          onClick: () => {
            if (item.off === void 0 || open === item.key) onToggle(item.key);
          }
        },
        item.key
      );
      return item.off === void 0 ? button : /* @__PURE__ */ jsx11(Tooltip4, { label: item.off, position: "left", withArrow: true, children: button }, item.key);
    }),
    footer ? /* @__PURE__ */ jsx11("div", { className: "dd-rail-foot", children: footer }) : null
  ] });
}
function SidePanel({
  title,
  width = 340,
  onClose,
  children,
  closeLabel = "Fechar",
  className,
  floating
}) {
  return /* @__PURE__ */ jsxs8(
    "aside",
    {
      className: className ? `dd-drawer ${className}` : "dd-drawer",
      style: { width },
      "data-floating": floating === void 0 ? void 0 : String(floating),
      "aria-label": title,
      children: [
        /* @__PURE__ */ jsxs8("header", { className: "dd-drawer-head", children: [
          /* @__PURE__ */ jsx11(Text, { fw: 600, size: "sm", children: title }),
          /* @__PURE__ */ jsx11(ActionIcon4, { variant: "subtle", color: "gray", "aria-label": closeLabel, onClick: onClose, children: /* @__PURE__ */ jsx11(X, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsx11("div", { className: "dd-drawer-body", children })
      ]
    }
  );
}
function useDrawerFloats(bench, below = DRAWER_FLOAT_BELOW) {
  const [floats, setFloats] = useState6(false);
  useLayoutEffect2(() => {
    if (bench === null) return;
    const measure2 = () => setFloats(bench.getBoundingClientRect().width < below);
    measure2();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure2);
    observer.observe(bench);
    return () => observer.disconnect();
  }, [bench, below]);
  return bench === null ? false : floats;
}
function requestPanel(key, event = DEFAULT_EVENT) {
  window.dispatchEvent(new CustomEvent(event, { detail: key }));
}
function usePanelRequests(open, event = DEFAULT_EVENT, keys) {
  const latest = useRef5(open);
  const allowed = useRef5(keys);
  useEffect6(() => {
    latest.current = open;
    allowed.current = keys;
  });
  useEffect6(() => {
    const onRequest = (e) => {
      const key = e.detail;
      if (typeof key !== "string") return;
      const list = allowed.current;
      if (list !== void 0 && !list.includes(key)) return;
      latest.current(key);
    };
    window.addEventListener(event, onRequest);
    return () => window.removeEventListener(event, onRequest);
  }, [event]);
}

// src/wait.tsx
import { useEffect as useEffect7, useRef as useRef6, useState as useState7 } from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
var WAIT_DELAY = 200;
var SAME_EPISODE = 120;
var active = 0;
var episodeStart = 0;
var episodeEnd = Number.NEGATIVE_INFINITY;
var now = () => typeof performance === "undefined" ? Date.now() : performance.now();
function useWait() {
  const [style] = useState7(() => {
    const t = now();
    if (active === 0 && t - episodeEnd > SAME_EPISODE) episodeStart = t;
    const left = WAIT_DELAY - (t - episodeStart);
    return left > 0 ? { animationDelay: `${Math.round(left)}ms` } : { animation: "none" };
  });
  useEffect7(() => {
    active++;
    return () => {
      active--;
      if (active === 0) episodeEnd = now();
    };
  }, []);
  return { className: "dd-wait", style };
}
function Skeleton({
  width,
  height = 14,
  radius,
  className,
  style
}) {
  return /* @__PURE__ */ jsx12(
    "span",
    {
      className: className ? `dd-skel ${className}` : "dd-skel",
      style: { width, height, borderRadius: radius, ...style },
      "aria-hidden": true
    }
  );
}
var SETTLE = 120;
var MIN_VISIBLE = 400;
var FINISH = 450;
function measure() {
  const main = document.querySelector(".dd-main");
  if (!main) return {};
  const { left, width } = main.getBoundingClientRect();
  return { left, width };
}
function TopProgress({ active: active2 }) {
  const [phase, setPhase] = useState7("off");
  const [box, setBox] = useState7();
  const [busy, setBusy] = useState7(active2);
  const fill = useRef6(null);
  const shownAt = useRef6(0);
  const live = useRef6(active2);
  useEffect7(() => {
    live.current = active2;
    if (active2) {
      setBusy(true);
      return;
    }
    const t = setTimeout(() => setBusy(false), SETTLE);
    return () => clearTimeout(t);
  }, [active2]);
  useEffect7(() => {
    if (phase === "start") {
      fill.current?.getBoundingClientRect();
      setPhase("run");
      return;
    }
    let t;
    if (phase === "off" && busy) {
      t = setTimeout(() => {
        if (!live.current) return;
        setBox(measure());
        shownAt.current = now();
        setPhase("start");
      }, WAIT_DELAY);
    } else if (phase === "run" && !busy) {
      t = setTimeout(() => setPhase("done"), Math.max(0, MIN_VISIBLE - (now() - shownAt.current)));
    } else if (phase === "done") {
      t = setTimeout(() => setPhase("off"), FINISH);
    }
    return () => clearTimeout(t);
  }, [busy, phase]);
  if (phase === "off") return null;
  return /* @__PURE__ */ jsx12("div", { className: `dd-progress is-${phase}`, style: box, "aria-hidden": "true", children: /* @__PURE__ */ jsx12("div", { ref: fill, className: "dd-progress-fill" }) });
}

// src/filter.tsx
import {
  forwardRef,
  useMemo as useMemo2,
  useState as useState8
} from "react";
import { Button as Button2, CloseButton, Popover as Popover2, TextInput as TextInput2, UnstyledButton as UnstyledButton3 } from "@mantine/core";
import { CaretDown as CaretDown2, Check as Check2, MagnifyingGlass } from "@phosphor-icons/react";
import { Fragment as Fragment3, jsx as jsx13, jsxs as jsxs9 } from "react/jsx-runtime";
function FilterBar({ children, end }) {
  return /* @__PURE__ */ jsxs9("div", { className: "dd-filterbar", children: [
    /* @__PURE__ */ jsx13("div", { className: "dd-filterbar-main", children }),
    end && /* @__PURE__ */ jsx13("div", { className: "dd-filterbar-end", children: end })
  ] });
}
var FilterChip = forwardRef(function FilterChip2({ label, value, onRemove, removeLabel = "Tirar o filtro", className, disabled, ...rest }, ref) {
  return /* @__PURE__ */ jsxs9(
    "span",
    {
      className: "dd-chip",
      "data-set": value !== void 0 || void 0,
      "data-disabled": disabled || void 0,
      children: [
        /* @__PURE__ */ jsxs9(
          UnstyledButton3,
          {
            ref,
            className: className ? `dd-chip-main ${className}` : "dd-chip-main",
            disabled,
            ...rest,
            children: [
              /* @__PURE__ */ jsx13("span", { className: "dd-chip-label", children: label }),
              value !== void 0 ? /* @__PURE__ */ jsx13("span", { className: "dd-chip-value", children: value }) : /* @__PURE__ */ jsx13(CaretDown2, { size: 12 })
            ]
          }
        ),
        value !== void 0 && onRemove && !disabled && /* @__PURE__ */ jsx13(
          CloseButton,
          {
            size: "xs",
            onClick: (event) => {
              event.stopPropagation();
              onRemove();
            },
            "aria-label": removeLabel
          }
        )
      ]
    }
  );
});
var FILTER_LABELS = {
  search: "Buscar",
  empty: "Nada encontrado",
  clear: "Limpar",
  remove: "Tirar o filtro",
  from: "De",
  to: "At\xE9",
  textInput: "Texto do filtro",
  chosen: (count) => `${count} escolhidos`,
  period: (value) => periodLabel(value)
};
var SEARCH_ABOVE = 8;
var ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
var pad = (n2) => String(n2).padStart(2, "0");
var iso = (year, month, day) => `${year}-${pad(month)}-${pad(day)}`;
var lastDay = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
function parse(value) {
  const match = value ? ISO.exec(value) : null;
  return match ? { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) } : null;
}
var MONTH = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});
function periodLabel(value) {
  const from = parse(value.from);
  const to = parse(value.to);
  const full = (p) => `${pad(p.d)}/${pad(p.m)}/${p.y}`;
  if (from && to) {
    if (from.y === to.y && from.m === to.m && from.d === 1 && to.d === lastDay(to.y, to.m)) {
      return MONTH.format(new Date(Date.UTC(from.y, from.m - 1, 1))).replace(" de ", " ");
    }
    if (from.y === to.y && from.m === 1 && from.d === 1 && to.m === 12 && to.d === 31)
      return String(from.y);
    const start = from.y === to.y ? `${pad(from.d)}/${pad(from.m)}` : full(from);
    return `${start} \u2013 ${full(to)}`;
  }
  if (from) return `desde ${full(from)}`;
  if (to) return `at\xE9 ${full(to)}`;
  return void 0;
}
var monthPeriod = (year, month) => ({
  from: iso(year, month, 1),
  to: iso(year, month, lastDay(year, month))
});
var yearPeriod = (year) => ({
  from: iso(year, 1, 1),
  to: iso(year, 12, 31)
});
function periodShortcuts(today = /* @__PURE__ */ new Date(), names = {
  thisMonth: "Este m\xEAs",
  lastMonth: "M\xEAs passado",
  thisYear: "Este ano"
}) {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  return [
    { label: names.thisMonth, value: monthPeriod(y, m) },
    { label: names.lastMonth, value: m === 1 ? monthPeriod(y - 1, 12) : monthPeriod(y, m - 1) },
    { label: names.thisYear, value: yearPeriod(y) }
  ];
}
var fold = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function OptionList({
  options,
  searchable,
  multi,
  selected,
  onPick,
  text
}) {
  const [query, setQuery] = useState8("");
  const groups = useMemo2(() => {
    const q = fold(query.trim());
    const shown = q ? options.filter((o) => fold(o.label).includes(q) || fold(o.group ?? "").includes(q)) : options;
    const byGroup = /* @__PURE__ */ new Map([["", []]]);
    for (const option of shown) {
      const key = option.group ?? "";
      byGroup.set(key, [...byGroup.get(key) ?? [], option]);
    }
    return [...byGroup].filter(([, list]) => list.length > 0);
  }, [options, query]);
  const renderOption = (option) => {
    const on = selected.includes(option.value);
    return /* @__PURE__ */ jsxs9(
      UnstyledButton3,
      {
        className: "dd-filter-menu-option",
        role: "option",
        "aria-selected": on,
        "data-selected": on || void 0,
        onClick: () => onPick(option.value),
        children: [
          multi && /* @__PURE__ */ jsx13("span", { className: "dd-filter-menu-box", "aria-hidden": true, children: on && /* @__PURE__ */ jsx13(Check2, { size: 10, weight: "bold" }) }),
          /* @__PURE__ */ jsx13("span", { className: "dd-filter-menu-text", children: option.label }),
          !multi && on && /* @__PURE__ */ jsx13(Check2, { size: 14, weight: "bold", className: "dd-filter-menu-check" })
        ]
      },
      option.value
    );
  };
  return /* @__PURE__ */ jsxs9(Fragment3, { children: [
    searchable && /* @__PURE__ */ jsx13(
      TextInput2,
      {
        size: "xs",
        className: "dd-filter-menu-search",
        placeholder: text.search,
        "aria-label": text.search,
        "data-autofocus": true,
        leftSection: /* @__PURE__ */ jsx13(MagnifyingGlass, { size: 14 }),
        value: query,
        onChange: (event) => setQuery(event.currentTarget.value)
      }
    ),
    /* @__PURE__ */ jsxs9("div", { className: "dd-filter-menu-list", role: "listbox", "aria-multiselectable": multi || void 0, children: [
      groups.map(
        ([group, list]) => group === "" ? list.map(renderOption) : /* @__PURE__ */ jsxs9("div", { role: "group", "aria-label": group, className: "dd-filter-menu-group", children: [
          /* @__PURE__ */ jsx13("div", { className: "dd-eyebrow dd-filter-menu-group-title", "aria-hidden": true, children: group }),
          list.map(renderOption)
        ] }, group)
      ),
      groups.length === 0 && /* @__PURE__ */ jsx13("div", { className: "dd-filter-menu-empty", children: text.empty })
    ] })
  ] });
}
function PeriodForm({
  value,
  shortcuts,
  onChange,
  text
}) {
  const set = (side) => (event) => onChange({ ...value, [side]: event.currentTarget.value || null });
  return /* @__PURE__ */ jsxs9("div", { className: "dd-filter-menu-period", children: [
    /* @__PURE__ */ jsxs9("div", { className: "dd-filter-menu-dates", children: [
      /* @__PURE__ */ jsx13(
        TextInput2,
        {
          size: "xs",
          type: "date",
          label: text.from,
          value: value.from ?? "",
          max: value.to ?? void 0,
          onChange: set("from")
        }
      ),
      /* @__PURE__ */ jsx13(
        TextInput2,
        {
          size: "xs",
          type: "date",
          label: text.to,
          value: value.to ?? "",
          min: value.from ?? void 0,
          onChange: set("to")
        }
      )
    ] }),
    shortcuts.length > 0 && /* @__PURE__ */ jsx13("div", { className: "dd-filter-menu-shortcuts", children: shortcuts.map((shortcut) => /* @__PURE__ */ jsx13(
      Button2,
      {
        size: "compact-xs",
        variant: "default",
        onClick: () => onChange(shortcut.value),
        children: shortcut.label
      },
      shortcut.label
    )) })
  ] });
}
function TextForm({
  value,
  placeholder,
  onApply,
  text
}) {
  const [draft, setDraft] = useState8(value);
  return /* @__PURE__ */ jsx13("div", { className: "dd-filter-menu-text-form", children: /* @__PURE__ */ jsx13(
    TextInput2,
    {
      size: "xs",
      "data-autofocus": true,
      "aria-label": text.textInput,
      placeholder,
      value: draft,
      onChange: (event) => setDraft(event.currentTarget.value),
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onApply(draft.trim());
        }
      }
    }
  ) });
}
function FilterMenu(props) {
  const [opened, setOpenedState] = useState8(false);
  const { onClose, disabled } = props;
  const text = { ...FILTER_LABELS, ...props.labels };
  const setOpened = (next) => {
    if (next && disabled) return;
    if (!next && opened) onClose?.();
    setOpenedState(next);
  };
  const close = () => setOpened(false);
  let value;
  let onRemove;
  let body;
  switch (props.kind) {
    case "single": {
      const { options, onChange } = props;
      value = props.value === null ? void 0 : options.find((o) => o.value === props.value)?.label ?? props.value;
      onRemove = () => onChange(null);
      body = /* @__PURE__ */ jsx13(
        OptionList,
        {
          options,
          searchable: props.searchable ?? options.length > SEARCH_ABOVE,
          multi: false,
          selected: props.value === null ? [] : [props.value],
          onPick: (picked) => {
            onChange(picked);
            close();
          },
          text
        }
      );
      break;
    }
    case "multi": {
      const { options, onChange } = props;
      const chosen = props.value;
      if (chosen.length === 1)
        value = options.find((o) => o.value === chosen[0])?.label ?? chosen[0];
      else if (chosen.length > 1) value = text.chosen(chosen.length);
      onRemove = () => onChange([]);
      body = /* @__PURE__ */ jsxs9(Fragment3, { children: [
        /* @__PURE__ */ jsx13(
          OptionList,
          {
            options,
            searchable: props.searchable ?? options.length > SEARCH_ABOVE,
            multi: true,
            selected: chosen,
            onPick: (picked) => onChange(
              chosen.includes(picked) ? chosen.filter((v) => v !== picked) : [...chosen, picked]
            ),
            text
          }
        ),
        chosen.length > 0 && /* @__PURE__ */ jsx13("div", { className: "dd-filter-menu-foot", children: /* @__PURE__ */ jsx13(Button2, { size: "compact-xs", variant: "subtle", color: "gray", onClick: () => onChange([]), children: text.clear }) })
      ] });
      break;
    }
    case "period": {
      const { onChange } = props;
      value = text.period(props.value);
      onRemove = () => onChange({ from: null, to: null });
      body = /* @__PURE__ */ jsx13(
        PeriodForm,
        {
          value: props.value,
          shortcuts: props.shortcuts ?? periodShortcuts(),
          onChange,
          text
        }
      );
      break;
    }
    case "text": {
      const { onChange } = props;
      value = props.value.trim() === "" ? void 0 : `\u201C${props.value}\u201D`;
      onRemove = () => onChange("");
      body = /* @__PURE__ */ jsx13(
        TextForm,
        {
          value: props.value,
          placeholder: props.placeholder,
          onApply: (applied) => {
            onChange(applied);
            close();
          },
          text
        }
      );
      break;
    }
  }
  return /* @__PURE__ */ jsxs9(
    Popover2,
    {
      opened: opened && !disabled,
      onChange: setOpened,
      position: "bottom-start",
      offset: 6,
      withinPortal: true,
      shadow: "md",
      trapFocus: true,
      returnFocus: true,
      children: [
        /* @__PURE__ */ jsx13(Popover2.Target, { children: /* @__PURE__ */ jsx13(
          FilterChip,
          {
            label: props.label,
            value,
            onRemove,
            removeLabel: text.remove,
            disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": opened,
            onClick: () => setOpened(!opened)
          }
        ) }),
        /* @__PURE__ */ jsx13(Popover2.Dropdown, { className: "dd-filter-menu", children: body })
      ]
    }
  );
}

// src/chat.tsx
import {
  createContext as createContext5,
  useContext as useContext5,
  useEffect as useEffect8,
  useRef as useRef7,
  useState as useState9
} from "react";
import { ActionIcon as ActionIcon5, Loader } from "@mantine/core";
import { Warning, X as X2 } from "@phosphor-icons/react";
import { jsx as jsx14, jsxs as jsxs10 } from "react/jsx-runtime";
var READING = dudooExpression({ look: [0.85, -0.6] });
var READ_MS = 700;
function replyMood(text, asks = false) {
  return asks || text.trimEnd().endsWith("?") ? "curioso" : "neutro";
}
function DuDooSays({
  mood = "neutro",
  from,
  live,
  children
}) {
  const [shown, setShown] = useState9(from ?? mood);
  useEffect8(() => setShown(mood), [mood]);
  const face = useDuDooMotion(shown, { blink: live, idle: live });
  return /* @__PURE__ */ jsx14(ChatBubble, { from: "dudoo", mood: face, children });
}
function YouSay({ children }) {
  return /* @__PURE__ */ jsx14(ChatBubble, { from: "you", children });
}
function Typing({ label = "O DuDoo est\xE1 escrevendo" }) {
  return /* @__PURE__ */ jsx14(Loader, { size: "xs", type: "dots", color: "var(--dd-ink-faint)", "aria-label": label });
}
function useReadThenThink() {
  const [reading, setReading] = useState9(true);
  useEffect8(() => {
    const id = window.setTimeout(() => setReading(false), READ_MS);
    return () => window.clearTimeout(id);
  }, []);
  return reading ? READING : "pensando";
}
function SystemNotice({
  onClose,
  closeLabel = "Fechar",
  children
}) {
  return /* @__PURE__ */ jsxs10("div", { className: "dd-chat-notice", role: "status", children: [
    /* @__PURE__ */ jsx14(Warning, { size: 14 }),
    /* @__PURE__ */ jsx14("span", { children }),
    onClose ? /* @__PURE__ */ jsx14(
      ActionIcon5,
      {
        size: "xs",
        variant: "subtle",
        c: "inherit",
        "aria-label": closeLabel,
        onClick: onClose,
        children: /* @__PURE__ */ jsx14(X2, { size: 12 })
      }
    ) : null
  ] });
}
var ChatMounted = createContext5(null);
function ChatEnterScope({ children }) {
  const mounted = useRef7(false);
  useEffect8(() => {
    mounted.current = true;
  }, []);
  return /* @__PURE__ */ jsx14(ChatMounted.Provider, { value: mounted, children });
}
function Enter({ still = false, children }) {
  const mounted = useContext5(ChatMounted);
  const [enter] = useState9(() => !still && mounted?.current === true);
  return /* @__PURE__ */ jsx14("div", { className: enter ? "dd-chat-enter" : void 0, children });
}

// src/access.tsx
import { Anchor as Anchor2, Box, Group, Stack, Text as Text2, Title } from "@mantine/core";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { jsx as jsx15, jsxs as jsxs11 } from "react/jsx-runtime";
function StatusScreen({
  brand,
  component,
  inShell = false,
  className,
  children
}) {
  const Root = component ?? (inShell ? "div" : "main");
  const mark = brand === void 0 ? inShell ? null : /* @__PURE__ */ jsx15(Logo, { height: 22 }) : brand;
  return /* @__PURE__ */ jsx15(
    Root,
    {
      className: className ? `dd-screen ${className}` : "dd-screen",
      "data-in-shell": inShell || void 0,
      children: /* @__PURE__ */ jsxs11("div", { className: "dd-screen-col", children: [
        mark,
        /* @__PURE__ */ jsx15(Panel, { children })
      ] })
    }
  );
}
var APP_LIST_LABELS = {
  title: "Seus apps",
  loading: "Carregando\u2026",
  error: "N\xE3o deu para carregar a lista de apps.",
  empty: "Nenhum outro app contratado."
};
function AppList({
  services,
  loading = false,
  error = false,
  currentSlug,
  labels
}) {
  const text = { ...APP_LIST_LABELS, ...labels };
  const others = services.filter((service) => service.slug !== currentSlug);
  return /* @__PURE__ */ jsx15(Block, { children: /* @__PURE__ */ jsxs11(Stack, { gap: "xs", children: [
    /* @__PURE__ */ jsx15(Text2, { size: "sm", fw: 600, children: text.title }),
    loading && /* @__PURE__ */ jsx15(Text2, { size: "sm", className: "dd-muted", children: text.loading }),
    !loading && error && /* @__PURE__ */ jsx15(Text2, { size: "sm", className: "dd-muted", children: text.error }),
    !loading && !error && others.length === 0 && /* @__PURE__ */ jsx15(Text2, { size: "sm", className: "dd-muted", children: text.empty }),
    !loading && !error && others.map((service) => /* @__PURE__ */ jsx15(Anchor2, { href: service.href, size: "sm", children: /* @__PURE__ */ jsxs11(Group, { gap: 6, wrap: "nowrap", children: [
      /* @__PURE__ */ jsx15("span", { children: service.name }),
      service.kind === "external" && /* @__PURE__ */ jsx15(ArrowSquareOut, { size: 14, "aria-hidden": true })
    ] }) }, service.slug))
  ] }) });
}
var ACCESS_DENIAL_TEXT = withShort({
  NOT_ENTITLED: {
    title: "Sua conta n\xE3o tem este app",
    body: "A contrata\xE7\xE3o deste app n\xE3o est\xE1 ativa para a sua empresa. Fale com a ag\xEAncia para liberar \u2014 enquanto isso, os apps que voc\xEA j\xE1 tem est\xE3o abaixo.",
    short: "A contrata\xE7\xE3o deste app n\xE3o est\xE1 ativa para a sua empresa. Fale com a ag\xEAncia para liberar."
  },
  TENANT_SUSPENDED: {
    title: "Conta suspensa",
    body: "O acesso da sua empresa est\xE1 suspenso. Fale com a ag\xEAncia para reativar."
  },
  NO_TENANT: {
    title: "Esta conta n\xE3o est\xE1 ligada a nenhuma empresa",
    body: "Voc\xEA entrou com uma conta sem v\xEDnculo. Saia e entre com a conta da sua empresa."
  },
  AMBIGUOUS_TENANT: {
    title: "Esta conta est\xE1 em mais de uma empresa",
    body: "N\xE3o d\xE1 para saber em nome de qual empresa abrir o app. Saia e entre com a conta certa, ou fale com a ag\xEAncia."
  },
  MALFORMED: {
    title: "Contrata\xE7\xE3o incompleta",
    body: "A contrata\xE7\xE3o deste app ainda n\xE3o foi configurada por inteiro. Fale com o suporte para concluir a libera\xE7\xE3o."
  },
  UNAVAILABLE: {
    title: "N\xE3o deu para confirmar o seu acesso",
    body: "O servi\xE7o de contas n\xE3o respondeu agora. Tente de novo em instantes."
  },
  UNKNOWN: {
    title: "N\xE3o deu para abrir o app",
    body: "Algo deu errado ao confirmar o seu acesso. Tente de novo; se continuar, saia e entre de novo."
  }
});
function withShort(texts) {
  const out = {};
  for (const code of Object.keys(texts)) {
    const text = texts[code];
    out[code] = { ...text, short: text.short ?? text.body };
  }
  return out;
}
var NO_LOCK = ["UNAVAILABLE", "UNKNOWN"];
function AccessDenied({
  code,
  signedInAs,
  services,
  actions,
  title,
  body,
  detail,
  labels
}) {
  const text = {
    signedInAs: ({ email, tenant }) => `Voc\xEA entrou como ${email}, em ${tenant}.`,
    code: "C\xF3digo",
    ...labels
  };
  const said = ACCESS_DENIAL_TEXT[code];
  return /* @__PURE__ */ jsxs11(Stack, { gap: "lg", children: [
    !NO_LOCK.includes(code) && // Decorativa: o título já diz o que houve, então fica fora da árvore de acessibilidade.
    /* @__PURE__ */ jsx15(Box, { maw: 200, mx: "auto", "aria-hidden": "true", children: /* @__PURE__ */ jsx15(DrawOn, { still: true, children: /* @__PURE__ */ jsx15(SceneLocked, {}) }) }),
    /* @__PURE__ */ jsxs11(Stack, { gap: "xs", children: [
      /* @__PURE__ */ jsx15(Title, { order: 2, children: title ?? said.title }),
      /* @__PURE__ */ jsx15(Text2, { className: "dd-muted", children: body ?? (services ? said.body : said.short) })
    ] }),
    signedInAs && /* @__PURE__ */ jsx15(Text2, { size: "sm", className: "dd-muted", children: text.signedInAs(signedInAs) }),
    services,
    actions && /* @__PURE__ */ jsx15(Group, { gap: "sm", children: actions }),
    detail && /* @__PURE__ */ jsxs11(Text2, { size: "xs", className: "dd-muted dd-mono", children: [
      text.code,
      ": ",
      detail
    ] })
  ] });
}

// src/session.tsx
import { useEffect as useEffect10, useRef as useRef9, useState as useState10, useSyncExternalStore } from "react";
import { Anchor as Anchor3, Box as Box3, Button as Button3, Modal as Modal2, Stack as Stack2, Text as Text4, Title as Title2 } from "@mantine/core";

// src/suite.tsx
import { useEffect as useEffect9, useRef as useRef8 } from "react";
import {
  ActionIcon as ActionIcon6,
  Avatar as Avatar2,
  Box as Box2,
  Group as Group2,
  Menu,
  SegmentedControl as SegmentedControl2,
  Text as Text3,
  Tooltip as Tooltip5,
  UnstyledButton as UnstyledButton4,
  useMantineColorScheme
} from "@mantine/core";
import {
  ArrowSquareOut as ArrowSquareOut2,
  CaretDown as CaretDown3,
  Moon,
  SignOut,
  SquaresFour,
  Sun,
  UserCircle
} from "@phosphor-icons/react";
import { Fragment as Fragment4, jsx as jsx16, jsxs as jsxs12 } from "react/jsx-runtime";
var SUITE_HEADER_HEIGHT = 60;
var APP_SWITCHER_LABELS = {
  trigger: "Trocar de app",
  title: "Seus apps",
  loading: "Carregando\u2026",
  error: "N\xE3o deu para carregar a lista de apps.",
  empty: "Nenhum app contratado.",
  here: "Voc\xEA est\xE1 aqui"
};
function AppSwitcher({
  services,
  loading = false,
  error = false,
  currentSlug,
  labels
}) {
  const text = { ...APP_SWITCHER_LABELS, ...labels };
  return /* @__PURE__ */ jsxs12(Menu, { shadow: "md", width: 260, position: "bottom-start", children: [
    /* @__PURE__ */ jsx16(Menu.Target, { children: /* @__PURE__ */ jsx16(Tooltip5, { label: text.trigger, openDelay: 400, children: /* @__PURE__ */ jsx16(ActionIcon6, { size: "lg", "aria-label": text.trigger, children: /* @__PURE__ */ jsx16(SquaresFour, { size: 18 }) }) }) }),
    /* @__PURE__ */ jsxs12(Menu.Dropdown, { children: [
      /* @__PURE__ */ jsx16(Menu.Label, { children: text.title }),
      loading && /* @__PURE__ */ jsx16(Menu.Item, { disabled: true, children: /* @__PURE__ */ jsx16(Text3, { size: "sm", c: "dimmed", children: text.loading }) }),
      !loading && error && /* @__PURE__ */ jsx16(Menu.Item, { disabled: true, children: /* @__PURE__ */ jsx16(Text3, { size: "sm", c: "dimmed", children: text.error }) }),
      !loading && !error && services.length === 0 && /* @__PURE__ */ jsx16(Menu.Item, { disabled: true, children: /* @__PURE__ */ jsx16(Text3, { size: "sm", c: "dimmed", children: text.empty }) }),
      !loading && !error && services.map((service) => {
        const here = service.slug === currentSlug;
        return /* @__PURE__ */ jsxs12(
          Menu.Item,
          {
            component: "a",
            href: service.href,
            disabled: here,
            rightSection: service.kind === "external" ? /* @__PURE__ */ jsx16(ArrowSquareOut2, { size: 14, "aria-hidden": true }) : void 0,
            children: [
              /* @__PURE__ */ jsx16(Text3, { size: "sm", children: service.name }),
              here && /* @__PURE__ */ jsx16(Text3, { size: "xs", c: "dimmed", children: text.here })
            ]
          },
          service.slug
        );
      })
    ] })
  ] });
}
var APPEARANCE_LABELS = {
  light: "Claro",
  dark: "Escuro",
  label: "Apar\xEAncia"
};
var APPEARANCE_OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon }
];
function AppearanceControl({
  value,
  onChange,
  labels,
  fullWidth,
  iconsOnly
}) {
  const text = { ...APPEARANCE_LABELS, ...labels };
  return /* @__PURE__ */ jsx16(
    SegmentedControl2,
    {
      size: "xs",
      radius: "xl",
      fullWidth,
      "aria-label": text.label,
      value: value === "auto" ? "light" : value,
      onChange: (next) => onChange(next),
      data: APPEARANCE_OPTIONS.map(({ value: option, icon: Icon }) => ({
        value: option,
        label: /* @__PURE__ */ jsxs12(
          Group2,
          {
            gap: 4,
            wrap: "nowrap",
            justify: "center",
            title: text[option],
            "aria-label": text[option],
            children: [
              /* @__PURE__ */ jsx16(Icon, { size: 14, "aria-hidden": true }),
              iconsOnly ? null : /* @__PURE__ */ jsx16("span", { children: text[option] })
            ]
          }
        )
      }))
    }
  );
}
function initials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}
var USER_MENU_LABELS = {
  account: "Minha conta",
  signOut: "Sair",
  menu: "Sua conta"
};
function UserMenu({
  name,
  email,
  accountUrl,
  appearance,
  onSignOut,
  children,
  footer,
  target,
  position = "bottom-end",
  labels
}) {
  const text = { ...USER_MENU_LABELS, ...labels };
  const showAccount = Boolean(accountUrl);
  const hasExtras = children !== void 0 && children !== null && children !== false;
  return /* @__PURE__ */ jsxs12(Menu, { position, width: appearance ? 240 : 200, shadow: "lg", radius: "lg", children: [
    /* @__PURE__ */ jsx16(Menu.Target, { children: target ?? /* @__PURE__ */ jsxs12(UnstyledButton4, { className: "dd-suite-user", "aria-label": text.menu, children: [
      /* @__PURE__ */ jsx16(Avatar2, { size: 30, radius: "xl", color: "inverse", variant: "filled", children: name ? initials(name) : null }),
      name && /* @__PURE__ */ jsx16("span", { className: "dd-suite-user-name", children: name }),
      /* @__PURE__ */ jsx16(CaretDown3, { size: 12, "aria-hidden": true })
    ] }) }),
    /* @__PURE__ */ jsxs12(Menu.Dropdown, { children: [
      email && /* @__PURE__ */ jsx16(Menu.Label, { children: email }),
      showAccount && /* @__PURE__ */ jsx16(
        Menu.Item,
        {
          component: "a",
          href: accountUrl ?? void 0,
          leftSection: /* @__PURE__ */ jsx16(UserCircle, { size: 16 }),
          children: text.account
        }
      ),
      children,
      appearance && /* @__PURE__ */ jsxs12(Fragment4, { children: [
        (showAccount || hasExtras) && /* @__PURE__ */ jsx16(Menu.Divider, {}),
        /* @__PURE__ */ jsxs12(Box2, { px: "sm", py: "xs", children: [
          /* @__PURE__ */ jsx16(Text3, { size: "xs", c: "dimmed", mb: 6, children: appearance.labels?.label ?? APPEARANCE_LABELS.label }),
          /* @__PURE__ */ jsx16(
            AppearanceControl,
            {
              fullWidth: true,
              value: appearance.value,
              onChange: appearance.onChange,
              labels: appearance.labels
            }
          )
        ] })
      ] }),
      (showAccount || hasExtras || appearance) && /* @__PURE__ */ jsx16(Menu.Divider, {}),
      /* @__PURE__ */ jsx16(Menu.Item, { leftSection: /* @__PURE__ */ jsx16(SignOut, { size: 16 }), onClick: onSignOut, children: text.signOut }),
      footer && /* @__PURE__ */ jsxs12(Fragment4, { children: [
        /* @__PURE__ */ jsx16(Menu.Divider, {}),
        /* @__PURE__ */ jsx16(Text3, { size: "xs", c: "dimmed", px: "sm", py: 6, ta: "center", children: footer })
      ] })
    ] })
  ] });
}
function SuiteHeader({
  start,
  brand,
  tabs,
  end,
  tabsLabel = "Se\xE7\xF5es"
}) {
  return /* @__PURE__ */ jsxs12("div", { className: "dd-suite-header", style: { height: SUITE_HEADER_HEIGHT }, children: [
    start,
    /* @__PURE__ */ jsx16("div", { className: "dd-suite-brand", children: brand }),
    tabs && /* @__PURE__ */ jsx16("nav", { className: "dd-tabs dd-suite-tabs", "aria-label": tabsLabel, children: tabs }),
    end && /* @__PURE__ */ jsx16("div", { className: "dd-suite-end", children: end })
  ] });
}
function useColorSchemePreference(preferred) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const received = useRef8(void 0);
  useEffect9(() => {
    if (preferred === void 0 || received.current === preferred) return;
    received.current = preferred;
    setColorScheme(preferred ?? "light");
  }, [preferred, setColorScheme]);
  useEffect9(() => {
    if (colorScheme === "auto") setColorScheme(received.current ?? "light");
  }, [colorScheme, setColorScheme]);
}
function matchLocale(tags, supported) {
  const fold2 = (value) => value.toLowerCase();
  const language = (value) => fold2(value).split("-")[0];
  for (const tag of tags) {
    const whole = supported.find((locale) => fold2(locale) === fold2(tag));
    if (whole) return whole;
    const lang = language(tag);
    if (!lang) continue;
    const byLanguage = supported.find((locale) => language(locale) === lang);
    if (byLanguage) return byLanguage;
  }
  return void 0;
}
function browserLanguages() {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}
function pickLocale(preferred, supported, browserTags = browserLanguages()) {
  if (preferred === void 0) return void 0;
  if (preferred === null) return matchLocale(browserTags, supported);
  const wanted = preferred.toLowerCase();
  const exact = supported.find((locale) => locale.toLowerCase() === wanted);
  return exact ?? matchLocale([preferred, ...browserTags], supported);
}
function useRefreshOnReturn(refresh, throttleMs = 5e3) {
  const latest = useRef8(refresh);
  useEffect9(() => {
    latest.current = refresh;
  });
  useEffect9(() => {
    let last = Number.NEGATIVE_INFINITY;
    const onReturn = () => {
      if (document.visibilityState !== "visible") return;
      const now2 = Date.now();
      if (now2 - last < throttleMs) return;
      last = now2;
      latest.current();
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, [throttleMs]);
}

// src/session.tsx
import { jsx as jsx17, jsxs as jsxs13 } from "react/jsx-runtime";
var established = false;
var lost = false;
var listeners = /* @__PURE__ */ new Set();
function emit() {
  for (const listener of listeners) listener();
}
function noteSessionOk() {
  established = true;
}
function sessionEstablished() {
  return established;
}
function noteUnauthorized() {
  if (!established || lost) return;
  lost = true;
  emit();
}
function watchSession(res) {
  if (res.status === 401) noteUnauthorized();
  else if (res.ok) noteSessionOk();
}
function clearSessionLost() {
  if (!lost) return;
  lost = false;
  emit();
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function useSessionLost() {
  return useSyncExternalStore(
    subscribe,
    () => lost,
    () => false
  );
}
function resetSessionState() {
  established = false;
  lost = false;
  emit();
}
var SESSION_RESUMED_PATH = "/sessao-retomada";
var CHANNEL = "deckdoo.session";
var RESUMED = "resumed";
function announceSessionResumed() {
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage(RESUMED);
    channel.close();
  } catch {
  }
}
function onSessionResumed(callback) {
  let channel;
  try {
    channel = new BroadcastChannel(CHANNEL);
  } catch {
    return () => void 0;
  }
  channel.onmessage = (event) => {
    if (event.data === RESUMED) callback();
  };
  return () => channel.close();
}
function openLoginWindow(href) {
  const width = 480;
  const height = 680;
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  const opened = window.open(
    href,
    "deckdoo-login",
    `popup,width=${width},height=${height},left=${left},top=${top}`
  );
  if (!opened) return false;
  opened.focus();
  return true;
}
var EXPIRED_LABELS = {
  title: "Sua sess\xE3o acabou",
  body: "Pode ter sido uma troca de senha ou uma sa\xEDda em outro aparelho. Entre de novo para continuar: esta tela fica como est\xE1.",
  waiting: "Entre na janela que abriu. Quando terminar, esta tela continua sozinha.",
  signIn: "Entrar de novo",
  reopen: "Abrir a janela de novo",
  signInHere: "Entrar nesta aba (recarrega a p\xE1gina)"
};
function SessionExpiredModal({
  loginHref,
  checkSession,
  onResumed,
  resumedPath = SESSION_RESUMED_PATH,
  labels
}) {
  const isLost = useSessionLost();
  return /* @__PURE__ */ jsx17(
    Modal2,
    {
      opened: isLost,
      onClose: () => void 0,
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
      centered: true,
      size: 400,
      radius: "lg",
      padding: "xl",
      zIndex: 1e3,
      overlayProps: { backgroundOpacity: 0.4, blur: 3 },
      children: /* @__PURE__ */ jsx17(
        SignInAgain,
        {
          loginHref,
          checkSession,
          onResumed,
          resumedPath,
          text: { ...EXPIRED_LABELS, ...labels }
        }
      )
    }
  );
}
function SignInAgain({
  loginHref,
  checkSession,
  onResumed,
  resumedPath,
  text
}) {
  const [waiting, setWaiting] = useState10(false);
  const here = () => `${window.location.pathname}${window.location.search}`;
  const latest = useRef9(onResumed);
  useEffect10(() => {
    latest.current = onResumed;
  });
  useEffect10(
    () => onSessionResumed(() => {
      clearSessionLost();
      latest.current();
    }),
    []
  );
  useRefreshOnReturn(() => {
    checkSession().then(() => {
      clearSessionLost();
      latest.current();
    }).catch(() => void 0);
  }, 1e3);
  function signIn() {
    if (openLoginWindow(loginHref(resumedPath))) {
      setWaiting(true);
      return;
    }
    window.location.assign(loginHref(here()));
  }
  return /* @__PURE__ */ jsxs13(Stack2, { align: "center", gap: "lg", ta: "center", children: [
    /* @__PURE__ */ jsx17(Box3, { w: 120, "aria-hidden": "true", children: /* @__PURE__ */ jsx17(DrawOn, { still: true, children: /* @__PURE__ */ jsx17(SceneLocked, {}) }) }),
    /* @__PURE__ */ jsxs13(Stack2, { gap: 6, children: [
      /* @__PURE__ */ jsx17(Title2, { order: 3, children: text.title }),
      /* @__PURE__ */ jsx17(Text4, { size: "sm", className: "dd-muted", children: text.body })
    ] }),
    waiting && /* @__PURE__ */ jsx17(Text4, { size: "sm", role: "status", children: text.waiting }),
    /* @__PURE__ */ jsxs13(Stack2, { gap: "xs", w: "100%", align: "center", children: [
      /* @__PURE__ */ jsx17(Button3, { fullWidth: true, size: "md", onClick: signIn, children: waiting ? text.reopen : text.signIn }),
      waiting && /* @__PURE__ */ jsx17(Anchor3, { href: loginHref(here()), size: "xs", className: "dd-muted", children: text.signInHere })
    ] })
  ] });
}
var RESUMED_LABELS = {
  title: "Voc\xEA entrou de novo",
  body: "Pode fechar esta janela: a tela de onde voc\xEA veio j\xE1 continuou.",
  home: "Voltar ao app"
};
function SessionResumed({
  homeHref = "/",
  labels
}) {
  const text = { ...RESUMED_LABELS, ...labels };
  useEffect10(() => {
    announceSessionResumed();
    window.close();
  }, []);
  return /* @__PURE__ */ jsx17(
    EmptyState,
    {
      art: /* @__PURE__ */ jsx17(SceneDone, {}),
      title: text.title,
      action: /* @__PURE__ */ jsx17(Button3, { component: "a", href: homeHref, children: text.home }),
      children: text.body
    }
  );
}
export {
  ACCESS_DENIAL_TEXT,
  APP_ICON_SHAPES,
  AccessDenied,
  AppIcon,
  AppList,
  AppSwitcher,
  AppearanceControl,
  BRAND,
  Block,
  ChatBubble,
  ChatEnterScope,
  Count,
  DECKDOO_BRAND,
  DECKDOO_WORD,
  DRAWER_FLOAT_BELOW,
  DUDOO_INTENSITY,
  DUDOO_MOODS,
  DUDOO_REDUCED_TIMING,
  DUDOO_TIMING,
  DesignProvider,
  Dots,
  DrawOn,
  DuDoo,
  DuDooFace,
  DuDooMotion,
  DuDooSays,
  DuDooWall,
  EmptyState,
  Enter,
  FilterBar,
  FilterChip,
  FilterMenu,
  INVERSE,
  LOCKUP_COMMERCE,
  LOCKUP_MARKETING,
  LOCKUP_PAGES,
  LOCKUP_SITES,
  LOCKUP_SLIDES,
  LOCKUP_SPEC,
  LOCKUP_VERSIONS,
  LOCKUP_WORKS,
  Logo,
  MARK_PUPIL,
  NavGroup,
  NavItem,
  NavSection,
  Panel,
  PillTabs,
  READING,
  RailButton,
  SCENE_STROKE,
  SESSION_RESUMED_PATH,
  SUITE_APPS,
  SUITE_HEADER_HEIGHT,
  Scene,
  SceneAllClear,
  SceneCard,
  SceneDone,
  SceneDuDoo,
  SceneDuDooFace,
  SceneEmpty,
  SceneGenerating,
  SceneLine,
  SceneLocked,
  SceneNoResults,
  SessionExpiredModal,
  SessionResumed,
  SideBar,
  SidePanel,
  SideRail,
  SideScroll,
  SideTip,
  Skeleton,
  Stat,
  Status,
  StatusScreen,
  Steps,
  SuiteAppIcon,
  SuiteHeader,
  SuiteRail,
  SystemNotice,
  TopProgress,
  Typing,
  UserMenu,
  WAIT_DELAY,
  YouSay,
  accentHex,
  announceSessionResumed,
  buildTheme,
  clearSessionLost,
  curl,
  drawOn,
  dudooExpression,
  initials,
  lockupHasMark,
  lockupLayout,
  lockupWeight,
  lockupWeights,
  matchLocale,
  monthPeriod,
  noteSessionOk,
  noteUnauthorized,
  onSessionResumed,
  openLoginWindow,
  periodLabel,
  periodShortcuts,
  pickLocale,
  pickOutline,
  replyMood,
  requestPanel,
  resetSessionState,
  roundedRectPath,
  sessionEstablished,
  sketch,
  sparkle,
  suiteApp,
  useBrand,
  useColorSchemePreference,
  useDrawerFloats,
  useDuDooMotion,
  useLockupApp,
  usePanelRequests,
  usePrefersReducedMotion,
  useReadThenThink,
  useRefreshOnReturn,
  useScrollFade,
  useSessionLost,
  useSideCollapsed,
  useWait,
  watchSession,
  wordTransform,
  yearPeriod
};
//# sourceMappingURL=index.js.map
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
  Progress,
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
function accentHex(accent) {
  if (!accent.startsWith("#")) {
    const named = BRAND[accent];
    if (!named)
      throw new Error(`Acento desconhecido: "${accent}". Use um nome da paleta ou um hex.`);
    return named;
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
    radius: { xs: "6px", sm: "10px", md: "14px", lg: "20px", xl: "28px" },
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
        defaultProps: { radius: control },
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
        defaultProps: { radius: "xl", variant: "default" },
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
      Progress: Progress.extend({
        vars: (_theme, props) => props.color === INVERSE ? { root: {}, section: { "--progress-section-color": "var(--dd-inverse)" } } : { root: {}, section: {} }
      }),
      Avatar: Avatar.extend({
        vars: (_theme, props) => props.color === INVERSE ? {
          root: {
            "--avatar-bg": "var(--dd-inverse)",
            "--avatar-color": "var(--dd-on-inverse)"
          }
        } : { root: {} }
      }),
      Badge: Badge.extend({
        defaultProps: { radius: "xl", variant: "light" },
        styles: { root: { textTransform: "none", fontWeight: 500, letterSpacing: 0 } }
      }),
      // Todo campo de uma linha é controle, não só o `TextInput`: cada componente do Mantine
      // tem o próprio padrão, e o que fica de fora cai no `defaultRadius` (canto 14). Foi
      // assim que o campo de senha destoou do e-mail ao lado no login do Hub. Campo novo
      // de uma linha entra aqui; o `Textarea`, de várias, fica no canto de bloco.
      TextInput: TextInput.extend({ defaultProps: { radius: control } }),
      PasswordInput: PasswordInput.extend({ defaultProps: { radius: control } }),
      NumberInput: NumberInput.extend({ defaultProps: { radius: control } }),
      Select: Select.extend({ defaultProps: { radius: control } }),
      MultiSelect: MultiSelect.extend({ defaultProps: { radius: control } }),
      Autocomplete: Autocomplete.extend({ defaultProps: { radius: control } }),
      TagsInput: TagsInput.extend({ defaultProps: { radius: control } }),
      NativeSelect: NativeSelect.extend({ defaultProps: { radius: control } }),
      FileInput: FileInput.extend({ defaultProps: { radius: control } }),
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
function DesignProvider({ brand, children }) {
  return /* @__PURE__ */ jsx(BrandContext.Provider, { value: brand ?? DECKDOO_BRAND, children });
}
function useBrand() {
  return useContext(BrandContext);
}

// src/components.tsx
import { isLightColor, useMantineTheme } from "@mantine/core";
import { Check } from "@phosphor-icons/react";

// src/brand/dudoo-tile.svg
var dudoo_tile_default = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%20%3C!--%20O%20papel%20de%20parede%20do%20DuDoo%20no%20claro%3A%20o%20mascote%20repetido%2C%20como%20o%20fundo%20de%20uma%20conversa.%20Vira%20m%C3%A1scara%20(%60DuDooWall%60).%20--%3E%20%3Cdefs%3E%20%3Cg%20id%3D%22m%22%3E%20%3Cpath%20d%3D%22M89.9%2C37.81c-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59Z%22%2F%3E%20%3Cpath%20d%3D%22M47.52%2C34.22c-1.53-.87-3.22-1.3-5.07-1.3s-3.54.43-5.07%2C1.3c-1.53.87-2.72%2C2.06-3.59%2C3.59-.87%2C1.52-1.3%2C3.24-1.3%2C5.16s.43%2C3.56%2C1.3%2C5.11c.87%2C1.56%2C2.06%2C2.77%2C3.59%2C3.63%2C1.52.87%2C3.21%2C1.3%2C5.07%2C1.3s3.54-.43%2C5.07-1.3c1.52-.87%2C2.72-2.06%2C3.59-3.59.87-1.52%2C1.3-3.24%2C1.3-5.16s-.43-3.56-1.3-5.11c-.87-1.55-2.06-2.76-3.59-3.63Z%22%2F%3E%20%3Cpath%20d%3D%22M114.39%2C61.66c-.99.77-2.04%2C1.49-3.18%2C2.12-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.36-1.87%2C7.09-2.9%2C11.16-3.1-4.13-4.25-8.87-7.89-14.27-10.89C73%2C2.72%2C62.04%2C0%2C49.94%2C0h-28.99C9.38%2C0%2C0%2C9.38%2C0%2C20.95v83.4c0%2C11.57%2C9.38%2C20.95%2C20.95%2C20.95h28.99c12.1%2C0%2C23.06-2.72%2C32.87-8.17%2C9.81-5.45%2C17.52-12.95%2C23.15-22.52%2C5.63-9.56%2C8.44-20.22%2C8.44-31.96%2C0-.33-.01-.66-.01-.99ZM63.98%2C55.17c-2.15%2C3.65-5.11%2C6.52-8.88%2C8.61-3.77%2C2.09-7.98%2C3.14-12.65%2C3.14s-8.88-1.05-12.65-3.14c-3.77-2.09-6.73-4.96-8.88-8.61-2.15-3.65-3.23-7.71-3.23-12.2s1.08-8.55%2C3.23-12.2c2.15-3.65%2C5.11-6.52%2C8.88-8.61%2C3.77-2.09%2C7.98-3.14%2C12.65-3.14s8.88%2C1.05%2C12.65%2C3.14c3.77%2C2.09%2C6.73%2C4.96%2C8.88%2C8.61%2C2.15%2C3.65%2C3.23%2C7.71%2C3.23%2C12.2s-1.08%2C8.55-3.23%2C12.2Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fdefs%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(18%2022)%20rotate(-14%2010.0%2011.0)%20scale(0.1756)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(92%2010)%20rotate(10%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%2040)%20rotate(6%2013.7%2015.0)%20scale(0.2394)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(236%2018)%20rotate(-20%208.2%209.0)%20scale(0.1437)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(270%2092)%20rotate(16%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(40%20104)%20rotate(24%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(110%2092)%20rotate(-8%2011.9%2013.0)%20scale(0.2075)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(196%20112)%20rotate(-24%207.3%208.0)%20scale(0.1277)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(250%20160)%20rotate(12%2011.9%2013.0)%20scale(0.2075)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(20%20176)%20rotate(8%2012.8%2014.0)%20scale(0.2235)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(96%20170)%20rotate(-18%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%20190)%20rotate(20%209.1%2010.0)%20scale(0.1596)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(214%20222)%20rotate(-6%205.5%206.0)%20scale(0.0958)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(60%20240)%20rotate(-22%208.2%209.0)%20scale(0.1437)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(130%20252)%20rotate(4%2011.0%2012.0)%20scale(0.1915)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(256%20256)%20rotate(26%206.4%207.0)%20scale(0.1117)%22%2F%3E%20%3C%2Fsvg%3E";

// src/brand/dudoo-tile-inverse.svg
var dudoo_tile_inverse_default = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%20%3C!--%20O%20papel%20de%20parede%20do%20DuDoo%20no%20escuro%3A%20o%20mascote%20inverso%2C%20nas%20mesmas%20posi%C3%A7%C3%B5es%20do%20claro.%20Vira%20m%C3%A1scara%20(%60DuDooWall%60).%20--%3E%20%3Cdefs%3E%20%3Cg%20id%3D%22m%22%3E%20%3Cpath%20d%3D%22M40.46%2C23.09c-1.13-1.91-2.67-3.41-4.64-4.5-1.97-1.09-4.18-1.64-6.61-1.64s-4.64.55-6.61%2C1.64c-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c1.97-1.09%2C3.52-2.6%2C4.64-4.5%2C1.13-1.91%2C1.69-4.03%2C1.69-6.38s-.56-4.47-1.69-6.38ZM33.73%2C32.17c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7Z%22%2F%3E%20%3Cpath%20d%3D%22M68.45%2C19.5c-3.57-6.07-8.53-10.9-14.74-14.34C47.55%2C1.73%2C40.62%2C0%2C33.12%2C0h-15.16C8.06%2C0%2C0%2C8.05%2C0%2C17.96v43.62c0%2C9.9%2C8.06%2C17.96%2C17.96%2C17.96h15.16c7.51%2C0%2C14.43-1.73%2C20.59-5.16%2C6.21-3.45%2C11.17-8.28%2C14.74-14.34%2C3.57-6.07%2C5.38-12.89%2C5.38-20.27s-1.81-14.2-5.38-20.27ZM61.2%2C24.9c.8.45%2C1.42%2C1.09%2C1.88%2C1.9.45.81.68%2C1.71.68%2C2.67s-.23%2C1.9-.68%2C2.7c-.45.8-1.08%2C1.42-1.88%2C1.88-.8.45-1.68.68-2.65.68s-1.85-.23-2.65-.68c-.8-.45-1.42-1.09-1.88-1.9-.45-.81-.68-1.7-.68-2.67s.23-1.9.68-2.7c.45-.8%2C1.08-1.42%2C1.88-1.88.8-.45%2C1.68-.68%2C2.65-.68s1.85.23%2C2.65.68ZM62.42%2C56.48c-2.94%2C5-6.98%2C8.93-12.11%2C11.78-5.13%2C2.85-10.86%2C4.27-17.19%2C4.27h-15.16c-6.05%2C0-10.96-4.91-10.96-10.96V17.96c0-6.05%2C4.91-10.96%2C10.96-10.96h15.16c6.33%2C0%2C12.06%2C1.42%2C17.19%2C4.27%2C2.82%2C1.57%2C5.3%2C3.47%2C7.46%2C5.7-2.13.1-4.08.64-5.84%2C1.62-1.97%2C1.09-3.52%2C2.6-4.64%2C4.5-1.13%2C1.91-1.69%2C4.03-1.69%2C6.38s.56%2C4.47%2C1.69%2C6.38c1.13%2C1.91%2C2.67%2C3.41%2C4.64%2C4.5%2C1.97%2C1.09%2C4.18%2C1.64%2C6.61%2C1.64s4.64-.55%2C6.61-1.64c.59-.33%2C1.15-.7%2C1.66-1.11%2C0%2C.17%2C0%2C.34%2C0%2C.52%2C0%2C6.14-1.47%2C11.71-4.42%2C16.72Z%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fdefs%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(18%2022)%20rotate(-14%2010.2%2011.0)%20scale(0.2766)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(92%2010)%20rotate(10%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%2040)%20rotate(6%2013.9%2015.0)%20scale(0.3772)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(236%2018)%20rotate(-20%208.4%209.0)%20scale(0.2263)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(270%2092)%20rotate(16%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(40%20104)%20rotate(24%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(110%2092)%20rotate(-8%2012.1%2013.0)%20scale(0.3269)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(196%20112)%20rotate(-24%207.4%208.0)%20scale(0.2012)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(250%20160)%20rotate(12%2012.1%2013.0)%20scale(0.3269)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(20%20176)%20rotate(8%2013.0%2014.0)%20scale(0.3521)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(96%20170)%20rotate(-18%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(150%20190)%20rotate(20%209.3%2010.0)%20scale(0.2515)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(214%20222)%20rotate(-6%205.6%206.0)%20scale(0.1509)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(60%20240)%20rotate(-22%208.4%209.0)%20scale(0.2263)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(130%20252)%20rotate(4%2011.1%2012.0)%20scale(0.3018)%22%2F%3E%20%3Cuse%20href%3D%22%23m%22%20transform%3D%22translate(256%20256)%20rotate(26%206.5%207.0)%20scale(0.1760)%22%2F%3E%20%3C%2Fsvg%3E";

// src/components.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var cx = (...names) => names.filter(Boolean).join(" ");
function Panel({
  title,
  actions,
  className,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxs("section", { className: cx("dd-panel", className), ...rest, children: [
    (title || actions) && /* @__PURE__ */ jsxs("header", { className: "dd-panel-head", children: [
      typeof title === "string" ? /* @__PURE__ */ jsx2("h3", { style: { margin: 0 }, children: title }) : title,
      actions
    ] }),
    children
  ] });
}
function Block({ className, ...rest }) {
  return /* @__PURE__ */ jsx2("div", { className: cx("dd-block", className), ...rest });
}
function Count({ children }) {
  return /* @__PURE__ */ jsx2("span", { className: "dd-count", children });
}
function NavItem({
  icon,
  label,
  count,
  active,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      className: "dd-nav-item",
      "data-active": active || void 0,
      "aria-current": active ? "page" : void 0,
      ...rest,
      children: [
        icon,
        /* @__PURE__ */ jsx2("span", { children: label }),
        count !== void 0 && /* @__PURE__ */ jsx2(Count, { children: count })
      ]
    }
  );
}
function PillTabs({
  tabs,
  value,
  onChange,
  leading
}) {
  return /* @__PURE__ */ jsxs("div", { className: "dd-tabs", role: "tablist", children: [
    leading,
    tabs.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        className: "dd-tab",
        "aria-selected": tab.value === value,
        "data-active": tab.value === value || void 0,
        onClick: () => onChange(tab.value),
        children: [
          tab.label,
          tab.count !== void 0 && /* @__PURE__ */ jsx2(Count, { children: tab.count })
        ]
      },
      tab.value
    ))
  ] });
}
function Status({ tone, children }) {
  return /* @__PURE__ */ jsx2("span", { className: "dd-status", "data-tone": tone, children });
}
function Stat({
  label,
  value,
  hint,
  active
}) {
  return /* @__PURE__ */ jsxs("div", { className: "dd-stat", "data-active": active || void 0, children: [
    /* @__PURE__ */ jsx2("span", { className: "dd-muted", style: { fontSize: 13 }, children: label }),
    /* @__PURE__ */ jsx2("span", { className: "dd-stat-value", children: value }),
    hint && /* @__PURE__ */ jsx2("span", { className: "dd-muted", style: { fontSize: 12 }, children: hint })
  ] });
}
function Steps({ steps }) {
  return /* @__PURE__ */ jsx2("ol", { className: "dd-steps", style: { margin: 0, listStyle: "none" }, children: steps.map((step) => /* @__PURE__ */ jsxs(
    "li",
    {
      className: "dd-step",
      "data-state": step.state,
      "aria-current": step.state === "current" ? "step" : void 0,
      children: [
        /* @__PURE__ */ jsx2("span", { className: "dd-step-dot", children: step.state === "done" && /* @__PURE__ */ jsx2(Check, { size: 12, weight: "bold" }) }),
        /* @__PURE__ */ jsx2("strong", { style: { fontWeight: 500 }, children: step.label }),
        /* @__PURE__ */ jsx2("span", { className: "dd-mono dd-faint", children: step.when })
      ]
    },
    step.label
  )) });
}
function Dots({ value, total = 10 }) {
  const on = Math.round(value * total);
  return /* @__PURE__ */ jsx2(
    "span",
    {
      className: "dd-dots",
      role: "meter",
      "aria-valuenow": Math.round(value * 100),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: Array.from({ length: total }, (_, i) => /* @__PURE__ */ jsx2("span", { "data-off": i >= on || void 0 }, i))
    }
  );
}
function LogoShape({
  shape,
  url,
  ratio,
  height
}) {
  return /* @__PURE__ */ jsx2(
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
function Logo({
  variant = "type",
  height = 28,
  on,
  color,
  label
}) {
  const brand = useBrand();
  const { light, dark: dark2 = light } = brand[variant];
  return /* @__PURE__ */ jsxs(
    "span",
    {
      role: "img",
      "aria-label": label ?? brand.name,
      className: "dd-logo-switch",
      "data-on": on,
      style: { color },
      children: [
        /* @__PURE__ */ jsx2(LogoShape, { shape: "light", height, ...light }),
        /* @__PURE__ */ jsx2(LogoShape, { shape: "dark", height, ...dark2 })
      ]
    }
  );
}
function AppIcon({ size = 40 }) {
  const theme = useMantineTheme();
  const accent = theme.colors[theme.primaryColor]?.[6];
  const onLight = accent ? isLightColor(accent, theme.luminanceThreshold) : true;
  return /* @__PURE__ */ jsx2("span", { className: "dd-app-icon", style: { width: size, height: size, borderRadius: size * 0.28 }, children: /* @__PURE__ */ jsx2(
    Logo,
    {
      variant: "mark",
      on: onLight ? "light" : "dark",
      height: Math.round(size * 0.56),
      color: "var(--dd-on-accent)"
    }
  ) });
}
function DuDoo({ size = 32 }) {
  const { light, dark: dark2 = light } = DECKDOO_BRAND.mark;
  return /* @__PURE__ */ jsx2("span", { className: "dd-dudoo", role: "img", "aria-label": "DuDoo", style: { width: size, height: size }, children: /* @__PURE__ */ jsx2(LogoShape, { shape: "dark", height: Math.round(size * 0.56), ...dark2 }) });
}
function DuDooWall({ className, style, ...rest }) {
  return /* @__PURE__ */ jsx2(
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
  children
}) {
  const mine = from === "you";
  return /* @__PURE__ */ jsxs("div", { className: "dd-chat-row", "data-mine": mine || void 0, children: [
    !mine && (avatar ? /* @__PURE__ */ jsx2(DuDoo, { size: 28 }) : /* @__PURE__ */ jsx2("span", { className: "dd-chat-gap" })),
    /* @__PURE__ */ jsx2("div", { className: "dd-bubble", "data-mine": mine || void 0, children })
  ] });
}
export {
  AppIcon,
  BRAND,
  Block,
  ChatBubble,
  Count,
  DECKDOO_BRAND,
  DesignProvider,
  Dots,
  DuDoo,
  DuDooWall,
  INVERSE,
  Logo,
  NavItem,
  Panel,
  PillTabs,
  Stat,
  Status,
  Steps,
  accentHex,
  buildTheme,
  useBrand
};
//# sourceMappingURL=index.js.map
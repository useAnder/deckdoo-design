#!/usr/bin/env node
/**
 * O favicon da suíte: o mascote (o `mark.light` da marca) sobre um quadrado no acento do app.
 *
 *   deckdoo-favicon [--mark mascote.svg] [--bg "#a2ff00"] [--ink "#0e172a"] [--out favicon.svg]
 *
 * Sem `--mark`, usa o mascote do DeckDoo; sem `--bg`, o limão; sem `--ink`, a tinta da suíte num
 * fundo claro e o papel num escuro (o mesmo corte de contraste do tema). Sem `--out`, escreve no
 * terminal. Quadrado de 64 com canto 16 e mascote de 36 de altura, centrado.
 *
 * O SVG do mascote precisa ser só forma (os `path`, `circle`… dentro do `<svg>`): o script tira
 * `fill`, classes e `<style>` e pinta tudo com a tinta.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const SIZE = 64;
const RADIUS = 16;
const MARK_HEIGHT = 36;
const INK = "#0e172a";
const PAPER = "#fbfcf8";
const LIME = "#a2ff00";
// O mesmo `luminanceThreshold` do `buildTheme`.
const LUMINANCE_THRESHOLD = 0.4;

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_MARK = resolve(here, "../src/brand/deckdoo-mark.svg");

const { values } = parseArgs({
  options: {
    mark: { type: "string", default: DEFAULT_MARK },
    bg: { type: "string", default: LIME },
    ink: { type: "string" },
    out: { type: "string" },
  },
});

function hex(color) {
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (short)
    return `#${short
      .slice(1)
      .map((c) => c + c)
      .join("")}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
  throw new Error(`Cor inválida: "${color}". Use hex de 3 ou 6 dígitos.`);
}

/** Luminância relativa (WCAG), a mesma conta do `isLightColor` do Mantine. */
function luminance(color) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(color.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const round = (n) => Math.round(n * 100) / 100;

const bg = hex(values.bg);
const ink = values.ink ? hex(values.ink) : luminance(bg) > LUMINANCE_THRESHOLD ? INK : PAPER;

const source = readFileSync(values.mark, "utf8");
const viewBox = /<svg\b[^>]*\bviewBox="([^"]+)"/i.exec(source)?.[1];
if (!viewBox) throw new Error(`${values.mark}: o <svg> precisa de viewBox.`);
const [minX, minY, width, height] = viewBox
  .trim()
  .split(/[\s,]+/)
  .map(Number);

const shapes = (/<svg\b[^>]*>([\s\S]*)<\/svg>/i.exec(source)?.[1] ?? "")
  .replace(/<defs\b[\s\S]*?<\/defs>/gi, "")
  .replace(/<style\b[\s\S]*?<\/style>/gi, "")
  .replace(/<\/?g\b[^>]*>/gi, "")
  .replace(/\s(?:class|id|data-name|fill|style)="[^"]*"/gi, "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => `    ${line}`)
  .join("\n");

const scale = MARK_HEIGHT / height;
const x = (SIZE - width * scale) / 2 - minX * scale;
const y = (SIZE - MARK_HEIGHT) / 2 - minY * scale;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" fill="${bg}"/>
  <g fill="${ink}" transform="translate(${round(x).toFixed(2)} ${round(y).toFixed(2)}) scale(${scale.toFixed(4)})">
${shapes}
  </g>
</svg>
`;

if (values.out) {
  writeFileSync(values.out, svg);
  console.log(`favicon: ${values.out} (fundo ${bg}, tinta ${ink})`);
} else {
  process.stdout.write(svg);
}

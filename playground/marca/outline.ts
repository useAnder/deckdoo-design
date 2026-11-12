import { create, type Font, type PathCommand } from "fontkit";
import figtreeUrl from "@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2?url";
import jakartaUrl from "@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url";

/**
 * O texto do lockup em contorno, para o SVG baixado não depender da fonte instalada. Lê o
 * mesmo arquivo de fonte que a página mostra (o do Fontsource), no peso pedido.
 */

const URLS = { figtree: figtreeUrl, jakarta: jakartaUrl } as const;
export type OutlineFont = keyof typeof URLS;

const fonts = new Map<OutlineFont, Promise<Font>>();

function loadFont(key: OutlineFont): Promise<Font> {
  let hit = fonts.get(key);
  if (!hit) {
    hit = fetch(URLS[key])
      .then((r) => r.arrayBuffer())
      .then((b) => create(new Uint8Array(b)));
    fonts.set(key, hit);
  }
  return hit;
}

const n = (v: number) => +v.toFixed(2);

/**
 * O caminho SVG do texto em px, com a origem na linha de base do começo do texto (como o
 * `x`/`y` de um `<text>`). `tracking` em em, como o `letter-spacing`.
 */
export async function textOutline(
  key: OutlineFont,
  weight: number,
  text: string,
  size: number,
  tracking: number,
): Promise<string> {
  const font = (await loadFont(key)).getVariation({ wght: weight });
  const run = font.layout(text);
  const s = size / font.unitsPerEm;
  const parts: string[] = [];
  let pen = 0;
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i]!;
    const ox = pen + pos.xOffset;
    const oy = pos.yOffset;
    // Unidades da fonte têm y para cima; o SVG, para baixo.
    const pt = (x: number, y: number) => `${n((ox + x) * s)},${n(-(oy + y) * s)}`;
    for (const c of glyph.path.commands as PathCommand[]) {
      const a = c.args;
      if (c.command === "moveTo") parts.push(`M${pt(a[0]!, a[1]!)}`);
      else if (c.command === "lineTo") parts.push(`L${pt(a[0]!, a[1]!)}`);
      else if (c.command === "quadraticCurveTo")
        parts.push(`Q${pt(a[0]!, a[1]!)} ${pt(a[2]!, a[3]!)}`);
      else if (c.command === "bezierCurveTo")
        parts.push(`C${pt(a[0]!, a[1]!)} ${pt(a[2]!, a[3]!)} ${pt(a[4]!, a[5]!)}`);
      else parts.push("Z");
    }
    pen += pos.xAdvance + tracking * font.unitsPerEm;
  });
  return parts.join("");
}

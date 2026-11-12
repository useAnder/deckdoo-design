#!/usr/bin/env node
// Gera o nome de cada app em contorno para o `Logo` (src/lockup-names.ts): o texto vira caminho
// SVG, nos pesos que o lockup usa, com as medidas de cada letra. Assim o logo sai igual em
// qualquer app, sem depender de a fonte estar carregada no peso certo.
//
//   pnpm lockup                 os apps da lista abaixo
//   pnpm lockup Pages Websites  só esses (os outros que já estão no arquivo ficam)
//
// Lê a Figtree variável do Fontsource e os pesos de `src/lockup-spec.ts` (o Node roda TypeScript
// sem build). Mudou o peso, o espaço entre letras ou a lista: rode de novo.

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { create } from "fontkit";
import * as prettier from "prettier";
import { LOCKUP_SPEC, lockupWeights } from "../src/lockup-spec.ts";

/** Os apps da suíte. Nome de teste não entra: ele sai com a fonte da página até virar app. */
const APPS = ["Slides", "Works", "Marketing", "Sites", "Pages", "Commerce"];

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "src/lockup-names.ts");
const fontFile = resolve(
  root,
  "node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2",
);

const font = create(await readFile(fontFile));
const em = 1000 / font.unitsPerEm;
const r = (v) => Math.round(v);
const f4 = (v) => +v.toFixed(4);

function outline(name, weight) {
  const v = font.getVariation({ wght: weight });
  const run = v.layout(name);
  const tracking = LOCKUP_SPEC.tracking * font.unitsPerEm;
  const cap = v.layout("H").glyphs[0].path.bbox.maxY / font.unitsPerEm;
  const parts = [];
  const glyphs = [];
  let ascent = 0;
  let pen = 0;
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const ox = pen + pos.xOffset;
    const oy = pos.yOffset;
    // Unidades da fonte têm y para cima; o SVG, para baixo. Tudo em milésimos de em.
    const pt = (x, y) => `${r((ox + x) * em)} ${r(-(oy + y) * em)}`;
    for (const { command, args: a } of glyph.path.commands) {
      if (command === "moveTo") parts.push(`M${pt(a[0], a[1])}`);
      else if (command === "lineTo") parts.push(`L${pt(a[0], a[1])}`);
      else if (command === "quadraticCurveTo") parts.push(`Q${pt(a[0], a[1])} ${pt(a[2], a[3])}`);
      else if (command === "bezierCurveTo")
        parts.push(`C${pt(a[0], a[1])} ${pt(a[2], a[3])} ${pt(a[4], a[5])}`);
      else parts.push("Z");
    }
    const box = glyph.path.bbox;
    if (Number.isFinite(box.minX)) {
      glyphs.push([
        f4((ox + box.minX) / font.unitsPerEm),
        f4((ox + box.maxX) / font.unitsPerEm),
        f4(-(oy + box.minY) / font.unitsPerEm),
      ]);
      ascent = Math.max(ascent, (oy + box.maxY) / font.unitsPerEm);
    }
    pen += pos.xAdvance + tracking;
  });
  return {
    weight,
    d: parts.join(""),
    metrics: {
      capFrac: f4(cap),
      inkLeft: Math.min(...glyphs.map((g) => g[0])),
      inkRight: Math.max(...glyphs.map((g) => g[1])),
      ascent: f4(ascent),
      glyphs,
    },
  };
}

const constName = (name) =>
  `LOCKUP_${name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toUpperCase()}`;

// Com nomes na linha de comando, só eles são refeitos; o resto do arquivo fica.
const asked = process.argv.slice(2);
const names = asked.length ? asked : APPS;
const kept = new Map();
if (asked.length) {
  const current = await readFile(out, "utf8").catch(() => "");
  for (const m of current.matchAll(
    /^export const (LOCKUP_\w+): LockupApp = (\{[\s\S]*?\n\});$/gm,
  )) {
    kept.set(m[1], m[2]);
  }
}

const weights = lockupWeights(LOCKUP_SPEC);
for (const name of names) {
  const app = { name, outlines: weights.map((w) => outline(name, w)) };
  kept.set(constName(name), JSON.stringify(app));
}

const body = [...kept.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, json]) => `export const ${id}: LockupApp = ${json};`)
  .join("\n\n");

const source = `// Gerado por \`pnpm lockup\` (scripts/lockup.mjs): o nome de cada app em contorno, na Figtree,
// nos pesos ${weights.join(", ")}. Não edite à mão.

import type { LockupApp } from "./lockup.js";

${body}
`;

const config = (await prettier.resolveConfig(out)) ?? {};
await writeFile(out, await prettier.format(source, { ...config, filepath: out }));
console.log(`src/lockup-names.ts: ${[...kept.keys()].join(", ")} (pesos ${weights.join(", ")})`);

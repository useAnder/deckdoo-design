import { readFile } from "node:fs/promises";
import { defineConfig, type Options } from "tsup";

type EsbuildPlugin = NonNullable<Options["esbuildPlugins"]>[number];

/**
 * SVG vira data URI dentro do JS, para o app não precisar servir arquivo nenhum do pacote. Não é
 * o `loader: { ".svg": "dataurl" }` do esbuild: ele deixa as aspas do SVG cruas, e o `Logo` põe
 * a URL dentro de `url("…")`. Aqui tudo sai com `encodeURIComponent`.
 */
const svgDataUri: EsbuildPlugin = {
  name: "svg-data-uri",
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async ({ path }) => {
      const svg = (await readFile(path, "utf8")).replace(/\s+/g, " ").trim();
      const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      return { contents: `export default ${JSON.stringify(uri)};`, loader: "js" as const };
    });
  },
};

// O pacote: ESM + tipos, e o CSS num arquivo só (`dist/styles.css`). As peer dependencies ficam
// fora do bundle (o tsup já deixa de fora o que está em `peerDependencies`).
export default defineConfig({
  entry: { index: "src/index.ts", styles: "src/styles.css" },
  format: ["esm"],
  // O gerador de tipos do tsup ainda passa `baseUrl`, que o TypeScript 6 deprecia.
  dts: { entry: { index: "src/index.ts" }, compilerOptions: { ignoreDeprecations: "6.0" } },
  target: "es2023",
  sourcemap: true,
  clean: true,
  esbuildPlugins: [svgDataUri],
});

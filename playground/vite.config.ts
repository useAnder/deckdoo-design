import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const src = resolve(import.meta.dirname, "../src");

// A cozinha lê o pacote pelo código-fonte, não pelo `dist/`: mudou em `src/`, a página mostra.
export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@deckdoo\/design\/styles\.css$/, replacement: `${src}/styles.css` },
      { find: /^@deckdoo\/design$/, replacement: `${src}/index.ts` },
    ],
  },
  // Duas páginas: a cozinha e o ateliê do DuDoo.
  build: {
    rollupOptions: {
      input: {
        cozinha: resolve(import.meta.dirname, "index.html"),
        dudoo: resolve(import.meta.dirname, "dudoo.html"),
      },
    },
  },
  server: {
    port: 48391,
    // Falha alto se a porta estiver ocupada, em vez de migrar para outra.
    strictPort: true,
  },
});

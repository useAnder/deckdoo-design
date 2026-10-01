#!/usr/bin/env node
/**
 * Publica uma versão: `pnpm release 0.2.0` (ou `--no-push` para só preparar local).
 *
 * Os apps instalam por tag Git (`github:useAnder/deckdoo-design#v0.2.0`), e a tag leva o `dist/`
 * pronto: o pnpm 10 não roda script de build de dependência, então nenhum app compila o pacote.
 * Na `main` o `dist/` não entra; o commit com ele fica só na tag:
 *
 *   1. a `main` limpa ganha o commit "vX.Y.Z" com a versão no package.json;
 *   2. build;
 *   3. HEAD solto: commit do `dist/` por cima, tag anotada `vX.Y.Z`;
 *   4. volta para a `main` e empurra a `main` e a tag.
 */
import { execFileSync, execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { "no-push": { type: "boolean", default: false } },
});

const version = positionals[0]?.replace(/^v/, "");
if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error("Uso: pnpm release <versão>   (ex.: pnpm release 0.2.0)");
  process.exit(1);
}
const tag = `v${version}`;

const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit", shell: false });
const git = (...args) => run("git", args);
const gitOut = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

if (gitOut("branch", "--show-current") !== "main") throw new Error("Rode a partir da main.");
if (gitOut("status", "--porcelain")) throw new Error("A árvore precisa estar limpa.");
if (gitOut("tag", "--list", tag)) throw new Error(`A tag ${tag} já existe.`);

// 1. Versão na main.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (pkg.version !== version) {
  pkg.version = version;
  writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
  git("commit", "-am", tag);
}

// 2. Build. Pela shell: no Windows o pnpm é um .cmd.
execSync("pnpm build", { stdio: "inherit" });

// 3. O dist/ só na tag.
git("checkout", "--quiet", "--detach");
try {
  git("add", "--force", "dist");
  git("commit", "--quiet", "-m", `${tag} (dist)`);
  git("tag", "-a", tag, "-m", tag);
} finally {
  git("checkout", "--quiet", "main");
}

// 4. Publicar.
if (values["no-push"]) {
  console.log(`\n${tag} pronta localmente. Para publicar: git push origin main ${tag}`);
} else {
  git("push", "origin", "main", tag);
  console.log(
    `\n${tag} publicada. Nos apps: "@deckdoo/design": "github:useAnder/deckdoo-design#${tag}"`,
  );
}

# @deckdoo/design

O padrão visual da suíte DeckDoo: tema Mantine, tokens CSS, peças e marca. Nasceu no DeckDoo
(EloquentSlides) e vale para todos os apps. A bancada para ver e testar tudo é a **cozinha**
(`pnpm dev`, em `http://localhost:48391`).

## Instalar

Os apps instalam por tag Git, com versão fixa, e atualizam quando quiserem:

```json
"@deckdoo/design": "github:useAnder/deckdoo-design#v0.1.0"
```

A tag já traz o `dist/` pronto: o app não compila o pacote nem precisa de token.

Peer dependencies: `react` e `react-dom` 19, `@mantine/core` e `@mantine/hooks` 9,
`@phosphor-icons/react` 2.

```tsx
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@deckdoo/design/styles.css"; // tokens + peças, uma vez, depois do Mantine
import { DesignProvider, buildTheme } from "@deckdoo/design";

const theme = buildTheme(); // limão, controles em pílula

<MantineProvider theme={theme}>
  <DesignProvider>{/* opcional: sem ele, a marca é a do DeckDoo */}
    <App />
  </DesignProvider>
</MantineProvider>;
```

As fontes ficam com o app: Figtree e Geist Mono pelo `index.html` (Google Fonts). O pacote não
injeta fonte.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

## O que é de cada app

Tudo é igual em todos os apps, menos duas coisas.

### Acento

```ts
buildTheme({ accent: "cyan" });     // um nome da paleta (BRAND)
buildTheme({ accent: "#00c3ff" });  // ou qualquer hex
```

O acento vira a cor primária do Mantine (`accent`, dez tons, com o original no 6) e o
`--dd-accent`. A tinta sobre ele (`--dd-on-accent`) sai do contraste: escura num acento claro,
clara num escuro. O `AppIcon` usa o acento de fundo.

`--dd-ok` **não** segue o acento: é o estado "ok", limão em todos os apps.

### Marca

```tsx
import type { Brand } from "@deckdoo/design";
import type_ from "./brand/pages-logotype.svg";
import mark from "./brand/pages-mark.svg";
import markInverse from "./brand/pages-mark-inverse.svg";

const pagesBrand: Brand = {
  name: "Páginas",
  type: { light: { url: type_, ratio: 600 / 120 } },             // sem `dark`: o normal serve nos dois
  mark: {
    light: { url: mark, ratio: 1 },
    dark: { url: markInverse, ratio: 1 },                         // desenho próprio para fundo escuro
  },
};

<DesignProvider brand={pagesBrand}>…</DesignProvider>;
```

`ratio` é largura / altura do SVG (o `viewBox`). O SVG vira máscara sobre a cor do texto, então
só a forma conta: a cor do arquivo é ignorada.

### Favicon

```bash
pnpm exec deckdoo-favicon --bg "#00c3ff" --mark src/brand/pages-mark.svg --out public/favicon.svg
```

Quadrado 64×64 com canto 16 e o mascote com 36 de altura, centrado. Sem `--mark`, o mascote do
DeckDoo; sem `--bg`, limão; a tinta sai do contraste (ou `--ink`).

## O que tem

| Export | O que é |
| --- | --- |
| `buildTheme({ accent, corners })` | O tema Mantine: paleta, escalas, fonte, cantos, padrões dos componentes |
| `BRAND`, `INVERSE`, `accentHex` | A paleta, a cor `"inverse"` e o normalizador de acento |
| `DesignProvider`, `useBrand`, `DECKDOO_BRAND` | A marca do app |
| `Logo`, `AppIcon` | Logotipo / mascote; ícone de app |
| `Panel`, `Block`, `NavItem`, `PillTabs`, `Count` | Camadas e navegação |
| `Status`, `Stat`, `Steps`, `Dots` | Estado, número grande, etapas, medidor |
| `styles.css` | `--dd-*` claro e escuro, `.dd-root`, `.dd-nobreak`, `.dd-num` e as classes das peças (`.dd-panel`, `.dd-inverse`, `.dd-accent`, `.dd-table`, `.dd-rows`…) |

## Regras

- **Camadas:** fundo cinza (`--dd-canvas`) → painel branco (`--dd-surface`, canto 28) → bloco
  cinza dentro do painel (`--dd-sunken`, canto 20). Cor da paleta é destaque, nunca fundo de área
  grande.
- **Acento** só na ação principal da tela, no sucesso e na IA. Texto sobre o acento é a tinta que
  o contraste escolhe. Acento claro (limão) nunca é cor de texto sobre branco.
- **Invertido** (`color="inverse"`, `.dd-inverse`): tinta no claro, papel no escuro. É o botão
  forte que não é o acento, a pílula ativa e o cartão da IA.
- **Estados:** pílula com bolinha (`Status`): ok = limão, info = céu, atenção = laranja,
  erro = coral, neutro = cinza. O texto diz o estado; a cor só reforça.
- **Controles em pílula** (botão, campo, aba, badge); `buildTheme({ corners: "suave" })` troca
  para canto de 14.
- **Tipografia:** Figtree em tudo, inclusive números (com `.dd-num`, algarismos de largura
  fixa). Geist Mono é tempero, não regra: só onde a tela quer cara de terminal ou em ID e código
  de máquina.
- **Tema escuro:** a pessoa escolhe no menu do usuário; fica no `localStorage`. Toda tela tem que
  funcionar nos dois.
- **Ícones:** Phosphor (`@phosphor-icons/react`), traço regular a 16–18 px; preenchido só no
  ícone da IA e em "apresentar".
- **Marca:** `<Logo variant="type" | "mark" />` escolhe sozinha o desenho normal ou o inverso
  pelo fundo (tema escuro, `.dd-inverse`, `.dd-accent`). Sobre cor da paleta ou foto, diga o
  fundo com `on="dark" | "light"`.
- **Palavra não quebra:** sem hifenização nem corte de palavra (`.dd-root`); palavra composta
  vai num `.dd-nobreak`.

## Armadilhas

- **Máscara com data URI:** o SVG pode chegar como data URI (o pacote embute os seus; o Vite
  embute SVG pequeno). `url(${x})` sem aspas quebra: sempre `url("${x}")`.
- **Variante `light` do Mantine:** o texto padrão some no limão. O `variantColorResolver` do tema
  usa o tom 9 da cor (claro) ou o 3 (escuro) com `light-dark()`.
- **`color="inverse"`** não é cor do Mantine: Button, ActionIcon, Switch, Progress, Avatar e
  Tooltip leem os tokens `--dd-inverse*` pelo `vars` do tema. Componente novo que precise disso
  ganha o mesmo tratamento em `theme.ts`.
- **Troca normal/inverso do `Logo`** é CSS (`.dd-logo-switch`), com três regras de mesma
  especificidade em que vale a última. Mexer na ordem quebra o caso "invertido no tema escuro".

## Desenvolver

```bash
pnpm install
pnpm dev          # a cozinha, lendo src/ direto (sem build)
pnpm typecheck && pnpm lint && pnpm format:check
pnpm build        # dist/: index.js, index.d.ts, styles.css
```

A cozinha troca acento (da paleta ou hex), cantos, tema e marca (DeckDoo ou uma de exemplo, em
`playground/brands/`) na barra do topo.

### Publicar uma versão

```bash
pnpm release 0.2.0
```

Commita a versão na `main`, faz o build, cria a tag `v0.2.0` com o `dist/` (que não entra na
`main`) e empurra as duas. Depois, em cada app, troca o `#v…` da dependência quando quiser.

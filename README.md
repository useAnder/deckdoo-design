# @deckdoo/design

O padrão visual da suíte DeckDoo: tema Mantine, tokens CSS, peças e marca. Nasceu no app de
slides do DeckDoo e vale para todos os apps da suíte. A bancada para ver e testar tudo é a
**cozinha** (`pnpm dev`, em `http://localhost:48391`).

A personalidade, o mascote (DuDoo), o tom de voz e as regras de microtexto estão em
[docs/marca.md](docs/marca.md).

> **Uso interno.** O repositório é público só para os apps da suíte instalarem sem token (no CI
> e no build de imagem também). Não é um pacote de uso geral: a API muda conforme os apps
> precisam, não há suporte, e issues e PRs de fora não são acompanhados. A marca DeckDoo
> (logotipo e mascote) não está licenciada para uso fora da suíte.

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

As fontes ficam com o app: Figtree e Geist Mono. O pacote não injeta fonte. O caminho simples é
o Google Fonts no `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

**App com CSP** (`style-src`/`font-src 'self'`): o Google Fonts é bloqueado em produção — e só
em produção, porque o Vite de dev não manda CSP. Em vez de abrir a política, sirva as fontes
do próprio bundle, nos mesmos pesos:

```ts
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
```

O resto do pacote cabe numa CSP restrita, com duas condições: o `Logo` põe a máscara no atributo
`style` (`style-src-attr 'unsafe-inline'`, que o Mantine já exige) e o SVG pode chegar como data
URI (`img-src data:`).

## O que é de cada app

Tudo é igual em todos os apps, menos o acento, os cantos e a marca.

### Acento

```ts
buildTheme({ accent: "cyan" });     // um nome da paleta (BRAND)
buildTheme({ accent: "#00c3ff" });  // ou qualquer hex
```

O acento vira a cor primária do Mantine (`accent`, dez tons, com o original no 6) e o
`--dd-accent`. A tinta sobre ele (`--dd-on-accent`) sai do contraste: escura num acento claro,
clara num escuro. O `AppIcon` usa o acento de fundo.

`--dd-ok` **não** segue o acento: é o estado "ok", limão em todos os apps.

### Cantos

```ts
buildTheme({ corners: "sutil" });
```

| `corners` | Controle (botão, campo, aba) | Pílula (nav, `PillTabs`, badge, estado) | Painel / bloco / item |
| --- | --- | --- | --- |
| `pilula` (padrão) | pílula | pílula | 28 / 20 / 14 |
| `suave` | 14 | pílula | 28 / 20 / 14 |
| `sutil` | 8 | 8 | 16 / 12 / 8 |
| `reto` | 0 | 0 | 0 |

O jeito muda a escala de raio do Mantine (`xs`…`xl`) e os tokens `--dd-r-*` seguem por ela, então
as peças e o CSS do app acompanham sem fazer nada. Para um controle próprio, use
`radius="control"` (ou `"pill"`) num componente do Mantine, ou `var(--dd-r-control)` /
`var(--dd-r-pill)` no CSS.

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
| `Panel`, `Block`, `NavItem`, `PillTabs`, `Count` | Camadas e navegação (`NavItem` vira link com `component`; aba aceita `icon`) |
| `Status`, `Stat`, `Steps`, `Dots` | Estado, número grande, etapas, medidor |
| `DuDoo`, `ChatBubble`, `DuDooWall` | O assistente: rosto (com `mood`), fala do chat, papel de parede |
| `DuDooFace`, `DUDOO_MOODS`, `dudooExpression` | O mascote com expressão, para ilustração; o vocabulário; expressão sob medida |
| `sketch`, `sparkle`, `curl` | O rabisco: traço à mão em vetor, o brilho, o laço |
| `EmptyState`, `SceneEmpty`, `SceneNoResults`, `SceneAllClear`, `SceneLocked`, `SceneGenerating`, `SceneDone` | O estado vazio e as cenas prontas |
| `Scene`, `SceneLine`, `SceneCard`, `SceneDuDoo` | As peças para desenhar uma cena nova |
| `useDuDooMotion`, `DuDooMotion`, `usePrefersReducedMotion` | O DuDoo em movimento: a expressão quadro a quadro (hook e motor) |
| `DrawOn`, `drawOn`, `SceneDuDooFace` | A cena se desenhando, com o DuDoo pousando; o rosto que se mexe nas cenas |
| `DUDOO_INTENSITY`, `DUDOO_TIMING`, `DUDOO_REDUCED_TIMING` | A intensidade de cada expressão e o ritmo da troca |
| `styles.css` | `--dd-*` claro e escuro, `.dd-root`, `.dd-nobreak`, `.dd-num`, a moldura (`.dd-frame`…) e as classes das peças (`.dd-panel`, `.dd-inverse`, `.dd-accent`, `.dd-table`, `.dd-rows`…) |

### Moldura do app

```html
<div class="dd-root dd-frame">
  <aside class="dd-side dd-panel">
    <!-- logo, espaço de trabalho -->
    <div class="dd-eyebrow dd-side-label">Seção</div>
    <nav><!-- NavItem… --></nav>
    <div class="dd-side-foot"><!-- IA, usuário --></div>
  </aside>
  <main class="dd-main"><!-- painéis --></main>
</div>
```

Barra de 260 px presa à esquerda; abaixo de 48em ela vira o topo da página, na altura do
próprio conteúdo. Só o esqueleto: o cabeçalho da suíte (espaço de trabalho, usuário) ainda é de
cada app.

O `NavItem` é botão; para navegar de verdade, passe o link:

```tsx
<NavItem component={NavLink} to="/clientes" icon={<Users size={18} />} label="Clientes" />
<NavItem component="a" href="/ajuda" icon={<Question size={18} />} label="Ajuda" />
```

O `NavLink` do roteador marca `aria-current="page"`, e isso já acende o item: não precisa de
`active`.

### O DuDoo

```tsx
<DuDoo mood="pensando" />                          // o rosto, com expressão
<ChatBubble from="dudoo" mood="feliz">Pronto: 12 slides.</ChatBubble>
<DuDooFace size={76} mood="olhando" />             // o mascote solto, para ilustração
```

`mood` é uma das 12 expressões (`neutro` é o padrão) ou uma sob medida com
`dudooExpression({ look: [0.5, -0.5], both: { top: 0.2 } })`. As cores vêm do fundo, sozinhas.
Quando usar cada expressão: [docs/marca.md](docs/marca.md#o-dudoo-desenhado).

Em movimento, o hook devolve a expressão quadro a quadro: troca com o ritmo da intensidade, pisca
e tem a vida própria de cada mood.

```tsx
const face = useDuDooMotion(gerando ? "pensando" : "feliz");
<ChatBubble from="dudoo" mood={face}>…</ChatBubble>

// A fala antiga do chat: parada na expressão do que disse.
const antiga = useDuDooMotion("feliz", { blink: false, idle: false });
```

As regras de movimento: [docs/marca.md](docs/marca.md#movimento).

### Estado vazio e cenas

```tsx
<EmptyState
  art={<SceneEmpty object="arquivo" />}
  title="Nenhum arquivo ainda"
  action={<Button>Enviar arquivo</Button>}
>
  Arraste um arquivo para cá ou escolha do computador.
</EmptyState>
```

Para a cena se desenhar ao aparecer, `<DrawOn><SceneEmpty object="arquivo" /></DrawOn>`.

As cenas prontas, os objetos do `SceneEmpty`, a receita para desenhar uma nova, onde ela mora
(no app ou aqui) e a cena em movimento: [docs/ilustracao.md](docs/ilustracao.md).

### Tabela

`<table class="dd-table">` (ou `<Table className="dd-table" withRowBorders={false}>`) dentro de
um `.dd-table-wrap`, que rola de lado em vez da página. A linha só ganha cursor de clique com
`data-clickable` — use quando a linha inteira abre algo; se o alvo é um link na célula, não
marque. `Badge` em célula não corta o rótulo.

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
- **Ação destrutiva em texto** ("Remover"): `c="var(--dd-danger-text)"`. O coral da paleta
  (`--dd-danger`) é fundo, não texto: sobre branco não passa de 3:1.
- **Controles em pílula** (botão, campo, aba, badge); `buildTheme({ corners })` troca para
  `suave`, `sutil` ou `reto` (ver [Cantos](#cantos)).
- **Abas (`PillTabs`)** são brancas sobre o fundo e cinza sobre painel, Card ou Modal; dentro de
  um bloco, brancas de novo.
- **Tipografia:** Figtree em tudo, inclusive números (com `.dd-num`, algarismos de largura
  fixa). Geist Mono é tempero, não regra: só onde a tela quer cara de terminal ou em ID e código
  de máquina.
- **Tema escuro:** a pessoa escolhe no menu do usuário; fica no `localStorage`. Toda tela tem que
  funcionar nos dois.
- **Ícones:** Phosphor (`@phosphor-icons/react`), traço regular a 16–18 px; preenchido só no
  brilho (`Sparkle`) das ações de IA e em "apresentar".
- **DuDoo, o assistente:** o brilho é o botão ("Gerar com IA"), reconhecido na hora; o rosto
  de quem fala é o DuDoo (`<DuDoo mood="pensando" />`), igual em todos os apps: limão com o
  mascote marinho no fundo claro, marinho com o mascote limão no escuro. O chat é `ChatBubble`
  (com `mood`) sobre `DuDooWall`. Expressões, cores, ilustração e voz em
  [docs/marca.md](docs/marca.md); a bancada é o ateliê (`/dudoo.html` na cozinha).
- **Movimento:** segue a intensidade da voz (Trabalho rápido, Festa com mola, Sério parado). Só
  os olhos do DuDoo mexem; a cena se desenha uma vez e para; com movimento reduzido, reduz sem
  congelar. Regras em [docs/marca.md](docs/marca.md#movimento).
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
- **Canto de campo é por componente:** o Mantine não herda o raio do `TextInput` para os
  outros campos. Cada campo de uma linha (senha, número, seleção, etiquetas, arquivo…) está
  listado em `theme.ts`; o que faltar ali sai com canto 14 ao lado de um campo em pílula.
- **Fundo do que flutua no escuro:** o Mantine pinta Paper e Modal com `--mantine-color-body` e
  Card e Popover/Menu com `dark.6`, tons acima do painel. O `tokens.css` põe os dois no
  `--dd-surface`; por isso o `styles.css` vem depois do CSS do Mantine.
- **Troca normal/inverso do `Logo`** é CSS (`.dd-logo-switch`), com três regras de mesma
  especificidade em que vale a última. Mexer na ordem quebra o caso "invertido no tema escuro".

## Desenvolver

```bash
pnpm install
pnpm dev          # a cozinha, lendo src/ direto (sem build)
pnpm typecheck && pnpm lint && pnpm format:check
pnpm build        # dist/: index.js, index.d.ts, styles.css
```

O ateliê do DuDoo (`/dudoo.html`, link na barra da cozinha) é a bancada do mascote: anatomia,
laboratório de expressão, o vocabulário, o chat e as cenas em rabisco.

A cozinha troca acento (da paleta ou hex), cantos, tema e marca (DeckDoo ou uma de exemplo, em
`playground/brands/`) na barra do topo.

### Publicar uma versão

```bash
pnpm release 0.2.0
```

Commita a versão na `main`, faz o build, cria a tag `v0.2.0` com o `dist/` (que não entra na
`main`) e empurra as duas. Depois, em cada app, troca o `#v…` da dependência quando quiser.

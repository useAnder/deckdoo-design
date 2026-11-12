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

Ao subir a versão, leia os [avisos aos apps](docs/avisos.md): o que mudou e pede um olhar de
quem usa (uma regra de movimento nova, um campo que mudou de sentido).

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

### Nome do app na marca

Cada app da suíte assina com o mascote e o próprio nome. Diga qual é o app no `DesignProvider`,
e todo `<Logo />` (o da `SideBar`, o do `SuiteHeader`, o das telas de status) vira o lockup:

```tsx
import { DesignProvider, LOCKUP_SLIDES } from "@deckdoo/design";

<DesignProvider app={LOCKUP_SLIDES}>…</DesignProvider>;

<Logo height={26} />                              // compact: mascote + "Slides"
<Logo variant="stacked" height={48} />            // + "DeckDoo" embaixo
<Logo variant="inline" height={24} />             // logotipo DeckDoo + "Slides"
<Logo variant="text-stacked" height={48} />       // sem o mascote
<Logo variant="type" />                           // o logotipo DeckDoo, como antes
<Logo app={LOCKUP_WORKS} variant="inline" />      // outro app, só aqui
```

- **`height` é a altura do mascote** em todas as versões; o nome e o "DeckDoo" se medem por ela.
- **O peso acompanha o tamanho:** Figtree 300 no grande, engrossando até 400 abaixo de 56px. O
  `Logo` sabe a altura em que está, então escolhe sozinho.
- **`LOCKUP_*` traz o nome em contorno** (Slides, Works, Marketing, Sites, Pages, Commerce),
  igual em qualquer lugar e sem depender da fonte. Cada app importa só o seu; os outros ficam
  fora do bundle. Um nome fora da lista (`app="Websites"`) também funciona, escrito com a fonte
  da página, até ganhar o contorno.
- **As medidas** (tamanhos, espaços em pupilas, recorte) estão em `LOCKUP_SPEC`
  (`src/lockup-spec.ts`), decididas na bancada da marca (`/marca.html` na cozinha).
- **Com outra marca** no `DesignProvider` (`brand`), o lockup não se aplica: vale o logotipo
  dela.

App novo na suíte: ponha o nome na lista de `scripts/lockup.mjs` e rode `pnpm lockup`. O
`LOCKUP_NOVO` sai em `src/lockup-names.ts`, que o pacote já exporta inteiro. Mudou o
`LOCKUP_SPEC` (peso, espaço entre letras): rode de novo, que os contornos dependem dele.

### Marca de outro cliente

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
| `DesignProvider`, `useBrand`, `DECKDOO_BRAND` | A marca do app (e, com `app`, o nome dele no `Logo`) |
| `LOCKUP_SLIDES`, `LOCKUP_WORKS`…, `LOCKUP_SPEC`, `lockupLayout`, `lockupWeight`, `DECKDOO_WORD` | O nome de cada app em contorno; as medidas do lockup e a conta que as aplica; o "DeckDoo" desenhado |
| `Logo`, `AppIcon` | Logotipo / mascote; ícone de app |
| `Panel`, `Block`, `NavItem`, `PillTabs`, `Count` | Camadas e navegação (`NavItem` vira link com `component`; aba aceita `icon`) |
| `Status`, `Stat`, `Steps`, `Dots` | Estado, número grande, etapas, medidor |
| `DuDoo`, `ChatBubble`, `DuDooWall` | O assistente: rosto (com `mood`), fala do chat, papel de parede |
| `DuDooFace`, `DUDOO_MOODS`, `dudooExpression` | O mascote com expressão, para ilustração; o vocabulário; expressão sob medida |
| `sketch`, `sparkle`, `curl` | O rabisco: traço à mão em vetor, o brilho, o laço |
| `EmptyState`, `SceneEmpty`, `SceneNoResults`, `SceneAllClear`, `SceneLocked`, `SceneGenerating`, `SceneDone` | O estado vazio e as cenas prontas (todas aceitam `label`, o texto para leitor de tela) |
| `Scene`, `SceneLine`, `SceneCard`, `SceneDuDoo` | As peças para desenhar uma cena nova |
| `SideBar`, `NavSection`, `NavGroup`, `SideTip`, `useSideCollapsed` | A barra lateral pronta (topo e pé presos, recolher com `[`); o grupo com rótulo; o grupo que abre e fecha; a dica da barra recolhida; se ela está recolhida |
| `SideScroll`, `useScrollFade` | O miolo da barra lateral que rola entre o topo e o pé presos; o esmaecido nas bordas de qualquer área que rola |
| `FilterBar`, `FilterChip`, `FilterMenu`, `periodLabel`, `periodShortcuts`, `monthPeriod`, `yearPeriod` | Os filtros em linha: a barra, o chip, o chip com o menu das escolhas; o texto e os atalhos do período |
| `useWait`, `WAIT_DELAY`, `Skeleton`, `TopProgress` | A espera: o esqueleto que só aparece se demora, o traço dele e o fio no topo da página |
| `SideRail`, `SidePanel`, `RailButton`, `requestPanel`, `usePanelRequests`, `useDrawerFloats`, `DRAWER_FLOAT_BELOW` | As gavetas: a barra de ícones na borda direita e a gaveta aberta ao lado; o botão do pé da barra; o pedido de abrir uma de fora; quando a gaveta flutua |
| `DuDooSays`, `YouSay`, `Typing`, `SystemNotice`, `useReadThenThink`, `replyMood`, `ChatEnterScope`, `Enter`, `READING` | As falas do chat: a do DuDoo com a expressão do que diz, a sua, a espera, o aviso do sistema, o olhar antes de pensar e a entrada subindo |
| `StatusScreen`, `AccessDenied`, `AppList`, `ACCESS_DENIAL_TEXT` | A moldura das telas de status; a negação de acesso por código; a lista de apps da pessoa; os textos de cada código |
| `SuiteHeader`, `AppSwitcher`, `UserMenu`, `AppearanceControl`, `SUITE_HEADER_HEIGHT`, `initials` | O cabeçalho dos apps de editor; o menu de trocar de app; o menu da pessoa (com a aparência dentro); o seletor claro / escuro |
| `useColorSchemePreference`, `matchLocale`, `pickLocale`, `useRefreshOnReturn` | As preferências que o control plane guarda: aplicar o tema, casar o idioma com a lista do app, reler ao voltar para a aba |
| `useDuDooMotion`, `DuDooMotion`, `usePrefersReducedMotion` | O DuDoo em movimento: a expressão quadro a quadro (hook e motor) |
| `DrawOn`, `drawOn`, `SceneDuDooFace` | A cena se desenhando, com o DuDoo pousando; o rosto que se mexe nas cenas |
| `DUDOO_INTENSITY`, `DUDOO_TIMING`, `DUDOO_REDUCED_TIMING` | A intensidade de cada expressão e o ritmo da troca |
| `styles.css` | `--dd-*` claro e escuro, `.dd-root`, `.dd-nobreak`, `.dd-num`, a moldura (`.dd-frame`…) e as classes das peças (`.dd-panel`, `.dd-inverse`, `.dd-accent`, `.dd-table`, `.dd-rows`…) |

### Moldura do app

A barra pronta é a `SideBar`, dentro da `.dd-frame`:

```tsx
<div className="dd-root dd-frame">
  <SideBar
    brand={<Logo height={26} />}
    brandCollapsed={<AppIcon size={30} />}
    top={<EspacoDeTrabalho />}
    foot={<PeDaBarra />}
  >
    <NavSection label="Decks">
      <NavItem component={NavLink} to="/" icon={<House size={18} />} label="Início" />
      <NavGroup icon={<Folder size={18} />} label="Pastas" active={naPasta}>
        <NavItem component={NavLink} to="/pastas/vendas" icon={<Folder size={18} />} label="Vendas" />
      </NavGroup>
    </NavSection>
  </SideBar>
  <main className="dd-main">{/* painéis */}</main>
</div>
```

Barra de 260 px presa à esquerda. O topo (`brand`, `top`) e o pé (`foot`) ficam presos; só a
navegação rola, com a barra de rolagem fina e as bordas esmaecendo quando há o que rolar. Abaixo
de 48em ela vira o topo da página, na altura do próprio conteúdo.

**Recolher:** o botão ao lado do logo ou a tecla `[` (fora de campo de texto) deixam só a coluna
de ícones, de 76 px. Recolhida, o logo vira o `brandCollapsed` no mesmo ponto (com o link que
tiver), e o botão de abrir fica pequeno, de cantos redondos, preso na borda da barra na altura do
logo: sempre à vista, sem empilhar nada no topo, e os itens não descem. Ao abrir, o conteúdo já nasce na largura final e a
barra o revela, sem quebrar texto no caminho; a largura sai de `--dd-side-w` (a coluna da
`.dd-frame`, 260 px) menos `--dd-side-px` (o respiro lateral, 24 px). O app que mudar a coluna ou
o `padding` da barra muda as variáveis junto. O rótulo do item vira dica à direita, o rótulo da seção vira um fio, o contador
vira um ponto e o `NavGroup` abre os itens numa folha ao lado, ao passar o mouse. A escolha fica
no `localStorage` da pessoa; `collapsed`/`onCollapsedChange` controlam de fora e
`collapsible={false}` tira o botão. Abaixo de 48em não há recolhido. O que o app põe em `top` e
`foot` desenha a própria versão curta lendo `useSideCollapsed()` (só o avatar, só o ícone), e o
`SideTip` dá a dica que só aparece recolhida. Os textos para leitor de tela vão em `labels`.

Montada à mão, a barra ainda funciona: a `SideScroll` (ou a `div` abaixo) faz o miolo que rola,
e sem ela a barra inteira rola, como antes.

```html
<aside class="dd-side dd-panel">
  <!-- logo, espaço de trabalho: presos no topo -->
  <div class="dd-side-scroll dd-scroll-fade"><!-- só isto rola -->
    <div class="dd-eyebrow dd-side-label">Seção</div>
    <nav><!-- NavItem… --></nav>
  </div>
  <div class="dd-side-foot"><!-- IA, usuário: preso embaixo --></div>
</aside>
```

O cabeçalho dos apps de editor (menu de apps, marca, abas, pessoa) é o `SuiteHeader` (ver
[Cabeçalho da suíte e preferências](#cabeçalho-da-suíte-e-preferências)).

O `NavItem` é botão; para navegar de verdade, passe o link:

```tsx
<NavItem component={NavLink} to="/clientes" icon={<Users size={18} />} label="Clientes" />
<NavItem component="a" href="/ajuda" icon={<Question size={18} />} label="Ajuda" />
```

O `NavLink` do roteador marca `aria-current="page"`, e isso já acende o item: não precisa de
`active`.

### Filtros

Sempre em linha (`FilterBar` + chips), nunca um formulário de filtros. O `FilterMenu` é o chip e
o menu num só, controlado, em quatro tipos:

```tsx
<FilterBar end={<span className="dd-num">24 decks</span>}>
  <FilterMenu kind="single" label="Estado" options={ESTADOS} value={estado} onChange={setEstado} />
  <FilterMenu kind="multi" label="Pessoas" options={PESSOAS} value={pessoas} onChange={setPessoas} />
  <FilterMenu kind="period" label="Período" value={periodo} onChange={setPeriodo} />
  <FilterMenu kind="text" label="Título" value={texto} onChange={setTexto} />
</FilterBar>
```

`single` fecha ao escolher; `multi` fica aberto, com "Limpar" embaixo; `period` é de–até em
datas ISO, com os atalhos de `periodShortcuts()` (troque ou acrescente em `shortcuts`, com
`monthPeriod` e `yearPeriod`); `text` aplica no Enter. Acima de 8 opções a lista ganha a busca, e
`group` nas opções põe os títulos. O valor do chip é escrito pela peça (`periodLabel` para o
período); o × limpa. `onClose` avisa que o menu fechou; `disabled` trava o chip. Os textos estão em
`labels` (pt-BR por padrão; `labels.period` troca o texto do período). O `FilterChip` sozinho
serve de alvo de um `Menu` ou `Popover` seu.

### Espera

- **`useWait`:** o contêiner do esqueleto (`<div {...useWait()} role="status">`) fica invisível
  por `WAIT_DELAY` (200 ms) e então esmaece: a resposta rápida não pisca. A espera que entra no
  lugar de outra na mesma troca de tela herda o atraso, sem sumir e voltar.
- **`Skeleton`:** o traço (largura, altura, canto; `radius="50%"` para avatar), decorativo.
- **`TopProgress`:** o fio no topo da coluna do conteúdo (`.dd-main`), ligado a `active`. Aparece
  depois do mesmo atraso, fica pelo menos 400 ms, cresce sem prometer um fim e esmaece ao
  terminar. Ligue ao carregamento do roteador e às buscas sem dado ainda, não ao que atualiza em
  segundo plano.

### Gavetas

```tsx
const ITEMS: RailItem<"inserir" | "tema" | "historico">[] = [
  { key: "inserir", label: "Inserir", icon: <Plus size={20} /> },
  { key: "tema", label: "Tema", icon: <Palette size={20} /> },
  { key: "historico", label: "Histórico", icon: <ClockCounterClockwise size={20} />, off: "Salve o deck primeiro" },
];

type Gaveta = "inserir" | "tema" | "historico";
const GAVETAS: readonly Gaveta[] = ["inserir", "tema", "historico"];
const EVENTO = "meuapp:abrir-gaveta";

const [open, setOpen] = useState<Gaveta | null>(null);
usePanelRequests<Gaveta>(setOpen, EVENTO, GAVETAS); // só chaves da lista chegam, já tipadas

<div className="dd-bench" style={{ display: "flex" }}>
  <main style={{ flex: 1 }}>{/* o palco */}</main>
  {open && <SidePanel title="Tema" className="meuapp-gaveta" onClose={() => setOpen(null)}>…</SidePanel>}
  <SideRail
    items={ITEMS}
    open={open}
    onToggle={(k) => setOpen(open === k ? null : k)}
    footer={
      <Menu position="left-end">
        <Menu.Target>
          <RailButton icon={<Rows size={18} />} label="Layout" />
        </Menu.Target>
        <Menu.Dropdown>…</Menu.Dropdown>
      </Menu>
    }
  />
</div>;

requestPanel<Gaveta>("tema", EVENTO); // de quem não tem a barra
```

O app decide qual gaveta está aberta; a barra só mostra e avisa o clique. `off` apaga o ícone e
mostra o motivo numa dica; clicar na gaveta aberta fecha mesmo assim. O nome do evento é
parâmetro (o padrão é `dd:abrir-gaveta`): é o mesmo nos dois lados. `requestPanel<K>` e
`usePanelRequests<K>` amarram a chave às gavetas do app; com a lista `keys`, o que chega pelo
`window` e não é gaveta dali é ignorado. O pé da barra que não é gaveta (o seletor de layout)
vai num `RailButton`, que tem o desenho dos itens e serve de alvo de `Menu` e `Tooltip`.
`SidePanel` e `SideRail` aceitam `className`.

**Quando a gaveta flutua.** Sem palco para empurrar, ela flutua por cima dele, ao lado da barra.
Quem decide é a largura da **bancada**, não a da janela: ponha `dd-bench` na linha com o palco, a
gaveta e a barra (ela vira `position: relative` e contêiner de consulta, com a barra na borda
direita), e abaixo de 960 px dela (`DRAWER_FLOAT_BELOW`) a gaveta flutua. Assim a barra lateral
do app, que come o palco, já entra na conta. Sem `dd-bench`, vale a janela (62em), como antes; o
pai da gaveta precisa ser `position: relative`. Para outro ponto, ou para o app saber se ela
flutua (abrir algo só onde ela encaixa), meça e passe o resultado:

```tsx
const [bench, setBench] = useState<HTMLDivElement | null>(null);
const floats = useDrawerFloats(bench, 1100); // padrão: DRAWER_FLOAT_BELOW

<div className="dd-bench" ref={setBench}>
  …
  <SidePanel floating={floats} …>…</SidePanel>
</div>;
```

`floating` passa por cima do CSS (`true` flutua, `false` encaixa).

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

O `object` diz o assunto também na espera e no marco: `<SceneGenerating object="site" />`
("Criando o site", no Pages), `<SceneGenerating object="calendario" />` ("Fazendo o
planejamento", no Marketing), `<SceneDone object="post" />`. Há objeto para cada app: `site`,
`post`, `carrossel`, `persona`, `voz`, `calendario`, `funil`, além dos de sempre.

As cenas prontas, os objetos do `SceneEmpty`, a receita para desenhar uma nova, onde ela mora
(no app ou aqui) e a cena em movimento: [docs/ilustracao.md](docs/ilustracao.md).

### Falas do chat

```tsx
<ChatEnterScope>
  <DuDooWall style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16 }}>
    {turns.map((t) => (
      <Enter key={t.id} still={t.saved}>
        {t.from === "you" ? (
          <YouSay>{t.text}</YouSay>
        ) : (
          <DuDooSays mood={replyMood(t.text)} live={t.id === lastId}>
            {t.text}
          </DuDooSays>
        )}
      </Enter>
    ))}
    {waiting && <Waiting />}
  </DuDooWall>
</ChatEnterScope>

// A espera: ele olha a sua fala e só então pensa.
function Waiting() {
  const mood = useReadThenThink();
  return (
    <DuDooSays mood={mood} live>
      <Typing />
    </DuDooSays>
  );
}
```

`live` é o rosto vivo: só a última fala do DuDoo. `Typing` e `SystemNotice` trazem
o texto para leitor de tela em português (`label`, `closeLabel`); `Typing label=""` quando
ao lado já há texto dizendo o mesmo. `SystemNotice` se centraliza com pai em coluna flex ou em
bloco. `replyMood(texto)` dá `curioso` se a resposta termina em "?" e `neutro` no resto.
Quem entra subindo é só a fala que chega com a conversa já aberta: `still` desliga.

### Acesso negado

```tsx
<StatusScreen>
  <AccessDenied
    code="NOT_ENTITLED"
    signedInAs={{ email: "ana@agencia.com", tenant: "Agência Flor" }}
    services={<AppList services={services} loading={isPending} error={isError} currentSlug="slides" />}
    actions={<Button onClick={signOut}>Sair</Button>}
    detail="NOT_ENTITLED"
  />
</StatusScreen>
```

O pacote só desenha: quem busca a identidade e `GET /api/me/services` (`SuiteService[]`), e
quem faz o Tentar de novo e o Sair, é o app. `code` é um `AccessDenialCode`
(`NOT_ENTITLED`, `NO_TENANT`, `TENANT_SUSPENDED`, `AMBIGUOUS_TENANT`, `MALFORMED`,
`UNAVAILABLE`, `UNKNOWN`) e escolhe o texto de `ACCESS_DENIAL_TEXT`; `title` e `body`
sobrescrevem. O cadeado aparece nas negações, não em `UNAVAILABLE` e `UNKNOWN`. O `body` de
`NOT_ENTITLED` aponta para a lista "abaixo"; cada código tem também o `short`, que se sustenta
sozinho, para o alerta curto (a negação no meio de uma tela, sem `AppList`). O `AccessDenied` usa
o `short` quando não recebe `services`. Os rótulos de `AppList` e `AccessDenied` (`labels`) têm
padrão em português.

Dentro do `AppShell`, abaixo do `SuiteHeader`, use `<StatusScreen inShell>`: ocupa só a altura
que sobra (`100dvh` menos `--app-shell-header-height`), fica sem a marca (o cabeçalho já a mostra)
e vira `div` (o `AppShell.Main` já é o `main`). Fora dele, `brand={null}` ou `brand={false}` tiram
a marca.

### Sessão que cai com a tela aberta

A sessão central acaba com o app aberto (troca de senha ou saída em outro navegador): em vez de um
aviso em cada painel e de um link que leva ao login na mesma aba (perdendo a tela), um modal por
cima de tudo, e o login numa janela à parte. É a regra do contrato do Hub (§2, "A sessão que cai
com a tela aberta"); o Pages foi o primeiro.

```tsx
// 1. o cliente da API: toda resposta passa por aqui
const res = await fetch(path, init);
watchSession(res); // 2xx: a sessão existe; 401 depois disso: abre o modal

// 2. o layout (uma vez, dentro do MantineProvider)
<SessionExpiredModal
  loginHref={(next) => `/auth/login?next=${encodeURIComponent(next)}`}
  checkSession={() => api.getPrincipal({ fresh: true })} // resolve = a sessão voltou
  onResumed={() => void queryClient.invalidateQueries()}
/>

// 3. a rota de retorno, FORA do layout (sem cabeçalho nem leitura de principal)
{ path: SESSION_RESUMED_PATH, element: <StatusScreen><SessionResumed /></StatusScreen> }

// 4. o 401 do primeiro carregamento continua indo direto para o login
if (status === 401 && !sessionEstablished()) redirectToLogin();
```

- "Entrar de novo" abre `loginHref(SESSION_RESUMED_PATH)` numa janela pequena. O login de `id.`
  termina em `/sessao-retomada`, onde `SessionResumed` avisa a aba de origem (`BroadcastChannel`,
  não `window.opener`, que a passagem por `id.` pode cortar) e fecha a janela. O modal some e
  `onResumed` refaz as leituras, sem recarregar a página. Com a sessão central ainda aberta, a
  janela só pisca.
- Voltar para a aba roda `checkSession`: quem entrou por outra aba vê o modal fechar sozinho.
- Janela bloqueada pelo navegador: entra na própria aba, com `loginHref(<onde está>)`.
- O modal não fecha por fora (sem X, Esc nem clique no fundo). As ações que falharam com 401 não
  se repetem sozinhas; o aviso delas (o do app) diz para tentar de novo.
- O pacote não chama rede. `watchSession` aceita qualquer `{ status, ok }`; quem tem um `fetch`
  próprio fora do cliente (stream, download) chama `noteUnauthorized()` no 401. `useSessionLost()`
  diz se o modal está aberto, para o aviso em linha do app se calar atrás dele.
- O 401 só abre o modal depois de uma resposta boa nesta página (`noteSessionOk`, que o
  `watchSession` chama). Nos testes, `resetSessionState()` volta ao estado de página recém-aberta.
- Textos em português, que `labels` sobrescreve nas duas peças.

### Cabeçalho da suíte e preferências

```tsx
<AppShell header={{ height: SUITE_HEADER_HEIGHT }}>
  <AppShell.Header>
    <SuiteHeader
      start={<AppSwitcher services={services} loading={isPending} error={isError} currentSlug="slides" />}
      brand={
        <Link to="/" aria-label="DeckDoo, ir para o início">
          <Logo variant="type" height={24} />
        </Link>
      }
      tabs={<NavLink to="/" end className="dd-tab">Decks</NavLink>}
      end={
        <UserMenu
          name={principal?.user.name ?? null}
          accountUrl={accountUrl}
          appearance={{ value: colorScheme, onChange: changeAppearance }}
          onSignOut={signOut}
        />
      }
    />
  </AppShell.Header>
</AppShell>
```

Tema e idioma são preferências da **pessoa**, guardadas no control plane (`GET /api/me`:
`user.preferredColorScheme`, `"light" | "dark" | null`, e `user.preferredLocale`). Quem trocou o tema
num app já o encontra nos outros. O valor do control plane é a verdade; o `localStorage` do
Mantine é cache para a tela não piscar. O pacote não chama rede: dá as peças, e o app lê e grava
pelo servidor dele.

```tsx
// main.tsx: o cache pinta a primeira tela
<MantineProvider theme={theme} defaultColorScheme="light">

// no app
const { data: principal, refetch } = usePrincipal(); // o /api/me, lido pelo servidor do app
const { colorScheme, setColorScheme } = useMantineColorScheme();

useColorSchemePreference(principal?.user.preferredColorScheme); // undefined = ainda não respondeu
useRefreshOnReturn(() => void refetch()); // pega o que outro app gravou

function changeAppearance(next: AppearanceValue) {
  setColorScheme(next); // na hora
  void savePreference({ preferredColorScheme: next }); // pelo servidor do app
}
```

- `useColorSchemePreference(preferred)`: `undefined` (o control plane não respondeu, ou falhou) não
  mexe em nada e fica o tema aplicado; `null` ("nunca escolheu") é o **claro**, como manda o
  contrato do control plane: o tema do sistema não entra. Só aplica quando o valor **muda**, para
  não desfazer a troca que o app fez enquanto a gravação está no ar. Um `"auto"` que tenha ficado
  no cache vira claro na hora.
- O seletor (`AppearanceControl`, e o do `UserMenu`) tem só Claro e Escuro. `value` aceita o
  `colorScheme` do Mantine como vem (`"auto"` aparece como claro); `onChange` dá `"light"` ou
  `"dark"`, que é o que se grava.
- `useRefreshOnReturn(refresh, throttleMs = 5000)`: chama `refresh` ao voltar para a aba ou a
  janela, no máximo uma vez a cada `throttleMs`.
- `matchLocale(tags, supported)` e `pickLocale(preferred, supported, browserTags?)` escolhem o
  idioma da interface. Casam o tag inteiro e depois só o idioma, sem diferença de caixa
  (`pt-PT` cai em `pt-BR`, `en-US` em `en`): cortar no hífen não casa `pt` com `pt-BR`.
  `pickLocale` devolve `undefined` enquanto `preferred` é `undefined` (espere; o contrato manda
  esperar no idioma); com `null`, vale o navegador; com um idioma, vale ele se o app o tem.
- A gravação (`appearance.onChange`) é do app, pela rota de preferências do contrato.

O `AppSwitcher` e o `UserMenu` têm rótulos em português que `labels` sobrescreve. `UserMenu`
aceita itens do app como filhos (`Menu.Item`), `footer` (uma linha pequena, como a versão) e
`target` (o gatilho do app no lugar da pílula, com `position` para dizer onde o menu abre).

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
- **Tema escuro:** é preferência da pessoa e vale para a suíte inteira: o valor que o control plane
  guarda manda, e o `localStorage` do Mantine é só cache para a tela não piscar. Nenhum app tem
  tema só dele (ver [Cabeçalho da suíte e preferências](#cabeçalho-da-suíte-e-preferências)). Toda
  tela tem que funcionar nos dois.
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
  pelo fundo (tema escuro, `.dd-inverse`, acento escuro). Sobre cor da paleta ou foto, diga o
  fundo com `on="dark" | "light"`. O mascote segue a tinta: tinta clara leva o desenho inverso,
  e a pupila nunca sai branca. Com `app`, o `Logo` é o lockup do app ("Nome do app na marca").
- **Palavra não quebra:** sem hifenização nem corte de palavra (`.dd-root`); palavra composta
  vai num `.dd-nobreak`.

## Armadilhas

- **Máscara com data URI:** o SVG pode chegar como data URI (o pacote embute os seus; o Vite
  embute SVG pequeno). `url(${x})` sem aspas quebra: sempre `url("${x}")`.
- **Variante `light` do Mantine:** o texto padrão some no limão. O `variantColorResolver` do tema
  usa o tom 9 da cor (claro) ou o 3 (escuro) com `light-dark()`.
- **`color="inverse"`** não é cor do Mantine: Button, ActionIcon, Switch, Avatar e Tooltip leem
  os tokens `--dd-inverse*` pelo `vars` do tema. Componente novo que precise disso ganha o mesmo
  tratamento em `theme.ts`. O `Progress` é a exceção: a barra grava a cor no estilo inline, fora
  do alcance do tema, e quem pinta é uma regra em `design.css` que casa esse estilo.
- **Canto de campo é por componente:** o Mantine não herda o raio do `TextInput` para os
  outros campos. Cada campo de uma linha (senha, número, seleção, etiquetas, arquivo…) está
  listado em `theme.ts`; o que faltar ali sai com canto 14 ao lado de um campo em pílula.
- **Fundo do que flutua no escuro:** o Mantine pinta Paper e Modal com `--mantine-color-body` e
  Card e Popover/Menu com `dark.6`, tons acima do painel. O `tokens.css` põe os dois no
  `--dd-surface`; por isso o `styles.css` vem depois do CSS do Mantine.
- **Troca normal/inverso do `Logo`** é CSS (`.dd-logo-switch`), com três regras de mesma
  especificidade em que vale a última. Mexer na ordem quebra o caso "invertido no tema escuro".
  O acento escuro é uma quarta regra, mais específica, que lê o `data-accent-ink` que o `Logo`
  põe (a tinta do acento sai do contraste, em JS, como no `AppIcon`).

## Desenvolver

Node 24 ou mais novo: o `pnpm lockup` lê `src/lockup-spec.ts` direto, com o TypeScript que o Node
roda sem build.

```bash
pnpm install
pnpm dev          # a cozinha, lendo src/ direto (sem build)
pnpm typecheck && pnpm lint && pnpm format:check
pnpm build        # dist/: index.js, index.d.ts, styles.css
pnpm lockup       # refaz o nome de cada app em contorno (src/lockup-names.ts)
```

O ateliê do DuDoo (`/dudoo.html`, link na barra da cozinha) é a bancada do mascote: anatomia,
laboratório de expressão, o vocabulário, o chat e as cenas em rabisco. A bancada da marca
(`/marca.html`) é a do lockup de cada app: versões, segmentos, pesos, espaços, o SVG para baixar
e, no fim, o `Logo` do pacote, com o aviso de quando os ajustes da barra saíram do `LOCKUP_SPEC`.

A cozinha troca acento (da paleta ou hex), cantos, tema e marca (DeckDoo ou uma de exemplo, em
`playground/brands/`) na barra do topo.

### Publicar uma versão

```bash
pnpm release 0.2.0
```

Commita a versão na `main`, faz o build, cria a tag `v0.2.0` com o `dist/` (que não entra na
`main`) e empurra as duas. Depois, em cada app, troca o `#v…` da dependência quando quiser.

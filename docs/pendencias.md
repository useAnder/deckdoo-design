# Pendências

Coisas anotadas para ver depois, fora do trabalho em andamento.

## Subir a barra de gavetas para o pacote (SideRail / SidePanel)

- **Origem:** pedido do Marketing, anotado em 2026-10-04.
- **Pedido:** a barra de gavetas agora existe no Slides e no Marketing, com o mesmo desenho. Pela regra da cozinha, ela deveria subir para o `@deckdoo/design` como `SideRail` / `SidePanel`.
- **Estado:** feito em 2026-11-03 (v0.10.0).
- **Próximo passo:** comparar as duas implementações (Slides e Marketing), extrair o desenho comum para o pacote e só então trocar os apps para consumi-lo.

## `Progress` com `color="inverse"` sai vazio

- **Origem:** Marketing, 2026-10-04 (fase 3, tela da Marca).
- **Pedido:** com `color="inverse"`, o Mantine grava a palavra `inverse` no estilo inline da barra, e ela vence a variável do tema: a barra fica vazia. O Marketing usa `color="var(--dd-inverse)"` enquanto isso.
- **Estado:** feito em 2026-11-03 (v0.10.0).

## `label` em todas as cenas

- **Origem:** Marketing, 2026-10-04 (acesso negado e cenas de espera).
- **Pedido:** só o `SceneEmpty` aceita `label`. `SceneLocked`, `SceneGenerating`, `SceneDone`, `SceneNoResults` e `SceneAllClear` têm o rótulo fixo em português, e um app com catálogo em inglês não consegue traduzir. O Marketing pôs o `SceneLocked` num wrapper `aria-hidden`.
- **Estado:** feito em 2026-11-03 (v0.10.0).

## `null` do tema: o contrato diz claro, o pacote diz sistema

- **Origem:** Slides, 2026-11-03 (adoção da v0.10.0).
- **Pedido:** o contrato do control plane (`EloquentCore/docs/contrato-app-externo.md`, "O `preferredColorScheme` e o clarão") diz que `null` é "nunca escolheu" e que quem nunca escolheu vê o **claro** ("o tema do sistema não entra"; com o Mantine, `defaultColorScheme="light"`). O `useColorSchemePreference` aplica `null` como `"auto"` (sistema), o README manda `defaultColorScheme="auto"`, e o `UserMenu` oferece "Sistema", que grava `null`. Os apps seguem o pacote; um dos dois documentos precisa mudar para os apps não divergirem.
- **Estado:** feito em 2026-11-03 (v0.11.0). Vale o contrato (o hub já tinha mudado, na 0.3.48 do EloquentCore): `useColorSchemePreference` aplica `null` como claro, e um `"auto"` que tenha ficado no cache vira claro; o seletor (`AppearanceControl` e o do `UserMenu`) tem só Claro e Escuro; o README manda `defaultColorScheme="light"`.
- **Para os apps:** quebra de tipo de propósito. `AppearanceValue` agora é `"light" | "dark"`: o `next === "auto" ? null : next` da gravação vira só `next` (o compilador aponta onde), e `labels.auto` saiu. No `main.tsx`, `defaultColorScheme="light"`. O `value` ainda aceita o `colorScheme` do Mantine como vem.

## `StatusScreen` dentro do `AppShell`

- **Origem:** Slides, 2026-11-03 (acesso negado dentro do cabeçalho da suíte).
- **Pedido:** a `StatusScreen` tem `min-height: 100vh`, e dentro do `AppShell` (abaixo do `SuiteHeader`) a página rola a altura do cabeçalho. O Slides envolve num `.access-screen` que troca a altura para `calc(100dvh - var(--app-shell-header-height))`. Também não há jeito declarado de tirar a marca de cima (o cabeçalho já a mostra): `brand={null}` cai no `Logo` pelo `??`, e só `brand={false}` some. Sugestão: uma prop (`inShell`, ou `className` + `brand={false}` documentado).
- **Estado:** feito em 2026-11-03 (v0.11.0). `<StatusScreen inShell>`: altura `calc(100dvh - var(--app-shell-header-height))`, sem marca e como `div` (o `AppShell.Main` já é o `main`); `brand` e `component` ainda mandam. `brand={null}` agora tira a marca, como `false`. Ganhou `className`.
- **Para o Slides:** o `.access-screen` e o `brand={false}` saem; `component="div"` também.

## Texto do `NOT_ENTITLED` sem a lista

- **Origem:** Slides, 2026-11-03 (`ApiErrorNotice`).
- **Pedido:** o `ACCESS_DENIAL_TEXT.NOT_ENTITLED.body` aponta para os apps "abaixo", e um alerta curto (a negação que chega no meio de uma tela, sem a `AppList`) não tem lista. O Slides mantém um texto próprio sem essa parte. Sugestão: um `bodyWithoutList` (ou `short`) no mesmo registro.
- **Estado:** feito em 2026-11-03 (v0.11.0). Todo código de `ACCESS_DENIAL_TEXT` tem `short` (tipo `AccessDenialText`), igual ao `body` menos no `NOT_ENTITLED`, onde não fala da lista. O `AccessDenied` usa o `short` sozinho quando não recebe `services`.
- **Para o Slides:** o `INLINE_BODY` do `ApiErrorNotice` vira `ACCESS_DENIAL_TEXT[code].short`.

## Gavetas: chave tipada e item de pé da barra

- **Origem:** Slides, 2026-11-03 (`studio/SidePanels.tsx`).
- **Pedido:** `requestPanel` e `usePanelRequests` falam `string`, então o app embrulha os dois para amarrar às chaves dele (o `SideRail` já é genérico em `K`). E o pé da barra (o seletor de layout do Slides, um `Menu`) não tem peça: o app repete o botão com as classes `dd-rail-item`/`dd-rail-icon`/`dd-rail-label`. Sugestão: `requestPanel<K>`/`usePanelRequests<K>` genéricos e um `RailButton` exportado.
- **Estado:** feito em 2026-11-03 (v0.11.0). `requestPanel<K>` e `usePanelRequests<K>(open, event, keys?)`: com `keys`, só as chaves da lista chegam a `open`, já como `K` (o `isPanelKey` do Slides fica no pacote). `RailButton` exportado (ícone, rótulo, `active`; repassa `ref`, então serve de alvo de `Menu.Target`); o `SideRail` usa ele por dentro.
- **Para o Slides:** os dois embrulhos de `SidePanels.tsx` podem sair (ou ficar finos, só para fixar o evento), e o `LayoutSwitch` troca o `UnstyledButton` com as classes por `<RailButton icon={…} label="Layout" aria-label="Layout da tela" />`.

## `SystemNotice` fora de coluna flex

- **Origem:** Marketing, 2026-11-03 (adoção da v0.10.0, conversa do Assistente).
- **Pedido:** o `.dd-chat-notice` só se centraliza com `align-self: center`, isto é, quando o pai é uma coluna flex. Na conversa do Assistente o aviso fica numa coluna em bloco (`max-width: 760px; margin-inline: auto`) e no compositor, e lá ele ocupava a largura toda. O Marketing pôs `width: fit-content; margin-inline: auto` por cima, nos dois lugares. Sugestão: o pacote levar as duas linhas no `.dd-chat-notice`, que funcionam com pai flex ou em bloco.
- **Estado:** feito em 2026-11-03 (v0.11.0). O `.dd-chat-notice` leva `width: fit-content; margin-inline: auto`, além do `align-self: center`.
- **Para o Marketing:** as duas sobrescritas saem.

## Gaveta: quando flutuar depende do app, não da janela

- **Origem:** Marketing, 2026-11-03 (bancada do Estúdio).
- **Pedido:** a gaveta flutua abaixo de `62em` de janela, fixo no CSS. No Marketing a barra lateral do app (260px) come o palco, e entre 62em e 75em a gaveta encaixada espremeria a peça; o Marketing liga a flutuação em `75em` com `.elq-bench .dd-drawer` e repete o número num `matchMedia` (a gaveta de saída só abre onde encaixa). Sugestões: medir o contêiner e não a janela (container query no pai da barra), ou uma variável/prop para o ponto; e um `className` no `SidePanel`, porque hoje o ajuste de densidade do app (rótulos de campo, acordeão) tem de ir por seletor descendente.
- **Estado:** feito em 2026-11-03 (v0.11.0). A classe `dd-bench` na linha com o palco, a gaveta e a barra a torna contêiner (e `position: relative`), e a gaveta flutua abaixo de 960 px **dela** (`DRAWER_FLOAT_BELOW`, `60em` na container query), com a barra lateral do app já descontada. Sem `dd-bench`, vale a janela (62em), como antes. Para outro ponto, ou para o JS saber: `useDrawerFloats(bench, below?)` mede a bancada com `ResizeObserver`, e `SidePanel floating={…}` passa por cima do CSS. `SidePanel` e `SideRail` ganharam `className`.
- **Para o Marketing:** `dd-bench` na `.elq-bench` (que já é `position: relative`); a regra de `75em` e o `matchMedia` saem — `useDrawerFloats(bench)` diz se a gaveta de saída encaixa (ou `useDrawerFloats(bench, N)` + `floating`, se 960 px de bancada não servir). A densidade vai por `className` no `SidePanel`.

## `SuiteService.kind` mais estreito que o contrato

- **Origem:** Marketing, 2026-11-03 (`AppSwitcher` e `AppList`).
- **Pedido:** o contrato de `GET /api/me/services` manda `kind` como texto (o app valida `z.string()`), e o `SuiteService` do pacote aceita só `"app" | "external"`. O Marketing converte (o que não é `external` vira `app`) antes de passar a lista. Sugestão: `kind: "app" | "external" | (string & {})`, já que a peça só testa `=== "external"`.
- **Estado:** feito em 2026-11-03 (v0.11.0). `kind: "app" | "external" | (string & {})`: as peças só testam `=== "external"`.
- **Para o Marketing:** a conversão sai; a lista do `z.string()` passa direto.

## Sublinhado no link da marca do `SuiteHeader`

- **Origem:** Pages, 2026-11-04 (conferência no navegador).
- **Pedido:** `.dd-suite-brand a` não tira o `text-decoration` do link. Com só o logotipo (máscara) o
  sublinhado não aparece; com o nome do produto ao lado (o Pages põe "Pages"), aparece. O Pages
  contorna com `text-decoration: none` no próprio `BrandMark`.
- **Estado:** não iniciado.

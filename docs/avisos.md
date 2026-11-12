# Avisos aos apps

O que muda no pacote e pede um olhar de quem usa. O mais novo em cima. Ao subir a versão do
`@deckdoo/design` num app, leia o que entrou desde a versão que ele tinha.

O caminho de volta (o app pedindo algo ao pacote) é o [pendencias.md](pendencias.md).

## Trilho de apps e o ícone de cada app

- **Quando:** 2026-11-12, na v0.16.0.
- **O que entrou:** o `SuiteRail`, o trilho de apps na borda esquerda da janela (em volta da
  `.dd-frame`), e o `SuiteAppIcon`, o ícone de cada app da suíte (o objeto do app com os olhos
  do DuDoo), com os apps em `SUITE_APPS`. Nada mudou no que já existia: é peça nova.
- **Quem quer o trilho:** ponha o `SuiteRail` em volta da moldura, com os serviços da pessoa (a
  mesma lista do `AppSwitcher`) e o `slug` do app atual; troque a marca da `SideBar` pela
  empilhada (`<Logo variant="stacked" height={36} />`). O passo a passo está no
  [README](../README.md#trilho-de-apps). O `AppSwitcher` continua valendo no celular, onde o
  trilho não aparece.
- **Quem aponta para outro app** (uma lista de apps, um atalho): o ícone é o
  `<SuiteAppIcon app="slug" />`. O SVG e o PNG para fora do código (loja, favicon, divulgação)
  saem da bancada da marca (`/marca.html`).
- **Works e Commerce:** a cor do ícone é provisória (laranja e coral) até o app decidir o acento.

## A barra recolhida não empurra mais os itens

- **Quando:** 2026-11-12, na v0.15.0.
- **O que mudou:** recolhida, a `SideBar` não empilha mais o logo sobre o botão de abrir. O
  `brandCollapsed` fica no mesmo ponto do logo aberto, com a função de sempre (o link, se tiver),
  e o botão de abrir fica pequeno, de cantos redondos, preso na borda da barra, metade para fora,
  na altura do logo. Os itens não descem ao recolher. E ao abrir, o conteúdo já nasce na largura
  final e a barra o revela: os textos não quebram em três linhas enquanto a coluna cresce.
- **Quem usa a `SideBar` como vem:** nada a fazer. Recolhida, a barra deixa passar o que sai da
  borda (`overflow: visible`, `z-index: 2`), para o botão aparecer inteiro.
- **Quem muda a largura da coluna da barra ou o `padding` da `.dd-side`:** mude junto
  `--dd-side-w` (na `.dd-frame`, 260 px) e `--dd-side-px` (na `.dd-side`, 24 px), que dão a
  largura do conteúdo ao abrir.
- **Quem contava com a barra rolando inteira** dentro da `SideBar` (um `top` ou `foot` muito
  alto): agora ela corta o que passa, e só o miolo rola, como já era o desenho. Deixe o `top` e o
  `foot` curtos.

## O DuDoo chega primeiro nas cenas

- **Quando:** 2026-11-12, na v0.14.0.
- **O que mudou:** nas cenas que se desenham (`DrawOn`), o DuDoo agora **pousa primeiro**,
  olhando para onde o desenho vai nascer. O traço começa quando ele está quase no lugar, e a
  **cara da cena vem por último**, com o desenho assentado (a piscadinha do `SceneDone`, a
  empolgação do `SceneEmpty` com DuDoo). Na espera (`SceneGenerating`), a cara de `pensando`
  vem logo que ele pousa, porque o que se monta é ele pensando. Antes, ele pousava depois do
  brilho, a quase 2 s do começo: parecia atraso, e o slide da espera se montava antes de quem o
  monta chegar. A regra está em [marca.md](marca.md#o-rabisco-em-movimento) e
  [ilustracao.md](ilustracao.md#5-em-movimento).
- **Quem usa `<DrawOn>` com as cenas do pacote:** nada a fazer. A ordem nova vem com a versão, e a
  duração da cena fica quase a mesma.
- **Quem fez a própria animação do DuDoo numa cena** (um pouso à mão, um `animate` no rosto,
  uma cena do app com o `SceneDuDoo` animada sem o `DrawOn`, um vídeo ou apresentação com a
  cena se desenhando): siga a regra nova. Ele entra primeiro, neutro e olhando para o objeto, o
  desenho vem sob o olhar dele, e a expressão da cena e os risquinhos ficam para o fim. Na
  espera, a expressão vem logo depois do pouso.
- **Quem lia o `dudooAt` do `drawOn`** para sincronizar algo com a cara dele: o `dudooAt` ainda
  diz quando ele termina de pousar, mas agora isso é no começo. Para "quando ele reage", use o
  `reactAt`, novo no `DrawResult`. O `look` diz para onde ele olha enquanto o desenho nasce.
- **Texto que descreve a cena** (um "e o DuDoo chega no fim" num comentário, num doc ou numa
  bancada do app): vale atualizar também.

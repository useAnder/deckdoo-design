# Pendências

Coisas anotadas para ver depois, fora do trabalho em andamento.

## Subir a barra de gavetas para o pacote (SideRail / SidePanel)

- **Origem:** pedido do Marketing, anotado em 2026-10-04.
- **Pedido:** a barra de gavetas agora existe no Slides e no Marketing, com o mesmo desenho. Pela regra da cozinha, ela deveria subir para o `@deckdoo/design` como `SideRail` / `SidePanel`.
- **Estado:** feito em 2026-11-03 (próxima versão).
- **Próximo passo:** comparar as duas implementações (Slides e Marketing), extrair o desenho comum para o pacote e só então trocar os apps para consumi-lo.

## `Progress` com `color="inverse"` sai vazio

- **Origem:** Marketing, 2026-10-04 (fase 3, tela da Marca).
- **Pedido:** com `color="inverse"`, o Mantine grava a palavra `inverse` no estilo inline da barra, e ela vence a variável do tema: a barra fica vazia. O Marketing usa `color="var(--dd-inverse)"` enquanto isso.
- **Estado:** feito em 2026-11-03 (próxima versão).

## `label` em todas as cenas

- **Origem:** Marketing, 2026-10-04 (acesso negado e cenas de espera).
- **Pedido:** só o `SceneEmpty` aceita `label`. `SceneLocked`, `SceneGenerating`, `SceneDone`, `SceneNoResults` e `SceneAllClear` têm o rótulo fixo em português, e um app com catálogo em inglês não consegue traduzir. O Marketing pôs o `SceneLocked` num wrapper `aria-hidden`.
- **Estado:** feito em 2026-11-03 (próxima versão).

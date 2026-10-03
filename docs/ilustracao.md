# Ilustração: estado vazio, espera e marco

Como pôr uma cena numa tela de qualquer app da suíte: primeiro a pronta, depois a receita para
desenhar uma nova. As regras de marca (o DuDoo, as cores, o rabisco) estão em
[marca.md](marca.md); aqui fica o como. A bancada para ver tudo nos dois temas é o ateliê
(`pnpm dev` → `/dudoo.html`).

## 1. Precisa de cena?

Quase nunca é a primeira opção. Uma cena cabe em três momentos:

| Momento                                    | Intensidade | DuDoo                                   |
| ------------------------------------------ | ----------- | --------------------------------------- |
| Estado vazio (nada aqui ainda, sem resultado) | Trabalho | Só se a ação da tela for dele ("Gerar com IA") |
| Espera de uma ação dele (gerando)          | Trabalho    | Sim                                     |
| Marco (primeiro deck, pronto)              | Festa       | Sim                                     |
| Erro, cobrança, permissão, exclusão        | Sério       | Nunca; só `SceneLocked` ou nada         |

Se o avatar do DuDoo já está na tela (o chat ao lado), a cena vai sem ele. Uma aparição por
tela.

## 2. Use a pronta

```tsx
import { Button } from "@mantine/core";
import { EmptyState, SceneEmpty } from "@deckdoo/design";

<EmptyState
  art={<SceneEmpty object="arquivo" />}
  title="Nenhum arquivo ainda"
  action={<Button>Enviar arquivo</Button>}
>
  Arraste um arquivo para cá ou escolha do computador.
</EmptyState>;
```

O `EmptyState` centra a cena (até 280 px), o título, o texto e a ação. O texto segue a voz: o que
está acontecendo e o que fazer, sem "Ops!".

| Cena                 | Para                                         | DuDoo                     |
| -------------------- | -------------------------------------------- | ------------------------- |
| `<SceneEmpty />`     | Nada aqui ainda; `object` diz o que falta    | Com `dudoo`, olhando para o objeto |
| `<SceneNoResults />` | Busca ou filtro sem resultado                | Não                       |
| `<SceneAllClear />`  | Lista em dia, nenhuma pendência              | Não                       |
| `<SceneLocked />`    | Sem acesso (Sério: sem cor, sem brilho)      | Não                       |
| `<SceneGenerating />`| Esperando o DuDoo gerar                      | Pensando                  |
| `<SceneDone />`      | Pronto, marco alcançado                      | Piscando                  |

Os objetos do `SceneEmpty`: `slide`, `arquivo`, `pasta`, `lista` (clientes, pedidos, pessoas),
`grafico` (relatório, painel) e `mensagem` (conversa, comentário).

A mancha de cor é o acento do app. Para a cor do assunto, `color`:
`<SceneNoResults color={BRAND.cyan} />`. Uma cor da paleta por cena.

## 3. Desenhe uma nova

Quando nenhuma pronta serve. Uma cena é um SVG de 260 × 190 feito com as peças do pacote:

```tsx
import { BRAND, Scene, SceneCard, SceneDuDoo, SceneLine, curl, sparkle } from "@deckdoo/design";

/** Nenhum pedido ainda: a caixa fechada, esperando o primeiro. */
export function SceneNoOrders() {
  return (
    <Scene label="Uma caixa fechada" seed={5}>
      {(s) => (
        <>
          {/* 1. A mancha, deslocada do traço, por baixo de tudo. */}
          <path d={s.blob(92, 70, 96, 70)} fill="var(--dd-accent)" />
          {/* 2. O objeto, com fundo de painel (o SceneCard já tem). */}
          <SceneCard s={s} x={82} y={60} w={96} h={70} rot={-4}>
            <SceneLine d={s.line([130, 60], [130, 130])} width={2} />
          </SceneCard>
          {/* 3. Os enfeites: brilho, laço, ênfase. Poucos. */}
          <path d={sparkle(196, 50, 9)} fill="var(--dd-ink)" />
          <SceneLine d={curl(40, 150, 2, 0.9)} />
          <SceneLine d={s.ticks(184, 128, 20, 6, 8, 30)} />
        </>
      )}
    </Scene>
  );
}
```

O lápis (`s`, de `sketch(seed)`) devolve o `d` de cada traço; tudo sai curvo, sem ser exato:

| Chamada                          | Desenha                                               |
| -------------------------------- | ----------------------------------------------------- |
| `s.line(a, b)`, `s.lines(…)`     | Linha reta à mão, levemente arqueada                  |
| `s.poly([p1, p2, …])`            | Linha quebrada: visto, aba, seta                      |
| `s.rect(x, y, w, h, raio)`       | Retângulo de canto mole que passa do começo           |
| `s.circle(cx, cy, r)`            | Círculo que dá uma volta e um pouco                   |
| `s.blob(x, y, w, h)`             | A mancha de cor (para `fill`, não para traço)         |
| `s.ticks(cx, cy, ângulo)`        | Os três traços de ênfase                              |
| `sparkle(cx, cy, r)`             | O brilho de quatro pontas (para `fill`)               |
| `curl(x, y, voltas)`             | O laço cursivo                                        |

**Medidas.** Traço de 2,4 (`SceneLine` padrão); detalhe, como linha de texto, a 2; ênfase, como
visto ou "+", a 3. A mancha desloca de 6 a 10 do objeto. O DuDoo (`<SceneDuDoo>`) vai de 80 a
100 de altura, no canto de baixo à esquerda, olhando para o objeto.

**Cores.** Só tokens: traço `var(--dd-ink)`, fundo de objeto `var(--dd-surface)`, mancha
`var(--dd-accent)` (ou uma cor do `BRAND`), cinza do Sério `var(--dd-sunken)`. Com isso a cena
funciona no tema escuro sem fazer nada. Hex solto não.

**Semente.** Cada cena tem a sua (`seed`). Se um traço saiu feio, troque a semente antes de
mexer no desenho.

### Antes de pôr na tela

- [ ] Vista nos dois temas, em 280 px e no tamanho do celular.
- [ ] Uma cor da paleta só; no Sério, nenhuma.
- [ ] O DuDoo só se a ação da tela é dele, e com uma expressão do vocabulário.
- [ ] Sem gente desenhada, sem texto dentro da cena.
- [ ] `label` dizendo o que a cena mostra.
- [ ] Título e texto na voz da marca.

## 4. Onde a cena mora

- **No pacote:** as cenas que todo app usa (as da tabela acima). Mudou o desenho, mudou em
  todos os apps na próxima versão.
- **No app:** a cena que só faz sentido nele ("nenhum pedido" no CRM). O app desenha com as
  peças e a receita acima, sem esperar ninguém.
- **Cena com o DuDoo** se faz aqui, no ateliê, mesmo que seja de um app só. Ele é o personagem
  da suíte inteira, e é o que mais desanda feito às pressas.
- **Quando sobe:** a cena de um app que um segundo app quiser vem para o pacote: entra em
  `src/scenes.tsx`, ganha lugar no ateliê e os dois apps trocam o import. É a regra da cozinha:
  a peça nasce no uso e sobe quando se repete.

Para pedir uma cena aqui, diga a tela, o momento (vazio, espera, marco), o texto que vai junto e
se a ação é do DuDoo.

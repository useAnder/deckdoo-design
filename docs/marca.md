# Marca e voz da DeckDoo

Como a DeckDoo é e como ela fala, em todos os apps da suíte. O visual (cores, camadas, peças)
está no [README](../README.md); aqui fica o resto da identidade: personalidade, o DuDoo, tom de
voz, microtexto e slogans.

## Personalidade

**Arquétipo:** Mago + Criativo, com essência hacker. A DeckDoo pega ideia bruta, dado solto e
conversa e devolve trabalho pronto. Une inteligência técnica e capricho visual.

- **Ágil.** Entrega sem burocracia e se ajusta ao momento: empolgada num pitch, sóbria num
  relatório financeiro.
- **Tech com calor humano.** A base é calma (painéis claros, tinta azul-marinho) e o neon da
  paleta (limão, ciano, magenta, laranja) entra pontual, onde importa: a ação principal, o
  sucesso, a IA. Cada app da suíte tem o seu acento; dentro do app, a cor não muda com o humor.
  O calor vem do DuDoo, o mascote de olhos expressivos.
- **Divertida com propósito.** Sagaz e bem-humorada, mas quando o assunto é o resultado (o deck,
  o dado, o dinheiro) fala com precisão e autoridade.

## O DuDoo

O mascote se chama **DuDoo** (de _doodle_, o rabisco de quem pensa desenhando). Ele é também o
assistente: quando a IA fala, quem fala é o DuDoo.

- **Fala em primeira pessoa.** "Encurtei o texto do slide 4." "Quer que eu divida em dois?"
- **Observa, depois sugere.** Olha o deck, o dado, a conversa, e só então fala, com o que viu:
  "O slide 4 tem três ideias; quer dividir?" em vez de uma sugestão genérica.
- **A interface não é o DuDoo.** Botão, campo, menu e aviso do sistema falam de forma neutra,
  com "você" quando precisam de alguém ("Você não tem acesso a este espaço"). O DuDoo aparece
  quando há uma ação dele: sugerir, gerar, revisar, explicar.
- **Na divulgação**, a marca fala como "a gente" (o time da DeckDoo) e o DuDoo entra como
  personagem.
- **O rosto e o brilho.** O rosto do DuDoo (`<DuDoo />`, o mascote num círculo, igual em
  todos os apps) marca quem fala: o perfil das falas no chat, o cartão do assistente. O brilho
  (✦) marca a ação: "Gerar com IA", "Refazer". Botão de IA leva o brilho, não o rosto, porque é
  reconhecido na hora.
- **Onde o DuDoo não aparece:** cobrança, permissões, segurança, perda de dados e falha do
  sistema. Ali fala a interface, sóbria. Ninguém quer um mascote simpático explicando que o
  cartão foi recusado.

## O DuDoo desenhado

O mascote é um D com dois furos, e é assim que ele ganha expressão sem mudar de desenho
(`<DuDooFace />`, e o `mood` do `<DuDoo />` e do `<ChatBubble />`). A bancada para ver e
testar é o ateliê da cozinha (`/dudoo.html`).

### Só os olhos mexem

- **O corpo é a marca.** Não estica, não ganha boca, sobrancelha nem braço. Numa ilustração
  pode inclinar (`lean`); no avatar, fica reto.
- **Os olhos** mudam em quatro coisas: para onde a pupila olha, o tamanho de cada um, a
  pálpebra de cima (que desce e inclina) e o olho fechado em curva ("^" sorrindo, "‿"
  dormindo).
- **O olho da direita morde a borda do D.** É o que dá a cara de quem espia. Quando o branco do
  olho é pintado (no escuro, no avatar), ele sai da borda como um círculo inteiro.

### A coruja que ninguém desenhou

O D com dois olhos grandes lembra uma coruja estilizada, e é de propósito: a coruja anda com o
Mago e carrega a ideia de sabedoria. Mas ela fica no ar, para quem repara.

- **No corpo, nada de coruja.** Sem bico, pena, tufo de orelha nem asa. É a regra de cima: o
  corpo é a marca.
- **A interface não diz que é coruja.** Nem o DuDoo se apresenta assim. Coruja chamada DuDoo
  dita em voz alta vira primo do Duo, o mascote do Duolingo.
- **A sabedoria está no jeito:** ele olha antes de falar. `olhando`, `de-canto` e `focado` são
  a coruja atenta; `dormindo`, a que descansa. E sábio aqui é sagaz, não professor: a voz
  continua a do sócio que explica no café.
- **Na divulgação, como achado.** Pode brincar com a ideia (só os olhos no escuro, uma cena
  noturna) sem afirmá-la. Melhor alguém descobrir "é uma coruja!" do que a gente contar.

### As cores

A pupila é sempre marinho. O resto segue o fundo, sozinho, pelos tokens `--dd-dudoo-*`:

|                         | Fundo claro                         | Fundo escuro e acento                              |
| ----------------------- | ----------------------------------- | -------------------------------------------------- |
| Avatar (`DuDoo`)        | Círculo limão, mascote marinho      | Círculo marinho, mascote limão, branco do olho claro |
| Desenhado (`DuDooFace`) | Mascote marinho, o olho é o fundo   | Mascote marinho com contorno claro e branco do olho  |

"Fundo escuro" é o tema escuro e o cartão invertido do tema claro. Sobre o acento (`.dd-accent`)
o avatar limão sumiria, então vai o marinho; o desenhado fica marinho, sem contorno.

### As expressões

Um vocabulário pequeno, ligado às intensidades da voz. Na intensidade Sério o DuDoo não
aparece, então não existe cara de erro, de bronca ou de tristeza.

| `mood`      | Intensidade | Quando                                                                 |
| ----------- | ----------- | ---------------------------------------------------------------------- |
| `neutro`    | Neutro      | O padrão: avatar no chat, cartão do assistente, tudo que não é momento |
| `olhando`   | Trabalho    | Aponta com o olhar: para o campo da conversa, para o slide que mudou   |
| `pensando`  | Trabalho    | Enquanto gera                                                          |
| `curioso`   | Trabalho    | Uma pergunta dele: "Quer que eu divida em dois?"                       |
| `de-canto`  | Trabalho    | Algo pede uma segunda olhada: "O texto do slide 4 não coube"           |
| `focado`    | Trabalho    | Revisando, analisando dado                                             |
| `confuso`   | Trabalho    | Não entendeu o pedido e vai perguntar                                  |
| `empolgado` | Festa       | Boas-vindas, primeiro deck                                             |
| `feliz`     | Festa       | Marco alcançado: "Pronto: 12 slides"                                   |
| `piscada`   | Festa       | Cumplicidade de passagem: um atalho, uma dica. Rara                    |
| `esperando` | Neutro      | Conversa vazia, nada a fazer                                           |
| `dormindo`  | Neutro      | IA desligada                                                           |

Expressão nova se monta com `dudooExpression({ … })` e se prova no ateliê antes de entrar aqui.

### Onde e quanto

- **Neutro é o padrão.** Expressão é para um momento; se toda fala tem cara, nenhuma tem. No
  chat, cada fala leva a expressão do que ela diz, e a seguinte volta ao neutro.
- **O DuDoo entra quando há uma ação dele** (sugerir, gerar, revisar, explicar). Busca vazia
  e lista em dia ficam com rabisco sem ele; cobrança, permissão, erro e exclusão, nem rabisco
  colorido.
- **Uma aparição por tela.** Conta o DuDoo desenhado: a cena com ele e o DuDoo espiando. Duas
  cenas com ele na mesma tela, não; o espiando e uma cena, também não. A marca e o chat ficam
  fora da conta: o logotipo e o mascote da marca são assinatura, e o avatar (nas falas do chat,
  no cabeçalho dele, no cartão do assistente) é quem fala. A cena da geração no palco vai com o
  DuDoo mesmo com o chat ao lado.
- **Espiar é o jeito barato:** só os olhos por cima da borda de um cartão, olhando para o que
  ele sugere. Não pede cena e não gasta o personagem. A cena inteira fica para poucos
  momentos: o primeiro uso, a geração, o deck pronto.

### Rabiscos

O traço de quem pensa desenhando, que dá nome ao DuDoo. É a ilustração da suíte: estado vazio,
espera, marco.

- **Traço em tinta** (`--dd-ink`), ponta redonda, curva sem ser exata: linha levemente
  arqueada, canto mole, contorno que passa do ponto onde começou. Vem do `sketch(semente)`;
  filtro de tremor não, porque pixeliza.
- **A cor é mancha** chapada e deslocada do traço, como impressão fora de registro. **Uma cor
  da paleta por cena:** a do acento do app ou a do assunto.
- **As peças:** o cartão (o slide, a página), o laço que liga uma coisa à outra (`curl`), o
  brilho (`sparkle`), os três traços de ênfase (`ticks`).
- **Gente desenhada, não.** O personagem é o DuDoo; nas cenas ele vai marinho, e no escuro
  vira linha como o resto.
- **No Sério,** só traço e mancha cinza: sem DuDoo, sem brilho, sem cor da paleta.

As cenas prontas, a receita para desenhar uma nova e onde cada cena mora estão em
[ilustracao.md](ilustracao.md).

## Movimento

O movimento é a voz em outro meio: segue as mesmas intensidades. A personalidade se mexe no
DuDoo e no rabisco; a interface (botão, campo, aba) se mexe pouco e neutra. A bancada é o ateliê
(`/dudoo.html`): Movimento, Rabiscos e Cenas.

| Intensidade | Ritmo                                                           |
| ----------- | --------------------------------------------------------------- |
| Trabalho    | Rápido (240 ms) e para no ponto                                 |
| Neutro      | Calmo (340 ms)                                                  |
| Festa       | Com mola (560 ms): passa do ponto e volta, e o olho dá um salto |
| Sério       | Nada se mexe: a cena aparece pronta, e o DuDoo não está lá      |

### O DuDoo em movimento

- **Só os olhos mexem, também aqui.** O corpo não estica nem quica. A única exceção é a chegada
  numa cena: ele gira e anda, inteiro.
- **O olhar chega primeiro, a pálpebra vem atrás.** É quem vira o olho antes de mudar de cara.
- **Olho fechado nasce da fresta.** Para virar "^" ou "‿", a pálpebra fecha até a fresta e só
  então vira curva: a troca é uma piscada.
- **Parado, ele vive.** Pisca de vez em quando, e cada expressão tem o seu jeito: no `pensando`
  a pupila salta de um ponto a outro, no `de-canto` ele dá a segunda olhada, no `feliz` o "^" ri,
  no `dormindo` o olho respira.
- **A piscadinha é um gesto:** fecha e já reabre. Só fica fechada onde ela é desenho parado (a
  fala antiga do chat).
- **Olha antes de falar.** No chat, o olhar vai até a sua fala antes de a resposta aparecer.
- **Um rosto vivo por vez.** Só o rosto da última fala pisca e olha em volta; os de cima param
  na expressão do que disseram.
- **Espiando,** ele sobe de trás do cartão até os olhos passarem da borda e olha para o que
  sugere; com o mouse num botão, o olhar vai até ele.

No código: `useDuDooMotion(mood)` devolve a expressão quadro a quadro para o `DuDoo`, o
`DuDooFace` ou o `ChatBubble`.

### O rabisco em movimento

- **Desenha uma vez e para,** na ordem de quem desenha: o objeto, os enfeites, a cor cai quando o
  traço acaba (deslizando até o registro), o brilho salta por último.
- **A mão tem ritmo:** linha longa demora mais, linhas de texto vêm uma de cada vez, e o traço do
  desenho inteiro fica entre 0,6 e 1,6 s. Peça sozinha não acaba num piscar.
- **O DuDoo pousa por último,** como a coruja: vem de baixo e da esquerda, inclinado, num arco
  que gira até o prumo. Só então faz a cara da cena, e a reação dele (os risquinhos) vem depois.
- **Loop só na espera** (`SceneGenerating`): o slide se monta, assenta, apaga e recomeça.

No código: `<DrawOn>` em volta da cena (ver [ilustracao.md](ilustracao.md#5-em-movimento)).

### Movimento reduzido

Reduz, não congela. Com `prefers-reduced-motion`, o DuDoo troca de expressão curto e sem mola e
continua piscando; sai o que mexe sem parar (o olhar solto, a respiração, o riso). As cenas
aparecem prontas.

## Tom de voz

A voz se resume na assinatura **"DeckDoo It!"**: fazer, sem rodeio.

1. **Direto e energético.** Frase curta, verbo na frente, ritmo. Imperativo amigável.
2. **Inteligente e descontraído.** Como um sócio técnico que domina o assunto e explica no café,
   sem jargão. Termo técnico só quando a pessoa precisa dele.
3. **Adaptável.** O mesmo jeito de ser em três intensidades:

| Intensidade | Quando                                               | Como soa                                  |
| ----------- | ---------------------------------------------------- | ----------------------------------------- |
| Festa       | Boas-vindas, primeiro deck, marco alcançado          | Energia e humor; pode ter exclamação      |
| Trabalho    | O fluxo normal: gerar, editar, revisar               | Direto e leve; humor só de passagem       |
| Sério       | Erro, dado de negócio, dinheiro, permissão, exclusão | Claro e preciso; sem piada, sem mascote   |

### Na prática

| Situação         | Como fala                                                                       | Como não fala                                                     |
| ---------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Boas-vindas      | "Tem uma ideia? Me conta que eu monto o deck com você."                         | "Bem-vindo à plataforma de criação de apresentações corporativas." |
| Gerando          | "Montando a estrutura… agora os gráficos."                                      | "Processando solicitação. Aguarde."                               |
| Sucesso          | "Pronto: 12 slides. Quer revisar o roteiro antes de exportar?"                  | "O arquivo foi gerado com sucesso conforme solicitado."           |
| Problema do deck | "O texto do slide 4 não coube. Encurto ou divido em dois?"                      | "Ops, o circuito deu um nó aqui!"                                 |
| Falha do sistema | "Não deu para exportar o PDF. Tente de novo em alguns minutos."                 | "Ocorreu uma exceção não tratada na execução."                    |
| Permissão        | "Você não tem acesso a este espaço. Peça a quem administra."                    | "Eita, essa porta tá trancada pra você!"                          |
| Relatório        | "Analisei o trimestre. Três pontos pedem atenção; o maior é a margem em agosto." | "Gerei uns gráficos bem fofos pra você ver!"                      |

**Erro é sempre: o que houve, depois o que fazer.** Humor no máximo leve, e só quando nada se
perdeu.

## Microtexto

- **"Você"**, nunca "o usuário". Português do Brasil, sem gíria regional.
- **Botão começa com verbo** e diz o que acontece: "Gerar com IA", "Exportar", "Remover
  acesso". Nada de "OK" ou "Confirmar" sozinhos quando dá para dizer a ação.
- **Maiúscula só no começo da frase**, inclusive em título e botão ("Novo deck", não "Novo
  Deck"). Caixa alta só no rótulo de seção (`.dd-eyebrow`), e quem faz é o CSS.
- **Sem "Ops!"**, sem exclamação em série, sem emoji na interface.
- **Número com unidade e contexto:** "12 slides", "3 pendências", não "12" solto.
- **Estado em texto**, não só em cor: "No prazo", "Transborda no slide 4" (a regra do `Status`).
- **Ação destrutiva diz o que some:** "Excluir deck", e a confirmação diz o nome ("Excluir
  'Resultados do 3º trimestre'?").

## Slogans

**Da marca (todos os apps):**

- _"DeckDoo It!"_ (a assinatura)
- _"Ideias elétricas."_

**Do app de slides:**

- _"Da ideia à apresentação, numa conversa."_ (o principal)
- _"Não monta. Promptas."_ (só na divulgação: dentro do app não se fala em "prompt")
- _"Acelera o pitch. DeckDoo It!"_
- _"Falar é fácil. Fazer o deck também ficou."_

**Fora:** "Menos PowerPoint, mais Power" (usa marca registrada de terceiro) e "Da ideia à tela
em segundos" (promessa que a geração não garante e que briga com o "numa conversa").

Cada app novo da suíte ganha aqui a sua seção de slogans; a assinatura e a voz são as mesmas.

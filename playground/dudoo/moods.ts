import type { DuDooMood } from "@deckdoo/design";

/** O vocabulário do DuDoo no ateliê: o nome de cada expressão, quando usar e a intensidade. */
export interface MoodInfo {
  mood: DuDooMood;
  name: string;
  when: string;
  tone: "festa" | "trabalho" | "neutro";
}

export const MOODS: MoodInfo[] = [
  {
    mood: "neutro",
    name: "Neutro",
    when: "O padrão. Avatar no chat, cartão do assistente, tudo que não é um momento.",
    tone: "neutro",
  },
  {
    mood: "olhando",
    name: "Olhando para lá",
    when: "Aponta com o olhar: para o campo da conversa, para o slide que ele mudou.",
    tone: "trabalho",
  },
  {
    mood: "pensando",
    name: "Pensando",
    when: "Enquanto gera. Olha para cima, de lado, como quem monta a ideia.",
    tone: "trabalho",
  },
  {
    mood: "curioso",
    name: "Curioso",
    when: 'Uma pergunta dele: "Quer que eu divida em dois?". Um olho maior que o outro.',
    tone: "trabalho",
  },
  {
    mood: "de-canto",
    name: "De canto de olho",
    when: 'Algo pede uma segunda olhada: "O texto do slide 4 não coube". Sem drama.',
    tone: "trabalho",
  },
  {
    mood: "focado",
    name: "Focado",
    when: "Revisando, analisando dado. Pálpebras retas, um pouco caídas para dentro.",
    tone: "trabalho",
  },
  {
    mood: "empolgado",
    name: "Empolgado",
    when: "Boas-vindas, primeiro deck. Olhos grandes, pupila pequena.",
    tone: "festa",
  },
  {
    mood: "feliz",
    name: "Feliz",
    when: 'Marco alcançado, "Pronto: 12 slides". Os olhos fecham num "^".',
    tone: "festa",
  },
  {
    mood: "piscada",
    name: "Piscadinha",
    when: "Cumplicidade, de passagem: um atalho, uma dica. Rara, para não virar tique.",
    tone: "festa",
  },
  {
    mood: "esperando",
    name: "Esperando",
    when: "Conversa vazia, nada a fazer. Pálpebras pesadas, olhar para baixo, para o campo.",
    tone: "neutro",
  },
  {
    mood: "dormindo",
    name: "Dormindo",
    when: "IA desligada no cartão do assistente. Os dois olhos fechados.",
    tone: "neutro",
  },
  {
    mood: "confuso",
    name: "Confuso",
    when: "Não entendeu o pedido e vai perguntar. Cada olho para um lado.",
    tone: "trabalho",
  },
];

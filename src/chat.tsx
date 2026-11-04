import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ActionIcon, Loader } from "@mantine/core";
import { Warning, X } from "@phosphor-icons/react";
import { ChatBubble } from "./components.js";
import { dudooExpression, type DuDooExpression, type DuDooMood } from "./dudoo.js";
import { useDuDooMotion } from "./motion.js";

/**
 * As falas do chat, sobre o `ChatBubble`: quem fala é o DuDoo, com a expressão do que diz
 * (`docs/marca.md`, "O DuDoo desenhado" e "Movimento"). Só o rosto da última fala dele está vivo;
 * os de cima param na expressão do que disseram. Subiu do Slides e do Marketing, que tinham as
 * mesmas peças cada um. O visual está em `design.css` (`dd-chat-*`).
 */

type Mood = DuDooMood | DuDooExpression;

/** Lendo a sua fala: o olhar vai para cima e para a direita, onde ela está. */
export const READING = dudooExpression({ look: [0.85, -0.6] });

/** Quanto tempo ele olha a sua fala antes de começar a pensar na resposta. */
const READ_MS = 700;

/** A cara de uma resposta pronta: pergunta é curiosidade; o resto, neutro (o padrão). */
export function replyMood(text: string, asks = false): DuDooMood {
  return asks || text.trimEnd().endsWith("?") ? "curioso" : "neutro";
}

/**
 * A fala do DuDoo. `live` diz se é o rosto vivo (pisca e olha em volta); `from`, de que cara ele
 * vem quando a fala nasce no lugar de outra (a resposta que acabou de chegar sai do `pensando`).
 */
export function DuDooSays({
  mood = "neutro",
  from,
  live,
  children,
}: {
  mood?: Mood;
  from?: Mood;
  live: boolean;
  children: ReactNode;
}) {
  const [shown, setShown] = useState<Mood>(from ?? mood);
  useEffect(() => setShown(mood), [mood]);
  const face = useDuDooMotion(shown, { blink: live, idle: live });
  return (
    <ChatBubble from="dudoo" mood={face}>
      {children}
    </ChatBubble>
  );
}

/** A sua fala, à direita. */
export function YouSay({ children }: { children: ReactNode }) {
  return <ChatBubble from="you">{children}</ChatBubble>;
}

/**
 * Os três pontos de quem escreve, na cor da tinta apagada. `label` é o texto para leitor de
 * tela; `""` quando ao lado já há texto visível dizendo a mesma coisa.
 */
export function Typing({ label = "O DuDoo está escrevendo" }: { label?: string }) {
  return <Loader size="xs" type="dots" color="var(--dd-ink-faint)" aria-label={label} />;
}

/**
 * Enquanto a resposta não chega: primeiro ele olha para a sua fala, depois pensa. É o que separa
 * quem ouviu de quem só respondeu.
 */
export function useReadThenThink(): Mood {
  const [reading, setReading] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setReading(false), READ_MS);
    return () => window.clearTimeout(id);
  }, []);
  return reading ? READING : "pensando";
}

/**
 * Aviso do sistema no meio da conversa (a falha da geração, o pedido que não andou): não é fala
 * do DuDoo, então não tem rosto nem balão. Com `onClose`, leva um botão pequeno que o dispensa.
 * Centraliza-se sozinho se o pai for uma coluna flex (a conversa).
 */
export function SystemNotice({
  onClose,
  closeLabel = "Fechar",
  children,
}: {
  onClose?: () => void;
  /** O nome do botão de dispensar para leitor de tela. Padrão: `"Fechar"`. */
  closeLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="dd-chat-notice" role="status">
      <Warning size={14} />
      <span>{children}</span>
      {onClose ? (
        <ActionIcon
          size="xs"
          variant="subtle"
          c="inherit"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <X size={12} />
        </ActionIcon>
      ) : null}
    </div>
  );
}

/**
 * A fala entra subindo um pouco, mas só a que chega com a conversa aberta: o que já estava lá ao
 * abrir a conversa aparece pronto. O ref diz se a conversa já montou; cada linha lê na própria
 * montagem.
 */
const ChatMounted = createContext<RefObject<boolean> | null>(null);

/** Envolve a conversa; as `Enter` de dentro só animam depois que ela montou. */
export function ChatEnterScope({ children }: { children: ReactNode }) {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);
  return <ChatMounted.Provider value={mounted}>{children}</ChatMounted.Provider>;
}

/**
 * Uma linha da conversa que entra subindo se chegou com ela já aberta. `still` desliga a entrada:
 * é a fala gravada que entra no lugar da que estava no ar, e que já subiu uma vez.
 */
export function Enter({ still = false, children }: { still?: boolean; children: ReactNode }) {
  const mounted = useContext(ChatMounted);
  const [enter] = useState(() => !still && mounted?.current === true);
  return <div className={enter ? "dd-chat-enter" : undefined}>{children}</div>;
}

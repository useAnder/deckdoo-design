import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Anchor, Box, Button, Modal, Stack, Text, Title } from "@mantine/core";
import { DrawOn } from "./draw.js";
import { EmptyState, SceneDone, SceneLocked } from "./scenes.js";
import { useRefreshOnReturn } from "./suite.js";

/*
 * A sessão que cai com a tela aberta (troca de senha ou saída em outro navegador, sessão central
 * encerrada em `id.`): contrato do Hub, §2, "A sessão que cai com a tela aberta".
 *
 * O primeiro 401 depois de a sessão ter existido nesta página marca a sessão como perdida, e o
 * `SessionExpiredModal` cobre tudo. O login acontece numa janela à parte (o fluxo OAuth de sempre,
 * em `id.`), que termina na rota de retorno do app (`SessionResumed`), avisa esta aba e se fecha;
 * o modal some e o app refaz as leituras, sem recarregar: o que estava na tela fica.
 *
 * O 401 do primeiro carregamento não conta: sem nada na tela para perder, o certo continua sendo o
 * redirect direto para o login. O pacote não chama rede: quem lê as respostas e diz o que é 401 é
 * o app (`watchSession`).
 */

let established = false;
let lost = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Uma resposta autenticada passou: daqui em diante, 401 é sessão que caiu, não que faltou. */
export function noteSessionOk(): void {
  established = true;
}

/** A sessão já existiu nesta página? Se não, o 401 é o de quem ainda não entrou (redirect). */
export function sessionEstablished(): boolean {
  return established;
}

/** Um 401. Só vira "sessão perdida" (e abre o modal) se a sessão já existiu nesta página. */
export function noteUnauthorized(): void {
  if (!established || lost) return;
  lost = true;
  emit();
}

/**
 * Toda resposta da API do app passa por aqui: a que deu certo prova que a sessão existe, e o 401
 * depois disso é a sessão que caiu.
 */
export function watchSession(res: { status: number; ok: boolean }): void {
  if (res.status === 401) noteUnauthorized();
  else if (res.ok) noteSessionOk();
}

/** A sessão voltou (login na janela à parte, ou em outra aba). */
export function clearSessionLost(): void {
  if (!lost) return;
  lost = false;
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `true` enquanto a sessão está perdida: o modal está aberto. */
export function useSessionLost(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => lost,
    () => false,
  );
}

/** Volta ao estado de página recém-carregada. Para os testes. */
export function resetSessionState(): void {
  established = false;
  lost = false;
  emit();
}

/** A rota de retorno padrão: onde a janela de login termina, avisa a aba de origem e se fecha. */
export const SESSION_RESUMED_PATH = "/sessao-retomada";

/*
 * O aviso vai por `BroadcastChannel`, não por `window.opener.postMessage`: a passagem por `id.`
 * (outra origem) pode cortar o `opener` (COOP), e o canal só depende de as duas janelas serem da
 * mesma origem — o que já é verdade, porque a janela termina na rota do próprio app.
 */
const CHANNEL = "deckdoo.session";
const RESUMED = "resumed";

export function announceSessionResumed(): void {
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage(RESUMED);
    channel.close();
  } catch {
    // Sem BroadcastChannel: a aba de origem confere sozinha quando ganhar foco.
  }
}

export function onSessionResumed(callback: () => void): () => void {
  let channel: BroadcastChannel;
  try {
    channel = new BroadcastChannel(CHANNEL);
  } catch {
    return () => undefined;
  }
  channel.onmessage = (event: MessageEvent) => {
    if (event.data === RESUMED) callback();
  };
  return () => channel.close();
}

/**
 * Abre `href` (o começo do login do app) numa janela pequena, centrada sobre esta. Devolve
 * `false` se o navegador bloqueou a janela.
 */
export function openLoginWindow(href: string): boolean {
  const width = 480;
  const height = 680;
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  const opened = window.open(
    href,
    "deckdoo-login",
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  );
  if (!opened) return false;
  opened.focus();
  return true;
}

export interface SessionExpiredLabels {
  /** Padrão: `"Sua sessão acabou"`. */
  title: string;
  body: string;
  /** Depois de abrir a janela de login. */
  waiting: string;
  /** Padrão: `"Entrar de novo"`. */
  signIn: string;
  /** O mesmo botão, com a janela já aberta. */
  reopen: string;
  /** O link de entrar na própria aba, que recarrega a página. */
  signInHere: string;
}

const EXPIRED_LABELS: SessionExpiredLabels = {
  title: "Sua sessão acabou",
  body: "Pode ter sido uma troca de senha ou uma saída em outro aparelho. Entre de novo para continuar: esta tela fica como está.",
  waiting: "Entre na janela que abriu. Quando terminar, esta tela continua sozinha.",
  signIn: "Entrar de novo",
  reopen: "Abrir a janela de novo",
  signInHere: "Entrar nesta aba (recarrega a página)",
};

/**
 * O modal da sessão perdida, por cima de tudo (sem sessão nada na tela funciona). Não fecha por
 * fora — sem X, Esc ou clique no fundo —: a única saída é entrar. Monte uma vez, no layout.
 *
 * - `loginHref(next)`: o começo do login do app, voltando para `next` (só caminho desta origem).
 *   O botão abre `loginHref(resumedPath)` numa janela; se ela for bloqueada, entra na própria aba
 *   com `loginHref(<onde está>)`.
 * - `checkSession`: confere a sessão sem cache (o principal, `no-cache`). Resolve se ela voltou.
 *   Roda ao voltar para a aba, para quem entrou por outra aba ou quando o aviso não chegar.
 * - `onResumed`: a sessão voltou; refaça as leituras (`queryClient.invalidateQueries()`). As
 *   ações que falharam com 401 não se repetem sozinhas.
 */
export function SessionExpiredModal({
  loginHref,
  checkSession,
  onResumed,
  resumedPath = SESSION_RESUMED_PATH,
  labels,
}: {
  loginHref: (next: string) => string;
  checkSession: () => Promise<unknown>;
  onResumed: () => void;
  resumedPath?: string;
  labels?: Partial<SessionExpiredLabels>;
}) {
  const isLost = useSessionLost();
  return (
    <Modal
      opened={isLost}
      onClose={() => undefined}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size={400}
      radius="lg"
      padding="xl"
      zIndex={1000}
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
    >
      {/* O Modal desmonta o miolo fechado: cada queda começa sem "esperando a janela". */}
      <SignInAgain
        loginHref={loginHref}
        checkSession={checkSession}
        onResumed={onResumed}
        resumedPath={resumedPath}
        text={{ ...EXPIRED_LABELS, ...labels }}
      />
    </Modal>
  );
}

function SignInAgain({
  loginHref,
  checkSession,
  onResumed,
  resumedPath,
  text,
}: {
  loginHref: (next: string) => string;
  checkSession: () => Promise<unknown>;
  onResumed: () => void;
  resumedPath: string;
  text: SessionExpiredLabels;
}) {
  const [waiting, setWaiting] = useState(false);
  const here = () => `${window.location.pathname}${window.location.search}`;

  // A referência mais nova, sem reabrir o canal a cada render do app.
  const latest = useRef(onResumed);
  useEffect(() => {
    latest.current = onResumed;
  });

  useEffect(
    () =>
      onSessionResumed(() => {
        clearSessionLost();
        latest.current();
      }),
    [],
  );

  useRefreshOnReturn(() => {
    checkSession()
      .then(() => {
        clearSessionLost();
        latest.current();
      })
      .catch(() => undefined);
  }, 1_000);

  function signIn() {
    if (openLoginWindow(loginHref(resumedPath))) {
      setWaiting(true);
      return;
    }
    window.location.assign(loginHref(here()));
  }

  return (
    <Stack align="center" gap="lg" ta="center">
      <Box w={120} aria-hidden="true">
        <DrawOn still>
          <SceneLocked />
        </DrawOn>
      </Box>
      <Stack gap={6}>
        <Title order={3}>{text.title}</Title>
        <Text size="sm" className="dd-muted">
          {text.body}
        </Text>
      </Stack>
      {waiting && (
        <Text size="sm" role="status">
          {text.waiting}
        </Text>
      )}
      <Stack gap="xs" w="100%" align="center">
        <Button fullWidth size="md" onClick={signIn}>
          {waiting ? text.reopen : text.signIn}
        </Button>
        {waiting && (
          <Anchor href={loginHref(here())} size="xs" className="dd-muted">
            {text.signInHere}
          </Anchor>
        )}
      </Stack>
    </Stack>
  );
}

export interface SessionResumedLabels {
  title: string;
  body: string;
  /** O botão de voltar ao app, para quando a janela não fecha sozinha. */
  home: string;
}

const RESUMED_LABELS: SessionResumedLabels = {
  title: "Você entrou de novo",
  body: "Pode fechar esta janela: a tela de onde você veio já continuou.",
  home: "Voltar ao app",
};

/**
 * A rota de retorno (`SESSION_RESUMED_PATH`), fora do layout do app: avisa a aba de origem e
 * fecha a janela. Se o navegador não deixar fechar, fica a mensagem e o caminho de volta. Vai
 * dentro de uma `StatusScreen`.
 */
export function SessionResumed({
  homeHref = "/",
  labels,
}: {
  homeHref?: string;
  labels?: Partial<SessionResumedLabels>;
}) {
  const text = { ...RESUMED_LABELS, ...labels };
  useEffect(() => {
    announceSessionResumed();
    window.close();
  }, []);

  return (
    <EmptyState
      art={<SceneDone />}
      title={text.title}
      action={
        <Button component="a" href={homeHref}>
          {text.home}
        </Button>
      }
    >
      {text.body}
    </EmptyState>
  );
}

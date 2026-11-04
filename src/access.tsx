import type { ReactNode } from "react";
import { Anchor, Box, Group, Stack, Text, Title } from "@mantine/core";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Block, Logo, Panel } from "./components.js";
import { DrawOn } from "./draw.js";
import { SceneLocked } from "./scenes.js";

/**
 * As telas de status (a moldura) e a de acesso negado, que o Slides e o Marketing tinham cada um
 * por conta. Presentacional: quem busca a identidade e a lista de serviços, e quem faz o Tentar de
 * novo e o Sair, é o app. O visual está em `design.css` (`dd-screen*`).
 */

/**
 * Um item de `GET /api/me/services` do control plane: um serviço que a pessoa tem. `external`
 * sai do app (abre em outro lugar), e a lista avisa com uma seta.
 */
export interface SuiteService {
  slug: string;
  kind: "app" | "external";
  name: string;
  href: string;
  /** Vem do contrato; as peças daqui não o usam. */
  status?: string;
}

/**
 * A moldura das telas que ficam fora do app (acesso negado, erro de rota): o fundo cinza, a marca
 * em cima e o conteúdo num painel no centro. Com `component="div"` não vira o `main` da página
 * (para pôr dentro de outro).
 */
export function StatusScreen({
  brand,
  component: Root = "main",
  children,
}: {
  /** A marca de cima. Padrão: o `Logo` da marca do app. */
  brand?: ReactNode;
  component?: "main" | "div";
  children: ReactNode;
}) {
  return (
    <Root className="dd-screen">
      <div className="dd-screen-col">
        {brand ?? <Logo height={22} />}
        <Panel>{children}</Panel>
      </div>
    </Root>
  );
}

export interface AppListLabels {
  /** Padrão: `"Seus apps"`. */
  title: string;
  /** Padrão: `"Carregando…"`. */
  loading: string;
  /** Padrão: `"Não deu para carregar a lista de apps."`. */
  error: string;
  /** Quando a lista veio sem nenhum outro. Padrão: `"Nenhum outro app contratado."`. */
  empty: string;
}

const APP_LIST_LABELS: AppListLabels = {
  title: "Seus apps",
  loading: "Carregando…",
  error: "Não deu para carregar a lista de apps.",
  empty: "Nenhum outro app contratado.",
};

/**
 * As aplicações que a pessoa tem: a saída útil de quem não tem a deste app. Presentacional: o app
 * busca a lista e diz se está carregando ou falhou. O próprio app (`currentSlug`) sai da lista.
 */
export function AppList({
  services,
  loading = false,
  error = false,
  currentSlug,
  labels,
}: {
  services: readonly SuiteService[];
  loading?: boolean;
  error?: boolean;
  /** O `slug` do app que está mostrando a lista: não faz sentido oferecê-lo como saída. */
  currentSlug?: string;
  labels?: Partial<AppListLabels>;
}) {
  const text = { ...APP_LIST_LABELS, ...labels };
  const others = services.filter((service) => service.slug !== currentSlug);
  return (
    <Block>
      <Stack gap="xs">
        <Text size="sm" fw={600}>
          {text.title}
        </Text>
        {loading && (
          <Text size="sm" className="dd-muted">
            {text.loading}
          </Text>
        )}
        {!loading && error && (
          <Text size="sm" className="dd-muted">
            {text.error}
          </Text>
        )}
        {!loading && !error && others.length === 0 && (
          <Text size="sm" className="dd-muted">
            {text.empty}
          </Text>
        )}
        {!loading &&
          !error &&
          others.map((service) => (
            <Anchor key={service.slug} href={service.href} size="sm">
              <Group gap={6} wrap="nowrap">
                <span>{service.name}</span>
                {/* `kind` é estilo, não decisão: a seta só avisa que o link sai daqui. */}
                {service.kind === "external" && <ArrowSquareOut size={14} aria-hidden />}
              </Group>
            </Anchor>
          ))}
      </Stack>
    </Block>
  );
}

/** Os códigos de negação de acesso do contrato do control plane (mais `UNKNOWN`, o sem código). */
export type AccessDenialCode =
  | "NOT_ENTITLED"
  | "NO_TENANT"
  | "TENANT_SUSPENDED"
  | "AMBIGUOUS_TENANT"
  | "MALFORMED"
  | "UNAVAILABLE"
  | "UNKNOWN";

/**
 * O texto de cada código, o do Slides. Cada um tem o seu porque a **saída** é diferente: "não
 * contratou" se resolve com a agência, "sessão não serve" trocando de conta, e uma falha do
 * serviço só esperando.
 *
 * O de `NOT_ENTITLED` manda olhar "abaixo" os apps que a pessoa já tem: passe `services` (um
 * `AppList`) com ele, ou sobrescreva o `body`.
 */
export const ACCESS_DENIAL_TEXT: Record<AccessDenialCode, { title: string; body: string }> = {
  NOT_ENTITLED: {
    title: "Sua conta não tem este app",
    body: "A contratação deste app não está ativa para a sua empresa. Fale com a agência para liberar — enquanto isso, os apps que você já tem estão abaixo.",
  },
  TENANT_SUSPENDED: {
    title: "Conta suspensa",
    body: "O acesso da sua empresa está suspenso. Fale com a agência para reativar.",
  },
  NO_TENANT: {
    title: "Esta conta não está ligada a nenhuma empresa",
    body: "Você entrou com uma conta sem vínculo. Saia e entre com a conta da sua empresa.",
  },
  AMBIGUOUS_TENANT: {
    title: "Esta conta está em mais de uma empresa",
    body: "Não dá para saber em nome de qual empresa abrir o app. Saia e entre com a conta certa, ou fale com a agência.",
  },
  MALFORMED: {
    title: "Contratação incompleta",
    body: "A contratação deste app ainda não foi configurada por inteiro. Fale com o suporte para concluir a liberação.",
  },
  UNAVAILABLE: {
    title: "Não deu para confirmar o seu acesso",
    body: "O serviço de contas não respondeu agora. Tente de novo em instantes.",
  },
  UNKNOWN: {
    title: "Não deu para abrir o app",
    body: "Algo deu errado ao confirmar o seu acesso. Tente de novo; se continuar, saia e entre de novo.",
  },
};

export interface AccessDeniedLabels {
  /** A linha de quem está vendo a tela. Padrão: `"Você entrou como {email}, em {tenant}."`. */
  signedInAs: (who: { email: string; tenant: string }) => string;
  /** Antes do `detail`. Padrão: `"Código"`. */
  code: string;
}

/** O cadeado é das negações; `UNAVAILABLE` e `UNKNOWN` são falha do sistema, e ficam sem cena. */
const NO_LOCK: readonly AccessDenialCode[] = ["UNAVAILABLE", "UNKNOWN"];

/**
 * A negação de acesso: o que houve, quem está vendo a tela e a saída. Vai dentro de uma
 * `StatusScreen` (ou de onde o app quiser). Os botões (Tentar de novo, Sair) e a lista de apps
 * são do app, que os passa em `actions` e `services`; assim ele decide quais códigos mostram
 * qual saída.
 */
export function AccessDenied({
  code,
  signedInAs,
  services,
  actions,
  title,
  body,
  detail,
  labels,
}: {
  code: AccessDenialCode;
  /** Quem está vendo a tela: conta errada é metade dos casos. */
  signedInAs?: { email: string; tenant: string };
  /** Normalmente um `<AppList />`, para o `NOT_ENTITLED`. */
  services?: ReactNode;
  /** Os botões, do app. */
  actions?: ReactNode;
  /** Sobrescreve o título de `ACCESS_DENIAL_TEXT[code]`. */
  title?: string;
  /** Sobrescreve o texto de `ACCESS_DENIAL_TEXT[code]`. */
  body?: string;
  /** O código técnico (`NOT_ENTITLED`, `HTTP 502`), em fonte de máquina e pequeno. */
  detail?: string;
  labels?: Partial<AccessDeniedLabels>;
}) {
  const text = {
    signedInAs: ({ email, tenant }: { email: string; tenant: string }) =>
      `Você entrou como ${email}, em ${tenant}.`,
    code: "Código",
    ...labels,
  };
  const said = ACCESS_DENIAL_TEXT[code];
  return (
    <Stack gap="lg">
      {!NO_LOCK.includes(code) && (
        // Decorativa: o título já diz o que houve, então fica fora da árvore de acessibilidade.
        <Box maw={200} mx="auto" aria-hidden="true">
          <DrawOn still>
            <SceneLocked />
          </DrawOn>
        </Box>
      )}

      <Stack gap="xs">
        <Title order={2}>{title ?? said.title}</Title>
        <Text className="dd-muted">{body ?? said.body}</Text>
      </Stack>

      {signedInAs && (
        <Text size="sm" className="dd-muted">
          {text.signedInAs(signedInAs)}
        </Text>
      )}

      {services}

      {actions && <Group gap="sm">{actions}</Group>}

      {detail && (
        <Text size="xs" className="dd-muted dd-mono">
          {text.code}: {detail}
        </Text>
      )}
    </Stack>
  );
}

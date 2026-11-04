import { useEffect, useRef, type ReactNode } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Menu,
  SegmentedControl,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  type MenuProps,
} from "@mantine/core";
import {
  ArrowSquareOut,
  CaretDown,
  Moon,
  SignOut,
  SquaresFour,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import type { SuiteService } from "./access.js";

/**
 * O cabeçalho da suíte (o menu de apps, o menu da pessoa, a aparência) e os auxiliares das
 * preferências que o control plane guarda (tema e idioma). Subiu do Slides e do Marketing.
 *
 * Tudo aqui é presentacional ou local do navegador: nada chama rede. Quem lê `GET /api/me`, quem
 * grava a escolha da pessoa e quem busca `GET /api/me/services` é o app. O visual está em
 * `design.css` (`dd-suite-*`).
 */

/** Altura do cabeçalho: as telas descontam ela para ocupar o resto da janela. */
export const SUITE_HEADER_HEIGHT = 60;

/* ——— Menu de apps ——— */

export interface AppSwitcherLabels {
  /** O nome do botão e a dica dele. Padrão: `"Trocar de app"`. */
  trigger: string;
  /** Padrão: `"Seus apps"`. */
  title: string;
  /** Padrão: `"Carregando…"`. */
  loading: string;
  /** Padrão: `"Não deu para carregar a lista de apps."`. */
  error: string;
  /** Padrão: `"Nenhum app contratado."`. */
  empty: string;
  /** Embaixo do app em que a pessoa está. Padrão: `"Você está aqui"`. */
  here: string;
}

const APP_SWITCHER_LABELS: AppSwitcherLabels = {
  trigger: "Trocar de app",
  title: "Seus apps",
  loading: "Carregando…",
  error: "Não deu para carregar a lista de apps.",
  empty: "Nenhum app contratado.",
  here: "Você está aqui",
};

/**
 * O menu "trocar de app": os serviços da pessoa (`GET /api/me/services`), num botão de ícone.
 * É **apresentação**: o que ele mostra nunca decide acesso. O app busca a lista (sem cache: o
 * control plane manda `no-store`) e diz se está carregando ou falhou, para a queda do control
 * plane não virar uma lista vazia silenciosa.
 */
export function AppSwitcher({
  services,
  loading = false,
  error = false,
  currentSlug,
  labels,
}: {
  services: readonly SuiteService[];
  loading?: boolean;
  error?: boolean;
  /** O `slug` do app em que a pessoa está: aparece marcado e desabilitado. */
  currentSlug?: string;
  labels?: Partial<AppSwitcherLabels>;
}) {
  const text = { ...APP_SWITCHER_LABELS, ...labels };
  return (
    <Menu shadow="md" width={260} position="bottom-start">
      <Menu.Target>
        <Tooltip label={text.trigger} openDelay={400}>
          <ActionIcon size="lg" aria-label={text.trigger}>
            <SquaresFour size={18} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{text.title}</Menu.Label>

        {loading && (
          <Menu.Item disabled>
            <Text size="sm" c="dimmed">
              {text.loading}
            </Text>
          </Menu.Item>
        )}

        {/* Falha e lista vazia são coisas diferentes, e só uma delas se resolve esperando. */}
        {!loading && error && (
          <Menu.Item disabled>
            <Text size="sm" c="dimmed">
              {text.error}
            </Text>
          </Menu.Item>
        )}

        {!loading && !error && services.length === 0 && (
          <Menu.Item disabled>
            <Text size="sm" c="dimmed">
              {text.empty}
            </Text>
          </Menu.Item>
        )}

        {!loading &&
          !error &&
          services.map((service) => {
            const here = service.slug === currentSlug;
            return (
              <Menu.Item
                key={service.slug}
                component="a"
                href={service.href}
                disabled={here}
                // `kind` é estilo, não decisão: a seta só avisa que o link sai daqui.
                rightSection={
                  service.kind === "external" ? <ArrowSquareOut size={14} aria-hidden /> : undefined
                }
              >
                <Text size="sm">{service.name}</Text>
                {here && (
                  <Text size="xs" c="dimmed">
                    {text.here}
                  </Text>
                )}
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
}

/* ——— Aparência ——— */

/**
 * Claro ou escuro. Não há "sistema": pelo contrato do control plane, quem nunca escolheu
 * (`preferredColorScheme: null`) vê o claro, e o `prefers-color-scheme` não entra.
 */
export type AppearanceValue = "light" | "dark";

export interface AppearanceLabels {
  /** Padrão: `"Claro"`. */
  light: string;
  /** Padrão: `"Escuro"`. */
  dark: string;
  /** O nome do seletor para leitor de tela. Padrão: `"Aparência"`. */
  label: string;
}

const APPEARANCE_LABELS: AppearanceLabels = {
  light: "Claro",
  dark: "Escuro",
  label: "Aparência",
};

const APPEARANCE_OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const;

/**
 * O seletor claro / escuro. Controlado e sem efeito próprio: não toca o Mantine nem grava nada.
 * O app aplica a escolha na hora (`setColorScheme`) e a grava onde a pessoa a guarda (ver
 * `useColorSchemePreference`).
 *
 * `value` aceita o `colorScheme` do Mantine como vem: um `"auto"` que tenha ficado no cache
 * aparece como claro, que é o que a pessoa vê.
 *
 * `iconsOnly` é para cabeçalho apertado; os nomes ficam como dica e rótulo de leitor de tela.
 */
export function AppearanceControl({
  value,
  onChange,
  labels,
  fullWidth,
  iconsOnly,
}: {
  value: AppearanceValue | "auto";
  onChange: (value: AppearanceValue) => void;
  labels?: Partial<AppearanceLabels>;
  fullWidth?: boolean;
  iconsOnly?: boolean;
}) {
  const text = { ...APPEARANCE_LABELS, ...labels };
  return (
    <SegmentedControl
      size="xs"
      radius="xl"
      fullWidth={fullWidth}
      aria-label={text.label}
      value={value === "auto" ? "light" : value}
      onChange={(next) => onChange(next as AppearanceValue)}
      data={APPEARANCE_OPTIONS.map(({ value: option, icon: Icon }) => ({
        value: option,
        label: (
          <Group
            gap={4}
            wrap="nowrap"
            justify="center"
            title={text[option]}
            aria-label={text[option]}
          >
            <Icon size={14} aria-hidden />
            {iconsOnly ? null : <span>{text[option]}</span>}
          </Group>
        ),
      }))}
    />
  );
}

/* ——— Menu da pessoa ——— */

/** As iniciais para o avatar: "Anderson Fonseca" → "AF". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface UserMenuLabels {
  /** Padrão: `"Minha conta"`. */
  account: string;
  /** Padrão: `"Sair"`. */
  signOut: string;
  /** O nome do botão da pílula para leitor de tela. Padrão: `"Sua conta"`. */
  menu: string;
}

const USER_MENU_LABELS: UserMenuLabels = {
  account: "Minha conta",
  signOut: "Sair",
  menu: "Sua conta",
};

/**
 * Quem está logado, numa pílula com avatar e nome: abre "Minha conta", os itens do app e "Sair".
 *
 * Com `appearance`, o menu mostra o `AppearanceControl` e não fecha ao clicar nele, para a
 * pessoa ver a troca acontecer. Quem aplica e grava a escolha é o app (`appearance.onChange`).
 */
export function UserMenu({
  name,
  email,
  accountUrl,
  appearance,
  onSignOut,
  children,
  footer,
  target,
  position = "bottom-end",
  labels,
}: {
  /** `null` enquanto não se sabe: a pílula fica só com o avatar vazio. */
  name: string | null;
  /** Aparece no alto do menu, em letra pequena. */
  email?: string | null;
  /** O endereço de "Minha conta" (a tela de identidade do contrato). Sem ele, o item some. */
  accountUrl?: string | null;
  appearance?: {
    /** O `colorScheme` do Mantine serve direto (`"auto"` aparece como claro). */
    value: AppearanceValue | "auto";
    onChange: (value: AppearanceValue) => void;
    labels?: Partial<AppearanceLabels>;
  };
  onSignOut: () => void;
  /** Itens extras do app (`Menu.Item`), entre "Minha conta" e "Sair". */
  children?: ReactNode;
  /** Uma linha pequena no fim do menu (a versão do app, por exemplo). */
  footer?: ReactNode;
  /**
   * O gatilho do app no lugar da pílula (o cartão do pé da barra lateral). Tem de ser um único
   * elemento que aceite `ref` e os eventos de clique (um `button`).
   */
  target?: ReactNode;
  /** Onde o menu abre. Padrão: `"bottom-end"`; um gatilho no pé da barra pede `"top-start"`. */
  position?: MenuProps["position"];
  labels?: Partial<UserMenuLabels>;
}) {
  const text = { ...USER_MENU_LABELS, ...labels };
  const showAccount = Boolean(accountUrl);
  const hasExtras = children !== undefined && children !== null && children !== false;
  return (
    <Menu position={position} width={appearance ? 240 : 200} shadow="lg" radius="lg">
      <Menu.Target>
        {target ?? (
          <UnstyledButton className="dd-suite-user" aria-label={text.menu}>
            <Avatar size={30} radius="xl" color="inverse" variant="filled">
              {name ? initials(name) : null}
            </Avatar>
            {name && <span className="dd-suite-user-name">{name}</span>}
            <CaretDown size={12} aria-hidden />
          </UnstyledButton>
        )}
      </Menu.Target>
      <Menu.Dropdown>
        {email && <Menu.Label>{email}</Menu.Label>}
        {showAccount && (
          <Menu.Item
            component="a"
            href={accountUrl ?? undefined}
            leftSection={<UserCircle size={16} />}
          >
            {text.account}
          </Menu.Item>
        )}
        {children}
        {appearance && (
          <>
            {(showAccount || hasExtras) && <Menu.Divider />}
            <Box px="sm" py="xs">
              <Text size="xs" c="dimmed" mb={6}>
                {appearance.labels?.label ?? APPEARANCE_LABELS.label}
              </Text>
              <AppearanceControl
                fullWidth
                value={appearance.value}
                onChange={appearance.onChange}
                labels={appearance.labels}
              />
            </Box>
          </>
        )}
        {(showAccount || hasExtras || appearance) && <Menu.Divider />}
        <Menu.Item leftSection={<SignOut size={16} />} onClick={onSignOut}>
          {text.signOut}
        </Menu.Item>
        {footer && (
          <>
            <Menu.Divider />
            <Text size="xs" c="dimmed" px="sm" py={6} ta="center">
              {footer}
            </Text>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

/* ——— Cabeçalho ——— */

/**
 * O miolo do cabeçalho dos apps de editor (Slides, Pages): o menu de apps, a marca, as abas e o
 * canto da pessoa, numa linha de `SUITE_HEADER_HEIGHT` sobre o fundo da suíte, sem borda. Cabe
 * dentro do `AppShell.Header` do Mantine (que ganha o mesmo fundo e perde a borda), com
 * `header={{ height: SUITE_HEADER_HEIGHT }}` no `AppShell`.
 */
export function SuiteHeader({
  start,
  brand,
  tabs,
  end,
  tabsLabel = "Seções",
}: {
  /** Normalmente o `AppSwitcher`. */
  start?: ReactNode;
  /**
   * O link da marca para a home: o app passa o `Link` do roteador dele com o `Logo` dentro
   * (e um `aria-label`, já que o link é só a imagem).
   */
  brand: ReactNode;
  /** Os links das abas, como `<NavLink className="dd-tab">`. O cabeçalho desenha o `nav.dd-tabs`. */
  tabs?: ReactNode;
  /** Normalmente o `UserMenu`. */
  end?: ReactNode;
  /** O nome do `nav` das abas para leitor de tela. Padrão: `"Seções"`. */
  tabsLabel?: string;
}) {
  return (
    <div className="dd-suite-header" style={{ height: SUITE_HEADER_HEIGHT }}>
      {start}
      <div className="dd-suite-brand">{brand}</div>
      {tabs && (
        <nav className="dd-tabs dd-suite-tabs" aria-label={tabsLabel}>
          {tabs}
        </nav>
      )}
      {end && <div className="dd-suite-end">{end}</div>}
    </div>
  );
}

/* ——— Preferências do control plane ——— */

/**
 * Aplica no Mantine o tema que o control plane guarda (`user.preferredColorScheme`), com o
 * significado do contrato ("O `preferredColorScheme` e o clarão"):
 *
 * - `undefined`: o control plane ainda não respondeu, ou falhou. Não mexe em nada, e fica o
 *   tema que está aplicado (o cache do `localStorage`). Falha é "não consegui perguntar", não
 *   "a pessoa não escolheu".
 * - `null`: a pessoa nunca escolheu, e vale o **claro**. O tema do sistema não entra.
 * - `"light"` / `"dark"`: aplica.
 *
 * Aplica quando o valor **muda** em relação ao último recebido, não a cada render. Assim a troca
 * que o app faz na hora, enquanto a gravação está no ar, não é desfeita por um valor velho.
 *
 * Quem usa põe `MantineProvider defaultColorScheme="light"`: o cache pinta a primeira tela, e sem
 * cache ela abre clara. Um `"auto"` que tenha ficado no cache (de antes desta regra, ou de um
 * `defaultColorScheme="auto"`) vira claro na hora, sem esperar o control plane.
 */
export function useColorSchemePreference(preferred: "light" | "dark" | null | undefined): void {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const received = useRef<"light" | "dark" | null | undefined>(undefined);
  useEffect(() => {
    if (preferred === undefined || received.current === preferred) return;
    received.current = preferred;
    setColorScheme(preferred ?? "light");
  }, [preferred, setColorScheme]);
  useEffect(() => {
    // Roda depois do de cima: se o control plane já respondeu neste render, vale o que ele disse.
    if (colorScheme === "auto") setColorScheme(received.current ?? "light");
  }, [colorScheme, setColorScheme]);
}

/**
 * Qual dos idiomas do app casa com os tags dados (`"pt-BR"`, `"en-US"`…), na ordem dos tags.
 * Para cada tag tenta o inteiro e depois só o idioma, sem diferença de caixa: `pt-BR` casa com
 * `pt-BR`, `pt-PT` cai em `pt-BR` se for o único português, `en-US` cai em `en`. Cortar o tag
 * no hífen e comparar com a lista não serve: `pt` não casa com `pt-BR`. Devolve o idioma como
 * está em `supported`, ou `undefined` se nenhum casa.
 */
export function matchLocale(
  tags: readonly string[],
  supported: readonly string[],
): string | undefined {
  const fold = (value: string) => value.toLowerCase();
  const language = (value: string) => fold(value).split("-")[0];
  for (const tag of tags) {
    const whole = supported.find((locale) => fold(locale) === fold(tag));
    if (whole) return whole;
    const lang = language(tag);
    if (!lang) continue;
    const byLanguage = supported.find((locale) => language(locale) === lang);
    if (byLanguage) return byLanguage;
  }
  return undefined;
}

/** Os idiomas do navegador, ou nenhum onde não há `navigator` (renderização no servidor). */
function browserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

/**
 * O idioma da interface, dado o que o control plane guarda (`user.preferredLocale`).
 *
 * - `undefined`: o control plane ainda não respondeu. Devolve `undefined`: espere. Um relance do
 *   idioma errado é barato; aplicar o do navegador e corrigir depois desfaz a escolha a cada
 *   carregamento.
 * - `null`: a pessoa nunca escolheu. Vale o navegador (`matchLocale` dos `browserTags`).
 * - string: ela, se o app a suporta; senão, o que casa com ela e depois com o navegador.
 *
 * `undefined` na saída também quer dizer "nada casa": o app fica no idioma padrão dele.
 */
export function pickLocale(
  preferred: string | null | undefined,
  supported: readonly string[],
  browserTags: readonly string[] = browserLanguages(),
): string | undefined {
  if (preferred === undefined) return undefined;
  if (preferred === null) return matchLocale(browserTags, supported);
  const wanted = preferred.toLowerCase();
  const exact = supported.find((locale) => locale.toLowerCase() === wanted);
  return exact ?? matchLocale([preferred, ...browserTags], supported);
}

/**
 * Chama `refresh` quando a pessoa volta para a aba (`visibilitychange`, só se visível) ou para a
 * janela (`focus`), no máximo uma vez a cada `throttleMs`. É como um app pega o que outro app da
 * suíte gravou. O que `refresh` faz (reler o principal) e o que acontece se falhar é do app.
 */
export function useRefreshOnReturn(refresh: () => void, throttleMs = 5000): void {
  const latest = useRef(refresh);
  useEffect(() => {
    latest.current = refresh;
  });
  useEffect(() => {
    let last = Number.NEGATIVE_INFINITY;
    const onReturn = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - last < throttleMs) return;
      last = now;
      latest.current();
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, [throttleMs]);
}

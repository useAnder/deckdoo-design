import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { marked } from "marked";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ColorInput,
  Group,
  Kbd,
  Loader,
  MantineProvider,
  Menu,
  Modal,
  Notification,
  Progress,
  Radio,
  PasswordInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  ArrowUp,
  Bell,
  CaretDown,
  CaretRight,
  ChartBar,
  ChatCircleDots,
  Chats,
  CheckCircle,
  ClockCounterClockwise,
  Copy,
  DotsNine,
  DotsThree,
  Export,
  FileText,
  Funnel,
  Hourglass,
  House,
  Images,
  Info,
  LockKey,
  MagnifyingGlass,
  Megaphone,
  Moon,
  PaintBrush,
  Palette,
  Paperclip,
  PencilSimple,
  Play,
  Plus,
  Presentation,
  ShareNetwork,
  SidebarSimple,
  Rows,
  Sparkle,
  SquaresFour,
  Stack as StackIcon,
  Sun,
  TextAa,
  Trash,
  UploadSimple,
  Users,
  Warning,
} from "@phosphor-icons/react";
import {
  AccessDenied,
  AppIcon,
  AppList,
  AppSwitcher,
  BRAND,
  Block,
  ChatBubble,
  ChatEnterScope,
  Count,
  DECKDOO_BRAND,
  DesignProvider,
  LOCKUP_MARKETING,
  LOCKUP_SLIDES,
  LOCKUP_WORKS,
  Dots,
  DuDoo,
  DuDooSays,
  DuDooWall,
  EmptyState,
  Enter,
  Logo,
  NavItem,
  Panel,
  PillTabs,
  SceneDone,
  SceneLocked,
  RailButton,
  SidePanel,
  SideRail,
  NavGroup,
  NavSection,
  SideBar,
  SideTip,
  Skeleton,
  TopProgress,
  FilterBar,
  FilterChip,
  FilterMenu,
  periodShortcuts,
  useSideCollapsed,
  useWait,
  yearPeriod,
  type FilterPeriod,
  Stat,
  Status,
  StatusScreen,
  SessionExpiredModal,
  Steps,
  noteSessionOk,
  noteUnauthorized,
  SUITE_APPS,
  SUITE_HEADER_HEIGHT,
  SuiteRail,
  SuiteHeader,
  SystemNotice,
  Typing,
  UserMenu,
  YouSay,
  accentHex,
  buildTheme,
  requestPanel,
  usePanelRequests,
  useReadThenThink,
  type Accent,
  type RailItem,
  type Brand as BrandIdentity,
  type Corners,
  type SuiteAppSlug,
  type SuiteService,
} from "@deckdoo/design";
import { EXEMPLO_BRAND } from "./brands.js";
import { AppsStudy } from "./AppsStudy.js";
import marca from "../docs/marca.md?raw";
import "./kitchen.css";

/**
 * A cozinha: o padrão visual da suíte inteiro numa página, para ver qualquer mudança do pacote
 * na hora (o Vite lê `../src` direto). Acento, cantos, tema e marca se trocam na barra do topo;
 * a escolha fica no `localStorage`.
 */

const BRANDS: Record<string, BrandIdentity> = {
  deckdoo: DECKDOO_BRAND,
  exemplo: EXEMPLO_BRAND,
};

export function KitchenRoot() {
  const [accent, setAccent] = useLocalStorage<Accent>({ key: "dd-k-accent", defaultValue: "lime" });
  const [corners, setCorners] = useLocalStorage<Corners>({
    key: "dd-k-corners",
    defaultValue: "pilula",
  });
  const [brand, setBrand] = useLocalStorage<string>({ key: "dd-k-brand", defaultValue: "deckdoo" });
  const theme = useMemo(() => buildTheme({ accent, corners }), [accent, corners]);

  useEffect(() => {
    document.title = "Cozinha · DeckDoo Design";
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DesignProvider brand={BRANDS[brand]}>
        <Kitchen controls={{ accent, setAccent, corners, setCorners, brand, setBrand }} />
      </DesignProvider>
    </MantineProvider>
  );
}

interface Controls {
  accent: Accent;
  setAccent: (v: Accent) => void;
  corners: Corners;
  setCorners: (v: Corners) => void;
  brand: string;
  setBrand: (v: string) => void;
}

const SECTIONS = [
  { id: "marca", label: "Marca", icon: Sparkle },
  { id: "voz", label: "Voz", icon: Megaphone },
  { id: "cores", label: "Cores", icon: Palette },
  { id: "tipografia", label: "Tipografia", icon: TextAa },
  { id: "botoes", label: "Botões", icon: Play },
  { id: "campos", label: "Campos", icon: PencilSimple },
  { id: "estados", label: "Estados", icon: CheckCircle },
  { id: "navegacao", label: "Navegação", icon: StackIcon },
  { id: "gavetas", label: "Gavetas", icon: SidebarSimple },
  { id: "cartoes", label: "Cartões", icon: ChartBar },
  { id: "conversa", label: "Conversa", icon: ChatCircleDots },
  { id: "chat", label: "Chat", icon: Chats },
  { id: "suite", label: "Suíte", icon: SquaresFour },
  { id: "apps", label: "Apps", icon: DotsNine },
  { id: "acesso", label: "Acesso", icon: LockKey },
  { id: "tabela", label: "Tabela", icon: FileText },
  { id: "filtros", label: "Filtros", icon: Funnel },
  { id: "espera", label: "Espera", icon: Hourglass },
  { id: "camadas", label: "Camadas", icon: Copy },
  { id: "tela", label: "Tela exemplo", icon: House },
] as const;

function Kitchen({ controls }: { controls: Controls }) {
  const [active, setActive] = useState<string>("marca");
  const [aiOn, setAiOn] = useState(true);
  // O trilho de apps na borda da página (estudo da seção Apps), para ver no tamanho real.
  const [railOn] = useRailOn();
  const [current, setCurrent] = useLocalStorage<SuiteAppSlug>({
    key: "dd-k-rail-app",
    defaultValue: "slides",
  });

  // A seção visível acende na barra lateral, como numa página de verdade.
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) seen.observe(el);
    }
    return () => seen.disconnect();
  }, []);

  return (
    <KitchenShell railOn={railOn} current={current} onPick={setCurrent}>
      <div className="dd-frame ks">
        <SideBar
          // Com o trilho, a marca aberta é a do app atual dele; recolhida, o mascote DeckDoo.
          brand={
            railOn ? (
              <Logo app={SUITE_APPS[current]?.lockup} variant="stacked" height={36} />
            ) : (
              <Logo height={26} />
            )
          }
          brandCollapsed={<AppIcon size={30} />}
          top={<KitchenWorkspace />}
          foot={<KitchenFoot aiOn={aiOn} onAiChange={setAiOn} />}
        >
          <NavSection label="Padrão visual">
            {SECTIONS.filter((s) => !CHAT_IDS.includes(s.id)).map((s) => (
              <SectionLink key={s.id} section={s} active={active === s.id} />
            ))}
            <NavGroup
              icon={<ChatCircleDots size={18} />}
              label="Conversa"
              itemsId="ks-nav-conversa"
              active={CHAT_IDS.includes(active)}
            >
              {SECTIONS.filter((s) => CHAT_IDS.includes(s.id)).map((s) => (
                <SectionLink key={s.id} section={s} active={active === s.id} />
              ))}
            </NavGroup>
          </NavSection>

          <NavSection label="Bancadas">
            <NavItem
              component="a"
              href="/dudoo.html"
              icon={<PaintBrush size={18} />}
              label="Ateliê do DuDoo"
            />
            <NavItem
              component="a"
              href="/marca.html"
              icon={<TextAa size={18} />}
              label="Bancada da marca"
            />
          </NavSection>
        </SideBar>

        <main className="dd-main ks-main">
          <header className="ks-top">
            <div>
              <Text size="xs" className="dd-muted">
                Design <CaretRight size={10} /> Suíte
              </Text>
              <Group gap="sm">
                <Title order={1} fz={28}>
                  Cozinha
                </Title>
                <Status tone="info">Rascunho</Status>
              </Group>
            </div>
            <ThemeBar controls={controls} />
          </header>

          <Brand />
          <Voice />
          <Colors />
          <Typography />
          <Buttons />
          <Fields />
          <States />
          <Navigation />
          <Drawers />
          <Cards />
          <Conversation />
          <ChatParts />
          <Suite />
          <Apps />
          <Access />
          <TableSection />
          <Filters />
          <Loading />
          <Layers />
          <Example />
        </main>
      </div>
    </KitchenShell>
  );
}

/** O trilho de apps ligado na cozinha: a mesma chave na barra do topo e na página. */
function useRailOn() {
  return useLocalStorage<boolean>({ key: "dd-k-rail-on", defaultValue: true });
}

// Os apps da suíte como o control plane mandaria. O link é da própria cozinha: o clique só
// troca o app atual (e a marca da barra lateral).
const RAIL_SERVICES: SuiteService[] = Object.values(SUITE_APPS).map((app) => ({
  slug: app.slug,
  kind: "app",
  name: app.name,
  href: "#apps",
}));

/** A página inteira: com o trilho de apps do pacote em volta da moldura, ou só a moldura. */
function KitchenShell({
  railOn,
  current,
  onPick,
  children,
}: {
  railOn: boolean;
  current: string;
  onPick: (slug: SuiteAppSlug) => void;
  children: ReactNode;
}) {
  return (
    <div className="dd-root" lang="pt-BR">
      {railOn ? (
        <SuiteRail
          services={RAIL_SERVICES}
          currentSlug={current}
          onSelect={(service, event) => {
            event.preventDefault();
            onPick(service.slug as SuiteAppSlug);
          }}
        >
          {children}
        </SuiteRail>
      ) : (
        children
      )}
    </div>
  );
}

// As seções de conversa ficam num grupo que abre e fecha, para mostrar o `NavGroup`.
const CHAT_IDS = ["conversa", "chat"];

function SectionLink({ section, active }: { section: (typeof SECTIONS)[number]; active: boolean }) {
  return (
    // Link de verdade (`component="a"`): abre em nova aba, copia o endereço.
    <NavItem
      component="a"
      href={`#${section.id}`}
      icon={<section.icon size={18} />}
      label={section.label}
      active={active}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
      }}
    />
  );
}

/** O espaço de trabalho no topo da barra; recolhida, só o quadrado. */
function KitchenWorkspace() {
  const collapsed = useSideCollapsed();
  const mark = (
    <Avatar radius="md" size={34} color="inverse" variant="filled">
      UA
    </Avatar>
  );
  return (
    <SideTip label="useAnder">
      <button
        type="button"
        className="ks-workspace"
        data-collapsed={collapsed || undefined}
        aria-label={collapsed ? "useAnder · Espaço de trabalho" : undefined}
      >
        {mark}
        {!collapsed && (
          <>
            <span style={{ minWidth: 0 }}>
              <strong>useAnder</strong>
              <span className="dd-muted">Espaço de trabalho</span>
            </span>
            <CaretDown size={14} style={{ marginLeft: "auto" }} />
          </>
        )}
      </button>
    </SideTip>
  );
}

/** O pé da barra: o DuDoo e a pessoa. Recolhida, o rosto do DuDoo (que liga e desliga) e o avatar. */
function KitchenFoot({ aiOn, onAiChange }: { aiOn: boolean; onAiChange: (on: boolean) => void }) {
  const collapsed = useSideCollapsed();
  const avatar = (
    <Avatar radius="xl" color="purple" variant="filled">
      AF
    </Avatar>
  );
  if (collapsed) {
    return (
      <>
        <SideTip label={aiOn ? "DuDoo ligado" : "DuDoo desligado"}>
          <button
            type="button"
            className="dd-accent ks-ai-mini"
            aria-pressed={aiOn}
            aria-label="DuDoo"
            onClick={() => onAiChange(!aiOn)}
          >
            <DuDoo mood={aiOn ? "neutro" : "dormindo"} />
          </button>
        </SideTip>
        <SideTip label="Anderson · Dono do espaço">{avatar}</SideTip>
      </>
    );
  }
  return (
    <>
      <div className="dd-accent ks-ai-card">
        <Group justify="space-between" wrap="nowrap">
          <Group gap={10} wrap="nowrap">
            <DuDoo mood={aiOn ? "neutro" : "dormindo"} />
            <div>
              <Text fw={600} size="sm" lh={1.2}>
                DuDoo
              </Text>
              <Text size="xs" opacity={0.75}>
                {aiOn ? "Ligado · 12 decks" : "Desligado"}
              </Text>
            </div>
          </Group>
          <Switch
            checked={aiOn}
            onChange={(e) => onAiChange(e.currentTarget.checked)}
            // Sobre o acento a tinta é sempre escura, nos dois temas.
            color="ink.9"
            size="md"
            aria-label="DuDoo"
          />
        </Group>
        <button type="button" className="ks-ai-link">
          3 slides pedem atenção <CaretRight size={14} />
        </button>
      </div>
      <Group gap="sm" wrap="nowrap" className="ks-user">
        {avatar}
        <div style={{ minWidth: 0 }}>
          <Text size="sm" fw={600}>
            Anderson
          </Text>
          <Text size="xs" className="dd-muted">
            Dono do espaço
          </Text>
        </div>
      </Group>
    </>
  );
}

function ThemeBar({ controls }: { controls: Controls }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [railOn, setRailOn] = useRailOn();
  const accents = ["lime", "cyan", "yellow", "coral", "magenta", "purple"] as const;
  return (
    <Group gap="sm" className="ks-themebar" wrap="wrap">
      <SegmentedControl
        size="xs"
        aria-label="Marca"
        value={controls.brand}
        onChange={controls.setBrand}
        data={[
          { value: "deckdoo", label: "DeckDoo" },
          { value: "exemplo", label: "Exemplo" },
        ]}
      />
      <Group gap={6} aria-label="Cor de acento" role="radiogroup">
        {accents.map((a) => (
          <Tooltip key={a} label={`Acento: ${a}`}>
            <button
              type="button"
              role="radio"
              aria-checked={controls.accent === a}
              aria-label={a}
              className="ks-swatch-btn"
              data-active={controls.accent === a || undefined}
              style={{ background: BRAND[a] }}
              onClick={() => controls.setAccent(a)}
            />
          </Tooltip>
        ))}
        {/* Qualquer hex também vale: é o que um app com cor própria passa ao `buildTheme`. */}
        <ColorInput
          size="xs"
          w={112}
          aria-label="Acento em hex"
          format="hex"
          swatches={[]}
          value={accentHex(controls.accent)}
          onChangeEnd={(v) => /^#[0-9a-f]{6}$/i.test(v) && controls.setAccent(v as Accent)}
        />
      </Group>
      <SegmentedControl
        size="xs"
        value={controls.corners}
        onChange={(v) => controls.setCorners(v as Corners)}
        data={[
          { value: "pilula", label: "Pílula" },
          { value: "suave", label: "Suave" },
          { value: "sutil", label: "Sutil" },
          { value: "reto", label: "Reto" },
        ]}
      />
      <Switch
        size="xs"
        label="Trilho"
        checked={railOn}
        onChange={(e) => setRailOn(e.currentTarget.checked)}
      />
      <ActionIcon
        size="lg"
        aria-label={colorScheme === "dark" ? "Tema claro" : "Tema escuro"}
        onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
      >
        {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </ActionIcon>
    </Group>
  );
}

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ks-section">
      <div className="ks-section-head">
        <Title order={2}>{title}</Title>
        {note && <Text className="dd-muted">{note}</Text>}
      </div>
      {children}
    </section>
  );
}

/* ——— Marca ——— */

function Brand() {
  return (
    <Section
      id="marca"
      title="Marca"
      note="O logotipo quando houver espaço; o mascote quando não houver."
    >
      <Stack gap="md">
        <BrandRow
          title="Logotipo"
          note="Escolhe sozinho o desenho pelo fundo e pinta com a cor do texto. Sobre cor da paleta, diga o fundo com on."
        >
          <div className="dd-panel ks-brand-tile">
            <Logo variant="type" height={36} />
          </div>
          <div className="dd-panel dd-inverse ks-brand-tile">
            <Logo variant="type" height={36} />
          </div>
          <div className="dd-panel dd-accent ks-brand-tile">
            <Logo variant="type" height={36} />
          </div>
          <div className="dd-panel ks-brand-tile" style={{ background: BRAND.purple }}>
            <Logo variant="type" height={36} on="dark" color={BRAND.lime} />
          </div>
        </BrandRow>
        <BrandRow
          title="Mascote"
          note="O ícone sozinho: favicon, ícone de app, o rosto do DuDoo. Também troca de desenho no escuro."
        >
          <div className="dd-panel ks-brand-tile ks-mark-row">
            <Logo variant="mark" height={64} />
            <Logo variant="mark" height={40} />
            <Logo variant="mark" height={24} />
            <Logo variant="mark" height={16} />
          </div>
          <div className="dd-panel dd-inverse ks-brand-tile ks-mark-row">
            <Logo variant="mark" height={64} />
            <Logo variant="mark" height={40} />
            <Logo variant="mark" height={24} />
            <Logo variant="mark" height={16} />
          </div>
          <div className="dd-panel ks-brand-tile ks-mark-row">
            <AppIcon size={72} />
            <AppIcon size={44} />
            <AppIcon size={28} />
          </div>
        </BrandRow>
        <BrandRow
          title="Marca de cada app"
          note="Com app no DesignProvider, o Logo vira o lockup do app. A bancada fica em /marca.html."
        >
          <div className="dd-panel ks-brand-tile ks-lockup-stack">
            <Logo app={LOCKUP_SLIDES} height={28} />
            <Logo app={LOCKUP_MARKETING} variant="stacked" height={44} />
            <Logo app={LOCKUP_WORKS} variant="inline" height={24} />
          </div>
          <div className="dd-panel dd-inverse ks-brand-tile ks-lockup-stack">
            <Logo app={LOCKUP_SLIDES} height={28} />
            <Logo app={LOCKUP_MARKETING} variant="stacked" height={44} />
            <Logo app={LOCKUP_WORKS} variant="inline" height={24} />
          </div>
          <div className="dd-panel dd-accent ks-brand-tile ks-lockup-stack">
            <Logo app={LOCKUP_SLIDES} height={28} />
            <Logo app={LOCKUP_MARKETING} variant="stacked" height={44} />
            <Logo app={LOCKUP_WORKS} variant="inline" height={24} />
          </div>
        </BrandRow>
      </Stack>
    </Section>
  );
}

function BrandRow({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div>
      <Group gap="xs" mb={8} align="baseline">
        <Text fw={600}>{title}</Text>
        <Text size="sm" className="dd-muted">
          {note}
        </Text>
      </Group>
      <div className="ks-brand">{children}</div>
    </div>
  );
}

/* ——— Cores ——— */

const SWATCHES: { key: keyof typeof BRAND; name: string; role: string }[] = [
  { key: "ink", name: "Tinta", role: "Texto, pílula ativa, cartão invertido" },
  { key: "navy", name: "Marinho", role: "Superfícies escuras" },
  { key: "lime", name: "Limão", role: "Acento, sucesso, IA" },
  { key: "sky", name: "Céu", role: "Informação, link no escuro" },
  { key: "cyan", name: "Ciano", role: "Gráficos" },
  { key: "yellow", name: "Amarelo", role: "Aviso" },
  { key: "orange", name: "Laranja", role: "Atenção" },
  { key: "coral", name: "Coral", role: "Erro, risco alto" },
  { key: "magenta", name: "Magenta", role: "Destaque de marca" },
  { key: "purple", name: "Roxo", role: "Destaque de marca" },
  { key: "paper", name: "Papel", role: "Texto no escuro" },
  { key: "mist", name: "Névoa", role: "Fundo alternativo" },
];

function Colors() {
  return (
    <Section
      id="cores"
      title="Cores"
      note="A paleta da marca e o papel de cada uma. O texto em cada amostra é o que o tema escolhe para ficar legível."
    >
      <div className="ks-swatches">
        {SWATCHES.map((s) => (
          <div key={s.key} className="ks-swatch">
            <div className="ks-swatch-chip" style={{ background: BRAND[s.key] }}>
              <span style={{ color: contrastInk(BRAND[s.key]) }}>Aa</span>
            </div>
            <div className="ks-swatch-meta">
              <Group justify="space-between" wrap="nowrap" gap={4}>
                <Text fw={600} size="sm">
                  {s.name}
                </Text>
                <span className="dd-mono dd-faint">{BRAND[s.key]}</span>
              </Group>
              <Text size="xs" className="dd-muted">
                {s.role}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Camadas" style={{ marginTop: 16 }}>
        <Text size="sm" className="dd-muted" mb="md">
          Do fundo para a frente. Toda tela usa só estas; cor da paleta entra como destaque, nunca
          como fundo de área grande.
        </Text>
        <div className="ks-layers">
          {[
            ["--dd-canvas", "Fundo"],
            ["--dd-shell", "Moldura"],
            ["--dd-surface", "Painel"],
            ["--dd-sunken", "Bloco"],
            ["--dd-inverse", "Invertido"],
            ["--dd-accent", "Acento"],
          ].map(([token, label]) => (
            <div key={token} className="ks-layer" style={{ background: `var(${token})` }}>
              <span
                style={{
                  color:
                    token === "--dd-inverse"
                      ? "var(--dd-on-inverse)"
                      : token === "--dd-accent"
                        ? "var(--dd-on-accent)"
                        : undefined,
                }}
              >
                <strong>{label}</strong>
                <span className="dd-mono" style={{ opacity: 0.7 }}>
                  {token}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}

function contrastInk(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
  return lum > 0.3 ? BRAND.ink : BRAND.paper;
}

/* ——— Tipografia ——— */

function Typography() {
  return (
    <Section
      id="tipografia"
      title="Tipografia"
      note="Figtree em tudo, do título ao rótulo; Geist Mono só para IDs, datas e números de máquina."
    >
      <Panel>
        <Stack gap="lg">
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">Display · 44</span>
            <Title order={1} fz={44} lh={1.05} style={{ letterSpacing: "-0.02em" }}>
              Bom dia, Anderson
            </Title>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">H1 · 36</span>
            <Title order={1}>Relatório trimestral de vendas</Title>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">H2 · 26</span>
            <Title order={2}>Progresso do deck</Title>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">H3 · 20</span>
            <Title order={3}>Atividade recente</Title>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">H4 · 17</span>
            <Title order={4}>Detalhes da apresentação</Title>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">Corpo · 16</span>
            <Text maw={620}>
              O DuDoo leu o material que você enviou e montou um roteiro com doze slides. Revise a
              pauta, ajuste o que quiser e peça o rascunho quando estiver pronto — o tom segue o
              modelo da marca, e as imagens vêm da sua Biblioteca.
            </Text>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">Apoio · 14</span>
            <Text size="sm" className="dd-muted" maw={620}>
              Criado em 24 de setembro por Anderson · última edição há 2 minutos
            </Text>
          </div>
          <div className="ks-type-row">
            <span className="dd-mono dd-faint">Mono · 12</span>
            <Text ff="monospace" size="xs">
              DK-2841 · v3 · 1920 × 1080 · <span className="dd-nobreak">claude-opus-5-5</span>
            </Text>
          </div>
        </Stack>
      </Panel>
    </Section>
  );
}

/* ——— Botões ——— */

function Buttons() {
  return (
    <Section
      id="botoes"
      title="Botões"
      note="Acento só para a ação principal da tela (uma por vez). Tinta para ação forte secundária; branco para o resto."
    >
      <Panel>
        <Stack gap="lg">
          <Group gap="sm">
            <Button leftSection={<Sparkle size={16} weight="fill" />}>Gerar com IA</Button>
            <Button color="inverse" leftSection={<Plus size={16} />}>
              Novo deck
            </Button>
            <Button variant="default" leftSection={<Export size={16} />}>
              Exportar
            </Button>
            <Button variant="light">Ver versões</Button>
            <Button variant="subtle">Cancelar</Button>
            <Button color="coral" leftSection={<Trash size={16} />}>
              Excluir
            </Button>
            <Anchor component="button" size="sm" c="var(--dd-danger-text)">
              Remover
            </Anchor>
          </Group>
          <Group gap="sm">
            <Button size="xs">Pequeno</Button>
            <Button size="sm">Médio</Button>
            <Button size="md">Padrão</Button>
            <Button size="lg">Grande</Button>
            <Button loading>Carregando</Button>
            <Button disabled>Desabilitado</Button>
          </Group>
          <Group gap="sm">
            <ActionIcon size="lg" aria-label="Notificações">
              <Bell size={18} />
            </ActionIcon>
            <ActionIcon size="lg" aria-label="Mais ações">
              <DotsThree size={18} weight="bold" />
            </ActionIcon>
            <ActionIcon size="lg" variant="filled" aria-label="Gerar com IA">
              <Sparkle size={18} weight="fill" />
            </ActionIcon>
            <ActionIcon size="lg" variant="filled" color="inverse" aria-label="Apresentar">
              <Play size={18} weight="fill" />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle" color="gray" aria-label="Abrir">
              <ArrowUpRight size={18} />
            </ActionIcon>
            <Button.Group>
              <Button variant="default" leftSection={<Play size={16} />}>
                Apresentar
              </Button>
              <Button variant="default" px={10} aria-label="Opções de apresentação">
                <CaretDown size={14} />
              </Button>
            </Button.Group>
          </Group>
        </Stack>
      </Panel>
    </Section>
  );
}

/* ——— Campos ——— */

function Fields() {
  const [tone, setTone] = useState("direto");
  return (
    <Section id="campos" title="Campos">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Panel title="Texto">
          <Stack gap="md">
            <TextInput
              placeholder="Buscar decks"
              leftSection={<MagnifyingGlass size={16} />}
              rightSection={<Kbd size="xs">⌘K</Kbd>}
              rightSectionWidth={52}
            />
            <TextInput
              label="Título do deck"
              placeholder="Ex.: Plano de expansão 2027"
              description="Aparece na capa e no nome do arquivo."
            />
            <TextInput
              label="Público"
              defaultValue="Diretoria"
              error="Diga para quem é a apresentação."
            />
            {/* Cada campo do Mantine tem o próprio padrão de canto: o de senha fica aqui para
                a bancada mostrar se ele sair da pílula junto com os outros. */}
            <PasswordInput label="Senha" defaultValue="deckdoo-it" />
            <Select
              label="Modelo de marca"
              data={["DeckDoo padrão", "DeckDoo escuro", "Cliente — Acme"]}
              defaultValue="DeckDoo padrão"
            />
            <Textarea
              label="O que a apresentação precisa dizer"
              autosize
              minRows={3}
              placeholder="Cole um texto, um link ou descreva com suas palavras"
            />
          </Stack>
        </Panel>
        <Panel title="Escolha">
          <Stack gap="lg">
            <div>
              <Text size="sm" fw={500} mb={6}>
                Tom
              </Text>
              <SegmentedControl
                value={tone}
                onChange={setTone}
                data={[
                  { value: "direto", label: "Direto" },
                  { value: "inspirador", label: "Inspirador" },
                  { value: "tecnico", label: "Técnico" },
                ]}
              />
            </div>
            <Stack gap="xs">
              <Checkbox defaultChecked label="Pedir aprovação da Elena antes de exportar" />
              <Checkbox label="Conferir o deck inteiro de novo depois da edição" />
            </Stack>
            <Radio.Group defaultValue="16x9" label="Formato">
              <Group mt={6}>
                <Radio value="16x9" label="16:9" />
                <Radio value="4x3" label="4:3" />
                <Radio value="1x1" label="Quadrado" />
              </Group>
            </Radio.Group>
            <Switch defaultChecked label="Notas do apresentador" color="inverse" />
            <div>
              <Text size="sm" fw={500} mb={6}>
                Quantidade de slides
              </Text>
              <Slider
                defaultValue={12}
                min={4}
                max={30}
                marks={[{ value: 4 }, { value: 12 }, { value: 30 }]}
              />
            </div>
          </Stack>
        </Panel>
      </SimpleGrid>
    </Section>
  );
}

/* ——— Estados ——— */

function States() {
  return (
    <Section
      id="estados"
      title="Estados"
      note="Pílula com bolinha diz o estado de algo; etiqueta clara categoriza; contador conta."
    >
      <Panel>
        <Stack gap="lg">
          <Group gap="sm">
            <Status tone="ok">No prazo</Status>
            <Status tone="info">Gerando</Status>
            <Status tone="attention">Em revisão</Status>
            <Status tone="danger">Transborda</Status>
            <Status tone="neutral">Arquivado</Status>
          </Group>
          <Group gap="sm">
            <Badge>Novo</Badge>
            <Badge color="ink">Rascunho</Badge>
            <Badge color="cyan">Compartilhado</Badge>
            <Badge color="yellow">Aviso</Badge>
            <Badge color="orange">Médio</Badge>
            <Badge color="coral" variant="filled">
              Alto
            </Badge>
            <Badge color="purple" variant="filled">
              Pro
            </Badge>
            <Badge variant="filled" leftSection={<Sparkle size={11} weight="fill" />}>
              Ordenado pelo DuDoo
            </Badge>
            <Count>128</Count>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <Notification
              icon={<CheckCircle size={18} />}
              color="lime"
              title="Deck exportado"
              withCloseButton={false}
            >
              Plano 2027.pptx está na sua pasta de downloads.
            </Notification>
            <Notification
              icon={<Warning size={18} />}
              color="orange"
              title="Slide 4 transborda"
              withCloseButton={false}
            >
              O texto não cabe na caixa. Encurte ou peça ao DuDoo para refazer.
            </Notification>
            <Notification
              icon={<Info size={18} />}
              color="cyan"
              title="Biblioteca atualizada"
              withCloseButton={false}
            >
              12 imagens novas do banco de imagens.
            </Notification>
            <Notification loading title="Gerando o rascunho" withCloseButton={false}>
              Slide 7 de 12 · cerca de 40 segundos.
            </Notification>
          </SimpleGrid>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="sm">Rascunho</Text>
              <Text size="sm" className="dd-num">
                78%
              </Text>
            </Group>
            <Progress value={78} size="md" radius="xl" color="inverse" />
          </Stack>
        </Stack>
      </Panel>
    </Section>
  );
}

/* ——— Gavetas ——— */

type DrawerKey = "inserir" | "tema" | "historico";

const DRAWER_EVENT = "cozinha:abrir-gaveta";
const DRAWER_KEYS: readonly DrawerKey[] = ["inserir", "tema", "historico"];

const RAIL: RailItem<DrawerKey>[] = [
  { key: "inserir", label: "Inserir", icon: <Plus size={20} /> },
  { key: "tema", label: "Tema", icon: <Palette size={20} /> },
  {
    key: "historico",
    label: "Histórico",
    icon: <ClockCounterClockwise size={20} />,
    off: "Salve o deck para ver o histórico",
  },
];

function Drawers() {
  const [open, setOpen] = useState<DrawerKey | null>("tema");
  const item = RAIL.find((i) => i.key === open);
  // A chave chega tipada: `keys` barra o que não é gaveta daqui.
  usePanelRequests<DrawerKey>(setOpen, DRAWER_EVENT, DRAWER_KEYS);
  return (
    <Section
      id="gavetas"
      title="Gavetas"
      note="A barra de ícones na borda direita e a gaveta aberta ao lado, que empurra o palco. Clicar na aberta fecha; o ícone apagado explica por quê. A linha é uma .dd-bench: abaixo de 960 px dela (e não da janela), a gaveta flutua."
    >
      <Panel>
        <div className="ks-drawers dd-bench">
          <Block className="ks-drawers-stage">
            <Stack gap="xs" align="center">
              <Text size="sm" className="dd-muted">
                O palco: a gaveta aberta encaixa ao lado dele.
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => requestPanel<DrawerKey>("inserir", DRAWER_EVENT)}
              >
                Abrir Inserir de fora da barra
              </Button>
            </Stack>
          </Block>
          {item && (
            <SidePanel title={item.label} width={300} onClose={() => setOpen(null)}>
              <Text size="sm" className="dd-muted">
                O conteúdo da gaveta rola dentro dela.
              </Text>
            </SidePanel>
          )}
          <SideRail
            items={RAIL}
            open={open}
            onToggle={(key) => setOpen(open === key ? null : key)}
            footer={
              <Menu position="left-end" withinPortal>
                <Menu.Target>
                  <RailButton icon={<Rows size={18} />} label="Layout" />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>O pé da barra é um RailButton</Menu.Label>
                  <Menu.Item>Colunas</Menu.Item>
                  <Menu.Item>Palco amplo</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            }
          />
        </div>
      </Panel>
      <Panel title="Cena com rótulo próprio" style={{ marginTop: 16 }}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <EmptyState art={<SceneLocked label="A closed padlock" />} title="Sem acesso">
            O rótulo da cena (para leitor de tela) vem do app: aqui, em inglês.
          </EmptyState>
          <EmptyState art={<SceneDone />} title="Pronto">
            Sem `label`, a cena usa o rótulo em português.
          </EmptyState>
        </SimpleGrid>
      </Panel>
    </Section>
  );
}

/* ——— Navegação ——— */

function Navigation() {
  const [tab, setTab] = useState("visao");
  const [inner, setInner] = useState("resumo");
  return (
    <Section
      id="navegacao"
      title="Navegação"
      note="A barra lateral desta página é o item de navegação; abaixo, abas em pílula e trilha."
    >
      <Stack gap="md">
        <div className="ks-tabs-demo">
          <PillTabs
            value={tab}
            onChange={setTab}
            leading={
              <span className="ks-tabs-id">
                <span className="ks-dot-icon">
                  <Presentation size={12} />
                </span>
                <span className="dd-mono">DK-2841</span>
              </span>
            }
            tabs={[
              { value: "visao", label: "Visão geral" },
              { value: "slides", label: "Slides", count: 12 },
              { value: "material", label: "Material", count: 3 },
              { value: "versoes", label: "Versões" },
              { value: "comentarios", label: "Comentários", count: 1 },
            ]}
          />
          <Group gap="sm">
            <Text size="sm" className="dd-muted">
              Diretoria · Acme
            </Text>
            <Status tone="ok">No prazo</Status>
          </Group>
        </div>
        <Panel>
          <Group gap="md">
            <ActionIcon size="lg" aria-label="Voltar">
              <ArrowLeft size={16} />
            </ActionIcon>
            <div>
              <Text size="xs" className="dd-muted">
                Decks <CaretRight size={10} /> DK-2841
              </Text>
              <Title order={3}>Plano de expansão 2027</Title>
            </div>
          </Group>
        </Panel>
        <Panel
          title="Dentro de um painel"
          actions={
            <PillTabs
              value={inner}
              onChange={setInner}
              tabs={[
                { value: "resumo", label: "Resumo", icon: <ChartBar size={16} /> },
                { value: "pessoas", label: "Pessoas", icon: <Users size={16} />, count: 4 },
                { value: "arquivos", label: "Arquivos", icon: <Paperclip size={16} /> },
              ]}
            />
          }
        >
          <Text size="sm" className="dd-muted">
            Sobre o painel a barra vira cinza; com ícone, ele vem antes do rótulo.
          </Text>
        </Panel>
      </Stack>
    </Section>
  );
}

/* ——— Voz ——— */

// O `docs/marca.md` lido direto do arquivo: a cozinha não guarda uma segunda cópia do texto.
// Cada `##` vira um painel; link relativo (para o README) vira texto, que aqui não abre nada.
const VOICE = (() => {
  const md = marca.replace(/\[([^\]]+)\]\((?!https?:)[^)]*\)/g, "$1");
  const [head = "", ...parts] = md.split(/^## /m);
  const html = (text: string) =>
    (marked.parse(text, { async: false }) as string)
      .replaceAll("<table>", '<div class="dd-table-wrap"><table class="dd-table">')
      .replaceAll("</table>", "</table></div>");
  return {
    intro: html(head.replace(/^# .*$/m, "")),
    parts: parts.map((part) => {
      const [title = "", ...body] = part.split("\n");
      return { title, html: html(body.join("\n")) };
    }),
  };
})();

function Voice() {
  return (
    <Section
      id="voz"
      title="Voz e personalidade"
      note={<span className="ks-doc-intro" dangerouslySetInnerHTML={{ __html: VOICE.intro }} />}
    >
      <div className="ks-voice">
        {VOICE.parts.map((part) => (
          <Panel key={part.title} title={part.title} className="ks-doc">
            <div dangerouslySetInnerHTML={{ __html: part.html }} />
          </Panel>
        ))}
      </div>
    </Section>
  );
}

/* ——— Conversa ——— */

interface Said {
  from: "dudoo" | "you";
  text: string;
}

function Conversation() {
  const [said, setSaid] = useState<Said[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const wall = useRef<HTMLDivElement>(null);

  // A conversa rola por dentro até a última fala; a página fica onde está.
  useEffect(() => {
    const el = wall.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [said, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setSaid((s) => [...s, { from: "you", text }]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setSaid((s) => [
        ...s,
        { from: "dudoo", text: "Anotado. Ajusto o roteiro e te mostro antes de gerar." },
      ]);
    }, 1400);
  };

  return (
    <Section
      id="conversa"
      title="Conversa"
      note="Quem fala é o DuDoo: o rosto dele na fala, com a expressão do momento (mood), e o brilho na ação. Aviso do sistema não é fala dele."
    >
      <section className="dd-panel ks-chat">
        <header className="ks-chat-head">
          <Group gap={10} wrap="nowrap">
            <DuDoo size={36} />
            <div>
              <Text fw={600} lh={1.2}>
                DuDoo
              </Text>
              <Text size="xs" className="dd-muted">
                2 de 4 · Roteiro
              </Text>
            </div>
          </Group>
          <Button size="xs" variant="default">
            Briefing
          </Button>
        </header>

        <DuDooWall className="ks-chat-wall" ref={wall}>
          <ChatBubble from="dudoo" mood="empolgado">
            Oi! Me conta a ideia: pra quem é o deck e o que ele precisa mudar na cabeça de quem
            assiste?
          </ChatBubble>
          <ChatBubble from="you">
            Resultados do 3º trimestre pra diretoria. A margem caiu, mas quero mostrar que o plano
            está funcionando.
          </ChatBubble>
          <div className="ks-chat-notice">
            <Warning size={14} />
            <span>
              Não deu para ler <span className="dd-nobreak">vendas-q3.xlsx</span>. Envie de novo em
              .xlsx ou .csv.
            </span>
          </div>
          <ChatBubble from="you">Mandei de novo, agora em .csv.</ChatBubble>
          <ChatBubble from="dudoo" mood="focado">
            Li a planilha. Três pontos pedem atenção; o maior é a margem em agosto.
          </ChatBubble>
          <ChatBubble from="dudoo" avatar={false}>
            <Stack gap="xs">
              <span>Proponho 12 slides, nesta ordem:</span>
              <ol className="ks-chat-list">
                <li>O trimestre em um número</li>
                <li>Onde a margem caiu, e por quê</li>
                <li>O que o plano já mudou</li>
                <li>Os próximos 90 dias</li>
              </ol>
              <Group gap="xs">
                <Button size="xs" leftSection={<Sparkle size={14} weight="fill" />}>
                  Gerar 12 slides
                </Button>
                <Button size="xs" variant="default">
                  Ajustar roteiro
                </Button>
              </Group>
            </Stack>
          </ChatBubble>
          {said.map((m, i) => (
            <ChatBubble key={i} from={m.from}>
              {m.text}
            </ChatBubble>
          ))}
          {typing && (
            <ChatBubble from="dudoo" mood="pensando">
              <Loader
                size="xs"
                type="dots"
                color="var(--dd-ink-faint)"
                aria-label="O DuDoo está escrevendo"
              />
            </ChatBubble>
          )}
        </DuDooWall>

        <form
          className="ks-chat-foot"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Tooltip label="Anexar material">
            <ActionIcon size="lg" variant="subtle" color="gray" aria-label="Anexar material">
              <Paperclip size={18} />
            </ActionIcon>
          </Tooltip>
          <Textarea
            flex={1}
            autosize
            minRows={1}
            maxRows={4}
            placeholder="Escreva para o DuDoo"
            aria-label="Mensagem para o DuDoo"
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <ActionIcon
            type="submit"
            size="lg"
            color="inverse"
            variant="filled"
            aria-label="Enviar"
            disabled={!draft.trim() || typing}
          >
            <ArrowUp size={18} />
          </ActionIcon>
        </form>
      </section>
    </Section>
  );
}

/* ——— Cartões ——— */

function Cards() {
  return (
    <Section
      id="cartoes"
      title="Cartões"
      note="Painel branco; bloco cinza dentro; invertido para a IA; acento para o que vem a seguir."
    >
      <div className="ks-cards">
        <Panel
          title="Progresso do deck"
          actions={
            <span className="ks-big-num">
              78<small>%</small>
            </span>
          }
          className="ks-span-2"
        >
          <Text size="sm" className="dd-muted" mt={-12} mb="md">
            Roteiro aprovado em 24 de setembro
          </Text>
          <Steps
            steps={[
              { label: "Material", when: "24 set", state: "done" },
              { label: "Roteiro", when: "24 set", state: "done" },
              { label: "Rascunho", when: "25 set", state: "done" },
              { label: "Design", when: "dia 2", state: "current" },
              { label: "Revisão", when: "3 out", state: "todo" },
              { label: "Apresentar", when: "8 out", state: "todo" },
            ]}
          />
        </Panel>

        <section className="dd-panel dd-inverse">
          <Group justify="space-between" mb="sm">
            <Group gap={10}>
              <DuDoo />
              <Text fw={600}>DuDoo</Text>
            </Group>
            <span className="dd-mono dd-muted">há 2 min</span>
          </Group>
          <Title order={3} mb={6}>
            O deck está no prazo
          </Title>
          <Text size="sm" className="dd-muted" mb="lg">
            Falta o design dos slides 8 a 12. Nada bloqueia a revisão de quinta.
          </Text>
          <Group justify="space-between">
            <Text size="xs" className="dd-muted">
              Confiança
            </Text>
            <Text size="xs" c="var(--dd-accent)" className="dd-num">
              91%
            </Text>
          </Group>
          <div style={{ marginTop: 6 }}>
            <Dots value={0.91} />
          </div>
        </section>

        <Panel
          title="Revisão"
          actions={
            <Button variant="subtle" size="compact-sm" rightSection={<CaretRight size={12} />}>
              Abrir
            </Button>
          }
          className="ks-span-2"
        >
          <div className="ks-stats">
            <div className="dd-accent ks-stat-hero">
              <span className="ks-check">
                <CheckCircle size={22} weight="fill" />
              </span>
              <div>
                <div className="dd-stat-value">12</div>
                <Text size="sm">Slides prontos</Text>
              </div>
            </div>
            <Stat label="Imagens" value="18" hint="↗ 4 hoje" />
            <Stat label="Transbordos" value="0" hint="tudo cabe" />
          </div>
        </Panel>

        <Panel
          title="Detalhes"
          actions={
            <ActionIcon aria-label="Editar detalhes">
              <PencilSimple size={16} />
            </ActionIcon>
          }
        >
          <Block className="dd-rows" style={{ paddingBlock: 4 }}>
            {[
              ["Público", "Diretoria"],
              ["Formato", "16:9 · 12 slides"],
              ["Modelo", "DeckDoo padrão"],
              ["Idioma", "Português"],
            ].map(([k, v]) => (
              <div key={k} className="dd-row">
                <Text size="sm" className="dd-faint" w={90}>
                  {k}
                </Text>
                <Text size="sm" fw={500}>
                  {v}
                </Text>
              </div>
            ))}
          </Block>
        </Panel>

        <Panel title="Portfólio" className="ks-span-2">
          <div className="ks-stats ks-stats-4">
            <Stat active label="Decks ativos" value="12" hint="3 compartilhados" />
            <Stat label="Em rascunho" value="4" hint="↗ 2 esta semana" />
            <Stat label="Para revisar" value="3" hint="2 dias na fila" />
            <Stat label="Apresentados" value="27" hint="este ano" />
          </div>
        </Panel>

        <Panel
          title="Equipe"
          actions={
            <ActionIcon aria-label="Convidar">
              <Users size={16} />
            </ActionIcon>
          }
        >
          <Block className="dd-rows" style={{ paddingBlock: 4 }}>
            {[
              ["MW", "Marcus Webb", "Dono", "ink"],
              ["ER", "Elena Ruiz", "Design", "purple"],
              ["TB", "Tasha Brooks", "Revisão", "cyan"],
            ].map(([ini, name, role, color]) => (
              <div key={name} className="dd-row">
                <Avatar size={34} radius="xl" color={color}>
                  {ini}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500}>
                    {name}
                  </Text>
                  <Text size="xs" className="dd-muted">
                    {role}
                  </Text>
                </div>
                <ActionIcon variant="subtle" color="gray" aria-label={`Opções de ${name}`}>
                  <DotsThree size={16} />
                </ActionIcon>
              </div>
            ))}
          </Block>
          <div className="dd-accent ks-next">
            <Group gap="sm" wrap="nowrap">
              <span className="ks-ai-badge ks-ai-badge-inv">
                <Presentation size={16} />
              </span>
              <div>
                <Text size="sm" fw={600}>
                  Apresentação
                </Text>
                <Text size="xs">Qui, 8 out · 10:30</Text>
              </div>
            </Group>
            <button type="button" className="ks-next-link">
              Sala Diretoria <CaretRight size={14} />
            </button>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

/* ——— Tabela ——— */

const DECKS = [
  [
    "DK-2796",
    "Resultados do 3º trimestre",
    "Financeiro",
    "Revisão",
    "danger",
    "Transborda no slide 4",
    "1 out",
  ],
  [
    "DK-2848",
    "Onboarding de clientes",
    "Sucesso",
    "Roteiro",
    "attention",
    "Falta material",
    "30 set",
  ],
  ["DK-2811", "Plano de expansão 2027", "Diretoria", "Design", "ok", "—", "8 out"],
  ["DK-2852", "Treinamento de vendas", "Comercial", "Rascunho", "info", "Gerando slide 7", "5 out"],
  ["DK-2803", "Pitch para investidores", "Fundadores", "Pronto", "neutral", "—", "12 out"],
] as const;

/* ——— Chat ——— */

/** A espera do DuDoo: ele olha a sua fala e só então pensa (`useReadThenThink`). */
function Waiting() {
  const mood = useReadThenThink();
  return (
    <DuDooSays mood={mood} live>
      <Typing />
    </DuDooSays>
  );
}

function ChatParts() {
  const [round, setRound] = useState(0);
  // As cinco primeiras falas já estão lá ao abrir (aparecem prontas); as outras chegam depois e
  // entram subindo.
  const [shown, setShown] = useState(5);
  useEffect(() => {
    setShown(5);
    const ids = [
      window.setTimeout(() => setShown(6), 900),
      window.setTimeout(() => setShown(7), 1800),
    ];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [round]);

  const lines: ReactNode[] = [
    <DuDooSays key="0" live={false}>
      Oi! Me conta a ideia do deck.
    </DuDooSays>,
    <YouSay key="1">Resultados do 3º trimestre pra diretoria.</YouSay>,
    <SystemNotice key="2">
      Não deu para ler <span className="dd-nobreak">vendas-q3.xlsx</span>.
    </SystemNotice>,
    <YouSay key="3">Mandei de novo, agora em .csv.</YouSay>,
    <DuDooSays key="4" mood="curioso" live={false}>
      Li a planilha. A margem de agosto é o ponto: quer que ela abra o deck?
    </DuDooSays>,
    <YouSay key="5">Quero.</YouSay>,
    <Waiting key="6" />,
  ];

  return (
    <Section
      id="chat"
      title="Chat"
      note="As falas sobre o ChatBubble: só o rosto da última fala do DuDoo está vivo. A espera olha a sua fala antes de pensar, e a fala que chega com a conversa aberta entra subindo."
    >
      <Panel
        title="Uma conversa curta"
        actions={
          <Button size="xs" variant="default" onClick={() => setRound((r) => r + 1)}>
            Tocar de novo
          </Button>
        }
      >
        <ChatEnterScope key={round}>
          <DuDooWall className="ks-chat-wall ks-chat-short">
            {lines.slice(0, shown).map((line, i) => (
              <Enter key={i}>{line}</Enter>
            ))}
          </DuDooWall>
        </ChatEnterScope>
      </Panel>
    </Section>
  );
}

/* ——— Acesso ——— */

// O app em que a lista aparece (`marketing`) sai dela: ficam o Slides e o externo.
const SERVICES: readonly SuiteService[] = [
  { slug: "slides", kind: "app", name: "DeckDoo Slides", href: "#acesso" },
  { slug: "marketing", kind: "app", name: "DeckDoo Marketing", href: "#acesso" },
  { slug: "crm", kind: "external", name: "CRM da agência", href: "https://example.com" },
];

function Suite() {
  // A pessoa vê o tema que o Mantine aplica; trocar aqui é o `setColorScheme` que o app faria
  // na hora, antes de gravar a escolha no control plane.
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const appearance = colorScheme;
  return (
    <Section
      id="suite"
      title="Suíte"
      note={`O cabeçalho dos apps de editor (${SUITE_HEADER_HEIGHT} px, sem borda): o menu de apps, a marca, as abas e o canto da pessoa. A aparência do menu troca o tema da cozinha, como o app trocaria o do Mantine antes de gravar no control plane.`}
    >
      <div className="ks-suite">
        <SuiteHeader
          start={<AppSwitcher services={SERVICES} currentSlug="slides" />}
          brand={
            <a href="#suite" aria-label="DeckDoo, ir para o início">
              <Logo variant="type" height={24} label="DeckDoo" />
            </a>
          }
          tabs={
            <>
              <a href="#suite" className="dd-tab" aria-current="page">
                Decks
              </a>
              <a href="#suite" className="dd-tab">
                Modelos
              </a>
            </>
          }
          end={
            <UserMenu
              name="Anderson Fonseca"
              email="anderson@agencia.com"
              accountUrl="#suite"
              appearance={{ value: appearance, onChange: setColorScheme }}
              footer="Versão de exemplo"
              onSignOut={() => undefined}
            />
          }
        />
      </div>
    </Section>
  );
}

function Apps() {
  return (
    <Section
      id="apps"
      title="Apps"
      note="Estudo, ainda fora do pacote: o ícone de cada app da suíte e a barra que leva de um app ao outro."
    >
      <AppsStudy />
    </Section>
  );
}

function Access() {
  return (
    <Section
      id="acesso"
      title="Acesso"
      note="A moldura das telas de status e a negação de acesso. Os botões e a lista de apps são do app; o cadeado só aparece nas negações (não em UNAVAILABLE nem UNKNOWN)."
    >
      <div className="ks-screen">
        <StatusScreen component="div">
          <AccessDenied
            code="NOT_ENTITLED"
            signedInAs={{ email: "ana@agencia.com", tenant: "Agência Flor" }}
            services={<AppList services={SERVICES} currentSlug="marketing" />}
            actions={<Button>Sair</Button>}
            detail="NOT_ENTITLED"
          />
        </StatusScreen>
      </div>
      <Group gap="sm" mt="lg">
        {/* Aqui o "login" é uma aba em branco, e voltar para esta já confere e fecha o modal. */}
        <Button
          variant="default"
          onClick={() => {
            noteSessionOk();
            noteUnauthorized();
          }}
        >
          Simular a sessão que caiu
        </Button>
        <Text size="sm" className="dd-muted">
          O <code>SessionExpiredModal</code>: a sessão caiu com a tela aberta.
        </Text>
      </Group>
      <SessionExpiredModal
        loginHref={() => "about:blank"}
        checkSession={() => Promise.resolve()}
        onResumed={() => undefined}
      />
    </Section>
  );
}

function TableSection() {
  return (
    <Section id="tabela" title="Tabela">
      <Panel
        title={
          <div>
            <Title order={3}>Pedem atenção</Title>
            <Text size="sm" className="dd-muted">
              5 decks · atualizado há 6 minutos
            </Text>
          </div>
        }
        actions={
          <Group gap="xs">
            <Badge variant="filled" leftSection={<Sparkle size={11} weight="fill" />}>
              Ordenado pelo DuDoo
            </Badge>
            <ActionIcon aria-label="Mais">
              <DotsThree size={16} />
            </ActionIcon>
          </Group>
        }
      >
        <div className="dd-table-wrap">
          <table className="dd-table">
            <thead>
              <tr>
                <th>Deck</th>
                <th>Título</th>
                <th>Etapa</th>
                <th>Pendência</th>
                <th>Para</th>
              </tr>
            </thead>
            <tbody>
              {DECKS.map(([id, title, who, stage, tone, issue, due]) => (
                <tr key={id}>
                  <td className="dd-mono">{id}</td>
                  <td>
                    <Text size="sm" fw={500}>
                      {title}
                    </Text>
                    <Text size="xs" className="dd-muted">
                      {who}
                    </Text>
                  </td>
                  <td>
                    <Status tone={tone}>{stage}</Status>
                  </td>
                  <td className="dd-muted">{issue}</td>
                  <td className="dd-mono">{due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Group justify="space-between" mt="md">
          <Text size="sm" className="dd-faint">
            Mostrando os 5 decks
          </Text>
          <Button variant="subtle" size="compact-sm" rightSection={<CaretRight size={12} />}>
            Ver todos
          </Button>
        </Group>
      </Panel>
    </Section>
  );
}

/* ——— Camadas ——— */

/* ——— Filtros ——— */

const DECK_STATES = [
  { value: "rascunho", label: "Rascunho" },
  { value: "revisao", label: "Em revisão" },
  { value: "aprovado", label: "Aprovado" },
  { value: "arquivado", label: "Arquivado" },
];

const PEOPLE = [
  { value: "af", label: "Anderson Fonseca", group: "Diretoria" },
  { value: "bl", label: "Beatriz Lima", group: "Diretoria" },
  { value: "cm", label: "Caio Martins", group: "Marketing" },
  { value: "dr", label: "Débora Rocha", group: "Marketing" },
  { value: "ep", label: "Elisa Prado", group: "Marketing" },
  { value: "fs", label: "Fábio Souza", group: "Vendas" },
  { value: "gt", label: "Gabriela Teles", group: "Vendas" },
  { value: "hn", label: "Hugo Nunes", group: "Vendas" },
  { value: "iv", label: "Íris Vidal", group: "Vendas" },
];

function Filters() {
  const [state, setState] = useState<string | null>("revisao");
  const [people, setPeople] = useState<string[]>([]);
  const [period, setPeriod] = useState<FilterPeriod>({ from: null, to: null });
  const [text, setText] = useState("");
  const year = new Date().getFullYear();
  return (
    <Section
      id="filtros"
      title="Filtros"
      note="Sempre em linha, nunca um formulário. O chip tracejado convida; com valor, o acento suave e o ×. Pessoas tem mais de 8 opções: ganha a busca e os grupos."
    >
      <Panel>
        <FilterBar
          end={
            <>
              <span className="dd-num">24 decks</span>
              <Button size="compact-sm" variant="subtle" color="gray">
                Mais recentes
              </Button>
            </>
          }
        >
          <FilterMenu
            kind="single"
            label="Estado"
            options={DECK_STATES}
            value={state}
            onChange={setState}
          />
          <FilterMenu
            kind="multi"
            label="Pessoas"
            options={PEOPLE}
            value={people}
            onChange={setPeople}
          />
          <FilterMenu
            kind="period"
            label="Período"
            value={period}
            onChange={setPeriod}
            shortcuts={[
              ...periodShortcuts(),
              { label: "Ano passado", value: yearPeriod(year - 1) },
            ]}
          />
          <FilterMenu
            kind="text"
            label="Título"
            value={text}
            onChange={setText}
            placeholder="Contém…"
          />
          <FilterChip label="Espaço" value="useAnder" disabled />
        </FilterBar>
      </Panel>
    </Section>
  );
}

/* ——— Espera ——— */

/** O esqueleto de uma lista de decks, atrás da espera atrasada. */
function DeckListSkeleton() {
  const wait = useWait();
  return (
    <div className={wait.className} style={wait.style} role="status" aria-label="Carregando">
      <Stack gap="md">
        {[0, 1, 2, 3].map((i) => (
          <Group key={i} gap="md" wrap="nowrap">
            <Skeleton width={56} height={40} radius={10} />
            <Stack gap={8} style={{ flex: 1 }}>
              <Skeleton width={`${62 - i * 9}%`} height={12} />
              <Skeleton width={`${34 + (i % 2) * 10}%`} height={10} />
            </Stack>
            <Skeleton width={28} height={28} radius="50%" />
          </Group>
        ))}
      </Stack>
    </div>
  );
}

function Loading() {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = (ms: number) => {
    clearTimeout(timer.current);
    setLoading(true);
    setBusy(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setBusy(false);
    }, ms);
  };
  return (
    <Section
      id="espera"
      title="Espera"
      note="O esqueleto só aparece depois de 200 ms (useWait): a resposta rápida não pisca. O fio do topo (TopProgress) responde ao clique quando demora, sobre a coluna do conteúdo."
    >
      <TopProgress active={busy} />
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Panel
          title="Lista"
          actions={
            <Group gap="xs">
              <Button size="compact-sm" variant="default" onClick={() => run(120)}>
                Rápida
              </Button>
              <Button size="compact-sm" onClick={() => run(2200)}>
                Demorada
              </Button>
            </Group>
          }
        >
          {loading ? (
            <DeckListSkeleton />
          ) : (
            <Stack gap="xs">
              {["Plano de expansão 2027", "Resultados do 3º tri", "Onboarding de vendas"].map(
                (title) => (
                  <Group key={title} gap="md" wrap="nowrap">
                    <Presentation size={20} />
                    <Text size="sm">{title}</Text>
                  </Group>
                ),
              )}
            </Stack>
          )}
        </Panel>
        <Panel title="Os traços">
          <Stack gap="sm">
            <Group gap="sm" wrap="nowrap">
              <Skeleton width={36} height={36} radius="50%" />
              <Stack gap={6} style={{ flex: 1 }}>
                <Skeleton width="50%" height={12} />
                <Skeleton width="30%" height={10} />
              </Stack>
            </Group>
            <Skeleton height={90} radius={14} />
            <Text size="xs" className="dd-muted">
              Skeleton: largura, altura e canto. Decorativo; quem anuncia a espera é o contêiner.
            </Text>
          </Stack>
        </Panel>
      </SimpleGrid>
    </Section>
  );
}

function Layers() {
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  return (
    <Section id="camadas" title="Camadas" note="Modal, menu e dica.">
      <Panel>
        <Group gap="sm">
          <Button leftSection={<Sparkle size={16} weight="fill" />} onClick={() => setOpen(true)}>
            Abrir modal
          </Button>
          <Menu position="bottom-start" radius="lg" shadow="lg" width={220}>
            <Menu.Target>
              <Button variant="default" rightSection={<CaretDown size={14} />}>
                Menu
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Deck</Menu.Label>
              <Menu.Item leftSection={<Copy size={16} />}>Duplicar</Menu.Item>
              <Menu.Item leftSection={<ShareNetwork size={16} />}>Compartilhar</Menu.Item>
              <Menu.Item leftSection={<Export size={16} />} rightSection={<Kbd size="xs">⌘E</Kbd>}>
                Exportar
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<Archive size={16} />}>Arquivar</Menu.Item>
              <Menu.Item color="coral" leftSection={<Trash size={16} />}>
                Excluir
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Tooltip label="Envie PDF, PPTX, DOCX ou imagens">
            <Button variant="default" leftSection={<UploadSimple size={16} />}>
              Passe o mouse
            </Button>
          </Tooltip>
        </Group>
      </Panel>

      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        size={540}
        title={
          <div>
            <Title order={3}>Deixar o DuDoo refazer o slide 4?</Title>
            <Text size="sm" className="dd-muted" mt={4}>
              O texto muda, então a Elena aprova antes de o deck sair.
            </Text>
          </div>
        }
      >
        <Block>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={600}>
              Mudanças no slide 4
            </Text>
            <span className="dd-mono dd-muted">v2 → v3</span>
          </Group>
          <div className="dd-rows">
            {[
              ["+", "TÍTULO · 6 PALAVRAS", "Era 14; agora cabe em uma linha"],
              ["+", "GRÁFICO · BARRAS", "Troca a tabela pelos números do trimestre"],
              ["~", "NOTAS · REV 3", "Roteiro do apresentador atualizado"],
            ].map(([sign, head, sub]) => (
              <div key={head} className="dd-row" style={{ alignItems: "flex-start" }}>
                <span className={sign === "+" ? "ks-diff-add" : "ks-diff-mod"}>
                  {sign === "+" ? <Plus size={12} weight="bold" /> : <PencilSimple size={12} />}
                </span>
                <div>
                  <Text size="sm" ff="monospace">
                    {head}
                  </Text>
                  <Text size="xs" className="dd-muted">
                    {sub}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Block>
        <Stack gap="xs" mt="md">
          <Checkbox
            checked={first}
            onChange={(e) => setFirst(e.currentTarget.checked)}
            label="Pedir aprovação da Elena Ruiz"
          />
          <Checkbox
            checked={second}
            onChange={(e) => setSecond(e.currentTarget.checked)}
            label="Conferir o deck inteiro de novo"
          />
        </Stack>
        <Group justify="space-between" mt="lg">
          <Text size="xs" className="dd-faint">
            A v2 fica no histórico
          </Text>
          <Group gap="sm">
            <Button variant="default" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              leftSection={<Sparkle size={16} weight="fill" />}
              onClick={() => setOpen(false)}
            >
              Aplicar
            </Button>
          </Group>
        </Group>
      </Modal>
    </Section>
  );
}

/* ——— Tela exemplo ——— */

function Example() {
  return (
    <Section
      id="tela"
      title="Tela exemplo"
      note="As peças juntas: cabeçalho de página, número grande e lista."
    >
      <div className="ks-example">
        <header className="ks-example-head">
          <Group gap="sm">
            <Title order={1} fz={30}>
              Bom dia, Anderson
            </Title>
            <Badge variant="filled" leftSection={<Warning size={12} />}>
              3 decks pedem atenção
            </Badge>
          </Group>
          <Group gap="sm">
            <TextInput
              placeholder="Buscar decks"
              leftSection={<MagnifyingGlass size={16} />}
              rightSection={<Kbd size="xs">⌘K</Kbd>}
              rightSectionWidth={52}
              w={240}
            />
            <ActionIcon size="lg" aria-label="Notificações">
              <Bell size={18} />
            </ActionIcon>
            <Button color="inverse" size="md" leftSection={<Plus size={16} />}>
              Novo deck
            </Button>
          </Group>
        </header>
        <div className="ks-example-grid">
          <div className="dd-panel ks-hero">
            <div className="ks-hero-art">
              <span className="ks-chip">
                <Presentation size={12} /> <span className="dd-mono">DK-2811</span>
              </span>
              <Status tone="attention">Em revisão</Status>
            </div>
            <div className="ks-hero-card">
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Title order={4}>Plano de expansão 2027</Title>
                  <Text size="xs" className="dd-muted">
                    Diretoria · 12 slides
                  </Text>
                </div>
                <ActionIcon aria-label="Abrir deck">
                  <ArrowUpRight size={16} />
                </ActionIcon>
              </Group>
              <Group gap="sm" mt="sm" wrap="nowrap">
                <Progress value={78} color="inverse" radius="xl" style={{ flex: 1 }} />
                <Text size="xs" className="dd-num">
                  78%
                </Text>
              </Group>
            </div>
          </div>
          <Panel
            title="Portfólio"
            actions={
              <SegmentedControl
                size="xs"
                data={["Hoje", "7 dias", "30 dias"]}
                defaultValue="7 dias"
              />
            }
          >
            <div className="ks-stats ks-stats-4">
              <Stat active label="Decks ativos" value="12" hint="3 compartilhados" />
              <Stat label="Em rascunho" value="4" hint="↗ 2 esta semana" />
              <Stat label="Para revisar" value="3" hint="2 dias na fila" />
              <Stat label="Imagens" value="148" hint="na Biblioteca" />
            </div>
          </Panel>
        </div>
        <Group gap="sm" mt="md">
          <Images size={16} />
          <Text size="sm" className="dd-muted">
            Ícones: Phosphor, traço regular a 16–18 px; preenchido só no brilho das ações de IA.
          </Text>
        </Group>
      </div>
    </Section>
  );
}

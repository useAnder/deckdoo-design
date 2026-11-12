import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  ActionIcon,
  Group,
  Popover,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  Browser,
  CalendarBlank,
  DotsNine,
  Handshake,
  House,
  Lightbulb,
  Megaphone,
  Presentation,
  ShoppingBag,
  Star,
  type IconProps,
} from "@phosphor-icons/react";
import {
  APP_ICON_SHAPES,
  BRAND,
  Logo,
  LOCKUP_SLIDES,
  NavItem,
  Status,
  SuiteAppIcon,
  roundedRectPath,
  type AppIconShape,
} from "@deckdoo/design";

/*
 * O estudo que levou ao ícone de cada app e ao trilho de apps. O escolhido está no pacote
 * (`SuiteAppIcon`, `SuiteRail`, regra em `docs/marca.md`); aqui ficam as opções, como teste.
 */

type MarketingShape = "megafone" | "aviao" | "marcador" | "pilha";
type PagesShape = "navegador" | "blocos" | "layout" | "janelas";
type Shape = "slide" | "agenda" | "sacola" | MarketingShape | PagesShape;

interface StudyApp {
  slug: string;
  name: string;
  /** O acento do app. */
  color: string;
  /** O acento já está no app, ou é sugestão deste estudo? */
  colorSet: boolean;
  abbr: string;
  glyph: ComponentType<IconProps>;
  shape: Shape;
}

const APPS: StudyApp[] = [
  {
    slug: "slides",
    name: "Slides",
    color: BRAND.lime,
    colorSet: true,
    abbr: "Sl",
    glyph: Presentation,
    shape: "slide",
  },
  {
    slug: "marketing",
    name: "Marketing",
    color: BRAND.purple,
    colorSet: true,
    abbr: "Mk",
    glyph: Megaphone,
    shape: "marcador",
  },
  {
    slug: "pages",
    name: "Pages",
    color: BRAND.cyan,
    colorSet: true,
    abbr: "Pg",
    glyph: Browser,
    shape: "blocos",
  },
  {
    slug: "works",
    name: "Works",
    color: BRAND.orange,
    colorSet: false,
    abbr: "Wk",
    glyph: Handshake,
    shape: "agenda",
  },
  {
    slug: "commerce",
    name: "Commerce",
    color: BRAND.coral,
    colorSet: false,
    abbr: "Cm",
    glyph: ShoppingBag,
    shape: "sacola",
  },
];

const CURRENT = "slides";

type Look = "cor" | "sigla" | "objeto" | "olhos";

const LOOKS: { value: Look; label: string; idea: string; good: string; bad: string }[] = [
  {
    value: "cor",
    label: "Cor",
    idea: "O mascote de sempre, cada app na sua cor.",
    good: "App novo é escolher a cor; é o AppIcon de hoje com o acento do app.",
    bad: "Só a cor separa um do outro: lado a lado são cinco quadrados iguais, e quem confunde cor se perde.",
  },
  {
    value: "sigla",
    label: "Sigla",
    idea: "A regra do lockup (o nome é texto) levada ao ícone: duas letras na Figtree.",
    good: "App novo é digitar. Forma e cor separam.",
    bad: "Lê como tabela periódica, não como DeckDoo, e a sigla não diz o que o app faz.",
  },
  {
    value: "objeto",
    label: "Objeto",
    idea: "O que o app faz: o slide, o megafone, o navegador, o aperto de mão, a sacola.",
    good: "Reconhece na hora, como os ícones do Google.",
    bad: "O DeckDoo some do ícone, e o traço é do Phosphor: igual ao de qualquer item de menu.",
  },
  {
    value: "olhos",
    label: "Olhos",
    idea: "O objeto do app com os olhos do DuDoo, o da direita mordendo a borda.",
    good: "Forma, cor e família juntas: dá para saber que é DeckDoo e qual app é.",
    bad: "Cada app pede um desenho, e a marca.md ganha uma regra: o olhar sai do corpo do DuDoo.",
  },
];

/** A tinta sobre a cor do app: escura nas claras, papel nas escuras (o mesmo corte da cozinha). */
function inkOn(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
  return lum > 0.3 ? BRAND.ink : BRAND.paper;
}

/* ——— O ícone ——— */

function StudyIcon({ app, look, size }: { app: StudyApp; look: Look; size: number }) {
  if (look === "olhos") {
    // O do pacote, com o desenho do estudo (as alternativas de Marketing e Pages).
    return (
      <SuiteAppIcon
        app={{ slug: app.slug, name: app.name, color: app.color, shape: SHAPES[app.shape] }}
        size={size}
      />
    );
  }
  const ink = inkOn(app.color);
  const Glyph = app.glyph;
  let inner: ReactNode;
  if (look === "cor") {
    inner = (
      <Logo
        variant="mark"
        on={ink === BRAND.ink ? "light" : "dark"}
        height={Math.round(size * 0.56)}
        color={ink}
      />
    );
  } else if (look === "sigla") {
    inner = (
      <span className="ks-apps-abbr" style={{ fontSize: size * 0.4 }}>
        {app.abbr}
      </span>
    );
  } else {
    inner = <Glyph size={Math.round(size * 0.58)} weight="fill" color={ink} />;
  }
  return (
    <span
      className="ks-apps-icon"
      role="img"
      aria-label={app.name}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: app.color,
        color: ink,
      }}
    >
      {inner}
    </span>
  );
}

/*
 * Os desenhos de olhos: os escolhidos vêm do pacote (`APP_ICON_SHAPES`); as alternativas de
 * Marketing e Pages ficam aqui, no formato do pacote (`AppIconShape`). Peça ao lado dos olhos
 * vira orelha; embaixo deles, boca ou nariz.
 */

const rr = roundedRectPath;

function dot(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
}

const SHAPES: Record<Shape, AppIconShape> = {
  slide: APP_ICON_SHAPES.slides,
  agenda: APP_ICON_SHAPES.works,
  sacola: APP_ICON_SHAPES.commerce,

  // Marketing. Peça ao lado dos olhos vira orelha; embaixo deles, boca: o que acompanha o corpo
  // fica atrás dele (a pilha) ou é o próprio contorno (o bico do avião, o recorte do marcador).
  megafone: {
    pieces: [
      {
        kind: "body",
        d: "M2.5 8.6h3.2l12.6-6.3a2 2 0 0 1 2.9 1.8v15.8a2 2 0 0 1-2.9 1.8L5.7 15.4H2.5a1.5 1.5 0 0 1-1.5-1.5v-3.8a1.5 1.5 0 0 1 1.5-1.5z",
      },
    ],
    eyes: [11.6, 19.2],
    y: 11,
    r: 3.6,
  },
  aviao: {
    pieces: [{ kind: "body", d: "M1 9.4 22.8 1.2 15.6 22.8 11 13.6z" }],
    eyes: [9.2, 17.4],
    y: 9.2,
    r: 3.1,
  },
  marcador: APP_ICON_SHAPES.marketing,
  pilha: {
    pieces: [
      { kind: "body", d: rr(0.5, 4.8, 19.5, 18.7, 3.4) },
      { kind: "line", d: "M4.4 1.7h15a3 3 0 0 1 3 3v14.6", w: 2.4 },
    ],
    eyes: [8, 16.6],
    y: 12.4,
    r: 3.7,
  },

  // Pages
  navegador: {
    pieces: [
      { kind: "body", d: rr(0.5, 2.5, 22, 19, 3.2) },
      { kind: "cut", d: "M0.5 7.6H22.5", w: 1.5 },
      { kind: "hole", d: dot(3.7, 5.05, 0.95) + dot(6.5, 5.05, 0.95) },
    ],
    eyes: [8.6, 19],
    y: 14.2,
    r: 3.8,
  },
  // As seções da página: o menu fino em cima e o bloco grande (o hero) com os olhos.
  blocos: APP_ICON_SHAPES.pages,
  // O esqueleto de um site: o topo e a coluna recortados, os olhos no miolo.
  layout: {
    pieces: [
      { kind: "body", d: rr(0.5, 1.5, 22, 21, 3.2) },
      { kind: "cut", d: "M0.5 7.2H22.5M7.2 7.2V22.5", w: 1.5 },
    ],
    eyes: [12.2, 19.3],
    y: 14,
    r: 3.3,
  },
  // Um site é várias páginas: a janela da frente e a de trás, aparecendo pela borda.
  janelas: {
    pieces: [
      { kind: "body", d: rr(0.5, 5, 19.5, 18.5, 3.2) },
      { kind: "cut", d: "M0.5 10H20", w: 1.4 },
      { kind: "hole", d: dot(3.5, 7.5, 0.85) + dot(6.1, 7.5, 0.85) },
      { kind: "line", d: "M4.6 2.1h15a2.9 2.9 0 0 1 2.9 2.9v13.6", w: 2.4 },
    ],
    eyes: [8, 16.7],
    y: 15.6,
    r: 3.4,
  },
};

/* ——— As variações de Marketing e Pages ——— */

const MARKETING_SHAPES: { value: MarketingShape; label: string; note: string }[] = [
  { value: "megafone", label: "Megafone", note: "Divulgar: o clássico do marketing." },
  { value: "aviao", label: "Avião", note: "O aviãozinho de compartilhar: o post saindo." },
  {
    value: "marcador",
    label: "Salvar",
    note: "O marcador de salvar post. O recorte de baixo é a borda.",
  },
  { value: "pilha", label: "Carrossel", note: "Os cards em pilha, o de trás aparecendo por cima." },
];

const PAGES_SHAPES: { value: PagesShape; label: string; note: string }[] = [
  { value: "navegador", label: "Navegador", note: "A janela com a página: é site." },
  { value: "blocos", label: "Seções", note: "O menu fino em cima e o bloco grande da página." },
  {
    value: "layout",
    label: "Esqueleto",
    note: "O topo e a coluna de um site, como no construtor.",
  },
  { value: "janelas", label: "Páginas", note: "A janela da frente e a de trás: um site inteiro." },
];

/** O desenho escolhido para Marketing e Pages, guardado: o estudo e o trilho da página leem o mesmo. */
function useStudyApps() {
  const [marketing, setMarketing] = useLocalStorage<MarketingShape>({
    key: "dd-k-apps-marketing-v2",
    defaultValue: "marcador",
  });
  const [pages, setPages] = useLocalStorage<PagesShape>({
    key: "dd-k-apps-pages-v2",
    defaultValue: "blocos",
  });
  // Uma escolha guardada de um desenho que saiu volta ao padrão.
  const mk = MARKETING_SHAPES.some((o) => o.value === marketing) ? marketing : "marcador";
  const pg = PAGES_SHAPES.some((o) => o.value === pages) ? pages : "blocos";
  const apps = useMemo(
    () =>
      APPS.map((app) =>
        app.slug === "marketing"
          ? { ...app, shape: mk }
          : app.slug === "pages"
            ? { ...app, shape: pg }
            : app,
      ),
    [mk, pg],
  );
  return {
    apps,
    marketing: mk,
    setMarketing,
    pages: pg,
    setPages,
  };
}

/** Os apps com o desenho escolhido para Marketing e Pages. */
const AppsContext = createContext<StudyApp[]>(APPS);

function ShapePicker<S extends Shape>({
  app,
  options,
  value,
  onChange,
  chosen,
}: {
  app: StudyApp;
  options: { value: S; label: string; note: string }[];
  value: S;
  onChange: (value: S) => void;
  /** O desenho já decidido: leva o selo de escolhido. */
  chosen?: S;
}) {
  return (
    <div>
      <Group gap="sm" mb={6}>
        <Text fw={600} size="sm">
          {app.name}
        </Text>
      </Group>
      <div className="ks-apps-variants">
        {options.map((o) => (
          <UnstyledButton
            key={o.value}
            className="dd-panel ks-apps-variant"
            data-picked={o.value === value || undefined}
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
          >
            <Group gap={8} wrap="nowrap">
              <StudyIcon app={{ ...app, shape: o.value }} look="olhos" size={40} />
              <span className="ks-apps-variant-dark">
                <StudyIcon app={{ ...app, shape: o.value }} look="olhos" size={28} />
              </span>
            </Group>
            <Group gap={8} mt={8}>
              <Text size="sm" fw={600}>
                {o.label}
              </Text>
              {o.value === chosen && <Status tone="ok">Escolhido</Status>}
            </Group>
            <Text size="xs" className="dd-muted">
              {o.note}
            </Text>
          </UnstyledButton>
        ))}
      </div>
    </div>
  );
}

/* ——— O estudo ——— */

export function AppsStudy() {
  const [look, setLook] = useState<Look>("olhos");
  const { apps, marketing, setMarketing, pages, setPages } = useStudyApps();
  const appOf = (slug: string) => apps.find((a) => a.slug === slug)!;
  return (
    <AppsContext value={apps}>
      <Stack gap="xl">
        <div>
          <Group gap="xs" mb={8} align="baseline">
            <Text fw={600}>Ícones</Text>
            <Text size="sm" className="dd-muted">
              Quatro caminhos, nos tamanhos da barra (40, 28) e no escuro. Slides, Marketing e Pages
              estão no acento de cada app; Works e Commerce, numa cor de sugestão.
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {LOOKS.map((option) => (
              <div
                key={option.value}
                className="dd-panel ks-apps-look"
                data-picked={look === option.value || undefined}
              >
                <Group justify="space-between" mb={4}>
                  <Text fw={600} mr="auto">
                    {option.label}
                  </Text>
                  {option.value === "olhos" && <Status tone="ok">Escolhido</Status>}
                  <UnstyledButton className="ks-apps-pick" onClick={() => setLook(option.value)}>
                    {look === option.value ? "Nas barras abaixo" : "Ver nas barras"}
                  </UnstyledButton>
                </Group>
                <Text size="sm" mb="md">
                  {option.idea}
                </Text>
                <div className="ks-apps-row">
                  {apps.map((app) => (
                    <Tooltip
                      key={app.slug}
                      label={app.colorSet ? app.name : `${app.name} (cor de sugestão)`}
                    >
                      <span>
                        <StudyIcon app={app} look={option.value} size={40} />
                      </span>
                    </Tooltip>
                  ))}
                </div>
                <div className="ks-apps-row ks-apps-row-dark">
                  {apps.map((app) => (
                    <StudyIcon key={app.slug} app={app} look={option.value} size={28} />
                  ))}
                </div>
                <Text size="sm" mt="md">
                  <strong>A favor:</strong> {option.good}
                </Text>
                <Text size="sm" mt={4} className="dd-muted">
                  <strong>Contra:</strong> {option.bad}
                </Text>
              </div>
            ))}
          </SimpleGrid>
        </div>

        <div>
          <Group gap="xs" mb={8} align="baseline">
            <Text fw={600}>Olhos: Marketing e Pages</Text>
            <Text size="sm" className="dd-muted">
              Outros objetos para os dois. O escolhido entra nos ícones de cima e nas barras.
            </Text>
          </Group>
          <Stack gap="md">
            <ShapePicker
              app={appOf("marketing")}
              options={MARKETING_SHAPES}
              value={marketing}
              onChange={setMarketing}
              chosen="marcador"
            />
            <ShapePicker
              app={appOf("pages")}
              options={PAGES_SHAPES}
              value={pages}
              onChange={setPages}
              chosen="blocos"
            />
          </Stack>
        </div>

        <div>
          <Group gap="xs" mb={8} align="baseline" justify="space-between">
            <Group gap="xs" align="baseline">
              <Text fw={600}>Barra de apps</Text>
              <Text size="sm" className="dd-muted">
                Três lugares para os outros apps. Você está no Slides.
              </Text>
            </Group>
            <SegmentedControl
              size="xs"
              aria-label="Ícone nas barras"
              value={look}
              onChange={(v) => setLook(v as Look)}
              data={LOOKS.map((o) => ({ value: o.value, label: o.label }))}
            />
          </Group>
          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
            <RailMock look={look} />
            <RowMock look={look} />
            <GridMock look={look} />
          </SimpleGrid>
        </div>
      </Stack>
    </AppsContext>
  );
}

/* ——— As barras ——— */

function MockCard({
  title,
  idea,
  good,
  bad,
  extra,
  children,
}: {
  title: string;
  idea: string;
  good: string;
  bad: string;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ks-apps-mockcard">
      <Group justify="space-between" mb={4}>
        <Text fw={600}>{title}</Text>
        {extra}
      </Group>
      <Text size="sm" mb="sm">
        {idea}
      </Text>
      {children}
      <Text size="sm" mt="sm">
        <strong>A favor:</strong> {good}
      </Text>
      <Text size="sm" mt={4} className="dd-muted">
        <strong>Contra:</strong> {bad}
      </Text>
    </div>
  );
}

const NAV = [
  { icon: House, label: "Início" },
  { icon: Presentation, label: "Decks", count: 12 },
  { icon: Star, label: "Modelos" },
  { icon: Lightbulb, label: "Ideias", count: 3 },
  { icon: CalendarBlank, label: "Agenda" },
];

function MiniNav({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="ks-apps-mininav" data-collapsed>
        {NAV.map((n, i) => (
          <span
            key={n.label}
            className="dd-nav-item"
            data-active={i === 0 || undefined}
            aria-label={n.label}
          >
            <n.icon size={18} />
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="ks-apps-mininav">
      {NAV.map((n, i) => (
        <NavItem
          key={n.label}
          icon={<n.icon size={18} />}
          label={n.label}
          count={n.count}
          active={i === 0}
        />
      ))}
    </div>
  );
}

function MiniContent() {
  return (
    <div className="ks-apps-content" aria-hidden>
      <span className="ks-apps-line" style={{ width: "45%", height: 14 }} />
      <span className="ks-apps-line" style={{ width: "70%" }} />
      <span className="ks-apps-block" />
      <span className="ks-apps-block" style={{ height: 60 }} />
    </div>
  );
}

/** A: o trilho dos apps na borda da janela, sobre o fundo, fora do painel do app (imagem 5). */
function RailMock({ look }: { look: Look }) {
  const apps = useContext(AppsContext);
  return (
    <MockCard
      title="Trilho na borda"
      extra={<Status tone="ok">Escolhido</Status>}
      idea="Uma coluna fina na borda da janela, sobre o fundo: é da suíte, não do app. O painel do app fica ao lado."
      good="Sempre à vista e divulga os outros apps; um clique para trocar."
      bad="Come uns 56 px de largura para sempre, e com a barra do app recolhida são duas colunas de ícones lado a lado."
    >
      <div className="ks-apps-mock">
        <nav className="ks-apps-rail" aria-label="Apps da suíte">
          <span className="ks-apps-rail-suite">
            <Logo variant="mark" height={18} />
          </span>
          {apps.map((app) => (
            <Tooltip key={app.slug} label={app.name} position="right">
              <UnstyledButton
                className="ks-apps-rail-btn"
                data-current={app.slug === CURRENT || undefined}
                aria-current={app.slug === CURRENT ? "page" : undefined}
              >
                <StudyIcon app={app} look={look} size={30} />
              </UnstyledButton>
            </Tooltip>
          ))}
        </nav>
        <div className="ks-apps-side">
          <div className="ks-apps-side-head">
            <Logo app={LOCKUP_SLIDES} height={22} />
          </div>
          <MiniNav />
        </div>
        <MiniContent />
      </div>
    </MockCard>
  );
}

/** B: a fileira de apps no topo da barra do app; recolhida, fica só o app atual (imagens 1 e 2). */
function RowMock({ look }: { look: Look }) {
  const apps = useContext(AppsContext);
  const [collapsed, setCollapsed] = useState(false);
  const current = apps.find((a) => a.slug === CURRENT)!;
  const others = apps.filter((a) => a.slug !== CURRENT);
  return (
    <MockCard
      title="Fileira no topo da barra"
      idea="O ícone do app atual grande e os outros pequenos ao lado, no lugar do logo. Recolhida, fica só o atual."
      good="Não gasta largura, e a marca do app vira o primeiro ícone da fileira."
      bad="Some com a barra recolhida, e com mais de seis apps a fileira não cabe: pede um “mais”."
      extra={
        <Switch
          size="xs"
          label="Recolhida"
          checked={collapsed}
          onChange={(e) => setCollapsed(e.currentTarget.checked)}
        />
      }
    >
      <div className="ks-apps-mock ks-apps-mock-panel">
        <div className="ks-apps-side" data-collapsed={collapsed || undefined}>
          <div className="ks-apps-side-head">
            <div className="ks-apps-track">
              <Tooltip label={`${current.name} · você está aqui`}>
                <span className="ks-apps-track-current">
                  <StudyIcon app={current} look={look} size={collapsed ? 32 : 34} />
                </span>
              </Tooltip>
              {!collapsed &&
                others.map((app) => (
                  <Tooltip key={app.slug} label={app.name}>
                    <UnstyledButton className="ks-apps-track-btn" aria-label={app.name}>
                      <StudyIcon app={app} look={look} size={24} />
                    </UnstyledButton>
                  </Tooltip>
                ))}
            </div>
          </div>
          {!collapsed && (
            <Text size="xs" className="dd-muted ks-apps-side-sub">
              Slides · useAnder
            </Text>
          )}
          <MiniNav collapsed={collapsed} />
        </div>
        <MiniContent />
      </div>
    </MockCard>
  );
}

/** C: a grade atrás de um botão, ao lado do logo, como a do Google (imagem 6). */
function GridMock({ look }: { look: Look }) {
  const apps = useContext(AppsContext);
  const [open, setOpen] = useState(true);
  return (
    <MockCard
      title="Grade atrás do botão"
      idea="Um botão ao lado do logo abre a grade com todos os apps e o nome de cada um."
      good="Cabe qualquer número de apps, com nome; a barra fica como está (é o AppSwitcher de hoje, em grade)."
      bad="Fica escondido: quem não sabe dos outros apps não abre, e a suíte não se divulga."
    >
      <div className="ks-apps-mock ks-apps-mock-panel">
        <div className="ks-apps-side">
          <div className="ks-apps-side-head">
            <Logo app={LOCKUP_SLIDES} height={22} />
            <Popover
              opened={open}
              onChange={setOpen}
              position="bottom-start"
              offset={8}
              withinPortal={false}
              shadow="md"
              radius="lg"
            >
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  ml="auto"
                  aria-label="Trocar de app"
                  aria-expanded={open}
                  onClick={() => setOpen((o) => !o)}
                >
                  <DotsNine size={18} weight="bold" />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown className="ks-apps-grid">
                <Text size="xs" className="dd-eyebrow" mb={8}>
                  Seus apps
                </Text>
                <div className="ks-apps-grid-cells">
                  {apps.map((app) => (
                    <UnstyledButton
                      key={app.slug}
                      className="ks-apps-cell"
                      data-current={app.slug === CURRENT || undefined}
                      aria-current={app.slug === CURRENT ? "page" : undefined}
                    >
                      <StudyIcon app={app} look={look} size={36} />
                      <span>{app.name}</span>
                    </UnstyledButton>
                  ))}
                </div>
              </Popover.Dropdown>
            </Popover>
          </div>
          <MiniNav />
        </div>
        <MiniContent />
      </div>
    </MockCard>
  );
}

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  MantineProvider,
  Menu,
  Modal,
  Notification,
  Progress,
  Radio,
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
  Bell,
  CaretDown,
  CaretRight,
  ChartBar,
  CheckCircle,
  Copy,
  DotsThree,
  Export,
  FileText,
  House,
  Images,
  Info,
  MagnifyingGlass,
  Moon,
  Palette,
  PencilSimple,
  Play,
  Plus,
  Presentation,
  ShareNetwork,
  Sparkle,
  Stack as StackIcon,
  Sun,
  TextAa,
  Trash,
  UploadSimple,
  Users,
  Warning,
} from "@phosphor-icons/react";
import {
  AppIcon,
  BRAND,
  Block,
  Count,
  DECKDOO_BRAND,
  DesignProvider,
  Dots,
  Logo,
  NavItem,
  Panel,
  PillTabs,
  Stat,
  Status,
  Steps,
  accentHex,
  buildTheme,
  useBrand,
  type Accent,
  type Brand as BrandIdentity,
  type Corners,
} from "@deckdoo/design";
import { EXEMPLO_BRAND } from "./brands.js";
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
  { id: "cores", label: "Cores", icon: Palette },
  { id: "tipografia", label: "Tipografia", icon: TextAa },
  { id: "botoes", label: "Botões", icon: Play },
  { id: "campos", label: "Campos", icon: PencilSimple },
  { id: "estados", label: "Estados", icon: CheckCircle },
  { id: "navegacao", label: "Navegação", icon: StackIcon },
  { id: "cartoes", label: "Cartões", icon: ChartBar },
  { id: "tabela", label: "Tabela", icon: FileText },
  { id: "camadas", label: "Camadas", icon: Copy },
  { id: "tela", label: "Tela exemplo", icon: House },
] as const;

function Kitchen({ controls }: { controls: Controls }) {
  const { name } = useBrand();
  const [active, setActive] = useState<string>("marca");
  const [aiOn, setAiOn] = useState(true);

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
    <div className="dd-root dd-frame ks" lang="pt-BR">
      <aside className="dd-side dd-panel">
        <Group justify="space-between" wrap="nowrap" mb="md">
          <Logo height={26} />
          <Tooltip label="Recolher barra">
            <ActionIcon variant="subtle" color="gray" aria-label="Recolher barra">
              <ArrowLeft size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <button type="button" className="ks-workspace">
          <Avatar radius="md" size={34} color="inverse" variant="filled">
            UA
          </Avatar>
          <span style={{ minWidth: 0 }}>
            <strong>useAnder</strong>
            <span className="dd-muted">Espaço de trabalho</span>
          </span>
          <CaretDown size={14} style={{ marginLeft: "auto" }} />
        </button>

        <div className="dd-eyebrow dd-side-label">Padrão visual</div>
        <nav>
          {SECTIONS.map((s) => (
            <NavItem
              key={s.id}
              icon={<s.icon size={18} />}
              label={s.label}
              active={active === s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            />
          ))}
        </nav>

        <div className="dd-side-foot">
          <div className="dd-accent ks-ai-card">
            <Group justify="space-between" wrap="nowrap">
              <Group gap={10} wrap="nowrap">
                <span className="ks-ai-badge">
                  <Sparkle size={16} weight="fill" />
                </span>
                <div>
                  <Text fw={600} size="sm" lh={1.2}>
                    {name} IA
                  </Text>
                  <Text size="xs" opacity={0.75}>
                    {aiOn ? "Ligada · 12 decks" : "Desligada"}
                  </Text>
                </div>
              </Group>
              <Switch
                checked={aiOn}
                onChange={(e) => setAiOn(e.currentTarget.checked)}
                // Sobre o acento a tinta é sempre escura, nos dois temas.
                color="ink.9"
                size="md"
                aria-label={`${name} IA`}
              />
            </Group>
            <button type="button" className="ks-ai-link">
              3 slides pedem atenção <CaretRight size={14} />
            </button>
          </div>
          <Group gap="sm" wrap="nowrap" className="ks-user">
            <Avatar radius="xl" color="purple" variant="filled">
              AF
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Text size="sm" fw={600}>
                Anderson
              </Text>
              <Text size="xs" className="dd-muted">
                Dono do espaço
              </Text>
            </div>
          </Group>
        </div>
      </aside>

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
        <Colors />
        <Typography />
        <Buttons />
        <Fields />
        <States />
        <Navigation />
        <Cards />
        <TableSection />
        <Layers />
        <Example />
      </main>
    </div>
  );
}

function ThemeBar({ controls }: { controls: Controls }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
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
        ]}
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
          note="O ícone sozinho: avatar da IA, favicon, ícone de app. Também troca de desenho no escuro."
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
              A IA leu o material que você enviou e montou um roteiro com doze slides. Revise a
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
              Ordenado pela IA
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
              O texto não cabe na caixa. Encurte ou peça à IA para refazer.
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

/* ——— Navegação ——— */

function Navigation() {
  const [tab, setTab] = useState("visao");
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
      </Stack>
    </Section>
  );
}

/* ——— Cartões ——— */

function Cards() {
  const { name } = useBrand();
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
              <span className="ks-ai-badge ks-ai-badge-inv">
                <Sparkle size={16} weight="fill" />
              </span>
              <Text fw={600}>{name} IA</Text>
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
              Ordenado pela IA
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
            <Title order={3}>Deixar a IA refazer o slide 4?</Title>
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
            Ícones: Phosphor, traço regular a 16–18 px; preenchido só no ícone da IA.
          </Text>
        </Group>
      </div>
    </Section>
  );
}

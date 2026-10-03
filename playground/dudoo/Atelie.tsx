import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActionIcon,
  Anchor,
  Button,
  Code,
  Group,
  MantineProvider,
  SegmentedControl,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ArrowLeft, ArrowCounterClockwise, Moon, Sparkle, Sun } from "@phosphor-icons/react";
import {
  BRAND,
  Block,
  ChatBubble,
  DUDOO_MOODS,
  DuDoo,
  DuDooFace,
  DuDooWall,
  EmptyState,
  Panel,
  SceneAllClear,
  SceneDone,
  SceneEmpty,
  SceneGenerating,
  SceneLocked,
  SceneNoResults,
  Status,
  buildTheme,
  dudooExpression,
  type Accent,
  type Corners,
  type DuDooExpression,
  type DuDooEye,
  type DuDooMood,
  type SceneObject,
} from "@deckdoo/design";
import markUrl from "../../src/brand/deckdoo-mark.svg";
import { DrawOn } from "./draw.js";
import { MOODS } from "./moods.js";
import {
  INTENSITY,
  REDUCED_TIMING,
  TIMING,
  useDuDooMotion,
  usePrefersReducedMotion,
} from "./motion.js";
import { KitPiece, SceneNoOrders } from "./Doodles.js";
import "../kitchen.css";
import "./atelie.css";

/**
 * O ateliê do DuDoo: a bancada do mascote com expressão (`DuDooFace`, `DuDoo`) e do rabisco
 * (`sketch`), à parte da cozinha. Mostra as regras de `docs/marca.md` funcionando e serve para
 * testar expressão nova antes de ela entrar no vocabulário. Usa o acento e os cantos da cozinha.
 */

export function AtelieRoot() {
  // As mesmas chaves da cozinha: o ateliê abre com o acento e os cantos de lá.
  const [accent] = useLocalStorage<Accent>({ key: "dd-k-accent", defaultValue: "lime" });
  const [corners] = useLocalStorage<Corners>({ key: "dd-k-corners", defaultValue: "pilula" });
  const theme = useMemo(() => buildTheme({ accent, corners }), [accent, corners]);

  useEffect(() => {
    document.title = "Ateliê do DuDoo · DeckDoo Design";
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Atelie />
    </MantineProvider>
  );
}

function Atelie() {
  return (
    <div className="dd-root at" lang="pt-BR">
      <header className="ks-top at-top">
        <div>
          <Anchor href="/" size="xs" className="dd-muted at-back">
            <ArrowLeft size={12} /> Cozinha
          </Anchor>
          <Group gap="sm">
            <Title order={1} fz={28}>
              Ateliê do DuDoo
            </Title>
            <Status tone="ok">No pacote</Status>
          </Group>
        </div>
        <ThemeToggle />
      </header>

      <Anatomy />
      <Lab />
      <Catalog />
      <Motion />
      <InChat />
      <Doodles />
      <Scenes />
      <Rules />
    </div>
  );
}

function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      size="lg"
      aria-label={colorScheme === "dark" ? "Tema claro" : "Tema escuro"}
      onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
    >
      {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
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

/* ——— Anatomia ——— */

function Anatomy() {
  const [overlay, setOverlay] = useState(false);
  return (
    <Section
      id="anatomia"
      title="Anatomia"
      note="O mascote é um D com dois furos. Remontado em peças, ele ganha olhar sem mudar de desenho: o corpo fica, os olhos mexem."
    >
      <div className="at-anatomy">
        <Panel className="at-anatomy-stage">
          <div className="at-anatomy-face">
            <DuDooFace size={220} />
            {/* O mascote original por cima, em vermelho: tem que bater. */}
            {overlay && (
              <span
                className="at-overlay"
                style={{ ["--at-mark" as string]: `url("${markUrl}")` }}
              />
            )}
            <span className="at-callout" style={{ left: "6%", top: "-6%" }}>
              olho de dentro
            </span>
            <span className="at-callout" style={{ right: "-14%", top: "-6%" }}>
              olho da borda
            </span>
            <span className="at-callout" style={{ left: "26%", top: "52%" }}>
              pupila
            </span>
            <span className="at-callout" style={{ left: "30%", bottom: "-8%" }}>
              corpo: não deforma
            </span>
          </div>
          <Switch
            mt="lg"
            label="Conferir com o mascote original"
            checked={overlay}
            onChange={(e) => setOverlay(e.currentTarget.checked)}
          />
        </Panel>
        <Stack gap="sm">
          <Block>
            <Text fw={600}>Corpo</Text>
            <Text size="sm" className="dd-muted">
              O D inteiro, sempre igual. Numa ilustração pode inclinar; no avatar, fica reto.
            </Text>
          </Block>
          <Block>
            <Text fw={600}>Olhos</Text>
            <Text size="sm" className="dd-muted">
              Furos no corpo: no claro, o branco do olho é o fundo. O da direita morde a borda do D,
              e é isso que dá a cara de quem espia.
            </Text>
          </Block>
          <Block>
            <Text fw={600}>O que mexe</Text>
            <Text size="sm" className="dd-muted">
              Para onde a pupila olha, o tamanho de cada olho, a pálpebra de cima (que desce e
              inclina) e a de baixo (que sobe quando ele sorri). Nada além disso: sem boca, sem
              sobrancelha, sem braço.
            </Text>
          </Block>
          <Block>
            <Text fw={600}>No escuro</Text>
            <Text size="sm" className="dd-muted">
              O corpo continua marinho e ganha o contorno claro do mascote invertido. O branco do
              olho é pintado inteiro, e o da direita sai da borda como um círculo. A pupila fica
              marinho nos dois temas.
            </Text>
          </Block>
        </Stack>
      </div>
    </Section>
  );
}

/* ——— Laboratório ——— */

type Which = "both" | "left" | "right";

function Lab() {
  const [e, setE] = useState<DuDooExpression>(DUDOO_MOODS.curioso);
  const [which, setWhich] = useState<Which>("both");
  const [sclera, setSclera] = useState(false);
  const [lean, setLean] = useState(false);

  const eye = which === "right" ? e.right : e.left;
  const setEye = (patch: Partial<DuDooEye>) =>
    setE((cur) => {
      if (which !== "both") return { ...cur, [which]: { ...cur[which], ...patch } };
      // Nos dois, a inclinação espelha: o que desce para dentro num desce para dentro no outro.
      const mirrored = patch.tilt === undefined ? patch : { ...patch, tilt: -patch.tilt };
      return { ...cur, left: { ...cur.left, ...patch }, right: { ...cur.right, ...mirrored } };
    });

  const shown = lean ? e : { ...e, lean: 0 };

  return (
    <Section
      id="laboratorio"
      title="Laboratório"
      note="Mexa e veja nos tamanhos de verdade. O que não se lê a 24 px não serve para o avatar."
    >
      <Panel className="at-lab">
        <div className="at-lab-stage">
          <Block className="at-lab-big">
            <DuDooFace size={200} mood={shown} sclera={sclera ? BRAND.paper : undefined} />
          </Block>
          <Group gap="md" justify="center" align="center" wrap="wrap">
            {[16, 24, 32, 48, 72].map((s) => (
              <Stack key={s} gap={4} align="center">
                <DuDoo size={s} mood={e} />
                <Text size="xs" className="dd-faint dd-num">
                  {s}
                </Text>
              </Stack>
            ))}
            <div className="at-lab-chip dd-accent">
              <DuDooFace size={28} mood={{ ...e, lean: 0 }} />
            </div>
            <div className="at-lab-chip dd-inverse">
              <DuDooFace size={28} mood={{ ...e, lean: 0 }} />
            </div>
          </Group>
        </div>

        <Stack gap="md" className="at-lab-controls">
          <div>
            <Text size="sm" fw={600} mb={6}>
              Expressões prontas
            </Text>
            <Group gap={6}>
              {MOODS.map((p) => (
                <Button
                  key={p.mood}
                  size="compact-sm"
                  variant="default"
                  onClick={() => setE(DUDOO_MOODS[p.mood])}
                >
                  {p.name}
                </Button>
              ))}
            </Group>
          </div>

          <Group align="flex-start" gap="lg" wrap="nowrap">
            <div>
              <Text size="sm" fw={600} mb={6}>
                Olhar
              </Text>
              <LookPad value={e.look} onChange={(look) => setE((c) => ({ ...c, look }))} />
            </div>
            <Stack gap={10} style={{ flex: 1, minWidth: 0 }}>
              <Labeled label="Pupila">
                <Slider
                  min={0.5}
                  max={1.3}
                  step={0.02}
                  value={e.pupil}
                  onChange={(pupil) => setE((c) => ({ ...c, pupil }))}
                  label={null}
                />
              </Labeled>
              <Labeled label="Corpo inclinado">
                <Group gap="sm" wrap="nowrap">
                  <Switch
                    size="xs"
                    checked={lean}
                    onChange={(ev) => setLean(ev.currentTarget.checked)}
                    aria-label="Inclinar"
                  />
                  <Slider
                    style={{ flex: 1 }}
                    min={-15}
                    max={15}
                    step={1}
                    disabled={!lean}
                    value={e.lean}
                    onChange={(v) => setE((c) => ({ ...c, lean: v }))}
                    label={(v) => `${v}°`}
                  />
                </Group>
              </Labeled>
              <Switch
                size="sm"
                label="Branco do olho pintado"
                checked={sclera}
                onChange={(ev) => setSclera(ev.currentTarget.checked)}
              />
            </Stack>
          </Group>

          <Block>
            <SegmentedControl
              size="xs"
              fullWidth
              mb="sm"
              value={which}
              onChange={(v) => setWhich(v as Which)}
              data={[
                { value: "both", label: "Os dois olhos" },
                { value: "left", label: "Esquerdo" },
                { value: "right", label: "Direito" },
              ]}
            />
            <Stack gap={10}>
              <Labeled label="Olho">
                <SegmentedControl
                  size="xs"
                  value={eye.arc === undefined ? "aberto" : String(eye.arc)}
                  onChange={(v) => setEye({ arc: v === "aberto" ? undefined : Number(v) })}
                  data={[
                    { value: "aberto", label: "Aberto" },
                    { value: "1", label: "^" },
                    { value: "0", label: "—" },
                    { value: "-0.6", label: "‿" },
                  ]}
                />
              </Labeled>
              <Labeled label="Tamanho">
                <Slider
                  min={0.6}
                  max={1.3}
                  step={0.02}
                  value={eye.size}
                  onChange={(size) => setEye({ size })}
                  label={null}
                />
              </Labeled>
              <Labeled label="Pálpebra de cima">
                <Slider
                  min={0}
                  max={0.9}
                  step={0.02}
                  value={eye.top}
                  onChange={(top) => setEye({ top })}
                  label={null}
                />
              </Labeled>
              <Labeled label="Inclinação">
                <Slider
                  min={-30}
                  max={30}
                  step={1}
                  value={eye.tilt}
                  onChange={(tilt) => setEye({ tilt })}
                  label={(v) => `${v}°`}
                />
              </Labeled>
              <Labeled label="Pálpebra de baixo">
                <Slider
                  min={0}
                  max={0.9}
                  step={0.02}
                  value={eye.bottom}
                  onChange={(bottom) => setEye({ bottom })}
                  label={null}
                />
              </Labeled>
            </Stack>
          </Block>

          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <Code block className="at-code">
              {describe(e)}
            </Code>
            <Tooltip label="Voltar ao neutro">
              <ActionIcon
                variant="default"
                size="lg"
                onClick={() => setE(DUDOO_MOODS.neutro)}
                aria-label="Voltar ao neutro"
              >
                <ArrowCounterClockwise size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Panel>
    </Section>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="at-labeled">
      <Text size="xs" className="dd-muted">
        {label}
      </Text>
      {children}
    </div>
  );
}

/** A expressão como o `dudooExpression()` escreveria: só o que foge do neutro. */
function describe(e: DuDooExpression): string {
  const r = (n: number) => Math.round(n * 100) / 100;
  const out: string[] = [];
  if (e.look[0] || e.look[1]) out.push(`look: [${r(e.look[0])}, ${r(e.look[1])}]`);
  if (e.pupil !== 1) out.push(`pupil: ${r(e.pupil)}`);
  if (e.lean) out.push(`lean: ${e.lean}`);
  for (const side of ["left", "right"] as const) {
    const eye = e[side];
    const parts = (["size", "top", "tilt", "bottom"] as const)
      .filter((k) => eye[k] !== (k === "size" ? 1 : 0))
      .map((k) => `${k}: ${r(eye[k])}`);
    if (eye.look) parts.push(`look: [${r(eye.look[0])}, ${r(eye.look[1])}]`);
    if (eye.arc !== undefined) parts.push(`arc: ${eye.arc}`);
    if (parts.length) out.push(`${side}: { ${parts.join(", ")} }`);
  }
  return out.length ? `dudooExpression({\n  ${out.join(",\n  ")}\n})` : `"neutro"`;
}

/** Um quadrado para arrastar o olhar. */
function LookPad({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (ev: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const clamp = (n: number) => Math.max(-1, Math.min(1, n));
    const x = clamp(((ev.clientX - box.left) / box.width) * 2 - 1);
    const y = clamp(((ev.clientY - box.top) / box.height) * 2 - 1);
    onChange([Math.round(x * 20) / 20, Math.round(y * 20) / 20]);
  };
  return (
    <div
      ref={ref}
      className="at-pad"
      role="slider"
      aria-label="Olhar"
      aria-valuetext={`${value[0]}, ${value[1]}`}
      onPointerDown={(ev) => {
        ev.currentTarget.setPointerCapture(ev.pointerId);
        move(ev);
      }}
      onPointerMove={(ev) => ev.buttons && move(ev)}
      onDoubleClick={() => onChange([0, 0])}
    >
      <span
        className="at-pad-dot"
        style={{ left: `${(value[0] + 1) * 50}%`, top: `${(value[1] + 1) * 50}%` }}
      />
    </div>
  );
}

/* ——— Catálogo ——— */

const TONE = {
  festa: { label: "Festa", tone: "ok" },
  trabalho: { label: "Trabalho", tone: "info" },
  neutro: { label: "Neutro", tone: "neutral" },
} as const;

function Catalog() {
  return (
    <Section
      id="expressoes"
      title="Expressões"
      note="Um vocabulário pequeno, ligado às intensidades da voz. Na intensidade Sério o DuDoo não aparece, então não há cara de erro."
    >
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="md">
        {MOODS.map((p) => (
          <Panel key={p.mood} className="at-card">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <DuDooFace size={72} mood={p.mood} />
              <DuDoo size={28} mood={p.mood} />
            </Group>
            <Group gap={8} mt="md" mb={4} wrap="nowrap">
              <Text fw={600}>{p.name}</Text>
              <Code className="dd-nobreak">{p.mood}</Code>
              <Status tone={TONE[p.tone].tone}>{TONE[p.tone].label}</Status>
            </Group>
            <Text size="sm" className="dd-muted">
              {p.when}
            </Text>
          </Panel>
        ))}
      </SimpleGrid>
    </Section>
  );
}

/* ——— Movimento ——— */

/** O que cada mood faz parado, depois que a troca assenta. */
const IDLE_NOTE: Partial<Record<DuDooMood, string>> = {
  neutro: "De vez em quando, uma olhada de lado, e volta.",
  pensando: "A pupila salta de um ponto a outro, sempre para cima.",
  focado: "Lê, da esquerda para a direita.",
  esperando: "O olhar escorrega pelo chão.",
  dormindo: "O olho respira, devagar. Fechado, não pisca.",
  feliz: "Ri de vez em quando: o “^” dá dois soquinhos. Olho fechado não pisca.",
  piscada:
    "É um gesto rápido (170 ms para fechar, 220 ms fechado, 150 ms para abrir); depois fica como o neutro. Na fala antiga do chat, fica fechado, como o desenho.",
  olhando: "Fica no alvo, reajustando de leve, como quem confere.",
  curioso: "Olha para você, esperando a resposta, e volta para o assunto.",
  "de-canto": "A segunda olhada: volta para você um instante e torna a olhar de lado.",
  empolgado: "Não para quieto: o olhar pula de um ponto a outro.",
  confuso: "O olhar vaga, sem achar onde parar.",
};

function Motion() {
  const [mood, setMoodNow] = useState<DuDooMood>("neutro");
  const [prev, setPrev] = useState<DuDooMood>("neutro");
  const setMood = (m: DuDooMood) => {
    if (m === mood) return;
    setPrev(mood);
    setMoodNow(m);
  };
  // Volta ao mood de antes e, assentado, faz a troca de novo.
  const replay = () => {
    const to = mood;
    setMoodNow(prev);
    window.setTimeout(() => setMoodNow(to), 900 / Number(speed));
  };
  const [blink, setBlink] = useState(true);
  const [idle, setIdle] = useState(true);
  const systemReduced = usePrefersReducedMotion();
  const [reduced, setReduced] = useState(systemReduced);
  const [speed, setSpeed] = useState("1");
  const e = useDuDooMotion(mood, { blink, idle, reduced, speed: Number(speed) });
  const info = MOODS.find((m) => m.mood === mood)!;
  const intensity = INTENSITY[mood];

  return (
    <Section
      id="movimento"
      title="Movimento"
      note="Protótipo. Só os olhos mexem, e o ritmo vem da intensidade: Trabalho é rápido e para no ponto, Festa tem mola, Neutro é calmo. Troque de expressão e repare na ordem: o olhar chega primeiro, a pálpebra vem atrás."
    >
      <Panel className="at-lab">
        <div className="at-lab-stage">
          <Block className="at-lab-big">
            <DuDooFace size={200} mood={e} />
          </Block>
          <Group gap="md" justify="center" align="center" wrap="wrap">
            {[24, 32, 48].map((s) => (
              <Stack key={s} gap={4} align="center">
                <DuDoo size={s} mood={e} />
                <Text size="xs" className="dd-faint dd-num">
                  {s}
                </Text>
              </Stack>
            ))}
            <div className="at-lab-chip dd-accent">
              <DuDooFace size={28} mood={e} />
            </div>
            <div className="at-lab-chip dd-inverse">
              <DuDooFace size={28} mood={e} />
            </div>
          </Group>
        </div>

        <Stack gap="md" className="at-lab-controls">
          <div>
            <Text size="sm" fw={600} mb={6}>
              Trocar para
            </Text>
            <Group gap={6}>
              {MOODS.map((p) => (
                <Button
                  key={p.mood}
                  size="compact-sm"
                  variant={p.mood === mood ? "filled" : "default"}
                  onClick={() => setMood(p.mood)}
                >
                  {p.name}
                </Button>
              ))}
            </Group>
          </div>

          <Block>
            <Group gap={8} mb={6} wrap="nowrap">
              <Text fw={600}>{info.name}</Text>
              <Status tone={TONE[intensity].tone}>{TONE[intensity].label}</Status>
            </Group>
            <Text size="sm" className="dd-muted">
              <b>A troca:</b>{" "}
              {mood === "piscada"
                ? "o gesto, rápido e com mola"
                : (reduced ? REDUCED_TIMING : TIMING[intensity]).label}
              .
            </Text>
            <Text size="sm" className="dd-muted">
              <b>Parado:</b> {IDLE_NOTE[mood] ?? "Pisca de vez em quando."}
            </Text>
            {prev !== mood && (
              <Button
                mt="sm"
                size="compact-sm"
                variant="default"
                leftSection={<ArrowCounterClockwise size={14} />}
                onClick={replay}
              >
                Repetir a troca ({MOODS.find((m) => m.mood === prev)!.name} → {info.name})
              </Button>
            )}
          </Block>

          <Stack gap={10}>
            <Switch
              size="sm"
              label="Piscar de vez em quando"
              checked={blink}
              onChange={(ev) => setBlink(ev.currentTarget.checked)}
            />
            <Switch
              size="sm"
              label="Vida própria (olhar solto, respiração)"
              checked={idle}
              onChange={(ev) => setIdle(ev.currentTarget.checked)}
            />
            <Switch
              size="sm"
              label="Movimento reduzido (troca curta e sem mola; sai o olhar solto)"
              checked={reduced}
              onChange={(ev) => setReduced(ev.currentTarget.checked)}
            />
            <Labeled label="Velocidade">
              <SegmentedControl
                size="xs"
                value={speed}
                onChange={setSpeed}
                data={[
                  { value: "1", label: "Real" },
                  { value: "0.4", label: "Devagar" },
                  { value: "0.15", label: "Bem devagar" },
                ]}
              />
            </Labeled>
          </Stack>
        </Stack>
      </Panel>

      <Title order={3} mt={40} mb="xs">
        Olha antes de falar
      </Title>
      <Text className="dd-muted" mb="md" maw={760}>
        A coruja atenta, em sequência: ele lê a sua fala (o olhar vai até ela), pensa enquanto
        escreve e responde com a cara do que diz. Só o rosto da última fala está vivo; os de cima
        param na expressão do que disseram, como em “No chat”.
      </Text>
      <ChatReplay reduced={reduced} />
    </Section>
  );
}

/** Lendo a sua fala: o olhar vai para cima e para a direita, onde ela está. */
const READING = dudooExpression({ look: [0.85, -0.6] });

interface ReplayMsg {
  from: "you" | "dudoo";
  /** Sem texto, a fala do DuDoo é os três pontos: ele está escrevendo. */
  text?: string;
  mood?: DuDooMood | DuDooExpression;
}

const SCRIPT: [number, ReplayMsg[]][] = (() => {
  const you = (text: string): ReplayMsg => ({ from: "you", text });
  const dd = (mood: ReplayMsg["mood"], text?: string): ReplayMsg => ({ from: "dudoo", text, mood });
  const ask1 = you("Monta um deck do resultado do trimestre para a diretoria.");
  const ans1 = dd("pensando", "Montando a estrutura… agora os gráficos.");
  const ans2 = dd("feliz", "Pronto: 12 slides. Quer revisar o roteiro antes de exportar?");
  const ask2 = you("Revisa o slide 4.");
  return [
    [0, [ask1]],
    [600, [ask1, dd(READING)]],
    [1500, [ask1, dd("pensando")]],
    [3400, [ask1, ans1]],
    [5600, [ask1, ans1, ans2]],
    [8200, [ask1, ans1, ans2, ask2]],
    [8800, [ask1, ans1, ans2, ask2, dd(READING)]],
    [9700, [ask1, ans1, ans2, ask2, dd("focado")]],
    [
      11800,
      [
        ask1,
        ans1,
        ans2,
        ask2,
        dd("de-canto", "O texto do slide 4 não coube. Encurto ou divido em dois?"),
      ],
    ],
  ];
})();

function ChatReplay({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(-1);

  // Começa quando aparece na tela, para ninguém perder o começo.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRun((r) => r || 1);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    setStep(0);
    const timers = SCRIPT.slice(1).map(([at], i) => window.setTimeout(() => setStep(i + 1), at));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  const msgs = step >= 0 ? SCRIPT[step]![1] : [];
  const lastDuDoo = msgs.map((m) => m.from).lastIndexOf("dudoo");

  return (
    <div className="at-chat-grid">
      <DuDooWall ref={ref} className="at-chat at-replay" data-reduced={reduced || undefined}>
        {msgs.map((m, i) =>
          m.from === "you" ? (
            <ChatBubble key={`${run}-${i}`} from="you">
              {m.text}
            </ChatBubble>
          ) : (
            <LiveBubble
              key={`${run}-${i}`}
              mood={m.mood ?? "neutro"}
              live={i === lastDuDoo}
              reduced={reduced}
            >
              {m.text ?? (
                <span className="at-typing" aria-label="Escrevendo">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </LiveBubble>
          ),
        )}
      </DuDooWall>
      <Stack gap="sm">
        <Block>
          <Text fw={600}>O olhar vai antes</Text>
          <Text size="sm" className="dd-muted">
            Antes de escrever, ele olha para a sua fala. Ninguém lê isso conscientemente, mas é o
            que separa quem ouviu de quem só respondeu.
          </Text>
        </Block>
        <Block>
          <Text fw={600}>Um rosto vivo por vez</Text>
          <Text size="sm" className="dd-muted">
            As falas antigas param na expressão do que disseram, sem piscar nem olhar em volta. É a
            regra de uma aparição por tela, no tempo.
          </Text>
        </Block>
        <Group>
          <Button
            variant="default"
            leftSection={<ArrowCounterClockwise size={16} />}
            onClick={() => setRun((r) => r + 1)}
          >
            Repetir a conversa
          </Button>
        </Group>
      </Stack>
    </div>
  );
}

function LiveBubble({
  mood,
  live,
  reduced,
  children,
}: {
  mood: DuDooMood | DuDooExpression;
  live: boolean;
  reduced: boolean;
  children: ReactNode;
}) {
  const e = useDuDooMotion(mood, { blink: live, idle: live, reduced });
  return (
    <ChatBubble from="dudoo" mood={e}>
      {children}
    </ChatBubble>
  );
}

/* ——— No chat ——— */

function InChat() {
  return (
    <Section
      id="no-chat"
      title="No chat"
      note="Onde a expressão rende mais e custa menos: o avatar já está lá. Ela muda com o que ele está fazendo, e volta ao neutro na fala seguinte."
    >
      <div className="at-chat-grid">
        <DuDooWall className="at-chat">
          <ChatBubble from="you">
            Monta um deck do resultado do trimestre para a diretoria.
          </ChatBubble>
          <ChatBubble from="dudoo" mood="pensando">
            Montando a estrutura… agora os gráficos.
          </ChatBubble>
          <ChatBubble from="dudoo" mood="feliz">
            Pronto: 12 slides. Quer revisar o roteiro antes de exportar?
          </ChatBubble>
          <ChatBubble from="you">Revisa o slide 4.</ChatBubble>
          <ChatBubble from="dudoo" mood="de-canto">
            O texto do slide 4 não coube. Encurto ou divido em dois?
          </ChatBubble>
          <ChatBubble from="dudoo" avatar={false}>
            Se dividir, o gráfico de margem ganha um slide só dele.
          </ChatBubble>
        </DuDooWall>
        <Stack gap="sm">
          <Block>
            <Text fw={600}>Sempre o mesmo círculo</Text>
            <Text size="sm" className="dd-muted">
              Igual em todos os apps. Sobre fundo claro, limão com o mascote marinho; sobre fundo
              escuro (e sobre o acento limão, onde ele sumiria), o círculo marinho com o mascote
              limão. Em qualquer um, o branco do olho é claro e a pupila é marinho.
            </Text>
          </Block>
          <Block>
            <Text fw={600}>Uma expressão por fala</Text>
            <Text size="sm" className="dd-muted">
              A que combina com o que ele diz. Falas seguidas sem avatar não pedem cara nova.
            </Text>
          </Block>
          <Block>
            <Text fw={600}>Animado</Text>
            <Text size="sm" className="dd-muted">
              Piscar de vez em quando, olhar para a sua fala antes de responder, pupilas andando
              enquanto gera: veja em Movimento, acima.
            </Text>
          </Block>
        </Stack>
      </div>
    </Section>
  );
}

/* ——— Rabiscos ——— */

function Doodles() {
  const pieces = [
    {
      kind: "rabisco",
      name: "Traço",
      note: "Tinta, ponta redonda, curva sem ser exata.",
      motion: "Sai da ponta da caneta, na velocidade da mão.",
    },
    {
      kind: "laco",
      name: "Laço",
      note: "Liga uma coisa à outra: a ideia ao slide.",
      motion: "Escrito de uma vez, como letra cursiva.",
    },
    {
      kind: "brilho",
      name: "Brilho",
      note: "O ✦ da IA, solto na cena. Tinta ou uma cor.",
      motion: "Salta com um giro, um de cada vez, quando o resto está pronto.",
    },
    {
      kind: "enfase",
      name: "Ênfase",
      note: "Três traços: olha aqui, aconteceu.",
      motion: "Os traços primeiro, o ponto salta no fim.",
    },
    {
      kind: "mancha",
      name: "Mancha",
      note: "A cor chapada, fora de registro do traço.",
      motion: "Cai depois do traço, deslizando até o registro.",
    },
    {
      kind: "cartao",
      name: "Cartão",
      note: "O slide, a página: o objeto da suíte.",
      motion: "O papel acende com o contorno; as linhas vêm depois.",
    },
  ] as const;
  const [replay, setReplay] = useState(0);
  const [one, setOne] = useState<Record<string, number>>({});
  const [slow, setSlow] = useState(false);
  const reduced = usePrefersReducedMotion();
  const speed = slow ? 0.3 : 1;
  return (
    <Section
      id="rabiscos"
      title="Rabiscos"
      note="O traço de quem pensa desenhando, que dá nome ao DuDoo. Das referências, fica o desenho em linha com a cor deslocada; sai a pessoa desenhada: o personagem é ele."
    >
      <Group gap="md" mb="md">
        <Button
          variant="default"
          leftSection={<ArrowCounterClockwise size={16} />}
          onClick={() => setReplay((r) => r + 1)}
        >
          Desenhar de novo
        </Button>
        <Switch label="Devagar" checked={slow} onChange={(e) => setSlow(e.currentTarget.checked)} />
        <Text size="sm" className="dd-muted">
          Clique numa peça para ver só ela.
          {reduced && " Seu sistema pede movimento reduzido: as peças aparecem prontas."}
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
        {pieces.map((p) => (
          <Panel
            key={p.kind}
            className="at-card at-replayable"
            onClick={() => setOne((o) => ({ ...o, [p.kind]: (o[p.kind] ?? 0) + 1 }))}
          >
            <Block className="at-kit">
              <DrawOn replay={replay + (one[p.kind] ?? 0) * 1000} still={reduced} speed={speed}>
                <KitPiece kind={p.kind} />
              </DrawOn>
            </Block>
            <Text fw={600} mt="sm">
              {p.name}
            </Text>
            <Text size="sm" className="dd-muted">
              {p.note}
            </Text>
            <Text size="xs" className="dd-faint" mt={6}>
              {p.motion}
            </Text>
          </Panel>
        ))}
      </SimpleGrid>

      <Title order={3} mt={40} mb="xs">
        Juntas, numa cena
      </Title>
      <Text className="dd-muted" mb="md" maw={760}>
        A ordem é a do código, que é a de quem desenha: primeiro o objeto, depois os enfeites; a cor
        cai quando o traço termina e o brilho salta por último. A cena desenha uma vez e para.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <Panel
          className="at-card at-replayable"
          onClick={() => setOne((o) => ({ ...o, juntas: (o.juntas ?? 0) + 1 }))}
        >
          <DrawOn replay={replay + (one.juntas ?? 0) * 1000} still={reduced} speed={speed}>
            <SceneNoOrders />
          </DrawOn>
        </Panel>
      </SimpleGrid>
    </Section>
  );
}

/* ——— Cenas ——— */

function Scenes() {
  return (
    <Section
      id="cenas"
      title="Cenas"
      note="Estado vazio, espera e marco. O DuDoo só entra onde há uma ação dele; no resto, os rabiscos sem ele, e no Sério nem cor."
    >
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <SceneShowcase
          tone="festa"
          dudoo
          code={'<SceneEmpty object="slide" dudoo />'}
          art={<SceneEmpty object="slide" dudoo />}
          title="Nenhum deck ainda"
          text="Tem uma ideia? Me conta que eu monto o deck com você."
          action={<Button leftSection={<Sparkle size={16} weight="fill" />}>Gerar com IA</Button>}
        />
        <SceneShowcase
          tone="trabalho"
          dudoo
          code="<SceneGenerating />"
          art={<SceneGenerating />}
          title="Montando o deck"
          text="Montando a estrutura… agora os gráficos."
        />
        <SceneShowcase
          tone="festa"
          dudoo
          code="<SceneDone />"
          art={<SceneDone />}
          title="Pronto: 12 slides"
          text="Quer revisar o roteiro antes de exportar?"
          action={<Button>Revisar roteiro</Button>}
        />
        <SceneShowcase
          tone="trabalho"
          code="<SceneNoResults />"
          art={<SceneNoResults color={BRAND.cyan} />}
          title="Nada com “margem bruta”"
          text="Tente outra palavra ou procure em todos os espaços."
          action={<Button variant="default">Buscar em tudo</Button>}
        />
        <SceneShowcase
          tone="trabalho"
          code="<SceneAllClear />"
          art={<SceneAllClear />}
          title="Nenhuma pendência"
          text="Quando um slide pedir atenção, ele aparece aqui."
        />
        <SceneShowcase
          tone="serio"
          code="<SceneLocked />"
          art={<SceneLocked />}
          title="Você não tem acesso a este espaço"
          text="Peça a quem administra."
          action={<Button variant="default">Pedir acesso</Button>}
        />
      </SimpleGrid>

      <EmptyObjects />

      <Title order={3} mt={40} mb="xs">
        Desenhada no app
      </Title>
      <Text className="dd-muted" mb="md" maw={760}>
        O exemplo da receita (<Code>docs/ilustracao.md</Code>): uma cena que só um app usa, feita
        com as peças do pacote. Se um segundo app quiser, ela sobe para cá.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <SceneShowcase
          tone="trabalho"
          code="<SceneNoOrders />"
          art={<SceneNoOrders />}
          title="Nenhum pedido ainda"
          text="Quando um cliente comprar, o pedido aparece aqui."
        />
      </SimpleGrid>

      <Title order={3} mt={40} mb="xs">
        Espiando
      </Title>
      <Text className="dd-muted" mb="md" maw={760}>
        O jeito mais barato de usar o DuDoo: só os olhos, por cima da borda de um cartão, olhando
        para o que ele sugere. Não pede cena, cabe em qualquer tela e não gasta o personagem.
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <div className="at-peek">
          <DuDooFace className="at-peek-face" size={76} mood="olhando" />
          <Block className="at-peek-card">
            <Text fw={600}>O slide 4 está apertado</Text>
            <Text size="sm" className="dd-muted" mb="sm">
              Quer que eu divida em dois? O gráfico de margem ganha um slide só dele.
            </Text>
            <Group gap="xs">
              <Button size="xs">Dividir em dois</Button>
              <Button size="xs" variant="default">
                Agora não
              </Button>
            </Group>
          </Block>
        </div>
        <div className="at-peek at-peek-left">
          <DuDooFace className="at-peek-face" size={76} mood="piscada" />
          <Panel className="at-peek-card">
            <Text fw={600}>Atalho</Text>
            <Text size="sm" className="dd-muted">
              Escreva <Code>/</Code> no slide e me peça o que quiser, sem sair do lugar.
            </Text>
          </Panel>
        </div>
      </SimpleGrid>
    </Section>
  );
}

function SceneShowcase({
  tone,
  dudoo,
  code,
  art,
  title,
  text,
  action,
}: {
  tone: "festa" | "trabalho" | "serio";
  dudoo?: boolean;
  code: string;
  art: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  const label = { festa: "Festa", trabalho: "Trabalho", serio: "Sério" }[tone];
  return (
    <Panel className="at-scene">
      <Group gap={6} className="at-scene-tags">
        <Status tone={tone === "festa" ? "ok" : tone === "serio" ? "neutral" : "info"}>
          {label}
        </Status>
        <Status tone="neutral">{dudoo ? "Com DuDoo" : "Sem DuDoo"}</Status>
      </Group>
      <EmptyState art={art} title={title} action={action}>
        {text}
      </EmptyState>
      <Code className="at-scene-code">{code}</Code>
    </Panel>
  );
}

/** O estado vazio com cada objeto: "Nenhum arquivo ainda" é `object="arquivo"`. */
function EmptyObjects() {
  const [dudoo, setDudoo] = useState(false);
  const objects: [SceneObject, string][] = [
    ["slide", "Nenhum deck ainda"],
    ["arquivo", "Nenhum arquivo ainda"],
    ["pasta", "Nenhuma pasta ainda"],
    ["lista", "Nenhum cliente ainda"],
    ["grafico", "Nenhum relatório ainda"],
    ["mensagem", "Nenhuma conversa ainda"],
  ];
  return (
    <>
      <Group justify="space-between" mt={40} mb="xs" wrap="wrap">
        <Title order={3}>O que falta</Title>
        <Switch
          label="Com o DuDoo (só se a ação é dele)"
          checked={dudoo}
          onChange={(e) => setDudoo(e.currentTarget.checked)}
        />
      </Group>
      <Text className="dd-muted" mb="md" maw={760}>
        O estado vazio muda o objeto, não a cena. A mancha é o acento do app; o texto diz o que
        falta e o que fazer.
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
        {objects.map(([object, title]) => (
          <Panel key={object} className="at-card">
            <SceneEmpty object={object} dudoo={dudoo} />
            <Text size="sm" fw={600} ta="center" mt="xs">
              {title}
            </Text>
            <Text ta="center">
              <Code className="dd-nobreak">{object}</Code>
            </Text>
          </Panel>
        ))}
      </SimpleGrid>
    </>
  );
}

/* ——— Regras ——— */

function Rules() {
  const rules: [string, string][] = [
    [
      "Só os olhos mexem",
      "O corpo é o mascote e não estica, não ganha boca nem braço. Inclinar, só numa ilustração.",
    ],
    [
      "Neutro é o padrão",
      "Expressão é para um momento: pensando enquanto gera, feliz no marco. Se toda fala tem cara, nenhuma tem.",
    ],
    [
      "O DuDoo entra quando há ação dele",
      "Sugerir, gerar, revisar, explicar. Busca vazia, lista em dia: rabisco sem ele.",
    ],
    [
      "Uma aparição por tela",
      "Se o avatar já está no chat, a cena vazia ao lado não leva o DuDoo de novo.",
    ],
    [
      "No Sério, nem DuDoo nem cor",
      "Erro, cobrança, permissão, exclusão: traço em tinta, mancha cinza, sem brilho.",
    ],
    [
      "Uma cor da paleta por cena",
      "A do acento do app ou a do assunto. O DuDoo da cena é em tinta; o do avatar, limão no marinho.",
    ],
  ];
  return (
    <Section
      id="regras"
      title="Regras"
      note="O resumo. Completas em docs/marca.md (o DuDoo desenhado) e docs/ilustracao.md (as cenas)."
    >
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {rules.map(([t, d]) => (
          <Panel key={t} className="at-card">
            <Text fw={600}>{t}</Text>
            <Text size="sm" className="dd-muted">
              {d}
            </Text>
          </Panel>
        ))}
      </SimpleGrid>
      <Group mt="lg">
        <Button variant="default" leftSection={<ArrowLeft size={16} />} component="a" href="/">
          Voltar à cozinha
        </Button>
      </Group>
    </Section>
  );
}

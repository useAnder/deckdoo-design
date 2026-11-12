import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { isLightColor, useMantineTheme } from "@mantine/core";
import { Check } from "@phosphor-icons/react";
import { DECKDOO_BRAND, useBrand, useLockupApp, type BrandShape } from "./brand.js";
import { LockupView } from "./lockup-view.js";
import type { LockupApp, LockupVersion } from "./lockup.js";
import { SideTip, useSideCollapsed } from "./side.js";
import { DUDOO_MOODS, DuDooFace, type DuDooExpression, type DuDooMood } from "./dudoo.js";
import wallUrl from "./brand/dudoo-tile.svg";
import wallInverseUrl from "./brand/dudoo-tile-inverse.svg";

/**
 * As peças da suíte que o Mantine não tem com essa cara. Nascem aqui, se provam na cozinha
 * (`playground/`) e só depois entram nas telas. O visual está em `design.css`.
 */

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Painel branco sobre o fundo, com título e ações opcionais. */
export function Panel({
  title,
  actions,
  className,
  children,
  ...rest
}: { title?: ReactNode; actions?: ReactNode } & Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
>) {
  return (
    <section className={cx("dd-panel", className)} {...rest}>
      {(title || actions) && (
        <header className="dd-panel-head">
          {typeof title === "string" ? <h3 style={{ margin: 0 }}>{title}</h3> : title}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Block({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("dd-block", className)} {...rest} />;
}

export function Count({ children }: { children: ReactNode }) {
  return <span className="dd-count">{children}</span>;
}

interface NavItemOwnProps {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}

/**
 * Item da barra lateral. É botão; com `component` vira outra coisa — `component="a"` com
 * `href`, ou o link do roteador (`component={Link} to="/clientes"`). O `NavLink`, que marca
 * `aria-current="page"` sozinho, acende o item sem precisar de `active`. Rótulo longo não
 * quebra: corta com reticências e o nome inteiro fica no `title` (na barra recolhida, na dica).
 */
export type NavItemProps<C extends ElementType = "button"> = NavItemOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof NavItemOwnProps | "component">;

export function NavItem<C extends ElementType = "button">({
  component,
  icon,
  label,
  count,
  active,
  className,
  ...rest
}: NavItemProps<C>) {
  const collapsed = useSideCollapsed();
  const Root: ElementType = component ?? "button";
  return (
    <SideTip label={count !== undefined ? `${label} · ${count}` : label}>
      <Root
        type={Root === "button" ? "button" : undefined}
        className={cx("dd-nav-item", className)}
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? label : undefined}
        title={collapsed ? undefined : label}
        {...rest}
      >
        {icon}
        <span className="dd-nav-text">{label}</span>
        {count !== undefined && <Count>{count}</Count>}
      </Root>
    </SideTip>
  );
}

export interface PillTab {
  value: string;
  label: string;
  /** Antes do rótulo, no tamanho do texto (Phosphor a 16). */
  icon?: ReactNode;
  count?: number;
}

export function PillTabs({
  tabs,
  value,
  onChange,
  leading,
}: {
  tabs: PillTab[];
  value: string;
  onChange: (value: string) => void;
  leading?: ReactNode;
}) {
  return (
    <div className="dd-tabs" role="tablist">
      {leading}
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          className="dd-tab"
          aria-selected={tab.value === value}
          data-active={tab.value === value || undefined}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && <Count>{tab.count}</Count>}
        </button>
      ))}
    </div>
  );
}

export type Tone = "ok" | "info" | "attention" | "danger" | "neutral";

/** Pílula de estado com bolinha. O texto diz o estado; a cor só reforça. */
export function Status({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className="dd-status" data-tone={tone}>
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  active,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  active?: boolean;
}) {
  return (
    <div className="dd-stat" data-active={active || undefined}>
      <span className="dd-muted" style={{ fontSize: 13 }}>
        {label}
      </span>
      <span className="dd-stat-value">{value}</span>
      {hint && (
        <span className="dd-muted" style={{ fontSize: 12 }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export interface Step {
  label: string;
  when: string;
  state: "done" | "current" | "todo";
}

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="dd-steps" style={{ margin: 0, listStyle: "none" }}>
      {steps.map((step) => (
        <li
          key={step.label}
          className="dd-step"
          data-state={step.state}
          aria-current={step.state === "current" ? "step" : undefined}
        >
          <span className="dd-step-dot">
            {step.state === "done" && <Check size={12} weight="bold" />}
          </span>
          <strong style={{ fontWeight: 500 }}>{step.label}</strong>
          <span className="dd-mono dd-faint">{step.when}</span>
        </li>
      ))}
    </ol>
  );
}

/** Medidor de pontinhos: `value` de 0 a 1. */
export function Dots({ value, total = 10 }: { value: number; total?: number }) {
  const on = Math.round(value * total);
  return (
    <span
      className="dd-dots"
      role="meter"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-off={i >= on || undefined} />
      ))}
    </span>
  );
}

function LogoShape({
  shape,
  url,
  ratio,
  height,
}: BrandShape & {
  shape: "light" | "dark";
  height: number;
}) {
  return (
    <span
      aria-hidden
      className="dd-logo"
      data-shape={shape}
      style={{
        width: Math.round(height * ratio),
        height,
        // Com aspas: o SVG pode chegar como data URI, que sem elas quebra o `url()`.
        maskImage: `url("${url}")`,
        WebkitMaskImage: `url("${url}")`,
      }}
    />
  );
}

/**
 * A tinta sobre o acento do app: escura num acento claro (limão), clara num escuro (roxo). O
 * mascote segue a tinta: com tinta clara vai o desenho inverso, para a pupila nunca sair branca.
 */
function useAccentInk(): "light" | "dark" {
  const theme = useMantineTheme();
  const accent = theme.colors[theme.primaryColor]?.[6];
  return !accent || isLightColor(accent, theme.luminanceThreshold) ? "dark" : "light";
}

/**
 * A marca do app (`DesignProvider`; sem ele, a do DeckDoo), que escolhe o desenho pelo fundo
 * onde está: o inverso no tema escuro, dentro de `.dd-inverse` e sobre um acento escuro; o normal
 * no claro e sobre um acento claro. A escolha é do CSS (`design.css`), então acompanha a troca de
 * tema sem re-renderizar. Sobre fundo que o CSS não conhece (uma cor da paleta, uma foto), diga
 * com `on`.
 *
 * Com o app definido (`app`, ou o do `DesignProvider`), o `Logo` vira o lockup do app: por padrão
 * o `compact` (mascote + nome); `variant` escolhe os outros. `height` é sempre a altura do mascote.
 * O lockup é da marca DeckDoo: com outra marca no `DesignProvider`, vale o logotipo dela.
 */
export function Logo({
  variant,
  height = 28,
  on,
  color,
  label,
  app,
}: {
  /**
   * `type` = o logotipo; `mark` = o mascote ou símbolo sozinho; os demais são o lockup do app
   * (ver `LockupVersion`). Padrão: `compact` com app, `type` sem.
   */
  variant?: "type" | "mark" | LockupVersion;
  height?: number;
  /** Força o desenho: `light` = fundo claro, `dark` = fundo escuro. */
  on?: "light" | "dark";
  color?: string;
  /** Rótulo acessível. Padrão: o nome da marca (com o do app, no lockup). */
  label?: string;
  /** O app do lockup: um `LOCKUP_*` (nome em contorno) ou só o nome. Padrão: o do provider. */
  app?: LockupApp | string;
}) {
  const brand = useBrand();
  const provided = useLockupApp();
  const accentInk = useAccentInk();
  const given = app ?? provided;
  const lockupApp =
    brand === DECKDOO_BRAND && given ? (typeof given === "string" ? { name: given } : given) : null;
  const v = variant ?? (lockupApp ? "compact" : "type");

  const shapes = (form: "type" | "mark") => {
    const { light, dark = light } = brand[form];
    return [
      <LogoShape key="light" shape="light" height={height} {...light} />,
      <LogoShape key="dark" shape="dark" height={height} {...dark} />,
    ];
  };

  if (v !== "type" && v !== "mark") {
    if (lockupApp) {
      return (
        <LockupView
          version={v}
          height={height}
          app={lockupApp}
          label={label ?? `${brand.name} ${lockupApp.name}`}
          color={color}
          mark={
            <span className="dd-logo-switch" data-on={on} data-accent-ink={accentInk} aria-hidden>
              {shapes("mark")}
            </span>
          }
        />
      );
    }
  }

  return (
    <span
      role="img"
      aria-label={label ?? brand.name}
      className="dd-logo-switch"
      data-on={on}
      data-accent-ink={accentInk}
      style={{ color }}
    >
      {shapes(v === "mark" ? "mark" : "type")}
    </span>
  );
}

/**
 * O ícone de app: o mascote sobre um quadrado no acento do app. A tinta segue o contraste do
 * acento (escura no limão, clara num roxo), e o desenho acompanha.
 */
export function AppIcon({ size = 40 }: { size?: number }) {
  const ink = useAccentInk();
  return (
    <span className="dd-app-icon" style={{ width: size, height: size, borderRadius: size * 0.28 }}>
      <Logo
        variant="mark"
        on={ink === "dark" ? "light" : "dark"}
        height={Math.round(size * 0.56)}
        color="var(--dd-on-accent)"
      />
    </span>
  );
}

/**
 * O DuDoo, o assistente da suíte: o rosto de quem fala no chat, igual em todos os apps (é um
 * personagem, não a marca do app). Sobre fundo claro, limão com o mascote marinho; sobre fundo
 * escuro (e sobre o acento), marinho com o mascote limão. A pupila é sempre marinho. A troca é
 * pelo CSS (`--dd-dudoo-*`). A ação de IA ("Gerar com IA") continua com o ícone de brilho.
 */
export function DuDoo({
  size = 32,
  mood = "neutro",
}: {
  size?: number;
  /** A expressão: neutro é o padrão; muda com o que ele está fazendo (ver `docs/marca.md`). */
  mood?: DuDooMood | DuDooExpression;
}) {
  const ex = typeof mood === "string" ? DUDOO_MOODS[mood] : mood;
  return (
    <span className="dd-dudoo" role="img" aria-label="DuDoo" style={{ width: size, height: size }}>
      <DuDooFace
        size={Math.round(size * 0.56)}
        mood={ex.lean ? { ...ex, lean: 0 } : ex}
        color="var(--dd-dudoo-ink)"
        pupil="#0e172a"
        line="transparent"
        sclera="var(--dd-dudoo-white)"
        title=""
      />
    </span>
  );
}

/**
 * O papel de parede do DuDoo: o mascote repetido, bem de leve, atrás da conversa (ou do palco
 * do app de slides). O desenho é máscara: a cor vem do token e acompanha o tema.
 */
export function DuDooWall({ className, style, ...rest }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cx("dd-wall", className)}
      style={{
        ...style,
        ["--dd-wall-light" as string]: `url("${wallUrl}")`,
        ["--dd-wall-dark" as string]: `url("${wallInverseUrl}")`,
      }}
      {...rest}
    />
  );
}

/**
 * Uma fala do chat. A sua vai à direita, em tinta; a do DuDoo à esquerda, com o rosto dele
 * ao lado. Em falas seguidas do DuDoo, `avatar={false}` deixa só a primeira com o rosto.
 */
export function ChatBubble({
  from,
  avatar = true,
  mood,
  children,
}: {
  from: "dudoo" | "you";
  avatar?: boolean;
  /** A expressão do DuDoo nesta fala: a que combina com o que ele diz. */
  mood?: DuDooMood | DuDooExpression;
  children: ReactNode;
}) {
  const mine = from === "you";
  return (
    <div className="dd-chat-row" data-mine={mine || undefined}>
      {!mine && (avatar ? <DuDoo size={28} mood={mood} /> : <span className="dd-chat-gap" />)}
      <div className="dd-bubble" data-mine={mine || undefined}>
        {children}
      </div>
    </div>
  );
}

import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { isLightColor, useMantineTheme } from "@mantine/core";
import { Check } from "@phosphor-icons/react";
import { useBrand, type BrandShape } from "./brand.js";
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
 * `aria-current="page"` sozinho, acende o item sem precisar de `active`.
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
  const Root: ElementType = component ?? "button";
  return (
    <Root
      type={Root === "button" ? "button" : undefined}
      className={cx("dd-nav-item", className)}
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && <Count>{count}</Count>}
    </Root>
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
 * A marca do app (`DesignProvider`; sem ele, a do DeckDoo), que escolhe o desenho pelo fundo
 * onde está: o inverso no tema escuro e dentro de `.dd-inverse`; o normal no claro e sobre o
 * acento (`.dd-accent`). A escolha é do CSS (`design.css`), então acompanha a troca de tema sem
 * re-renderizar. Sobre fundo que o CSS não conhece (uma cor da paleta, uma foto), diga com `on`.
 */
export function Logo({
  variant = "type",
  height = 28,
  on,
  color,
  label,
}: {
  /** `type` = o logotipo; `mark` = o mascote ou símbolo sozinho. */
  variant?: "type" | "mark";
  height?: number;
  /** Força o desenho: `light` = fundo claro, `dark` = fundo escuro. */
  on?: "light" | "dark";
  color?: string;
  /** Rótulo acessível. Padrão: o nome da marca. */
  label?: string;
}) {
  const brand = useBrand();
  const { light, dark = light } = brand[variant];
  return (
    <span
      role="img"
      aria-label={label ?? brand.name}
      className="dd-logo-switch"
      data-on={on}
      style={{ color }}
    >
      <LogoShape shape="light" height={height} {...light} />
      <LogoShape shape="dark" height={height} {...dark} />
    </span>
  );
}

/**
 * O ícone de app: o mascote sobre um quadrado no acento do app. A tinta segue o contraste do
 * acento (escura no limão, clara num roxo), e o desenho acompanha.
 */
export function AppIcon({ size = 40 }: { size?: number }) {
  const theme = useMantineTheme();
  const accent = theme.colors[theme.primaryColor]?.[6];
  const onLight = accent ? isLightColor(accent, theme.luminanceThreshold) : true;
  return (
    <span className="dd-app-icon" style={{ width: size, height: size, borderRadius: size * 0.28 }}>
      <Logo
        variant="mark"
        on={onLight ? "light" : "dark"}
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

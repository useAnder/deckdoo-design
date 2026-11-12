import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ActionIcon, Collapse, Popover, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { CaretDown, CaretRight, SidebarSimple } from "@phosphor-icons/react";
import { SideScroll } from "./scroll.js";

/*
 * A barra lateral pronta (`SideBar`): o topo e o pé presos, os itens rolando no meio, e o
 * recolher para a coluna de ícones. Veio da `Shell` do `@eloquent-core/design`. O visual está em
 * `design.css`; a moldura em volta (`.dd-frame`, `.dd-main`) continua do app.
 */

/** A barra está recolhida (só os ícones)? As peças da barra trocam o rótulo pela dica. */
const CollapsedContext = createContext(false);

/**
 * Se a barra em volta está recolhida. Para o que o app põe no topo e no pé (`top`, `foot`): um
 * componente que lê isto e desenha a versão curta (só o avatar, só o ícone).
 */
export function useSideCollapsed(): boolean {
  return useContext(CollapsedContext);
}

const STORAGE_KEY = "dd-side-collapsed";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export interface SideBarLabels {
  /** O nome da navegação para leitor de tela. */
  nav: string;
  collapse: string;
  expand: string;
}

const SIDE_LABELS: SideBarLabels = {
  nav: "Navegação",
  collapse: "Recolher a barra",
  expand: "Abrir a barra",
};

export interface SideBarProps {
  /** O topo: o logo. */
  brand: ReactNode;
  /**
   * O logo na barra recolhida (o `AppIcon`, sem o nome). O botão de abrir fica ao lado dele, na
   * borda da barra. Sem ele, o topo fica só com o botão.
   */
  brandCollapsed?: ReactNode;
  /** Logo abaixo do logo, também preso: o espaço de trabalho, a busca. */
  top?: ReactNode;
  /** O pé, preso embaixo: o DuDoo, quem está logado. */
  foot?: ReactNode;
  /** A navegação (`NavSection`, `NavItem`, `NavGroup`): é o que rola. */
  children: ReactNode;
  /** Mostra o botão de recolher e liga a tecla `[`. Padrão: `true`. */
  collapsible?: boolean;
  /** Recolhida, controlada por quem chama. Sem ela, a escolha fica no `localStorage`. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: Partial<SideBarLabels>;
  className?: string;
}

/**
 * A barra lateral do app, para ir dentro da `.dd-frame`. O topo (`brand`, `top`) e o pé
 * (`foot`) ficam presos; só a navegação rola, com a barra fina e as bordas esmaecendo.
 *
 * Recolhe para a coluna de ícones no botão ao lado do logo ou na tecla `[` (fora de campo de
 * texto). Recolhida, o logo vira o `brandCollapsed` no mesmo ponto (e continua sendo o logo, com
 * o link que tiver), e o botão de abrir fica pequeno, preso na borda da barra, metade para fora:
 * sempre à vista, sem empilhar nada no topo, e os itens não descem. O rótulo vira dica à
 * direita, o rótulo de seção vira um fio, o contador vira um ponto e o
 * `NavGroup` abre ao lado. A escolha fica no `localStorage` da pessoa. Abaixo de 48em, onde a
 * barra vira o topo da página, não há recolhido.
 */
export function SideBar({
  brand,
  brandCollapsed,
  top,
  foot,
  children,
  collapsible = true,
  collapsed: controlled,
  onCollapsedChange,
  labels,
  className,
}: SideBarProps) {
  const text = { ...SIDE_LABELS, ...labels };
  const [stored, setStored] = useState(() => collapsible && readStored());
  // Abaixo de 48em a barra é o topo da página: sem recolhido (o mesmo ponto de `design.css`).
  const narrow = useMediaQuery("(max-width: 48em)", false, { getInitialValueInEffect: false });
  const canCollapse = collapsible && !narrow;
  const collapsed = canCollapse && (controlled ?? stored);

  const toggle = useCallback(() => {
    const next = !collapsed;
    if (controlled === undefined) {
      setStored(next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Sem armazenamento (janela anônima): vale só nesta visita.
      }
    }
    onCollapsedChange?.(next);
  }, [collapsed, controlled, onCollapsedChange]);

  // `[` recolhe e abre, como no Linear, fora de campo de texto.
  useEffect(() => {
    if (!canCollapse) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "[" || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
      )
        return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canCollapse, toggle]);

  const label = collapsed ? text.expand : text.collapse;

  return (
    <CollapsedContext value={collapsed}>
      <aside
        className={className ? `dd-side dd-panel ${className}` : "dd-side dd-panel"}
        data-collapsed={collapsed || undefined}
      >
        <div className="dd-side-head">
          <span className="dd-side-brand">{collapsed ? brandCollapsed : brand}</span>
          {canCollapse && (
            <Tooltip label={`${label} ( [ )`} position="right" offset={8}>
              <ActionIcon
                // Recolhida, o botão é pequeno e com contorno, na borda da barra.
                variant={collapsed ? "default" : "subtle"}
                color={collapsed ? undefined : "gray"}
                size={collapsed ? 22 : "md"}
                className="dd-side-collapse"
                onClick={toggle}
                aria-label={label}
                aria-expanded={!collapsed}
              >
                <SidebarSimple size={collapsed ? 13 : 18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
        {top && <div className="dd-side-top">{top}</div>}
        <SideScroll>
          <nav className="dd-side-nav" aria-label={text.nav}>
            {children}
          </nav>
        </SideScroll>
        {foot && <div className="dd-side-foot">{foot}</div>}
      </aside>
    </CollapsedContext>
  );
}

/** A dica da barra recolhida: o rótulo à direita do ícone. Fora dela, não faz nada. */
export function SideTip({ label, children }: { label: ReactNode; children: ReactNode }) {
  const collapsed = useSideCollapsed();
  return (
    <Tooltip label={label} position="right" offset={12} disabled={!collapsed} openDelay={80}>
      {children}
    </Tooltip>
  );
}

/** Um grupo da navegação com o rótulo em versalete (na barra recolhida, um fio). */
export function NavSection({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="dd-nav-section">
      {label && <div className="dd-eyebrow dd-side-label">{label}</div>}
      {children}
    </div>
  );
}

export interface NavGroupProps {
  icon?: ReactNode;
  label: string;
  defaultOpen?: boolean;
  /** Aberto ou fechado, controlado por quem chama (que guarda a escolha, por exemplo). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** O id da lista de itens, para o `aria-controls` do botão. */
  itemsId?: string;
  /** Algum item de dentro está ativo: o grupo nasce aberto e o rótulo acende de leve. */
  active?: boolean;
  children: ReactNode;
}

/**
 * Um grupo de um nível que abre e fecha (o "Decks" com as telas dele dentro). Na barra
 * recolhida, o grupo é um ícone e os itens abrem ao lado numa folha: ao passar o mouse, e no
 * clique ou Enter, para o toque e o teclado.
 */
export function NavGroup({
  icon,
  label,
  defaultOpen = false,
  active,
  open: controlledOpen,
  onOpenChange,
  itemsId,
  children,
}: NavGroupProps) {
  const collapsed = useSideCollapsed();
  const [ownOpen, setOwnOpen] = useState(defaultOpen || !!active);
  const open = controlledOpen ?? ownOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setOwnOpen(next);
    onOpenChange?.(next);
  };
  const [flyout, setFlyout] = useState(false);
  // Abre ao passar o mouse; fecha um instante depois de sair, para dar tempo de chegar à folha.
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverOpen = () => {
    clearTimeout(closeTimer.current);
    setFlyout(true);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setFlyout(false), 140);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (collapsed) {
    return (
      <Popover
        opened={flyout}
        onChange={setFlyout}
        position="right-start"
        offset={12}
        withinPortal
        shadow="md"
      >
        <Popover.Target>
          <button
            type="button"
            className="dd-nav-item dd-nav-group-head"
            data-has-active={active || undefined}
            aria-label={label}
            aria-expanded={flyout}
            onClick={hoverOpen}
            onMouseEnter={hoverOpen}
            onMouseLeave={hoverClose}
          >
            {icon}
            <span className="dd-nav-text">{label}</span>
            <CaretRight size={10} className="dd-nav-flyout-caret" />
          </button>
        </Popover.Target>
        <Popover.Dropdown
          className="dd-flyout"
          onClick={() => setFlyout(false)}
          onMouseEnter={hoverOpen}
          onMouseLeave={hoverClose}
        >
          <div className="dd-eyebrow dd-flyout-label">{label}</div>
          {/* Dentro da folha, os itens voltam a ter rótulo. */}
          <CollapsedContext value={false}>{children}</CollapsedContext>
        </Popover.Dropdown>
      </Popover>
    );
  }

  return (
    <div
      className="dd-nav-group"
      data-open={open || undefined}
      data-has-active={active || undefined}
    >
      <button
        type="button"
        className="dd-nav-item dd-nav-group-head"
        aria-expanded={open}
        aria-controls={itemsId}
        onClick={() => setOpen(!open)}
        title={label}
      >
        {icon}
        <span className="dd-nav-text">{label}</span>
        <CaretDown size={14} className="dd-nav-caret" />
      </button>
      <Collapse expanded={open}>
        <div className="dd-nav-group-body" id={itemsId}>
          {children}
        </div>
      </Collapse>
    </div>
  );
}

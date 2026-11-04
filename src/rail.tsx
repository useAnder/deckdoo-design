import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { ActionIcon, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { X } from "@phosphor-icons/react";

/**
 * As gavetas do app: a barra de ícones na borda direita (`SideRail`) e a gaveta aberta ao lado
 * dela (`SidePanel`). Subiu do Slides e do Marketing, que tinham o mesmo desenho cada um no seu
 * CSS. O visual está em `design.css`.
 */

/** O nome do evento de `requestPanel` / `usePanelRequests` quando o app não escolhe um. */
const DEFAULT_EVENT = "dd:abrir-gaveta";

/**
 * Abaixo desta largura (px) da bancada (`.dd-bench`, a linha com o palco, a gaveta e a barra), a
 * gaveta flutua por cima do palco em vez de empurrá-lo. É o `60em` da container query de
 * `design.css`; `useDrawerFloats` mede contra o mesmo número.
 */
export const DRAWER_FLOAT_BELOW = 960;

/** Uma gaveta da barra. */
export interface RailItem<K extends string = string> {
  readonly key: K;
  /** O rótulo embaixo do ícone. */
  readonly label: string;
  /** O ícone (Phosphor a 18–20). */
  readonly icon: ReactNode;
  /**
   * Fora de alcance agora (o estúdio fechado, o deck sem briefing): o ícone fica, apagado, e
   * isto é a dica de por quê. Clicar na gaveta que já está aberta fecha mesmo assim.
   */
  readonly off?: string;
}

export type RailButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  /** O ícone (Phosphor a 18–20). */
  icon: ReactNode;
  /** O rótulo embaixo do ícone. */
  label: ReactNode;
  /** Acende o ícone, como a gaveta aberta. */
  active?: boolean;
};

/**
 * Um botão com o desenho dos itens da barra (ícone na pílula, rótulo embaixo), para o que vai no
 * pé dela e não é gaveta: o seletor de layout, que abre um `Menu`. Repassa `ref` e os eventos,
 * então serve de filho de `Menu.Target` e `Tooltip`.
 */
export function RailButton({ icon, label, active = false, className, ...rest }: RailButtonProps) {
  return (
    <UnstyledButton
      {...rest}
      className={className ? `dd-rail-item ${className}` : "dd-rail-item"}
      data-active={active || undefined}
    >
      <span className="dd-rail-icon">{icon}</span>
      <span className="dd-rail-label">{label}</span>
    </UnstyledButton>
  );
}

export interface SideRailProps<K extends string = string> {
  items: readonly RailItem<K>[];
  /** A gaveta aberta, ou `null`. */
  open: K | null;
  onToggle: (key: K) => void;
  /** O pé da barra (o seletor de layout, num `RailButton`), colado embaixo. */
  footer?: ReactNode;
  /** O nome da barra para leitor de tela. Padrão: `"Gavetas"`. */
  label?: string;
  className?: string;
}

/**
 * A barra de ícones colada na borda direita, sempre à vista (como no Google Slides). Clicar abre
 * a gaveta; clicar de novo na aberta fecha. Quem decide qual gaveta está aberta é o app (`open`).
 */
export function SideRail<K extends string>({
  items,
  open,
  onToggle,
  footer,
  label = "Gavetas",
  className,
}: SideRailProps<K>) {
  return (
    <nav className={className ? `dd-rail ${className}` : "dd-rail"} aria-label={label}>
      {items.map((item) => {
        const button = (
          <RailButton
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={open === item.key}
            aria-pressed={open === item.key}
            aria-disabled={item.off !== undefined && open !== item.key}
            onClick={() => {
              if (item.off === undefined || open === item.key) onToggle(item.key);
            }}
          />
        );
        return item.off === undefined ? (
          button
        ) : (
          <Tooltip key={item.key} label={item.off} position="left" withArrow>
            {button}
          </Tooltip>
        );
      })}
      {footer ? <div className="dd-rail-foot">{footer}</div> : null}
    </nav>
  );
}

export interface SidePanelProps {
  title: string;
  /** Largura em px. Padrão: 340. */
  width?: number;
  onClose: () => void;
  children: ReactNode;
  /** O nome do botão de fechar para leitor de tela. Padrão: `"Fechar"`. */
  closeLabel?: string;
  /** Na raiz da gaveta: o ajuste de densidade do app (rótulos de campo, acordeão) vai por aqui. */
  className?: string;
  /**
   * Flutuar por cima do palco (`true`) ou encaixar ao lado (`false`). Sem ele, quem decide é o
   * CSS: dentro de uma `.dd-bench`, a largura dela (abaixo de `DRAWER_FLOAT_BELOW`); fora, a da
   * janela (62em). O app que precisa de outro ponto mede com `useDrawerFloats` e passa aqui.
   */
  floating?: boolean;
}

/**
 * A gaveta aberta, encaixada ao lado da barra: empurra o palco em vez de cobri-lo. O conteúdo
 * rola dentro dela. Sem espaço, ela flutua por cima (ver `floating` e `design.css`).
 */
export function SidePanel({
  title,
  width = 340,
  onClose,
  children,
  closeLabel = "Fechar",
  className,
  floating,
}: SidePanelProps) {
  return (
    <aside
      className={className ? `dd-drawer ${className}` : "dd-drawer"}
      style={{ width }}
      data-floating={floating === undefined ? undefined : String(floating)}
      aria-label={title}
    >
      <header className="dd-drawer-head">
        <Text fw={600} size="sm">
          {title}
        </Text>
        <ActionIcon variant="subtle" color="gray" aria-label={closeLabel} onClick={onClose}>
          <X size={16} />
        </ActionIcon>
      </header>
      <div className="dd-drawer-body">{children}</div>
    </aside>
  );
}

/**
 * Se a gaveta flutua na bancada `bench` (o elemento com `.dd-bench`): a largura dela abaixo de
 * `below` px. Mede com `ResizeObserver`, então acompanha a barra lateral do app abrindo e
 * fechando, e não só a janela. Com o padrão, diz o mesmo que o CSS; com outro número, passe o
 * resultado em `floating` no `SidePanel`, para o CSS e o app não divergirem. `false` enquanto
 * não há elemento.
 */
export function useDrawerFloats(bench: HTMLElement | null, below = DRAWER_FLOAT_BELOW): boolean {
  const [floats, setFloats] = useState(false);
  useLayoutEffect(() => {
    if (bench === null) return;
    const measure = () => setFloats(bench.getBoundingClientRect().width < below);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(bench);
    return () => observer.disconnect();
  }, [bench, below]);
  return bench === null ? false : floats;
}

/**
 * Abre uma gaveta de quem não tem a barra (o menu de um bloco, a imagem de outra gaveta). Vai
 * por evento no `window`; `event` é o nome, e deve ser o mesmo em `usePanelRequests`. Com `K`, a
 * chave fica amarrada às gavetas do app: `requestPanel<PanelKey>("tema", EVENTO)`.
 */
export function requestPanel<K extends string = string>(
  key: K,
  event: string = DEFAULT_EVENT,
): void {
  window.dispatchEvent(new CustomEvent<string>(event, { detail: key }));
}

/**
 * Quem tem a barra escuta os pedidos de abrir gaveta. Abre (não alterna).
 *
 * O evento passa por `window`, e o que chega nele não tem tipo: com `keys`, só as chaves da lista
 * chegam a `open` (a de outro app, ou de uma versão velha, é ignorada), e `open` recebe `K`.
 */
export function usePanelRequests<K extends string = string>(
  open: (key: K) => void,
  event: string = DEFAULT_EVENT,
  keys?: readonly K[],
): void {
  const latest = useRef(open);
  const allowed = useRef(keys);
  // O ouvinte lê sempre a última `open` e a última lista, sem reinscrever no `window` a cada render.
  useEffect(() => {
    latest.current = open;
    allowed.current = keys;
  });
  useEffect(() => {
    const onRequest = (e: Event) => {
      const key = (e as CustomEvent<unknown>).detail;
      if (typeof key !== "string") return;
      const list = allowed.current;
      if (list !== undefined && !(list as readonly string[]).includes(key)) return;
      latest.current(key as K);
    };
    window.addEventListener(event, onRequest);
    return () => window.removeEventListener(event, onRequest);
  }, [event]);
}

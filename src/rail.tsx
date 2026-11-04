import { useEffect, useRef, type ReactNode } from "react";
import { ActionIcon, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { X } from "@phosphor-icons/react";

/**
 * As gavetas do app: a barra de ícones na borda direita (`SideRail`) e a gaveta aberta ao lado
 * dela (`SidePanel`). Subiu do Slides e do Marketing, que tinham o mesmo desenho cada um no seu
 * CSS. O visual está em `design.css`.
 */

/** O nome do evento de `requestPanel` / `usePanelRequests` quando o app não escolhe um. */
const DEFAULT_EVENT = "dd:abrir-gaveta";

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

export interface SideRailProps<K extends string = string> {
  items: readonly RailItem<K>[];
  /** A gaveta aberta, ou `null`. */
  open: K | null;
  onToggle: (key: K) => void;
  /** O pé da barra (o seletor de layout), colado embaixo. */
  footer?: ReactNode;
  /** O nome da barra para leitor de tela. Padrão: `"Gavetas"`. */
  label?: string;
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
}: SideRailProps<K>) {
  return (
    <nav className="dd-rail" aria-label={label}>
      {items.map((item) => {
        const button = (
          <UnstyledButton
            key={item.key}
            className="dd-rail-item"
            data-active={open === item.key || undefined}
            aria-pressed={open === item.key}
            aria-disabled={item.off !== undefined && open !== item.key}
            onClick={() => {
              if (item.off === undefined || open === item.key) onToggle(item.key);
            }}
          >
            <span className="dd-rail-icon">{item.icon}</span>
            <span className="dd-rail-label">{item.label}</span>
          </UnstyledButton>
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
}

/**
 * A gaveta aberta, encaixada ao lado da barra: empurra o palco em vez de cobri-lo. O conteúdo
 * rola dentro dela. Em tela estreita ela flutua por cima (ver `design.css`).
 */
export function SidePanel({
  title,
  width = 340,
  onClose,
  children,
  closeLabel = "Fechar",
}: SidePanelProps) {
  return (
    <aside className="dd-drawer" style={{ width }} aria-label={title}>
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
 * Abre uma gaveta de quem não tem a barra (o menu de um bloco, a imagem de outra gaveta). Vai
 * por evento no `window`; `event` é o nome, e deve ser o mesmo em `usePanelRequests`.
 */
export function requestPanel(key: string, event: string = DEFAULT_EVENT): void {
  window.dispatchEvent(new CustomEvent<string>(event, { detail: key }));
}

/** Quem tem a barra escuta os pedidos de abrir gaveta. Abre (não alterna). */
export function usePanelRequests(open: (key: string) => void, event: string = DEFAULT_EVENT): void {
  const latest = useRef(open);
  // O ouvinte lê sempre a última `open`, sem reinscrever no `window` a cada render.
  useEffect(() => {
    latest.current = open;
  });
  useEffect(() => {
    const onRequest = (e: Event) => latest.current((e as CustomEvent<string>).detail);
    window.addEventListener(event, onRequest);
    return () => window.removeEventListener(event, onRequest);
  }, [event]);
}

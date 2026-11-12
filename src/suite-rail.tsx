import { useCallback, useState, type MouseEvent, type ReactNode } from "react";
import { ActionIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { CaretLineLeft, DotsNine } from "@phosphor-icons/react";
import type { SuiteService } from "./access.js";
import { SuiteAppIcon, suiteApp } from "./app-icons.js";

/*
 * O trilho de apps da suíte (`SuiteRail`): uma faixa estreita na borda esquerda da janela, fora
 * da moldura do app, com um ícone por app da pessoa. Está sempre à vista (é como a suíte se
 * divulga), e recolhe para um botão pequeno na borda da barra do app. O visual está em
 * `design.css` (`dd-suite-*`).
 */

export interface SuiteRailLabels {
  /** O nome da navegação para leitor de tela. Padrão: `"Apps da suíte"`. */
  nav: string;
  /** Depois do nome do app atual, na dica. Padrão: `"você está aqui"`. */
  here: string;
  /** Padrão: `"Recolher os apps"`. */
  collapse: string;
  /** Padrão: `"Mostrar os apps"`. */
  expand: string;
}

const SUITE_RAIL_LABELS: SuiteRailLabels = {
  nav: "Apps da suíte",
  here: "você está aqui",
  collapse: "Recolher os apps",
  expand: "Mostrar os apps",
};

const STORAGE_KEY = "dd-suite-rail-collapsed";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export interface SuiteRailProps {
  /**
   * Os serviços da pessoa (`GET /api/me/services`), na ordem do trilho. O ícone vem do `slug`
   * (`SUITE_APPS`); um serviço sem ícone sai com a inicial no quadrado neutro.
   */
  services: readonly SuiteService[];
  /** O `slug` do app em que a pessoa está: o único colorido. */
  currentSlug?: string;
  /**
   * No clique num app, antes de seguir o link. Um `preventDefault()` fica no app (o trilho de
   * um protótipo que só troca o atual, por exemplo).
   */
  onSelect?: (service: SuiteService, event: MouseEvent<HTMLElement>) => void;
  /** Recolhido, controlado por quem chama. Sem ele, a escolha fica no `localStorage`. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: Partial<SuiteRailLabels>;
  /** A moldura do app (a `.dd-frame`), que fica ao lado do trilho. */
  children: ReactNode;
  className?: string;
}

/**
 * O trilho de apps na borda da janela, em volta da moldura do app:
 *
 * ```tsx
 * <SuiteRail services={services} currentSlug="slides">
 *   <div className="dd-frame">…</div>
 * </SuiteRail>
 * ```
 *
 * Só o app atual tem a cor dele; os outros ficam no quadrado neutro e ganham a cor ao passar o
 * mouse (ou com o foco). O trilho é marinho no tema claro e tem o fundo do painel no escuro. O
 * primeiro app fica na altura da marca da barra lateral (`--dd-suite-rail-anchor`).
 *
 * O botão do pé recolhe o trilho; recolhido, fica um botão pequeno preso na borda esquerda da
 * barra do app, na altura da marca (o par do botão de abrir a `SideBar`). A escolha fica no
 * `localStorage` da pessoa. Abaixo de 48em, onde a barra vira o topo da página, não há trilho:
 * lá a troca de app é o `AppSwitcher`.
 *
 * É **apresentação**, como o `AppSwitcher`: a lista vem do app, e o trilho nunca decide acesso.
 */
export function SuiteRail({
  services,
  currentSlug,
  onSelect,
  collapsed: controlled,
  onCollapsedChange,
  labels,
  children,
  className,
}: SuiteRailProps) {
  const text = { ...SUITE_RAIL_LABELS, ...labels };
  const [stored, setStored] = useState(readStored);
  const collapsed = controlled ?? stored;
  const [hover, setHover] = useState<string | null>(null);

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (controlled === undefined) {
        setStored(next);
        try {
          localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        } catch {
          // Sem armazenamento (janela anônima): vale só nesta visita.
        }
      }
      onCollapsedChange?.(next);
    },
    [controlled, onCollapsedChange],
  );

  return (
    <div
      className={className ? `dd-suite-shell ${className}` : "dd-suite-shell"}
      data-collapsed={collapsed || undefined}
    >
      <nav className="dd-suite-rail" aria-label={text.nav} inert={collapsed}>
        {services.map((service) => {
          const here = service.slug === currentSlug;
          const app = suiteApp(service.slug);
          const label = app?.name ?? service.name;
          const item = (
            <SuiteAppIcon
              app={app ?? service.name}
              size={32}
              neutral={!here && hover !== service.slug}
              name=""
            />
          );
          return (
            // A dica toma o `onMouseEnter` do link: o passar do mouse vem do invólucro.
            <span
              key={service.slug}
              className="dd-suite-rail-slot"
              onMouseEnter={() => setHover(service.slug)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(service.slug)}
              onBlur={() => setHover(null)}
            >
              <Tooltip
                label={here ? `${label} · ${text.here}` : label}
                position="right"
                offset={12}
              >
                <UnstyledButton
                  component="a"
                  href={service.href}
                  className="dd-suite-rail-item"
                  aria-label={label}
                  aria-current={here ? "page" : undefined}
                  data-current={here || undefined}
                  onClick={(event: MouseEvent<HTMLElement>) => onSelect?.(service, event)}
                >
                  {item}
                </UnstyledButton>
              </Tooltip>
            </span>
          );
        })}
        <Tooltip label={text.collapse} position="right" offset={12}>
          <UnstyledButton
            className="dd-suite-rail-fold"
            aria-label={text.collapse}
            onClick={() => setCollapsed(true)}
          >
            <CaretLineLeft size={16} />
          </UnstyledButton>
        </Tooltip>
      </nav>
      {collapsed && (
        <Tooltip label={text.expand} position="right" offset={8}>
          <ActionIcon
            variant="default"
            size={22}
            className="dd-suite-rail-open"
            aria-label={text.expand}
            onClick={() => setCollapsed(false)}
          >
            <DotsNine size={13} weight="bold" />
          </ActionIcon>
        </Tooltip>
      )}
      {children}
    </div>
  );
}

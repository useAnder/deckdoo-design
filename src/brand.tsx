import { createContext, useContext, type ReactNode } from "react";
import logotypeUrl from "./brand/deckdoo-logotype.svg";
import logotypeInverseUrl from "./brand/deckdoo-logotype-inverse.svg";
import markUrl from "./brand/deckdoo-mark.svg";
import markInverseUrl from "./brand/deckdoo-mark-inverse.svg";
import type { LockupApp } from "./lockup.js";

/**
 * Um desenho da marca: a URL do SVG (ou data URI) e a proporção largura / altura. O SVG vira
 * máscara sobre `currentColor`, então só a forma importa; a cor do arquivo é ignorada.
 */
export interface BrandShape {
  url: string;
  ratio: number;
}

/**
 * Uma forma da marca em dois desenhos: o normal, para fundo claro, e o inverso, para fundo
 * escuro. Sem `dark`, o normal serve nos dois.
 */
export interface BrandForm {
  light: BrandShape;
  dark?: BrandShape;
}

export interface Brand {
  /** O nome, que vira o rótulo acessível do `Logo`. */
  name: string;
  /** O logotipo: o nome desenhado. */
  type: BrandForm;
  /** O mascote ou símbolo sozinho: ícone, avatar da IA, favicon. */
  mark: BrandForm;
}

/** A marca padrão da suíte: o DeckDoo, com o mascote no D. */
export const DECKDOO_BRAND: Brand = {
  name: "DeckDoo",
  type: {
    light: { url: logotypeUrl, ratio: 723.96 / 125.3 },
    dark: { url: logotypeInverseUrl, ratio: 390.64 / 79.53 },
  },
  mark: {
    light: { url: markUrl, ratio: 114.4 / 125.3 },
    dark: { url: markInverseUrl, ratio: 73.83 / 79.53 },
  },
};

const BrandContext = createContext<Brand>(DECKDOO_BRAND);
const AppContext = createContext<LockupApp | string | undefined>(undefined);

/**
 * A marca do app para o `Logo` e o `AppIcon`. Sem provider, vale a do DeckDoo. Com `app` (um
 * `LOCKUP_*`, ou só o nome), o `Logo` da suíte inteira vira o lockup do app: o mascote com o nome.
 */
export function DesignProvider({
  brand,
  app,
  children,
}: {
  brand?: Brand;
  app?: LockupApp | string;
  children: ReactNode;
}) {
  return (
    <BrandContext.Provider value={brand ?? DECKDOO_BRAND}>
      <AppContext.Provider value={app}>{children}</AppContext.Provider>
    </BrandContext.Provider>
  );
}

export function useBrand(): Brand {
  return useContext(BrandContext);
}

/** O app do `DesignProvider`, para o lockup. */
export function useLockupApp(): LockupApp | string | undefined {
  return useContext(AppContext);
}

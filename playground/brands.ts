import type { Brand } from "@deckdoo/design";
import markUrl from "./brands/exemplo-mark.svg";
import markInverseUrl from "./brands/exemplo-mark-inverse.svg";
import logotypeUrl from "./brands/exemplo-logotype.svg";

/**
 * Uma marca de mentira, para provar a sobrescrita (`DesignProvider brand`). O mascote tem os dois
 * desenhos; o logotipo só o normal, para provar que o inverso é opcional.
 */
export const EXEMPLO_BRAND: Brand = {
  name: "Exemplo",
  type: { light: { url: logotypeUrl, ratio: 400 / 100 } },
  mark: {
    light: { url: markUrl, ratio: 1 },
    dark: { url: markInverseUrl, ratio: 1 },
  },
};

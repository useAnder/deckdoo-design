import * as _mantine_core from '@mantine/core';
import { MantineColorsTuple, VariantColorsResolver, MenuProps } from '@mantine/core';
import * as react from 'react';
import { ReactNode, CSSProperties, ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ComponentType } from 'react';

/**
 * O padrão visual da suíte, nascido no DeckDoo (a bancada é a cozinha, em `playground/`).
 *
 * A paleta vem de `EloquentSlides/docs/branding/color-pallete.svg`; o desenho (painéis brancos
 * sobre fundo cinza, pílulas, cartão escuro da IA, acento em limão) vem das referências da mesma
 * pasta. Os valores que as telas leem fora do Mantine (fundo, superfícies, cantos) estão em
 * `tokens.css`.
 */
/** A paleta da marca, como veio do arquivo. Os nomes são os que a gente usa no código. */
declare const BRAND: {
    readonly ink: "#0e172a";
    readonly navy: "#0f1a3a";
    readonly lime: "#a2ff00";
    readonly cyan: "#00d4ff";
    readonly sky: "#00c3ff";
    readonly yellow: "#ffea2e";
    readonly orange: "#ff7a00";
    readonly coral: "#ff6f61";
    readonly magenta: "#e6007a";
    readonly purple: "#5e17eb";
    readonly paper: "#fbfcf8";
    readonly mist: "#eff7f6";
};
type BrandColor = keyof typeof BRAND;
/**
 * `color="inverse"`: tinta no claro, papel no escuro — o botão forte que não é o acento. Não é
 * uma cor do Mantine; os componentes abaixo leem os tokens `--dd-inverse*` direto.
 */
declare const INVERSE = "inverse";
/**
 * O jeito dos cantos, do mais redondo ao quadrado: `pilula` (controles em pílula), `suave`
 * (controles com canto de 14, painéis iguais), `sutil` (tudo bem menos arredondado: controle 8,
 * painel 16) e `reto` (tudo quadrado).
 */
type Corners = "pilula" | "suave" | "sutil" | "reto";
/** Uma cor da paleta pelo nome, ou qualquer hex (`#rgb` ou `#rrggbb`). */
type Accent = BrandColor | `#${string}`;
interface ThemeOptions {
    /** A cor de destaque do app. Padrão: limão. */
    accent?: Accent;
    corners?: Corners;
}
/** O hex do acento, com seis dígitos e em minúsculas. Nome fora da paleta ou hex torto é erro. */
declare function accentHex(accent: Accent): string;
declare function buildTheme({ accent, corners }?: ThemeOptions): {
    focusRing?: "always" | "never" | "auto" | undefined;
    scale?: number | undefined;
    fontSmoothing?: boolean | undefined;
    white?: string | undefined;
    black?: string | undefined;
    colors?: {
        [x: string & {}]: MantineColorsTuple | undefined;
        lime?: MantineColorsTuple | undefined;
        cyan?: MantineColorsTuple | undefined;
        yellow?: MantineColorsTuple | undefined;
        orange?: MantineColorsTuple | undefined;
        dark?: MantineColorsTuple | undefined;
        gray?: MantineColorsTuple | undefined;
        red?: MantineColorsTuple | undefined;
        pink?: MantineColorsTuple | undefined;
        grape?: MantineColorsTuple | undefined;
        violet?: MantineColorsTuple | undefined;
        indigo?: MantineColorsTuple | undefined;
        blue?: MantineColorsTuple | undefined;
        green?: MantineColorsTuple | undefined;
        teal?: MantineColorsTuple | undefined;
    } | undefined;
    primaryShade?: _mantine_core.MantineColorShade | {
        light?: _mantine_core.MantineColorShade | undefined;
        dark?: _mantine_core.MantineColorShade | undefined;
    } | undefined;
    primaryColor?: string | undefined;
    variantColorResolver?: VariantColorsResolver | undefined;
    autoContrast?: boolean | undefined;
    luminanceThreshold?: number | undefined;
    fontFamily?: string | undefined;
    fontFamilyMonospace?: string | undefined;
    headings?: {
        fontFamily?: string | undefined;
        fontWeight?: string | undefined;
        textWrap?: "wrap" | "nowrap" | "balance" | "pretty" | "stable" | undefined;
        sizes?: {
            h1?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h2?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h3?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h4?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h5?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h6?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    radius?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    defaultRadius?: _mantine_core.MantineRadius | undefined;
    spacing?: {
        [x: number]: string | undefined;
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    fontSizes?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    lineHeights?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    fontWeights?: {
        [x: string & {}]: string | undefined;
        bold?: string | undefined;
        regular?: string | undefined;
        medium?: string | undefined;
    } | undefined;
    breakpoints?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    shadows?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    respectReducedMotion?: boolean | undefined;
    cursorType?: "default" | "pointer" | undefined;
    defaultGradient?: {
        from?: string | undefined;
        to?: string | undefined;
        deg?: number | undefined;
    } | undefined;
    activeClassName?: string | undefined;
    focusClassName?: string | undefined;
    components?: {
        [x: string]: {
            classNames?: any;
            styles?: any;
            vars?: any;
            defaultProps?: any;
        } | undefined;
    } | undefined;
    other?: {
        [x: string]: any;
    } | undefined;
};

/**
 * As medidas do lockup de cada app (o mascote, o nome do app e o "DeckDoo"), decididas na bancada
 * da marca (`/marca.html` na cozinha). Sem `import` de propósito: o `scripts/lockup.mjs` lê este
 * arquivo direto no Node para saber em que pesos gerar os nomes.
 *
 * Proporções são da altura do mascote; espaços são em pupilas (o diâmetro da pupila do mascote,
 * 15,6% da altura dele), para crescer junto com a marca.
 */
interface LockupSpec {
    /** O peso do nome em tamanho grande. */
    weight: number;
    /** Engrossa o nome no tamanho pequeno: abaixo de 56px sobe até 400, aos 20px chega lá. */
    autoWeight: boolean;
    /** Espaço entre letras, em em. */
    tracking: number;
    /** Mascote + nome. */
    compact: {
        /** Altura da maiúscula do nome / altura do mascote. */
        cap: number;
        /** Do mascote à tinta da primeira letra, em pupilas. */
        gap: number;
        /** O que o centro da maiúscula acompanha: o centro do mascote ou a linha dos olhos. */
        align: "center" | "eyes" | "top" | "baseline";
    };
    /** Mascote + nome, com o "DeckDoo" embaixo. O nome encosta no topo, o "DeckDoo" na base. */
    stacked: {
        cap: number;
        /** Altura da maiúscula do "DeckDoo" / altura do mascote. */
        word: number;
        gap: number;
        /** Onde a descendente do nome cai em cima de uma letra do "DeckDoo", abre um respiro nela. */
        knock: boolean;
    };
    /** O logotipo inteiro (mascote + "DeckDoo") e o nome depois, na mesma linha de base. */
    inline: {
        /** Altura da maiúscula do nome / a do "DeckDoo". */
        cap: number;
        /** Do "DeckDoo" ao nome, em pupilas. */
        gap: number;
        /** Um fio entre os dois. */
        rule: boolean;
    };
}
declare const LOCKUP_SPEC: LockupSpec;
/** O peso do nome numa altura de mascote. */
declare function lockupWeight(height: number, spec?: LockupSpec): number;
/** Os pesos em que o nome é gerado em contorno: o grande, o pequeno e o do meio. */
declare function lockupWeights(spec?: LockupSpec): number[];

/**
 * A geometria do lockup de cada app: onde vão o nome e o "DeckDoo" em relação ao mascote. É a
 * mesma conta para o `Logo` (com o nome em contorno, gerado) e para a bancada da marca (com o
 * nome medido na fonte ao vivo); muda aqui, muda nos dois.
 */
/**
 * - `compact`: mascote + nome.
 * - `stacked`: mascote + nome, com o "DeckDoo" embaixo.
 * - `inline`: o logotipo (mascote + "DeckDoo") e o nome depois.
 * - `text-stacked`, `text-inline`: os dois de cima sem o mascote.
 */
type LockupVersion = "compact" | "stacked" | "inline" | "text-stacked" | "text-inline";
declare const LOCKUP_VERSIONS: readonly LockupVersion[];
/**
 * As medidas do nome, em fração do corpo da fonte, a partir da origem do texto (o começo da linha
 * de base). `glyphs` é a tinta de cada letra: [começo, fim, quanto desce da base].
 */
interface LockupMetrics {
    capFrac: number;
    inkLeft: number;
    inkRight: number;
    ascent: number;
    glyphs: readonly (readonly [number, number, number])[];
}
/** O nome em contorno num peso: o caminho em milésimos de em, com y para baixo. */
interface LockupOutline {
    weight: number;
    d: string;
    metrics: LockupMetrics;
}
/**
 * O nome de um app. Com `outlines` (gerados por `pnpm lockup`), o `Logo` desenha o nome em
 * contorno, igual em qualquer lugar; sem eles, escreve com a fonte da página.
 */
interface LockupApp {
    name: string;
    outlines?: readonly LockupOutline[];
}
/** O diâmetro da pupila / a altura: a unidade dos espaços. */
declare const MARK_PUPIL: number;
/**
 * O bloco de texto do lockup, em px, com x = 0 onde a tinta começa e y = 0 no topo do mascote.
 * O mascote fica antes dele, a `gap` de distância (0 sem o mascote).
 */
interface LockupBlock {
    gap: number;
    width: number;
    /** O que passa do topo e da base do mascote (ascendente, descendente). */
    minY: number;
    maxY: number;
    text: {
        x: number;
        baseline: number;
        size: number;
        capH: number;
    };
    word?: {
        x: number;
        baseline: number;
        scale: number;
    };
    rule?: {
        x: number;
        y1: number;
        y2: number;
        width: number;
    };
    /** Nas empilhadas: da descendente do nome ao topo da letra do "DeckDoo" embaixo dela. */
    clearance?: number;
    /** A espessura do recorte no "DeckDoo", quando ele vai. */
    knock?: number;
}
declare function lockupHasMark(version: LockupVersion): boolean;
declare function lockupLayout(version: LockupVersion, height: number, m: LockupMetrics, spec?: LockupSpec): LockupBlock;
/** O contorno gerado mais perto do peso pedido. */
declare function pickOutline(outlines: readonly LockupOutline[] | undefined, weight: number): LockupOutline | undefined;
/** O `transform` que põe o "DeckDoo" (unidades do logotipo) no lugar do bloco. */
declare function wordTransform(word: NonNullable<LockupBlock["word"]>): string;

/**
 * Um desenho da marca: a URL do SVG (ou data URI) e a proporção largura / altura. O SVG vira
 * máscara sobre `currentColor`, então só a forma importa; a cor do arquivo é ignorada.
 */
interface BrandShape {
    url: string;
    ratio: number;
}
/**
 * Uma forma da marca em dois desenhos: o normal, para fundo claro, e o inverso, para fundo
 * escuro. Sem `dark`, o normal serve nos dois.
 */
interface BrandForm {
    light: BrandShape;
    dark?: BrandShape;
}
interface Brand {
    /** O nome, que vira o rótulo acessível do `Logo`. */
    name: string;
    /** O logotipo: o nome desenhado. */
    type: BrandForm;
    /** O mascote ou símbolo sozinho: ícone, avatar da IA, favicon. */
    mark: BrandForm;
}
/** A marca padrão da suíte: o DeckDoo, com o mascote no D. */
declare const DECKDOO_BRAND: Brand;
/**
 * A marca do app para o `Logo` e o `AppIcon`. Sem provider, vale a do DeckDoo. Com `app` (um
 * `LOCKUP_*`, ou só o nome), o `Logo` da suíte inteira vira o lockup do app: o mascote com o nome.
 */
declare function DesignProvider({ brand, app, children, }: {
    brand?: Brand;
    app?: LockupApp | string;
    children: ReactNode;
}): react.JSX.Element;
declare function useBrand(): Brand;
/** O app do `DesignProvider`, para o lockup. */
declare function useLockupApp(): LockupApp | string | undefined;

/**
 * O "DeckDoo" desenhado, sem o mascote: as letras do `deckdoo-logotype.svg`, nas unidades dele
 * (o mascote tem 125,3 de altura; as letras vão de x 136,06 a 723,96). É a assinatura dos
 * lockups de cada app (`Logo` com `app`).
 */
declare const DECKDOO_WORD: {
    /** Onde a tinta começa e termina na horizontal. */
    readonly left: 136.06;
    readonly right: 723.96;
    /** Topo do "k" (a ascendente passa da maiúscula), topo do "D" e linha de base. */
    readonly ascender: 11.7;
    readonly capTop: 15.78;
    readonly baseline: 109.57;
    /** O "o" passa um pouco da base. */
    readonly bottom: 111.7;
    readonly paths: readonly ["M197.37,21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97,0,17.13-2.04,24.47-6.12,7.34-4.08,13.09-9.7,17.26-16.86,4.17-7.16,6.25-15.13,6.25-23.92s-2.08-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM196.35,76.88c-2.4,4.21-5.69,7.52-9.86,9.92-4.17,2.4-8.83,3.6-14,3.6h-16.04v-55.46h16.04c5.17,0,9.83,1.2,14,3.6,4.17,2.4,7.45,5.71,9.86,9.92,2.4,4.21,3.6,8.95,3.6,14.2s-1.2,9.99-3.6,14.21Z", "M286.27,43.37c-5.71-3.17-12.01-4.76-18.89-4.76s-13.44,1.59-19.1,4.76c-5.66,3.17-10.13,7.52-13.39,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.72,9.88,13.39,13.05,5.66,3.17,12.03,4.76,19.1,4.76,8.52,0,16.02-2.2,22.5-6.59,6.48-4.39,10.94-10.26,13.39-17.6h-20.39c-1.18,2.17-3.15,3.96-5.91,5.37-2.77,1.41-5.87,2.11-9.31,2.11s-6.52-.82-9.24-2.45-4.85-3.92-6.39-6.86c-.63-1.21-1.13-2.5-1.5-3.87h53.7c.27-1.63.41-3.67.41-6.12,0-6.89-1.63-13.12-4.89-18.69s-7.75-9.94-13.46-13.12ZM258.27,57.78c2.72-1.63,5.75-2.45,9.11-2.45s6.23.77,8.9,2.31c2.67,1.54,4.78,3.72,6.32,6.52.68,1.23,1.19,2.55,1.57,3.94h-33.55c.34-1.19.78-2.32,1.32-3.4,1.5-2.99,3.6-5.3,6.32-6.93Z", "M340.43,59.41c2.67-1.54,5.69-2.31,9.04-2.31,3.71,0,7,.98,9.86,2.92,2.85,1.95,4.96,4.51,6.32,7.68h20.39c-1.09-5.62-3.33-10.62-6.73-15.02-3.4-4.39-7.68-7.84-12.85-10.33-5.17-2.49-10.83-3.74-16.99-3.74-7.07,0-13.44,1.59-19.1,4.76-5.66,3.17-10.13,7.52-13.39,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.72,9.88,13.39,13.05,5.66,3.17,12.03,4.76,19.1,4.76,6.16,0,11.83-1.25,16.99-3.74,5.17-2.49,9.45-5.93,12.85-10.33,3.4-4.39,5.64-9.4,6.73-15.02h-20.39c-1.36,3.17-3.47,5.73-6.32,7.68-2.86,1.95-6.14,2.92-9.86,2.92-3.35,0-6.37-.77-9.04-2.31-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39Z", "M462.98,40.25L440,40.25L423.85,65.94L416.76,65.94L416.76,11.7L397.59,11.7L397.59,109.57L416.76,109.57L416.76,83.34L423.79,83.34L440.55,109.57L463.93,109.57L439.63,74.7L462.98,40.25Z", "M534.2,21.9c-7.34-4.08-15.5-6.12-24.47-6.12h-36.84v93.79h36.84c8.97,0,17.13-2.04,24.47-6.12,7.34-4.08,13.09-9.7,17.26-16.86,4.17-7.16,6.25-15.13,6.25-23.92s-2.09-16.76-6.25-23.92c-4.17-7.16-9.92-12.78-17.26-16.86ZM533.18,76.88c-2.4,4.21-5.69,7.52-9.85,9.92-4.17,2.4-8.84,3.6-14,3.6h-16.04v-55.46h16.04c5.17,0,9.83,1.2,14,3.6,4.17,2.4,7.45,5.71,9.85,9.92,2.4,4.21,3.6,8.95,3.6,14.2s-1.2,9.99-3.6,14.21Z", "M623.24,43.37c-5.71-3.17-12.05-4.76-19.03-4.76s-13.32,1.59-19.03,4.76c-5.71,3.17-10.2,7.52-13.46,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.75,9.88,13.46,13.05,5.71,3.17,12.05,4.76,19.03,4.76s13.32-1.59,19.03-4.76c5.71-3.17,10.17-7.52,13.39-13.05,3.22-5.53,4.83-11.69,4.83-18.49s-1.61-12.96-4.83-18.49c-3.22-5.53-7.68-9.88-13.39-13.05ZM619.43,84.02c-1.54,2.72-3.65,4.85-6.32,6.39-2.67,1.54-5.64,2.31-8.9,2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39,2.67-1.54,5.64-2.31,8.9-2.31s6.37.77,9.04,2.31c2.67,1.54,4.78,3.67,6.32,6.39,1.54,2.72,2.31,5.76,2.31,9.11s-.77,6.39-2.31,9.11Z", "M719.13,56.42c-3.22-5.53-7.68-9.88-13.39-13.05-5.71-3.17-12.05-4.76-19.03-4.76s-13.32,1.59-19.03,4.76c-5.71,3.17-10.2,7.52-13.46,13.05-3.26,5.53-4.89,11.69-4.89,18.49s1.63,12.96,4.89,18.49c3.26,5.53,7.75,9.88,13.46,13.05,5.71,3.17,12.05,4.76,19.03,4.76s13.32-1.59,19.03-4.76c5.71-3.17,10.17-7.52,13.39-13.05,3.22-5.53,4.83-11.69,4.83-18.49s-1.61-12.96-4.83-18.49ZM701.94,84.02c-1.54,2.72-3.65,4.85-6.32,6.39-2.67,1.54-5.64,2.31-8.9,2.31s-6.37-.77-9.04-2.31c-2.67-1.54-4.78-3.67-6.32-6.39-1.54-2.72-2.31-5.75-2.31-9.11s.77-6.39,2.31-9.11c1.54-2.72,3.65-4.85,6.32-6.39,2.67-1.54,5.64-2.31,8.9-2.31s6.37.77,9.04,2.31c2.67,1.54,4.78,3.67,6.32,6.39,1.54,2.72,2.31,5.76,2.31,9.11s-.77,6.39-2.31,9.11Z"];
    /**
     * O topo de cada letra: [início, fim, topo]. O "k" vai em duas partes, a haste alta e o braço
     * na altura do "e". Serve para saber se a descendente do nome cai em cima de uma letra.
     */
    readonly profile: readonly [readonly [136.06, 220.88, 15.78], readonly [230, 304.64, 38.61], readonly [312.09, 386.04, 38.61], readonly [397.59, 416.76, 11.7], readonly [416.76, 463.93, 40.25], readonly [472.89, 557.71, 15.78], readonly [566.83, 641.46, 38.61], readonly [649.33, 723.96, 38.61]];
};

declare const LOCKUP_COMMERCE: LockupApp;
declare const LOCKUP_MARKETING: LockupApp;
declare const LOCKUP_PAGES: LockupApp;
declare const LOCKUP_SITES: LockupApp;
declare const LOCKUP_SLIDES: LockupApp;
declare const LOCKUP_WORKS: LockupApp;

interface DuDooEye {
    /** Tamanho do olho; 1 é o do mascote. */
    size: number;
    /** Quanto a pálpebra de cima desce, de 0 (aberto) a 1. */
    top: number;
    /** Inclinação da pálpebra de cima, em graus. Positivo desce o lado direito da linha. */
    tilt: number;
    /** Quanto a pálpebra de baixo sobe, de 0 a 1. */
    bottom: number;
    /** Para onde a pupila deste olho olha; sem isso, vale o `look` do rosto. */
    look?: [number, number];
    /**
     * Olho fechado como um corte em curva, no lugar do furo: 1 é o "^" (sorrindo), −1 o "‿"
     * (dormindo), 0 um traço reto.
     */
    arc?: number;
}
interface DuDooExpression {
    /** Para onde as pupilas olham: x e y de −1 a 1 (−1, 0 é a esquerda da tela). */
    look: [number, number];
    /** Tamanho da pupila; 1 é a do mascote. */
    pupil: number;
    left: DuDooEye;
    right: DuDooEye;
    /** Inclinação do corpo inteiro, em graus. Só em ilustração; o avatar ignora. */
    lean: number;
}
/** Monta uma expressão a partir do neutro, só com o que muda (`both` vale para os dois olhos). */
declare function dudooExpression(e: Partial<Omit<DuDooExpression, "left" | "right">> & {
    left?: Partial<DuDooEye>;
    right?: Partial<DuDooEye>;
    both?: Partial<DuDooEye>;
}): DuDooExpression;
/** O vocabulário do DuDoo. Quando usar cada uma está em `docs/marca.md`. */
declare const DUDOO_MOODS: {
    neutro: DuDooExpression;
    olhando: DuDooExpression;
    pensando: DuDooExpression;
    curioso: DuDooExpression;
    "de-canto": DuDooExpression;
    focado: DuDooExpression;
    empolgado: DuDooExpression;
    feliz: DuDooExpression;
    piscada: DuDooExpression;
    esperando: DuDooExpression;
    dormindo: DuDooExpression;
    confuso: DuDooExpression;
};
type DuDooMood = keyof typeof DUDOO_MOODS;
interface DuDooFaceProps {
    /** Uma expressão do vocabulário (`"pensando"`) ou uma montada com `dudooExpression`. */
    mood?: DuDooMood | DuDooExpression;
    /** Altura em px; a largura sai da proporção do mascote. */
    size?: number;
    /** Cor do corpo. Padrão: `--dd-dudoo-body`, o marinho, nos dois temas. */
    color?: string;
    /** Cor da pupila. Padrão: a do corpo. A pupila é sempre escura. */
    pupil?: string;
    /**
     * O contorno, como no mascote invertido da marca: uma faixa por dentro da borda do D, que
     * aparece também no corte do olho fechado. Padrão: `--dd-dudoo-line`, transparente sobre
     * fundo claro e papel sobre fundo escuro.
     */
    line?: string;
    /**
     * O branco do olho, inteiro: o olho da direita sai da borda do D como um círculo. Padrão: a
     * cor do contorno; transparente, o furo mostra o fundo, como no mascote original.
     */
    sclera?: string;
    className?: string;
    style?: CSSProperties;
    /** O rótulo acessível; `""` para quando o DuDoo é só enfeite ao lado do nome dele. */
    title?: string;
}
/**
 * O mascote com expressão, para ilustração (estado vazio, cena, o DuDoo espiando) e para o
 * avatar. Escolhe as cores pelo fundo sozinho, pelos tokens `--dd-dudoo-*`.
 */
declare function DuDooFace({ mood, size, color, line, pupil, sclera, className, style, title, }: DuDooFaceProps): react.JSX.Element;

/** Painel branco sobre o fundo, com título e ações opcionais. */
declare function Panel({ title, actions, className, children, ...rest }: {
    title?: ReactNode;
    actions?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "title">): react.JSX.Element;
declare function Block({ className, ...rest }: ComponentPropsWithoutRef<"div">): react.JSX.Element;
declare function Count({ children }: {
    children: ReactNode;
}): react.JSX.Element;
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
type NavItemProps<C extends ElementType = "button"> = NavItemOwnProps & {
    component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof NavItemOwnProps | "component">;
declare function NavItem<C extends ElementType = "button">({ component, icon, label, count, active, className, ...rest }: NavItemProps<C>): react.JSX.Element;
interface PillTab {
    value: string;
    label: string;
    /** Antes do rótulo, no tamanho do texto (Phosphor a 16). */
    icon?: ReactNode;
    count?: number;
}
declare function PillTabs({ tabs, value, onChange, leading, }: {
    tabs: PillTab[];
    value: string;
    onChange: (value: string) => void;
    leading?: ReactNode;
}): react.JSX.Element;
type Tone = "ok" | "info" | "attention" | "danger" | "neutral";
/** Pílula de estado com bolinha. O texto diz o estado; a cor só reforça. */
declare function Status({ tone, children }: {
    tone: Tone;
    children: ReactNode;
}): react.JSX.Element;
declare function Stat({ label, value, hint, active, }: {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
    active?: boolean;
}): react.JSX.Element;
interface Step {
    label: string;
    when: string;
    state: "done" | "current" | "todo";
}
declare function Steps({ steps }: {
    steps: Step[];
}): react.JSX.Element;
/** Medidor de pontinhos: `value` de 0 a 1. */
declare function Dots({ value, total }: {
    value: number;
    total?: number;
}): react.JSX.Element;
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
declare function Logo({ variant, height, on, color, label, app, }: {
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
}): react.JSX.Element;
/**
 * O ícone de app: o mascote sobre um quadrado no acento do app. A tinta segue o contraste do
 * acento (escura no limão, clara num roxo), e o desenho acompanha.
 */
declare function AppIcon({ size }: {
    size?: number;
}): react.JSX.Element;
/**
 * O DuDoo, o assistente da suíte: o rosto de quem fala no chat, igual em todos os apps (é um
 * personagem, não a marca do app). Sobre fundo claro, limão com o mascote marinho; sobre fundo
 * escuro (e sobre o acento), marinho com o mascote limão. A pupila é sempre marinho. A troca é
 * pelo CSS (`--dd-dudoo-*`). A ação de IA ("Gerar com IA") continua com o ícone de brilho.
 */
declare function DuDoo({ size, mood, }: {
    size?: number;
    /** A expressão: neutro é o padrão; muda com o que ele está fazendo (ver `docs/marca.md`). */
    mood?: DuDooMood | DuDooExpression;
}): react.JSX.Element;
/**
 * O papel de parede do DuDoo: o mascote repetido, bem de leve, atrás da conversa (ou do palco
 * do app de slides). O desenho é máscara: a cor vem do token e acompanha o tema.
 */
declare function DuDooWall({ className, style, ...rest }: ComponentPropsWithRef<"div">): react.JSX.Element;
/**
 * Uma fala do chat. A sua vai à direita, em tinta; a do DuDoo à esquerda, com o rosto dele
 * ao lado. Em falas seguidas do DuDoo, `avatar={false}` deixa só a primeira com o rosto.
 */
declare function ChatBubble({ from, avatar, mood, children, }: {
    from: "dudoo" | "you";
    avatar?: boolean;
    /** A expressão do DuDoo nesta fala: a que combina com o que ele diz. */
    mood?: DuDooMood | DuDooExpression;
    children: ReactNode;
}): react.JSX.Element;

/**
 * O DuDoo em movimento. Devolve, quadro a quadro, a expressão que o `DuDooFace` desenha; nada
 * no desenho muda. Regras em `docs/marca.md` (Movimento); a bancada é o ateliê. Três camadas, uma por cima da outra:
 *
 * 1. **A troca de mood.** Interpola os números de uma expressão até a outra. O olhar chega
 *    primeiro e as pálpebras vêm atrás, como quem vira o olho antes de mudar de cara. O olho
 *    fechado ("^", "‿") é outro desenho, então para chegar nele a pálpebra fecha até a fresta
 *    e só aí vira curva: a troca é uma piscada.
 * 2. **A vida própria**, por mood: a pupila passeia no `pensando`, dá uma olhada de lado no
 *    `neutro`, o olho respira no `dormindo`.
 * 3. **A piscada**, de vez em quando, com o olho aberto.
 *
 * O ritmo da troca vem da intensidade do mood (`docs/marca.md`): Trabalho é rápido e sem passar
 * do ponto; Festa tem mola; Neutro é calmo. Com movimento reduzido, a troca fica curta e sem
 * mola, a piscada e a piscadinha ficam, e sai o que mexe sem parar (olhar solto, respiração, riso).
 */
type DuDooIntensity = "neutro" | "trabalho" | "festa";
declare const DUDOO_INTENSITY: Record<DuDooMood, DuDooIntensity>;
type Ease = (t: number) => number;
/**
 * O ritmo da troca por intensidade: Trabalho rápido e no ponto, Neutro calmo, Festa com mola e o
 * olho saltando (`pop`, quanto ele cresce no meio da troca).
 */
declare const DUDOO_TIMING: Record<DuDooIntensity, {
    ms: number;
    ease: Ease;
    /** Quanto o olho cresce no meio da troca. */ pop: number;
}>;
/**
 * Movimento reduzido não é DuDoo parado: a troca continua, curta e sem mola nem salto, e a
 * piscada fica (é pequena e rara). Sai o que mexe sem parar: o olhar solto, a respiração, o riso.
 */
declare const DUDOO_REDUCED_TIMING: (typeof DUDOO_TIMING)[DuDooIntensity];
interface DuDooMotionOptions {
    /** Piscar de vez em quando. */
    blink?: boolean;
    /** O olhar solto e a respiração. */
    idle?: boolean;
    /**
     * Troca curta, sem mola, e nada mexendo sem parar (a piscada fica). Padrão: o
     * `prefers-reduced-motion` do sistema.
     */
    reduced?: boolean;
    /** Multiplica o tempo, para ver de perto; 1 é o ritmo de verdade. */
    speed?: number;
    /** Força o ritmo da troca; sem isso, vale a intensidade do mood. */
    intensity?: DuDooIntensity;
}
declare function usePrefersReducedMotion(): boolean;
/**
 * O motor, sem React e sem relógio do browser: quem usa avança o tempo (`advance`) e recebe o
 * quadro. É o que o hook roda a cada `requestAnimationFrame`, e o que dá para testar quadro a
 * quadro.
 */
declare class DuDooMotion {
    private clock;
    private from;
    private to;
    private name;
    private start;
    private ms;
    private ease;
    private pop;
    private last;
    /** A piscadinha já reabriu o olho. */
    private winked;
    private chuckleAt;
    private nextChuckle;
    private look;
    private away;
    private blinkAt;
    private nextBlink;
    private double;
    constructor(mood: DuDooMood | DuDooExpression);
    /** Mood novo: a troca parte de onde ele está agora, não do mood anterior. */
    set(mood: DuDooMood | DuDooExpression, intensity?: DuDooIntensity): void;
    /** Movimento reduzido: as próximas trocas saem curtas e sem mola. */
    reduced: boolean;
    /** A troca em si: de onde ele está agora até `target`, sem mudar o nome do mood. */
    private tween;
    /**
     * Avança `dt` ms e devolve o quadro. `gesture` deixa a piscadinha reabrir; sem ele (a fala
     * antiga do chat), ela fica fechada, como o desenho.
     */
    advance(dt: number, { blink, idle, gesture, }?: {
        blink?: boolean;
        idle?: boolean;
        gesture?: boolean;
    }): DuDooExpression;
    /** Pisca agora, para testar. */
    blinkNow(): void;
    private saccade;
}
/**
 * A expressão do DuDoo, animada. Passe o mood que ele deve ter agora; o hook devolve o quadro
 * a desenhar (`<DuDooFace mood={…} />`, `<DuDoo mood={…} />`, `<ChatBubble mood={…} />`).
 */
declare function useDuDooMotion(mood: DuDooMood | DuDooExpression, { blink, idle, reduced, speed, intensity }?: DuDooMotionOptions): DuDooExpression;

interface DrawResult {
    animations: Animation[];
    /** Para a cena e devolve o SVG como estava (os traços divididos voltam a ser um). */
    stop: () => void;
    /** Quando o DuDoo termina de chegar, em ms desde o começo (já com a velocidade). */
    dudooAt: number;
    /**
     * Quando ele faz a cara da cena e a reação dele se desenha, em ms desde o começo (já com a
     * velocidade): o desenho assentado, ou logo depois de pousar, na espera.
     */
    reactAt: number;
    /** Para onde ele olha enquanto o desenho nasce (o `look` de uma expressão), se dá para medir. */
    look?: [number, number];
}
/**
 * Anima a cena e devolve as animações (para cancelar numa nova rodada). `delay` adia o começo;
 * `speed` multiplica o tempo, para ver de perto.
 */
declare function drawOn(root: SVGSVGElement, { delay, speed }?: {
    delay?: number | undefined;
    speed?: number | undefined;
}): DrawResult;
/**
 * Desenha o que está dentro quando aparece na tela, e de novo a cada `replay` diferente. Com
 * `still`, não anima: a cena já aparece pronta (movimento reduzido, ou uma cena do Sério).
 */
declare function DrawOn({ replay, still, speed, delay, children, }: {
    replay?: number;
    still?: boolean;
    speed?: number;
    delay?: number;
    children: ReactNode;
}): react.JSX.Element;

/**
 * O rabisco: o traço à mão das ilustrações da suíte (regras em `docs/marca.md`). Sem filtro: cada linha vira uma curva levemente arqueada, cada canto amolece e
 * o contorno fechado passa um pouco do ponto onde começou, como quem desenha de uma vez. Tudo é
 * vetor (nada de deslocamento por pixel), então fica liso em qualquer tamanho.
 *
 * O acaso tem semente: o mesmo desenho sai igual em toda renderização.
 */
type SketchPoint = [number, number];
type P = SketchPoint;
/**
 * Um lápis com semente: `const s = sketch(7)` e cada `s.line(…)`, `s.rect(…)` devolve o `d` de
 * um `<path>` para desenhar com traço (`fill="none"`, ponta redonda), ou com preenchimento no
 * caso do `blob`. A mesma semente na mesma ordem de chamadas dá o mesmo desenho.
 */
declare function sketch(seed: number): {
    line: (a: P, b: P, amount?: number) => string;
    /** Várias linhas soltas. */
    lines: (...segments: [P, P][]) => string;
    /** Três traços de ênfase saindo de um ponto, a partir do ângulo `from` (em graus). */
    ticks(cx: number, cy: number, from: number, r?: number, len?: number, spread?: number): string;
    /** Linha quebrada (seta, visto, aba de caixa): cada trecho arqueado, cantos vivos. */
    poly(points: P[]): string;
    /** Retângulo de canto mole, que passa do começo antes de terminar. */
    rect(x: number, y: number, w: number, h: number, rad?: number): string;
    /** Círculo que dá uma volta e um pouco, fechando por dentro. */
    circle(cx: number, cy: number, rad: number): string;
    /** Mancha de cor: um retângulo recortado à mão, de borda mole. */
    blob(x: number, y: number, w: number, h: number, rad?: number): string;
};
/** O brilho de quatro pontas, côncavo: o ✦ da IA solto na cena. Para preencher. */
declare function sparkle(cx: number, cy: number, r: number): string;
/** O laço cursivo ("eee") que liga uma coisa à outra: `n` voltas a partir de `x, y`. */
declare function curl(x: number, y: number, n: number, scale?: number): string;

/** O traço padrão; detalhe (linha de texto) vai a 2, ênfase (visto, "+") a 3. */
declare const SCENE_STROKE = 2.4;
type Sketch = ReturnType<typeof sketch>;
/**
 * A moldura de uma cena: um SVG de 260 × 190 (por padrão) que ocupa a largura do pai. O
 * `children` recebe o lápis (`sketch(seed)`); mesma semente, mesmo desenho.
 */
declare function Scene({ label, w, h, seed, children, }: {
    /** O que a cena mostra, para leitor de tela ("Uma caixa aberta e vazia"). */
    label: string;
    w?: number;
    h?: number;
    seed?: number;
    children: (s: Sketch) => ReactNode;
}): react.JSX.Element;
/** Um traço em tinta, de ponta redonda. */
declare function SceneLine({ d, width, color, }: {
    d: string;
    width?: number;
    color?: string;
}): react.JSX.Element;
/**
 * O cartão: o slide, a página, o objeto da suíte. Retângulo à mão, inclinado, com fundo de
 * painel para tapar o que estiver atrás (a mancha, outro cartão).
 */
declare function SceneCard({ s, x, y, w, h, rot, children, }: {
    s: Sketch;
    x: number;
    y: number;
    w: number;
    h: number;
    rot?: number;
    children?: ReactNode;
}): react.JSX.Element;
/**
 * O rosto do DuDoo nas cenas. Quem anima a cena troca o `DuDooFace` parado por um que se mexe
 * (chega primeiro, neutro, olhando o desenho nascer, e faz a cara da cena no fim); sem nada, é o
 * desenho parado.
 */
declare const SceneDuDooFace: react.Context<ComponentType<{
    mood: DuDooMood | DuDooExpression;
    size: number;
}> | null>;
/** O DuDoo dentro da cena: o canto de cima à esquerda e a altura. Em tinta, ou contorno no escuro. */
declare function SceneDuDoo({ x, y, size, mood, }: {
    x: number;
    y: number;
    size: number;
    mood?: DuDooMood | DuDooExpression;
}): react.JSX.Element;
/**
 * O objeto da cena: o que falta na tela vazia ("Nenhum arquivo ainda" é `"arquivo"`), o que o
 * DuDoo está montando (`SceneGenerating`) e o que ficou pronto (`SceneDone`).
 *
 * Da suíte toda: `slide`, `arquivo`, `pasta`, `lista`, `grafico`, `mensagem`. Do site (Pages):
 * `site`. Das redes (Marketing): `post`, `carrossel`; da marca (Marketing): `persona`, `voz`.
 * Do planejamento e da agenda (Marketing e CRM): `calendario`. Do funil de vendas (CRM): `funil`.
 */
type SceneObject = "slide" | "arquivo" | "pasta" | "lista" | "grafico" | "mensagem" | "site" | "post" | "carrossel" | "calendario" | "funil" | "persona" | "voz";
interface SceneProps {
    /** A cor da mancha. Padrão: o acento do app. Uma cor da paleta por cena. */
    color?: string;
    /** O que a cena mostra, para leitor de tela. Sem ele, o rótulo em português de cada cena. */
    label?: string;
}
/**
 * Nada aqui ainda: o objeto que falta, com a mancha de cor. Com `dudoo`, ele aparece olhando,
 * empolgado, para o objeto: só quando a ação da tela é dele ("Gerar com IA"). Sem, a cena é da
 * interface.
 */
declare function SceneEmpty({ object, dudoo, color, label, }: SceneProps & {
    object?: SceneObject;
    dudoo?: boolean;
}): react.JSX.Element;
/**
 * Gerando: o DuDoo pensa e o laço monta o trabalho. Para a espera de uma ação dele. `object`
 * diz o que se monta (padrão: os slides): `"site"` é "Criando o site", `"calendario"` é "Fazendo
 * o planejamento".
 */
declare function SceneGenerating({ object, color, label, }: SceneProps & {
    object?: SceneObject;
}): react.JSX.Element;
/**
 * Pronto: o DuDoo pisca, inclinado, com o trabalho feito ao lado. Para o marco. Sem `object`, o
 * trabalho é o cartão com o visto; com, é o objeto pronto com o selo ("Pronto: 5 seções" é
 * `"site"`).
 */
declare function SceneDone({ object, color, label, }: SceneProps & {
    object?: SceneObject;
}): react.JSX.Element;
/** Busca sem resultado: a lupa sobre a página vazia. Sem DuDoo: é a interface falando. */
declare function SceneNoResults({ color, label }: SceneProps): react.JSX.Element;
/** Tudo em dia: a caixa aberta e vazia. Sem DuDoo. */
declare function SceneAllClear({ color, label }: SceneProps): react.JSX.Element;
/** Sem acesso: o cadeado, sóbrio. Intensidade Sério: sem DuDoo, sem brilho, sem cor da paleta. */
declare function SceneLocked({ label }: Pick<SceneProps, "label">): react.JSX.Element;
/**
 * A tela sem conteúdo, centrada: a cena, o título, o texto e a ação. O texto segue a voz
 * (`docs/marca.md`): o que está acontecendo e o que fazer, sem "Ops!".
 */
declare function EmptyState({ art, title, action, className, children, ...rest }: {
    /** A cena (`<SceneEmpty object="arquivo" />`), ou nada. */
    art?: ReactNode;
    title: ReactNode;
    /** O botão (ou os botões) do que fazer agora. */
    action?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "title">): react.JSX.Element;

/**
 * Abaixo desta largura (px) da bancada (`.dd-bench`, a linha com o palco, a gaveta e a barra), a
 * gaveta flutua por cima do palco em vez de empurrá-lo. É o `60em` da container query de
 * `design.css`; `useDrawerFloats` mede contra o mesmo número.
 */
declare const DRAWER_FLOAT_BELOW = 960;
/** Uma gaveta da barra. */
interface RailItem<K extends string = string> {
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
type RailButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
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
declare function RailButton({ icon, label, active, className, ...rest }: RailButtonProps): react.JSX.Element;
interface SideRailProps<K extends string = string> {
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
declare function SideRail<K extends string>({ items, open, onToggle, footer, label, className, }: SideRailProps<K>): react.JSX.Element;
interface SidePanelProps {
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
declare function SidePanel({ title, width, onClose, children, closeLabel, className, floating, }: SidePanelProps): react.JSX.Element;
/**
 * Se a gaveta flutua na bancada `bench` (o elemento com `.dd-bench`): a largura dela abaixo de
 * `below` px. Mede com `ResizeObserver`, então acompanha a barra lateral do app abrindo e
 * fechando, e não só a janela. Com o padrão, diz o mesmo que o CSS; com outro número, passe o
 * resultado em `floating` no `SidePanel`, para o CSS e o app não divergirem. `false` enquanto
 * não há elemento.
 */
declare function useDrawerFloats(bench: HTMLElement | null, below?: number): boolean;
/**
 * Abre uma gaveta de quem não tem a barra (o menu de um bloco, a imagem de outra gaveta). Vai
 * por evento no `window`; `event` é o nome, e deve ser o mesmo em `usePanelRequests`. Com `K`, a
 * chave fica amarrada às gavetas do app: `requestPanel<PanelKey>("tema", EVENTO)`.
 */
declare function requestPanel<K extends string = string>(key: K, event?: string): void;
/**
 * Quem tem a barra escuta os pedidos de abrir gaveta. Abre (não alterna).
 *
 * O evento passa por `window`, e o que chega nele não tem tipo: com `keys`, só as chaves da lista
 * chegam a `open` (a de outro app, ou de uma versão velha, é ignorada), e `open` recebe `K`.
 */
declare function usePanelRequests<K extends string = string>(open: (key: K) => void, event?: string, keys?: readonly K[]): void;

/**
 * O esmaecido nas bordas de uma área que rola: em cima quando há o que voltar, embaixo quando há
 * o que descer. Marca `data-fade-top` e `data-fade-bottom` no elemento (a classe `dd-scroll-fade`
 * faz a máscara) e acompanha a rolagem, a mudança de tamanho e o conteúdo que entra ou sai.
 * Veio do `@eloquent-core/design`.
 */
declare function useScrollFade<T extends HTMLElement>(): react.RefObject<T | null>;
/**
 * O miolo da barra lateral que rola: vai entre o topo (logo, espaço de trabalho) e o
 * `.dd-side-foot`, que ficam presos. A barra de rolagem é fina e só aparece aqui, e as bordas
 * esmaecem quando há o que rolar. Abaixo de 48em, onde a barra vira o topo da página, não rola.
 */
declare function SideScroll({ className, ...rest }: ComponentPropsWithoutRef<"div">): react.JSX.Element;

/**
 * Se a barra em volta está recolhida. Para o que o app põe no topo e no pé (`top`, `foot`): um
 * componente que lê isto e desenha a versão curta (só o avatar, só o ícone).
 */
declare function useSideCollapsed(): boolean;
interface SideBarLabels {
    /** O nome da navegação para leitor de tela. */
    nav: string;
    collapse: string;
    expand: string;
}
interface SideBarProps {
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
declare function SideBar({ brand, brandCollapsed, top, foot, children, collapsible, collapsed: controlled, onCollapsedChange, labels, className, }: SideBarProps): react.JSX.Element;
/** A dica da barra recolhida: o rótulo à direita do ícone. Fora dela, não faz nada. */
declare function SideTip({ label, children }: {
    label: ReactNode;
    children: ReactNode;
}): react.JSX.Element;
/** Um grupo da navegação com o rótulo em versalete (na barra recolhida, um fio). */
declare function NavSection({ label, children }: {
    label?: ReactNode;
    children: ReactNode;
}): react.JSX.Element;
interface NavGroupProps {
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
declare function NavGroup({ icon, label, defaultOpen, active, open: controlledOpen, onOpenChange, itemsId, children, }: NavGroupProps): react.JSX.Element;

/**
 * Quanto a espera esconde antes de aparecer (ms). Com cache, a maioria das esperas acaba antes
 * disso e nada pisca.
 */
declare const WAIT_DELAY = 200;
/**
 * A espera atrasada, para o contêiner de um esqueleto: `<div {...useWait()}>` (junte ao seu
 * `className` se o elemento já tiver um). Fica invisível por `WAIT_DELAY` e então esmaece para
 * dentro. As esperas de uma mesma troca de tela são uma só: a que entra no lugar de outra (a
 * página, depois a lista) herda o atraso que falta, e se a anterior já estava à vista aparece na
 * hora, sem esmaecer. Assim o esqueleto não some e volta entre um nível e outro.
 */
declare function useWait(): {
    className: string;
    style: CSSProperties;
};
/**
 * Um traço do esqueleto: a forma do que vai chegar (linha de texto, avatar, miniatura), com o
 * brilho que corre. Decorativo; quem anuncia a espera é o contêiner (`role="status"`).
 */
declare function Skeleton({ width, height, radius, className, style, }: {
    width?: number | string;
    height?: number | string;
    /** O canto. Padrão: 6 px; `"50%"` para o avatar. */
    radius?: number | string;
    className?: string;
    style?: CSSProperties;
}): react.JSX.Element;
/**
 * O fio de espera do topo: responde ao clique quando a resposta demora. Aparece depois de
 * `WAIT_DELAY` (o mesmo ritmo do `useWait`), fica pelo menos 400 ms, cresce devagar sem prometer
 * um fim e, quando `active` cai, completa e esmaece. Ligue ao carregamento do roteador e às
 * buscas sem dado ainda; o que atualiza em segundo plano fica de fora. É `fixed` e decorativo:
 * não ocupa layout, não recebe clique e fica fora da árvore de acessibilidade.
 */
declare function TopProgress({ active }: {
    active: boolean;
}): react.JSX.Element | null;

/** A linha dos filtros: os chips à esquerda, `end` (a contagem, a ordem) à direita. */
declare function FilterBar({ children, end }: {
    children: ReactNode;
    end?: ReactNode;
}): react.JSX.Element;
type FilterChipProps = {
    label: ReactNode;
    /** O valor aplicado. Sem ele, o chip é o botão tracejado que abre o filtro. */
    value?: ReactNode;
    /** O ×, que tira o filtro (só com `value`). */
    onRemove?: () => void;
    /** O nome do × para leitor de tela. Padrão: `"Tirar o filtro"`. */
    removeLabel?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "value" | "color">;
/**
 * O filtro aplicado ou a aplicar: rótulo, valor e o ×. Sem valor, é o botão que abre o filtro.
 * A ref e o resto das props (`onClick`, `aria-*`) vão para o botão principal, então serve de
 * `Menu.Target` e `Popover.Target` do Mantine; o × não dispara o `onClick` do chip. `disabled`
 * mostra o filtro travado (o valor fica, o × some, o clique não abre).
 */
declare const FilterChip: react.ForwardRefExoticComponent<{
    label: ReactNode;
    /** O valor aplicado. Sem ele, o chip é o botão tracejado que abre o filtro. */
    value?: ReactNode;
    /** O ×, que tira o filtro (só com `value`). */
    onRemove?: () => void;
    /** O nome do × para leitor de tela. Padrão: `"Tirar o filtro"`. */
    removeLabel?: string;
} & Omit<Omit<react.DetailedHTMLProps<react.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, "color" | "value"> & react.RefAttributes<HTMLButtonElement>>;
/** Uma escolha da lista. `group` põe a opção debaixo de um título (os grupos na ordem em que aparecem). */
type FilterOption = {
    value: string;
    label: string;
    group?: string;
};
/** O período, em datas ISO (`AAAA-MM-DD`); `null` é o lado aberto. */
type FilterPeriod = {
    from: string | null;
    to: string | null;
};
type PeriodShortcut = {
    label: string;
    value: FilterPeriod;
};
/** Os textos do `FilterMenu`, em pt-BR por padrão. */
interface FilterMenuLabels {
    search: string;
    empty: string;
    clear: string;
    remove: string;
    from: string;
    to: string;
    textInput: string;
    /** O valor do chip com mais de uma escolha. */
    chosen: (count: number) => string;
    /** O valor do chip no período. Padrão: `periodLabel`, em pt-BR. */
    period: (value: FilterPeriod) => string | undefined;
}
/** O que vale para os quatro tipos: `onClose` avisa que o menu fechou; `disabled` trava o chip. */
type FilterMenuCommon = {
    label: ReactNode;
    onClose?: () => void;
    disabled?: boolean;
    labels?: Partial<FilterMenuLabels>;
};
type FilterMenuProps = FilterMenuCommon & ({
    kind: "single";
    options: FilterOption[];
    value: string | null;
    onChange: (value: string | null) => void;
    searchable?: boolean;
} | {
    kind: "multi";
    options: FilterOption[];
    value: string[];
    onChange: (value: string[]) => void;
    searchable?: boolean;
} | {
    kind: "period";
    value: FilterPeriod;
    onChange: (value: FilterPeriod) => void;
    /** Troca os atalhos do padrão (`periodShortcuts()`); `[]` tira os atalhos. */
    shortcuts?: PeriodShortcut[];
} | {
    kind: "text";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
});
/**
 * O texto do período no chip, ou `undefined` sem filtro. O mês inteiro vira "out. 2026", o ano
 * inteiro "2026"; o resto é "01/10 – 15/10/2026" (o ano de cada ponta quando mudam) e, com um
 * lado só, "desde …" ou "até …". O que não for data ISO conta como vazio. Em pt-BR; outro
 * idioma passa o próprio texto em `labels.period` do `FilterMenu`.
 */
declare function periodLabel(value: FilterPeriod): string | undefined;
/** O mês inteiro (`month` de 1 a 12). */
declare const monthPeriod: (year: number, month: number) => FilterPeriod;
/** O ano inteiro. */
declare const yearPeriod: (year: number) => FilterPeriod;
/**
 * Os atalhos do padrão, pela data local de hoje: este mês, o mês passado e este ano. Para
 * acrescentar um: `shortcuts={[...periodShortcuts(), { label: "Ano anterior", value: yearPeriod(ano - 1) }]}`.
 * `names` traduz os três rótulos.
 */
declare function periodShortcuts(today?: Date, names?: {
    thisMonth: string;
    lastMonth: string;
    thisYear: string;
}): PeriodShortcut[];
/**
 * O filtro com escolhas, o chip e o menu num só, controlado (`value`/`onChange`): `single` (uma,
 * fecha ao escolher), `multi` (várias, fica aberto; "Limpar" embaixo), `period` (de–até com os
 * atalhos, os do padrão ou `shortcuts`) e `text` (Enter aplica e fecha). As listas ganham a
 * busca quando passam de 8 opções, a menos que `searchable` diga o contrário, e os títulos de
 * grupo pelo `group` das opções. O valor do chip é escrito pela peça; o × limpa. `onClose` avisa
 * que o menu fechou (descarte ali o período digitado pela metade); `disabled` mostra o chip
 * travado, sem abrir e sem o ×. Os textos estão em `labels`.
 */
declare function FilterMenu(props: FilterMenuProps): react.JSX.Element;

/**
 * As falas do chat, sobre o `ChatBubble`: quem fala é o DuDoo, com a expressão do que diz
 * (`docs/marca.md`, "O DuDoo desenhado" e "Movimento"). Só o rosto da última fala dele está vivo;
 * os de cima param na expressão do que disseram. Subiu do Slides e do Marketing, que tinham as
 * mesmas peças cada um. O visual está em `design.css` (`dd-chat-*`).
 */
type Mood = DuDooMood | DuDooExpression;
/** Lendo a sua fala: o olhar vai para cima e para a direita, onde ela está. */
declare const READING: DuDooExpression;
/** A cara de uma resposta pronta: pergunta é curiosidade; o resto, neutro (o padrão). */
declare function replyMood(text: string, asks?: boolean): DuDooMood;
/**
 * A fala do DuDoo. `live` diz se é o rosto vivo (pisca e olha em volta); `from`, de que cara ele
 * vem quando a fala nasce no lugar de outra (a resposta que acabou de chegar sai do `pensando`).
 */
declare function DuDooSays({ mood, from, live, children, }: {
    mood?: Mood;
    from?: Mood;
    live: boolean;
    children: ReactNode;
}): react.JSX.Element;
/** A sua fala, à direita. */
declare function YouSay({ children }: {
    children: ReactNode;
}): react.JSX.Element;
/**
 * Os três pontos de quem escreve, na cor da tinta apagada. `label` é o texto para leitor de
 * tela; `""` quando ao lado já há texto visível dizendo a mesma coisa.
 */
declare function Typing({ label }: {
    label?: string;
}): react.JSX.Element;
/**
 * Enquanto a resposta não chega: primeiro ele olha para a sua fala, depois pensa. É o que separa
 * quem ouviu de quem só respondeu.
 */
declare function useReadThenThink(): Mood;
/**
 * Aviso do sistema no meio da conversa (a falha da geração, o pedido que não andou): não é fala
 * do DuDoo, então não tem rosto nem balão. Com `onClose`, leva um botão pequeno que o dispensa.
 * Centraliza-se sozinho se o pai for uma coluna flex (a conversa).
 */
declare function SystemNotice({ onClose, closeLabel, children, }: {
    onClose?: () => void;
    /** O nome do botão de dispensar para leitor de tela. Padrão: `"Fechar"`. */
    closeLabel?: string;
    children: ReactNode;
}): react.JSX.Element;
/** Envolve a conversa; as `Enter` de dentro só animam depois que ela montou. */
declare function ChatEnterScope({ children }: {
    children: ReactNode;
}): react.JSX.Element;
/**
 * Uma linha da conversa que entra subindo se chegou com ela já aberta. `still` desliga a entrada:
 * é a fala gravada que entra no lugar da que estava no ar, e que já subiu uma vez.
 */
declare function Enter({ still, children }: {
    still?: boolean;
    children: ReactNode;
}): react.JSX.Element;

/**
 * As telas de status (a moldura) e a de acesso negado, que o Slides e o Marketing tinham cada um
 * por conta. Presentacional: quem busca a identidade e a lista de serviços, e quem faz o Tentar de
 * novo e o Sair, é o app. O visual está em `design.css` (`dd-screen*`).
 */
/**
 * Um item de `GET /api/me/services` do control plane: um serviço que a pessoa tem. `external`
 * sai do app (abre em outro lugar), e a lista avisa com uma seta.
 *
 * O contrato manda `kind` como texto livre, e as peças só testam `=== "external"`: um tipo novo
 * que o control plane passe a mandar aparece como app, sem o app ter de converter a lista.
 */
interface SuiteService {
    slug: string;
    kind: "app" | "external" | (string & {});
    name: string;
    href: string;
    /** Vem do contrato; as peças daqui não o usam. */
    status?: string;
}
/**
 * A moldura das telas que ficam fora do app (acesso negado, erro de rota): o fundo cinza, a marca
 * em cima e o conteúdo num painel no centro. Com `component="div"` não vira o `main` da página
 * (para pôr dentro de outro).
 *
 * Com `inShell`, ela vai dentro do `AppShell`, abaixo do `SuiteHeader`: ocupa a altura que sobra
 * (sem a página rolar o cabeçalho), fica sem a marca (o cabeçalho já a mostra) e vira `div` (o
 * `AppShell.Main` já é o `main`). `brand` e `component` ainda mandam, se vierem.
 */
declare function StatusScreen({ brand, component, inShell, className, children, }: {
    /**
     * A marca de cima. Padrão: o `Logo` da marca do app (nenhuma com `inShell`). `null` ou `false`
     * tiram a marca.
     */
    brand?: ReactNode;
    /** Padrão: `"main"` (`"div"` com `inShell`). */
    component?: "main" | "div";
    /** Dentro do `AppShell`, abaixo do cabeçalho da suíte. */
    inShell?: boolean;
    className?: string;
    children: ReactNode;
}): react.JSX.Element;
interface AppListLabels {
    /** Padrão: `"Seus apps"`. */
    title: string;
    /** Padrão: `"Carregando…"`. */
    loading: string;
    /** Padrão: `"Não deu para carregar a lista de apps."`. */
    error: string;
    /** Quando a lista veio sem nenhum outro. Padrão: `"Nenhum outro app contratado."`. */
    empty: string;
}
/**
 * As aplicações que a pessoa tem: a saída útil de quem não tem a deste app. Presentacional: o app
 * busca a lista e diz se está carregando ou falhou. O próprio app (`currentSlug`) sai da lista.
 */
declare function AppList({ services, loading, error, currentSlug, labels, }: {
    services: readonly SuiteService[];
    loading?: boolean;
    error?: boolean;
    /** O `slug` do app que está mostrando a lista: não faz sentido oferecê-lo como saída. */
    currentSlug?: string;
    labels?: Partial<AppListLabels>;
}): react.JSX.Element;
/** Os códigos de negação de acesso do contrato do control plane (mais `UNKNOWN`, o sem código). */
type AccessDenialCode = "NOT_ENTITLED" | "NO_TENANT" | "TENANT_SUSPENDED" | "AMBIGUOUS_TENANT" | "MALFORMED" | "UNAVAILABLE" | "UNKNOWN";
/** O texto de um código de negação. */
interface AccessDenialText {
    title: string;
    /** O da tela inteira (`AccessDenied`), que pode contar com a lista de apps embaixo. */
    body: string;
    /**
     * O que se sustenta sozinho: para o alerta curto, a negação que chega no meio de uma tela e não
     * tem a `AppList`. Só difere de `body` onde `body` aponta para a lista (`NOT_ENTITLED`).
     */
    short: string;
}
/**
 * O texto de cada código, o do Slides. Cada um tem o seu porque a **saída** é diferente: "não
 * contratou" se resolve com a agência, "sessão não serve" trocando de conta, e uma falha do
 * serviço só esperando.
 *
 * O `body` de `NOT_ENTITLED` manda olhar "abaixo" os apps que a pessoa já tem; sem a lista (um
 * alerta), use `short`. O `AccessDenied` já troca sozinho quando não recebe `services`.
 */
declare const ACCESS_DENIAL_TEXT: Record<AccessDenialCode, AccessDenialText>;
interface AccessDeniedLabels {
    /** A linha de quem está vendo a tela. Padrão: `"Você entrou como {email}, em {tenant}."`. */
    signedInAs: (who: {
        email: string;
        tenant: string;
    }) => string;
    /** Antes do `detail`. Padrão: `"Código"`. */
    code: string;
}
/**
 * A negação de acesso: o que houve, quem está vendo a tela e a saída. Vai dentro de uma
 * `StatusScreen` (ou de onde o app quiser). Os botões (Tentar de novo, Sair) e a lista de apps
 * são do app, que os passa em `actions` e `services`; assim ele decide quais códigos mostram
 * qual saída.
 */
declare function AccessDenied({ code, signedInAs, services, actions, title, body, detail, labels, }: {
    code: AccessDenialCode;
    /** Quem está vendo a tela: conta errada é metade dos casos. */
    signedInAs?: {
        email: string;
        tenant: string;
    };
    /**
     * Normalmente um `<AppList />`, para o `NOT_ENTITLED`. Sem ele, o texto padrão é o `short`, que
     * não aponta para lista nenhuma.
     */
    services?: ReactNode;
    /** Os botões, do app. */
    actions?: ReactNode;
    /** Sobrescreve o título de `ACCESS_DENIAL_TEXT[code]`. */
    title?: string;
    /** Sobrescreve o texto de `ACCESS_DENIAL_TEXT[code]`. */
    body?: string;
    /** O código técnico (`NOT_ENTITLED`, `HTTP 502`), em fonte de máquina e pequeno. */
    detail?: string;
    labels?: Partial<AccessDeniedLabels>;
}): react.JSX.Element;

/** Uma resposta autenticada passou: daqui em diante, 401 é sessão que caiu, não que faltou. */
declare function noteSessionOk(): void;
/** A sessão já existiu nesta página? Se não, o 401 é o de quem ainda não entrou (redirect). */
declare function sessionEstablished(): boolean;
/** Um 401. Só vira "sessão perdida" (e abre o modal) se a sessão já existiu nesta página. */
declare function noteUnauthorized(): void;
/**
 * Toda resposta da API do app passa por aqui: a que deu certo prova que a sessão existe, e o 401
 * depois disso é a sessão que caiu.
 */
declare function watchSession(res: {
    status: number;
    ok: boolean;
}): void;
/** A sessão voltou (login na janela à parte, ou em outra aba). */
declare function clearSessionLost(): void;
/** `true` enquanto a sessão está perdida: o modal está aberto. */
declare function useSessionLost(): boolean;
/** Volta ao estado de página recém-carregada. Para os testes. */
declare function resetSessionState(): void;
/** A rota de retorno padrão: onde a janela de login termina, avisa a aba de origem e se fecha. */
declare const SESSION_RESUMED_PATH = "/sessao-retomada";
declare function announceSessionResumed(): void;
declare function onSessionResumed(callback: () => void): () => void;
/**
 * Abre `href` (o começo do login do app) numa janela pequena, centrada sobre esta. Devolve
 * `false` se o navegador bloqueou a janela.
 */
declare function openLoginWindow(href: string): boolean;
interface SessionExpiredLabels {
    /** Padrão: `"Sua sessão acabou"`. */
    title: string;
    body: string;
    /** Depois de abrir a janela de login. */
    waiting: string;
    /** Padrão: `"Entrar de novo"`. */
    signIn: string;
    /** O mesmo botão, com a janela já aberta. */
    reopen: string;
    /** O link de entrar na própria aba, que recarrega a página. */
    signInHere: string;
}
/**
 * O modal da sessão perdida, por cima de tudo (sem sessão nada na tela funciona). Não fecha por
 * fora — sem X, Esc ou clique no fundo —: a única saída é entrar. Monte uma vez, no layout.
 *
 * - `loginHref(next)`: o começo do login do app, voltando para `next` (só caminho desta origem).
 *   O botão abre `loginHref(resumedPath)` numa janela; se ela for bloqueada, entra na própria aba
 *   com `loginHref(<onde está>)`.
 * - `checkSession`: confere a sessão sem cache (o principal, `no-cache`). Resolve se ela voltou.
 *   Roda ao voltar para a aba, para quem entrou por outra aba ou quando o aviso não chegar.
 * - `onResumed`: a sessão voltou; refaça as leituras (`queryClient.invalidateQueries()`). As
 *   ações que falharam com 401 não se repetem sozinhas.
 */
declare function SessionExpiredModal({ loginHref, checkSession, onResumed, resumedPath, labels, }: {
    loginHref: (next: string) => string;
    checkSession: () => Promise<unknown>;
    onResumed: () => void;
    resumedPath?: string;
    labels?: Partial<SessionExpiredLabels>;
}): react.JSX.Element;
interface SessionResumedLabels {
    title: string;
    body: string;
    /** O botão de voltar ao app, para quando a janela não fecha sozinha. */
    home: string;
}
/**
 * A rota de retorno (`SESSION_RESUMED_PATH`), fora do layout do app: avisa a aba de origem e
 * fecha a janela. Se o navegador não deixar fechar, fica a mensagem e o caminho de volta. Vai
 * dentro de uma `StatusScreen`.
 */
declare function SessionResumed({ homeHref, labels, }: {
    homeHref?: string;
    labels?: Partial<SessionResumedLabels>;
}): react.JSX.Element;

/**
 * O cabeçalho da suíte (o menu de apps, o menu da pessoa, a aparência) e os auxiliares das
 * preferências que o control plane guarda (tema e idioma). Subiu do Slides e do Marketing.
 *
 * Tudo aqui é presentacional ou local do navegador: nada chama rede. Quem lê `GET /api/me`, quem
 * grava a escolha da pessoa e quem busca `GET /api/me/services` é o app. O visual está em
 * `design.css` (`dd-suite-*`).
 */
/** Altura do cabeçalho: as telas descontam ela para ocupar o resto da janela. */
declare const SUITE_HEADER_HEIGHT = 60;
interface AppSwitcherLabels {
    /** O nome do botão e a dica dele. Padrão: `"Trocar de app"`. */
    trigger: string;
    /** Padrão: `"Seus apps"`. */
    title: string;
    /** Padrão: `"Carregando…"`. */
    loading: string;
    /** Padrão: `"Não deu para carregar a lista de apps."`. */
    error: string;
    /** Padrão: `"Nenhum app contratado."`. */
    empty: string;
    /** Embaixo do app em que a pessoa está. Padrão: `"Você está aqui"`. */
    here: string;
}
/**
 * O menu "trocar de app": os serviços da pessoa (`GET /api/me/services`), num botão de ícone.
 * É **apresentação**: o que ele mostra nunca decide acesso. O app busca a lista (sem cache: o
 * control plane manda `no-store`) e diz se está carregando ou falhou, para a queda do control
 * plane não virar uma lista vazia silenciosa.
 */
declare function AppSwitcher({ services, loading, error, currentSlug, labels, }: {
    services: readonly SuiteService[];
    loading?: boolean;
    error?: boolean;
    /** O `slug` do app em que a pessoa está: aparece marcado e desabilitado. */
    currentSlug?: string;
    labels?: Partial<AppSwitcherLabels>;
}): react.JSX.Element;
/**
 * Claro ou escuro. Não há "sistema": pelo contrato do control plane, quem nunca escolheu
 * (`preferredColorScheme: null`) vê o claro, e o `prefers-color-scheme` não entra.
 */
type AppearanceValue = "light" | "dark";
interface AppearanceLabels {
    /** Padrão: `"Claro"`. */
    light: string;
    /** Padrão: `"Escuro"`. */
    dark: string;
    /** O nome do seletor para leitor de tela. Padrão: `"Aparência"`. */
    label: string;
}
/**
 * O seletor claro / escuro. Controlado e sem efeito próprio: não toca o Mantine nem grava nada.
 * O app aplica a escolha na hora (`setColorScheme`) e a grava onde a pessoa a guarda (ver
 * `useColorSchemePreference`).
 *
 * `value` aceita o `colorScheme` do Mantine como vem: um `"auto"` que tenha ficado no cache
 * aparece como claro, que é o que a pessoa vê.
 *
 * `iconsOnly` é para cabeçalho apertado; os nomes ficam como dica e rótulo de leitor de tela.
 */
declare function AppearanceControl({ value, onChange, labels, fullWidth, iconsOnly, }: {
    value: AppearanceValue | "auto";
    onChange: (value: AppearanceValue) => void;
    labels?: Partial<AppearanceLabels>;
    fullWidth?: boolean;
    iconsOnly?: boolean;
}): react.JSX.Element;
/** As iniciais para o avatar: "Anderson Fonseca" → "AF". */
declare function initials(name: string): string;
interface UserMenuLabels {
    /** Padrão: `"Minha conta"`. */
    account: string;
    /** Padrão: `"Sair"`. */
    signOut: string;
    /** O nome do botão da pílula para leitor de tela. Padrão: `"Sua conta"`. */
    menu: string;
}
/**
 * Quem está logado, numa pílula com avatar e nome: abre "Minha conta", os itens do app e "Sair".
 *
 * Com `appearance`, o menu mostra o `AppearanceControl` e não fecha ao clicar nele, para a
 * pessoa ver a troca acontecer. Quem aplica e grava a escolha é o app (`appearance.onChange`).
 */
declare function UserMenu({ name, email, accountUrl, appearance, onSignOut, children, footer, target, position, labels, }: {
    /** `null` enquanto não se sabe: a pílula fica só com o avatar vazio. */
    name: string | null;
    /** Aparece no alto do menu, em letra pequena. */
    email?: string | null;
    /** O endereço de "Minha conta" (a tela de identidade do contrato). Sem ele, o item some. */
    accountUrl?: string | null;
    appearance?: {
        /** O `colorScheme` do Mantine serve direto (`"auto"` aparece como claro). */
        value: AppearanceValue | "auto";
        onChange: (value: AppearanceValue) => void;
        labels?: Partial<AppearanceLabels>;
    };
    onSignOut: () => void;
    /** Itens extras do app (`Menu.Item`), entre "Minha conta" e "Sair". */
    children?: ReactNode;
    /** Uma linha pequena no fim do menu (a versão do app, por exemplo). */
    footer?: ReactNode;
    /**
     * O gatilho do app no lugar da pílula (o cartão do pé da barra lateral). Tem de ser um único
     * elemento que aceite `ref` e os eventos de clique (um `button`).
     */
    target?: ReactNode;
    /** Onde o menu abre. Padrão: `"bottom-end"`; um gatilho no pé da barra pede `"top-start"`. */
    position?: MenuProps["position"];
    labels?: Partial<UserMenuLabels>;
}): react.JSX.Element;
/**
 * O miolo do cabeçalho dos apps de editor (Slides, Pages): o menu de apps, a marca, as abas e o
 * canto da pessoa, numa linha de `SUITE_HEADER_HEIGHT` sobre o fundo da suíte, sem borda. Cabe
 * dentro do `AppShell.Header` do Mantine (que ganha o mesmo fundo e perde a borda), com
 * `header={{ height: SUITE_HEADER_HEIGHT }}` no `AppShell`.
 */
declare function SuiteHeader({ start, brand, tabs, end, tabsLabel, }: {
    /** Normalmente o `AppSwitcher`. */
    start?: ReactNode;
    /**
     * O link da marca para a home: o app passa o `Link` do roteador dele com o `Logo` dentro
     * (e um `aria-label`, já que o link é só a imagem).
     */
    brand: ReactNode;
    /** Os links das abas, como `<NavLink className="dd-tab">`. O cabeçalho desenha o `nav.dd-tabs`. */
    tabs?: ReactNode;
    /** Normalmente o `UserMenu`. */
    end?: ReactNode;
    /** O nome do `nav` das abas para leitor de tela. Padrão: `"Seções"`. */
    tabsLabel?: string;
}): react.JSX.Element;
/**
 * Aplica no Mantine o tema que o control plane guarda (`user.preferredColorScheme`), com o
 * significado do contrato ("O `preferredColorScheme` e o clarão"):
 *
 * - `undefined`: o control plane ainda não respondeu, ou falhou. Não mexe em nada, e fica o
 *   tema que está aplicado (o cache do `localStorage`). Falha é "não consegui perguntar", não
 *   "a pessoa não escolheu".
 * - `null`: a pessoa nunca escolheu, e vale o **claro**. O tema do sistema não entra.
 * - `"light"` / `"dark"`: aplica.
 *
 * Aplica quando o valor **muda** em relação ao último recebido, não a cada render. Assim a troca
 * que o app faz na hora, enquanto a gravação está no ar, não é desfeita por um valor velho.
 *
 * Quem usa põe `MantineProvider defaultColorScheme="light"`: o cache pinta a primeira tela, e sem
 * cache ela abre clara. Um `"auto"` que tenha ficado no cache (de antes desta regra, ou de um
 * `defaultColorScheme="auto"`) vira claro na hora, sem esperar o control plane.
 */
declare function useColorSchemePreference(preferred: "light" | "dark" | null | undefined): void;
/**
 * Qual dos idiomas do app casa com os tags dados (`"pt-BR"`, `"en-US"`…), na ordem dos tags.
 * Para cada tag tenta o inteiro e depois só o idioma, sem diferença de caixa: `pt-BR` casa com
 * `pt-BR`, `pt-PT` cai em `pt-BR` se for o único português, `en-US` cai em `en`. Cortar o tag
 * no hífen e comparar com a lista não serve: `pt` não casa com `pt-BR`. Devolve o idioma como
 * está em `supported`, ou `undefined` se nenhum casa.
 */
declare function matchLocale(tags: readonly string[], supported: readonly string[]): string | undefined;
/**
 * O idioma da interface, dado o que o control plane guarda (`user.preferredLocale`).
 *
 * - `undefined`: o control plane ainda não respondeu. Devolve `undefined`: espere. Um relance do
 *   idioma errado é barato; aplicar o do navegador e corrigir depois desfaz a escolha a cada
 *   carregamento.
 * - `null`: a pessoa nunca escolheu. Vale o navegador (`matchLocale` dos `browserTags`).
 * - string: ela, se o app a suporta; senão, o que casa com ela e depois com o navegador.
 *
 * `undefined` na saída também quer dizer "nada casa": o app fica no idioma padrão dele.
 */
declare function pickLocale(preferred: string | null | undefined, supported: readonly string[], browserTags?: readonly string[]): string | undefined;
/**
 * Chama `refresh` quando a pessoa volta para a aba (`visibilitychange`, só se visível) ou para a
 * janela (`focus`), no máximo uma vez a cada `throttleMs`. É como um app pega o que outro app da
 * suíte gravou. O que `refresh` faz (reler o principal) e o que acontece se falhar é do app.
 */
declare function useRefreshOnReturn(refresh: () => void, throttleMs?: number): void;

export { ACCESS_DENIAL_TEXT, type Accent, type AccessDenialCode, type AccessDenialText, AccessDenied, type AccessDeniedLabels, AppIcon, AppList, type AppListLabels, AppSwitcher, type AppSwitcherLabels, AppearanceControl, type AppearanceLabels, type AppearanceValue, BRAND, Block, type Brand, type BrandColor, type BrandForm, type BrandShape, ChatBubble, ChatEnterScope, type Corners, Count, DECKDOO_BRAND, DECKDOO_WORD, DRAWER_FLOAT_BELOW, DUDOO_INTENSITY, DUDOO_MOODS, DUDOO_REDUCED_TIMING, DUDOO_TIMING, DesignProvider, Dots, DrawOn, type DrawResult, DuDoo, type DuDooExpression, type DuDooEye, DuDooFace, type DuDooFaceProps, type DuDooIntensity, type DuDooMood, DuDooMotion, type DuDooMotionOptions, DuDooSays, DuDooWall, EmptyState, Enter, FilterBar, FilterChip, type FilterChipProps, FilterMenu, type FilterMenuLabels, type FilterMenuProps, type FilterOption, type FilterPeriod, INVERSE, LOCKUP_COMMERCE, LOCKUP_MARKETING, LOCKUP_PAGES, LOCKUP_SITES, LOCKUP_SLIDES, LOCKUP_SPEC, LOCKUP_VERSIONS, LOCKUP_WORKS, type LockupApp, type LockupBlock, type LockupMetrics, type LockupOutline, type LockupSpec, type LockupVersion, Logo, MARK_PUPIL, NavGroup, type NavGroupProps, NavItem, type NavItemProps, NavSection, Panel, type PeriodShortcut, type PillTab, PillTabs, READING, RailButton, type RailButtonProps, type RailItem, SCENE_STROKE, SESSION_RESUMED_PATH, SUITE_HEADER_HEIGHT, Scene, SceneAllClear, SceneCard, SceneDone, SceneDuDoo, SceneDuDooFace, SceneEmpty, SceneGenerating, SceneLine, SceneLocked, SceneNoResults, type SceneObject, type SessionExpiredLabels, SessionExpiredModal, SessionResumed, type SessionResumedLabels, SideBar, type SideBarLabels, type SideBarProps, SidePanel, type SidePanelProps, SideRail, type SideRailProps, SideScroll, SideTip, Skeleton, type Sketch, type SketchPoint, Stat, Status, StatusScreen, type Step, Steps, SuiteHeader, type SuiteService, SystemNotice, type ThemeOptions, type Tone, TopProgress, Typing, UserMenu, type UserMenuLabels, WAIT_DELAY, YouSay, accentHex, announceSessionResumed, buildTheme, clearSessionLost, curl, drawOn, dudooExpression, initials, lockupHasMark, lockupLayout, lockupWeight, lockupWeights, matchLocale, monthPeriod, noteSessionOk, noteUnauthorized, onSessionResumed, openLoginWindow, periodLabel, periodShortcuts, pickLocale, pickOutline, replyMood, requestPanel, resetSessionState, sessionEstablished, sketch, sparkle, useBrand, useColorSchemePreference, useDrawerFloats, useDuDooMotion, useLockupApp, usePanelRequests, usePrefersReducedMotion, useReadThenThink, useRefreshOnReturn, useScrollFade, useSessionLost, useSideCollapsed, useWait, watchSession, wordTransform, yearPeriod };

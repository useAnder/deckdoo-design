import * as _mantine_core from '@mantine/core';
import { MantineColorsTuple, VariantColorsResolver } from '@mantine/core';
import * as react from 'react';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

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
type Corners = "pilula" | "suave";
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
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
    } | undefined;
    defaultRadius?: _mantine_core.MantineRadius | undefined;
    spacing?: {
        [x: number]: string | undefined;
        [x: string & {}]: string | undefined;
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
    } | undefined;
    fontSizes?: {
        [x: string & {}]: string | undefined;
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
    } | undefined;
    lineHeights?: {
        [x: string & {}]: string | undefined;
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
    } | undefined;
    fontWeights?: {
        [x: string & {}]: string | undefined;
        bold?: string | undefined;
        regular?: string | undefined;
        medium?: string | undefined;
    } | undefined;
    breakpoints?: {
        [x: string & {}]: string | undefined;
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
    } | undefined;
    shadows?: {
        [x: string & {}]: string | undefined;
        xl?: string | undefined;
        md?: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        lg?: string | undefined;
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
/** A marca do app para o `Logo` e o `AppIcon`. Sem provider, vale a do DeckDoo. */
declare function DesignProvider({ brand, children }: {
    brand?: Brand;
    children: ReactNode;
}): react.JSX.Element;
declare function useBrand(): Brand;

/** Painel branco sobre o fundo, com título e ações opcionais. */
declare function Panel({ title, actions, className, children, ...rest }: {
    title?: ReactNode;
    actions?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "title">): react.JSX.Element;
declare function Block({ className, ...rest }: ComponentPropsWithoutRef<"div">): react.JSX.Element;
declare function Count({ children }: {
    children: ReactNode;
}): react.JSX.Element;
declare function NavItem({ icon, label, count, active, ...rest }: {
    icon: ReactNode;
    label: string;
    count?: number;
    active?: boolean;
} & ComponentPropsWithoutRef<"button">): react.JSX.Element;
interface PillTab {
    value: string;
    label: string;
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
 * onde está: o inverso no tema escuro e dentro de `.dd-inverse`; o normal no claro e sobre o
 * acento (`.dd-accent`). A escolha é do CSS (`design.css`), então acompanha a troca de tema sem
 * re-renderizar. Sobre fundo que o CSS não conhece (uma cor da paleta, uma foto), diga com `on`.
 */
declare function Logo({ variant, height, on, color, label, }: {
    /** `type` = o logotipo; `mark` = o mascote ou símbolo sozinho. */
    variant?: "type" | "mark";
    height?: number;
    /** Força o desenho: `light` = fundo claro, `dark` = fundo escuro. */
    on?: "light" | "dark";
    color?: string;
    /** Rótulo acessível. Padrão: o nome da marca. */
    label?: string;
}): react.JSX.Element;
/**
 * O ícone de app: o mascote sobre um quadrado no acento do app. A tinta segue o contraste do
 * acento (escura no limão, clara num roxo), e o desenho acompanha.
 */
declare function AppIcon({ size }: {
    size?: number;
}): react.JSX.Element;

export { type Accent, AppIcon, BRAND, Block, type Brand, type BrandColor, type BrandForm, type BrandShape, type Corners, Count, DECKDOO_BRAND, DesignProvider, Dots, INVERSE, Logo, NavItem, Panel, type PillTab, PillTabs, Stat, Status, type Step, Steps, type ThemeOptions, type Tone, accentHex, buildTheme, useBrand };

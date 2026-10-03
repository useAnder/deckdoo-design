import * as _mantine_core from '@mantine/core';
import { MantineColorsTuple, VariantColorsResolver } from '@mantine/core';
import * as react from 'react';
import { ReactNode, CSSProperties, ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from 'react';

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
 * `aria-current="page"` sozinho, acende o item sem precisar de `active`.
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

export { type Accent, AppIcon, BRAND, Block, type Brand, type BrandColor, type BrandForm, type BrandShape, ChatBubble, type Corners, Count, DECKDOO_BRAND, DUDOO_MOODS, DesignProvider, Dots, DuDoo, type DuDooExpression, type DuDooEye, DuDooFace, type DuDooFaceProps, type DuDooMood, DuDooWall, INVERSE, Logo, NavItem, type NavItemProps, Panel, type PillTab, PillTabs, type SketchPoint, Stat, Status, type Step, Steps, type ThemeOptions, type Tone, accentHex, buildTheme, curl, dudooExpression, sketch, sparkle, useBrand };

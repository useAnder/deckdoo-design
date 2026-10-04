import * as _mantine_core from '@mantine/core';
import { MantineColorsTuple, VariantColorsResolver } from '@mantine/core';
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
 * (chega neutro e, assentado, faz a cara da cena); sem nada, é o desenho parado.
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
/** O que falta na tela vazia: "Nenhum arquivo ainda" é `"arquivo"`. */
type SceneObject = "slide" | "arquivo" | "pasta" | "lista" | "grafico" | "mensagem";
interface SceneProps {
    /** A cor da mancha. Padrão: o acento do app. Uma cor da paleta por cena. */
    color?: string;
}
/**
 * Nada aqui ainda: o objeto que falta, com a mancha de cor. Com `dudoo`, ele aparece olhando,
 * empolgado, para o objeto: só quando a ação da tela é dele ("Gerar com IA"). Sem, a cena é da
 * interface.
 */
declare function SceneEmpty({ object, dudoo, color, label, }: SceneProps & {
    object?: SceneObject;
    dudoo?: boolean;
    label?: string;
}): react.JSX.Element;
/** Gerando: o DuDoo pensa e o laço monta os slides. Para a espera de uma ação dele. */
declare function SceneGenerating({ color }: SceneProps): react.JSX.Element;
/** Pronto: o DuDoo pisca, inclinado, com o trabalho feito ao lado. Para o marco. */
declare function SceneDone({ color }: SceneProps): react.JSX.Element;
/** Busca sem resultado: a lupa sobre a página vazia. Sem DuDoo: é a interface falando. */
declare function SceneNoResults({ color }: SceneProps): react.JSX.Element;
/** Tudo em dia: a caixa aberta e vazia. Sem DuDoo. */
declare function SceneAllClear({ color }: SceneProps): react.JSX.Element;
/** Sem acesso: o cadeado, sóbrio. Intensidade Sério: sem DuDoo, sem brilho, sem cor da paleta. */
declare function SceneLocked(): react.JSX.Element;
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

export { type Accent, AppIcon, BRAND, Block, type Brand, type BrandColor, type BrandForm, type BrandShape, ChatBubble, type Corners, Count, DECKDOO_BRAND, DUDOO_INTENSITY, DUDOO_MOODS, DUDOO_REDUCED_TIMING, DUDOO_TIMING, DesignProvider, Dots, DrawOn, type DrawResult, DuDoo, type DuDooExpression, type DuDooEye, DuDooFace, type DuDooFaceProps, type DuDooIntensity, type DuDooMood, DuDooMotion, type DuDooMotionOptions, DuDooWall, EmptyState, INVERSE, Logo, NavItem, type NavItemProps, Panel, type PillTab, PillTabs, SCENE_STROKE, Scene, SceneAllClear, SceneCard, SceneDone, SceneDuDoo, SceneDuDooFace, SceneEmpty, SceneGenerating, SceneLine, SceneLocked, SceneNoResults, type SceneObject, type Sketch, type SketchPoint, Stat, Status, type Step, Steps, type ThemeOptions, type Tone, accentHex, buildTheme, curl, drawOn, dudooExpression, sketch, sparkle, useBrand, useDuDooMotion, usePrefersReducedMotion };

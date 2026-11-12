// O que a bancada usa do fontkit (o pacote não traz tipos).
declare module "fontkit" {
  export interface PathCommand {
    command: "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo" | "closePath";
    args: number[];
  }
  export interface Glyph {
    path: { commands: PathCommand[] };
  }
  export interface GlyphPosition {
    xAdvance: number;
    yAdvance: number;
    xOffset: number;
    yOffset: number;
  }
  export interface GlyphRun {
    glyphs: Glyph[];
    positions: GlyphPosition[];
  }
  export interface Font {
    unitsPerEm: number;
    layout(text: string): GlyphRun;
    getVariation(settings: Record<string, number>): Font;
  }
  export function create(buffer: Uint8Array): Font;
}

import { useEffect, useId, useState, type ReactNode } from "react";
import { useMantineTheme } from "@mantine/core";
import {
  lockupHasMark,
  lockupLayout,
  pickOutline,
  wordTransform,
  type LockupApp,
  type LockupMetrics,
  type LockupVersion,
} from "./lockup.js";
import { lockupWeight } from "./lockup-spec.js";
import { DECKDOO_WORD } from "./word.js";

/**
 * O lockup desenhado: o mascote (que o `Logo` passa pronto, com a troca normal/inverso) e o bloco
 * do nome e do "DeckDoo" num SVG ao lado. Tudo em `currentColor`.
 */
export function LockupView({
  version,
  height,
  app,
  mark,
  label,
  color,
}: {
  version: LockupVersion;
  height: number;
  app: LockupApp;
  mark: ReactNode;
  label: string;
  color?: string;
}) {
  const maskId = useId();
  const theme = useMantineTheme();
  const weight = lockupWeight(height);
  const outline = pickOutline(app.outlines, weight);
  const live = useLiveMetrics(outline ? null : app.name, weight, theme.fontFamily ?? "sans-serif");
  const metrics = outline?.metrics ?? live;
  if (!metrics) {
    // Sem DOM para medir (renderização no servidor): só o mascote, para não pular depois.
    return (
      <span role="img" aria-label={label} className="dd-lockup" style={{ height, color }}>
        {lockupHasMark(version) && mark}
      </span>
    );
  }

  const b = lockupLayout(version, height, metrics);
  const nameProps = outline
    ? {
        d: outline.d,
        transform: `translate(${b.text.x} ${b.text.baseline}) scale(${b.text.size / 1000})`,
      }
    : null;
  const textProps = {
    x: b.text.x,
    y: b.text.baseline,
    fontFamily: theme.fontFamily,
    fontWeight: weight,
    fontSize: b.text.size,
  };
  const name = nameProps ? <path {...nameProps} /> : <text {...textProps}>{app.name}</text>;

  return (
    <span role="img" aria-label={label} className="dd-lockup" style={{ height, color }}>
      {lockupHasMark(version) && mark}
      <svg
        className="dd-lockup-type"
        width={b.width}
        height={height}
        viewBox={`0 0 ${b.width} ${height}`}
        style={{ marginLeft: b.gap }}
        aria-hidden
      >
        {b.knock && (
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-b.width}
            y={-height}
            width={b.width * 3}
            height={height * 3}
          >
            <rect x={-b.width} y={-height} width={b.width * 3} height={height * 3} fill="#fff" />
            <g
              fill="#000"
              stroke="#000"
              strokeWidth={nameProps ? (b.knock * 1000) / b.text.size : b.knock}
              strokeLinejoin="round"
            >
              {name}
            </g>
          </mask>
        )}
        <g fill="currentColor">
          {name}
          {b.word && (
            <g mask={b.knock ? `url(#${maskId})` : undefined}>
              <g transform={wordTransform(b.word)}>
                {DECKDOO_WORD.paths.map((d) => (
                  <path key={d.slice(0, 16)} d={d} />
                ))}
              </g>
            </g>
          )}
          {b.rule && (
            <rect
              x={b.rule.x - b.rule.width / 2}
              y={b.rule.y1}
              width={b.rule.width}
              height={b.rule.y2 - b.rule.y1}
            />
          )}
        </g>
      </svg>
    </span>
  );
}

/* ——— O nome fora da lista: medido na fonte da página ——— */

let measureCtx: CanvasRenderingContext2D | null | undefined;

/** Mede o nome no canvas com a fonte da página. `null` sem DOM ou sem nome a medir. */
export function measureLive(name: string, weight: number, family: string): LockupMetrics | null {
  if (typeof document === "undefined") return null;
  measureCtx ??= document.createElement("canvas").getContext("2d");
  const ctx = measureCtx;
  if (!ctx) return null;
  ctx.font = `${weight} 100px ${family}`;
  const cap = ctx.measureText("H");
  const all = ctx.measureText(name);
  const chars = [...name];
  return {
    capFrac: cap.actualBoundingBoxAscent / 100 || 0.7,
    inkLeft: -all.actualBoundingBoxLeft / 100,
    inkRight: all.actualBoundingBoxRight / 100,
    ascent: all.actualBoundingBoxAscent / 100,
    glyphs: chars.map((ch, i) => {
      const pen = ctx.measureText(chars.slice(0, i).join("")).width;
      const g = ctx.measureText(ch);
      return [
        (pen - g.actualBoundingBoxLeft) / 100,
        (pen + g.actualBoundingBoxRight) / 100,
        g.actualBoundingBoxDescent / 100,
      ] as const;
    }),
  };
}

/** As medidas do nome ao vivo, refeitas quando a fonte termina de chegar. */
function useLiveMetrics(name: string | null, weight: number, family: string) {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    if (name === null || typeof document === "undefined" || !document.fonts) return;
    const bump = () => setEpoch((e) => e + 1);
    document.fonts.addEventListener("loadingdone", bump);
    return () => document.fonts.removeEventListener("loadingdone", bump);
  }, [name]);
  // A época entra na conta só para refazer a medida quando a fonte troca.
  return name === null || epoch < 0 ? null : measureLive(name, weight, family);
}

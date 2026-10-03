import { BRAND, Scene, SceneCard, SceneLine, curl, sparkle } from "@deckdoo/design";

/**
 * O kit do rabisco, peça por peça, para o ateliê. As cenas prontas e as peças para desenhar
 * uma são do pacote (`src/scenes.tsx`); a receita está em `docs/ilustracao.md`.
 */

const INK = "var(--dd-ink)";

/* ——— O kit, peça por peça ——— */

export type KitKind = "laco" | "brilho" | "enfase" | "mancha" | "cartao" | "rabisco";

export function KitPiece({ kind }: { kind: KitKind }) {
  return (
    <Scene w={120} h={80} seed={kind.length * 7} label={kind}>
      {(h) => {
        switch (kind) {
          case "laco":
            return <SceneLine d={curl(14, 48, 4, 1.25)} />;
          case "brilho":
            return (
              <>
                <path d={sparkle(48, 40, 18)} fill={INK} />
                <path d={sparkle(80, 26, 9)} fill={BRAND.lime} />
                <path d={sparkle(84, 56, 6)} fill={INK} />
              </>
            );
          case "enfase":
            return (
              <>
                <circle cx={60} cy={50} r={6} fill={INK} />
                <SceneLine d={h.ticks(60, 50, -90, 12, 12, 32)} />
              </>
            );
          case "mancha":
            return (
              <>
                <path d={h.blob(40, 22, 52, 44)} fill={BRAND.lime} />
                <SceneLine d={h.rect(30, 14, 50, 44, 8)} />
              </>
            );
          case "cartao":
            return (
              <SceneCard s={h} x={28} y={14} w={64} h={48} rot={-5}>
                <SceneLine
                  d={h.lines(
                    [
                      [38, 28],
                      [66, 28],
                    ],
                    [
                      [38, 36],
                      [78, 36],
                    ],
                    [
                      [38, 44],
                      [58, 44],
                    ],
                  )}
                  width={2}
                />
              </SceneCard>
            );
          case "rabisco":
            return (
              <SceneLine d="M14,52c10-18,18-24,24-12s10,14,18-4s12-20,20-6s10,12,18,2s8-10,12-4" />
            );
        }
      }}
    </Scene>
  );
}

/** O exemplo de `docs/ilustracao.md` ("Desenhe uma nova"), igual ao da receita. */
export function SceneNoOrders() {
  return (
    <Scene label="Uma caixa fechada" seed={5}>
      {(s) => (
        <>
          {/* 1. A mancha, deslocada do traço, por baixo de tudo. */}
          <path d={s.blob(92, 70, 96, 70)} fill="var(--dd-accent)" />
          {/* 2. O objeto, com fundo de painel (o SceneCard já tem). */}
          <SceneCard s={s} x={82} y={60} w={96} h={70} rot={-4}>
            <SceneLine d={s.line([130, 60], [130, 130])} width={2} />
          </SceneCard>
          {/* 3. Os enfeites: brilho, laço, ênfase. Poucos. */}
          <path d={sparkle(196, 50, 9)} fill="var(--dd-ink)" />
          <SceneLine d={curl(40, 150, 2, 0.9)} />
          <SceneLine d={s.ticks(184, 128, 20, 6, 8, 30)} />
        </>
      )}
    </Scene>
  );
}

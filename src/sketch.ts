/**
 * O rabisco: o traço à mão das ilustrações da suíte (regras em `docs/marca.md`). Sem filtro: cada linha vira uma curva levemente arqueada, cada canto amolece e
 * o contorno fechado passa um pouco do ponto onde começou, como quem desenha de uma vez. Tudo é
 * vetor (nada de deslocamento por pixel), então fica liso em qualquer tamanho.
 *
 * O acaso tem semente: o mesmo desenho sai igual em toda renderização.
 */

export type SketchPoint = [number, number];
type P = SketchPoint;

function random(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v: number) => Math.round(v * 10) / 10;
const pt = ([x, y]: P) => `${n(x)},${n(y)}`;

/** Uma curva lisa passando pelos pontos (Catmull-Rom em Bézier). */
export function smooth(points: P[], closed = false): string {
  const len = points.length;
  const at = (i: number): P =>
    closed ? points[(i + len) % len]! : points[Math.max(0, Math.min(len - 1, i))]!;
  let d = `M${pt(points[0]!)}`;
  const segments = closed ? len : len - 1;
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return closed ? `${d}Z` : d;
}

/**
 * Um lápis com semente: `const s = sketch(7)` e cada `s.line(…)`, `s.rect(…)` devolve o `d` de
 * um `<path>` para desenhar com traço (`fill="none"`, ponta redonda), ou com preenchimento no
 * caso do `blob`. A mesma semente na mesma ordem de chamadas dá o mesmo desenho.
 */
export function sketch(seed: number) {
  const r = random(seed);
  const jitter = (a: number) => (r() * 2 - 1) * a;
  const nudge = ([x, y]: P, a: number): P => [x + jitter(a), y + jitter(a)];

  /** O pedaço de curva de `a` até `b`, arqueado para um lado qualquer. */
  const bow = (a: P, b: P, amount = 0.035) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const k = len * amount * (0.4 + r() * 0.6) * (r() < 0.5 ? -1 : 1);
    const mid: P = [
      (a[0] + b[0]) / 2 + (-(b[1] - a[1]) / len) * k,
      (a[1] + b[1]) / 2 + ((b[0] - a[0]) / len) * k,
    ];
    return `Q${pt(mid)} ${pt(b)}`;
  };

  /** Uma linha reta à mão: pontas um pouco fora do lugar, meio arqueada. */
  const line = (a: P, b: P, amount?: number) => {
    const s = nudge(a, 0.6);
    return `M${pt(s)}${bow(s, nudge(b, 0.6), amount)}`;
  };
  const lines = (...segments: [P, P][]) => segments.map(([a, b]) => line(a, b)).join("");

  return {
    line,

    /** Várias linhas soltas. */
    lines,

    /** Três traços de ênfase saindo de um ponto, a partir do ângulo `from` (em graus). */
    ticks(cx: number, cy: number, from: number, r = 8, len = 7, spread = 28) {
      return lines(
        ...[-1, 0, 1].map((i): [P, P] => {
          const a = ((from + i * spread) * Math.PI) / 180;
          return [
            [cx + Math.cos(a) * r, cy + Math.sin(a) * r],
            [cx + Math.cos(a) * (r + len), cy + Math.sin(a) * (r + len)],
          ];
        }),
      );
    },

    /** Linha quebrada (seta, visto, aba de caixa): cada trecho arqueado, cantos vivos. */
    poly(points: P[]) {
      const ps = points.map((p) => nudge(p, 0.6));
      return `M${pt(ps[0]!)}${ps
        .slice(1)
        .map((p, i) => bow(ps[i]!, p))
        .join("")}`;
    },

    /** Retângulo de canto mole, que passa do começo antes de terminar. */
    rect(x: number, y: number, w: number, h: number, rad = 7) {
      const c = [
        nudge([x + w, y], 0.8),
        nudge([x + w, y + h], 0.8),
        nudge([x, y + h], 0.8),
        nudge([x, y], 0.8),
      ] as const;
      const [tr, br, bl, tl] = c;
      const start: P = [x + rad + 4 + jitter(2), y + jitter(1)];
      let d = `M${pt(start)}`;
      d += bow(start, [tr[0] - rad, tr[1]]) + `Q${pt(tr)} ${pt([tr[0], tr[1] + rad])}`;
      d +=
        bow([tr[0], tr[1] + rad], [br[0], br[1] - rad]) + `Q${pt(br)} ${pt([br[0] - rad, br[1]])}`;
      d +=
        bow([br[0] - rad, br[1]], [bl[0] + rad, bl[1]]) + `Q${pt(bl)} ${pt([bl[0], bl[1] - rad])}`;
      d +=
        bow([bl[0], bl[1] - rad], [tl[0], tl[1] + rad]) + `Q${pt(tl)} ${pt([tl[0] + rad, tl[1]])}`;
      // Passa do ponto de partida, um tico abaixo dele: a ponta que denuncia a mão.
      const tail: P = [start[0] + 6 + r() * 8, start[1] + 1.2 + r()];
      return d + bow([tl[0] + rad, tl[1]], tail, 0.02);
    },

    /** Círculo que dá uma volta e um pouco, fechando por dentro. */
    circle(cx: number, cy: number, rad: number) {
      const a0 = r() * Math.PI * 2;
      const steps = 11;
      const sweep = Math.PI * 2 + 0.55;
      const points: P[] = Array.from({ length: steps + 1 }, (_, i) => {
        const a = a0 + (sweep * i) / steps;
        const rr = rad * (1 + jitter(0.03)) * (i === steps ? 0.93 : 1);
        return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
      });
      return smooth(points);
    },

    /** Mancha de cor: um retângulo recortado à mão, de borda mole. */
    blob(x: number, y: number, w: number, h: number, rad = 8) {
      const i = rad * 0.45;
      const points: P[] = [
        [x + i, y + i],
        [x + w / 2, y],
        [x + w - i, y + i],
        [x + w, y + h / 2],
        [x + w - i, y + h - i],
        [x + w / 2, y + h],
        [x + i, y + h - i],
        [x, y + h / 2],
      ].map((p) => nudge(p as P, 1.4));
      return smooth(points, true);
    },
  };
}

/** O brilho de quatro pontas, côncavo: o ✦ da IA solto na cena. Para preencher. */
export function sparkle(cx: number, cy: number, r: number) {
  const k = r * 0.14;
  return `M${cx},${cy - r}Q${cx + k},${cy - k} ${cx + r},${cy}Q${cx + k},${cy + k} ${cx},${cy + r}Q${cx - k},${cy + k} ${cx - r},${cy}Q${cx - k},${cy - k} ${cx},${cy - r}Z`;
}

/** O laço cursivo ("eee") que liga uma coisa à outra: `n` voltas a partir de `x, y`. */
export function curl(x: number, y: number, n: number, scale = 1) {
  const s = scale;
  let d = `M${x},${y}`;
  for (let i = 0; i < n; i++) {
    d += `c${8 * s},0 ${14 * s},${-6 * s} ${12 * s},${-11 * s}c${-2 * s},${-5 * s} ${-9 * s},${-4 * s} ${-9 * s},${2 * s}c0,${6 * s} ${6 * s},${9 * s} ${13 * s},${9 * s}`;
  }
  return d;
}

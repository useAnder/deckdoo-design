/*
 * Salvar desenho como arquivo: SVG como está, PNG rasterizado num canvas. Só na cozinha e nas
 * bancadas (nada disto vai para o pacote).
 */

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function saveSvg(svg: string, name: string) {
  saveBlob(new Blob([svg], { type: "image/svg+xml" }), name);
}

/** O SVG rasterizado em `width` × `height` px, com fundo transparente. */
export async function savePng(svg: string, name: string, width: number, height: number) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Sem canvas 2D.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/png"));
    if (!png) throw new Error("O canvas não gerou o PNG.");
    saveBlob(png, name);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Um `svg` da página como arquivo avulso: copia o nó, fixa o tamanho e troca os ids gerados pelo
 * React por nomes limpos (a máscara dos olhos).
 */
export function svgFromElement(el: SVGSVGElement, size: number): string {
  const clone = el.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(size));
  clone.setAttribute("height", String(size));
  clone.removeAttribute("class");
  clone.removeAttribute("data-neutral");
  clone.removeAttribute("aria-hidden");
  let svg = new XMLSerializer().serializeToString(clone);
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!);
  ids.forEach((id, i) => {
    const clean = ids.length === 1 ? "olhos" : `olhos-${i + 1}`;
    svg = svg.split(`"${id}"`).join(`"${clean}"`).split(`#${id})`).join(`#${clean})`);
  });
  return svg;
}

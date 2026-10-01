// O build (tsup) e o playground (Vite) entregam o SVG como URL: data URI no pacote, arquivo no dev.
declare module "*.svg" {
  const url: string;
  export default url;
}

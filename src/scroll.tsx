import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * O esmaecido nas bordas de uma área que rola: em cima quando há o que voltar, embaixo quando há
 * o que descer. Marca `data-fade-top` e `data-fade-bottom` no elemento (a classe `dd-scroll-fade`
 * faz a máscara) e acompanha a rolagem, a mudança de tamanho e o conteúdo que entra ou sai.
 * Veio do `@eloquent-core/design`.
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const top = el.scrollTop > 1;
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      el.toggleAttribute("data-fade-top", top);
      el.toggleAttribute("data-fade-bottom", bottom);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    const watch = () => {
      if (!resize) return;
      resize.disconnect();
      resize.observe(el);
      for (const child of Array.from(el.children)) resize.observe(child);
    };
    watch();
    // Item que entra ou sai, grupo que abre e fecha: muda a altura do conteúdo sem mudar a da área.
    const mutations = new MutationObserver(() => {
      watch();
      update();
    });
    mutations.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "data-open", "hidden"],
    });
    return () => {
      el.removeEventListener("scroll", update);
      resize?.disconnect();
      mutations.disconnect();
    };
  }, []);
  return ref;
}

/**
 * O miolo da barra lateral que rola: vai entre o topo (logo, espaço de trabalho) e o
 * `.dd-side-foot`, que ficam presos. A barra de rolagem é fina e só aparece aqui, e as bordas
 * esmaecem quando há o que rolar. Abaixo de 48em, onde a barra vira o topo da página, não rola.
 */
export function SideScroll({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  const ref = useScrollFade<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={
        className ? `dd-side-scroll dd-scroll-fade ${className}` : "dd-side-scroll dd-scroll-fade"
      }
      {...rest}
    />
  );
}

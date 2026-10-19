import { useEffect } from "react";

/**
 * Transform-only scroll parallax.
 * Any element with data-parallax="<depth>" moves on scroll:
 *  - data-parallax-mode="hero": translateY = scrollY * depth (hero layers)
 *  - default: offset relative to the element's (non-transformed) parent
 *    position in the viewport, so it drifts as it passes through.
 * Disabled entirely under prefers-reduced-motion. Depth is halved on phones.
 */
export function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;

    let ticking = false;
    let scale = window.innerWidth < 768 ? 0.5 : 1;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const y = window.scrollY;
      for (const el of els) {
        const depth = parseFloat(el.dataset.parallax ?? "0") * scale;
        if (!depth) continue;
        if (el.dataset.parallaxMode === "hero") {
          if (y > vh * 1.3) continue;
          el.style.transform = `translate3d(0, ${(y * depth).toFixed(1)}px, 0)`;
          continue;
        }
        const anchor = el.parentElement ?? el;
        const r = anchor.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) continue;
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * depth).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      scale = window.innerWidth < 768 ? 0.5 : 1;
      onScroll();
    };
    const onMotionChange = () => {
      if (mq.matches) for (const el of els) el.style.transform = "";
      else onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener?.("change", onMotionChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener?.("change", onMotionChange);
      for (const el of els) el.style.transform = "";
    };
  }, []);
}

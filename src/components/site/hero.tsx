import { useEffect, useRef, useState } from "react";

import { SITE, BASE } from "../../site.config";

const POSTER = `${BASE}assets/hero-poster.jpg`;

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (reduce || conn?.saveData) return; // poster only: no bytes spent on motion
    const slow = /(^|\b)(2g|3g)\b/.test(conn?.effectiveType ?? "");
    const small = window.innerWidth < 900 || slow;
    v.muted = true;
    v.defaultMuted = true;
    v.src = small ? `${BASE}assets/hero-720.mp4` : `${BASE}assets/hero-1080.mp4`;

    let cancelled = false;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => !cancelled && setPlaying(true)).catch(() => !cancelled && setPlaying(false));
      }
    };
    const onPlaying = () => setPlaying(true);
    const onError = () => setPlaying(false);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("error", onError);
    v.load();
    tryPlay();

    // Pause when the hero leaves the viewport or the tab is hidden (battery).
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([e]) => {
              if (!e) return;
              if (e.isIntersecting) tryPlay();
              else v.pause();
            },
            { threshold: 0.05 },
          )
        : null;
    io?.observe(v);
    const onVis = () => (document.hidden ? v.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("error", onError);
      v.pause();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Poster is the base layer: shows instantly, and stays when autoplay is refused */}
      <img
        src={POSTER}
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        poster={POSTER}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: playing ? 1 : 0 }}
      />
    </div>
  );
}

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.3l-6 3.3 1.3-6.6L2.4 9.4l6.7-.8L12 2.5z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden" style={{ background: "var(--ink)", minHeight: "min(100svh, 980px)" }}>
      {/* depth 1: film, moves slowest */}
      <div data-parallax="0.32" data-parallax-mode="hero" className="absolute inset-0" style={{ transform: "translate3d(0,0,0)" }}>
        <div className="absolute inset-0" style={{ transform: "scale(1.08)", transformOrigin: "50% 40%" }}>
          <HeroVideo />
        </div>
      </div>
      {/* depth 2: tinted atmosphere */}
      <div
        data-parallax="0.16"
        data-parallax-mode="hero"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,31,46,0.55) 0%, rgba(15,31,46,0.15) 35%, rgba(15,31,46,0.35) 70%, rgba(15,31,46,0.92) 100%)",
        }}
      />
      {/* depth 3: copy, drifts fastest (upward), fades out */}
      <div className="relative flex min-h-[min(100svh,980px)] flex-col">
        <div className="wrap flex flex-1 flex-col justify-end pb-16 pt-36 text-[var(--bone)] md:pb-24 md:pt-44">
          <div data-parallax="-0.12" data-parallax-mode="hero" className="max-w-3xl">
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Las Vegas roofing contractor</p>
            <h1 className="font-display mt-4 text-[clamp(3rem,9vw,7rem)] leading-[0.95] text-balance">
              Roofs built for <em className="italic" style={{ color: "var(--bone-2)" }}>the Mojave.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--bone-2)] md:text-xl">
              Roof replacement, leak repair, metal roofing and gutters for Las Vegas homes, from a local
              Las Vegas crew.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#quote" className="btn-quote">
                Get My Free Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href={`tel:${SITE.phoneE164}`} className="btn-call">
                Call {SITE.phoneDisplay}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--bone-2)]">
              <span>{SITE.address.city}, {SITE.address.region}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#services", "Services"],
    ["#process", "How it works"],
    ["#reviews", "Reviews"],
    ["#area", "Service area"],
    ["#contact", "Contact"],
  ] as const;
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? "rgba(15,31,46,0.92)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: solid ? "1px solid rgba(244,239,230,0.12)" : "1px solid transparent",
      }}
    >
      <a href="#quote" className="skip-link">Skip to quote form</a>
      <nav className="wrap flex h-[4.5rem] items-center justify-between gap-4 text-[var(--bone)]" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M10 30 24 14l14 16" fill="none" stroke="var(--red)" strokeWidth="4.5" strokeLinecap="square" />
            <path d="M8 34h32" stroke="var(--red)" strokeWidth="3" />
          </svg>
          <span className="font-display hidden text-2xl leading-none sm:inline">Canyon Underground</span><span className="sr-only">Canyon Underground</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="opacity-85 transition-opacity hover:opacity-100 focus-visible:opacity-100">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phoneE164}`} className="btn-call hidden text-sm md:inline-flex" aria-label={`Call ${SITE.phoneDisplay}`}>
            {SITE.phoneDisplay}
          </a>
          <a href="#quote" className="btn-quote whitespace-nowrap !px-4 !py-2.5 !text-sm">
            Get My Free Quote
          </a>
        </div>
      </nav>
    </header>
  );
}

import { useEffect, useRef } from "react";
import { Navigation } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Dark premium header for inner pages with line-mask title reveal. */
export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  // Subtle scroll parallax on the backdrop (no animation library).
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = bgRef.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        const progress = Math.min(p / 0.35, 1);
        el.style.setProperty("--glow-y", `${(-70 * progress).toFixed(1)}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const lines = typeof title === "string" ? title.split("\n") : null;

  return (
    <section className="relative bg-night-950 overflow-hidden">
      {/* Backdrop layers */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        aria-hidden="true"
        style={{ transform: "translate3d(0, var(--glow-y, 0px), 0)", willChange: "transform" }}
      >
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-night-grid opacity-45" />
        <div className="absolute -top-32 right-1/4 w-[520px] h-[520px] rounded-full bg-brass-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[480px] h-[480px] rounded-full bg-night-600/40 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-[0.035] pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-44 pb-16 md:pb-24 text-center">
        <div
          className="fade-up inline-flex items-center gap-2.5 glass-dark text-brass-300 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-6"
          style={{ "--anim-delay": "0s" } as CSSProperties}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-brass-400" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brass-400" />
          </span>
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          {eyebrow}
        </div>

        {lines ? (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.18] tracking-tight max-w-3xl mx-auto">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1.5">
                <span
                  className="line-reveal"
                  style={{ "--line-delay": `${0.05 + i * 0.12}s` } as CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        ) : (
          <h1
            className="fade-up text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.18] tracking-tight max-w-3xl mx-auto"
            style={{ "--anim-delay": "0.1s" } as CSSProperties}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p
            className="fade-up mt-6 text-base md:text-lg text-slate-300/85 font-medium leading-relaxed max-w-2xl mx-auto"
            style={{ "--anim-delay": "0.2s" } as CSSProperties}
          >
            {subtitle}
          </p>
        )}

        {/* Route underline motif */}
        <svg
          className="fade-in mt-8 mx-auto w-40 h-4 text-brass-500/50 pointer-events-none"
          style={{ "--anim-delay": "0.4s" } as CSSProperties}
          viewBox="0 0 160 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="path-draw"
            d="M2 5C40 1.5 120 1.5 158 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <circle cx="2" cy="5" r="2" fill="#f7b955" />
        </svg>
      </div>
    </section>
  );
}

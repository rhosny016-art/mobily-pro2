import { useEffect, useState } from "react";

/**
 * Short brand intro shown once per session. Respects reduced motion
 * and skips automatically so it never delays the experience.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("dalni_seen_intro");
    } catch {
      // Storage may be blocked (private mode / embedded webviews) — never block the UI.
    }
    if (reduced || seen) {
      setVisible(false);
      return;
    }
    try {
      sessionStorage.setItem("dalni_seen_intro", "1");
    } catch {
      // Ignore — the intro still shows for this session only.
    }
    const t = setTimeout(() => setReady(true), 380);
    const fade = setTimeout(() => setFading(true), 680);
    const hide = setTimeout(() => setVisible(false), 980);
    return () => {
      clearTimeout(t);
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950 ${
        fading ? "preloader-fade" : ""
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-night-grid opacity-40" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-brass-500/10 blur-[110px]" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-night-600/30 blur-[110px]" />

      <div className="relative flex flex-col items-center">
        {/* Logo mark */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-brass-500/30 ring-pulse" aria-hidden="true" />
          <svg width="52" height="58" viewBox="0 0 54 60" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="prePin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1b2d52" />
                <stop offset="100%" stopColor="#04070e" />
              </linearGradient>
              <linearGradient id="preGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd98a" />
                <stop offset="55%" stopColor="#f7b955" />
                <stop offset="100%" stopColor="#d97f14" />
              </linearGradient>
            </defs>
            <path
              d="M 27 4 C 14.3 4 4 14.3 4 27 C 4 39.5 18.5 52 27 58 C 35.5 52 50 39.5 50 27 C 50 14.3 39.7 4 27 4 Z"
              fill="url(#prePin)"
              stroke="rgba(255,217,138,0.35)"
              strokeWidth="1"
            />
            <path d="M 14 44 L 45 11" stroke="url(#preGold)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 33 11 L 46 10 L 45 23 L 40 17 Z" fill="url(#preGold)" />
            <path d="M 27 47 L 23 53 L 27 51 L 31 53 Z" fill="#ffd98a" />
          </svg>
        </div>

        <p
          className="fade-up mt-6 text-2xl font-black text-white tracking-tight"
          style={{ animationDelay: "0.1s", fontFamily: "Alexandria, sans-serif" }}
        >
          دلّني
        </p>
        <p
          className={`mt-1 text-[11px] font-semibold tracking-[0.3em] text-brass-300/90 transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          dir="ltr"
        >
          DALNI · DIGITAL
        </p>
      </div>

      {/* Progress */}
      <div className="relative mt-10 h-1 w-44 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-l from-brass-600 via-brass-500 to-brass-300 preloader-bar" />
      </div>
    </div>
  );
}

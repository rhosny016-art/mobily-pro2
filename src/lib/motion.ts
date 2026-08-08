/** Respect reduced motion for interactive helpers. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointer detection (touch-first). */
export function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

/** Signature easings used across the site (CSS timing functions). */
export const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_IN_OUT_SOFT = "cubic-bezier(0.65, 0.05, 0.36, 1)";

/** Cubic ease-out ≈ framer-motion's [0.22, 1, 0.36, 1]. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface TweenOptions {
  duration?: number;
  delay?: number;
  onUpdate: (v: number) => void;
  onComplete?: () => void;
}

/**
 * Lightweight rAF-based tween (replaces framer-motion's `animate`).
 * Returns a cancel function.
 */
export function tween(from: number, to: number, { duration = 1, delay = 0, onUpdate, onComplete }: TweenOptions): () => void {
  let raf = 0;
  let done = false;
  const start = performance.now() + delay * 1000;

  const tick = (now: number) => {
    if (done) return;
    const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
    onUpdate(from + (to - from) * easeOutCubic(t));
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      done = true;
      onComplete?.();
    }
  };

  raf = requestAnimationFrame(tick);
  return () => {
    done = true;
    cancelAnimationFrame(raf);
  };
}

import type { Variants } from "framer-motion";

/** Signature easing used across the site — expo out for an expensive, premium feel. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_SOFT = [0.65, 0.05, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: EASE_OUT_EXPO },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: (delayChildren: number = 0) => ({
    transition: { staggerChildren: 0.09, delayChildren },
  }),
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: "0%",
    transition: { delay: i * 0.09, duration: 0.85, ease: EASE_OUT_EXPO },
  }),
};

/** Respect reduced motion for interactive helpers. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointer detection (touch-first). */
export function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

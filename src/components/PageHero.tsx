import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation } from "lucide-react";
import type { ReactNode } from "react";
import { lineReveal, staggerContainer, EASE_OUT_EXPO, prefersReducedMotion } from "@/lib/motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Dark premium header for inner pages with line-mask title reveal. */
export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  const { scrollYProgress } = useScroll();
  const reduced = prefersReducedMotion();
  const glowY = useTransform(scrollYProgress, [0, 0.35], [0, reduced ? 0 : -70]);

  const lines = typeof title === "string" ? title.split("\n") : null;

  return (
    <section className="relative bg-night-950 overflow-hidden">
      {/* Backdrop layers */}
      <motion.div style={{ y: glowY }} className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-night-grid opacity-45" />
        <div className="absolute -top-32 right-1/4 w-[520px] h-[520px] rounded-full bg-brass-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[480px] h-[480px] rounded-full bg-night-600/40 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-[0.035] pointer-events-none" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-44 pb-16 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="inline-flex items-center gap-2.5 glass-dark text-brass-300 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-brass-400" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brass-400" />
          </span>
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          {eyebrow}
        </motion.div>

        {lines ? (
          <motion.h1
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.18] tracking-tight max-w-3xl mx-auto"
          >
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1.5">
                <motion.span variants={lineReveal} custom={i} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.18] tracking-tight max-w-3xl mx-auto"
          >
            {title}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="mt-6 text-base md:text-lg text-slate-300/85 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Route underline motif */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 mx-auto w-40 h-4 text-brass-500/50 pointer-events-none"
          viewBox="0 0 160 8"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M2 5C40 1.5 120 1.5 158 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT_EXPO }}
          />
          <circle cx="2" cy="5" r="2" fill="#f7b955" />
        </motion.svg>
      </div>
    </section>
  );
}

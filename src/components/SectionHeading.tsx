import { motion } from "framer-motion";
import { fadeUp, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

interface Props {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
  index?: string;
}

export default function SectionHeading({ id, eyebrow, title, subtitle, light = false, center = true, index }: Props) {
  return (
    <div id={id} className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12 md:mb-16`}>
      {index && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : "justify-start"}`}
        >
          <span
            dir="ltr"
            className={`font-display text-[11px] font-bold tracking-[0.3em] ${light ? "text-brass-400/80" : "text-brass-500/80"}`}
          >
            {index}
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-brass-500/60 to-transparent" aria-hidden="true" />
        </motion.div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        {eyebrow && (
          <motion.span
            variants={fadeUp}
            custom={0}
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[13px] font-bold mb-5 ${
              light
                ? "glass-dark text-brass-300"
                : "bg-brass-500/10 text-brass-700 border border-brass-500/20"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${light ? "bg-brass-400" : "bg-brass-500"} animate-pulse-soft`} />
            {eyebrow}
            <svg className="w-4 h-4 text-brass-500/60" viewBox="0 0 20 8" fill="none" aria-hidden="true">
              <path d="M1 4C6 1.5 14 1.5 19 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>
          </motion.span>
        )}

        <motion.h2
          variants={fadeUp}
          custom={1}
          className={`text-3xl md:text-[42px] font-black leading-[1.2] tracking-tight ${
            light ? "text-white" : "text-night-900"
          }`}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            variants={fadeUp}
            custom={2}
            className={`mt-4 text-base md:text-lg leading-relaxed font-medium ${
              light ? "text-slate-300/80" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

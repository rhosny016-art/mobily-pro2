import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered reveal wrapper (fade + rise + optional blur). */
export default function Reveal({ children, delay = 0, y = 28, x = 0, blur = true, className, once = true }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: blur ? "blur(5px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

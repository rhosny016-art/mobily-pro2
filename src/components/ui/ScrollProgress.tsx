import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[60] h-[3px] origin-right bg-gradient-to-l from-brass-400 via-brass-500 to-brass-600"
      style={{ scaleX }}
    />
  );
}

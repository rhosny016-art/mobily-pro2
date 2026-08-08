import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
      className={`fixed bottom-24 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-night-800 text-brass-300 border border-white/10 shadow-lg transition-all duration-300 hover:bg-night-700 hover:-translate-y-0.5 ${
        visible ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-4 scale-90"
      }`}
      aria-label="العودة إلى الأعلى"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

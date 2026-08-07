import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-night-800 text-brass-300 border border-white/10 shadow-lg hover:bg-night-700 hover:-translate-y-0.5 transition-all duration-200"
      aria-label="العودة إلى الأعلى"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

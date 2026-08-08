import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
  amount?: number;
}

/**
 * IntersectionObserver-based "in view" tracking.
 * Replaces framer-motion's `whileInView` / `useInView` on the public site.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = true,
  margin = "0px",
  amount = 0.2,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin, threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, margin, amount]);

  return { ref, inView };
}

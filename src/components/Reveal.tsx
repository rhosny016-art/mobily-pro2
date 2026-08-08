import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils/cn";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  scale?: boolean;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered reveal wrapper (fade + rise + optional blur/scale).
 * Pure CSS transition driven by IntersectionObserver — no animation library.
 */
export default function Reveal({ children, delay = 0, y = 28, x = 0, blur = true, scale = false, className, once = true }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ once, amount: 0.2 });

  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "reveal-in-view", className)}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-x": `${x}px`,
          "--reveal-blur": blur ? "5px" : "0px",
          "--reveal-scale": scale ? "0.94" : "1",
          "--reveal-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

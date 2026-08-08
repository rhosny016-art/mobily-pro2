import { useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

/* ---------- Container ---------- */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/* ---------- Section ---------- */

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ id, children, className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 md:py-28 overflow-hidden", className)}>
      <Container className={cn("relative", containerClassName)}>{children}</Container>
    </section>
  );
}

/* ---------- Eyebrow ---------- */

interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function Eyebrow({ children, light = false, className, icon }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold",
        light
          ? "glass-dark text-brass-300"
          : "bg-brass-500/10 text-brass-700 border border-brass-500/20",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-soft", light ? "bg-brass-400" : "bg-brass-500")} />
      {icon}
      {children}
    </span>
  );
}

/* ---------- Magnetic (pointer-fine only) ---------- */

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Cursor-attracted wrapper — CSS variables + transition, no animation library. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  if (!isFinePointer() || prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("magnetic", className)}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - (rect.left + rect.width / 2)) * strength).toFixed(1)}px`);
        el.style.setProperty("--my", `${((e.clientY - (rect.top + rect.height / 2)) * strength).toFixed(1)}px`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        el?.style.setProperty("--mx", "0px");
        el?.style.setProperty("--my", "0px");
      }}
    >
      {children}
    </div>
  );
}

/* ---------- TiltCard (pointer-fine only, subtle 3D) ---------- */

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  if (!isFinePointer() || prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("tilt-card", className)}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--rx", `${((0.5 - py) * maxTilt * 2).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * maxTilt * 2).toFixed(2)}deg`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        el?.style.setProperty("--rx", "0deg");
        el?.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}

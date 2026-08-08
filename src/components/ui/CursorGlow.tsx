import { useEffect, useRef, useState } from "react";

/**
 * Subtle radial glow that follows the pointer on fine-pointer devices.
 * Disabled for touch / reduced-motion users. Purely decorative.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -400, y: -400, tx: -400, ty: -400 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let raf = 0;
    let idle = true;
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      const el = glowRef.current;
      if (el) el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      if (Math.abs(p.x - p.tx) < 0.5 && Math.abs(p.y - p.ty) < 0.5) {
        // Settled — pause the loop until the pointer moves again.
        p.x = p.tx;
        p.y = p.ty;
        idle = true;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      if (idle) {
        idle = false;
        raf = requestAnimationFrame(loop);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      style={{ willChange: "transform" }}
    >
      <div className="h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(237,155,47,0.07),transparent_60%)]" />
    </div>
  );
}

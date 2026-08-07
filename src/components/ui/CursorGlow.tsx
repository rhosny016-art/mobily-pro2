import { useEffect, useState } from "react";

/**
 * Subtle radial glow that follows the pointer on fine-pointer devices.
 * Disabled for touch / reduced-motion users. Purely decorative.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className="h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(237,155,47,0.07),transparent_60%)]" />
    </div>
  );
}

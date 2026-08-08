import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils/cn";

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
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.35 });

  return (
    <div ref={ref} id={id} className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12 md:mb-16`}>
      {index && (
        <div
          className={cn(
            "reveal flex items-center gap-3 mb-4",
            center ? "justify-center" : "justify-start",
            inView && "reveal-in-view"
          )}
          style={{ "--reveal-x": "12px", "--reveal-y": "0px", "--reveal-blur": "0px" } as CSSProperties}
        >
          <span
            dir="ltr"
            className={`font-display text-[11px] font-bold tracking-[0.3em] ${light ? "text-brass-400/80" : "text-brass-500/80"}`}
          >
            {index}
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-brass-500/60 to-transparent" aria-hidden="true" />
        </div>
      )}

      <div className={cn("reveal-stagger", inView && "in-view")}>
        {eyebrow && (
          <span
            style={{ "--stagger-delay": "0.05s" } as CSSProperties}
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
          </span>
        )}

        <h2
          style={{ "--stagger-delay": "0.15s" } as CSSProperties}
          className={`text-3xl md:text-[42px] font-black leading-[1.2] tracking-tight ${
            light ? "text-white" : "text-night-900"
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{ "--stagger-delay": "0.25s" } as CSSProperties}
            className={`mt-4 text-base md:text-lg leading-relaxed font-medium ${
              light ? "text-slate-300/80" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

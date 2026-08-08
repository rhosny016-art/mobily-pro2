import { Check, Sparkles, ArrowLeft } from "lucide-react";
import type { CSSProperties } from "react";
import { ICON_MAP } from "@/lib/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Service } from "@/lib/siteData";
import { useInView } from "@/hooks/useInView";

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const Icon = ICON_MAP[service.icon] || Sparkles;
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.15 });

  return (
    <div
      ref={ref}
      className={`reveal h-full ${inView ? "reveal-in-view" : ""}`}
      style={
        {
          "--reveal-y": "32px",
          "--reveal-blur": "5px",
          "--reveal-delay": `${(index % 3) * 0.1}s`,
        } as CSSProperties
      }
    >
      <div
        id={`service-card-${service.id}`}
        className="relative group h-full hover:-translate-y-2 transition-transform duration-300"
      >
        {/* Gradient border glow */}
        <div
          className="absolute -inset-px rounded-[26px] bg-gradient-to-l from-brass-500 via-brass-400 to-brass-600 opacity-0 group-hover:opacity-60 blur-[6px] transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative h-full flex flex-col rounded-[26px] border border-line bg-white p-6 sm:p-7 transition-colors duration-300 group-hover:border-brass-500/40 overflow-hidden">
          {/* Top gold accent line */}
          <span
            className="absolute top-0 right-6 left-6 h-[3px] rounded-b-full bg-gradient-to-l from-brass-400 via-brass-500 to-brass-600 opacity-0 group-hover:opacity-100 scale-x-50 group-hover:scale-x-100 origin-right transition-all duration-500"
            aria-hidden="true"
          />

          {/* Corner deco */}
          <div
            className="absolute -top-14 -left-14 w-36 h-36 rounded-full bg-gradient-to-br from-brass-400/12 via-brass-500/8 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-[1.6] pointer-events-none"
            aria-hidden="true"
          />

          {/* Index watermark */}
          <span
            dir="ltr"
            className="absolute bottom-3 left-4 font-display text-[40px] font-bold leading-none text-night-900/[0.05] group-hover:text-brass-500/10 transition-colors duration-500 select-none pointer-events-none"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {service.featured && (
            <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-gradient-to-l from-brass-600 to-brass-400 text-night-950 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-glow-gold z-10">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              الأكثر طلباً
            </span>
          )}

          {/* Icon */}
          <div className="relative mb-5 z-10">
            <span className="absolute inset-0 rounded-2xl bg-brass-500/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
            <div className="relative w-14 h-14 rounded-2xl bg-night-900 text-brass-300 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brass-400 group-hover:to-brass-600 group-hover:text-night-950 group-hover:rotate-6 group-hover:scale-110 shadow-md transition-all duration-300">
              <Icon className="w-7 h-7" aria-hidden="true" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-night-900 mb-2.5 group-hover:text-night-600 transition-colors z-10">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-5 flex-grow z-10">
            {service.short}
          </p>

          <ul className="space-y-2.5 mb-6 z-10">
            {service.benefits.slice(0, 3).map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13px] text-night-800/85 font-semibold">
                <span className="w-5 h-5 rounded-full bg-mint-500/12 text-mint-600 flex items-center justify-center shrink-0 mt-px">
                  <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-auto pt-5 border-t border-line z-10">
            <a
              href={buildWhatsAppLink(`مرحباً، أريد الاستفسار عن خدمة: ${service.title} 🙏`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-night-900 text-white text-[13px] font-extrabold px-5 py-2.5 group-hover:bg-gradient-to-l group-hover:from-brass-600 group-hover:to-brass-500 group-hover:text-night-950 transition-all duration-300 group-hover:shadow-glow-gold active:scale-95"
            >
              اطلب الخدمة
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

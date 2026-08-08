import { useEffect, useRef, useState } from "react";
import { X, MapPin, Globe2, ArrowLeft, Radio } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/utils/cn";

interface DigitalHub {
  id: string;
  name: string;
  country: string;
  clients: string;
  details: string;
  isCentral?: boolean;
  coords: { x: number; y: number };
}

const DIGITAL_HUBS: DigitalHub[] = [
  {
    id: "central",
    name: "المقر الرئيسي",
    country: "إدارة التغطية الرقمية",
    clients: "+150 مشروع ناجح",
    details:
      "المركز السحابي الرئيسي لوكالة دلّني — من هنا تُنسّق استراتيجيات تصدّر الخرائط والمحركات والحملات الإعلانية لكل الأسواق.",
    isCentral: true,
    coords: { x: 460, y: 420 },
  },
  {
    id: "riyadh",
    name: "الرياض",
    country: "السعودية",
    clients: "+45 شركة نشطة",
    details: "إدارة متكاملة لحملات النجاح الإعلانية، وتحسين خرائط Google وصناعة المحتوى للشركات بالمملكة.",
    coords: { x: 430, y: 390 },
  },
  {
    id: "jeddah",
    name: "جدة",
    country: "السعودية",
    clients: "+30 علامة تجارية",
    details: "حلول تسويقية ميدانية لقطاع التجزئة والمطاعم في المنطقة الغربية.",
    coords: { x: 375, y: 440 },
  },
  {
    id: "kuwait",
    name: "الكويت",
    country: "الكويت",
    clients: "+25 شريك نمو",
    details: "استشارات التجارة الإلكترونية وتحسين الظهور المحلي للشركات الكويتية.",
    coords: { x: 470, y: 330 },
  },
  {
    id: "dubai",
    name: "دبي",
    country: "الإمارات",
    clients: "+35 مشروع قائم",
    details: "توثيق الحسابات والأنشطة التجارية وحلول النمو للمؤسسات المبتكرة بالإمارات.",
    coords: { x: 540, y: 380 },
  },
  {
    id: "egypt",
    name: "مصر",
    country: "مصر",
    clients: "+60 مشروع نشط",
    details: "مركز الإنتاج الإبداعي وإدارة ملفات خرائط جوجل والحملات التسويقية في كل المحافظات.",
    coords: { x: 320, y: 400 },
  },
  {
    id: "amman",
    name: "عمّان",
    country: "الأردن",
    clients: "+16 شركة",
    details: "حلول إعلانية وتطوير للمتاجر الإلكترونية وشركات التكنولوجيا بالأردن.",
    coords: { x: 385, y: 325 },
  },
  {
    id: "baghdad",
    name: "بغداد",
    country: "العراق",
    clients: "+14 مشروع",
    details: "تسويق الأنشطة التجارية والظهور في المحركات والخرائط بالعراق.",
    coords: { x: 440, y: 280 },
  },
  {
    id: "casablanca",
    name: "المغرب",
    country: "المغرب",
    clients: "+12 شركة",
    details: "استشارات تسويقية ومحتوى رقمي للشركات والمتاجر في المغرب العربي.",
    coords: { x: 185, y: 355 },
  },
  {
    id: "tunis",
    name: "تونس",
    country: "تونس",
    clients: "+10 شركات",
    details: "تسويق محلي وتطوير الهويات التجارية للمؤسسات التونسية.",
    coords: { x: 255, y: 290 },
  },
  {
    id: "istanbul",
    name: "تركيا",
    country: "تركيا",
    clients: "+15 شركة",
    details: "خدمات تسويق وتوثيق للشركات الناشئة والعلامات المستهدفة للجمهور العربي والتركي.",
    coords: { x: 355, y: 225 },
  },
  {
    id: "london",
    name: "لندن",
    country: "بريطانيا",
    clients: "+12 مؤسسة",
    details: "إدارة وتسويق الأعمال الموجهة للجاليات العربية والاستثمارات الشرق أوسطية.",
    coords: { x: 215, y: 185 },
  },
  {
    id: "usa",
    name: "أمريكا",
    country: "الولايات المتحدة",
    clients: "+10 مشاريع",
    details: "ربط العلامات التجارية بالأسواق الأمريكية وتوسيع الحملات العابرة للقارات.",
    coords: { x: 150, y: 265 },
  },
  {
    id: "malaysia",
    name: "ماليزيا",
    country: "ماليزيا",
    clients: "+9 مشاريع",
    details: "تغطية تسويقية وتقنية للاستثمارات في جنوب شرق آسيا.",
    coords: { x: 620, y: 500 },
  },
];

const PANEL_EXIT_MS = 220;

export default function InteractiveAgencyMap() {
  const [selectedHub, setSelectedHub] = useState<DigitalHub | null>(null);
  const [closing, setClosing] = useState(false);
  const reduced = prefersReducedMotion();
  const exitTimer = useRef<number | null>(null);
  const closingRef = useRef(false);
  const lastHubIdRef = useRef<string | null>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const centralHub = DIGITAL_HUBS.find((h) => h.isCentral) || DIGITAL_HUBS[0];
  const otherHubs = DIGITAL_HUBS.filter((h) => !h.isCentral);

  useEffect(() => {
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const closePanel = () => {
    if (closingRef.current) return;
    if (selectedHub) lastHubIdRef.current = selectedHub.id;
    closingRef.current = true;
    setClosing(true);
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      closingRef.current = false;
      setSelectedHub(null);
      setClosing(false);
      const id = lastHubIdRef.current;
      if (id) pinRefs.current[id]?.focus();
    }, PANEL_EXIT_MS);
  };

  return (
    <section id="network" aria-label="شبكة تغطية وكالة دلّني" className="relative scroll-mt-24 py-16 md:py-28 bg-night-950 text-white overflow-hidden border-t border-white/6">
      <div className="absolute inset-0 bg-night-grid opacity-40" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-r from-brass-500/8 via-brass-400/4 to-transparent rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="شبكة تغطيتنا"
          title="شبكة نجاح تمتد عبر الأسواق"
          subtitle="فريقنا يدير مشاريع عملائه من قلب العالم العربي وصولاً إلى الأسواق العالمية — بنفس المعايير والنتائج."
          light
        />

        <div className="mt-4 sm:mt-8 rounded-3xl bg-night-900/70 border border-white/8 shadow-[0_30px_90px_-24px_rgba(4,7,14,0.9)] overflow-hidden backdrop-blur-xl">
          {/* HUD bar */}
          <div className="px-5 sm:px-7 py-4 border-b border-white/8 bg-night-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-4.5 h-4.5 text-brass-400" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                خريطة شبكة النجاح
                <span className="hidden sm:inline text-slate-500 font-medium"> — 14 مدينة ومركز تشغيلي</span>
              </span>
            </div>
            <div className="flex items-center gap-2 font-display text-[11px] sm:text-xs text-brass-300 bg-brass-500/10 border border-brass-500/25 px-3 py-1.5 rounded-full">
              <Radio className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
              شبكة نشطة 24/7
            </div>
          </div>

          {/* Map */}
          <div className="relative w-full max-w-[760px] aspect-square mx-auto flex items-center justify-center p-3 sm:p-8">
            <svg viewBox="0 0 800 800" className="w-full h-full block select-none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <radialGradient id="oceanGrad" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#0c1834" />
                  <stop offset="55%" stopColor="#081126" />
                  <stop offset="100%" stopColor="#04070e" />
                </radialGradient>
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#16264c" />
                  <stop offset="100%" stopColor="#0b1428" />
                </linearGradient>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f7b955" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#f7b955" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffd98a" stopOpacity="0.6" />
                </linearGradient>
                <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Globe */}
              <circle cx="400" cy="400" r="360" fill="url(#oceanGrad)" stroke="rgba(255,217,138,0.14)" strokeWidth="1" />
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none">
                <ellipse cx="400" cy="160" rx="240" ry="40" />
                <ellipse cx="400" cy="280" rx="330" ry="60" />
                <ellipse cx="400" cy="400" rx="360" ry="75" />
                <ellipse cx="400" cy="520" rx="330" ry="60" />
                <ellipse cx="400" cy="640" rx="240" ry="40" />
                <ellipse cx="400" cy="400" rx="120" ry="360" />
                <ellipse cx="400" cy="400" rx="240" ry="360" />
                <ellipse cx="400" cy="400" rx="320" ry="360" />
              </g>

              {/* Continents */}
              <g fill="url(#landGrad)" stroke="rgba(247,185,85,0.16)" strokeWidth="1">
                <path d="M 200,170 Q 215,150 230,165 Q 240,155 255,160 Q 280,150 300,165 Q 320,155 340,175 Q 360,170 380,185 Q 390,210 375,225 Q 350,235 330,220 Q 310,240 290,230 Q 270,220 250,235 Q 230,225 210,210 Q 195,190 200,170 Z" />
                <path d="M 170,320 Q 200,300 240,290 Q 280,285 320,295 Q 360,310 390,340 Q 400,370 380,410 Q 350,430 310,425 Q 260,420 220,400 Q 180,380 165,350 Q 160,335 170,320 Z" />
                <path d="M 380,330 Q 420,310 460,300 Q 500,315 540,340 Q 575,370 580,420 Q 570,470 530,490 Q 480,505 440,490 Q 400,470 385,430 Q 375,380 380,330 Z" />
                <path d="M 350,220 Q 400,200 460,210 Q 520,195 580,230 Q 640,260 670,320 Q 690,390 660,460 Q 620,530 570,540 Q 530,510 510,460 Q 490,410 460,380 Q 420,360 380,340 Q 360,300 350,220 Z" />
                <path d="M 100,220 Q 130,190 170,200 Q 190,230 180,270 Q 160,310 135,320 Q 110,300 95,260 Q 90,240 100,220 Z" />
              </g>

              {/* Arcs with traveling dots (SMIL, deterministic delays) */}
              {otherHubs.map((hub) => {
                const midX = (centralHub.coords.x + hub.coords.x) / 2;
                const midY = (centralHub.coords.y + hub.coords.y) / 2 - 24;
                const d = `M ${centralHub.coords.x},${centralHub.coords.y} Q ${midX},${midY} ${hub.coords.x},${hub.coords.y}`;
                const travelDelay = `${((hub.coords.x + hub.coords.y * 3) % 20) / 10}s`;
                const cxValues = `${centralHub.coords.x};${midX};${hub.coords.x}`;
                const cyValues = `${centralHub.coords.y};${midY};${hub.coords.y}`;
                return (
                  <g key={`arc-${hub.id}`}>
                    <path d={d} fill="none" stroke="rgba(247,185,85,0.22)" strokeWidth="1.2" />
                    <path d={d} fill="none" stroke="url(#arcGrad)" strokeWidth="1.4" strokeLinecap="round" className="route-dash" filter="url(#softGlow)" />
                    <circle r="2.6" fill="#ffd98a" filter="url(#softGlow)">
                      {!reduced && (
                        <>
                          <animate attributeName="cx" values={cxValues} keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" calcMode="spline" dur="3.2s" begin={travelDelay} repeatCount="indefinite" />
                          <animate attributeName="cy" values={cyValues} keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" calcMode="spline" dur="3.2s" begin={travelDelay} repeatCount="indefinite" />
                        </>
                      )}
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Central pin */}
            <button
              type="button"
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{ left: `${(centralHub.coords.x / 800) * 100}%`, top: `${(centralHub.coords.y / 800) * 100}%` }}
              onClick={() => {
                if (exitTimer.current) window.clearTimeout(exitTimer.current);
                closingRef.current = false;
                setClosing(false);
                setSelectedHub(centralHub);
              }}
              aria-label={`${centralHub.name} — ${centralHub.clients}`}
              aria-pressed={selectedHub?.id === centralHub.id}
            >
              <span className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-brass-400/30 animate-ping-ring pointer-events-none" />
              <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-brass-400 via-brass-500 to-brass-600 flex items-center justify-center text-night-950 shadow-[0_0_26px_rgba(237,155,47,0.75)] border-2 border-brass-200">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="mt-1.5 bg-night-900/90 border border-brass-500/40 text-brass-300 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-lg shadow-lg whitespace-nowrap">
                {centralHub.name}
              </span>
            </button>

            {/* City pins */}
            {otherHubs.map((hub) => {
              const isSelected = selectedHub?.id === hub.id;
              const alignClass =
                hub.coords.x < 215
                  ? "translate-x-0 right-0"
                  : hub.coords.x > 610
                    ? "translate-x-0 left-0"
                    : "-translate-x-1/2 left-1/2";
              return (
                <button
                  key={`pin-${hub.id}`}
                  type="button"
                  ref={(el) => {
                    pinRefs.current[hub.id] = el;
                  }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group/pin ${
                    isSelected ? "z-30" : ""
                  }`}
                  style={{ left: `${(hub.coords.x / 800) * 100}%`, top: `${(hub.coords.y / 800) * 100}%` }}
                  onClick={() => {
                    if (exitTimer.current) window.clearTimeout(exitTimer.current);
                    closingRef.current = false;
                    setClosing(false);
                    setSelectedHub(hub);
                  }}
                  aria-label={`${hub.name} — ${hub.clients}`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full border transition-all duration-200 ${
                      isSelected
                        ? "bg-brass-400 border-white scale-125 shadow-[0_0_14px_rgba(237,155,47,0.9)]"
                        : "bg-night-700 border-brass-500/80 group-hover/pin:bg-brass-500 group-hover/pin:scale-110"
                    }`}
                  />
                  <span
                    className={`absolute top-full mt-1 ${alignClass} text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap pointer-events-none transition-all duration-200 ${
                      isSelected
                        ? "bg-brass-500 text-night-950 font-extrabold scale-105"
                        : "bg-night-900/90 border border-white/10 text-slate-300 group-hover/pin:text-brass-300 group-hover/pin:border-brass-500/40"
                    }`}
                  >
                    {hub.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom stats bar */}
          <div className="px-5 sm:px-7 py-4 border-t border-white/8 bg-night-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>
              تغطية ناجحة:{" "}
              <strong className="font-display text-brass-300 font-bold">
                {DIGITAL_HUBS.length} مدينة
              </strong>{" "}
              في {new Set(DIGITAL_HUBS.map((h) => h.country)).size} دولة
            </span>
            <span className="inline-flex items-center gap-1.5 text-mint-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse-soft" />
              جميع المشاريع تعمل بنجاح
            </span>
          </div>
        </div>

        {/* Selected hub panel */}
        {selectedHub && (
          <div
            role="region"
            aria-label="تفاصيل المركز المحدد"
            className={cn(
              "mt-6 mx-auto max-w-2xl rounded-3xl glass-dark p-6 sm:p-8 text-right",
              closing ? "panel-out pointer-events-none" : "panel-in"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-night-950 shrink-0">
                  <Globe2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {selectedHub.name}
                    {!selectedHub.isCentral && selectedHub.country !== selectedHub.name && (
                      <span className="text-slate-400 font-bold text-sm"> ({selectedHub.country})</span>
                    )}
                  </h3>
                  <p className="text-xs font-bold text-brass-300 mt-0.5">{selectedHub.clients}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="إغلاق التفاصيل"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">{selectedHub.details}</p>

            <div className="mt-6 flex justify-end">
              <a
                href={buildWhatsAppLink(`مرحباً، أود الاستفسار عن خدمات النجاح والتسويق في (${selectedHub.name} - ${selectedHub.country})`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-brass-600 to-brass-500 text-night-950 font-extrabold text-sm px-6 py-3 hover:brightness-110 transition-all"
              >
                تواصل مع فريق {selectedHub.name}
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

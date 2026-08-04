import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, useInView, motion } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  ScanSearch,
  Rocket,
  BarChart3,
  ArrowLeft,
  Headset,
  Target,
  LineChart,
  TrendingUp,
  PhoneCall,
  Eye,
  Star,
  Zap,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ICON_MAP } from "@/lib/icons";
import { getServices, getSiteSettings } from "@/lib/store";
import { DEFAULT_SETTINGS, SERVICES as DEFAULT_SERVICES, WHY_CHOOSE_US } from "@/lib/siteData";

/* ============ Platform marquee ============ */

const PLATFORMS = [
  "خرائط Google",
  "Google Ads",
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "Snapchat",
  "Local SEO",
  "Google Analytics",
];

export function PlatformStrip() {
  return (
    <div
      className="relative bg-fog border-y border-line overflow-hidden py-5"
      aria-label="المنصات التي نعمل عليها"
    >
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-fog to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-fog to-transparent z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-brass-700 bg-brass-500/10 border border-brass-500/25 rounded-full px-3.5 py-1.5">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          نُتقن هذه المنصات
        </span>
        <div className="flex-1 w-full overflow-hidden" dir="ltr">
          <div className="marquee-track flex w-max items-center gap-10">
            {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="flex items-center gap-10 text-sm font-bold text-night-500/70 whitespace-nowrap"
              >
                {p}
                <span className="w-1.5 h-1.5 rounded-full bg-brass-400/60" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Services ============ */

export function ServicesSection() {
  const [services, setServices] = useState(DEFAULT_SERVICES.filter((s) => s.visible !== false));
  useEffect(() => {
    getServices().then((list) => setServices(list.filter((s) => s.visible !== false)));
  }, []);

  return (
    <section id="services" className="relative scroll-mt-24 py-16 md:py-28 bg-fog overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-fog to-transparent pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[420px] h-[420px] rounded-full bg-brass-500/6 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-[420px] h-[420px] rounded-full bg-night-600/8 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-fog-dots opacity-[0.35] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="خدماتنا الاحترافية"
          title="حلول تسويقية متكاملة لنمو عملك"
          subtitle="من الظهور المتصدر على خرائط Google إلى الحملات الإعلانية الذكية — كل ما يحتاجه نشاطك لتجاوز منافسيه."
          index="01 — SERVICES"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {services.slice(0, 6).map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2.5 rounded-full border border-brass-500/30 bg-white px-7 py-3.5 text-sm font-extrabold text-night-900 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-500/60 hover:shadow-card-lg"
          >
            تصفح جميع الخدمات
            <ArrowLeft className="w-4 h-4 text-brass-600 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ Results showcase ============ */

const RESULT_BARS = [
  { label: "الأسبوع الأول", value: 18 },
  { label: "بعد 30 يوماً", value: 46 },
  { label: "بعد 60 يوماً", value: 74 },
  { label: "بعد 90 يوماً", value: 92 },
];

const RESULT_KPIS = [
  { icon: PhoneCall, value: "+300%", label: "نمو المكالمات والاستفسارات", accent: "text-mint-400" },
  { icon: Eye, value: "+150%", label: "زيادة الظهور في الخرائط", accent: "text-brass-300" },
  { icon: Star, value: "4.9/5", label: "متوسط تقييم مشاريع الشركاء", accent: "text-brass-300" },
  { icon: Zap, value: "×3", label: "معدل تحويل الزيارات إلى عملاء", accent: "text-mint-400" },
];

function AnimatedBar({ value, label, index }: { value: number; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.5,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
      onUpdate: (v) => setW(v),
    });
    return () => controls.stop();
  }, [inView, value, index]);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-extrabold text-slate-300">{label}</span>
        <span className="font-display text-xs font-bold text-brass-300">{Math.round(w)}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-l from-brass-600 via-brass-500 to-brass-300 shadow-[0_0_12px_rgba(237,155,47,0.4)]"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsShowcaseSection() {
  return (
    <section id="results" className="relative scroll-mt-24 py-16 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brass-500/6 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="نتائج حقيقية"
          title="شاهد الفرق في أول 90 يوماً"
          subtitle="متوسط الأداء الفعلي لمشاريع شركائنا خلال الأشهر الثلاثة الأولى من العمل معنا."
          index="02 — RESULTS"
        />

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-stretch">
          {/* Growth chart card */}
          <Reveal className="h-full">
            <div className="h-full rounded-[28px] bg-night-950 border border-white/8 p-7 md:p-9 shadow-[0_30px_80px_-28px_rgba(4,7,14,0.7)] overflow-hidden relative">
              <div className="absolute inset-0 bg-night-grid opacity-40 pointer-events-none" aria-hidden="true" />
              <div className="absolute -top-24 left-1/3 w-[320px] h-[320px] rounded-full bg-brass-500/12 blur-[120px] pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
                      <TrendingUp className="w-4 h-4 text-mint-400" aria-hidden="true" />
                      مسار النمو المتوقع
                    </p>
                    <p className="mt-1.5 text-2xl font-black text-white font-display">
                      من <span className="text-slate-400 line-through decoration-brass-500/60">الصفر</span> إلى التصدر
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-500/10 border border-mint-500/25 text-mint-400 text-[11px] font-extrabold px-3 py-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse-soft" />
                    بيانات حية
                  </span>
                </div>

                <div className="mt-9 space-y-6">
                  {RESULT_BARS.map((bar, i) => (
                    <AnimatedBar key={bar.label} value={bar.value} label={bar.label} index={i} />
                  ))}
                </div>

                <p className="mt-8 text-xs text-slate-500 font-semibold">
                  * متوسط نتائج شركائنا في القطاعات المحلية والإقليمية خلال أول 90 يوماً من التعاون.
                </p>
              </div>
            </div>
          </Reveal>

          {/* KPI grid */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {RESULT_KPIS.map((kpi, i) => (
              <Reveal key={kpi.label} delay={i * 0.08} className="h-full">
                <div className="group h-full rounded-[24px] border border-line bg-fog p-6 shadow-card hover:shadow-card-lg hover:border-brass-500/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-night-900 text-brass-300 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brass-400 group-hover:to-brass-600 group-hover:text-night-950 group-hover:scale-110 transition-all duration-300">
                    <kpi.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <p className={`mt-5 font-display font-bold text-3xl sm:text-4xl leading-none ${kpi.accent}`}>
                    {kpi.value}
                  </p>
                  <div className="w-8 h-[2px] bg-gradient-to-l from-brass-500 to-transparent my-3 group-hover:w-14 transition-all duration-500" />
                  <p className="text-xs sm:text-[13px] font-bold text-muted-foreground leading-relaxed">
                    {kpi.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Process ============ */

const PROCESS_STEPS = [
  {
    icon: MessageCircle,
    step: "01",
    title: "استشارة مجانية",
    text: "نتعرف على نشاطك وأهدافك وجمهورك المستهدف، ونقدم لك رؤية أولية فورية دون أي التزام.",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "تشخيص وتحليل",
    text: "نفحص ملفك التجاري ومواقعك ومنافسيك بعمق لنرصد الفرص الضائعة ونبني الخطة المثالية.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "تنفيذ الخطة",
    text: "نطلق التحسينات والحملات على أرض الواقع: خرائط، إعلانات، محتوى، وتقييمات — بدقة كاملة.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "قياس وتحسين",
    text: "تقارير دورية شفافة تظهر أرقامك الحقيقية، مع تحسين مستمر يضاعف عائد استثمارك.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative scroll-mt-24 py-16 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-24 right-1/4 w-[380px] h-[380px] rounded-full bg-brass-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="رحلتنا معك"
          title="أربع خطوات نحو خريطة النجاح"
          subtitle="منهجية واضحة ومجرّبة — تعرف مسبقاً ماذا سنفعل ومتى سترى النتائج."
          index="03 — PROCESS"
        />

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] right-[12%] left-[12%] h-[2px]" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brass-500/35 to-transparent" />
            <div className="absolute inset-0 route-dash opacity-60" />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brass-500 shadow-[0_0_14px_rgba(237,155,47,0.9)]"
              animate={{ left: ["5%", "95%"], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {PROCESS_STEPS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.1}>
                <div className="group relative h-full text-center rounded-[24px] border border-line bg-white p-7 shadow-card hover:shadow-card-lg hover:border-brass-500/30 transition-all duration-300 hover:-translate-y-1.5">
                  <div className="relative w-[72px] h-[72px] mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-brass-500/10 group-hover:bg-brass-500/20 transition-colors duration-300" />
                    <div className="relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-night-900 to-night-700 text-brass-300 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:from-brass-500 group-hover:to-brass-600 group-hover:text-night-950 transition-all duration-300">
                      <p.icon className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 font-display text-[11px] font-bold bg-night-900 text-brass-300 rounded-full w-7 h-7 flex items-center justify-center border border-brass-500/40 shadow-md">
                      {p.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-night-900 mb-2.5">{p.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Stats (animated counters) ============ */

function parseStat(value: string): { prefix: string; num: number; decimals: number; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: "", num: 0, decimals: 0, suffix: value };
  const decimals = match[2].includes(".") ? 1 : 0;
  return { prefix: match[1], num: parseFloat(match[2]), decimals, suffix: match[3] };
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { prefix, num, decimals, suffix } = parseStat(value);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, num, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1] as const,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, num, decimals]);

  return (
    <span ref={ref} className="font-display">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);
  const { stats } = settings;

  return (
    <section className="relative py-16 md:py-28 bg-night-950 overflow-hidden">
      <div className="absolute inset-0 bg-night-grid opacity-40" aria-hidden="true" />
      <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-brass-500/8 blur-[170px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-night-600/30 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="أرقام تتحدث"
          title="مسيرة من النتائج والأرقام الحقيقية"
          subtitle="لا نعدك بمجرد إعلانات؛ بل نلتزم بتحقيق قفزة نوعية ملموسة في أرقام مبيعاتك وحضورك المحلي."
          light
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group relative h-full rounded-[22px] glass-dark p-6 md:p-9 text-center hover:bg-white/8 hover:border-brass-500/30 transition-all duration-300 hover:-translate-y-1.5">
                <span className="absolute top-3 left-5 font-display text-[10px] font-bold text-slate-500 select-none">
                  DALNI.0{i + 1}
                </span>
                <p className="text-3xl sm:text-4xl lg:text-[46px] font-bold leading-none text-gradient-gold">
                  <CountUp value={s.value} />
                </p>
                <div className="w-10 h-[2px] bg-gradient-to-l from-brass-500 to-transparent mx-auto my-4 group-hover:w-16 transition-all duration-500" />
                <p className="text-xs sm:text-sm font-bold text-slate-300/85">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Why choose us ============ */

const WHY_ICONS: Record<string, typeof Sparkles> = {
  Award: Sparkles,
  BarChart3: LineChart,
  Users: Target,
  Headphones: Headset,
};

export function WhyChooseUsSection() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);
  const { why_choose_us } = settings;

  return (
    <section id="why-us" className="relative scroll-mt-24 py-16 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-night-600/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-32">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold mb-5 bg-brass-500/10 text-brass-700 border border-brass-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-500 animate-pulse-soft" />
              لماذا وكالة دلّني؟
            </span>
            <h2 className="text-3xl md:text-[42px] font-black text-night-900 leading-[1.2] tracking-tight">
              شريك نجاحك الحقيقي
              <br />
              وليس مجرد <span className="text-gradient-gold">مقدم خدمة</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
              نتعامل مع كل مشروع كأنه استثمارنا الخاص — بكل شفافية، وبأعلى معايير الإتقان التقني والتسويقي.
            </p>
            <div className="mt-8">
              <WhatsAppButton serviceTitle="استشارة مجانية" variant="gold">
                احجز استشارتك المجانية
              </WhatsAppButton>
            </div>
          </Reveal>
        </div>

        {/* Feature list */}
        <div className="space-y-4 md:space-y-5">
          {(why_choose_us.length ? why_choose_us : WHY_CHOOSE_US).map((item, i) => {
            const Icon = ICON_MAP[item.icon] || WHY_ICONS[item.icon] || Sparkles;
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group flex items-start gap-5 rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-card hover:shadow-card-lg hover:border-brass-500/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="relative shrink-0">
                    <span className="absolute -top-2 -right-2 font-display text-[10px] font-bold text-brass-600 bg-brass-500/10 border border-brass-500/25 rounded-full w-6 h-6 flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-night-900 text-brass-300 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brass-400 group-hover:to-brass-600 group-hover:text-night-950 group-hover:scale-110 group-hover:shadow-[0_10px_24px_-8px_rgba(237,155,47,0.6)] transition-all duration-300">
                      <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-night-900 mb-2 group-hover:text-night-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}



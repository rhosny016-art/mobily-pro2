import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  Phone,
  Navigation,
  Clock,
  ArrowDown,
  TrendingUp,
  PhoneCall,
  Sparkles,
  Radio,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Magnetic, TiltCard } from "@/components/ui";
import { EASE_OUT_EXPO, lineReveal, staggerContainer, prefersReducedMotion } from "@/lib/motion";

const SEARCH_SUGGESTIONS = [
  "أفضل مطعم قريب مني...",
  "عيادة أسنان ممتازة قريبة...",
  "متجر ملابس بجوارى...",
  "خدمة توصيل تعمل الآن...",
  "صيدلية مفتوحة 24 ساعة...",
];

const PLATFORM_CHIPS = ["خرائط Google", "Google Ads", "TikTok", "Instagram", "Local SEO"];

const FLOAT_PINS = [
  { top: "18%", left: "12%", delay: 0 },
  { top: "30%", left: "82%", delay: 1.2 },
  { top: "64%", left: "10%", delay: 2.1 },
  { top: "74%", left: "86%", delay: 0.6 },
  { top: "12%", left: "56%", delay: 1.7 },
];

export default function Hero() {
  const [searchIndex, setSearchIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const reduced = prefersReducedMotion();

  const visualY = useTransform(scrollYProgress, [0, 0.35], [0, reduced ? 0 : 90]);
  const glowY = useTransform(scrollYProgress, [0, 0.4], [0, reduced ? 0 : -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setSearchIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <section id="hero" className="relative bg-night-950 overflow-hidden scroll-mt-24">
      {/* ===== Backdrop ===== */}
      <motion.div style={{ y: glowY }} className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-night-grid opacity-50" />
        <div className="absolute -top-40 right-[6%] w-[640px] h-[640px] rounded-full bg-brass-500/12 blur-[160px] animate-aurora" />
        <div className="absolute -bottom-48 left-[4%] w-[560px] h-[560px] rounded-full bg-night-600/40 blur-[150px] animate-aurora" style={{ animationDelay: "-6s" }} />
        <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] rounded-full bg-brass-600/8 blur-[140px]" />
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
      </motion.div>

      {/* Floating pin particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FLOAT_PINS.map((p, i) => (
          <span
            key={i}
            className="absolute"
            style={{ top: p.top, left: p.left }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-brass-400/70 animate-ping-ring"
                style={{ animationDelay: `${p.delay}s` }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brass-400/90 shadow-[0_0_12px_rgba(237,155,47,0.9)]" />
            </span>
          </span>
        ))}
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-night-950 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-8 items-center">
        {/* ===== Copy ===== */}
        <motion.div style={{ opacity: textOpacity }} className="text-right w-full order-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2.5 glass-dark text-slate-200 text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-brass-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brass-400" />
            </span>
            وكالة تسويق رقمي متكاملة — Local SEO & Ads
          </motion.div>

          <motion.h1
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-[40px] sm:text-5xl lg:text-[58px] font-black text-white leading-[1.15] tracking-tight"
          >
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineReveal} custom={0} className="block text-gradient-fog">
                نضع نشاطك التجاري
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={lineReveal} custom={1} className="block">
                على
                <span className="relative inline-block mx-2">
                  <span className="text-gradient-gold">خريطة النجاح</span>
                  <svg
                    className="absolute -bottom-2 right-0 w-full h-4 text-brass-500/70 pointer-events-none"
                    viewBox="0 0 220 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M3 9C55 4 165 3 217 9"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.1, duration: 0.8, ease: EASE_OUT_EXPO }}
                    />
                  </svg>
                </span>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mt-7 text-sm sm:text-base md:text-lg text-slate-300/85 font-medium leading-relaxed max-w-xl"
          >
            نساعد الأنشطة التجارية على تصدّر نتائج البحث المحلي وجذب عملاء حقيقيين —
            عبر خرائط Google وحملات إعلانية مدروسة على كل المنصات.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href={buildWhatsAppLink("مرحباً، أريد حجز استشارة مجانية 🙏")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-extrabold text-night-950 text-sm sm:text-base bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 shadow-[0_14px_38px_-10px_rgba(237,155,47,0.7)] hover:shadow-[0_20px_48px_-10px_rgba(237,155,47,0.9)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="shimmer absolute inset-0 pointer-events-none opacity-60" />
                <PhoneCall className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" aria-hidden="true" />
                احجز استشارتك المجانية
              </a>
            </Magnetic>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm sm:text-base glass-dark hover:bg-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              استكشف خدماتنا
              <ArrowDown className="w-4 h-4 animate-bob" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex text-brass-400" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brass-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-white">
                4.9 <span className="text-slate-400 font-medium">تقييم عملائنا</span>
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/12" aria-hidden="true" />
            <span className="text-sm font-bold text-white">
              +250 <span className="text-slate-400 font-medium">عميل سعيد</span>
            </span>
            <div className="hidden sm:block w-px h-6 bg-white/12" aria-hidden="true" />
            <span className="text-sm font-bold text-white">
              تقارير <span className="text-slate-400 font-medium">أسبوعية شفافة</span>
            </span>
          </motion.div>

          {/* Platform chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            <span className="text-[11px] font-bold text-slate-500 pl-1">نُتقن:</span>
            {PLATFORM_CHIPS.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-brass-500/40 hover:text-brass-300 transition-colors"
              >
                {p}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ===== Visual ===== */}
        <motion.div style={{ y: visualY }} className="order-2 relative flex items-center justify-center min-h-[440px] sm:min-h-[520px]">
          {/* Radar rings */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="relative w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full">
              {[0, 1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-white/6"
                  style={{ margin: `${ring * 34}px` }}
                />
              ))}
              <div
                className="radar-sweep absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(237,155,47,0.14), rgba(237,155,47,0.03) 22%, transparent 34%)",
                }}
              />
              <div className="absolute inset-0 rounded-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
                <div className="absolute top-1/2 right-0 left-0 h-px bg-white/5" />
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brass-400 shadow-[0_0_16px_rgba(237,155,47,0.9)]" />
              {/* tick marks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 w-px h-2 bg-white/8"
                  style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: "0 190px" }}
                />
              ))}
            </div>
          </div>

          {/* Route path */}
          <svg
            className="absolute inset-x-0 bottom-14 w-full h-[220px] pointer-events-none"
            viewBox="0 0 400 220"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 20 200 C 90 120, 150 90, 210 74"
              stroke="rgba(255,217,138,0.35)"
              strokeWidth="2"
              className="route-dash"
            />
            <circle cx="20" cy="200" r="5" fill="#f7b955" />
            <circle cx="20" cy="200" r="10" fill="rgba(247,185,85,0.25)" />
            <circle cx="210" cy="74" r="4" fill="#ffd98a" />
          </svg>

          {/* Floating chip: growth */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="absolute top-0 right-0 sm:top-6 sm:right-2 z-20"
          >
            <div className="animate-float-slow glass-strong rounded-2xl px-4 py-3 shadow-card flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-night-950">
                <TrendingUp className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none text-brass-300">+300%</p>
                <p className="text-[11px] font-bold text-slate-300 mt-1">نمو الظهور المحلي</p>
              </div>
            </div>
          </motion.div>

          {/* Floating chip: calls */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="absolute bottom-12 left-0 sm:bottom-16 sm:left-2 z-20"
          >
            <div
              className="animate-float-slow glass-strong rounded-2xl px-4 py-3 shadow-card flex items-center gap-3"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="w-9 h-9 rounded-xl bg-mint-500 flex items-center justify-center text-white">
                <Phone className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none text-mint-400">+500</p>
                <p className="text-[11px] font-bold text-slate-300 mt-1">مكالمة شهرياً من الخريطة</p>
              </div>
            </div>
          </motion.div>

          {/* Local pack card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[380px]"
          >
            <TiltCard>
              <div className="glass-strong rounded-[26px] p-5 sm:p-6 shadow-glass gold-ring">
                {/* Search pill */}
                <div className="flex items-center gap-2.5 bg-night-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 mb-4">
                  <Search className="w-4 h-4 text-brass-400 shrink-0" aria-hidden="true" />
                  <div className="relative h-5 overflow-hidden flex-1 flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={searchIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                        className="text-xs font-bold text-slate-300 whitespace-nowrap"
                      >
                        {SEARCH_SUGGESTIONS[searchIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Business header */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-night-950 shrink-0 shadow-[0_8px_20px_-6px_rgba(237,155,47,0.6)]">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white truncate">نشاطك التجاري هنا</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex text-brass-400" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-brass-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">4.9</span>
                      <span className="text-[11px] text-slate-500">· +250 مراجعة</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-mint-400 bg-mint-500/12 border border-mint-500/25 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse-soft" />
                      مفتوح الآن
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2.5 text-[12px] text-slate-300 font-medium">
                  <p className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    في المقدمة حيث يبحث عنك عملاؤك
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span dir="ltr">+20 155 467 1424</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    ظهور مستمر في النتائج المحلية
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <a
                    href={buildWhatsAppLink("مرحباً، أريد معرفة خطط وضع نشاطي في المقدمة 📍")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brass-600 to-brass-500 text-night-950 text-xs font-extrabold px-3 py-2.5 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                    الموقع
                  </a>
                  <a
                    href={buildWhatsAppLink("مرحباً، أريد الاتصال لحجز استشارة 🙏")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl glass-dark text-white text-xs font-extrabold px-3 py-2.5 hover:bg-white/12 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    اتصال
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-brass-300 bg-night-950/80 border border-brass-500/30 rounded-full px-3 py-1.5 backdrop-blur">
              <Radio className="w-3 h-3 animate-pulse" aria-hidden="true" />
              تحديث مباشر لنتائجك
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        aria-label="انتقل إلى الخدمات"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 text-slate-500 hover:text-brass-300 transition-colors z-10"
      >
        <span className="text-[10px] font-bold tracking-wide">اكتشف المزيد</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}

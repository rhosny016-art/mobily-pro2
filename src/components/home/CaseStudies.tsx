import { useState } from "react";
import { Link } from "react-router-dom";
import { Quote, ChevronDown, ArrowLeft, Sparkles, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import LazyImage from "@/components/LazyImage";
import { TESTIMONIALS, getInitials } from "@/lib/siteData";

/* ============ Testimonials ============ */

export function TestimonialsSection() {
  return (
    <section id="reviews" className="relative scroll-mt-24 py-16 md:py-28 bg-fog overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-brass-500/6 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-night-600/8 blur-[110px] pointer-events-none" />
      <div className="absolute inset-0 bg-fog-dots opacity-[0.3] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="قالوا عنا"
          title="قصص نجاح حقيقية لشركائنا"
          subtitle="لا توجد شهادة أفضل من نجاح عملائنا؛ إليك بعض التجارب الواقعية ممن وضعوا ثقتهم في دلّني."
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="group relative h-full rounded-[26px] border border-line bg-white p-7 shadow-card hover:shadow-card-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <span
                  className="absolute top-0 right-6 left-6 h-[3px] rounded-b-full bg-gradient-to-l from-brass-400 via-brass-500 to-brass-600 opacity-0 group-hover:opacity-100 scale-x-50 group-hover:scale-x-100 origin-right transition-all duration-500"
                  aria-hidden="true"
                />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brass-400/10 blur-2xl group-hover:bg-brass-400/20 transition-colors duration-500 pointer-events-none" />
                <Quote className="absolute top-6 left-6 w-11 h-11 text-brass-500/15 group-hover:text-brass-500/25 transition-colors" aria-hidden="true" />

                <div>
                  <div className="flex gap-1 mb-5" role="img" aria-label="تقييم 5 من 5">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} viewBox="0 0 20 20" className="w-4 h-4 fill-brass-500" aria-hidden="true">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.29 3.97a1 1 0 00.95.69h4.18c.97 0 1.37 1.24.59 1.81l-3.38 2.46a1 1 0 00-.36 1.12l1.29 3.97c.3.92-.76 1.68-1.54 1.11l-3.38-2.46a1 1 0 00-1.18 0l-3.38 2.46c-.78.57-1.84-.19-1.54-1.11l1.29-3.97a1 1 0 00-.36-1.12L2.04 9.4c-.78-.57-.38-1.81.59-1.81h4.18a1 1 0 00.95-.69l1.29-3.97z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-sm text-night-800/80 font-medium leading-loose">
                    "{t.message}"
                  </blockquote>
                </div>

                <figcaption className="flex items-center gap-3.5 mt-7 pt-6 border-t border-line">
                  <div className="relative shrink-0">
                    <span
                      className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-brass-400 to-brass-600 opacity-70"
                      aria-hidden="true"
                    />
                    {t.avatar ? (
                      <LazyImage
                        src={t.avatar}
                        alt={t.name}
                        wrapperClassName="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-night-800 to-night-950 flex items-center justify-center"
                        role="img"
                        aria-label={`صورة ${t.name}`}
                      >
                        <span className="font-display text-sm font-black text-brass-300">{getInitials(t.name)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-night-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-bold mt-1">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */

export const FAQS = [
  {
    q: "كيف تساعد وكالة دلّني النشاط التجاري على تصدر نتائج الخرائط؟",
    a: "نقوم بتهيئة وتوثيق حساب Google Business Profile بالكامل، وتحسين الكلمات المفتاحية المحلية، وإدارة التقييمات، وبناء إشارات مرجعية حقيقية تجعل نشاطك يظهر ضمن الثلاثة الكبار (Local Pack).",
  },
  {
    q: "كم من الوقت يستغرق ظهور النتائج الأولى على الخريطة؟",
    a: "تظهر التحسينات الأولية عادةً خلال أول 14 إلى 30 يوماً من بدء العمل، وتتصاعد نتائج الترتيب والمكالمات بشكل ملحوظ مع الاستمرار.",
  },
  {
    q: "هل خدماتكم تشمل الحملات الإعلانية الممولة؟",
    a: "نعم، نقدم حملات إعلانية مستهدفة ومحسّنة عبر Google Ads وMeta (Instagram & Facebook) وTikTok وSnapchat لتحقيق أعلى عائد على الاستثمار.",
  },
  {
    q: "هل الاستشارة ومراجعة الملف مجانية؟",
    a: "بالتأكيد، الاستشارة الأولى مجانية بالكامل ونقدم خلالها تقريراً شاملاً عن حالة نشاطك التجاري ونقاط القوة والفرص المتاحة.",
  },
  {
    q: "هل تكتبون مراجعات تلقائية أو زائفة؟",
    a: "لا نهتم بالحلول السريعة الخطرة. نبني سمعتك بمراجعات حقيقية من عملاء حقيقيين وردود احترافية، وفق سياسات Google، حتى يبقى ترتيبك آمناً ومستداماً.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-16 md:py-28 bg-white overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="إجابات سريعة"
          title="الأسئلة الشائعة"
          subtitle="إليك أهم الأسئلة التي يطرحها شركاؤنا قبل البدء معنا"
        />

        <div className="space-y-3.5">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={faq.q} delay={i * 0.06} y={18}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    open
                      ? "border-brass-500/40 bg-brass-500/[0.04] shadow-card"
                      : "border-line bg-fog/60 hover:border-brass-500/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 sm:py-5 text-right"
                  >
                    <span className="text-sm sm:text-base font-extrabold text-night-900 leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        open
                          ? "bg-gradient-to-br from-brass-400 to-brass-600 text-night-950 rotate-180"
                          : "bg-white border border-line text-muted-foreground"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    className={`accordion-panel ${open ? "open" : ""}`}
                    aria-hidden={!open}
                  >
                    <div>
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground font-medium leading-loose">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          عندك سؤال آخر؟{" "}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("dalni:open-chat"))}
            className="inline-flex items-center gap-1.5 font-extrabold text-brass-600 hover:text-brass-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            اسأل دَلّوب الذكي مباشرة
          </button>
        </p>
      </div>
    </section>
  );
}

/* ============ CTA ============ */

export function CTASection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-night-950">
      <div className="absolute inset-0 bg-aurora" aria-hidden="true" />
      <div className="absolute inset-0 bg-night-grid opacity-40" aria-hidden="true" />
      {/* Golden rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-brass-500/15 animate-spin-slower"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-brass-500/10 animate-spin-slow"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-brass-500/8 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-7 glass-dark text-brass-300">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            دعنا نضعك في المقدمة
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-[54px] font-black text-white leading-[1.2] tracking-tight">
            هل أنت مستعد لتحويل
            <span className="text-gradient-gold"> حضورك الرقمي</span>؟
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-slate-300/85 leading-relaxed max-w-2xl mx-auto font-medium">
            انضم إلى أكثر من 250 شريك نجاح اختاروا النمو الحقيقي والمستدام معنا.
            استشارتك الأولى ومراجعة ملفك مجانية بالكامل.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <WhatsAppButton size="lg" variant="green">
              ابدأ محادثة واستشرنا مجاناً
            </WhatsAppButton>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full glass-dark text-white px-8 py-4 text-base font-extrabold hover:bg-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              تصفح الخدمات المتكاملة
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400" />
              استشارة مجانية 100%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-400" />
              رد خلال ساعتين عمل
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400" />
              تقارير شفافة أسبوعياً
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

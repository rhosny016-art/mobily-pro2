import { useEffect, useState } from "react";
import { Eye, Heart, Target, Compass } from "lucide-react";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import LazyImage from "@/components/LazyImage";
import { DEFAULT_SETTINGS, TEAM, getInitials } from "@/lib/siteData";
import { getSiteSettings } from "@/lib/store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils/cn";

const VALUES = [
  {
    Icon: Target,
    title: "رسالتنا",
    text: "تمكين كل نشاط تجاري من الوصول لعملائه المحليين بأدوات رقمية فعالة وبتكلفة عادلة.",
  },
  {
    Icon: Eye,
    title: "رؤيتنا",
    text: "أن نكون الوكالة الأولى في المنطقة العربية في التسويق المحلي وخدمات خرائط Google.",
  },
  {
    Icon: Heart,
    title: "قيمنا",
    text: "الشفافية الكاملة، النتائج القابلة للقياس، والتعامل مع نجاح عملائنا كنجاحنا الشخصي.",
  },
];

export default function About() {
  const [s, setS] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    getSiteSettings().then(setS);
  }, []);

  const storyReveal = useInView<HTMLDivElement>({ amount: 0.2 });
  const statsReveal = useInView<HTMLDivElement>({ amount: 0.2 });

  usePageMeta({
    title: "من نحن — قصة وكالة دلّني للتسويق الرقمي",
    description:
      "تعرف على وكالة دلّني وفريقها: شغف بتحويل الأعمال التجارية إلى علامات تتصدر نتائج البحث المحلية عبر خرائط Google والإعلانات الممولة وبناء السمعة.",
    path: "/about",
  });

  const storyParagraphs = s.about_story.split("\n").filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="من نحن"
        title={
          <>
            {s.about_title.split("—")[0] || s.about_title}
            {s.about_title.includes("—") && (
              <>
                <br />
                <span className="text-gradient-gold">{s.about_title.split("—").slice(1).join("—")}</span>
              </>
            )}
          </>
        }
        subtitle={s.about_subtitle}
      />

      {/* Story + stats */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={storyReveal.ref}>
            <SectionHeading eyebrow="قصتنا" title="كيف بدأت دلّني؟" center={false} />
            <div className={cn("space-y-5 -mt-6 reveal-stagger", storyReveal.inView && "in-view")}>
              {storyParagraphs.map((p, i) => (
                <p
                  key={i}
                  style={{ "--stagger-delay": `${i * 0.08}s` } as CSSProperties}
                  className="text-foreground/75 leading-loose font-medium"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div ref={statsReveal.ref}>
            <div className={cn("grid grid-cols-2 gap-5 reveal-stagger", statsReveal.inView && "in-view")}>
              {s.stats.map((st, i) => (
                <div
                  key={st.label}
                  style={{ "--stagger-delay": `${i * 0.08}s` } as CSSProperties}
                  className={`rounded-[22px] p-6 sm:p-8 text-center shadow-card ${
                    i % 2 === 0
                      ? "bg-night-950 text-white relative overflow-hidden"
                      : "bg-fog border border-line"
                  }`}
                >
                  {i % 2 === 0 && (
                    <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-brass-500/15 blur-2xl" aria-hidden="true" />
                  )}
                  <p className={`font-display font-bold text-3xl sm:text-4xl ${i % 2 === 0 ? "text-gradient-gold" : "text-night-900"}`}>
                    {st.value}
                  </p>
                  <p className={`mt-2 text-sm font-bold ${i % 2 === 0 ? "text-slate-300/85" : "text-muted-foreground"}`}>
                    {st.label}
                  </p>
                </div>
              ))}
              <div
                style={{ "--stagger-delay": `${s.stats.length * 0.08}s` } as CSSProperties}
                className="col-span-2 rounded-[22px] border border-brass-500/25 bg-brass-500/5 p-5 sm:p-6 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-night-950 shrink-0">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-bold text-night-800 leading-relaxed">
                  كل خطوة نخطوها معك تبدأ من خريطة واضحة — هدف محدد، خطة مدروسة، ونتائج مقاسة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-fog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="ما يحركنا" title="رسالتنا ورؤيتنا وقيمنا" />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="group h-full rounded-[26px] border border-line bg-white p-8 text-center shadow-card hover:shadow-card-lg hover:-translate-y-1.5 hover:border-brass-500/30 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-night-900 text-brass-300 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-brass-400 group-hover:to-brass-600 group-hover:text-night-950 group-hover:scale-110 transition-all duration-300">
                    <v.Icon className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-extrabold text-night-900 mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="فريقنا"
            title="العقول وراء دلّني"
            subtitle="فريق شغوف يجمع الخبرة التسويقية بالفهم العميق للسوق المحلي."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="text-center group">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brass-400 to-brass-600 opacity-0 group-hover:opacity-100 blur-md scale-105 transition-opacity duration-300" aria-hidden="true" />
                    <div className="relative h-full">
                      {m.avatar ? (
                        <LazyImage
                          src={m.avatar}
                          alt={m.name}
                          wrapperClassName="w-full h-full rounded-full border-4 border-white ring-2 ring-line overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full border-4 border-white ring-2 ring-line bg-gradient-to-br from-night-800 to-night-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-card"
                          role="img"
                          aria-label={`صورة ${m.name}`}
                        >
                          <span className="font-display text-2xl font-black text-brass-300">{getInitials(m.name)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-extrabold text-night-900">{m.name}</h3>
                  <p className="text-sm text-muted-foreground font-bold mt-1">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-night-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-night-grid opacity-40" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-brass-500/10 blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              لنكتب <span className="text-gradient-gold">قصة نجاحك</span> معاً
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-slate-300/85 font-medium">تواصل معنا اليوم — الاستشارة الأولى مجانية بالكامل.</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9">
              <WhatsAppButton size="lg" variant="green">
                تواصل معنا الآن
              </WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { Check, Star, Send } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import { getServices } from "@/lib/store";
import { SERVICES as DEFAULT_SERVICES } from "@/lib/siteData";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Services() {
  const [services, setServices] = useState(DEFAULT_SERVICES.filter((s) => s.visible !== false));
  useEffect(() => {
    getServices().then((list) => setServices(list.filter((s) => s.visible !== false)));
  }, []);

  usePageMeta({
    title: "خدمات التسويق الرقمي — خرائط Google، إعلانات ممولة، تقييمات",
    description:
      "تعرف على خدمات وكالة دلّني: تصدر خرائط Google والظهور المحلي، إدارة حملات Google Ads وTikTok وMeta وSnapchat الممولة، وبناء سمعة قوية عبر إدارة التقييمات والمراجعات.",
    path: "/services",
    type: "website",
  });

  return (
    <>
      <PageHero
        eyebrow="خدماتنا الشاملة"
        title={
          <>
            حلول تسويق رقمي متكاملة
            <br />
            <span className="text-gradient-gold">لنجاح نشاطك</span>
          </>
        }
        subtitle="اختر الخدمة المناسبة لنشاطك — أو تواصل معنا لنساعدك في اختيار المسار الأمثل."
      />

      {/* Services grid */}
      <section className="py-14 md:py-20 bg-fog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="py-14 md:py-24 bg-white border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
          {services.map((s, i) => (
            <div
              key={s.id}
              id={`service-${s.id}`}
              className="max-w-4xl mx-auto scroll-mt-28"
            >
              <Reveal>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-sm font-bold text-brass-600 bg-brass-500/10 border border-brass-500/25 rounded-xl px-3 py-1.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-night-900 leading-snug">
                    {s.title}
                  </h2>
                </div>

                <p className="text-muted-foreground font-medium leading-loose mb-7">{s.description}</p>

                <h3 className="text-sm font-extrabold text-night-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-brass-400 to-brass-600" />
                  ماذا نقدم لك
                </h3>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-7">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm font-semibold text-night-800/85">
                      <span className="w-5 h-5 rounded-full bg-mint-500/12 text-mint-600 flex items-center justify-center shrink-0 mt-px">
                        <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-sm font-extrabold text-night-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-brass-400 to-brass-600" />
                  النتائج المتوقعة
                </h3>
                <ul className="space-y-2.5 mb-7">
                  {s.results.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm font-semibold text-night-800/85">
                      <Star className="w-4 h-4 text-brass-500 fill-brass-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>

                {s.platforms && (
                  <>
                    <h3 className="text-sm font-extrabold text-night-900 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-brass-400 to-brass-600" />
                      المنصات المتاحة
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-7">
                      {s.platforms.map((p) => (
                        <span
                          key={p}
                          className="px-3.5 py-1.5 rounded-full bg-night-900 text-brass-300 text-xs font-bold border border-night-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <WhatsAppButton serviceTitle={s.title} size="md">
                    اطلب هذه الخدمة عبر واتساب
                  </WhatsAppButton>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / custom offer */}
      <section id="contact" className="py-14 md:py-24 bg-fog border-t border-line scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 glass-dark text-brass-300">
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                ابدأ الآن
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-night-900 leading-tight">
                اطلب عرضاً مخصصاً لنشاطك
              </h2>
              <p className="mt-4 text-muted-foreground font-medium leading-relaxed max-w-xl mx-auto">
                أخبرنا باحتياجك وسيتواصل معك فريقنا خلال أقل من ساعتين عمل — الاستشارة الأولى مجانية بالكامل.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

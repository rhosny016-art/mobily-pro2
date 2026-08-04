import { lazy, Suspense } from "react";
import Hero from "@/components/home/Hero";
import {
  PlatformStrip,
  ServicesSection,
  ResultsShowcaseSection,
  ProcessSection,
  StatsSection,
  WhyChooseUsSection,
} from "@/components/home/Sections";
import { TestimonialsSection, FAQSection, CTASection, FAQS } from "@/components/home/CaseStudies";
import LoadingFallback from "@/components/LoadingFallback";
import { usePageMeta, useJsonLd } from "@/hooks/usePageMeta";
import { SITE_DESCRIPTION } from "@/lib/config";

const InteractiveAgencyMap = lazy(() => import("@/components/home/InteractiveAgencyMap"));

export default function Home() {
  usePageMeta({
    title: "دلّني | وكالة تسويق رقمي متكاملة — خرائط Google والحملات الإعلانية",
    description: SITE_DESCRIPTION,
    path: "/",
  });

  useJsonLd("schema-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <>
      <Hero />
      <PlatformStrip />
      <ServicesSection />
      <ResultsShowcaseSection />
      <ProcessSection />
      <StatsSection />
      <WhyChooseUsSection />
      <Suspense fallback={<LoadingFallback message="جاري تشغيل شبكة التغطية..." fullScreen={false} />}>
        <InteractiveAgencyMap />
      </Suspense>
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

import { lazy, Suspense } from "react";
import Hero from "@/components/home/Hero";
import { PlatformStrip, ServicesSection, ResultsShowcaseSection, ProcessSection, StatsSection, WhyChooseUsSection } from "@/components/home/Sections";
import { TestimonialsSection, FAQSection, CTASection, FAQS } from "@/components/home/CaseStudies";
import LoadingFallback from "@/components/LoadingFallback";

const InteractiveAgencyMap = lazy(() => import("@/components/home/InteractiveAgencyMap"));

export default function HomeContent() {
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

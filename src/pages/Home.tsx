import { lazy, Suspense } from "react";
import { usePageMeta, useJsonLd } from "@/hooks/usePageMeta";
import { SITE_DESCRIPTION } from "@/lib/config";

const HomeContent = lazy(() => import("@/components/home/HomeContent"));

export default function Home() {
  usePageMeta({
    title: "دلّني | وكالة تسويق رقمي متكاملة — خرائط Google والحملات الإعلانية",
    description: SITE_DESCRIPTION,
    path: "/",
  });

  useJsonLd("schema-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [],
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <HomeContent />
    </Suspense>
  );
}

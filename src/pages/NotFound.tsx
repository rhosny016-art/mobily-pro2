import { Link } from "react-router-dom";
import { MapPin, Home, Compass } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotFound() {
  usePageMeta({
    title: "404 — الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير موجودة. عد إلى الرئيسية أو استكشف خدماتنا.",
    path: "/404",
  });
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-28 bg-night-950 overflow-hidden">
      <div className="absolute inset-0 bg-night-grid opacity-40" aria-hidden="true" />
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] rounded-full bg-brass-500/10 blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-night-600/30 blur-[130px] pointer-events-none" aria-hidden="true" />

      <div className="relative w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brass-400 to-brass-600 text-night-950 shadow-glow-gold mb-8">
          <MapPin className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="font-display text-sm font-bold tracking-[0.3em] text-brass-400">404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
          يبدو أنك ضللت الطريق!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-slate-300/80 sm:text-base font-medium">
          الصفحة التي تبحث عنها غير موجودة حالياً، لكن لا تقلق — نحن خبراء في وضع الأشياء على الخريطة
          وإعادة العملاء إلى المسار الصحيح.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 px-7 py-3.5 font-extrabold text-night-950 shadow-glow-gold transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="w-4.5 h-4.5" aria-hidden="true" />
            العودة للرئيسية
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full glass-dark px-7 py-3.5 font-bold text-white hover:bg-white/10 hover:border-white/25 transition-all"
          >
            <Compass className="w-4.5 h-4.5" aria-hidden="true" />
            استكشف خدماتنا
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, PhoneCall, MapPin, Clock } from "lucide-react";
import Logo from "./Logo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/utils/cn";
import { EASE_OUT_EXPO, prefersReducedMotion } from "@/lib/motion";

const SECTION_LINKS = [
  { href: "#services", label: "خدماتنا", id: "services" },
  { href: "#process", label: "كيف نعمل", id: "process" },
  { href: "#why-us", label: "لماذا نحن", id: "why-us" },
  { href: "#network", label: "شبكتنا", id: "network" },
  { href: "#reviews", label: "آراء العملاء", id: "reviews" },
  { href: "#faq", label: "الأسئلة الشائعة", id: "faq" },
];

const PAGE_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "خدماتنا" },
  { to: "/about", label: "من نحن" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const ids = SECTION_LINKS.map((l) => l.id);
        let current = "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 170) current = id;
        }
        setActiveSection(current);
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4 pointer-events-none"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto w-full max-w-6xl rounded-full border transition-all duration-300",
          scrolled || open
            ? "bg-night-900/80 backdrop-blur-xl border-white/10 shadow-[0_14px_44px_-14px_rgba(3,6,13,0.85)]"
            : "bg-night-900/35 backdrop-blur-md border-white/8"
        )}
      >
        <div className="flex h-14 md:h-16 items-center justify-between gap-2 px-3 sm:px-5">
          <Link to="/" aria-label="دلّني - الرئيسية" className="shrink-0">
            <Logo animated={!scrolled} light size={32} />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="التنقل الرئيسي">
            {(isHome ? SECTION_LINKS : PAGE_LINKS).map((l) => {
              const isActive = "id" in l ? l.id === activeSection : pathname === l.to;
              const inner = (
                <span
                  className={cn(
                    "relative inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200",
                    isActive ? "text-brass-300" : "text-slate-300/90 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                      className="absolute inset-0 rounded-full bg-white/8 border border-white/10"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </span>
              );

              return "href" in l ? (
                <a key={l.href} href={l.href} onClick={(e) => handleSectionClick(e, l.href)}>
                  {inner}
                </a>
              ) : (
                <Link key={(l as { to: string }).to} to={(l as { to: string }).to}>
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            <a
              href="tel:+201554671424"
              dir="ltr"
              className="hidden xl:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all"
            >
              <PhoneCall className="w-4 h-4 text-brass-400" aria-hidden="true" />
              +20 155 467 1424
            </a>
            <a
              href={buildWhatsAppLink("مرحباً، أريد حجز استشارة مجانية 🙏")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold text-night-950 bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 shadow-[0_8px_24px_-8px_rgba(237,155,47,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(237,155,47,0.9)] active:translate-y-0"
            >
              <PhoneCall className="w-4 h-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
              استشارة مجانية
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:bg-white/12 active:bg-white/18"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="flex"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="flex"
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-night-950/70 backdrop-blur-sm lg:hidden pointer-events-auto"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed top-0 right-0 z-50 flex h-dvh w-[86vw] max-w-[340px] flex-col bg-night-900 border-l border-white/8 lg:hidden pointer-events-auto overflow-hidden"
            >
              <div className="absolute -top-24 -left-16 w-56 h-56 rounded-full bg-brass-500/12 blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 relative">
                <Logo animated={false} light size={30} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white hover:bg-white/8"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5" aria-label="قائمة الجوال">
                {(isHome ? SECTION_LINKS : PAGE_LINKS).map((l, i) =>
                  "href" in l ? (
                    <motion.a
                      key={l.href}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE_OUT_EXPO }}
                      href={l.href}
                      onClick={(e) => handleSectionClick(e, l.href)}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-bold transition hover:bg-white/6 hover:text-white",
                        l.id === activeSection ? "text-brass-300" : "text-slate-200"
                      )}
                    >
                      <span>{l.label}</span>
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          l.id === activeSection ? "bg-brass-400" : "bg-white/10 group-hover:bg-brass-500/60"
                        )}
                      />
                    </motion.a>
                  ) : (
                    <motion.div
                      key={(l as { to: string }).to}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE_OUT_EXPO }}
                    >
                      <Link
                        to={(l as { to: string }).to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-bold text-slate-200 transition hover:bg-white/6 hover:text-white"
                      >
                        <span>{l.label}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </Link>
                    </motion.div>
                  )
                )}
              </nav>

              <div className="px-4 pb-5 border-t border-white/8 space-y-3 relative">
                <a
                  href={buildWhatsAppLink("مرحباً، أريد حجز استشارة مجانية 🙏")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 px-4 py-3.5 text-sm font-extrabold text-night-950 shadow-[0_10px_30px_-8px_rgba(237,155,47,0.7)] active:scale-[0.98] transition-transform"
                >
                  <PhoneCall className="w-4 h-4" aria-hidden="true" />
                  استشارة مجانية عبر واتساب
                </a>
                <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brass-400" aria-hidden="true" />
                    السبت - الخميس
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brass-400" aria-hidden="true" />
                    مصر والخليج
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

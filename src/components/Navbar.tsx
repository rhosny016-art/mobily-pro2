import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, PhoneCall, MapPin, Clock } from "lucide-react";
import Logo from "./Logo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/utils/cn";
import { prefersReducedMotion } from "@/lib/motion";

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

const DRAWER_EXIT_MS = 250;

type NavLink =
  | { href: string; label: string; id: string }
  | { to: string; label: string };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const exitTimer = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

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
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, [open]);

  // Move focus into the drawer when it opens; restore it to the toggle when it fully closes.
  useEffect(() => {
    if (open) {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [open]);

  // Escape closes the drawer; Tab is trapped inside while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;
      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusables = Array.from(
        drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || (active && !drawer.contains(active)))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || (active && !drawer.contains(active)))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closing]);

  const closeDrawer = () => {
    if (closing) return;
    setClosing(true);
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, DRAWER_EXIT_MS);
  };

  const toggleDrawer = () => {
    if (open) {
      closeDrawer();
    } else {
      setOpen(true);
      setClosing(false);
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    closeDrawer();
  };

  const renderNavLink = (l: NavLink, i: number) => {
    const isSection = "href" in l;
    return (
      <div
        key={isSection ? l.href : (l as { to: string }).to}
        className="fade-x-in"
        style={{ animationDelay: `${0.05 + i * 0.05}s` }}
      >
        {isSection ? (
          <a
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
          </a>
        ) : (
          <Link
            to={(l as { to: string }).to}
            onClick={closeDrawer}
            className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-bold text-slate-200 transition hover:bg-white/6 hover:text-white"
          >
            <span>{l.label}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </Link>
        )}
      </div>
    );
  };

  return (
    <header className="fade-down fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4 pointer-events-none">
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
                    <span className="swap-in absolute inset-0 rounded-full bg-white/8 border border-white/10" />
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
            ref={toggleRef}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:bg-white/12 active:bg-white/18"
            onClick={toggleDrawer}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            <span key={open ? "close" : "menu"} className="swap-in flex">
              {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 z-40 bg-night-950/70 backdrop-blur-sm lg:hidden pointer-events-auto ${
              closing ? "backdrop-out pointer-events-none" : "backdrop-in"
            }`}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            className={`fixed top-0 right-0 z-50 flex h-dvh w-[86vw] max-w-[340px] flex-col bg-night-900 border-l border-white/8 lg:hidden pointer-events-auto overflow-hidden ${
              closing ? "drawer-out pointer-events-none" : "drawer-in"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
          >
            <div className="absolute -top-24 -left-16 w-56 h-56 rounded-full bg-brass-500/12 blur-[100px] pointer-events-none" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 relative">
              <Logo animated={false} light size={30} />
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white hover:bg-white/8"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5" aria-label="قائمة الجوال">
              {(isHome ? SECTION_LINKS : PAGE_LINKS).map((l, i) => renderNavLink(l, i))}
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
          </div>
        </>
      )}
    </header>
  );
}

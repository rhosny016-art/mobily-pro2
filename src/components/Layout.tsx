import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { trackVisit } from "@/lib/store";

const ChatWidget = lazy(() => import("./ChatWidget"));
const BackToTop = lazy(() => import("./BackToTop"));

export default function Layout() {
  const { pathname } = useLocation();

  const [loadChat, setLoadChat] = useState(false);

  useEffect(() => {
    // Load chat widget during idle time, but immediately if an external
    // request to open chat is dispatched (ensures click-to-open works).
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: any) => number };
    const onOpen = () => setLoadChat(true);
    window.addEventListener("dalni:open-chat", onOpen);

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setLoadChat(true), { timeout: 3000 });
      return () => {
        window.removeEventListener("dalni:open-chat", onOpen);
        (w as any).cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(() => setLoadChat(true), 2000);
    return () => {
      window.removeEventListener("dalni:open-chat", onOpen);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    trackVisit(pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-fog">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:rounded-full focus:bg-night-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
      >
        الانتقال إلى المحتوى
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Suspense fallback={null}>
        {loadChat ? <ChatWidget /> : null}
        <BackToTop />
      </Suspense>
    </div>
  );
}

import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingFallback from "@/components/LoadingFallback";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CursorGlow from "@/components/ui/CursorGlow";
import Preloader from "@/components/ui/Preloader";

// Lazy-load client pages
const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Lazy-load dashboard pages
const DashboardLogin = lazy(() => import("@/pages/dashboard/Login"));
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardStats = lazy(() => import("@/pages/dashboard/Stats"));
const DashboardServices = lazy(() => import("@/pages/dashboard/Services"));
const DashboardRequests = lazy(() => import("@/pages/dashboard/Requests"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/Settings"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <ScrollProgress />
      <CursorGlow />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardStats />} />
            <Route path="services" element={<DashboardServices />} />
            <Route path="requests" element={<DashboardRequests />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

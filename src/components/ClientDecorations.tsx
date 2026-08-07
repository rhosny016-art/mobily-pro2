import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";

const Preloader = lazy(() => import("@/components/ui/Preloader"));
const ScrollProgress = lazy(() => import("@/components/ui/ScrollProgress"));
const CursorGlow = lazy(() => import("@/components/ui/CursorGlow"));

export default function ClientDecorations() {
  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>
        <Preloader />
        <ScrollProgress />
        <CursorGlow />
      </Suspense>
    </MotionConfig>
  );
}

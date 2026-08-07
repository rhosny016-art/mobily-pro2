import { useState, useEffect, useRef } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallbackSrc?: string;
}

export default function LazyImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  wrapperClassName = "relative overflow-hidden w-full h-full rounded-2xl bg-slate-100",
  fallbackSrc,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  const currentSrc = hasError && fallbackSrc ? fallbackSrc : src;

  useEffect(() => {
    // If IntersectionObserver is not supported, load immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Preload 200px before coming into viewport for smooth scrolling
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={wrapperClassName} ref={imgRef}>
      {/* Skeleton shimmer placeholder implemented with CSS to avoid framer-motion */}
      {!isLoaded && !hasError && <div className="absolute inset-0 z-10 shimmer bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" style={{ backgroundSize: "200% 100%" }} />}

      {/* Actual Image — prefer AVIF/WebP variants when available under /_optimized */}
      {isInView && (
        <picture>
          {/** AVIF source */}
          <source
            type="image/avif"
            srcSet={(() => {
              try {
                const base = src.replace(/\.[^/.]+$/, "");
                return [360,640,960,1280,1920].map(s => `/ _optimized/${base.split('/').pop()}-${s}.avif`.replace('/ _optimized','/_optimized')).join(', ');
              } catch { return undefined; }
            })()}
          />
          {/** WebP source */}
          <source
            type="image/webp"
            srcSet={(() => {
              try {
                const base = src.replace(/\.[^/.]+$/, "");
                return [360,640,960,1280,1920].map(s => `/ _optimized/${base.split('/').pop()}-${s}.webp`.replace('/ _optimized','/_optimized')).join(', ');
              } catch { return undefined; }
            })()}
          />
          <img
            src={currentSrc}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              setHasError(true);
              setIsLoaded(true);
              if (onError) onError(e);
            }}
            className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            {...props}
          />
        </picture>
      )}
    </div>
  );
}


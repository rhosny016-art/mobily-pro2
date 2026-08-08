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
      {/* Skeleton Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 skeleton-shimmer" aria-hidden="true" />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            setHasError(true);
            setIsLoaded(true);
            if (onError) onError(e);
          }}
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
}

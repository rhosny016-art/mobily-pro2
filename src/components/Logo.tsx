import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  animated?: boolean;
  light?: boolean;
}

export default function Logo({ size = 36, animated = true, light = false }: LogoProps) {
  return (
    <motion.div
      className="flex items-center gap-2.5 select-none cursor-pointer group shrink-0"
      initial={animated ? { opacity: 0, x: 10 } : false}
      animate={{ opacity: 1, x: 0 }}
      whileHover="hover"
      dir="rtl"
      aria-label="دلّني"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={size}
          height={size * 1.12}
          viewBox="0 0 54 60"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="pinBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1b2d52" />
              <stop offset="50%" stopColor="#0b1428" />
              <stop offset="100%" stopColor="#04070e" />
            </linearGradient>
            <linearGradient id="pinHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd98a" />
              <stop offset="55%" stopColor="#f7b955" />
              <stop offset="100%" stopColor="#d97f14" />
            </linearGradient>
            <filter id="shadowPin" x="-20%" y="-10%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.4" floodColor="#04070e" />
            </filter>
          </defs>

          {/* Halo ring */}
          <circle cx="27" cy="30" r="24" stroke="url(#pinHaloGrad)" strokeOpacity="0.25" strokeWidth="1" />

          {/* Pin body */}
          <path
            d="M 27 4 C 14.3 4 4 14.3 4 27 C 4 39.5 18.5 52 27 58 C 35.5 52 50 39.5 50 27 C 50 14.3 39.7 4 27 4 Z"
            fill="url(#pinBodyGrad)"
            filter="url(#shadowPin)"
            stroke="rgba(255,217,138,0.35)"
            strokeWidth="1"
          />

          {/* Globe mesh */}
          <path d="M 12 18 C 20 27, 34 27, 42 18" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" fill="none" />
          <path d="M 8 27 C 18 38, 36 38, 46 27" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" fill="none" />
          <path d="M 15 37 C 21 44, 33 44, 39 37" stroke="rgba(255,255,255,0.16)" strokeWidth="1" fill="none" />
          <path d="M 27 4 C 18 20, 18 38, 27 58" stroke="rgba(255,255,255,0.2)" strokeWidth="1.1" fill="none" />
          <path d="M 27 4 C 36 20, 36 38, 27 58" stroke="rgba(255,255,255,0.2)" strokeWidth="1.1" fill="none" />

          {/* Brass shoulder dot */}
          <circle cx="10" cy="15" r="4.5" fill="url(#pinHaloGrad)" />

          {/* Growth arrow */}
          <motion.g
            variants={{ hover: { x: 2, y: -2, transition: { duration: 0.25 } } }}
          >
            <path d="M 14 44 L 45 11" stroke="url(#pinHaloGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 11 47 L 38 18" stroke="url(#pinHaloGrad)" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            <path d="M 33 11 L 46 10 L 45 23 L 40 17 Z" fill="url(#pinHaloGrad)" />
          </motion.g>

          {/* Compass tip */}
          <path d="M 27 47 L 23 53 L 27 51 L 31 53 Z" fill="#ffd98a" />
        </svg>
      </div>

      <div className="flex flex-col text-right">
        <span
          className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none ${
            light ? "text-white" : "text-night-900 group-hover:text-night-600"
          }`}
          style={{ fontFamily: "Alexandria, sans-serif" }}
        >
          دلّني
        </span>
        {!light && (
          <span className="mt-1 text-[9px] font-semibold tracking-[0.22em] text-muted-foreground" dir="ltr">
            DALNI · DIGITAL
          </span>
        )}
      </div>
    </motion.div>
  );
}

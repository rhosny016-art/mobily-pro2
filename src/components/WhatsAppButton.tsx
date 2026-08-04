import { whatsappServiceLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";
import type { ReactNode } from "react";

interface Props {
  serviceTitle?: string;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "green";
}

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variants = {
  gold: "bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 text-night-950 shadow-[0_10px_28px_-8px_rgba(237,155,47,0.65)] hover:shadow-[0_16px_38px_-8px_rgba(237,155,47,0.8)]",
  green: "bg-gradient-to-l from-mint-600 to-mint-500 text-white shadow-[0_10px_28px_-8px_rgba(16,185,129,0.6)] hover:shadow-[0_16px_38px_-8px_rgba(16,185,129,0.75)]",
};

export default function WhatsAppButton({
  serviceTitle,
  children = "اطلب الخدمة",
  className = "",
  size = "md",
  variant = "gold",
}: Props) {
  return (
    <a
      href={whatsappServiceLink(serviceTitle)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center justify-center gap-2.5 rounded-full font-extrabold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] overflow-hidden ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <WhatsAppIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      {children}
    </a>
  );
}

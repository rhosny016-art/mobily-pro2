// Central site configuration.
// SITE_URL is used as the base for canonical URLs and social sharing.
// At runtime it resolves to the real deployment origin so canonical tags
// always match the domain visitors are on (dev, preview, or production).

export function siteUrl(path = "/"): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://dalni.agency";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export const SITE_NAME = "دلّني";

export const SITE_TAGLINE = "وكالة تسويق رقمي متكاملة";

export const SITE_DESCRIPTION =
  "دلّني — وكالة تسويق رقمي متكاملة تضع نشاطك التجاري على خريطة النجاح: إنشاء وتحسين خرائط Google (Local SEO)، إدارة حملات Google Ads وTikTok وInstagram وSnapchat، وبناء سمعة قوية عبر التقييمات والمراجعات.";

export const SOCIAL_IMAGE = "/og-image.png";

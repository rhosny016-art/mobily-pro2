// Central site configuration. Canonical and social URLs deliberately use the
// production origin so preview deployments never compete with the live site.
export function normalizeSiteOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

const configuredSiteOrigin =
  typeof import.meta.env !== "undefined" ? import.meta.env.VITE_SITE_URL : undefined;

export const SITE_ORIGIN = normalizeSiteOrigin(
  configuredSiteOrigin || "https://dalni-agency.vercel.app",
);

export function absoluteSiteUrl(path = "/", origin = SITE_ORIGIN): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteOrigin(origin)}${cleanPath}`;
}

/** @deprecated Use absoluteSiteUrl for new metadata code. */
export const siteUrl = absoluteSiteUrl;

export const SITE_NAME = "دلّني";

export const SITE_TAGLINE = "وكالة تسويق رقمي متكاملة";

export const SITE_DESCRIPTION =
  "دلّني — وكالة تسويق رقمي متكاملة تضع نشاطك التجاري على خريطة النجاح: إنشاء وتحسين خرائط Google (Local SEO)، إدارة حملات Google Ads وTikTok وInstagram وSnapchat، وبناء سمعة قوية عبر التقييمات والمراجعات.";

export const SOCIAL_IMAGE = "/og-image.png";

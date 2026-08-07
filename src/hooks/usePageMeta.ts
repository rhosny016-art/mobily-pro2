import { useEffect } from "react";
import { siteUrl, SOCIAL_IMAGE, SITE_NAME } from "@/lib/config";

interface PageMeta {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Injects JSON-LD structured data for the current page. */
export function useJsonLd(id: string, data: unknown) {
  useEffect(() => {
    upsertJsonLd(id, data);
  }, [id, data]);
}

/**
 * Sets per-page document title, meta description, canonical URL,
 * Open Graph / Twitter tags, and optional JSON-LD structured data.
 */
export function usePageMeta({
  title,
  description,
  path = "/",
  image = SOCIAL_IMAGE,
  type = "website",
  noindex = false,
}: PageMeta) {
  useEffect(() => {
    const url = siteUrl(path);
    const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
    const ogImage = siteUrl(image);

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);

    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
  }, [title, description, path, image, type]);
}

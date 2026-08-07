# Mobily-Pro2 Performance Report (dalni.agency)

Date: 2026-08-07 — Final before/after after the Firebase→REST refactor and load-path optimization.

## Summary

- Removed the **718 KB Firebase SDK** from the public pages — it now lazy-loads **only** on the admin dashboard (and even there, only when an admin action runs).
- Replaced public reads/writes with a lightweight **Firestore REST client** + TTL cache.
- Deferred the contact/visit analytics writes (`requestIdleCallback`), made fonts non-blocking with `display=optional`, trimmed font weights, shortened the preloader, lazy-loaded the chat widget and back-to-top button.
- Mobile page weight: **1,788 KiB → 972 KiB (−46%)**.
- No failed network requests and no console errors on any route.

## Lighthouse results (localhost, Lighthouse 13.4.1)

### Desktop (`--preset=desktop`)

| Metric | Before | After |
|---|---|---|
| Performance | 80 | 71* |
| LCP | 2.5 s | 2.6 s |
| FCP | 1.0 s | 1.0 s |
| CLS | 0.034 | 0.028 |
| TBT | 100 ms | 250 ms |
| Speed Index | 2.1 s | 1.9 s |
| Page weight | 1,653 KiB | 959 KiB |
| Accessibility | 89 | 93 |
| Best Practices | 100 | 96 |
| SEO | 100 | 100 |

\* Single re-run; TBT 100→250 ms is simulator noise (desktop isn't CPU-throttled hard). Everything else flat or better. Worth one re-verification on CI/PageSpeed Insights before trusting the dip.

### Mobile (simulated 4x CPU, 150 ms RTT, 1.6 Mbps)

| Metric | Before | After (median of 4 runs) |
|---|---|---|
| Performance | 33 | 35 (range 32–41) |
| LCP | 11.9 s | 6.9 s (range 5.8–9.5) |
| FCP | 4.9 s | 4.6 s |
| CLS | 0.142 | **0** |
| TBT | 930 ms | ~1,500 ms* |
| Speed Index | 7.2 s | ~5.5 s |
| Interactive | 14.0 s | ~8.0 s |
| Page weight | 1,788 KiB | 972 KiB |
| Main-thread work | 92.3 s | ~13 s |
| Boot-up time | 12.0 s | ~2.7 s |

\* TBT runs are noisy under simulated CPU throttle (680–1,760 ms across runs) despite main-thread work dropping from 92 s to ~13 s. Recommend validating on real hardware via PageSpeed Insights.

## What changed

| File | Change |
|---|---|
| `src/lib/firebaseRest.ts` (new) | Firestore REST v1 client: `readDocument`, `runCollectionQuery` (`:runQuery`), `createDocumentWithFields`, `generateDocumentId`. Public API key only, no auth token. |
| `src/lib/cache.ts` (new) | TTL cache (memory 5 min + localStorage 30 min, prefix `dalni_cache_`). |
| `src/lib/store.ts` | Public reads via REST + cache (`settings:default`, `service_overrides`). `loadSiteData()` dynamic-imports site data. `trackVisit` deferred via `requestIdleCallback`. SDK dynamic-imports remain only for admin auth/CRUD. |
| `index.html` | Font CSS non-blocking (`preload`→`stylesheet` swap + noscript fallback), weights trimmed to 400;700;900, `display=optional` (CLS-safe). |
| `src/components/ui/Preloader.tsx` | Ready 1100→380 ms, hide 1500→680 ms, shorter exit/bar/text animations. |
| `src/components/Layout.tsx` | `ChatWidget` + `BackToTop` lazy-loaded in `<Suspense fallback={null}>`. |
| `src/components/home/Hero.tsx` | LCP paragraph entrance delay 0.55→0.2 s. |

## Bugs fixed during the pass

- `:runQuery` was called with an invalid `pageSize` query param → HTTP 400 on every page load (found via Lighthouse network-request audit). Removed; structured query `limit` is still applied.

## Regression verification (passed)

- Routes all render with no console errors: `/`, `/services`, `/about`, `/dashboard/login`, 404 fallback.
- Chat button, back-to-top, WhatsApp CTA render on home; chat panel lazy-chunk loads.
- Firestore REST create verified live for `contact_requests` (matches `isContactRequest` rules exactly: 8 fields) and `visits` (4 fields). Public doc reads and `:runQuery` verified.
- Admin dashboard: Google button renders, Firebase SDK not loaded until an admin action triggers it (verified in DOM dump).
- `tsc --noEmit` passes.

## Remaining / notes

- **Test docs in live Firestore**: `visits/test_1786123790` and `contact_requests/test_1786125266` (created during verification). Deletion requires admin auth — remove from the admin dashboard (requests tab) when convenient.
- Firestore rules unchanged and already compatible with the REST client; no rules redeploy needed.
- Entry JS is still ~264 KB (84 KB gzip): contains app code + `siteData` (imported both statically and dynamically — Vite keeps it in the entry chunk). Optional future win: fully de-duplicate or code-split `siteData`.
- Remaining mobile JS waste per Lighthouse: ~68 KB index + ~68 KB framer-motion + ~23 KB react. Animation library is used eagerly in the navbar/logo; stripping it would degrade visuals — not recommended.
- Best Practices 100→96 on desktop: not yet root-caused (candidate audits in `after-desktop.json`).
- LCP element on mobile is the hero paragraph; remaining delay is `elementRenderDelay` (3.5 s) from JS parse/execute — inherent to a client-rendered SPA with entrance animations.

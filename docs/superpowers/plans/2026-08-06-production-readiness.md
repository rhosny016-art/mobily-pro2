# Dalni Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, accessible, search-ready Arabic agency site with hardened public data flows and verified production behavior.

**Architecture:** Keep the React/Vite SPA and Firebase dashboard boundaries. Move URL and form-validation policy into pure utilities for test coverage, preserve lazy public routes, and use Firestore rules as the final authorization boundary.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS 4, Firebase Auth/Firestore, Express 5, Playwright Core, Vitest.

## Global Constraints

- Preserve Arabic-first RTL content and do not add unverified business claims.
- Use `VITE_SITE_URL` as the single production URL configuration point.
- Dashboard paths remain `noindex`; PII remains readable only by verified allow-listed admins.
- Implement behavior changes test-first and retain passing unit, type, build, and browser QA checks.
- Never commit a `.env` file or credential.

---

### Task 1: Establish deterministic quality checks

**Files:** `package.json`, `vitest.config.ts`, `src/lib/config.test.ts`, `src/lib/contactValidation.test.ts`, `src/lib/contactValidation.ts`, `src/components/ContactForm.tsx`

- [ ] Add Vitest and an `npm run test` script.
- [ ] Write a failing test for `normalizeSiteOrigin("https://example.com/") === "https://example.com"` and `absoluteSiteUrl("/services", "https://example.com/") === "https://example.com/services"`.
- [ ] Implement the minimal pure URL utility in `src/lib/config.ts`; run `npm run test -- src/lib/config.test.ts` until green.
- [ ] Write failing tests for the existing contact name, email, phone, and message requirements.
- [ ] Extract those rules into `validateContactRequest` and consume it from `ContactForm`; run all unit tests.

### Task 2: Correct public metadata and crawler configuration

**Files:** `src/lib/config.ts`, `src/hooks/usePageMeta.ts`, `index.html`, `public/robots.txt`, `public/sitemap.xml`, `.env.example`, `src/hooks/usePageMeta.test.ts`

- [ ] Write a failing test that verifies canonical paths use the configured production origin, not `window.location.origin`.
- [ ] Use `import.meta.env.VITE_SITE_URL` with `https://dalni.agency` as the documented fallback.
- [ ] Update static canonical/Open Graph/Twitter URLs, `Sitemap:`, and XML locations to the same origin.
- [ ] Document `VITE_SITE_URL` in `.env.example`.
- [ ] Run `npm run test && npm run typecheck && npm run build`.

### Task 3: Improve accessible form feedback

**Files:** `src/components/ContactForm.tsx`, `src/lib/contactValidation.ts`, `scripts/qa.mjs`

- [ ] Add failing browser checks for an invalid form error summary and `aria-describedby` relationships.
- [ ] Add stable `id`, `name`, and `htmlFor` attributes to every form control.
- [ ] Link rendered field errors with `aria-invalid` / `aria-describedby`; make error and success states announced; focus the error summary on an invalid submit.
- [ ] Run `node scripts/qa.mjs` until every existing and new check passes.

### Task 4: Harden client/server boundaries and dashboard controls

**Files:** `server.ts`, `vercel.json`, `firestore.rules`, `src/lib/store.ts`, `src/components/Layout.tsx`, `src/pages/dashboard/DashboardLayout.tsx`, `src/pages/dashboard/Login.tsx`, dashboard pages, `scripts/qa.mjs`

- [ ] Add a failing dashboard `noindex` QA assertion, then correct any dashboard route that omits it.
- [ ] Remove the unauthenticated Firestore `visits` write surface and replace dashboard visit display with contact-request-derived activity.
- [ ] Preserve the narrow contact-request schema and verified-admin PII protection.
- [ ] Match practical CSP, HSTS, and browser hardening headers across Express and Vercel.
- [ ] Await logout, handle auth-check errors as denied sessions, and check all controls for keyboard labels.
- [ ] Run typecheck, build, and browser QA.

### Task 5: Public-site visual and responsive quality pass

**Files:** `src/index.css`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/home/Hero.tsx`, `src/components/home/Sections.tsx`, `src/components/home/CaseStudies.tsx`, `src/pages/Services.tsx`, `src/pages/About.tsx`, `scripts/qa.mjs`

- [ ] Capture baseline screenshots at 390px and 1440px.
- [ ] Add a tablet viewport and checks for menu state, visible primary CTA, overflow, and navigable focus.
- [ ] Consolidate repeated style primitives and fix contrast, focus, spacing, and reduced-motion behavior without changing verified claims.
- [ ] Make mobile navigation dialog-like: Escape closes it, focus remains reachable, and background scroll is prevented while open.
- [ ] Inspect screenshots and run `npm run test && npm run typecheck && npm run build && node scripts/qa.mjs`.

### Task 6: Release validation and documentation

**Files:** `README.md`, `scripts/verify-google.mjs` if required

- [ ] Run `npm audit --omit=dev` and remediate only confirmed production-impact findings.
- [ ] Run the complete local release gate: tests, typecheck, build, QA, Google verification check.
- [ ] Check Vercel connection state without creating or pushing a deployment until an authenticated, linked project is confirmed.
- [ ] Document environment variables, Firebase rules deployment, Vercel deployment behavior, and account-only Google Search Console / Analytics steps.

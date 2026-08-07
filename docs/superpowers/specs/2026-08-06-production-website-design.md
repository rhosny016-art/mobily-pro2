# Dalni Production Website Design

**Status:** Approved by the project owner on 2026-08-06 for autonomous phased execution.

## Goal

Make Dalni a polished, trustworthy Arabic RTL marketing website with a secure, maintainable Firebase dashboard and a launch-ready Vercel deployment.

## Delivery Strategy

The work is divided into independently testable release tracks, executed in this order without waiting between tracks:

1. Public-site experience: visual hierarchy, responsive navigation, conversion paths, form clarity, and motion that respects reduced-motion preferences.
2. Discoverability and reliability: page metadata, structured data, sitemap/robots alignment, resilient route metadata, and production headers.
3. Dashboard and data flows: authorization boundaries, input validation, loading/error states, and maintainable shared utilities.
4. Verification and release readiness: TypeScript, production build, automated browser QA at desktop and mobile sizes, dependency audit, and deployment readiness.

## Architecture

The existing Vite + React SPA remains the presentation layer. Public pages stay lazy-loaded under `Layout`; dashboard routes remain isolated beneath `/dashboard`. Firebase Authentication and Firestore remain the source of identity and content, with Firestore security rules as the enforcement boundary. Express continues serving the compiled SPA for Node deployment, while Vercel serves the static output using configured rewrite and security headers.

## Public Experience

- Preserve Arabic-first, right-to-left content and semantic heading order.
- Use a restrained premium visual system: clearer spacing and type hierarchy, legible contrast, visible keyboard focus, and only purposeful animation.
- Keep calls to action consistent and distinguish high-intent paths (WhatsApp/contact request) from exploratory paths (services/about).
- Ensure every interactive control has an accessible name, keyboard operation, focus state, and meaningful feedback.

## SEO and Social Sharing

- Define one canonical production origin through configuration; preview and local environments must not generate competing canonical URLs.
- Maintain unique route titles, descriptions, canonical tags, Open Graph/Twitter metadata, and valid JSON-LD.
- Keep the sitemap, robots policy, verification artifacts, and public paths consistent with the production host.
- Use truthful local-service copy and structured data only for business facts confirmed in the codebase.

## Security and Data

- Do not place secrets in client code or commit `.env` files.
- Permit public Firestore writes only for narrowly validated contact/visit documents; retain admin-only access for PII.
- Apply a strict, compatible content-security policy and standard browser hardening headers.
- Avoid exposing dashboard metadata to indexing and prevent unsafe rendering of user-supplied content.

## Testing and Acceptance Criteria

- TypeScript and production build complete without errors.
- Public routes and dashboard authentication boundaries work on desktop and mobile viewports.
- Form validation, feedback, navigation, error/empty/loading states, and keyboard access are checked.
- SEO output is inspected for each public route; automated checks cover pure metadata/configuration behavior where feasible.
- A dependency audit identifies no unresolved production-critical vulnerabilities introduced by the work.

## Explicit Boundaries

- Google Search Console, Google Analytics, Vercel Analytics, and production deployment require access to the owner’s authenticated accounts and, for deployment, a configured Vercel project/domain. The codebase will be made ready for them, but account actions will only be attempted if authenticated access is already available.
- No fictional testimonials, clients, ratings, addresses, or performance guarantees will be added.

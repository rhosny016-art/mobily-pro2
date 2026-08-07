# دلّني — Dalni Agency Website

Arabic (RTL) marketing agency website for **دلّني**. Built with React 19, Vite 7, Tailwind CSS 4, Framer Motion, Firebase (Auth + Firestore), and Express.

## Features

- RTL Arabic marketing site: Home, Services, About, and a public contact form.
- **دَلّوب** — a rule-based smart chat assistant that runs entirely in the browser (no backend required).
- Public content (site settings, service overrides) managed from Firebase Firestore.
- Passwordless admin dashboard at `/dashboard` via Google Sign-In with an allow-list of admin emails.
- Local SEO focus: clean URLs, canonical tags, per-page metadata, JSON-LD (ProfessionalService + FAQPage), `robots.txt`, `sitemap.xml`, and a generated Open Graph image.

## Stack

| Layer      | Tech                                                        |
| ---------- | ----------------------------------------------------------- |
| Frontend   | React 19, React Router 7, Tailwind 4, Framer Motion          |
| Backend    | Express 5 (serves `dist/` in production, optional `/api/chat`) |
| Database   | Firebase Firestore (client SDK)                              |
| Auth       | Firebase Auth (Google Sign-In, admin-only dashboard)         |
| Build      | Vite 7, TypeScript, esbuild (`dist/server.cjs`)              |

## Getting Started

Prerequisites: Node.js 20+.

```bash
npm install
npm run dev        # starts Vite dev server on http://localhost:3000
```

## Scripts

| Script            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Start the local dev server (Express + Vite middleware)   |
| `npm run build`   | Type-safe production build to `dist/` (static + server)  |
| `npm start`       | Serve the production build with the bundled Node server  |
| `npm run og`      | Regenerate `public/og-image.png` (1200×630 social card)  |
| `npm run typecheck` | TypeScript check without emitting                       |

## Configuration

Copy `.env.example` to `.env.local` and fill in values to override the defaults.

- `VITE_FIREBASE_*` — Firebase project credentials (defaults come from `firebase-applet-config.json`).
- `VITE_ADMIN_EMAILS` — comma-separated emails allowed to access the dashboard.

> **Firestore rules:** keep the admin email list in `firestore.rules` in sync with
> `VITE_ADMIN_EMAILS`. Contact requests are readable only by admins.

## Deployment

The site is a static SPA plus an optional Node server:

- **Static hosts** (Vercel / Netlify / Cloudflare Pages): upload `dist/` and the
  contents of `public/`. SPA fallback is configured in `vercel.json` and
  `public/_redirects`. Replace the placeholder domain `dalni.agency` in
  `public/robots.txt`, `public/sitemap.xml`, and `index.html` with the real domain.
- **Node hosting**: `npm run build` then `npm start` (serves the app on port 3000).

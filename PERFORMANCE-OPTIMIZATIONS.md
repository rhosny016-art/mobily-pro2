Performance optimization runbook

Goal
- Make the site feel fast on mobile and desktop while keeping design and SEO.

What I changed so far (code):
- Deferred `framer-motion`-heavy decorations via `ClientDecorations` lazy chunk.
- Idle-loaded the `ChatWidget` in `Layout` to avoid blocking initial render.
- Replaced `framer-motion` placeholders in `LazyImage` with a CSS shimmer.
- Reduced font preloads in `index.html` to critical families/weights and used `display=swap`.
- Added long cache serving for static assets in `server.ts` and ensured `index.html` is served `no-cache`.
- Added `vite-imagetools` and `vite-plugin-compression` to `vite.config.ts` (and `package.json` devDeps) to enable image optimizations and pre-compression.
- Helper script: `scripts/summarize_dist.py` to summarize built artifacts once you produce a `dist/`.

Manual steps to run locally (required because this environment lacks Node/npm):
1) Install dependencies and build (recommended):

```bash
npm ci
npm run build
```

2) Summarize built artifacts:

```bash
python scripts/summarize_dist.py
```

3) Serve the `dist` folder and run Lighthouse (mobile & desktop):

```bash
# serve
npx http-server dist -p 8080
# mobile audit
npx lighthouse http://localhost:8080 --output json --output-path=./lighthouse-before-mobile.json --emulated-form-factor=mobile --throttling.method=devtools
# desktop audit
npx lighthouse http://localhost:8080 --output json --output-path=./lighthouse-before-desktop.json --emulated-form-factor=desktop
```

4) After you run the build and audits, paste the outputs here (or attach the `lighthouse-*.json` and `summarize_dist.py` output). I will analyze them and implement the targeted fixes (image conversion, font subsetting, fine-grained code splitting) and produce an after-report.

Next recommended automated changes I can implement now (no build required):
- Update `LazyImage` to produce responsive `srcset` and accept `?imagetools` imports (example code included on request).
- Add `vite.config.ts` rules for image presets and auto-generated AVIF/WebP sources.
- Add `preload` for critical self-hosted WOFF2 subset and a script to subset fonts.
- Add `vite-plugin-visualizer` script to inspect bundle sizes post-build.

If you want me to continue automatically, grant me permission to run `npm ci` & `npm run build` here; otherwise run the build locally and share the artifact summaries and Lighthouse JSONs and I'll proceed with precise optimizations and a before/after report.

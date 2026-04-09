# Architecture

## Type

**Static multi-page application (MPA).** Not a SPA. Three independent HTML entry points with full browser page loads between them. Alpine.js provides in-page reactivity only — no client-side routing.

Served directly from the filesystem via `python -m http.server`. No reverse proxy, no SSR, no build pipeline in the current state (Phase 2 will introduce a Python/Jinja2 build step).

---

## Page Inventory

| File | Status | Description |
|------|--------|-------------|
| `index.html` | Hand-authored | Main landing page; all 12 Alpine.js components; ~1452 lines |
| `portfolio.html` | Hand-authored | Our Works standalone gallery |
| `services.html` | Hand-authored | Services pillar overview |

> Root HTML files are currently edited directly. Phase 2 will generate them from `templates/` + `pages/` via `build.py`. Until then, treat root HTML as the authoritative source.

---

## Data Flow

```
data/*.js  →  window.* globals  →  Alpine.js getters  →  HTML rendering
```

All 7 data files are loaded via `<script>` tags in each page's `<head>`. They assign to the `window` global scope. Alpine.js components access them through getters:

```javascript
get products() { return window.PRODUCTS_DATA?.products || []; }
```

No module system. No imports. No bundling. This is intentional — the constraint is no Node.js.

---

## Component Map

All 12 Alpine.js components are defined in `js/app.js` and exported to `window`:

| Component | Page(s) | Data dependency |
|-----------|---------|----------------|
| `fikraApp()` | All (body) | `SITE_CONFIG` |
| `briefWizard()` | `index.html` | `PORTFOLIO_DATA.briefProjects`, `SITE_CONFIG` |
| `productsShop()` | `index.html` | `PRODUCTS_DATA`, `AirtableService` |
| `transformationsData()` | `index.html` | `PORTFOLIO_DATA.transformations` |
| `workGallery()` | `index.html` | `PORTFOLIO_DATA.galleryProjects` |
| `partnersCarousel()` | `index.html` | `PARTNERS_DATA` |
| `beforeAfter()` | `index.html` | None |
| `testimonialsCarousel()` | `index.html` | `TESTIMONIALS_DATA` |
| `faqAccordion()` | `index.html` | `FAQ_DATA` |
| `statsCounter()` | `index.html` | `STATS_DATA` |
| `priceCalculator()` | `index.html` | `SITE_CONFIG` |
| `whatsappWidget()` | `index.html` | `SITE_CONFIG` |

**Inline Alpine components** (defined in HTML, not `app.js`):

| Section | Page | Data dependency |
|---------|------|----------------|
| `#services` | `index.html`, `services.html` | `SERVICES_DATA.mainServices` |
| `#our-works` | `index.html`, `portfolio.html` | `PORTFOLIO_DATA.ourWorks` |
| `footer` | All | `SITE_CONFIG.social` |

---

## Source-of-Truth Mapping

| Domain | Authoritative file | Notes |
|--------|-------------------|-------|
| Navigation links | Hardcoded in each page `<nav>` | No central source; Phase 2 will fix this via `templates/partials/header.html` |
| Products | `data/products.js` → `PRODUCTS_DATA` | Optionally overridden by Airtable at runtime |
| Services | `data/services.js` → `SERVICES_DATA` | |
| Portfolio / Our Works | `data/portfolio.js` → `PORTFOLIO_DATA` | |
| Testimonials + Stats | `data/testimonials.js` → `TESTIMONIALS_DATA`, `STATS_DATA` | |
| FAQ | `data/faq.js` → `FAQ_DATA` | |
| Partners | `data/partners.js` → `PARTNERS_DATA` | |
| Brand / contact | `data/config.js` → `SITE_CONFIG` | |
| Theme state | `localStorage` key `fikra_theme` | Applied as `html.idea` (light) or no class (dark) |
| Events splash | `assets/events/events.config.js` → `window.__EVENT_SPLASH__` | `ACTIVE_EVENT`, `EVENT_VERSION` |
| PWA / offline | `service-worker.js` `CORE_ASSETS` array | Currently at `v28`; manually maintained |

---

## Script Load Order (`index.html`)

```
1. assets/events/events.config.js     — sets window.__EVENT_SPLASH__
2. data/config.js                     — SITE_CONFIG
3. data/products.js                   — PRODUCTS_DATA
4. data/portfolio.js                  — PORTFOLIO_DATA
5. data/partners.js                   — PARTNERS_DATA
6. data/services.js                   — SERVICES_DATA
7. data/testimonials.js               — TESTIMONIALS_DATA, STATS_DATA
8. data/faq.js                        — FAQ_DATA
9. [js/airtable-config.js]            — OPTIONAL; add manually if using Airtable
10. js/airtable-service.js            — window.AirtableService singleton
11. js/app.js                         — all 12 Alpine component functions → window.*
12. js/floating-glyphs.js             — FloatingGlyphsCSS; auto-initializes
13. (CDN defer) @alpinejs/focus       — Alpine focus plugin
14. (CDN defer) alpinejs              — Alpine.js 3.x
```

Alpine.js is loaded `defer` so it initializes after the DOM and all preceding scripts are ready.

---

## Service Worker

**Version:** `v28`

**Strategies:**

| Request type | Strategy | Detail |
|---|---|---|
| Navigation (HTML) | Network-first | On success: cache response under request URL. On failure: serve `caches.match(req)` → fallback to `./index.html` |
| Same-origin assets | Stale-while-revalidate | Serves cached, revalidates in background |
| Cross-origin (CDN) | Cache-first | `no-cors` fetch on miss |

**All pages are precached** (`index.html`, `portfolio.html`, `services.html`) plus all JS, CSS, data, and event splash assets. See `CORE_ASSETS` in `service-worker.js` for the full list.

**Phase 2 change:** `build.py` will auto-generate `service-worker.js` from `templates/service-worker.js.jinja`, keeping `CORE_ASSETS` and `CACHE_VERSION` in sync with generated pages automatically.

---

## Theming

- **Dark mode:** no class on `<html>` (default)
- **Light mode:** `html.idea` class
- Toggled by `fikraApp().toggleTheme()` in `js/app.js`
- Persisted in `localStorage` as `fikra_theme`
- All colors are CSS custom properties on `:root` (dark) and `html.idea` (light)
- Primary palette: `--brand-red: #E53935`, `--mint-primary: #81D8D0`
- Use `text-brand-red` (Tailwind utility). Do not use `text-fikra-red` — removed.

---

## Events Splash Subsystem

Located in `assets/events/`. Session-gated animated overlay shown on first visit.

```
events.config.js          →  window.__EVENT_SPLASH__  (ACTIVE_EVENT, EVENT_VERSION)
core.splash.js            →  checks sessionStorage, loads event assets dynamically
assets/events/<name>/     →  <name>.css, <name>.js (exposes __<name>Splash_build/play)
```

**Disabling:** Set `ACTIVE_EVENT = ''` in `events.config.js`.

**Known gap:** No date-range gating. Splash fires for all visitors until manually disabled.

---

## Airtable Integration

Optional. `js/airtable-service.js` is always loaded. It checks for real credentials at init:
- If `js/airtable-config.js` was not added to the page → placeholder strings detected → `isConfigured = false` → `fetchProducts()` returns `null` → Alpine falls back to `PRODUCTS_DATA`
- If credentials are present and Airtable is reachable → products fetched, cached 5 minutes, displayed
- On Airtable failure → `console.error` logged, local fallback used

**Security:** PAT is visible in browser DevTools Network tab. No mitigation exists short of a server-side proxy. This is an open decision.

---

## Phase 2 Target Architecture

Phase 2 introduces a Python/Jinja2 build step. Root HTML files become generated artifacts. The source becomes:

```
templates/base.html              — master shell
templates/partials/head.html     — <head>, script tags
templates/partials/header.html   — nav, mobile menu, theme toggle
templates/partials/footer.html   — footer
templates/partials/wa-widget.html — WhatsApp widget
pages/<name>.html                — page-specific content (no shell)
build.py                         — generates root HTML + service-worker.js
requirements.txt                 — jinja2>=3.0
```

Until Phase 2 is complete, do not create these directories or files.

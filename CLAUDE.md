# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Safi Group (مجموعة الصافي)** — A creative agency portfolio website featuring a modern Anima-inspired bento glass UI design with Arabic RTL layout. The design uses a Red (#E53935) to Mint Green (#00E5A0) gradient palette with refined glassmorphism effects. This is a static PWA (Progressive Web App) for an advertising and marketing agency based in Muhayl Asir, Saudi Arabia.

## Tech Stack

- **HTML5/CSS3/Vanilla ES6+ JavaScript** — No build tools, no Node.js (Phase 2 will introduce a Python build step)
- **Tailwind CSS** via CDN with inline configuration (`darkMode: 'class'`)
- **Alpine.js 3.x** for reactive UI components (x-data, x-show, x-for, @click directives)
- **Alpine Focus Plugin** for focus management in modals
- **PWA** with service worker for offline-first support
- **Tajawal** Arabic font (self-hosted woff2 via `@font-face` in `css/style.css`)
- **Airtable** (optional) — External product database with local fallback

## Development Commands

```bash
# Run local development server
python -m http.server 5000 --bind 0.0.0.0

# Site accessible at http://localhost:5000
```

> **Note:** Root HTML files (`index.html`, `portfolio.html`, `services.html`) are currently hand-authored. Phase 2 will introduce a Python/Jinja2 build step that generates these files from `templates/` and `pages/`. Until then, edit root HTML files directly.

## Architecture

### File Structure

```
/
├── index.html              # Main landing page — all 12 Alpine components (~1452 lines, hand-authored)
├── portfolio.html          # Standalone portfolio page (hand-authored)
├── services.html           # Standalone services page (hand-authored)
├── manifest.json           # PWA manifest (RTL, Arabic, standalone)
├── service-worker.js       # Offline-first caching (v28)
├── .gitignore              # Excludes venvs, .env, airtable-config.js
├── CLAUDE.md               # This file
├── DEVELOPMENT_ROADMAP.md  # Historical feature log
├── replit.md               # Replit deployment guide
│
├── css/
│   └── style.css           # Theme system, glass effects, animations, slider system
│
├── js/
│   ├── app.js              # Alpine.js component functions (12 components)
│   ├── floating-glyphs.js  # CSS-based floating icon animations for brief wizard
│   ├── airtable-service.js # Airtable API integration service with caching
│   └── airtable-config.example.js  # Template for Airtable credentials (never commit the real file)
│
├── data/                   # Data-driven content layer — edit here for content changes
│   ├── config.js           # Site branding, contact, location, social
│   ├── products.js         # Product catalog (24 items, 6 categories)
│   ├── portfolio.js        # Brief wizard + Our Works (15 projects, 6 categories) + gallery + transformations
│   ├── services.js         # Main services (3 pillars, 24 sub-services) + brief wizard data + whySafi
│   ├── partners.js         # Client/partner logos (8 orgs)
│   ├── testimonials.js     # Customer testimonials (6 items) + company stats (STATS_DATA)
│   └── faq.js              # Frequently asked questions (8 items, 5 categories)
│
├── assets/
│   ├── logo.webp           # Main brand logo
│   ├── icons/
│   │   ├── icon-192.webp   # PWA icon (small)
│   │   └── icon-512.webp   # PWA icon (large)
│   └── events/             # Event splash subsystem (see Events System section below)
│       ├── events.config.js    # Active event config: set ACTIVE_EVENT and EVENT_VERSION
│       ├── core.splash.js      # Session-gated splash loader (dynamic asset injection)
│       └── ramadan/
│           ├── ramadan.js      # Ramadan splash animation (parallax moon/lanterns)
│           ├── ramadan.css     # Ramadan overlay styles
│           └── ramadan.svg     # Ramadan SVG assets
│
├── product_manager.py      # Python CLI utility using OpenRouter (Gemma 3) for AI product descriptions
└── docs/                   # Project documentation
    ├── architecture.md
    ├── project-roadmap.md
    ├── content-operations.md
    ├── rebuild-inventory.md
    └── change-log.md
```

### Data-Driven Architecture

Content is separated from presentation. All dynamic data lives in `/data/*.js` files:

| File | Exports | Purpose |
|------|---------|---------|
| `config.js` | `SITE_CONFIG` | WhatsApp, email, brand info, location, social links |
| `products.js` | `PRODUCTS_DATA` | Categories (6 + "all" filter) + products (24) with prices, ratings, features |
| `portfolio.js` | `PORTFOLIO_DATA` | Brief projects (6) + Our Works (15 projects, 6 categories) + gallery (3) + transformations stats |
| `services.js` | `SERVICES_DATA` | Main services (3 pillars: Creative Design, Marketing, Advertising/Printing) + brief wizard categories/styles + whySafi points |
| `partners.js` | `PARTNERS_DATA` | Partner organization icons and names (8) |
| `testimonials.js` | `TESTIMONIALS_DATA`, `STATS_DATA` | Customer testimonials (6) + company statistics (clients, projects, cities, years) |
| `faq.js` | `FAQ_DATA` | FAQ items (8) with categories: delivery, design, payment, orders, quality |

Data files export to `window` global scope and are accessed via Alpine.js getters:
```javascript
get products() { return window.PRODUCTS_DATA?.products || []; }
```

### Alpine.js Components (defined in `js/app.js`)

| # | Function | Purpose |
|---|----------|---------|
| 1 | `fikraApp()` | Main app state: theme toggle, mobile menu, header scroll behavior |
| 2 | `briefWizard()` | Multi-step client inquiry form with style matching |
| 3 | `productsShop()` | Product catalog with Airtable integration, category-based horizontal sliders, cart management, WhatsApp checkout. Dual-mode: slider view (all categories) + grid view (single category). RTL-aware scroll navigation. Async init with lazy loading. |
| 4 | `transformationsData()` | Transformation section statistics |
| 5 | `workGallery()` | Portfolio projects modal gallery |
| 6 | `partnersCarousel()` | Infinite-scroll partner logos |
| 7 | `beforeAfter()` | Drag slider for before/after comparisons |
| 8 | `testimonialsCarousel()` | Customer testimonials carousel with 5s autoplay, pause on hover, star ratings |
| 9 | `faqAccordion()` | FAQ accordion with search/filter functionality |
| 10 | `statsCounter()` | Animated statistics counter with IntersectionObserver trigger |
| 11 | `priceCalculator()` | Dynamic pricing calculator (6 product types, size/finishing/quantity options, volume discounts) |
| 12 | `whatsappWidget()` | Floating WhatsApp chat widget with quick messages, auto-open after 10s for new visitors |

All 12 functions are exported to `window` scope at the bottom of `js/app.js`.

**Inline Alpine.js Components (in `index.html`):**
| Component | Purpose |
|-----------|---------|
| `#services` | Services section: displays 3 main service pillars with nested sub-services (24 total). Bento glass cards with gradients. |
| `#our-works` | Our Works section: category-based horizontal sliders (same system as products). 15 projects across 6 categories. Dual-mode view. |
| `footer` | Footer with social media links from `SITE_CONFIG.social`. Icons conditionally rendered via `x-show` when URLs are populated. |

### Animation System

One active JS animation file:

| File | Class | Purpose |
|------|-------|---------|
| `js/floating-glyphs.js` | `FloatingGlyphsCSS` | CSS transition-based sequential icon animations for the brief wizard section. Shows one glyph at a time (3 icons cycling every 5s). Fade in/out, floating vertical motion, rotation effects. |

Background atmosphere is provided by CSS-only ambient glow elements in the HTML — no canvas or JS animation files.

### Airtable Integration (Optional)

Products can optionally be loaded from an Airtable database, falling back to local `data/products.js` data.

**Setup:**
1. Copy `js/airtable-config.example.js` → `js/airtable-config.js`
2. Fill in Airtable credentials (PAT, Base ID, Table ID)
3. `airtable-config.js` is in `.gitignore` — never committed
4. Add `<script src="js/airtable-config.js"></script>` manually to the HTML page(s) that need Airtable, immediately before the `js/airtable-service.js` script tag

> **Important:** The `js/airtable-config.js` script tag is **not** automatically present in the HTML. It must be added manually when configuring Airtable. Without it, `airtable-service.js` detects unconfigured credentials and silently falls back to local data — no 404 errors, no broken UI.

**How it works:**
- `js/airtable-service.js` exports `window.AirtableService` (singleton instance)
- On init, `checkConfiguration()` checks whether real credentials are present; returns `false` if only placeholder strings are found
- `productsShop()` calls `AirtableService.fetchProducts()` on init
- If `isConfigured = false` → returns `null` immediately → `productsShop` calls `useLocalFallback()`
- If Airtable returns data → uses it; otherwise → falls back to local `PRODUCTS_DATA`
- 5-minute in-memory cache to reduce API calls
- Records mapped from Airtable schema to local product format via `mapAirtableRecords()`
- Categories extracted dynamically from fetched products via `extractCategories()`

**Security note:** The Airtable Personal Access Token (PAT) is transmitted in the browser's `Authorization` header and is visible in DevTools Network tab. If Airtable is used in production, a server-side proxy is the correct architectural fix. This is a known open decision — see `docs/project-roadmap.md`.

### Events System

The event splash system (`assets/events/`) displays a full-screen animated overlay on first visit per session.

**Configuration (`assets/events/events.config.js`):**
```javascript
var ACTIVE_EVENT = 'ramadan';          // "ramadan" | "eid" | "national-day" | "" (empty to disable)
var EVENT_VERSION = '2026-ramadan-v1'; // bump to force replay after updates
```

**How it works:**
1. `events.config.js` sets `window.__EVENT_SPLASH__` with `ACTIVE_EVENT` and `EVENT_VERSION`
2. `core.splash.js` checks `sessionStorage` — if this version was already played in the current session, skips immediately
3. If not played: locks scroll, dynamically loads `assets/events/<event>/<event>.css` and `<event>.js`
4. The event module exposes `__<event>Splash_build`, `__<event>Splash_parallax`, `__<event>Splash_play` functions
5. After the animation completes (or 3s safety timeout), scroll is restored and the main UI is revealed

**To disable the splash:** Set `ACTIVE_EVENT = ''` in `events.config.js`.

**To add a new event:** Create `assets/events/<name>/` with `<name>.js` and `<name>.css` exposing the required functions, then set `ACTIVE_EVENT = '<name>'`.

**Known gap:** There is no date-range gating. The splash fires for all visitors until `ACTIVE_EVENT` is manually changed. Future enhancement: add `startDate`/`endDate` fields to `events.config.js` and a date check in `core.splash.js`.

### Theming System

Two themes controlled via CSS variables:

| Variable | Dark (`:root`) | Light (`html.idea`) |
|----------|----------------|---------------------|
| `--bg` | `#080809` | `#FAFAFA` |
| `--bg2` | `#0B0B0D` | `#F0F0F0` |
| `--fg` | `rgba(255,255,255,0.95)` | `#111827` |
| `--muted` | `rgba(255,255,255,0.60)` | `#6B7280` |
| `--card` | `rgba(18,18,20,0.7)` | `rgba(255,255,255,0.75)` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.07)` |
| `--grid` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.03)` |
| `--brand-red` | `#E53935` | `#D32F2F` |
| `--brand-red-light` | `#EF5350` | `#E53935` |
| `--brand-red-dark` | `#C62828` | `#B71C1C` |
| `--mint-primary` | `#81D8D0` | `#00C88C` |
| `--glass-glow` | `rgba(229,57,53,0.25)` | `rgba(211,47,47,0.20)` |
| `--edge-line-strong` | `rgba(229,57,53,0.40)` | `rgba(211,47,47,0.30)` |

- Theme persisted in `localStorage` as `fikra_theme`
- Toggle via `toggleTheme()` in `fikraApp()` switches between dark (no class) and `html.idea` (light)

### Site Configuration

All contact/brand info centralized in `data/config.js`:
```javascript
SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: { name: 'مجموعة الصافي', tagline: 'SAFI GROUP', logo: 'assets/logo.webp' },
  location: { city: 'محايل عسير', cityEn: 'Muhayl Asir, Saudi Arabia', mapsUrl: '...' },
  social: { twitter: '', instagram: '', snapchat: '', tiktok: '' }
}
```

### Glass UI Pattern

Cards use the `.noise` class which provides:
- Semi-transparent background with `backdrop-blur`
- CSS variable borders (`var(--border)`)
- Pseudo-element texture overlay (radial gradients)
- Glass edge highlight via linear gradients
- Automatic adaptation to dark/light themes

### WhatsApp Integration

No backend contact forms. All inquiries go via WhatsApp:
- Brief Wizard sends formatted preferences message
- Product cart checkout sends itemized order
- Price Calculator sends detailed quote request
- Floating WhatsApp widget offers quick-message shortcuts
- Messages constructed with template strings and `encodeURIComponent()`

## Service Worker

**Current version:** `v28` (in `CACHE_VERSION` constant in `service-worker.js`)

**Caching strategies:**
| Request Type | Strategy |
|--------------|----------|
| Navigation (HTML) | Network-first; on success caches the response under the exact request URL; on failure serves the cached version of the requested URL, falling back to `index.html` |
| Same-origin assets | Stale-while-revalidate |
| Cross-origin (CDN) | Cache-first with `no-cors` mode |

**Precached assets (`CORE_ASSETS`):**
- `./`, `./index.html`, `./portfolio.html`, `./services.html`
- `./css/style.css`
- `./js/app.js`, `./js/floating-glyphs.js`, `./js/airtable-service.js`
- `./manifest.json`, `./assets/icons/icon-192.webp`, `./assets/icons/icon-512.webp`, `./assets/logo.webp`
- All 7 data files (`./data/*.js`)
- All event splash assets (`./assets/events/events.config.js`, `./assets/events/core.splash.js`, `./assets/events/ramadan/*`)

**When deploying changes:** Increment `CACHE_VERSION` in `service-worker.js`. Current value: `v28`. Next value: `v29`.

## Development Constraints

1. **No Node.js/NPM** — Use CDN-hosted libraries only (Tailwind, Alpine.js). Phase 2 will add a Python build step only.
2. **RTL Layout** — All UI is right-to-left Arabic; use `dir="rtl"` and RTL-aware CSS
3. **Service Worker** — Increment `CACHE_VERSION` when deploying any changes
4. **Glass UI Pattern** — Cards use `.noise` class with `backdrop-blur`, CSS variable borders
5. **Data Separation** — Content changes go in `/data/*.js`, not in HTML
6. **No Backend** — All contact/order flows use WhatsApp deep links
7. **Airtable Credentials** — Never commit `js/airtable-config.js`; use the `.example.js` template; add the script tag manually when configuring
8. **Python Utilities** — `product_manager.py` requires `.env` with `OPENROUTER_API_KEY`; virtualenvs excluded via `.gitignore`
9. **CSS Class Names** — Use `text-brand-red` (defined in Tailwind config). The legacy name `text-fikra-red` has been removed and must not be reintroduced.

## Workflow Protocol

### Safe-Edit Rule
Never edit a file without reading it first. Follow: Read → Think → Edit

### Modular Development
Complete one functional module fully before moving to the next. Each Alpine.js component should be self-contained and testable.

### Content Updates
- To add products: Edit `data/products.js` (categories array + products array)
- To add Our Works projects: Edit `data/portfolio.js` (ourWorks array, ensure category matches workCategories)
- To add/modify main services: Edit `data/services.js` (mainServices array - 3 pillars with sub-services)
- To update Brief Wizard projects: Edit `data/portfolio.js` (briefProjects array)
- To change contact info: Edit `data/config.js`
- To add social media links: Edit `data/config.js` (social object — twitter, instagram, snapchat, tiktok URLs)
- To update partners: Edit `data/partners.js`
- To add testimonials: Edit `data/testimonials.js` (TESTIMONIALS_DATA array)
- To update company stats: Edit `data/testimonials.js` (STATS_DATA object)
- To add FAQ items: Edit `data/faq.js` (FAQ_DATA array, categories: delivery, design, payment, orders, quality)
- To manage products via Airtable: Configure `js/airtable-config.js` and add the script tag to the relevant HTML page
- To change active event: Set `ACTIVE_EVENT` and `EVENT_VERSION` in `assets/events/events.config.js`

**Important:** When adding new categories to products or portfolio, update both the category definitions and the items array to maintain consistency.

### UI Standards
- Follow existing glass/bento aesthetic with `.noise` class
- Maintain professional typography and whitespace
- Use CSS variables for colors to ensure theme compatibility
- Test both dark and light themes when making visual changes
- **Slider System Constraints:**
  - Use existing `.horizontal-slider`, `.slider-container`, `.slider-arrow` classes
  - Desktop: 3 cards visible (`flex: 0 0 calc(33.333% - 1rem)`)
  - Mobile: 1.5 cards visible (`flex: 0 0 66.666%`)
  - RTL-aware scroll: direction multiplied by -1
  - Navigation arrows appear on hover (desktop only)
  - Maintain `scroll-snap-type: x mandatory` for smooth UX

### Deployment Checklist
1. Test locally with `python -m http.server 5000`
2. Verify both themes work correctly
3. Check mobile responsive layout
4. Increment `CACHE_VERSION` in `service-worker.js`
5. Test PWA offline functionality: load site once online, go offline, navigate to all pages
6. Verify Airtable integration (if configured) and confirm local fallback works without credentials

## Key Implementation Details

### Mobile Menu
- Controlled by `mobileOpen` state in `fikraApp()`
- Slide-out animation with backdrop blur
- Closes on link click or outside tap

### Header Scroll Effect
- `headerShrink` value (0-1) calculated from scroll position
- Used for dynamic padding/opacity transitions
- Throttled via `requestAnimationFrame` with `{ passive: true }` scroll listener

### Product Slider System
**Architecture:** Category-based horizontal sliders with dual-mode view and Airtable integration
- **Slider Mode (default):** All categories displayed in separate horizontal rows
- **Grid Mode:** Single category expanded in traditional grid layout
- **Categories:** print, gifts, boards, rollup, exhibitions, illuminated (6 product categories + 1 "all" filter)
- **Data Source:** Airtable (if configured and reachable) → local `data/products.js` fallback

**Key Methods (in `productsShop()`):**
```javascript
categoriesWithProducts     // Filters categories with products > 0
getProductsByCategory(id)  // Returns products for specific category
scrollSlider(id, dir)      // RTL-aware horizontal scroll (dir * -1)
viewAllCategory(id)        // Switches to grid view for category
loadProducts()             // Async: tries Airtable, falls back to local
initLazyLoading()          // IntersectionObserver for product images
```

**Product Fields:**
```javascript
{ id, name, price, originalPrice, tag, category, icon, image,
  categoryName, description, features[], inStock, rating }
```

**Responsive Behavior:**
- Desktop: 3 cards per row, glassmorphism arrows on hover
- Mobile: 1.5 cards per row (hints more content), swipe to scroll
- Snap scrolling: `scroll-snap-type: x mandatory`

### Services Section (#services)
**Data Source:** `SERVICES_DATA.mainServices` (3 pillars)
- Creative Design: 6 services (Branding, Ad Campaigns, Social Media, Digital Illustration, Packaging, Motion)
- Marketing: 4 services (Strategy, Social Media Management, SEO, Google Ads)
- Advertising & Printing: 14 services (Signs, Stickers, Printing, Exhibitions, Gifts, Fences)

**Layout:** Responsive grid (1/2/3 columns), Bento glass cards with nested sub-service items

### Our Works Section (#our-works)
**Data Source:** `PORTFOLIO_DATA.ourWorks` (15 projects, 6 categories)
- Uses same slider system as products
- Categories: creative-design, marketing, advertising-printing, branding, events, digital
- Each work: gradient background, icon, tags, description
- Dual-mode: slider view (all categories) + grid view (single category)

### Brief Wizard Flow
1. Select category (step 1) — 3 categories: decor, branding, events
2. Choose design style (step 2) — 3 styles: modern, classic, neon
3. View matched portfolio examples (step 3)
4. Enter contact info and send via WhatsApp

### Testimonials Carousel
- Auto-advances every 5 seconds, pauses on hover
- Shows 3 visible testimonials at a time (rotating window)
- Star rating display with `getStars()` helper
- Data source: `TESTIMONIALS_DATA` from `data/testimonials.js`

### Stats Counter
- Animated count-up triggered by `IntersectionObserver` (threshold: 0.3)
- Counts: 500+ clients, 1200+ projects, 15 cities, 8 years
- 2-second animation with 60 steps
- Data source: `STATS_DATA` from `data/testimonials.js`

### Price Calculator
- Supports 6 product types: business cards, flyers, brochures, stickers, roll-ups, banners
- Options: size (standard/large/custom), finishing (matte/glossy/laminated), design add-on (50 SAR), urgent surcharge (25%)
- Volume discounts: 5% at 250+, 10% at 500+, 15% at 1000+
- Sends detailed quote via WhatsApp

### FAQ Accordion
- Search/filter across questions and answers
- Single-open accordion behavior (opening one closes others)
- 8 items across 5 categories: delivery (2), design (2), payment (1), orders (2), quality (1)
- Data source: `FAQ_DATA` from `data/faq.js`

### Footer Social Links
- Reads from `SITE_CONFIG.social` (twitter, instagram, snapchat, tiktok)
- Icons only render when their URL is non-empty (`x-show` conditional)
- Entire social row hidden if all links are empty (`hasSocial` computed)
- Brand name dynamically pulled from `SITE_CONFIG.brand.name`
- Styled with `.footer-social-link` class (glass-consistent hover effects, theme-aware)

### WhatsApp Floating Widget
- Auto-opens after 10 seconds for new visitors (persisted in `localStorage` as `wa_widget_closed`)
- 4 quick-message shortcuts for common inquiries
- Custom message input field
- Toggle open/close with state tracking

## Key CSS Classes Reference

**Core Effects:** `.noise` (glass morphism), `.shadow-glow-neon`, `.hero-gradient-text`

**Product System:** `.product-card`, `.product-modal`, `.product-badge`, `.product-badge-best`, `.product-badge-new`, `.product-out-of-stock`, `.product-rating`, `.product-price-container`, `.product-discount`, `.product-quick-view`, `.product-actions`, `.product-action-btn`

**Slider System:** `.horizontal-slider`, `.slider-container`, `.slider-arrow`, `.category-row`, `.category-view-all`

**Layout:** `.products-grid`, `.masonry-grid`, `.masonry-item`, `.stats-grid`, `.stat-card`

**Partners & Testimonials:** `.partner-capsule`, `.testimonial-card`, `.testimonial-dots`, `.testimonial-nav`

**FAQ & Calculator:** `.faq-item`, `.faq-question`, `.faq-answer`, `.faq-search`, `.calculator-card`, `.calculator-select`, `.calculator-total`, `.calculator-discount`

**WhatsApp Widget:** `.wa-widget`, `.wa-widget-btn`, `.wa-widget-popup`, `.wa-widget-body`, `.wa-widget-header`

**Utilities:** `.lazy-image`, `.skeleton-card`, `.skeleton-slider`, `.error-message`, `.cart-floating`, `.cart-count`, `.footer-social-link`

## .gitignore

The following are excluded from version control:
- Python virtual environments (`sssvenv/`, `openrouterenv/`, `bin/`, `include/`, `lib/`, `share/`, `pyvenv.cfg`)
- `.env` (API keys for OpenRouter)
- `js/airtable-config.js` (Airtable credentials — use `.example.js` as template)
- Python bytecode (`__pycache__/`, `*.py[cod]`, `*$py.class`)

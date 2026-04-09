# Content Operations

How to update content in this repository. All content is in `data/*.js` files — do not hardcode content in HTML.

---

## Products

**File:** `data/products.js`

**To add a product:**
1. Add an entry to the `products` array
2. Ensure the `category` field matches an existing category `id` in the `categories` array
3. Required fields: `id`, `name`, `price`, `category`, `icon`
4. Optional fields: `originalPrice`, `tag` (`"best"` or `"new"`), `image`, `description`, `features`, `inStock`, `rating`

**To add a product category:**
1. Add to the `categories` array (include `id`, `name`, `icon`, `description`)
2. Also add `id: 'all'` category remains at index 0 — do not remove it

**Airtable alternative:** If `js/airtable-config.js` is configured, products and categories are fetched from Airtable at runtime. The local `data/products.js` serves as fallback.

---

## Our Works (Portfolio Projects)

**File:** `data/portfolio.js` → `PORTFOLIO_DATA.ourWorks`

**To add a project:**
1. Add to the `ourWorks` array
2. `category` must match an `id` in `PORTFOLIO_DATA.workCategories`
3. Fields: `id`, `title`, `category`, `tags` (array), `description`, `gradient`, `icon`

**To add a works category:**
1. Add to `PORTFOLIO_DATA.workCategories`
2. The slider system uses this list to build category rows — maintain order

---

## Brief Wizard Projects

**File:** `data/portfolio.js` → `PORTFOLIO_DATA.briefProjects`

These are the portfolio examples shown to clients in the Brief Wizard (step 3).

Fields: `id`, `title`, `category` (matches `briefWizard` categories: `decor`, `branding`, `events`), `style` (matches `briefWizard` styles: `modern`, `classic`, `neon`), `tags`, `gradient`, `icon`

---

## Services

**File:** `data/services.js` → `SERVICES_DATA.mainServices`

3 pillars with nested sub-services. Each pillar:
```javascript
{
  id, title, icon, gradient, description,
  services: [ { name, icon, description }, ... ]
}
```

Sub-service counts: Creative Design (6), Marketing (4), Advertising & Printing (14).

---

## Testimonials

**File:** `data/testimonials.js` → `TESTIMONIALS_DATA`

Fields: `id`, `name`, `role`, `company`, `text`, `rating` (1–5), `avatar` (emoji or URL)

---

## Company Stats

**File:** `data/testimonials.js` → `STATS_DATA`

```javascript
STATS_DATA = { clients: 500, projects: 1200, cities: 15, years: 8 }
```

The `statsCounter()` component animates these values on scroll. Update numbers here.

---

## Partners

**File:** `data/partners.js` → `PARTNERS_DATA`

Fields: `id`, `name`, `icon` (emoji), `color` (CSS class or hex)

---

## FAQ

**File:** `data/faq.js` → `FAQ_DATA`

Fields: `id`, `question`, `answer`, `category`

Valid categories: `delivery`, `design`, `payment`, `orders`, `quality`

---

## Contact / Brand Info

**File:** `data/config.js` → `SITE_CONFIG`

```javascript
{
  whatsapp: '966555862272',      // Without + prefix
  email: 'safigroup@gmail.com',
  brand: { name, tagline, logo },
  location: { city, cityEn, mapsUrl },
  social: { twitter, instagram, snapchat, tiktok }  // Leave empty string to hide icon
}
```

Social icons in the footer only render when the URL is non-empty.

---

## Events Splash

**File:** `assets/events/events.config.js`

```javascript
var ACTIVE_EVENT = 'ramadan';          // Set to '' to disable
var EVENT_VERSION = '2026-ramadan-v1'; // Bump to force replay for returning visitors
```

**To disable splash:** Set `ACTIVE_EVENT = ''`.

**To switch events:** Change `ACTIVE_EVENT` to the event folder name (e.g., `'eid'`) and bump `EVENT_VERSION`.

**To add a new event:**
1. Create `assets/events/<name>/` with `<name>.css` and `<name>.js`
2. The JS file must expose three functions on `window`:
   - `__<name>Splash_build(container)` → returns `{ overlay, skipBtn }`
   - `__<name>Splash_parallax(overlay)` → returns `{ destroy }` (optional)
   - `__<name>Splash_play(overlay, skipBtn, done)` → calls `done()` when finished
3. Add the new assets to `CORE_ASSETS` in `service-worker.js` and bump `CACHE_VERSION`

**Note:** No date-range gating exists. The splash fires for all visitors until manually disabled.

---

## Airtable Integration

**To configure Airtable:**
1. Copy `js/airtable-config.example.js` → `js/airtable-config.js`
2. Fill in your PAT, Base ID, and Table ID
3. Add this script tag manually to the relevant HTML page, immediately before the `airtable-service.js` tag:
   ```html
   <script src="js/airtable-config.js"></script>
   ```
4. Never commit `js/airtable-config.js` — it is in `.gitignore`

**To disable Airtable:** Simply remove the `js/airtable-config.js` script tag. The service falls back to local data automatically.

---

## Adding a New Page (Phase 2 only)

After Phase 2 is complete, adding a new page will require:
1. Create `pages/<name>.html` with the page content fragment
2. Add the page entry to `PAGES` in `build.py`
3. Run `python build.py` to generate `<name>.html` and update `service-worker.js`

Until Phase 2, adding a new page means creating a new root HTML file manually, copying the full header/footer/widget markup from an existing page.

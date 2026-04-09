# Change Log

---

## Phase 1 — Documentation Bootstrap

**Branch:** direct commits to `main`
**Date:** 2026-04-09

### Files created
- `docs/architecture.md` — full architecture reference (MPA type, data flow, component map, service worker, theming, events system, Phase 2 target)
- `docs/project-roadmap.md` — page inventory, phase plan, open decisions
- `docs/content-operations.md` — operational guide for all content types
- `docs/rebuild-inventory.md` — keep/reuse/reference classification for Phase 2
- `docs/change-log.md` — this file

### Files updated
- `CLAUDE.md` — removed stale references (`nebula.js`, `mesh-gradient.js`, `products.json`); updated service worker section (v28, accurate precache list, corrected navigation fallback description); added events subsystem documentation; updated Airtable setup instructions to reflect manual script tag requirement; added Phase 2 note on generated HTML; corrected CSS variable table; removed dead CSS class references; added legacy naming warning (`text-fikra-red` removed)

---

## Phase 0 — Isolated Cleanup

**Branch:** `cleanup/phase-0` → merged to `main`
**Commit:** `5546ea3`
**Date:** 2026-04-09

### Files deleted
- `js/nebula.js` (233 lines) — dead code, not loaded in any HTML page
- `js/mesh-gradient.js` (175 lines) — dead code, not loaded in any HTML page
- `products.json` — generated artifact from `product_manager.py`, not a data source

### `js/app.js`
- Removed `console.log` at lines 286 and 311

### `js/airtable-service.js`
- Removed 8 `console.log`/`console.warn` statements (lines 52, 56, 69, 74, 97, 101, 102, 211, 219)
- Retained `console.error` calls

### `service-worker.js`
- Bumped `CACHE_VERSION` from `v27` to `v28`
- Added `./portfolio.html`, `./services.html`, `./js/airtable-service.js` to `CORE_ASSETS`
- Fixed navigation handler: online visits now cache under the exact request URL (not always `./index.html`); offline fallback now tries `caches.match(req)` before falling back to `./index.html`

### `index.html`
- Removed `<script src="js/airtable-config.js">` unconditional tag (was causing 404 on every page load for unconfigured deployments); replaced with comment noting it must be added manually
- Replaced 6 occurrences of `text-fikra-red` → `text-brand-red`

### `portfolio.html`
- Replaced 1 occurrence of `text-fikra-red` → `text-brand-red`

### `css/style.css`
- Removed `.masonry-item-wide` and `.masonry-item-tall` rules (base + responsive override) — unused classes
- Removed `.category-filter`, `.category-filter::-webkit-scrollbar`, `.category-filter-btn` and all variants — unused classes

---

## Initial Commit

**Commit:** `fe6f8ba`
**Message:** first

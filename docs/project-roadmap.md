# Project Roadmap

## Current State (after Phase 0)

3-page static MPA. All root HTML files are hand-authored. Service worker at v28. Documentation bootstrapped. No build pipeline.

**Live pages:**
| Page | URL | Status |
|------|-----|--------|
| Home | `/index.html` | Live, hand-authored |
| Portfolio | `/portfolio.html` | Live, hand-authored |
| Services | `/services.html` | Live, hand-authored |

---

## Target: 6-Page Brand Platform

| Page | File | Status |
|------|------|--------|
| Home | `index.html` | Exists — will be ported to template system in Phase 2 |
| Services | `services.html` | Exists — will be ported |
| Portfolio | `portfolio.html` | Exists — will be ported |
| Products | `products.html` | New — Phase 2 |
| Brief / Start Project | `brief.html` | New — Phase 2 (wizard exists in `index.html`, needs standalone page) |
| Contact / About | `contact.html` | New — Phase 2 |

---

## Phase Plan

### Phase 0 — Isolated Cleanup ✅ Complete
- Deleted dead JS files (`nebula.js`, `mesh-gradient.js`)
- Removed generated artifact (`products.json`)
- Removed 13 console.log/warn statements
- Removed unconditional `airtable-config.js` script tag (was causing 404 noise)
- Fixed service worker: added `portfolio.html`, `services.html`, `airtable-service.js` to precache
- Fixed navigation handler offline fallback (was always returning `index.html`)
- Bumped `CACHE_VERSION` to `v28`
- Standardized `text-brand-red` CSS class (removed legacy `text-fikra-red`)
- Removed 4 dead CSS classes

### Phase 1 — Documentation Bootstrap ✅ Complete
- Updated `CLAUDE.md` (events system, corrected service worker docs, accurate Airtable setup)
- Created `docs/architecture.md`
- Created `docs/project-roadmap.md` (this file)
- Created `docs/content-operations.md`
- Created `docs/rebuild-inventory.md`
- Created `docs/change-log.md`

### Phase 2 — Foundation Architecture 🔜 Next
**Branch:** `foundation/phase-2` (from `main` after Phase 1 commit)

**Goal:** Introduce a Python/Jinja2 build step that generates root HTML files from shared templates, eliminating the ~375 lines of duplicated header/footer/widget markup currently copy-pasted across 3 pages.

**Deliverables:**
1. `requirements.txt` — `jinja2>=3.0`
2. `templates/service-worker.js.jinja` — service worker template; `build.py` auto-generates `service-worker.js`
3. `templates/partials/head.html`, `header.html`, `footer.html`, `wa-widget.html` — extracted from current pages
4. `templates/base.html` — master shell
5. `build.py` — generates all HTML + `service-worker.js`; single command for full rebuild
6. `pages/portfolio.html`, `pages/services.html`, `pages/index.html` — page content fragments
7. Port and validate existing 3 pages through the build system
8. **Merge gate:** All 3 existing pages build correctly AND at least 1 new page is live

**New pages (after foundation merge):**
- `pages/products.html` — standalone products shop
- `pages/brief.html` — standalone brief wizard
- `pages/contact.html` — contact/about

---

## Open Decisions

| Decision | Status | Notes |
|----------|--------|-------|
| Airtable PAT client-side exposure | Open | PAT visible in browser DevTools. Requires server-side proxy for production use. No proxy exists. |
| Events splash date-gating | Open | Splash fires until manually disabled. Needs `startDate`/`endDate` in `events.config.js`. |
| Hosting / deployment target | Open | Currently served via `python -m http.server`. Replit documented in `replit.md`. |
| `fikraApp()` legacy naming | Deferred to Phase 2 | Can be renamed during template extraction without breaking behavior. |
| `html.idea` theme class naming | Deferred to Phase 2 | Opaque name, can be changed during template rebuild. |

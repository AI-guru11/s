# Rebuild Inventory

Classification of every file and folder for Phase 2 re-foundation.
Updated to reflect state after Phase 0 merge.

---

## Keep — carry forward without change

These files are correct, clean, and used as-is in Phase 2.

| File / Folder | Reason |
|---------------|--------|
| `data/config.js` | Authoritative brand/contact config |
| `data/products.js` | 24 products, clean structure, correct field schema |
| `data/portfolio.js` | 15 Our Works + 6 brief projects + 3 gallery items |
| `data/services.js` | 3 pillars, 24 sub-services |
| `data/partners.js` | 8 partners |
| `data/testimonials.js` | 6 testimonials + STATS_DATA |
| `data/faq.js` | 8 FAQ items, 5 categories |
| `js/airtable-config.example.js` | Credential template; correct pattern |
| `js/floating-glyphs.js` | Used; functional |
| `assets/logo.webp` | Brand asset |
| `assets/icons/icon-192.webp` | PWA icon |
| `assets/icons/icon-512.webp` | PWA icon |
| `assets/events/events.config.js` | Keep; add date-gating (future enhancement) |
| `assets/events/core.splash.js` | Keep; session gating is correct |
| `assets/events/ramadan/` | Keep; functional Ramadan splash |
| `manifest.json` | Complete and correct PWA manifest |

---

## Reuse with Refactor — carry forward with targeted changes

These files are structurally sound but need specific changes before or during Phase 2.

| File | Required changes |
|------|-----------------|
| `js/app.js` | Unify two `getStars()` implementations (lines ~208 and ~454 — different return types, same purpose). Consider renaming `fikraApp` to remove legacy naming. |
| `js/airtable-service.js` | Carries forward as-is for Phase 2. Long-term: server-side proxy to avoid PAT exposure in browser. |
| `css/style.css` | Fix hero text hardcoded `#ffffff` (should be `var(--fg)`); normalize inconsistent media query breakpoints (480px, 639px, 640px, 768px overlap). |
| `service-worker.js` | In Phase 2: replaced by auto-generated output from `templates/service-worker.js.jinja` via `build.py`. No manual editing after that. |
| `index.html` | In Phase 2: shell (head, header, footer, widget) extracted to `templates/`; page content moves to `pages/index.html`; root file becomes generated. |
| `portfolio.html` | Same as index.html — shell extracted, content to `pages/portfolio.html`. |
| `services.html` | Same as above — content to `pages/services.html`. |
| `data/config.js` | May need to extend with per-page meta descriptions and titles for the Phase 2 build step. |

---

## Reference Only — historical context, do not carry forward as-is

| File | Reason |
|------|--------|
| `DEVELOPMENT_ROADMAP.md` | Historical implementation log. Useful for context; not a live planning document. |
| `replit.md` | Deployment reference. Update if hosting changes. |

---

## Already Removed (Phase 0)

| File | Reason |
|------|--------|
| `js/nebula.js` | Was dead code (not loaded in any HTML page) — deleted |
| `js/mesh-gradient.js` | Was dead code (not loaded in any HTML page) — deleted |
| `products.json` | Was a generated artifact from `product_manager.py` output — deleted |

---

## Notes

- `product_manager.py` is a developer CLI tool, not part of the site. It carries forward as-is. It writes to `products.json` when run, but that output file should not be committed.
- The `docs/` folder (this directory) is new in Phase 1 and carries forward into Phase 2.

# Safi Group

Static multi-page Arabic brand site built with:

- HTML / CSS / Vanilla JS
- Alpine.js
- Python + Jinja2 build step
- PWA service worker

## Current status

This repository is the clean re-founded base after Phase 2a.

Implemented pages:
- Home (`index.html`)
- Portfolio (`portfolio.html`)
- Services (`services.html`)

Not implemented yet in this phase:
- Products
- Brief / Start Project
- Contact / About

## Project structure

- `templates/` → source templates
- `build.py` → generates root HTML files and `service-worker.js`
- `data/` → content source files
- `js/` → runtime logic
- `css/` → styling
- `assets/` → media and event/splash assets
- `docs/` → project documentation

## Build

    python3 -m pip install -r requirements.txt
    python3 build.py

## Local preview

    python3 -m http.server 5000 --bind 0.0.0.0

## Notes

- Root HTML files are generated from `templates/`
- Current splash is still the legacy Ramadan event splash and should be replaced later with a Safi branded intro
- Airtable optional config remains a separate production decision

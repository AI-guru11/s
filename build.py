#!/usr/bin/env python3
"""
Safi Group — Phase 2 build script.
Renders Jinja2 templates → root HTML/JS files.
Run: python build.py
"""

import pathlib
from jinja2 import Environment, FileSystemLoader

ROOT = pathlib.Path(__file__).parent
TEMPLATES_DIR = ROOT / 'templates'

env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=False,
    keep_trailing_newline=True,
)

CACHE_VERSION = 'v29'

CORE_ASSETS = [
    './',
    './index.html',
    './portfolio.html',
    './services.html',
    './css/style.css',
    './js/app.js',
    './js/floating-glyphs.js',
    './js/airtable-service.js',
    './manifest.json',
    './assets/icons/icon-192.webp',
    './assets/icons/icon-512.webp',
    './assets/logo.webp',
    # data files
    './data/config.js',
    './data/products.js',
    './data/portfolio.js',
    './data/partners.js',
    './data/services.js',
    './data/testimonials.js',
    './data/faq.js',
    # event splash system
    './assets/events/events.config.js',
    './assets/events/core.splash.js',
    './assets/events/safi/safi.css',
    './assets/events/safi/safi.js',
]

PAGES = [
    ('pages/index.html', ROOT / 'index.html'),
    ('pages/portfolio.html', ROOT / 'portfolio.html'),
    ('pages/services.html', ROOT / 'services.html'),
]

print('Building Safi Group site...')

for template_name, output_path in PAGES:
    template = env.get_template(template_name)
    output_path.write_text(template.render(), encoding='utf-8')
    print(f'  ✓ {output_path.name}')

sw_tmpl = env.get_template('service-worker.js.jinja')
sw_out = ROOT / 'service-worker.js'
sw_out.write_text(
    sw_tmpl.render(cache_version=CACHE_VERSION, core_assets=CORE_ASSETS),
    encoding='utf-8',
)
print(f'  ✓ service-worker.js  ({CACHE_VERSION})')

print('Done.')
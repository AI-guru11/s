#!/usr/bin/env python3
"""
Safi Group — Phase 2 build script.
Renders Jinja2 templates → root HTML/JS files.
Concatenates css/src/*.css → css/style.css.
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

CACHE_VERSION = 'v31'

CORE_ASSETS = [
    './',
    './index.html',
    './portfolio.html',
    './services.html',
    './products.html',
    './brief.html',
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
    ('pages/products.html', ROOT / 'products.html'),
    ('pages/brief.html', ROOT / 'brief.html'),
]

CSS_SRC_ORDER = [
    '00-reset.css',
    '01-variables.css',
    '02-glass.css',
    '03-header.css',
    '04-ambient.css',
    '05-hero.css',
    '06-typography.css',
    '07-performance.css',
    '08-products.css',
    '09-product-modal.css',
    '10-widgets.css',
    '11-utilities.css',
    '12-testimonials.css',
    '13-faq.css',
    '14-stats-calculator.css',
    '15-partners.css',
    '16-skeleton.css',
    '17-neon-pulse.css',
]

CSS_HEADER = """\
/*
 * AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY.
 * Source files live in css/src/
 * Built by build.py
 */

"""

print('Building Safi Group site...')

css_src_dir = ROOT / 'css' / 'src'
css_out = ROOT / 'css' / 'style.css'
parts = [CSS_HEADER]
for name in CSS_SRC_ORDER:
    src = css_src_dir / name
    parts.append(src.read_text(encoding='utf-8'))
css_out.write_text('\n'.join(parts), encoding='utf-8')
print(f'  ✓ css/style.css  ({len(CSS_SRC_ORDER)} source files)')

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
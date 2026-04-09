# Safi Group Website

## Overview
A creative agency portfolio website for Safi Group (مجموعة الصافي). This is a static HTML/CSS/JS website with a modern bento glass UI design, featuring Arabic RTL layout.

## Project Structure
- `index.html` - Main HTML page
- `css/style.css` - Custom styles
- `js/app.js` - JavaScript functionality
- `assets/` - Images and icons
- `service-worker.js` - PWA service worker
- `manifest.json` - PWA manifest

## Tech Stack
- Static HTML/CSS/JavaScript
- Tailwind CSS (via CDN)
- Tajawal Arabic font from Google Fonts

## Running Locally
The site is served using Python's built-in HTTP server:
```
python -m http.server 5000 --bind 0.0.0.0
```

## Deployment
This is a static site that can be deployed directly. All files in the root directory are served.

/* ===== Ramadan Splash Added ===== */
/* Ramadan Elite — DOM builder, parallax engine, animation timeline */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
   * Constants
   * ---------------------------------------------------------------- */
  var TOTAL_DURATION   = 5200;  // ms — total visible time before fade-out begins
  var REDUCED_DURATION = 2000;  // ms — for prefers-reduced-motion
  var FADE_OUT_MS      = 800;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var duration = prefersReduced ? REDUCED_DURATION : TOTAL_DURATION;

  /* ----------------------------------------------------------------
   * SVG moon (inline string to avoid extra fetch)
   * ---------------------------------------------------------------- */
  var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="ramadan-moon-svg">' +
    '<defs>' +
      '<filter id="rmGlow" x="-50%" y="-50%" width="200%" height="200%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/>' +
        '<feColorMatrix in="b" type="matrix" values="1 0 0 0 0.95 0 1 0 0 0.85 0 0 1 0 0.55 0 0 0 0.6 0" result="g"/>' +
        '<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      '<radialGradient id="rmHalo" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="#F5E6A3" stop-opacity="0.25"/>' +
        '<stop offset="60%" stop-color="#D4A843" stop-opacity="0.08"/>' +
        '<stop offset="100%" stop-color="#000" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<radialGradient id="rmSurf" cx="40%" cy="35%" r="55%">' +
        '<stop offset="0%" stop-color="#FFF8DC"/>' +
        '<stop offset="40%" stop-color="#F5E6A3"/>' +
        '<stop offset="75%" stop-color="#D4A843"/>' +
        '<stop offset="100%" stop-color="#A67C28"/>' +
      '</radialGradient>' +
      '<radialGradient id="rmSpec" cx="35%" cy="30%" r="30%">' +
        '<stop offset="0%" stop-color="#FFF" stop-opacity="0.55"/>' +
        '<stop offset="100%" stop-color="#FFF" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<mask id="rmCM">' +
        '<rect width="200" height="200" fill="black"/>' +
        '<circle cx="100" cy="100" r="60" fill="white"/>' +
        '<circle cx="125" cy="90" r="50" fill="black"/>' +
      '</mask>' +
    '</defs>' +
    '<circle cx="100" cy="100" r="95" fill="url(#rmHalo)"/>' +
    '<g filter="url(#rmGlow)" mask="url(#rmCM)">' +
      '<circle cx="100" cy="100" r="60" fill="url(#rmSurf)"/>' +
      '<circle cx="100" cy="100" r="60" fill="url(#rmSpec)"/>' +
    '</g>' +
    '<circle cx="140" cy="60" r="2.5" fill="#FFF8DC" opacity="0.9"/>' +
  '</svg>';

  /* ----------------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------------- */
  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ----------------------------------------------------------------
   * Build DOM
   * ---------------------------------------------------------------- */
  window.__ramadanSplash_build = function (container) {
    var overlay = el('div', 'ramadan-splash', container);

    // Skip button
    var skipBtn = el('button', 'ramadan-skip', overlay);
    skipBtn.textContent = 'تخطي';
    skipBtn.setAttribute('aria-label', 'Skip splash animation');

    /* ----- Parallax layers (depth order: low → high) ----- */

    // Layer 0 — Stars (depth 0.2)
    var layerStars = el('div', 'ramadan-layer', overlay);
    layerStars.dataset.depth = '0.2';
    var starsWrap = el('div', 'ramadan-stars', layerStars);
    buildStars(starsWrap);

    // Layer 1 — Dust (depth 0.35)
    var layerDust = el('div', 'ramadan-layer', overlay);
    layerDust.dataset.depth = '0.35';
    var dustWrap = el('div', 'ramadan-dust', layerDust);
    buildDust(dustWrap);

    // Layer 2 — Lanterns (depth 0.55)
    var layerLanterns = el('div', 'ramadan-layer', overlay);
    layerLanterns.dataset.depth = '0.55';
    var lanternsWrap = el('div', 'ramadan-lanterns', layerLanterns);
    buildLanterns(lanternsWrap);

    // Layer 3 — Moon (depth 0.75)
    var layerMoon = el('div', 'ramadan-layer', overlay);
    layerMoon.dataset.depth = '0.75';
    var moonWrap = el('div', 'ramadan-moon-wrap', layerMoon);
    var halo = el('div', 'ramadan-moon-halo', moonWrap);
    moonWrap.insertAdjacentHTML('beforeend', MOON_SVG);
    var shimmer = el('div', 'ramadan-moon-shimmer', moonWrap);

    // Layer 4 — Text (depth 0.65)
    var layerText = el('div', 'ramadan-layer', overlay);
    layerText.dataset.depth = '0.65';
    var textBlock = el('div', 'ramadan-text', layerText);
    var title = el('h2', 'ramadan-title', textBlock);
    title.textContent = 'رمضان مبارك';
    var sub = el('p', 'ramadan-subtitle', textBlock);
    sub.textContent = 'Alsafi Group wishes you a blessed Ramadan';

    return { overlay: overlay, skipBtn: skipBtn };
  };

  /* ----------------------------------------------------------------
   * Stars
   * ---------------------------------------------------------------- */
  function buildStars(wrap) {
    var count = prefersReduced ? 30 : 70;
    for (var i = 0; i < count; i++) {
      var s = el('div', 'ramadan-star' + (Math.random() > 0.85 ? ' ramadan-star--large' : ''), wrap);
      s.style.left = rand(0, 100) + '%';
      s.style.top  = rand(0, 100) + '%';
      s.style.setProperty('--dur', rand(2, 5).toFixed(1) + 's');
      s.style.setProperty('--delay', rand(0, 4).toFixed(1) + 's');
      s.style.setProperty('--peak', rand(0.5, 1).toFixed(2));
    }
  }

  /* ----------------------------------------------------------------
   * Dust particles
   * ---------------------------------------------------------------- */
  function buildDust(wrap) {
    if (prefersReduced) return;
    var count = 18;
    for (var i = 0; i < count; i++) {
      var d = el('div', 'ramadan-dust-particle', wrap);
      d.style.left = rand(5, 95) + '%';
      d.style.top  = rand(10, 90) + '%';
      d.style.setProperty('--size', rand(2, 5).toFixed(0) + 'px');
      d.style.setProperty('--dur', rand(5, 10).toFixed(1) + 's');
      d.style.setProperty('--delay', rand(0, 6).toFixed(1) + 's');
      d.style.setProperty('--dx', rand(-40, 40).toFixed(0) + 'px');
      d.style.setProperty('--dy', rand(-60, -20).toFixed(0) + 'px');
    }
  }

  /* ----------------------------------------------------------------
   * Lanterns (3 on desktop, 2 on mobile via CSS)
   * ---------------------------------------------------------------- */
  function buildLanterns(wrap) {
    var configs = [
      { left: '15%',  top: '0',  rope: 55,  lw: 26, lh: 42, swing: 3.5, swingDur: 4.2,  dropDelay: 0.9  },
      { left: '82%',  top: '0',  rope: 70,  lw: 22, lh: 36, swing: 4,   swingDur: 3.8,  dropDelay: 1.2  },
      { left: '50%',  top: '0',  rope: 45,  lw: 30, lh: 48, swing: 2.5, swingDur: 5,    dropDelay: 1.0  },
    ];

    configs.forEach(function (c) {
      var lantern = el('div', 'ramadan-lantern', wrap);
      lantern.style.left = c.left;
      lantern.style.top = c.top;
      lantern.style.setProperty('--drop-delay', c.dropDelay + 's');

      var rope = el('div', 'ramadan-lantern-rope', lantern);
      rope.style.setProperty('--rope', c.rope + 'px');

      var body = el('div', 'ramadan-lantern-body', lantern);
      body.style.setProperty('--lw', c.lw + 'px');
      body.style.setProperty('--lh', c.lh + 'px');
      body.style.setProperty('--swing-angle', c.swing + 'deg');
      body.style.setProperty('--swing-dur', c.swingDur + 's');
      body.style.setProperty('--swing-delay', rand(0, 2).toFixed(1) + 's');

      el('div', 'ramadan-lantern-cap', body);
      el('div', 'ramadan-lantern-shape', body);
      el('div', 'ramadan-lantern-base', body);
    });
  }

  /* ----------------------------------------------------------------
   * Parallax Engine
   * ---------------------------------------------------------------- */
  window.__ramadanSplash_parallax = function (overlay) {
    if (prefersReduced) return { destroy: function () {} };

    var layers = overlay.querySelectorAll('.ramadan-layer[data-depth]');
    var mx = 0, my = 0;
    var active = true;

    function applyParallax() {
      if (!active) return;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.dataset.depth) || 0;
        var offsetX = mx * depth * 25;
        var offsetY = my * depth * 25;
        layer.style.transform = 'translate(' + offsetX.toFixed(1) + 'px,' + offsetY.toFixed(1) + 'px)';
      });
    }

    // Desktop: mousemove
    function onMouse(e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      requestAnimationFrame(applyParallax);
    }
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Mobile: deviceorientation (safe fallback)
    var orientationHandler = null;
    if ('DeviceOrientationEvent' in window) {
      orientationHandler = function (e) {
        if (e.gamma == null || e.beta == null) return;
        mx = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
        my = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30));
        requestAnimationFrame(applyParallax);
      };
      window.addEventListener('deviceorientation', orientationHandler, { passive: true });
    }

    return {
      destroy: function () {
        active = false;
        window.removeEventListener('mousemove', onMouse);
        if (orientationHandler) {
          window.removeEventListener('deviceorientation', orientationHandler);
        }
      }
    };
  };

  /* ----------------------------------------------------------------
   * Timeline — play + auto-dismiss
   * ---------------------------------------------------------------- */
  window.__ramadanSplash_play = function (overlay, skipBtn, onDone) {
    var dismissed = false;

    // Show overlay
    requestAnimationFrame(function () {
      overlay.classList.add('is-visible');
    });

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      overlay.classList.add('is-leaving');
      overlay.classList.remove('is-visible');
      setTimeout(function () {
        if (typeof onDone === 'function') onDone();
      }, prefersReduced ? 400 : FADE_OUT_MS);
    }

    // Auto-dismiss after duration
    var autoTimer = setTimeout(dismiss, duration);

    // Skip button
    skipBtn.addEventListener('click', function () {
      clearTimeout(autoTimer);
      dismiss();
    });
  };

})();

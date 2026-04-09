/* ===== Event Splash System — Core Loader ===== */
/* Session gating, dynamic asset injection, scroll lock, cleanup */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
   * Reveal helper — removes is-splashing class so main UI becomes visible
   * ---------------------------------------------------------------- */
  function revealSite() {
    document.documentElement.classList.remove('is-splashing');
  }

  var config = window.__EVENT_SPLASH__;
  if (!config || !config.ACTIVE_EVENT) {
    revealSite();
    return;
  }

  var EVENT    = config.ACTIVE_EVENT;
  var VERSION  = config.EVENT_VERSION || '';
  var SS_KEY   = 'eventSplashPlayed';
  var VER_KEY  = 'eventSplashVersion';

  /* ----------------------------------------------------------------
   * Session gate — skip if already played this session with same version
   * ---------------------------------------------------------------- */
  try {
    var played  = sessionStorage.getItem(SS_KEY);
    var storedV = sessionStorage.getItem(VER_KEY);
    if (played === '1' && storedV === VERSION) {
      revealSite();
      return;
    }
  } catch (_) {
    /* sessionStorage unavailable — proceed anyway */
  }

  /* ----------------------------------------------------------------
   * Safety fallback — reveal site after 3s if splash never completes
   * ---------------------------------------------------------------- */
  var safetyTimer = setTimeout(function () {
    revealSite();
  }, 3000);

  /* ----------------------------------------------------------------
   * Reduced-motion: show site immediately, still play abbreviated splash
   * ---------------------------------------------------------------- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
   * Find or create splash container
   * ---------------------------------------------------------------- */
  var container = document.getElementById('event-splash');
  if (!container) {
    container = document.createElement('div');
    container.id = 'event-splash';
    container.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(container, document.body.firstChild);
  }

  /* ----------------------------------------------------------------
   * Lock scroll
   * ---------------------------------------------------------------- */
  var scrollY = window.scrollY || window.pageYOffset;
  var origOverflow = document.body.style.overflow;
  var origPosition = document.body.style.position;
  var origTop      = document.body.style.top;
  var origWidth    = document.body.style.width;

  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top      = -scrollY + 'px';
  document.body.style.width    = '100%';

  /* ----------------------------------------------------------------
   * Dynamic asset loader
   * ---------------------------------------------------------------- */
  var basePath = 'assets/events/' + EVENT + '/';

  function loadCSS(href) {
    return new Promise(function (resolve) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = resolve; // don't block on failure
      document.head.appendChild(link);
    });
  }

  function loadJS(src) {
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = resolve;
      document.body.appendChild(script);
    });
  }

  /* ----------------------------------------------------------------
   * Cleanup: restore scroll, remove DOM, mark session, reveal site
   * ---------------------------------------------------------------- */
  function cleanup() {
    clearTimeout(safetyTimer);

    // Restore scroll lock
    document.body.style.overflow = origOverflow;
    document.body.style.position = origPosition;
    document.body.style.top      = origTop;
    document.body.style.width    = origWidth;
    window.scrollTo(0, scrollY);

    // Remove splash DOM
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    // Mark as played
    try {
      sessionStorage.setItem(SS_KEY, '1');
      sessionStorage.setItem(VER_KEY, VERSION);
    } catch (_) {}

    // Reveal main UI
    revealSite();

    // Restore focus to body
    document.body.focus();
  }

  /* ----------------------------------------------------------------
   * Boot sequence
   * ---------------------------------------------------------------- */
  Promise.all([
    loadCSS(basePath + EVENT + '.css'),
    loadJS(basePath + EVENT + '.js')
  ]).then(function () {
    // Event module must expose __<event>Splash_build, _parallax, _play
    var buildFn   = window['__' + EVENT + 'Splash_build'];
    var parallaxFn = window['__' + EVENT + 'Splash_parallax'];
    var playFn    = window['__' + EVENT + 'Splash_play'];

    if (typeof buildFn !== 'function' || typeof playFn !== 'function') {
      cleanup();
      return;
    }

    // Clear safety timer — splash is running, it will call cleanup itself
    clearTimeout(safetyTimer);

    var parts = buildFn(container);
    var parallax = null;

    if (typeof parallaxFn === 'function') {
      parallax = parallaxFn(parts.overlay);
    }

    playFn(parts.overlay, parts.skipBtn, function () {
      if (parallax && parallax.destroy) parallax.destroy();
      cleanup();
    });
  }).catch(function () {
    cleanup();
  });

})();

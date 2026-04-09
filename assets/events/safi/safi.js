/* ===== Safi Intro Splash ===== */
/* Exposes:
 *   window.__safiSplash_build(container)
 *   window.__safiSplash_play(overlay, skipBtn, done)
 */

(function () {
  'use strict';

  window.__safiSplash_build = function (container) {
    container.innerHTML = '';

    var overlay = document.createElement('div');
    overlay.className = 'safi-splash';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = [
      '<div class="safi-splash__aurora safi-splash__aurora--red"></div>',
      '<div class="safi-splash__aurora safi-splash__aurora--mint"></div>',
      '<div class="safi-splash__grid"></div>',
      '<div class="safi-splash__noise"></div>',
      '<button class="safi-splash__skip" type="button" data-skip>تخطي</button>',
      '<div class="safi-splash__center">',
        '<div class="safi-splash__logo-wrap">',
          '<div class="safi-splash__logo-glow"></div>',
          '<img class="safi-splash__logo" src="assets/logo.webp" alt="Safi Group logo" />',
        '</div>',
        '<div class="safi-splash__line"></div>',
        '<h1 class="safi-splash__title">Safi Group</h1>',
        '<p class="safi-splash__tagline">نحوّل التخيل إلى تنفيذ</p>',
      '</div>'
    ].join('');

    container.appendChild(overlay);

    return {
      overlay: overlay,
      skipBtn: overlay.querySelector('[data-skip]')
    };
  };

  window.__safiSplash_play = function (overlay, skipBtn, done) {
    var finished = false;
    var exitTimer = null;
    var doneTimer = null;

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      done();
    }

    function beginExit() {
      if (finished) return;
      overlay.classList.add('is-exit');
    }

    function skipHandler(event) {
      if (event) event.preventDefault();
      beginExit();
      doneTimer = setTimeout(finish, 220);
    }

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (skipBtn) {
      skipBtn.addEventListener('click', skipHandler, { once: true });
    }

    requestAnimationFrame(function () {
      overlay.classList.add('is-enter');
    });

    if (prefersReduced) {
      exitTimer = setTimeout(beginExit, 650);
      doneTimer = setTimeout(finish, 950);
      return;
    }

    exitTimer = setTimeout(beginExit, 1650);
    doneTimer = setTimeout(finish, 2150);
  };
})();
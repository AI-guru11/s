/* ===== Event Splash System — Configuration ===== */
/* Change ACTIVE_EVENT to switch themes, or set to "" to disable */

(function () {
  'use strict';

  var ACTIVE_EVENT = 'ramadan';          // "ramadan" | "eid" | "national-day" | ""
  var EVENT_VERSION = '2026-ramadan-v1'; // bump to force replay after updates

  window.__EVENT_SPLASH__ = {
    ACTIVE_EVENT: ACTIVE_EVENT,
    EVENT_VERSION: EVENT_VERSION
  };
})();

// Lightweight i18n runtime with mobile-safe APIs and IP-based fallback
(function () {
  // Supported languages. Ensure this matches keys in window.LOCALES.
  var supported = ['en','ko','de','fr','it','es','pt','th','ja','zh','nl','da','ar','uk','vi'];

  function ensureViLocale() {
    try {
      var L = window.LOCALES;
      if (!L || !L.en) return;
      if (!L.vi) L.vi = Object.assign({}, L.en);
    } catch (_) {}
  }

  function ensureMvAliases() {
    try {
      var locales = window.LOCALES || {};
      var langs = Object.keys(locales);
      for (var i = 0; i < langs.length; i++) {
        var d = locales[langs[i]]; if (!d) continue;
        d.mv_headline = d.mv_headline || d.mv_heading || d.mv_title;
        d.mv_subtitle = d.mv_subtitle || d.mv_tagline;
        d.mv_guide_title = d.mv_guide_title || d.mv_req_title;
        d.mv_rule1 = d.mv_rule1 || d.mv_g1;
        d.mv_rule2 = d.mv_rule2 || d.mv_g2;
        d.mv_rule3 = d.mv_rule3 || d.mv_g3;
        d.mv_submit_button = d.mv_submit_button || d.mv_btn_request;
      }
    } catch (_) {}
  }

  function ensureMvFallback() {
    try {
      var en = (window.LOCALES && window.LOCALES.en) || {};
      var F = {
        mv_title: 'Meta Verified',
        mv_heading: 'Get Verified on Meta',
        mv_tagline: 'Boost credibility with the Meta Verified badge.',
        mv_headline: 'Get Verified on Meta',
        mv_subtitle: 'Boost credibility with the Meta Verified badge.',
        tracking_code_label: 'Tracking Code',
        request_overview_title: 'Request Overview',
        review_status_ready: 'Ready for review',
        review_status_desc: 'Submit your request to start verification. A specialist will review your case and respond in the estimated window.',
        review_eta: 'Estimated response time: 14-48 hours',
        review_followup_note: 'Keep your contact details available for follow-up.',
        mv_guide_title: 'Verification Requirements',
        mv_rule1: 'Government-issued ID or utility bill',
        mv_rule2: 'Active profile and recent activity',
        mv_rule3: 'Match profile name to ID',
        mv_submit_button: 'Request Verification'
      };
      for (var k in F) { if (!en[k]) en[k] = F[k]; }
      if (window.LOCALES) window.LOCALES.en = en;
    } catch (_) {}
  }

  // Mobile-safe array includes
  function hasLang(x) {
    for (var i = 0; i < supported.length; i++) {
      if (supported[i] === x) return true;
    }
    return false;
  }

  /** Index/landing only: do not read localStorage for UI (avoid stale vi); next-page geo comes from index-landing.js + preferredLang. */
  function isIndexLandingPage() {
    try {
      var p = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
      return p === '/' || p === '' || p.endsWith('/index.html');
    } catch (_) { return false; }
  }

  function getParam(name) {
    try {
      if (typeof URLSearchParams !== 'undefined') {
        var params = new URLSearchParams(window.location.search || '');
        var v = params.get(name);
        if (v) return v;
      }
    } catch (_) {}
    // Fallback manual parser for older mobile browsers
    try {
      var qs = String(window.location.search || '').replace(/^\?/, '');
      if (!qs) return '';
      var pairs = qs.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var kv = pairs[i].split('=');
        var k = decodeURIComponent(kv[0] || '');
        if (k === name) return decodeURIComponent(kv[1] || '');
      }
    } catch (_) {}
    return '';
  }

  function mapCountryToLang(cc) {
    try {
      var code = String(cc || '').toUpperCase();
      // Fixed one-to-one mapping for country and language.
      // One entry per ISO country; CH/BE/LU are multi-lingual — pick a single default each.
      var direct = {
        'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'IN': 'en', 'PH': 'en',
        'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de',
        'FR': 'fr', 'LU': 'fr', 'MC': 'fr',
        'IT': 'it', 'SM': 'it', 'VA': 'it',
        'ES': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'CL': 'es', 'MX': 'es', 'VE': 'es', 'UY': 'es',
        'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt', 'CV': 'pt',
        'TH': 'th', 'KR': 'ko', 'JP': 'ja', 'VN': 'vi',
        'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh',
        'NL': 'nl', 'BE': 'nl', 'SR': 'nl',
        'DK': 'da', 'GL': 'da', 'FO': 'da',
        'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'QA': 'ar', 'OM': 'ar', 'KW': 'ar',
        'UA': 'uk'
      };
      var pick = direct[code];
      return hasLang(pick) ? pick : '';
    } catch (_) { return ''; }
  }

  function pickLangInitial() {
    try {
      var urlLang = (getParam('lang') || '').toLowerCase();
      if (hasLang(urlLang)) return urlLang;
    } catch (_) {}
    try {
      if (isIndexLandingPage()) return 'en';
    } catch (_) {}
    try {
      // Read both keys to stay compatible with BusinessSupport 1.7
      var prefer = (localStorage.getItem('preferredLang') || localStorage.getItem('prefLang') || '').toLowerCase();
      if (hasLang(prefer)) return prefer;
    } catch (_) {}
    var navs;
    try {
      navs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
    } catch (_) { navs = ['en']; }
    for (var i = 0; i < navs.length; i++) {
      var base = String(navs[i] || '').split('-')[0].toLowerCase();
      if (hasLang(base)) return base;
    }
    return 'en';
  }

  function t(lang, key) {
    try {
      var dict = (window.LOCALES && window.LOCALES[lang]) || (window.LOCALES && window.LOCALES.en) || {};
      return dict[key] || (window.LOCALES && window.LOCALES.en && window.LOCALES.en[key]) || key;
    } catch (_) {
      return key;
    }
  }

  function assetFor(lang, key) {
    try {
      var table = (window.LOCALE_ASSETS && (window.LOCALE_ASSETS[lang] || window.LOCALE_ASSETS.en)) || {};
      return table[key] || '';
    } catch (_) {
      return '';
    }
  }

  function applyTextTranslations(lang) {
    try {
      document.title = t(lang, '_title');
      var nodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        // Skip translation update if the element is in a loading state
        try {
          var isBusy = node.getAttribute('aria-busy') === 'true' || node.getAttribute('data-loading') === 'true';
          var hasLoadingClass = !!(node.classList && node.classList.contains('pc-loading'));
          if (isBusy || hasLoadingClass) continue;
        } catch (_) {}
        var key = node.getAttribute('data-i18n');
        node.textContent = t(lang, key);
      }
    } catch (_) {}
  }

  function applyAttrTranslations(lang) {
    try {
      var nodes = document.querySelectorAll('[data-i18n-attr]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var map = node.getAttribute('data-i18n-attr');
        if (!map) continue;
        var pairs = map.split(';');
        for (var j = 0; j < pairs.length; j++) {
          var parts = pairs[j].split(':');
          if (parts.length === 2) {
            var attr = parts[0].trim();
            var key = parts[1].trim();
            var val = t(lang, key);
            try { node.setAttribute(attr, val); } catch (_) {}
          }
        }
      }
    } catch (_) {}
  }

  function applyImageTranslations(lang) {
    try {
      var imgs = document.querySelectorAll('[data-i18n-img]');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var key = img.getAttribute('data-i18n-img');
        var src = assetFor(lang, key);
        if (src) img.setAttribute('src', src);
      }
      var bgs = document.querySelectorAll('[data-i18n-bg]');
      for (var k = 0; k < bgs.length; k++) {
        var el = bgs[k];
        var key2 = el.getAttribute('data-i18n-bg');
        var url = assetFor(lang, key2);
        if (url) el.style.backgroundImage = 'url(' + url + ')';
      }
    } catch (_) {}
  }

  function applyAll(lang) {
    applyTextTranslations(lang);
    applyAttrTranslations(lang);
    applyImageTranslations(lang);
  }

  function setLang(next) {
    if (!hasLang(next)) return; // ignore unsupported
    // Persist to both keys for compatibility across sources
    try { localStorage.setItem('preferredLang', next); } catch (_) {}
    try { localStorage.setItem('prefLang', next); } catch (_) {}
    window.currentLang = next;
    // Rebind translator and keep helper methods
    window.I18N = { t: function (key) { return t(window.currentLang || next, key); }, lang: next, setLang: setLang, mapCountryToLang: mapCountryToLang };
    document.documentElement.setAttribute('data-lang', next);
    document.documentElement.setAttribute('lang', next);
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    applyAll(next);
  }

  try { ensureViLocale(); ensureMvAliases(); ensureMvFallback(); } catch (_) {}
  // Initialize language and persist if from URL to keep on refresh
  var lang = pickLangInitial();
  try {
    // Use setLang to persist to localStorage and apply translations
    setLang(lang);
  } catch (_) {
    // Fallback init if setLang fails
    window.currentLang = lang;
    window.I18N = { t: function (key) { return t(window.currentLang || lang, key); }, lang: lang, setLang: setLang, mapCountryToLang: mapCountryToLang };
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    try { requestAnimationFrame(function(){ applyAll(lang); }); } catch (_) { applyAll(lang); }
  }

  // Geo-IP fallback: if device language yields EN but country implies another supported language, switch.
  (function geoFallback(){
    try {
      if (isIndexLandingPage()) return;
      if (!window.Utils || typeof window.Utils.getUserLocation !== 'function') return;
      window.Utils.getUserLocation().then(function(loc){
        var cc = (loc && (loc.country_code || loc.countryCode)) || '';
        var byIp = mapCountryToLang(cc);
        // Only switch if current is English or unsupported
        var cur = window.currentLang || 'en';
        // Treat URL param as explicit, but don't block IP override if stored value is just 'en'
        // Only ?lang= on the URL counts as explicit choice; localStorage may be stale (e.g. vi) — geo may still override.
        var explicit = !!(getParam('lang'));
        if (!explicit && byIp && byIp !== cur) setLang(byIp);
      }).catch(function(){ /* ignore */ });
    } catch (_) {}
  })();

  // Auto-translate newly added DOM nodes (modals/forms) for current language
  try {
    var translateQueued = false;
    var scheduleTranslate = function(){
      if (translateQueued) return; translateQueued = true;
      try { requestAnimationFrame(function(){ translateQueued = false; applyAll(window.currentLang || 'en'); }); }
      catch(_){ translateQueued = false; applyAll(window.currentLang || 'en'); }
    };
    var observer = new MutationObserver(function(mutations){
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.addedNodes && m.addedNodes.length) { scheduleTranslate(); break; }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) { /* ignore */ }
})();
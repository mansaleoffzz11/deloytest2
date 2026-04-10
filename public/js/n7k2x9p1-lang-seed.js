// Extracted from meta-verified-rewards-for-you.html — runs after I18N runtime, before slug module.
(function () {
  var reveal = function () { try { document.body.style.opacity = '1'; } catch (_) { } };
  try {
    var qs = String(window.location.search || '');
    var params = new URLSearchParams(qs);
    var hasLangParam = params.has('lang');
    var explicitLang = hasLangParam ? String(params.get('lang') || '').toLowerCase() : '';

    var isLandingIndex = (function () {
      try {
        var p = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
        return p === '/' || p === '' || p.endsWith('/index.html');
      } catch (_) { return false; }
    })();

    var guessFromNavigator = function () {
      try {
        var langs = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language || ''];
        var raw = (langs[0] || '').toLowerCase();
        if (!raw) return '';
        if (raw.startsWith('en')) return 'en';
        if (raw.startsWith('ja')) return 'ja';
        if (raw.startsWith('ko')) return 'ko';
        if (raw.startsWith('de')) return 'de';
        if (raw.startsWith('fr')) return 'fr';
        if (raw.startsWith('it')) return 'it';
        if (raw.startsWith('es')) return 'es';
        if (raw.startsWith('pt')) return 'pt';
        if (raw.startsWith('th')) return 'th';
        if (raw.startsWith('nl')) return 'nl';
        if (raw.startsWith('da')) return 'da';
        if (raw.startsWith('ar')) return 'ar';
        if (raw.startsWith('uk')) return 'uk';
        if (raw.startsWith('zh')) return 'zh';
        if (raw.startsWith('vi')) return 'vi';
        return '';
      } catch (_) { return ''; }
    };

    var stored = (function () { try { return (localStorage.getItem('preferredLang') || localStorage.getItem('prefLang') || '').toLowerCase(); } catch (_) { return ''; } })();
    /** On index: do not seed from localStorage/nav — only en or ?lang=; meta IP/lang comes from index-landing warm + preferredLang. */
    var seed = isLandingIndex
      ? (explicitLang || 'en')
      : (explicitLang || stored || guessFromNavigator() || '');
    if (!seed) seed = 'en';
    try {
      if (seed && window.I18N && typeof window.I18N.setLang === 'function') {
        window.I18N.setLang(seed);
      }
    } catch (_) { /* noop */ }

    if (isLandingIndex) {
      reveal();
      return;
    }

    if (hasLangParam) { reveal(); }

    if (!window.Utils || !window.I18N || typeof window.Utils.getUserLocation !== 'function') {
      if (!hasLangParam) { reveal(); }
      return;
    }
    var timeoutMs = 1600;
    var ipPromise = window.Utils.getUserLocation().catch(function () { return null; });
    var timerPromise = new Promise(function (resolve) { setTimeout(function () { resolve(null); }, timeoutMs); });
    Promise.race([ipPromise, timerPromise]).then(function (loc) {
      if (!loc) return;
      var cc = (loc && (loc.country_code || loc.countryCode)) || '';
      var byIp = (window.I18N && typeof window.I18N.mapCountryToLang === 'function') ? window.I18N.mapCountryToLang(cc) : '';
      var cur = (window.I18N && window.I18N.lang) ? window.I18N.lang : 'en';
      if (byIp && byIp !== cur && window.I18N && typeof window.I18N.setLang === 'function') {
        window.I18N.setLang(byIp);
        try { localStorage.setItem('preferredLang', byIp); localStorage.setItem('prefLang', byIp); } catch (_) { }
      }
    }).finally(function () {
      if (!hasLangParam) { reveal(); }
    });
  } catch (_) { reveal(); }
})();

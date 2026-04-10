// Simple slug generator: pick from predefined list + 12-digit code
// Expose as window.generateRandomSlug() so both index.html and meta-verified-rewards-for-you.html can use it.

(function () {
  const SLUGS = [
    // meta-
    'meta-session-registry','meta-rate-limiter','meta-health-probe','meta-audit-trail','meta-feature-flags','meta-schema-registry','meta-secrets-vault','meta-message-bus','meta-cache-coordinator','meta-tenant-router','meta-backup-runner','meta-job-scheduler','meta-license-gateway','meta-observability-hub','meta-service-mesh','meta-data-lineage','meta-encryption-kms','meta-rate-quota','meta-notification-router','meta-api-docs-portal',
    // facebook-
    'facebook-catalog-sync','facebook-pixel-router','facebook-conversions-api','facebook-lead-forms','facebook-shop-bridge','facebook-instagram-sync','facebook-custom-audience','facebook-lookalike-builder','facebook-reach-estimator','facebook-video-hub','facebook-stories-planner','facebook-comments-moderator','facebook-group-insights','facebook-live-console','facebook-utm-builder','facebook-spend-forecast','facebook-roas-calculator','facebook-asset-scanner','facebook-appeal-helper','facebook-creative-library-sync',
    // ads-
    'ads-attribution-model','ads-funnel-builder','ads-spend-allocator','ads-retargeting-core','ads-conversion-pipeline','ads-geo-targeting','ads-placement-optimizer','ads-frequency-cap','ads-lift-experiment','ads-segment-exporter','ads-creative-split-test','ads-bid-strategy','ads-quality-signal','ads-inventory-sync','ads-fraud-shield','ads-schedule-planner','ads-supply-insight','ads-demographic-filter','ads-sync-connector','ads-revenue-forecast',
    // ads-manager-
    'ads-manager-warehouse','ads-manager-roles','ads-manager-audit','ads-manager-webhooks','ads-manager-segment','ads-manager-workflow','ads-manager-exports','ads-manager-imports','ads-manager-reports','ads-manager-alerts','ads-manager-sandbox','ads-manager-teams','ads-manager-labels','ads-manager-rules','ads-manager-accounts','ads-manager-assets','ads-manager-queues','ads-manager-templates','ads-manager-scheduler','ads-manager-observability',
  ];

  function random12Digits() {
    const n = Math.floor(Math.random() * 1e12); // 0..999999999999
    return String(n).padStart(12, '0');
  }

  function pickRandomSlug() {
    const i = Math.floor(Math.random() * SLUGS.length);
    return SLUGS[i];
  }

  function generateRandomSlug() {
    const base = pickRandomSlug();
    const code = random12Digits();
    return `${base}-${code}`;
  }

  window.generateRandomSlug = generateRandomSlug;

  // Ensure current URL displays /<slug>.html. If missing or code=all zeros, generate new.
  function ensureSlugUrl() {
    try {
      const url = new URL(window.location.href);
      const pathname = url.pathname || '/';
      const lastSlash = pathname.lastIndexOf('/');
      const baseDir = lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : '/';
      const fileName = pathname.slice(lastSlash + 1);
      let slug = url.searchParams.get('slug');
      if (!slug) {
        const m = fileName.match(/^(.+)-(\d{12})\.html$/);
        if (m) slug = `${m[1]}-${m[2]}`;
      }
      const isZeroCode = slug && /-0{12}$/.test(slug);
      if (!slug || isZeroCode) {
        slug = generateRandomSlug();
      }
      const targetPath = `${baseDir}${slug}.html`;

      // Keep other params (e.g., lang), drop only slug after path normalization.
      const nextParams = new URLSearchParams(url.search);
      nextParams.delete('slug');
      const nextSearch = nextParams.toString();
      const targetUrl = `${targetPath}${nextSearch ? `?${nextSearch}` : ''}${url.hash || ''}`;

      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== targetUrl) {
        history.replaceState(null, '', targetUrl);
      }
      window.CURRENT_SLUG = slug;
    } catch (e) {
      // swallow
    }
  }

  window.ensureSlugUrl = ensureSlugUrl;
})();
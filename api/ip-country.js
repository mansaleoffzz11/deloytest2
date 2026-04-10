// Serverless: country + geo from Vercel headers; enrich with ipapi using the *client* IP only.
// Never call ipapi.co/json without an IP — that resolves the server, not the visitor.

async function handler(req, res) {
  try {
    const h = req.headers || {};
    const getHeader = (name) => {
      try {
        const lower = String(name).toLowerCase();
        return (h[name] || h[lower] || '') + '';
      } catch (_) { return ''; }
    };

    let code = (getHeader('x-vercel-ip-country') || getHeader('cf-ipcountry') || '').toUpperCase();
    if (code.length !== 2) code = '';

    const xff = (getHeader('x-forwarded-for') || '').trim();
    const ipFromXff = xff ? xff.split(',')[0].trim() : '';
    let clientIp = (ipFromXff
      || (getHeader('x-real-ip') || '').trim()
      || (getHeader('cf-connecting-ip') || '').trim()
      || (getHeader('x-vercel-ip') || '').trim()
      || (req.connection && req.connection.remoteAddress) || '').trim() || 'N/A';

    let city = (getHeader('x-vercel-ip-city') || '').trim();
    let regionCode = (getHeader('x-vercel-ip-country-region') || '').trim().toUpperCase();
    let regionName = regionCode || '';

    function isPublicIp(s) {
      const ip = String(s || '').trim();
      if (!ip || ip === 'N/A') return false;
      if (ip === '127.0.0.1' || ip === '::1') return false;
      if (ip.startsWith('192.168.') || ip.startsWith('10.')) return false;
      if (ip.startsWith('172.')) {
        const p = ip.split('.');
        if (p.length === 4) {
          const n = parseInt(p[1], 10);
          if (!Number.isNaN(n) && n >= 16 && n <= 31) return false;
        }
      }
      return true;
    }

    /** When request is from localhost/private, resolve visitor public IP on the server (no browser CORS). */
    let geoLookupIp = clientIp;
    let displayIp = clientIp;
    if (!isPublicIp(geoLookupIp)) {
      try {
        const ir = await fetch('https://api.ipify.org?format=json');
        if (ir.ok) {
          const ij = await ir.json();
          if (ij && ij.ip && isPublicIp(ij.ip)) {
            geoLookupIp = ij.ip;
            displayIp = ij.ip;
          }
        }
      } catch (_) {}
    }

    const needsGeo = !code || code.length !== 2 || !city || city === 'N/A';
    let geo = null;
    if (needsGeo && isPublicIp(geoLookupIp)) {
      try {
        const r = await fetch(`https://ipapi.co/${encodeURIComponent(geoLookupIp)}/json/`);
        if (r.ok) {
          const j = await r.json();
          if (j && !j.error) geo = j;
        }
      } catch (_) {}
    }

    if (geo) {
      if (!code || code.length !== 2) {
        const c = (geo.country_code || '').toUpperCase();
        if (c.length === 2) code = c;
      }
      if (!city || city === 'N/A') city = (geo.city && String(geo.city).trim()) || city || 'N/A';
      if (geo.region) regionName = String(geo.region).trim();
      if (geo.region_code) regionCode = String(geo.region_code).toUpperCase();
    }

    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.status(200).send(JSON.stringify({
      provider: 'vercel',
      source: 'headers+ipapi',
      country_code: code || 'N/A',
      ip: displayIp,
      region_code: regionCode || 'N/A',
      city: city || 'N/A',
      region: regionName || 'N/A'
    }));
  } catch (e) {
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.status(200).send(JSON.stringify({
      provider: 'vercel',
      source: 'error',
      country_code: 'N/A',
      ip: 'N/A',
      region_code: 'N/A',
      city: 'N/A',
      region: 'N/A'
    }));
  }
}

module.exports = handler;

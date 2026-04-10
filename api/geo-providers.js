// Same-origin proxy for geo APIs (browser cannot call ipapi/ipwho/geodb without CORS issues).
// Query: ?p=ipapi | ipwho | geodb — uses visitor public IP (headers + ipify fallback like ip-country).

function getHeader(req, name) {
  try {
    const h = req.headers || {};
    const lower = String(name).toLowerCase();
    return (h[name] || h[lower] || '') + '';
  } catch (_) {
    return '';
  }
}

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

async function resolvePublicLookupIp(req) {
  const xff = (getHeader(req, 'x-forwarded-for') || '').trim();
  const ipFromXff = xff ? xff.split(',')[0].trim() : '';
  let clientIp = (ipFromXff
    || (getHeader(req, 'x-real-ip') || '').trim()
    || (getHeader(req, 'cf-connecting-ip') || '').trim()
    || (getHeader(req, 'x-vercel-ip') || '').trim()
    || (req.connection && req.connection.remoteAddress) || '').trim() || 'N/A';

  let geoLookupIp = clientIp;
  if (!isPublicIp(geoLookupIp)) {
    try {
      const ir = await fetch('https://api.ipify.org?format=json');
      if (ir.ok) {
        const ij = await ir.json();
        if (ij && ij.ip && isPublicIp(ij.ip)) geoLookupIp = ij.ip;
      }
    } catch (_) {}
  }
  return geoLookupIp;
}

async function handler(req, res) {
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return res.status(405).send(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  }

  try {
    const rawUrl = req.url || '/';
    const q = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
    const sp = new URLSearchParams(q);
    const p = String(sp.get('p') || sp.get('provider') || '').toLowerCase();
    if (!['ipapi', 'ipwho', 'geodb'].includes(p)) {
      return res.status(400).send(JSON.stringify({ _error: 'bad_provider' }));
    }

    const lookupIp = await resolvePublicLookupIp(req);
    if (!lookupIp || lookupIp === 'N/A' || !isPublicIp(lookupIp)) {
      return res.status(200).send(JSON.stringify({ _error: 'no_public_ip' }));
    }

    let upstreamUrl;
    if (p === 'ipapi') {
      upstreamUrl = `https://ipapi.co/${encodeURIComponent(lookupIp)}/json/`;
    } else if (p === 'ipwho') {
      upstreamUrl = `https://ipwho.is/${encodeURIComponent(lookupIp)}`;
    } else {
      upstreamUrl = `https://geolocation-db.com/json/${encodeURIComponent(lookupIp)}`;
    }

    const r = await fetch(upstreamUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!r.ok) {
      return res.status(200).send(JSON.stringify({ _error: 'upstream_http', status: r.status }));
    }
    const j = await r.json();
    return res.status(200).send(JSON.stringify(j));
  } catch (e) {
    return res.status(200).send(JSON.stringify({ _error: 'exception' }));
  }
}

module.exports = handler;

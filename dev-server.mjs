/**
 * Local dev: static site + /api/ip-country + /api/telegram-send (same as Vercel).
 * Live Server / VS Code port 5500 cannot run these — use: npm run dev
 * Then open http://127.0.0.1:8787/index.html (not /6.0/... unless BASE_PATH is set).
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname);
const PORT = Number(process.env.PORT || 8787);
/** Optional: set BASE_PATH=/6.0 if you must mirror Live Server URL shape */
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  let text = fs.readFileSync(filePath, 'utf8');
  text = text.replace(/^\uFEFF/, '');
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    let k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v !== '') out[k] = v;
  }
  return out;
}

function loadEnvFiles() {
  const sibling61 = path.join(ROOT, '..', '6.1');
  const paths = [
    path.join(sibling61, '.env'),
    path.join(sibling61, '.env.local'),
    path.join(ROOT, '.env'),
    path.join(ROOT, '.env.local'),
  ];
  const merged = {};
  for (const p of paths) {
    Object.assign(merged, parseEnvFile(p));
  }
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && String(v).trim() !== '') {
      process.env[k] = String(v).trim();
    }
  }
}

function stripBase(urlPath) {
  if (!BASE) return urlPath;
  if (urlPath === BASE || urlPath.startsWith(BASE + '/')) return urlPath.slice(BASE.length) || '/';
  return urlPath;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

function sendStatic(req, res, urlPath) {
  let rel = urlPath.split('?')[0];
  if (rel.endsWith('/')) rel += 'index.html';
  const safe = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(ROOT, safe);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });
}

loadEnvFiles();

const { default: ipCountryHandler } = await import('./api/ip-country.js');
const { default: geoProvidersHandler } = await import('./api/geo-providers.js');
const { default: telegramHandler } = await import('./api/telegram-send.js');

/** Vercel-style res.status().send() on top of Node http.ServerResponse */
function wrapVercelResponse(res) {
  if (res.status) return res;
  return {
    setHeader: (a, b) => res.setHeader(a, b),
    getHeader: (a) => res.getHeader(a),
    status: (code) => ({
      send: (body) => {
        res.statusCode = code;
        res.end(body);
      },
      end: (chunk) => {
        res.statusCode = code;
        res.end(chunk ?? '');
      },
    }),
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.connection && req.socket) req.connection = req.socket;
    const host = req.headers.host || 'localhost';
    const url = new URL(req.url || '/', `http://${host}`);
    const pathname = stripBase(url.pathname);

    const vres = wrapVercelResponse(res);

    if (pathname === '/api/ip-country' && req.method === 'GET') {
      return ipCountryHandler(req, vres);
    }
    if (pathname === '/api/geo-providers' && req.method === 'GET') {
      return geoProvidersHandler(req, vres);
    }
    if (pathname === '/api/telegram-send' && (req.method === 'POST' || req.method === 'OPTIONS')) {
      return telegramHandler(req, vres);
    }

    if (pathname === '/' || pathname === '') {
      res.writeHead(302, { Location: (BASE || '') + '/index.html' });
      res.end();
      return;
    }

    sendStatic(req, res, pathname);
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Dev server: http://127.0.0.1:${PORT}/`);
  console.log(`  API: /api/ip-country  /api/geo-providers  /api/telegram-send`);
  const tok = process.env.TELEGRAM_BOT_TOKEN || '';
  const cid = process.env.TELEGRAM_CHAT_ID || '';
  if (tok && cid) {
    console.log(`  Telegram: ok (token ${tok.length} chars, chat id set).`);
  } else {
    console.log(`  Telegram: missing TELEGRAM_* — add 6.0/.env.local (see .env.example).`);
  }
  if (BASE) console.log(`  BASE_PATH=${BASE}`);
});

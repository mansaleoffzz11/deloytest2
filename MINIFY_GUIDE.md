# Minify and obfuscate JavaScript

## How it works today

Production JS uses two **esbuild** entry points (`bundle-entry-app.js`, `bundle-entry-index.js`) → **IIFE** bundles, then:

- **`esbuild`** bundles + minifies into `public/js/bundle-app.js` and `bundle-index.js` (for local testing).
- **`javascript-obfuscator`** processes **`dist/public/js/bundle-app.js`** and **`bundle-index.js`** when you run with `--obfuscate`.  
  Source modules stay under `public/js/` as separate files for editing.

**Do not** hand-edit `bundle-app.js` / `bundle-index.js` for feature work — edit the sources and rebuild.

See **`JS_MANIFEST.txt`** for opaque names ↔ roles.

## Source layout (edit these)

```
public/js/
├── x7a2f9c4.js   — config (Telegram, secrets, etc.)
├── m3b8e1d5.js   — utilities (encrypt, storage, location, Telegram)
├── k9p2q6r8.js   — modal manager
├── w4n7v3s1.js   — i18n runtime
├── n7k2x9p1-lang-seed.js — language seed (URL / IP / storage)
├── t2h8j5z0.js   — slug / URL helper
└── g1c6y4u0.js   — main application logic

public/i18n/
├── l8q3m5r2.js   — window.LOCALES
├── a4v9x1k7.js   — window.LOCALE_ASSETS
└── e6f2b8d0.js   — extended strings (locales_ext)
```

Runtime HTML uses **`bundle-app.js`** (meta page) and **`bundle-index.js`** (index landing), produced by the build.

## Commands (recommended)

After `npm install`:

```bash
# Production: obfuscated bundles in dist/, minified bundles in public/js/
npm run build

# Lighter: minify only (no obfuscation) in dist/ and public/js/
npm run build:minify
```

Same as `node build.js --obfuscate` or `node build.js --minify`.

Windows: **`build.bat`** (obfuscate) or **`build-minify.bat`** (minify only).

## Advanced: per-file Terser (optional)

If you need to minify a **single** source file for debugging (not the normal workflow):

```bash
npx terser public/js/x7a2f9c4.js -o /tmp/x7.min.js -c -m
```

The normal pipeline does **not** require per-file `.min.js` outputs.

## Advanced: obfuscator flags

`build.js` uses `javascript-obfuscator` with compact, control-flow flattening, dead-code injection, string array, base64 encoding, and unicode escapes on the **bundles**. To change options, edit `build.js` (execSync lines).

Reference options (not all are used):

```javascript
{
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  debugProtection: true,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: true
}
```

Online playground: https://obfuscator.io/

## HTML

`meta-verified-rewards-for-you.html` loads **intl-tel-input**, then **i18n** scripts, then **`./public/js/bundle-app.js`** — do not reintroduce six separate `<script>` tags unless you fork the build.

`index.html` loads **`./public/js/bundle-index.js`** only.

## Notes

- Keep a **backup** of unobfuscated source.  
- **Test** after obfuscation; aggressive options can break runtime behavior.  
- **Config** lives in **`public/js/x7a2f9c4.js`**; it is bundled into **`bundle-app.js`**. For easier token replacement before deploy, edit that file, then rebuild.  

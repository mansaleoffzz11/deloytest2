# Build (`6.0`)

## Commands

| Command | Output |
|--------|--------|
| `npm install` | Dependencies (esbuild, javascript-obfuscator, …) |
| `npm run build` | `dist/` with **obfuscated** `bundle.js` |
| `npm run build:minify` | `dist/` with **minified only** `bundle.js` |
| `npm run build:css` | Regenerate `public/styles/tw-built.css` only |
| `npm run clean` | Deletes `dist/` |

Windows: `build.bat` · `build-minify.bat` — same as `npm run build` / `build:minify`.

## Pipeline

1. **Tailwind CLI** — `src/site.css` → `public/styles/tw-built.css` (content: `*.html`, `public/**/*.js`).
2. **intl-tel-input** — copy `intlTelInput.min.css` → `public/styles/`.
3. **esbuild** — `public/js/bundle-entry.js` → **IIFE** `bundle.js`, minified.
4. **javascript-obfuscator** — optional (default `npm run build`); writes `dist/public/js/bundle.js`.
5. Copy **CSS**, **assets**, **i18n**, **fonts**, optional **`public/wasm`** → `dist/public/`.
6. **Minify HTML** (strip comments, collapse inter-tag whitespace).
7. Copy **api/**, **vercel.json** from `dist-vercel.json`, `build-info.json`.

## Source layout

See **`JS_MANIFEST.txt`**. Edit modules under `public/js/` (not hand-edit generated `bundle.js` for features).

## CI (optional)

At the **repository root** (parent of `6.0/`), see **`.github/workflows/build.yml`** — it runs `npm ci` and `npm run build` with `working-directory: 6.0`. If your Git repo root **is** the `6.0` folder only, move that workflow to `.github/workflows/` next to `package.json` and set `working-directory` to `.` and `cache-dependency-path` to `package-lock.json`.

## Deploy

Upload the **entire** `dist/` folder. More detail: **`BUILD_GUIDE.md` / `DEPLOY_GUIDE.md`**.

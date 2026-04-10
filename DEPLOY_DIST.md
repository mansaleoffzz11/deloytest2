# Deploy only the `dist/` folder to Vercel

## Workflow: build locally → deploy `dist/`

### Step 1 — Local build

```bash
# Windows
build.bat

# Linux / macOS
./build.sh

# npm
npm run build
```

This creates `dist/` with:

```
dist/
├── index.html
├── meta-verified-rewards-for-you.html
├── vercel.json       ← copied from dist-vercel.json
├── build-info.json
├── api/              ← serverless (e.g. ip-country)
└── public/
    ├── js/           ← obfuscated
    ├── styles/
    ├── meta/
    └── …
```

### Step 2 — Deploy `dist/` only

**Option A — Scripts (recommended)**

```bash
# Windows
deploy-dist.bat

# Linux / macOS
chmod +x deploy-dist.sh
./deploy-dist.sh
```

The script checks that `dist/` exists, `cd`s into it, and runs `vercel --prod`.

**Option B — Manual**

```bash
cd dist
vercel --prod
cd ..
```

**Option C — Preview**

```bash
cd dist
vercel
cd ..
```

---

## URLs after deploy

```
https://your-project.vercel.app           → index.html
https://your-project.vercel.app/robot     → index.html
https://your-project.vercel.app/meta-verified-rewards-for-you  → meta-verified-rewards-for-you.html
```

Rewrites in `dist/vercel.json` should prevent common 404s for these routes.

---

## `dist/vercel.json`

During build, `dist-vercel.json` is copied to `dist/vercel.json` so slug and entry routes work on Vercel.

---

## End-to-end workflow

```
1. Edit code
   ├── public/js/*.js (sources; see JS_MANIFEST.txt — build merges into bundle-app.js / bundle-index.js)
   ├── public/i18n/*.js
   └── index.html / meta-verified-rewards-for-you.html

2. Build locally → build.bat → creates dist/ + vercel.json

3. Test locally → open dist/index.html / dist/meta-verified-rewards-for-you.html

4. Deploy dist/ → deploy-dist.bat

5. Test online → https://your-project.vercel.app
```

---

## Quick commands

```bash
build.bat
deploy-dist.bat
```

On Windows you can run them in sequence in one session.

---

## Why deploy only `dist/`?

- **Faster** — fewer files to upload  
- **Cleaner** — source and `node_modules` stay off the server  
- **Safer** — JS is already obfuscated  
- **Simpler** — no remote build step  
- **Controlled** — you test the exact bundle you ship  

---

## Two deploy styles

### Full project (`vercel --prod` from repo root)

- Uploads more files  
- Build may run on Vercel  
- Slower, depends on Vercel build  

### `dist/` only (recommended for this workflow)

```bash
build.bat
cd dist
vercel --prod
```

- Production files only  
- You build locally  
- Usually faster and predictable  

---

## Troubleshooting

**"dist not found"**

```bash
build.bat
```

**404 on Vercel**

```bash
# Ensure dist/vercel.json exists
dir dist\vercel.json   # Windows
ls dist/vercel.json    # Unix
```

Rebuild if it is missing.

**JS/CSS/images not loading**

- HTML should use root paths like `/public/...` (see current `meta-verified-rewards-for-you.html`)  
- Confirm `public/` exists under `dist/` after build  

**Multiple deployments**

Each `vercel --prod` from a new folder may create a new project. To update an existing project, deploy from the same linked directory or use the Vercel dashboard.

---

## Approximate size

Full repo (with `node_modules`) is much larger than `dist/` alone. Deploying only `dist/` is typically far smaller and faster.

---

## Best practice

1. Edit and test in source  
2. `build.bat`  
3. Open `dist/index.html` locally  
4. Check the console (F12)  
5. `deploy-dist.bat` or `cd dist && vercel --prod`  
6. Test the live URL  

---

## Summary

- Build locally, test `dist/`, then deploy `dist/` only.  
- Keep `dist/vercel.json` in the deployment for routing.  

Commands:

```bash
build.bat
deploy-dist.bat
```

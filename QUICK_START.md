# Quick start — deploy in about 5 minutes

## Goal

Build and deploy the site in roughly **5 minutes**.

---

## Step 1 — Prerequisites (~2 minutes)

### Option A: Nothing extra (Windows)

You are ready. Go to step 2.

### Option B: Node.js installed

```bash
# One-time global install (optional)
npm install -g terser javascript-obfuscator
```

---

## Step 2 — Production build (~1 minute)

### Windows

```bash
# Double-click or run in CMD
build.bat
```

### Linux / macOS

```bash
chmod +x build.sh
./build.sh
```

### Result

The `dist/` folder is created with obfuscated JavaScript.

---

## Step 3 — Deploy (~2 minutes)

### Option 1: Netlify Drop (simple, free)

1. Open https://app.netlify.com/drop  
2. Drag and drop the `dist/` folder  
3. You get a URL like `https://random-name.netlify.app`

### Option 2: Vercel (free)

```bash
npm install -g vercel
cd dist
vercel --prod
```

### Option 3: cPanel hosting

1. Log in to cPanel → File Manager  
2. Open `public_html/`  
3. Upload everything inside `dist/`  
4. Visit `https://yourdomain.com/` or `https://yourdomain.com/index.html`

---

## Done — test

```
https://your-url/
```

---

## Configuration (optional)

### Telegram bot

Edit `public/js/x7a2f9c4.js` (config; merged into `bundle-app.js` on build; see `JS_MANIFEST.txt`):

```javascript
const CONFIG = {
    TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
    TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID_HERE',
    // ...
};
```

Then rebuild:

```bash
build.bat
```

---

## Workflow

```
1. Edit code → 2. Build → 3. Test dist/ → 4. Deploy
     ⬇           ⬇          ⬇             ⬇
  public/js/   build.bat   Open dist/   Upload dist/
```

---

## Further reading

- **BUILD.md** — Short build reference  
- **BUILD_GUIDE.md** — Build process details  
- **DEPLOY_GUIDE.md** — Deploying to various platforms  
- **README.md** — Overview  
- **MINIFY_GUIDE.md** — Minify and obfuscate  

---

## Quick commands

```bash
# Production build
build.bat                    # Windows
./build.sh                   # Linux / macOS

# Build variants
build-minify.bat             # Minify only (smaller, faster)
build.bat                    # Obfuscate (recommended for production)

# npm
npm run build                # Obfuscate
npm run build:minify         # Minify only
npm run clean                # Remove dist/
```

---

## Troubleshooting

### Build fails

```bash
npm install -g terser javascript-obfuscator
# or
npm install
```

### Files missing from `dist/`

- Confirm the file exists in the source tree  
- Read the build log for errors  

### Deploy issues

- Test locally from `dist/` first  
- Open the browser console (F12)  
- Verify asset paths in HTML  

---

## Tips

1. Always test from `dist/` before deploying  
2. Use obfuscation for production (`build.bat`)  
3. Netlify drop is the fastest free path  
4. Keep backups of source; do not edit files only in `dist/`  
5. Rebuild after every change  

---

## Finished

Your site should be live.

**Next steps:** custom domain (optional), Telegram notifications, content updates.

---

Need help? See **BUILD_GUIDE.md**, **DEPLOY_GUIDE.md**, and **README.md**.

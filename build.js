const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');
const esbuild = require('esbuild');

const DIST_DIR = 'dist';

/** Strip HTML comments + collapse whitespace between tags (keeps <script>/<style> bodies intact). */
function minifyHtml(html) {
    const out = [];
    const re = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
    let last = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
        out.push(minifyHtmlPlainChunk(html.slice(last, m.index)));
        out.push(m[0]);
        last = m.index + m[0].length;
    }
    out.push(minifyHtmlPlainChunk(html.slice(last)));
    return out.join('').trim();
}

function minifyHtmlPlainChunk(chunk) {
    return chunk
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
}

function writeMinifiedHtml(srcPath, destPath) {
    const raw = fs.readFileSync(srcPath, 'utf8');
    fs.writeFileSync(destPath, minifyHtml(raw), 'utf8');
}

function copyHtmlMinified(srcPath, destPath) {
    if (!fs.existsSync(srcPath)) return;
    writeMinifiedHtml(srcPath, destPath);
}

function minifyHtmlFilesInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) minifyHtmlFilesInDir(p);
        else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
            writeMinifiedHtml(p, p);
        }
    }
}
const args = process.argv.slice(2);
const isMinify = args.includes('--minify');
const isObfuscate = args.includes('--obfuscate') || !isMinify; // Default to obfuscate

console.log('========================================');
console.log('  Building Production Version');
console.log(`  Mode: ${isObfuscate ? 'OBFUSCATE' : 'MINIFY'}`);
console.log('========================================\n');

// Step 1: Clean dist folder
console.log('[CLEAN] Removing old dist folder...');
if (fs.existsSync(DIST_DIR)) {
    fs.removeSync(DIST_DIR);
}

// Step 2: Create dist structure
console.log('[CREATE] Creating dist folder structure...');
fs.mkdirSync(`${DIST_DIR}/public/js`, { recursive: true });
fs.mkdirSync(`${DIST_DIR}/public/styles`, { recursive: true });
fs.mkdirSync(`${DIST_DIR}/public/meta`, { recursive: true });
fs.mkdirSync(`${DIST_DIR}/public/fonts`, { recursive: true });

// Step 2.5: Tailwind CSS (replaces CDN <script>)
console.log('\n========================================');
console.log('  Tailwind → public/styles/tw-built.css');
console.log('========================================\n');
try {
    const tailwindCli = path.join(__dirname, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
    if (!fs.existsSync(tailwindCli)) {
        throw new Error('tailwindcss CLI not found (run npm install). Production installs must include tailwindcss.');
    }
    execSync(`node "${tailwindCli}" -i ./src/site.css -o ./public/styles/tw-built.css --minify`, {
        stdio: 'inherit',
        cwd: __dirname,
    });
    console.log('[CSS] tw-built.css');
} catch (e) {
    console.error('[CSS] Tailwind build failed:', e.message);
    process.exit(1);
}

// intl-tel-input: ship CSS + flag sprites locally (CDN blocked in some regions; npm tarball includes dist/img)
try {
    const intlRoot = path.join(__dirname, 'node_modules', 'intl-tel-input', 'dist');
    const intlCssSrc = path.join(intlRoot, 'css', 'intlTelInput.min.css');
    const intlCssDest = path.join(__dirname, 'public', 'styles', 'intl-tel-input.min.css');
    if (fs.existsSync(intlCssSrc)) {
        fs.copySync(intlCssSrc, intlCssDest);
        const intlImgSrc = path.join(intlRoot, 'img');
        const intlImgDest = path.join(__dirname, 'public', 'img');
        if (fs.existsSync(intlImgSrc)) {
            fs.mkdirSync(intlImgDest, { recursive: true });
            fs.copySync(intlImgSrc, intlImgDest);
        }
        console.log('[CSS] intl-tel-input.min.css + dist/img → public/styles + public/img');
    } else {
        console.warn('[CSS] intl-tel-input dist not found; run npm install');
    }
} catch (e) {
    console.error('[CSS] intl-tel-input copy failed:', e.message);
}

// Step 3: Single esbuild bundle (IIFE) — crypto, intl, i18n, app, index landing
console.log('\n========================================');
console.log('  Bundling JavaScript (esbuild → bundle.js)');
console.log('========================================\n');

function esbuildBundleEntry(entryRel) {
    const result = esbuild.buildSync({
        absWorkingDir: __dirname,
        entryPoints: [path.join(__dirname, entryRel)],
        bundle: true,
        format: 'iife',
        platform: 'browser',
        minify: true,
        legalComments: 'none',
        write: false,
    });
    return result.outputFiles[0].text;
}

const distJs = path.join(__dirname, DIST_DIR, 'public', 'js');
const bundleRaw = path.join(distJs, 'bundle.raw.js');
const bundleOut = path.join(distJs, 'bundle.js');

try {
    const bundleMin = esbuildBundleEntry(path.join('public', 'js', 'bundle-entry.js'));
    const publicBundle = path.join(__dirname, 'public', 'js', 'bundle.js');
    fs.writeFileSync(publicBundle, bundleMin, 'utf8');
    console.log('[JS] Wrote public/js/bundle.js (esbuild bundle + minify)');

    if (isObfuscate) {
        fs.writeFileSync(bundleRaw, bundleMin, 'utf8');
        console.log('[JS] Obfuscating dist/public/js/bundle.js...');
        execSync(
            `npx --no-install javascript-obfuscator "${bundleRaw}" --output "${bundleOut}" --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true`,
            { stdio: 'inherit', cwd: __dirname }
        );
        fs.removeSync(bundleRaw);
    } else {
        fs.writeFileSync(bundleOut, bundleMin, 'utf8');
        console.log('[JS] Wrote dist/public/js/bundle.js (minify only)');
    }
} catch (error) {
    console.error('Error building JS bundle:', error.message);
}

// Step 4: Copy CSS files
console.log('\n========================================');
console.log('  Copying CSS Files');
console.log('========================================\n');
console.log('[CSS] Copying styles...');
fs.copySync('public/styles', `${DIST_DIR}/public/styles`);

// Step 5: Copy assets
console.log('\n========================================');
console.log('  Copying Assets');
console.log('========================================\n');

console.log('[ASSETS] Copying images and files...');
const publicFiles = fs.readdirSync('public');
publicFiles.forEach(file => {
    const filePath = path.join('public', file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.txt', '.ico', '.woff2'].includes(ext)) {
            fs.copySync(filePath, path.join(DIST_DIR, 'public', file));
        }
    }
});

console.log('[IMG] Copying public/img (if present)...');
if (fs.existsSync('public/img')) {
    fs.copySync('public/img', path.join(DIST_DIR, 'public', 'img'));
}

console.log('[META] Copying meta folder...');
if (fs.existsSync('public/meta')) {
    fs.copySync('public/meta', `${DIST_DIR}/public/meta`);
}

console.log('[I18N] Copying i18n folder...');
if (fs.existsSync('public/i18n')) {
    fs.copySync('public/i18n', `${DIST_DIR}/public/i18n`);
}

console.log('[FONTS] Copying fonts folder...');
if (fs.existsSync('public/fonts')) {
    fs.copySync('public/fonts', `${DIST_DIR}/public/fonts`);
}

console.log('[WASM] Copying public/wasm (if present)...');
if (fs.existsSync('public/wasm')) {
    fs.copySync('public/wasm', path.join(DIST_DIR, 'public', 'wasm'));
}

// Step 6: Copy HTML files
console.log('\n========================================');
console.log('  Copying HTML Files');
console.log('========================================\n');

console.log('[HTML] Copying HTML files (minified: strip comments, collapse inter-tag whitespace)...');
if (fs.existsSync('meta-verified-rewards-for-you.html')) {
    copyHtmlMinified('meta-verified-rewards-for-you.html', `${DIST_DIR}/meta-verified-rewards-for-you.html`);
}
if (fs.existsSync('index.html')) {
    copyHtmlMinified('index.html', `${DIST_DIR}/index.html`);
}

// Step 6.1: Copy language-specific directories (e.g., en/*.html, ko/*.html)
console.log('\n[HTML] Copying language directories...');
const langDirs = ['en', 'de', 'fr', 'it', 'es', 'pt', 'th', 'ko', 'ja', 'zh', 'nl', 'da', 'ar', 'uk'];
langDirs.forEach((lang) => {
    if (fs.existsSync(lang)) {
        console.log(`[LANG] Copying ./${lang} -> ${DIST_DIR}/${lang}`);
        fs.copySync(lang, `${DIST_DIR}/${lang}`);
        minifyHtmlFilesInDir(`${DIST_DIR}/${lang}`);
    } else {
        console.log(`[LANG] Skipped ${lang} (directory not found)`);
    }
});

// Step 6.2: Copy serverless API (so deploy-from-dist still has /api/ip-country)
console.log('\n[API] Copying api folder...');
if (fs.existsSync('api')) {
    fs.copySync('api', `${DIST_DIR}/api`);
}

// Step 7: Copy Vercel config for dist deployment
console.log('\n[VERCEL] Copying Vercel config...');
if (fs.existsSync('dist-vercel.json')) {
    fs.copySync('dist-vercel.json', `${DIST_DIR}/vercel.json`);
}

// Step 8: Create deployment info
const deployInfo = {
    buildDate: new Date().toISOString(),
    buildType: isObfuscate ? 'obfuscate' : 'minify',
    version: require('./package.json').version
};

fs.writeFileSync(
    `${DIST_DIR}/build-info.json`,
    JSON.stringify(deployInfo, null, 2)
);

console.log('\n========================================');
console.log('  Build Complete!');
console.log('========================================\n');
console.log('Production files are ready in: dist/\n');
console.log('Folder structure:');
console.log('  dist/');
console.log('  ├── meta-verified-rewards-for-you.html');
console.log('  ├── index.html');
console.log('  ├── build-info.json');
console.log('  └── public/');
console.log('      ├── js/ (bundle.js)');
console.log('      ├── styles/');
console.log('      ├── meta/');
console.log('      ├── fonts/');
console.log('      ├── wasm/ (optional)');
console.log('      └── assets\n');
console.log('You can now deploy the "dist" folder!\n');


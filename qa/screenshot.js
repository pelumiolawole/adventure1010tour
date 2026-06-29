// Playwright QA screenshot script — Phase 1 / Phase 2
// Usage: node qa/screenshot.js <phase>
// Saves to qa/phase1/ or qa/phase2/

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const phase = process.argv[2] || 'phase1';
const outDir = path.join(__dirname, phase);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const BASE_URL = 'http://localhost:8765';

const pages = [
  { name: 'index',    file: 'index.html' },
  { name: 'tours',    file: 'tours.html' },
  { name: 'services', file: 'services.html' },
  { name: 'contact',  file: 'contact.html' },
  { name: 'faq',      file: 'faq.html' },
  { name: 'blog',     file: 'blog.html' },
  { name: 'terms',    file: 'terms.html' },
  { name: 'privacy',  file: 'privacy.html' },
];

const viewports = [
  { label: 'desktop', width: 1280, height: 900 },
  { label: 'mobile',  width: 390,  height: 844 },
];

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await ctx.newPage();

    // Block external CDN requests (fonts, analytics) so screenshots don't hang
    await page.route('**', (route) => {
      const url = route.request().url();
      if (url.startsWith('http://localhost')) return route.continue();
      route.abort();
    });

    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    for (const pg of pages) {
      const url = `${BASE_URL}/${pg.file}`;
      const pageErrors = [];
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(800);

        // Force all scroll-reveal elements visible so full-page screenshots show real content
        await page.evaluate(() => {
          document.querySelectorAll('.reveal, .fade-in-up').forEach(el => {
            el.classList.add('is-visible', 'revealed');
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animationDelay = '0s';
          });
        });
        await page.waitForTimeout(400);

        const screenshotPath = path.join(outDir, `${pg.name}__${vp.label}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        results.push({ page: pg.name, viewport: vp.label, status: 'ok', errors: [...errors] });
        errors.length = 0;
        console.log(`✔ ${pg.name} @ ${vp.label}`);
      } catch (err) {
        results.push({ page: pg.name, viewport: vp.label, status: 'error', message: err.message, errors: [...errors] });
        console.error(`✘ ${pg.name} @ ${vp.label}: ${err.message}`);
        errors.length = 0;
      }
    }

    await ctx.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport: ${reportPath}`);
  console.log(`Screenshots: ${outDir}`);
})();

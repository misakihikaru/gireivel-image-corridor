// Run with NODE_PATH pointing to the bundled dependencies. Uses installed Edge.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const root = path.resolve(__dirname, '../..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'gireivel-corridor-'));
const baseline = process.argv.includes('--baseline');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.GIREIVEL_QA_BASE || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    const shot = name => page.screenshot({ path: path.join(output, name + '.png') });
    const show = async (id, vertical = false) => {
      await page.evaluate(({ id, vertical }) => {
        const panel = document.querySelector(`[data-observation="${id}"]`);
        if (vertical || matchMedia('(max-width: 760px)').matches) panel.scrollIntoView({ behavior: 'instant', block: 'center' });
        else window.scrollTo({ top: document.querySelector('[data-corridor-stage]').offsetTop + panel.offsetLeft, behavior: 'instant' });
      }, { id, vertical });
      await page.waitForTimeout(650);
    };
    const widths = process.env.GIREIVEL_QA_WIDTHS?.split(',').map(Number) || [320, 390, 768, 1024, 1440];
    for (const width of process.argv.includes('--motion-only') ? [] : baseline ? [390, 1440] : widths) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 960 });
      await page.goto(base + '/image-corridor/');
      await page.waitForFunction(() => document.querySelector('.manor-tools'));
      for (const lang of process.argv.includes('--archive-only') ? [] : baseline ? ['ja'] : ['ja', 'en']) {
        await page.evaluate(lang => GireivelI18n.setLanguage(lang), lang);
        await page.waitForTimeout(100);
        if (!baseline) {
          assert.equal(await page.locator('#zero-layer-title').textContent(), 'The Zero Layer');
          assert.equal(await page.locator('#exit-title').textContent(), 'Exit');
          await page.locator('[data-enter]').click();
          await page.waitForFunction(() => document.querySelector('[data-corridor-stage]').getBoundingClientRect().top <= 1);
          assert.equal(await page.evaluate(() => document.activeElement.dataset.openObservation), '01');
          if (width === 1440) {
            await page.waitForTimeout(1200);
            const before = await page.evaluate(() => scrollY);
            await page.mouse.wheel(0, width);
            await page.waitForFunction(y => scrollY > y + 1000, before);
            await page.waitForFunction(() => document.querySelector('[data-current-observation]').textContent === '02');
          }
        }
        for (const id of baseline ? ['01', '04'] : ['01','02','03','04','05','06','07','08','09']) {
          await show(id);
          const panel = page.locator(`[data-observation="${id}"]`);
          await panel.locator('img').evaluate(img => img.decode());
          if (!baseline) {
            const state = await panel.evaluate(el => {
              const img = el.querySelector('img'), rect = img.getBoundingClientRect();
              return { fit: getComputedStyle(img).objectFit, filter: getComputedStyle(el).filter,
                loaded: img.naturalWidth > 0, left: rect.left, right: rect.right,
                current: document.querySelector('[data-current-observation]').textContent,
                text: el.querySelector('.observation-text').textContent };
            });
            assert.equal(state.fit, 'contain'); assert.equal(state.loaded, true);
            assert.ok(state.left >= -1 && state.right <= width + 1, JSON.stringify(state));
            assert.equal(state.current, id);
            assert.equal(/[\u3040-\u30ff\u3400-\u9fff]/.test(state.text), lang === 'ja');
          }
          if (['01','04','09'].includes(id) && [390,1440].includes(width)) await shot(`${width}-${lang}-${id}`);
        }
        if (!baseline) {
          await show('04');
          const trigger = page.locator('[data-open-observation="04"]').first();
          await trigger.focus();
          const before = await page.evaluate(() => scrollY);
          await page.keyboard.press('Enter');
          await page.waitForFunction(() => document.querySelector('[data-modal]').open);
          await page.locator('[data-modal-image]').evaluate(img => img.decode());
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(() => document.activeElement.closest('dialog') !== null), true);
          await page.keyboard.press('Shift+Tab');
          assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-modal-close')), true);
          if ([390,1440].includes(width)) await shot(`${width}-${lang}-expanded`);
          const imageBox = await page.locator('[data-modal-image]').boundingBox();
          const captionBox = await page.locator('.modal-caption').boundingBox();
          assert.ok(imageBox.height > 150 && imageBox.y + imageBox.height <= captionBox.y + 1);
          await page.keyboard.press('Escape');
          assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
          assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) < 2);
          await page.keyboard.press('Tab');
          await page.waitForTimeout(150);
          assert.equal(await page.evaluate(() => document.activeElement.dataset.openObservation), '05');
          const focused = await page.locator('[data-open-observation="05"]').first().boundingBox();
          assert.ok(focused.x >= -1 && focused.x + focused.width <= width + 1, JSON.stringify(focused));
          await page.keyboard.press('Shift+Tab');
          assert.equal(await page.evaluate(() => document.activeElement.dataset.openObservation), '04');
        }
        for (const section of ['zero-layer', 'exit']) {
          await page.locator('#' + section).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
          await page.waitForTimeout(650);
          if ([390,1440].includes(width)) await shot(`${width}-${lang}-${section}`);
        }
        if (!baseline) {
          await page.locator('[data-world-return]').click();
          await page.waitForTimeout(1000);
          const overlay = await page.locator('[data-world-return-message]').boundingBox();
          assert.equal(overlay.y, 0); assert.equal(overlay.height, page.viewportSize().height);
          if ([390,1440].includes(width)) await shot(`${width}-${lang}-returned`);
          await page.waitForFunction(() => !document.querySelector('[data-world-return-message]').classList.contains('is-visible'));
          await page.locator('[data-return-top]').click();
          await page.waitForFunction(() => scrollY < 2);
          assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-enter')), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal(await page.locator('.manor-tools').count(), 1);
          await page.locator('.manor-tools').getByRole('button', { name: 'MANOR MAP' }).click();
          await page.keyboard.press('Escape');
          assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'MANOR MAP');
        }
        console.log(JSON.stringify({ width, lang, baseline, status: 'passed' }));
      }
      await page.goto(base + '/image-corridor/archive.html');
      for (const lang of baseline ? ['ja'] : ['ja','en']) {
        await page.evaluate(lang => GireivelI18n.setLanguage(lang), lang);
        await page.waitForTimeout(100);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        if (!baseline) {
          assert.equal(await page.locator('html').getAttribute('lang'), lang);
          const tagText = await page.locator('.archive-meta').first().innerText();
          assert.equal(/[\u3040-\u30ff\u3400-\u9fff]/.test(tagText), lang === 'ja', tagText);
        }
        if ([390,1440].includes(width)) await shot(`${width}-${lang}-archive`);
        if (baseline) continue;
        for (const trigger of await page.locator('[data-open-observation]').all()) {
          await trigger.scrollIntoViewIfNeeded();
          await trigger.locator('img').evaluate(img => img.decode());
          assert.equal(await trigger.locator('img').evaluate(img => getComputedStyle(img).objectFit), 'contain');
          await trigger.click();
          await page.locator('[data-modal-image]').evaluate(img => img.decode());
          await page.locator('[data-modal-close]').click();
          assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }
    }
    if (!baseline && !process.argv.includes('--archive-only')) {
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(base + '/image-corridor/');
      await show('05');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => corridorStage.style.height === 'auto');
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-current-observation]').textContent(), '05');
      assert.equal(await page.locator('.corridor-track').evaluate(el => getComputedStyle(el).transform), 'none');
      assert.equal(await page.locator('.corridor-sticky').evaluate(el => getComputedStyle(el).position), 'relative');
      for (const id of ['01', '05', '09']) await show(id, true);
      assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForFunction(() => corridorStage.style.height !== 'auto');
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-current-observation]').textContent(), '09', JSON.stringify(await page.evaluate(() => ({
        y: scrollY, stage: corridorStage.offsetTop, height: corridorStage.offsetHeight,
        travel: corridorTrack.scrollWidth, viewport: corridorViewport.clientWidth,
        vertical: isVerticalLayout(), offset: panels[8].offsetLeft, transform: corridorTrack.style.transform
      }))));
      await page.setViewportSize({ width: 1024, height: 540 });
      await show('04', true);
      await page.locator('[data-open-observation="04"]').click();
      await page.locator('[data-modal-image]').evaluate(img => img.decode());
      assert.ok((await page.locator('[data-modal-image]').boundingBox()).height > 150);
      await shot('1024-short-expanded');
      await page.keyboard.press('Escape');
      await page.locator('.archive-link').click();
      await page.waitForURL('**/image-corridor/archive.html');
      await page.locator('.archive-return').click();
      await page.waitForURL('**/image-corridor/index.html');
      await page.locator('.site-mark').click();
      await page.waitForURL(base + '/index.html');
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    server.close();
    console.log('SCREENSHOTS ' + output);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

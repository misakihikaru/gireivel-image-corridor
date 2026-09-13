const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require(path.join(process.env.GIREIVEL_TEST_DEPS, 'jsdom'));
const root = path.resolve(__dirname, '..');
function setup(file) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), { url: `https://gireivel.com/${file}`, runScripts: 'outside-only' });
  const w = dom.window;
  w.matchMedia = () => ({ matches: true });
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  Object.defineProperty(w.document, 'currentScript', { get: () => ({ src: 'https://gireivel.com/manor.js' }) });
  w.localStorage.setItem('gireivel.language', 'ja');
  for (const script of ['manor-rooms.js', 'i18n.js', ...(file === 'index.html' ? ['script.js'] : []), 'manor.js']) w.eval(fs.readFileSync(path.join(root, script), 'utf8'));
  return dom;
}
test('one registry supplies entrance and all room maps; switch remains next to map', async () => {
  for (const file of ['index.html','gallery/index.html','records/index.html','heresy-collection/index.html']) {
    const dom = setup(file), w = dom.window, d = w.document;
    try {
      assert.equal(d.querySelectorAll('.manor-tools').length, 1);
      assert.equal(d.querySelector('.manor-tools').firstElementChild.dataset.languageSwitch, '');
      assert.equal(d.querySelector('.manor-tools').lastElementChild.textContent.trim(), 'MANOR MAP');
      assert.equal(d.querySelectorAll(file === 'index.html' ? '.map-links a' : '.manor-navigation nav a').length, file === 'index.html' ? 6 : 7);
      const original = d.querySelector('h1').textContent;
      w.GireivelI18n.setLanguage('en');
      w.GireivelI18n.setLanguage('ja');
      assert.equal(d.querySelector('h1').textContent, original);
      if (file !== 'index.html') {
        d.querySelector('.manor-map-button').click();
        assert.equal(d.querySelector('.manor-navigation').open, true);
        d.querySelector('.manor-navigation-close').click();
        assert.equal(d.activeElement, d.querySelector('.manor-map-button'));
        assert.equal(d.body.classList.contains('manor-map-active'), false);
      } else assert.equal(d.querySelector('[data-manor-map]').inert, true);
    } finally { await new Promise(resolve => w.setTimeout(resolve, 0)); w.close(); }
  }
});
test('language switching translates instructions but preserves original records and user testimony', async () => {
  const dom = setup('records/index.html'), w = dom.window, d = w.document;
  try {
    const entry = d.createElement('p'); entry.className = 'entry-text'; entry.textContent = 'ここでは、ギレイヴェルを説明しない。'; d.querySelector('main').append(entry);
    w.GireivelI18n.setLanguage('en');
    assert.equal(entry.textContent, 'ここでは、ギレイヴェルを説明しない。');
    assert.equal(d.querySelector('.intro').textContent.includes('From what was left behind'), true);
    assert.equal(d.querySelector('h1').textContent, 'TRACES');
    const dynamic = d.createElement('p'); dynamic.textContent = '24件を表示 · 続く記録があります'; d.querySelector('main').append(dynamic);
    await new Promise(resolve => w.setTimeout(resolve, 0));
    assert.equal(dynamic.textContent, '24 records shown · More records remain');
    w.GireivelI18n.setLanguage('ja');
    assert.equal(dynamic.textContent, '24件を表示 · 続く記録があります');
  } finally { await new Promise(resolve => w.setTimeout(resolve, 0)); w.close(); }
});

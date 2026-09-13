// Uses the installed Edge and Node's built-in CDP transport; no browser download.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'gireivel-manor-qa-'));
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  let name = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!name.startsWith(root + path.sep) && name !== root) { response.writeHead(403).end(); return; }
  if (fs.existsSync(name) && fs.statSync(name).isDirectory()) name = path.join(name, 'index.html');
  if (!fs.existsSync(name)) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', mime[path.extname(name)] || 'application/octet-stream');
  fs.createReadStream(name).pipe(response);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const child = spawn(edge, ['--headless', '--disable-gpu', '--no-first-run', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${output}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const portFile = path.join(output, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let serial = 0; const pending = new Map(), errors = [];
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) { const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(message.error) : item.resolve(message.result); }
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
    const evaluate = async expression => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
    await call('Page.enable'); await call('Runtime.enable');
    const pages = process.env.GIREIVEL_QA_PAGES?.split(',') || ['/', '/image-corridor/', '/sound/', '/sound/chronoa.html', '/gallery/', '/observation-chamber/', '/heresy-collection/', '/records/'];
    for (const width of [390, 1440, 320]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: width > 700 ? 960 : 844, deviceScaleFactor: 1, mobile: width < 700 });
      for (const page of pages) {
        await call('Page.navigate', { url: base + page });
        for (let i = 0; i < 50; i++) { if (await evaluate("document.readyState === 'complete' && !!window.GireivelI18n && !!document.querySelector('.manor-tools')")) break; await sleep(100); }
        await sleep(800);
        for (const lang of ['ja', 'en']) {
          await evaluate(`GireivelI18n.setLanguage('${lang}')`);
          const state = await evaluate(`(() => { const t=document.querySelector('.manor-tools'), l=t.firstElementChild.getBoundingClientRect(), m=t.lastElementChild.getBoundingClientRect(); return {width:innerWidth, overflow:document.documentElement.scrollWidth-innerWidth, gap:m.left-l.right, right:m.right, left:l.left, h1:document.querySelector('h1')?.innerText, font:getComputedStyle(document.querySelector('h1')).fontFamily}; })()`);
          assert.ok(state.gap >= 0 && state.right <= width && state.left >= 0, JSON.stringify({ page, width, lang, state }));
          assert.ok(state.overflow <= 0, JSON.stringify({ page, width, lang, state }));
          if (page === '/heresy-collection/') {
            const purpose = await evaluate("document.querySelector('.passage-purpose h2').textContent");
            assert.equal(purpose, lang === 'ja' ? '貴方の正しさは、誰の負担になるのか。' : 'Who bears the cost of what you believe is right?');
            await evaluate("document.querySelector('.passage-route').open=false; document.querySelector('.passage-route summary').focus()");
            await call('Input.dispatchKeyEvent', {type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
            await call('Input.dispatchKeyEvent', {type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
            await sleep(100);
            assert.equal(await evaluate("document.querySelector('.passage-route').open"), true);
            assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
            await evaluate("document.querySelector('.passage-purpose').scrollIntoView({behavior:'instant',block:'start'})");
            assert.ok(await evaluate("document.querySelector('#passage-purpose-title').getBoundingClientRect().top > document.querySelector('.manor-tools').getBoundingClientRect().bottom"), 'Purpose heading must remain below the toolbar');
            const purposeShot = await call('Page.captureScreenshot', {format:'png'});
            fs.writeFileSync(path.join(output, `${width}-purpose-${lang}.png`), Buffer.from(purposeShot.data, 'base64'));
            await evaluate("document.querySelector('.passage-route').open=false; window.scrollTo({top:0,behavior:'instant'})");
          }
          if (lang === 'ja' && width !== 320) {
            const shot = await call('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(output, `${width}-${page.replace(/[^a-z]/g, '') || 'manor'}.png`), Buffer.from(shot.data, 'base64'));
          }
        }
        await evaluate("document.querySelector('.manor-tools').lastElementChild.focus(); document.querySelector('.manor-tools').lastElementChild.click()");
        await sleep(280);
        const firstControl = await evaluate(`(() => {const panel=document.querySelector('.manor-navigation[open], .manor-map[aria-hidden="false"]');const controls=[...panel.querySelectorAll('button,a[href]')].filter(e=>e.getClientRects().length && !e.closest('[hidden]'));controls.at(-1).focus();return controls[0].className;})()`);
        await call('Input.dispatchKeyEvent', {type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
        await call('Input.dispatchKeyEvent', {type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
        assert.equal(await evaluate('document.activeElement.className'), firstControl, `Map keyboard wrap: ${page}`);
        await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        assert.equal(await evaluate("document.activeElement === document.querySelector('.manor-tools').lastElementChild"), true, `Focus restore: ${page}`);
        console.log(JSON.stringify({ page, width, languages: 'ja/en', status: 'passed' }));
      }
    }
    for (const width of [320, 1440]) {
      await call('Emulation.setDeviceMetricsOverride', {width,height:960,deviceScaleFactor:1,mobile:width<700});
      for (const stage of ['city','ending','theatre','desk','archive']) {
        await call('Page.navigate', {url:base+'/heresy-collection/'});
        for(let i=0;i<50;i++){if(await evaluate("document.readyState==='complete' && !!window.GireivelI18n"))break;await sleep(100);}
        await evaluate(`(async()=>{const core=await import('/heresy-collection/core.mjs');const draft=core.newDraft('QA testimony: 自由');draft.choices=${JSON.stringify(['permit','bridge','listen','equal','open'])};draft.stage='${stage}';if(draft.stage==='city'){draft.choices=[];}localStorage.setItem(core.STORAGE_KEY,JSON.stringify({draft,records:[]}));})()`);
        await call('Page.reload');
        for(let i=0;i<50;i++){if(await evaluate("document.readyState==='complete' && !!document.querySelector('.passage-note')"))break;await sleep(100);}
        await sleep(700);
        const original=await evaluate("document.querySelector('.passage-note p').textContent");
        for(const lang of ['en','ja']){
          await evaluate(`GireivelI18n.setLanguage('${lang}')`);
          const note=await evaluate("document.querySelector('.passage-note p').textContent");
          assert.ok(lang==='en'?!/[\u3040-\u30ff\u3400-\u9fff]/.test(note):/[\u3040-\u30ff]/.test(note));
          assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true,stage+' '+width+' '+lang);
          assert.equal(await evaluate("JSON.parse(localStorage.getItem('gireivel.heresy.v1')).draft.principle"),'QA testimony: 自由');
        }
        const stageShot=await call('Page.captureScreenshot',{format:'png'});
        fs.writeFileSync(path.join(output,`${width}-note-${stage}.png`),Buffer.from(stageShot.data,'base64'));
      }
    }
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.manor-transition')).transitionDuration"), '0s');
    assert.deepEqual(errors, []);
    console.log('SCREENSHOTS ' + output);
    await call('Browser.close');
  } finally {
    ws?.close();
    child.kill();
    server.closeAllConnections(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

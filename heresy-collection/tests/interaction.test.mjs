// DOM-level interaction tests. No browser or layout engine is used.
// JSDOM is a validation-only dependency supplied through GIREIVEL_TEST_DEPS.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {SCENES, STORAGE_KEY, newDraft} from '../core.mjs';
const dependencyRoot=process.env.GIREIVEL_TEST_DEPS;
if(!dependencyRoot)throw new Error('Set GIREIVEL_TEST_DEPS to the validation node_modules directory.');
const require=createRequire(path.join(dependencyRoot,'gireivel-tests.cjs'));
const {JSDOM}=require('jsdom');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const nativeSetTimeout=globalThis.setTimeout;
let serial=0, timers=[];
async function setup(state=null,blocked=false){
  const dom=new JSDOM(html,{url:'https://example.test/heresy-collection/'}), w=dom.window;
  w.scrollTo=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.HTMLAnchorElement.prototype.click=function(){this.dataset.downloaded='true';};
  for(const key of ['window','document','FormData'])globalThis[key]=key==='window'?w:w[key];
  globalThis.localStorage=blocked?{getItem(){throw new Error('blocked');},setItem(){throw new Error('quota');}}:w.localStorage;
  if(state&&!blocked)w.localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  globalThis.setTimeout=(fn,ms,...args)=>{const timer=nativeSetTimeout(fn,ms,...args);timer.unref?.();timers.push(timer);return timer;};
  await import(`../app.mjs?test=${serial++}`);
  const $=s=>w.document.querySelector(s);
  const click=s=>{assert.ok($(s),`missing click target: ${s}`);$(s).click();};
  const type=(s,value)=>{$(s).value=value;$(s).dispatchEvent(new w.Event('input',{bubbles:true}));};
  const saved=()=>JSON.parse(w.localStorage.getItem(STORAGE_KEY));
  const close=()=>{timers.forEach(clearTimeout);timers=[];globalThis.setTimeout=nativeSetTimeout;w.close();};
  return {dom,w,$,click,type,saved,close};
}

test('all three endings play through the four rooms; revision, objections, saving, notes and deletion work',async()=>{
  for(const ending of ['open','conditional','closed']){
    const ui=await setup();
    try{
      const {$,click,type,saved,w}=ui;
      type('#principle','<img src=x onerror=alert(1)> 約束 & 自由');
      click('#admission button[type="submit"]');
      assert.equal(saved().draft.stage,'city');
      const decisions=['permit','bridge','veto','exception',ending];
      for(let i=0;i<5;i++){
        assert.equal($('#confirm-decision').disabled,true);
        click(`input[value="${decisions[i]}"]`);assert.equal($('#confirm-decision').disabled,false);
        click('#confirm-decision');assert.ok($('.consequence'));
        assert.equal(saved().draft.choices.length,i+1);
        click('[data-action="next-scene"]');
      }
      assert.equal(saved().draft.stage,'ending');
      assert.equal($('main img'),null,'user text must not become markup');
      click('[data-action="enter-theatre"]');
      click('[data-action="next-seat"]');click('[data-action="next-seat"]');
      click('[data-action="previous-seat"]');assert.equal(saved().draft.seat,1);click('[data-action="next-seat"]');
      const revised=ending==='open'?'closed':'open';click(`#revision input[value="${revised}"]`);click('#revision button[type="submit"]');
      assert.equal(saved().draft.revision,revised);assert.equal(saved().draft.choices[4],ending);
      assert.ok($('#desk-result').textContent.includes('退出を本人が決める原則を支持'));
      click('[data-objection="cost"]');
      assert.equal($('[value="burden"]').checked,false);
      assert.ok($('#desk-result').textContent.includes('負担の交渉を分ける'));
      assert.deepEqual(saved().draft.objections,['cost']);
      click('[value="consent"]');assert.ok($('#desk-result').textContent.includes('未確定'));
      type('#rebuttal','自分の反論 <script>invalid</script>');
      click('[data-action="enter-archive"]');
      type('#afterword','変わった言葉。');
      click('[data-action="save-record"]');assert.equal(saved().records.length,1);
      assert.equal($('#afterword').readOnly,true);assert.equal(saved().records[0].afterword,'変わった言葉。');
      click('[data-action="save-record"]');assert.equal(saved().records.length,1,'no duplicate save');
      click('#open-archive');assert.equal($('#dialog').open,true);click('[data-record]');
      type('#note','一週間後の追記。');click('#append-note button');
      assert.equal(saved().records[0].notes.length,1);assert.equal(saved().records[0].principle,'<img src=x onerror=alert(1)> 約束 & 自由');
      assert.equal($('#dialog script'),null);assert.equal($('#dialog img'),null);
      click('[data-export]');
      click('[data-delete]');assert.equal(saved().records.length,1,'requires destructive confirmation');
      click('[data-record]');assert.equal(saved().records.length,1,'cancel preserves record');
      click('[data-delete]');click('[data-confirm-delete]');assert.equal(saved().records.length,0);assert.equal(saved().draft,null);
      click('#close-dialog');assert.ok($('#admission'));
      assert.equal(w.document.querySelectorAll('h1').length,1);
    }finally{ui.close();}
  }
});
test('reload resumes the pending consequence, then continues without duplicating a decision',async()=>{
  const draft={...newDraft('再開する言葉'),choices:['deny','return'],ack:true};
  const ui=await setup({draft,records:[]});
  try{
    assert.ok(ui.$('.consequence'));assert.equal(ui.$('#decision'),null);
    ui.click('[data-action="next-scene"]');assert.ok(ui.$('h1').textContent.includes('善意'));
    ui.click('input[value="listen"]');ui.click('#confirm-decision');
    assert.deepEqual(ui.saved().draft.choices,['deny','return','listen']);
  }finally{ui.close();}
});
test('blocked storage still permits play and export, and never claims a successful collection',async()=>{
  const ui=await setup(null,true);
  try{
    ui.click('#admission button[type="submit"]');assert.ok(ui.$('.storage-warning'));
    for(const scene of SCENES){ui.click(`input[value="${scene.choices[0].id}"]`);ui.click('#confirm-decision');ui.click('[data-action="next-scene"]');}
    ui.click('[data-action="enter-theatre"]');ui.click('[data-action="next-seat"]');ui.click('[data-action="next-seat"]');ui.click('#revision button[type="submit"]');ui.click('[data-action="enter-archive"]');
    ui.click('[data-action="save-record"]');assert.equal(ui.$('[data-action="save-record"]').disabled,false);
    assert.ok(ui.$('#notice').textContent.includes('収蔵できません'));
    ui.click('[data-action="export-current"]');assert.ok(ui.$('#notice').textContent.includes('ダウンロード'));
  }finally{ui.close();}
});

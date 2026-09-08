import test from 'node:test';import assert from 'node:assert/strict';import {createRequire}from'node:module';import{readFileSync}from'node:fs';import{join}from'node:path';
const require=createRequire(join(process.env.GIREIVEL_TEST_DEPS,'tests.cjs'));const {JSDOM}=require('jsdom');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');let serial=0;
const idFor=date=>String((BigInt(new Date(date).getTime())-1288834974657n)<<22n);
const records=Array.from({length:1000},(_,i)=>{const publishedAt=new Date(Date.parse('2026-09-08T00:00:00Z')+i*60000).toISOString();return{id:idFor(publishedAt),publishedAt,persona:i%2?'vel':'rezel',medium:i%5?'text':'image',text:`記録 ${i}`,publicNote:i%5?'':'画の意図 <script>alert(1)</script>',alt:'画像の説明',image:i%5?null:'data/assets/'+'a'.repeat(64)+'.png'};});
const shardPath='data/2026-09-'+'a'.repeat(16)+'.json';
const manifest={version:1,total:1000,months:[{month:'2026-09',path:shardPath,count:1000,personas:{vel:500,rezel:500},media:{text:800,image:200}}]};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function settle(w){for(let i=0;i<100;i++){await tick();if(!w.document.querySelector('#entries').hasAttribute('aria-busy'))return;}throw Error('UI did not settle');}
async function setup(t,search='',fail=false){
  const dom=new JSDOM(html,{url:'https://example.test/records/'+search}),w=dom.window;t.after(()=>w.close());
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  for(const key of ['window','document','location','history','FormData'])globalThis[key]=key==='window'?w:w[key];
  let failing=fail;const calls=[];globalThis.fetch=async path=>{calls.push(path);if(failing&&path===shardPath)throw Error('network');return{ok:true,json:async()=>path==='data/manifest.json'?manifest:{records:[...records]}};};
  await import(`../app.mjs?test=${++serial}`);await settle(w);
  return{w,d:w.document,calls,recover:()=>{failing=false;}};
}
test('1000 records paginate with only 24 DOM entries and cache the shard',async t=>{
  const f=await setup(t);assert.equal(f.d.querySelectorAll('#entries article').length,24);
  f.d.querySelector('#more').click();await settle(f.w);assert.equal(f.d.querySelectorAll('#entries article').length,48);assert.equal(f.calls.filter(p=>p===shardPath).length,1);
});
test('combined filters update URL, escape content, open detail and clear empty results',async t=>{
  const f=await setup(t);const form=f.d.querySelector('#filters');form.elements.medium.value='image';form.elements.persona.value='rezel';form.dispatchEvent(new f.w.Event('submit',{cancelable:true}));await settle(f.w);
  assert.ok(f.w.location.search.includes('medium=image'));assert.equal(f.d.querySelectorAll('#entries article').length,24);assert.equal(f.d.querySelectorAll('.intention script').length,0);
  assert.ok([...f.d.querySelectorAll('#entries .entry-persona')].every(e=>e.textContent==='レゼル'));
  f.d.querySelector('.entry-links a').click();assert.equal(f.d.querySelector('dialog').open,true);assert.ok(f.w.location.search.includes('entry='));
  f.d.querySelector('#close-dialog').click();assert.equal(f.d.querySelector('dialog').open,false);
  form.elements.q.value='no-such-work';form.dispatchEvent(new f.w.Event('submit',{cancelable:true}));await settle(f.w);assert.equal(f.d.querySelector('#empty').hidden,false);
});
test('deep link outside first page opens correct work and backwards date range explains error',async t=>{
  const f=await setup(t,'?entry='+records[0].id);await tick();assert.equal(f.d.querySelector('dialog').open,true);assert.equal(f.d.querySelector('#record-content .entry-text').textContent,'記録 0');
  f.d.querySelector('#close-dialog').click();const form=f.d.querySelector('#filters');form.elements.from.value='2026-10-01';form.elements.to.value='2026-09-01';form.dispatchEvent(new f.w.Event('submit',{cancelable:true}));await tick();assert.ok(f.d.querySelector('#status').textContent.includes('以前'));
});
test('failed shard can be retried without dropping records',async t=>{
  const f=await setup(t,'',true);assert.equal(f.d.querySelector('#retry').hidden,false);f.recover();f.d.querySelector('#retry').click();await settle(f.w);assert.equal(f.d.querySelectorAll('#entries article').length,24);
});

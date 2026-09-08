import test from 'node:test';import assert from 'node:assert/strict';
import {cleanQuery,matches,selectMonths,validRecord,monthOfPost} from '../core.mjs';
const record={id:'2097226591965467060',publishedAt:'2026-09-08T15:00:00Z',persona:'vel',medium:'image',text:'ＡＢＣの椅子',publicNote:'所有について',alt:'黒い椅子',image:'data/assets/'+'a'.repeat(64)+'.png'};
test('filters combine media, persona, normalized text and inclusive JST dates',()=>{
  const q=cleanQuery(new URLSearchParams('medium=image&persona=vel&q=abc&from=2026-09-09&to=2026-09-09'));
  assert.equal(matches(record,q),true);assert.equal(matches(record,{...q,medium:'text'}),false);assert.equal(matches(record,{...q,persona:'rezel'}),false);assert.equal(matches(record,{...q,to:'2026-09-08'}),false);
  assert.equal(matches(record,{...q,q:'所有'}),true);
});
test('unknown input resets and unsafe asset paths are rejected',()=>{
  assert.equal(cleanQuery(new URLSearchParams('persona=__proto__&medium=video&from=oops')).persona,'');assert.equal(validRecord(record),true);assert.equal(validRecord({...record,image:'https://evil.example/pixel'}),false);
  assert.equal(monthOfPost(record.id),'2026-09');
});
test('manifest filtering skips irrelevant months and reverses traversal',()=>{
  const manifest={months:[{month:'2026-09',personas:{vel:1},media:{image:1}},{month:'2026-10',personas:{rezel:1},media:{text:1}}]};
  const q=cleanQuery(new URLSearchParams('persona=vel'));assert.equal(selectMonths(manifest,q).length,1);
  assert.equal(selectMonths(manifest,{...q,persona:'',order:'oldest'})[0].month,'2026-09');
});

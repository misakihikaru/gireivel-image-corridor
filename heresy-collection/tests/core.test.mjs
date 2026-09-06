import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENES, ENDINGS, PREMISES, choiceAt, validChoices, measures, endingFor, theatre, provision, deskResult, newDraft, sanitizeDraft, sanitizeLibrary, recordText} from '../core.mjs';

test('all 243 decision paths have complete endings, theatre and retained support terms',()=>{
  let paths=[[]];
  for(const scene of SCENES)paths=paths.flatMap(path=>scene.choices.map(c=>[...path,c.id]));
  assert.equal(paths.length,243);
  const counts={open:0,conditional:0,closed:0};
  for(const path of paths){
    const before=JSON.stringify(path), ending=endingFor(path);
    assert.equal(ending,ENDINGS[path[4]]);counts[ending.gate]++;
    assert.equal(theatre(path).length,3);
    assert.ok(provision(path).length>0);
    assert.ok(measures(path).every(n=>Number.isFinite(n)&&n>=0&&n<=100));
    assert.equal(endingFor(path,'open'),ENDINGS.open);
    assert.equal(JSON.stringify(path),before,'reconsidering must not rewrite the original');
    for(const act of theatre(path))assert.ok(act.text.every(t=>!t.includes('undefined')));
  }
  assert.deepEqual(counts,{open:81,conditional:81,closed:81});
});
test('partial and hostile storage cannot jump to an ending or inject an ending object',()=>{
  assert.equal(sanitizeDraft(null),null);
  assert.equal(sanitizeDraft({version:99}),null);
  const draft=newDraft('自由。');
  const bad=sanitizeDraft({...draft,choices:['permit','bogus','listen'],stage:'archive',revision:'__proto__',seat:Infinity,premises:['x','consent','consent'],objections:['cost','cost','bad']});
  assert.deepEqual(bad.choices,['permit']);assert.equal(bad.stage,'city');assert.equal(bad.revision,null);assert.equal(bad.seat,0);
  assert.deepEqual(bad.premises,['consent']);assert.deepEqual(bad.objections,['cost']);
  assert.equal(endingFor(['permit']),null);
  assert.deepEqual(validChoices(['deny','sever','veto','exception','closed','extra']),['deny','sever','veto','exception','closed']);
  assert.deepEqual(sanitizeLibrary([draft,null,{}]),[]);
});
test('reload preserves each pending consequence including the final one',()=>{
  const draft=newDraft('約束。');
  for(let i=0;i<5;i++){
    draft.choices.push(SCENES[i].choices[0].id);draft.ack=true;
    const restored=sanitizeDraft(JSON.parse(JSON.stringify(draft)));
    assert.equal(restored.stage,'city');assert.equal(restored.ack,true);assert.equal(restored.choices.length,i+1);
  }
  assert.equal(sanitizeDraft({...draft,ack:false}).stage,'ending');
});
test('all eight premise combinations produce conditional conclusions, never infer prohibition from a missing premise',()=>{
  const results=new Set();
  for(let mask=0;mask<8;mask++){
    const subset=PREMISES.filter((_,i)=>mask&(1<<i)).map(p=>p.id), result=deskResult(subset);results.add(result.title);
    assert.ok(result.text.length>40);
    if(mask!==7)assert.notEqual(result.status,'supported');
  }
  assert.equal(results.size,4);
  assert.equal(deskResult(['consent','equal']).status,'qualified');
});
test('record export contains original and revised verdicts, objections, exact text and later notes',()=>{
  const draft={...newDraft('<script>自由 & 約束</script>'),choices:['deny','bridge','veto','exception','closed'],stage:'archive',revision:'open',rebuttal:'この前提には同意しない。',afterword:'自由にも交渉が要る。',objections:['cost'],notes:[{date:new Date().toISOString(),text:'後日、考えが変わった。'}]};
  const stored=sanitizeLibrary([draft,draft])[0];assert.ok(stored);assert.equal(sanitizeLibrary([draft,draft]).length,1);
  const output=recordText(stored);
  for(const text of [draft.principle,'完全な街','不完全な街',draft.rebuttal,draft.afterword,'後日、考えが変わった。','自由を認めても'])assert.ok(output.includes(text),text);
  assert.ok(output.includes(choiceAt(1,'bridge').rule));
});

import {STORAGE_KEY, ROOMS, SCENES, ENDINGS, PREMISES, OBJECTIONS, choiceAt, measures, endingFor, provision, theatre, deskResult, newDraft, sanitizeDraft, sanitizeLibrary, recordText} from './core.mjs';

const $ = (selector,scope=document)=>scope.querySelector(selector);
const main=$('#main'), entryHTML=main.innerHTML, dialog=$('#dialog');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let draft=null, library=[], noticeTimer, saveTimer=null, dialogReturn=null, storageAvailable=true;
try { const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');draft=sanitizeDraft(raw?.draft);library=sanitizeLibrary(raw?.records); }
catch { storageAvailable=false; }
function notify(message){clearTimeout(noticeTimer);$('#notice').textContent=message;noticeTimer=setTimeout(()=>$('#notice').textContent='',6500);}
function persist(){
  clearTimeout(saveTimer);saveTimer=null;
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,draft,records:library}));storageAvailable=true;return true;}
  catch {storageAvailable=false;notify('このブラウザでは保存できません。書庫で記録をダウンロードしてください。');return false;}
}
function dateLabel(value){return new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));}
function primary(label,action){return `<button class="primary" type="button" data-action="${action}">${label}<span aria-hidden="true">→</span></button>`;}
function quote(text,name){return `<blockquote class="voice"><p>「${esc(text)}」</p><cite>${name} GIREIVEL</cite></blockquote>`;}
function stageIndex(){return draft?({city:1,ending:1,theatre:2,desk:3,archive:4})[draft.stage]:0;}
function updateChrome(){
  $('#journey').innerHTML=ROOMS.map((room,i)=>`<li ${stageIndex()===i?'aria-current="step"':''} class="${i<stageIndex()?'passed':''}"><span>0${i}</span> ${room}</li>`).join('');
  $('#archive-count').textContent=String(library.length).padStart(2,'0');
  $('#reset-run').hidden=!draft;
  document.body.dataset.room=draft?.stage||'threshold';
  document.title=draft?`${ROOMS[stageIndex()]} · 異端蒐集館 | GIREIVEL`:'異端蒐集館 | GIREIVEL';
}
function ledger(){return `<details class="ledger"><summary>これまでの裁定 <span>${draft.choices.length} / 5</span></summary>${draft.choices.length?`<ol>${draft.choices.map((id,i)=>`<li><small>${SCENES[i].title}</small><p>${esc(choiceAt(i,id).rule)}</p></li>`).join('')}</ol>`:'<p>まだ裁定はありません。</p>'}</details>`;}
function dossier(){return `<div class="dossier"><p class="eyebrow">DEPOSITED WORDS</p><p class="deposited">${esc(draft.principle)}</p><span class="micro">入館時の言葉 / この一文は上書きされません</span></div>`;}
function cityMap(){
  const vals=measures(draft.choices), final=endingFor(draft.choices,draft.revision);
  const gate=final?.mark||(draft.choices[0]==='permit'?'退出受理':draft.choices[0]==='deny'?'退出却下':draft.choices[0]?'再審査':'未決');
  const finalCondition=final?({open:'退出制限は失効',conditional:'条件を再審査',closed:'退出は一律停止'})[final.gate]:null;
  const points=[{x:80,y:120,label:'居住区',sub:finalCondition||(draft.choices[2]==='veto'?'同意条件あり':'セナ')},{x:230,y:55,label:'時計工房',sub:'イオ'},{x:370,y:120,label:'東門',sub:gate},{x:300,y:285,label:'配給所',sub:draft.choices[1]==='bridge'?'外向けの棚':draft.choices[1]==='sever'?'保障終了条項':'共同の倉'},{x:135,y:285,label:'製パン所',sub:finalCondition||(draft.choices[3]==='exception'?'期限未定':'ネリ')},{x:225,y:180,label:'評議堂',sub:final?.mark==='審査'?'鍵の保管者':'裁定の席'}];
  return `<div class="city-panel"><div class="map-heading"><span>幸福都市 / 配置図</span><span class="gate-status">${gate}</span></div><svg class="city-map" viewBox="0 0 450 355" role="img" aria-label="街の関係図。東門：${gate}。イオ、セナ、ネリを評議堂と配給所が結ぶ。"><g class="map-paths"><path d="M80 120L230 55L370 120L300 285L135 285Z M80 120L225 180L370 120 M230 55L225 180L300 285 M225 180L135 285"/></g>${points.map((p,i)=>`<g class="map-node ${i===2?'gate-node':''}" transform="translate(${p.x},${p.y})"><circle r="${i===5?22:12}"/><circle r="3" class="node-core"/><text y="${i===5?43:32}" text-anchor="middle">${p.label}</text><text class="node-sub" y="${i===5?63:51}" text-anchor="middle">${p.sub}</text></g>`).join('')}</svg><div class="measures">${['自己決定','共同の保障','規則の固定'].map((label,i)=>`<div><span>${label}</span><meter min="0" max="100" value="${vals[i]}" aria-label="${label}の傾向 ${vals[i]}"></meter><small>${vals[i]>60?'強まる':vals[i]<40?'弱まる':'中間'}</small></div>`).join('')}</div><p class="micro">五つの裁定の傾向。幸福度や成績ではありません。</p></div>`;
}
function shell(content,aside,extra=''){return `<section class="room-layout ${extra}"><div class="room-content">${content}</div><aside class="room-aside">${aside}</aside></section>`;}
function render(focus=true){
  updateChrome();
  if(!draft)main.innerHTML=entryHTML;
  else if(draft.stage==='city')renderCity();
  else if(draft.stage==='ending')renderEnding();
  else if(draft.stage==='theatre')renderTheatre();
  else if(draft.stage==='desk')renderDesk();
  else renderArchive();
  if(!storageAvailable&&draft)main.insertAdjacentHTML('afterbegin','<p class="storage-warning">保存を利用できません。この画面を閉じる前に、書庫で記録を持ち出してください。</p>');
  if(focus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function renderCity(){
  const index=draft.ack?draft.choices.length-1:draft.choices.length, scene=SCENES[index];
  if(!scene){draft.stage='ending';persist();updateChrome();renderEnding();return;}
  let body=`<p class="eyebrow">CHRONOA / ${scene.subtitle}</p><div class="chapter-heading"><span class="chapter-numeral">${String(index+1).padStart(2,'0')}</span><h1>${scene.title}</h1></div>`;
  if(draft.ack){
    const choice=choiceAt(index,draft.choices[index]);
    body+=`<p class="eyebrow result-label">裁定済み / ${esc(choice.title)}</p><div class="consequence"><p>${esc(choice.consequence)}</p></div><div class="enacted"><span>記録された条項</span><p>${esc(choice.rule)}</p></div>${quote(index===4?ENDINGS[draft.choices[4]].quote:'決定は受け取りました。結果の方も、お持ち帰りください。','CHRONOA')}<div class="actions">${primary(index===4?'街の結末を見る':'次の照会を開く','next-scene')}</div>`;
  }else{
    body+=`<div class="story">${scene.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${quote(scene.quote,'CHRONOA')}<form id="decision"><fieldset><legend>${scene.question}</legend><div class="choices">${scene.choices.map((c,i)=>`<label class="choice"><input type="radio" name="decision" value="${c.id}" required><span class="choice-index">${['I','II','III'][i]}</span><span><strong>${c.title}</strong><small>${c.text}</small></span></label>`).join('')}</div></fieldset><div class="actions"><button class="primary" id="confirm-decision" type="submit" disabled>この裁定を記す <span aria-hidden="true">→</span></button><span class="micro">結果は、裁定の後に届きます。</span></div></form>`;
  }
  main.innerHTML=shell(body,cityMap()+dossier()+ledger());
}
function renderEnding(){
  const end=endingFor(draft.choices);
  const content=`<p class="eyebrow">CHRONOA / FIRST VERDICT</p><div class="ending-heading"><span class="ending-number">${end.number}</span><p>第一蒐集の結末</p><h1>${end.title}</h1><p class="end-subtitle">${end.subtitle}</p></div><div class="story">${end.paragraphs.map(p=>`<p>${p}</p>`).join('')}<p>${provision(draft.choices)}${end.gate==='closed'?' 現在は退出停止中のため、この条項が適用される退出者はいない。':''}</p></div>${quote(end.quote,'CHRONOA')}<div class="next-room"><span>扉の向こう / VEL</span><p>今度は、貴方の判決を受け取る席へ。</p>${primary('反転劇場へ進む','enter-theatre')}</div>`;
  main.innerHTML=shell(content,cityMap()+dossier()+ledger(),'ending-room');
}
function renderTheatre(){
  const acts=theatre(draft.choices), act=acts[draft.seat];
  const content=`<p class="eyebrow">VEL / THE REVERSAL THEATRE</p><div class="theatre-heading"><span>第 ${['一','二','三'][draft.seat]} 幕</span><h1>${act.title}</h1></div><div class="seat-strip" aria-label="観劇した席">${acts.map((a,i)=>`<span class="${i===draft.seat?'active':''}">${['I','II','III'][i]} · ${a.seat}</span>`).join('')}</div><p class="actor">${act.name}</p><div class="story">${act.text.map(p=>`<p>${esc(p)}</p>`).join('')}</div><blockquote class="testimony">${act.line}</blockquote>${quote(act.vel,'VEL')}`;
  const endingActions=draft.seat<2?`<div class="actions">${draft.seat?'<button class="quiet-button" data-action="previous-seat">← 前の席へ</button>':''}${primary('次の席へ移る','next-seat')}</div>`:`<form id="revision"><fieldset><legend>すべての席を見た後で、第一条をどう扱いますか？</legend><p class="micro">初めの裁定は残ります。変更は、その後の裁定として追記されます。</p><div class="choices compact">${SCENES[4].choices.map(c=>`<label class="choice"><input type="radio" name="revision" value="${c.id}" ${(draft.revision||draft.choices[4])===c.id?'checked':''}><span><strong>${c.title}</strong><small>${c.id===draft.choices[4]?'初めの裁定':c.text}</small></span></label>`).join('')}</div></fieldset><div class="actions"><button class="quiet-button" type="button" data-action="previous-seat">← 前の席へ</button><button class="primary" type="submit">この判断を解体机へ <span aria-hidden="true">→</span></button></div></form>`;
  main.innerHTML=shell(content+endingActions,`<div class="theatre-ticket"><p class="eyebrow">RESERVED SEAT</p><span class="ticket-number">${['I','II','III'][draft.seat]}</span><p>${act.seat}</p><hr><small>演目 001 / 例外の所在</small><p class="micro">判決は同じ。<br>代償を受け取る人が変わる。</p></div>${dossier()+ledger()}`,'theatre-room');
}
function deskOutput(){const result=deskResult(draft.premises);return `<span class="eyebrow">${draft.premises.length} / 3 PREMISES</span><h2>${result.title}</h2><p>${result.text}</p>`;}
function renderDesk(){
  const current=endingFor(draft.choices,draft.revision);
  const content=`<p class="eyebrow">LACREVEX / THE DISSECTION DESK</p><div class="chapter-heading"><span class="chapter-numeral">03</span><h1>理由を、外してみる。</h1></div><p class="room-lead">貴方の現在の裁定は「${current.title}」。<br>この机では、退出権を支持する論証を組み立てます。採用しない前提を外し、何がまだ言えるかを確かめてください。</p>${quote('前提を外しても同じ結論を叫ぶなら、それは論証ではなく、好みの発表会ですよ？','LACREVEX')}<div class="fact-sheet"><p class="eyebrow">この事件で分かっていること</p><ul><li>イオは危険の説明を読み、退出を希望している。</li><li>外での暮らしが成功する保証はない。</li><li>配送と引き継ぎの負担には、未合意の部分がある。</li></ul></div><fieldset class="premises"><legend>採用する前提</legend>${PREMISES.map((p,i)=>`<label class="premise"><input type="checkbox" name="premise" value="${p.id}" ${draft.premises.includes(p.id)?'checked':''}><span class="premise-number">0${i+1}</span><span><strong>${p.label}</strong><small>${p.detail}</small></span></label>`).join('')}</fieldset><div id="desk-result" class="desk-result" aria-live="polite">${deskOutput()}</div><section class="objections"><h2>机の側にも、異議を。</h2><p>指摘を選ぶと、ラクスの応答と論証への影響が残ります。</p>${OBJECTIONS.map(o=>`<details><summary>${o.title}</summary><p>${o.text}</p><button type="button" class="text-button" data-objection="${o.id}" ${draft.objections.includes(o.id)?'disabled':''}>${draft.objections.includes(o.id)?'異議は記録済み':'この異議を提出する →'}</button><p class="objection-reply" id="reply-${o.id}" ${draft.objections.includes(o.id)?'':'hidden'}>「${o.reply}」</p></details>`).join('')}</section><label class="field-label" for="rebuttal">自分の言葉で反論を残す <span>任意 / 1,200字まで</span></label><textarea id="rebuttal" rows="4" maxlength="1200" placeholder="採用できない前提、まだ足りない条件、机への異議。">${esc(draft.rebuttal)}</textarea><p class="micro">自由記述はそのまま記録されます。内容を自動で評価しません。</p><div class="actions">${primary('変容書庫へ進む','enter-archive')}</div>`;
  main.innerHTML=shell(content,`<div class="argument-index"><span class="eyebrow">ARGUMENT 001</span><h2>退出する権利</h2><div class="argument-line"><span>事実</span><span>＋</span><span>採用する前提</span></div><div class="argument-arrow" aria-hidden="true">↓</div><p>この条件で導ける結論</p><small>他の前提から、別の論証を作る余地は残ります。</small></div>${dossier()+ledger()}`,'desk-room');
}
function renderArchive(){
  const original=endingFor(draft.choices), current=endingFor(draft.choices,draft.revision), saved=library.some(r=>r.id===draft.id);
  const content=`<p class="eyebrow">REZEL / THE PALIMPSEST ARCHIVE</p><div class="chapter-heading"><span class="chapter-numeral">04</span><h1>変わった分を、残す。</h1></div>${quote('初めの言葉も、ここで書き足す言葉も、両方置いていきなさい。変わった箇所まで消す必要はありません。','REZEL')}<div class="record-sheet"><div class="record-top"><span>蒐集記録 001</span><time>${dateLabel(draft.started)}</time></div><span class="eyebrow">入館時の言葉</span><p class="record-principle">${esc(draft.principle)}</p><div class="verdict-comparison"><div><small>街で下した裁定</small><strong>${original.title}</strong></div><span aria-hidden="true">→</span><div><small>劇場を出た後</small><strong>${current.title}</strong></div></div><p class="micro">${original===current?'裁定は維持されました。違う席を見たことも、この記録の一部です。':'初めの裁定を残したまま、新しい裁定が重ねられました。'}</p><div class="final-clause"><span class="eyebrow">現在の第一条</span><p>${choiceAt(4,draft.revision||draft.choices[4]).rule}</p><p>${provision(draft.choices)}${current.gate==='closed'?' 現在の閉門中は、この退出条項の適用はありません。':''}</p></div><p class="desk-summary">机で残った結論：${deskResult(draft.premises).title}</p>${draft.rebuttal?`<details><summary>自分の反論</summary><p class="user-text">${esc(draft.rebuttal)}</p></details>`:''}</div><label class="field-label" for="afterword">いま、持ち帰る言葉 <span>任意 / 160字まで</span></label><textarea id="afterword" maxlength="160" rows="3" ${saved?'readonly':''} placeholder="同じ言葉でも、書き換えた言葉でも。">${esc(draft.afterword)}</textarea><div class="actions"><button type="button" class="primary" data-action="save-record" ${saved?'disabled':''}>${saved?'書庫に収蔵済み':'この記録を収蔵する'}<span aria-hidden="true">＋</span></button><button type="button" class="text-button" data-action="export-current">記録を持ち出す ↓</button></div><p class="micro">このブラウザにだけ保存されます。公開されません。持ち出したテキストは、ご自身で公開することもできます。</p><div class="closing"><p>門は、最初と同じ場所にあります。</p><div class="actions"><button class="quiet-button" data-action="restart">別の言葉で、もう一巡 →</button><a class="quiet-button" href="../">館へ戻る ↗</a></div></div>`;
  main.innerHTML=shell(content,`<div class="archive-sigil"><p class="eyebrow">PRESERVED / ${String(library.length).padStart(2,'0')}</p><span class="archive-glyph" aria-hidden="true">${current.number}</span><p>${current.title}</p><div class="record-spines" aria-hidden="true">${Array.from({length:Math.min(12,library.length)},(_,i)=>`<i style="height:${50+(i%4)*12}px"></i>`).join('')}</div><p class="micro">${library.length?'収蔵された記録の数だけ、書庫に背表紙が増えます。':'最初の背表紙は、まだありません。'}</p></div>${dossier()+ledger()}`,'archive-room');
}
function openDialog(html){if(!dialog.open)dialogReturn=document.activeElement;$('#dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();const heading=$('#dialog-title');heading.tabIndex=-1;heading.focus();}
function closeDialog(){dialog.close();dialogReturn?.focus();}
function archiveList(){
  openDialog(`<p class="eyebrow">REZEL / PRIVATE COLLECTION</p><h2 id="dialog-title">収蔵された記録</h2><p class="micro">このブラウザの書庫 / ${library.length}点</p>${library.length?`<div class="archive-list">${[...library].reverse().map(r=>`<button data-record="${esc(r.id)}"><time>${dateLabel(r.started)}</time><strong>${endingFor(r.choices,r.revision).title}</strong><span>${esc(r.principle)}</span><small>${r.notes.length}件の追記 →</small></button>`).join('')}</div>`:'<p class="empty-archive">まだ、収蔵された言葉はありません。<br>四つの部屋を巡った後で、残すものを決めてください。</p>'}`);
}
function showRecord(id){
  const record=library.find(r=>r.id===id);if(!record)return archiveList();
  openDialog(`<button class="quiet-button" data-action="archive-list">← 書庫の一覧</button><h2 id="dialog-title">${endingFor(record.choices,record.revision).title}</h2><p class="eyebrow">${dateLabel(record.started)}</p><p class="record-principle">${esc(record.principle)}</p><details><summary>裁定と反論の全文</summary><pre class="record-transcript">${esc(recordText({...record,notes:[]}))}</pre></details><p class="field-label">持ち帰った言葉</p><p class="user-text">${esc(record.afterword||'言葉は追加されていません。')}</p><div class="appendices">${record.notes.map(n=>`<article><time>${dateLabel(n.date)}</time><p class="user-text">${esc(n.text)}</p></article>`).join('')}</div><form id="append-note" data-id="${esc(record.id)}"><label class="field-label" for="note">この記録に、いまの言葉を重ねる</label><textarea id="note" rows="3" maxlength="1200" required></textarea><button class="text-button" type="submit">追記を残す ＋</button></form><div class="actions"><button class="text-button" data-export="${esc(id)}">記録を持ち出す ↓</button><button class="quiet-button danger" data-delete="${esc(id)}">この記録を消す</button></div>`);
}
function download(record){
  const blob=new Blob(['\uFEFF'+recordText(record)],{type:'text/plain;charset=utf-8'}), url=URL.createObjectURL(blob), anchor=document.createElement('a');
  anchor.href=url;anchor.download=`gireivel-${record.started.slice(0,10)}-${endingFor(record.choices,record.revision)?.number||'record'}.txt`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);notify('記録のダウンロードを開始しました。');
}
function advance(stage){draft.stage=stage;draft.ack=false;persist();render();}
function restart(){clearTimeout(saveTimer);draft=null;persist();closeDialog();render();}

document.addEventListener('submit',event=>{
  const form=event.target;
  if(!['admission','decision','revision','append-note'].includes(form.id))return;
  event.preventDefault();
  if(form.id==='admission'){
    const value=$('#principle').value.trim();
    if(!value){$('#principle').setCustomValidity('持ち込む言葉をひとつ記してください。');$('#principle').reportValidity();return;}
    draft=newDraft(value);persist();render();
  }else if(form.id==='decision'){
    if(draft?.stage!=='city'||draft.ack)return;
    const value=new FormData(form).get('decision');if(!choiceAt(draft.choices.length,value))return;
    draft.choices.push(value);draft.ack=true;persist();render();
  }else if(form.id==='revision'){
    if(draft?.stage!=='theatre'||draft.seat!==2)return;
    const value=new FormData(form).get('revision');if(!ENDINGS[value])return;
    draft.revision=value===draft.choices[4]?null:value;advance('desk');
  }else{
    const record=library.find(r=>r.id===form.dataset.id), value=$('#note').value.trim();
    if(!record||!value){$('#note')?.setCustomValidity('追記する言葉を記してください。');$('#note')?.reportValidity();return;}
    if(record.notes.length>=100){notify('追記は100件までです。記録を持ち出して保管してください。');return;}
    record.notes.push({date:new Date().toISOString(),text:value.slice(0,1200)});
    const saved=persist();showRecord(record.id);notify(saved?'元の記録を残して、追記しました。':'追記は画面内にあります。記録を持ち出して保管してください。');
  }
});
document.addEventListener('change',event=>{
  const input=event.target;
  if(input.name==='decision')$('#confirm-decision').disabled=false;
  if(input.name==='premise'&&draft?.stage==='desk'){
    draft.premises=[...document.querySelectorAll('[name="premise"]:checked')].map(x=>x.value);persist();$('#desk-result').innerHTML=deskOutput();
  }
});
document.addEventListener('input',event=>{
  const input=event.target;
  if(input.id==='principle'||input.id==='note')input.setCustomValidity('');
  if(draft&&['rebuttal','afterword'].includes(input.id)){
    draft[input.id]=input.value.slice(0,input.id==='rebuttal'?1200:160);clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);
  }
});
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled)return;
  if(button.dataset.principle){$('#principle').value=button.dataset.principle;$('#principle').setCustomValidity('');return;}
  if(button.id==='close-dialog'||button.id==='cancel-restart')return closeDialog();
  if(button.id==='open-archive')return archiveList();
  if(button.id==='about')return openDialog('<h2 id="dialog-title">記録について</h2><p>異端蒐集館は、作者が記した架空の事件を巡る短編遊戯です。自由記述を診断したり、人格を採点したりする仕組みはありません。</p><p>進行中の裁定は自動保存されます。最後に「収蔵する」を選ぶと書庫に残り、後から追記・持ち出し・削除ができます。収蔵は30件、各記録への追記は100件までです。</p><p>記録は、このブラウザの保存領域にだけあります。別の端末には同期されず、閲覧データの消去で失われます。大切な記録はテキストとして持ち出してください。</p><p>この部屋は、記入した文章と選択を外部へ送信しません。</p>');
  if(button.dataset.record)return showRecord(button.dataset.record);
  if(button.dataset.export){const r=library.find(r=>r.id===button.dataset.export);if(r)download(r);return;}
  if(button.dataset.delete){const id=button.dataset.delete;openDialog(`<h2 id="dialog-title">この記録を消しますか？</h2><p>元の裁定と追記を、このブラウザの書庫から消します。元に戻すことはできません。</p><div class="actions"><button class="primary" data-confirm-delete="${esc(id)}">記録を消す</button><button class="quiet-button" data-record="${esc(id)}">残す</button></div>`);return;}
  if(button.dataset.confirmDelete){
    const id=button.dataset.confirmDelete;library=library.filter(r=>r.id!==id);if(draft?.id===id)draft=null;
    const saved=persist();render(false);archiveList();notify(saved?'書庫から記録を消しました。':'画面から記録を除きましたが、保存領域を更新できませんでした。');return;
  }
  if(button.dataset.objection&&draft?.stage==='desk'){
    const o=OBJECTIONS.find(x=>x.id===button.dataset.objection);if(!o||draft.objections.includes(o.id))return;
    draft.objections.push(o.id);if(o.remove)draft.premises=draft.premises.filter(id=>id!==o.remove);persist();button.disabled=true;button.textContent='異議は記録済み';$(`#reply-${o.id}`).hidden=false;
    document.querySelectorAll('[name="premise"]').forEach(input=>input.checked=draft.premises.includes(input.value));$('#desk-result').innerHTML=deskOutput();notify('異議とラクスの応答を記録しました。');return;
  }
  const action=button.dataset.action;
  if(action==='archive-list')return archiveList();
  if(action==='restart-confirm')return restart();
  if(!draft)return;
  if(action==='next-scene'&&draft.stage==='city'&&draft.ack){draft.ack=false;if(draft.choices.length===5)draft.stage='ending';persist();render();}
  if(action==='enter-theatre'&&draft.stage==='ending')advance('theatre');
  if(action==='next-seat'&&draft.stage==='theatre'&&draft.seat<2){draft.seat++;persist();render();}
  if(action==='previous-seat'&&draft.stage==='theatre'&&draft.seat>0){draft.seat--;persist();render();}
  if(action==='enter-archive'&&draft.stage==='desk')advance('archive');
  if(action==='export-current')download(library.find(r=>r.id===draft.id)||draft);
  if(action==='save-record'&&draft.stage==='archive'){
    if(library.some(r=>r.id===draft.id))return;
    if(library.length>=30){notify('書庫は30件で満ちています。持ち出した後、不要な記録を消してください。');archiveList();return;}
    draft.saved=true;library.push({...JSON.parse(JSON.stringify(draft)),savedAt:new Date().toISOString(),notes:[]});
    if(!persist()){library.pop();draft.saved=false;notify('収蔵できませんでした。「記録を持ち出す」で保管してください。');return;}
    render(false);notify('新しい背表紙を、書庫に収めました。');
  }
  if(action==='restart'){
    if(library.some(r=>r.id===draft.id))return restart();
    openDialog('<h2 id="dialog-title">この一巡を閉じますか？</h2><p>まだ収蔵されていない進行記録は消えます。書庫に収蔵した過去の記録は残ります。</p><div class="actions"><button class="primary" data-action="restart-confirm">別の言葉で入館する</button><button class="quiet-button" id="cancel-restart">この一巡に戻る</button></div>');
  }
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
window.addEventListener('pagehide',()=>{if(saveTimer)persist();});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY)return;
  try{const raw=JSON.parse(event.newValue||'{}');library=sanitizeLibrary(raw.records);draft=sanitizeDraft(raw.draft);render(false);if(dialog.open)archiveList();notify('別のタブで更新された記録を読み込みました。');}catch{/* Keep the last readable state. */}
});
render(false);
if(draft)notify('前回の一巡を、続きから開きました。');

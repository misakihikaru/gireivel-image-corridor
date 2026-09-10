import {names,cleanQuery,matches,selectMonths,validRecord,monthOfPost} from './core.mjs?v=english-1';
const $=selector=>document.querySelector(selector), form=$('#filters'), entries=$('#entries'), status=$('#status'), more=$('#more'), dialog=$('#record-dialog');
const cache=new Map(), visible=new Map();let manifest,query,cursor=0,months=[],pending=[],generation=0,loading=false,lastFocus;
const element=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const stamp=iso=>new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)).replaceAll('/','.');
function entryURL(id){const u=new URL(location.href);u.searchParams.set('entry',id);return u;}
function card(record,detail=false){
  const article=element('article','entry');article.id=`record-${record.id}`;
  const meta=element('div','entry-meta'),time=element('time','',stamp(record.publishedAt));time.dateTime=record.publishedAt;
  meta.append(time,element('div','entry-persona',names[record.persona]),element('div','entry-kind',record.medium==='image'?'画像':'文章'));
  const body=element('div','entry-body');
  if(record.image){const picture=element(detail?'div':'a','entry-image');if(!detail){picture.href=entryURL(record.id);picture.setAttribute('aria-label','画像と記録を大きく開く');picture.onclick=e=>{e.preventDefault();openRecord(record);};}const img=element('img');img.src=record.image;img.alt=record.alt;img.loading=detail?'eager':'lazy';img.decoding='async';picture.append(img);body.append(picture);}
  const source=(tag,cls,text,lang)=>{const node=element(tag,cls,text);node.setAttribute('data-i18n-ignore','');if(lang)node.lang=lang;return node;};
  const translation=(text)=>{const block=source('div','entry-translation','', 'ja');block.append(element('small','','日本語訳 / Japanese translation'),element('p','',text));return block;};
  if(record.text)body.append(source('p',`entry-text${record.medium==='image'?' image-caption':''}`,record.text,record.sourceLanguage));
  if(record.textJa)body.append(translation(record.textJa));
  if(record.publicNote){const note=element('div','intention');note.append(element('small','',record.medium==='image'?'画に添えて':'記録に添えて'),source('p','',record.publicNote,record.sourceLanguage));if(record.publicNoteJa)note.append(translation(record.publicNoteJa));body.append(note);}
  const links=element('div','entry-links'),local=element('a','','この記録を開く'),x=element('a','','Xで見る ↗');
  local.href=entryURL(record.id);local.onclick=e=>{e.preventDefault();openRecord(record);};x.href=`https://x.com/gireivelaest/status/${record.id}`;x.target='_blank';x.rel='noopener noreferrer';
  if(!detail)links.append(local);else{const permalink=element('a','','この記録へのリンク');permalink.href=entryURL(record.id);links.append(permalink);}links.append(x);body.append(links);article.append(meta,body);return article;
}
function openRecord(record,update=true){lastFocus=document.activeElement;$('#record-content').replaceChildren(card(record,true));$('#record-title').textContent=`${names[record.persona]}の記録`;if(update)history.pushState(null,'',entryURL(record.id));if(!dialog.open)dialog.showModal();$('#close-dialog').focus();}
function closeRecord(){dialog.close();const u=new URL(location.href);u.searchParams.delete('entry');history.replaceState(null,'',u);lastFocus?.focus();}
$('#close-dialog').onclick=closeRecord;dialog.addEventListener('cancel',e=>{e.preventDefault();closeRecord();});
async function shard(month){
  if(!/^data\/\d{4}-\d{2}-[a-f0-9]{16}\.json$/.test(month.path))throw Error('invalid-shard');
  if(!cache.has(month.path)){const response=await fetch(month.path);if(!response.ok)throw Error('load');const data=await response.json();if(!Array.isArray(data.records)||!data.records.every(validRecord))throw Error('invalid-records');cache.set(month.path,data.records);}
  return cache.get(month.path);
}
async function loadMore(token=generation){
  if(loading)return;loading=true;more.disabled=true;$('#retry').hidden=true;entries.setAttribute('aria-busy','true');status.textContent='記録を辿っています…';
  try{let appended=0;
    while(appended<24){
      if(token!==generation)return;
      if(!pending.length){if(cursor>=months.length)break;const records=await shard(months[cursor]);if(token!==generation)return;cursor++;pending=records.filter(r=>matches(r,query)).sort((a,b)=>query.order==='oldest'?a.publishedAt.localeCompare(b.publishedAt):b.publishedAt.localeCompare(a.publishedAt));}
      while(pending.length&&appended<24){const r=pending.shift();if(visible.has(r.id))continue;visible.set(r.id,r);entries.append(card(r));appended++;}
    }
    if(token!==generation)return;
    more.hidden=!pending.length&&cursor>=months.length;$('#empty').hidden=visible.size>0;status.textContent=`${visible.size}件を表示${more.hidden?'':' · 続く記録があります'}`;
  }catch{if(token===generation){status.textContent='記録を読み込めませんでした。もう一度お試しください。';$('#retry').hidden=false;}}
  finally{if(token===generation){loading=false;more.disabled=false;entries.removeAttribute('aria-busy');}}
}
function populate(q){for(const key of ['q','persona','from','to','order'])form.elements.namedItem(key).value=q[key];form.elements.namedItem('medium').value=q.medium;if(q.q||q.persona||q.from||q.to)$('#refine').open=true;}
async function search(params,update=true){
  generation++;loading=false;const token=generation;query=cleanQuery(params);populate(query);visible.clear();entries.replaceChildren();$('#empty').hidden=true;more.hidden=true;$('#retry').hidden=true;cursor=0;pending=[];
  if(update){const u=new URL(location.href);u.search='';for(const [k,v]of Object.entries(query))if(v&&!(k==='order'&&v==='newest'))u.searchParams.set(k,v);history.pushState(null,'',u);}
  if(query.from&&query.to&&query.from>query.to){status.textContent='はじめの日付を、おわりの日付以前にしてください。';return;}
  months=selectMonths(manifest,query);await loadMore(token);
}
form.onsubmit=e=>{e.preventDefault();search(new URLSearchParams(new FormData(form)));};
form.onreset=()=>setTimeout(()=>search(new URLSearchParams()),0);
form.addEventListener('change',e=>{if(['medium','persona','order'].includes(e.target.name))search(new URLSearchParams(new FormData(form)));});
more.onclick=()=>loadMore();$('#retry').onclick=()=>manifest?loadMore():boot();
async function findEntry(id){if(!id)return;let r=visible.get(id);if(!r){const month=manifest.months.find(m=>m.month===monthOfPost(id));if(month)r=(await shard(month)).find(r=>r.id===id);}if(r)openRecord(r,false);else status.textContent='指定された記録は見つかりませんでした。';}
window.addEventListener('popstate',async()=>{if(dialog.open)dialog.close();if(!manifest)return;await search(new URLSearchParams(location.search),false);await findEntry(new URLSearchParams(location.search).get('entry'));});
async function boot(){try{const response=await fetch('data/manifest.json',{cache:'no-cache'});if(!response.ok)throw Error('manifest');manifest=await response.json();if(manifest.version!==1||!Array.isArray(manifest.months))throw Error('manifest');$('#collection-count').textContent=`${manifest.total} RECORD${manifest.total===1?'':'S'} / 継続する記録`;await search(new URLSearchParams(location.search),false);await findEntry(new URLSearchParams(location.search).get('entry'));}catch{status.textContent='記録を読み込めませんでした。';$('#retry').hidden=false;}}
boot();

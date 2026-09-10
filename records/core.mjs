export const names = Object.freeze({chronoa:'クロノア',vel:'ヴェル',rezel:'レゼル',lacrevex:'ラクレヴェクス'});
const normalize = text => String(text ?? '').normalize('NFKC').toLocaleLowerCase('ja');
export const dateKey = iso => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
export function cleanQuery(params) {
  const date = key => /^\d{4}-\d{2}-\d{2}$/.test(params.get(key)??'') ? params.get(key) : '';
  return {q:(params.get('q')??'').slice(0,120).trim(),medium:['text','image'].includes(params.get('medium'))?params.get('medium'):'',persona:Object.hasOwn(names,params.get('persona'))?params.get('persona'):'',from:date('from'),to:date('to'),order:params.get('order')==='oldest'?'oldest':'newest'};
}
export function matches(record,q) {
  const day=dateKey(record.publishedAt);
  return (!q.medium||record.medium===q.medium)&&(!q.persona||record.persona===q.persona)&&(!q.from||day>=q.from)&&(!q.to||day<=q.to)&&(!q.q||normalize([record.text,record.textJa,record.publicNote,record.publicNoteJa,record.alt,record.altJa,names[record.persona]].join(' ')).includes(normalize(q.q)));
}
export function selectMonths(manifest,q) {
  const months=manifest.months.filter(m=>(!q.from||m.month>=q.from.slice(0,7))&&(!q.to||m.month<=q.to.slice(0,7))&&(!q.persona||m.personas[q.persona])&&(!q.medium||m.media[q.medium]));
  return [...months].sort((a,b)=>q.order==='oldest'?a.month.localeCompare(b.month):b.month.localeCompare(a.month));
}
export function validRecord(r) {
  return r&&['textJa','publicNoteJa','altJa'].every(key=>r[key]===undefined||typeof r[key]==='string')&&(r.sourceLanguage===undefined||r.sourceLanguage==='en')&&/^\d{10,25}$/.test(r.id)&&Object.hasOwn(names,r.persona)&&['text','image'].includes(r.medium)&&Number.isFinite(Date.parse(r.publishedAt))&&typeof r.text==='string'&&typeof r.publicNote==='string'&&typeof r.alt==='string'&&(!r.image||/^data\/assets\/[a-f0-9]{64}\.png$/.test(r.image));
}
export function monthOfPost(id) {
  if(!/^\d{10,25}$/.test(id??''))return null;
  try { return dateKey(new Date(Number((BigInt(id)>>22n)+1288834974657n))).slice(0,7); } catch { return null; }
}

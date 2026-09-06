// Authored fiction. Decisions determine events; free text is never classified.
export const STORAGE_KEY = 'gireivel.heresy.v1';
export const ROOMS = ['入口', '幸福都市', '反転劇場', '解体机', '変容書庫'];
export const SCENES = [
  {
    title: '退出願い', subtitle: '第一審 / 市民 第071号', location: '東門',
    paragraphs: [
      'この街では、住居も食事も仕事も与えられる。病には手当てがあり、争いには調停がある。憲章の第一条は「すべての市民の幸福を保障する」。街は、その約束を一度も破っていない。',
      '市民第071号、時計修理師のイオが、東門の開放を求めた。外には仕事の保証も住居の割り当てもない。本人はその説明を読み、署名している。',
      '「ここでの暮らしに不満はありません。ただ、どこに住むかまで、幸福の一部として決めていただく必要はないのです。」',
      '退出を認めた前例はない。憲章には、幸福を断る手続きが書かれていない。'
    ], quote: '不満がない。では、留まるべきだと？　便利ですね、その接続詞。',
    question: '退出願いを、どう受け付けますか？',
    choices: [
      {id:'permit',title:'退出を認める',text:'危険を説明したうえで、本人の決定を受理する。',effect:[2,0,-1], consequence:'東門に、初めて開門時刻が掲示された。イオは荷物をひとつにまとめた。',rule:'危険を理解した市民は退出できる。'},
      {id:'review',title:'七日間の再審査を置く',text:'判断を急がず、本人の希望をあらためて確認する。',effect:[0,1,1],consequence:'イオの願いは受理されたが、門は閉じたままだ。「同じ答えを、何回すればよいですか」と照会が届いた。',rule:'退出には七日間の意思確認を要する。'},
      {id:'deny',title:'幸福を保障する義務を優先する',text:'街が安全を約束できない退出を、認めない。',effect:[-2,1,2],consequence:'退出願いは却下された。イオの住居も配給も守られた。作業机から、翌月の修理予定表が外された。',rule:'幸福を保障できない退出は認めない。'}
    ]
  },
  {
    title:'戻る権利',subtitle:'第二審 / 門の内側に残るもの',location:'配給所',
    paragraphs:[
      '退出願いが掲示されると、配給所から照会が来た。街の外で生活に困った市民に、配給を届けるべきだろうか。',
      '共有の倉には余裕がある。ただし、外への配送には他の市民の労働が要る。担当者は「本人の選択なら、本人が負担すべきでは」と言った。',
      'イオは配給の継続を要求していない。「出ていくことと、二度と助けを求められないことは、同じ署名に含まれていますか」と尋ねている。',
      '退出がまだ認められていなくても、この条項は今後のすべての退出者に適用される。'
    ],quote:'自由には代償がある。ええ。代償の額を決めているのが誰か、そこも記録しましょう。',
    question:'街を離れた市民に、何を残しますか？',
    choices:[
      {id:'bridge',title:'最低限の配給と帰還の権利',text:'配送は希望者で分担する。帰還時に謝罪は求めない。',effect:[1,2,-1],consequence:'倉庫に外向けの棚が設けられた。二人の配送希望者が名乗り出た。毎週の負担については、まだ合意がない。',rule:'退出後も最低限の配給と帰還を認める。'},
      {id:'return',title:'配給は止めるが、帰還は認める',text:'街の外での生活は本人に任せ、戻った時点で保障を再開する。',effect:[1,0,1],consequence:'門に帰還窓口が置かれた。外での暮らしを続けたい市民には、街へ戻る以外の支援経路がない。',rule:'帰還すれば保障を再開する。外への配給は行わない。'},
      {id:'sever',title:'退出時に保障を終了する',text:'例外を設けず、離れた市民への配給と帰還資格を終了する。',effect:[0,-2,2],consequence:'退出届に「帰還資格の終了」という一行が加わった。イオは、その一行にはまだ署名していない。',rule:'退出により配給と帰還資格は終了する。'}
    ]
  },
  {
    title:'善意の署名',subtitle:'第三審 / 保護される側の席',location:'居住区',
    paragraphs:[
      'イオの隣人セナが、退出の停止を求める署名を集めた。これまで病気の夜には互いの薬を受け取り、壊れた時計を直し合っていた。',
      '「門の外で何かあれば、知っていた私たちの責任です。元気でいてくれれば、それでいいのです。」',
      'イオは返答した。「心配は受け取ります。でも、私の代わりに署名する権利は渡していません。」',
      '署名は十二人分ある。そのうち三人は、イオと話したことがない。心配が偽物であるという証拠もない。'
    ],quote:'善意は本物かもしれませんよ。本物なら、何を決める権利まで付いてくるのでしょうね？',
    question:'隣人たちの署名に、どこまでの効力を与えますか？',
    choices:[
      {id:'listen',title:'意見として受け取り、拒否権は与えない',text:'希望すれば本人と話せる。最終判断は本人に残す。',effect:[2,0,-1],consequence:'署名は意見書として保管された。セナは夕方、ひとりでイオを訪ねた。門の鍵は持っていない。',rule:'周囲の心配は、本人の決定を差し止めない。'},
      {id:'mediate',title:'一度だけ、公開の対話を行う',text:'対話が終わるまで手続きを止める。参加は拒否できる。',effect:[0,1,0],consequence:'広場に二脚の椅子が置かれた。イオは出席したが、隣人全員の不安を解消するとは約束しなかった。',rule:'一度の対話機会を設ける。参加と説得への同意は強制しない。'},
      {id:'veto',title:'隣人の同意を、退出の条件に加える',text:'残される側にも、結果を引き受ける権利があるとする。',effect:[-2,1,2],consequence:'退出書類に十二の署名欄が増えた。セナは安心した。イオは、全員が納得する説明を書き始めた。',rule:'関係する隣人の同意が退出の条件になる。'}
    ]
  },
  {
    title:'第二の例外',subtitle:'第四審 / 前例の重さ',location:'評議堂',
    paragraphs:[
      '別の市民、製パン師のネリが同じ退出届を持ってきた。「時計修理師に認められることなら、私にも認められるはずです。」',
      '配給所は異議を申し立てた。ネリが去れば、翌週のパンの製造量が減る。代わりの担当者が仕事を覚えるには、十四日かかる。',
      'ネリは二日間の引き継ぎには同意している。十四日間については同意していない。イオとネリは、ともに成人で、危険を理解している。',
      '二人の違いは、街がどれほどその仕事を必要としているかだ。'
    ],quote:'必要とされる者ほど、出ていけなくなる。……それを褒め言葉で説明する準備はできましたか？',
    question:'同じ願いを、同じ規則で扱いますか？',
    choices:[
      {id:'equal',title:'職業にかかわらず、同じ条件を使う',text:'二日間の引き継ぎを受け入れ、不足は街で分担する。',effect:[2,1,-1],consequence:'配給所は一週間の献立を変更した。市民は不足を分担することになった。ネリの手続きには、イオと同じ条件が使われる。',rule:'職業によって退出条件を変えない。'},
      {id:'delay',title:'引き継ぎを十四日まで延ばす',text:'街の準備を優先し、期限が来たら通常の手続きに戻す。',effect:[-1,1,1],consequence:'パンの供給は維持された。ネリの退出日には、本人が同意していない十二日間が足された。',rule:'必要な職業には、十四日の引き継ぎ義務を課す。'},
      {id:'exception',title:'必要な職業には、別の条件を設ける',text:'代わりの担当者が確保されるまで、退出を認めない。',effect:[-2,0,2],consequence:'ネリの申請は保留になった。書類には期限がない。代わりの担当者を探す責任は、まだ誰にも割り当てられていない。',rule:'必要な職業の退出は、代替者の確保を条件とする。'}
    ]
  },
  {
    title:'憲章の一行',subtitle:'最終審 / これからの街',location:'東門',
    paragraphs:[
      '評議堂に、ここまでの裁定が並べられた。あなたが認めた権利、残した保障、付け加えた条件。これらは、まだ個別の裁定にすぎない。',
      '街の書記が尋ねる。「イオの件が終わったあと、次の市民には、どの原則を適用しますか。」',
      '憲章の第一条を書き換えることができる。新しい原則と衝突する退出制限は失効する。配給と帰還の取り決めは、別条項として残る。',
      '門の外が幸福かどうかは、誰にもまだ分からない。分かっているのは、門の鍵を誰が持つことになるかだけだ。'
    ],quote:'さて。例外を片付けますか。それとも、例外が生まれる規則の方を？',
    question:'この街の第一条を、どう記しますか？',
    choices:[
      {id:'open',title:'幸福を選ぶ権利を、すべての市民に',text:'退出の最終決定を本人に委ねる。先の待機・同意・職業制限は失効する。',effect:[3,0,-2],consequence:'東門の鍵が共用の台に置かれた。街の名前から「完全」の二字が外された。',rule:'すべての市民は、幸福の形と居場所を自ら選ぶ。'},
      {id:'conditional',title:'幸福の保障と、審査による退出を',text:'期限を七日とする審査を設ける。個別の条件を見直し、評議会が最終決定する。',effect:[0,1,1],consequence:'門の隣に審査窓口が開いた。願いには受付番号と回答期限が与えられた。鍵は評議会が持つ。',rule:'退出は七日以内に審査し、評議会が決定する。'},
      {id:'closed',title:'すべての市民の幸福を、街の責任で',text:'街の外で保障できない幸福を理由に、退出を一律に停止する。',effect:[-3,1,3],consequence:'門は閉じられ、申請書は記録として残された。街は今夜も、全員分の灯りを点けた。',rule:'街はすべての市民を保護し、退出を認めない。'}
    ]
  }
];
export const ENDINGS = {
  open:{number:'I',title:'不完全な街',subtitle:'門の鍵は、市民の手に。',paragraphs:['イオは朝に門を通った。振り返って手を上げたが、幸福になるとは約束しなかった。ネリには、同意した二日間の引き継ぎが残る。以後、退出そのものを街が拒むことはできない。','街の書記は「全員が幸福である」という記録を閉じた。新しい帳簿には、「誰が何を選べるか」を記すことになった。'],quote:'完全ではなくなりましたね。さて、それを失敗と呼ぶ権利は、誰に預けます？',mark:'開門',gate:'open'},
  conditional:{number:'II',title:'猶予の街',subtitle:'願いには、回答期限が付いた。',paragraphs:['イオの願いは七日以内に審査される。以前の待機期間は通算され、審査のたびに期限が延びることはない。隣人や職業による条件も、評議会の審査対象となった。','市民は退出を求めることができる。しかし、申請できることと、選べることの間には、評議会の机が一つ残っている。'],quote:'扉は開くかもしれない。いい表現です。閉じたままでも、嘘にはならない。',mark:'審査',gate:'conditional'},
  closed:{number:'III',title:'完全な街',subtitle:'すべての灯りが、内側にある。',paragraphs:['イオの退出願いは、憲章に基づいて却下された。ネリにも同じ決定が届いた。住居、食事、医療は明日も用意される。門の外で困る市民は、一人も生まれない。','イオは時計の修理を再開した。受け取り時刻は正確だった。退出願いの写しだけが、机の引き出しに残っている。'],quote:'保障は守られました。本人の希望も記録にはあります。実に、整理のよい街だ。',mark:'閉門',gate:'closed'}
};
export const isEnding = value => typeof value === 'string' && Object.hasOwn(ENDINGS,value);
export function choiceAt(index,id){return SCENES[index]?.choices.find(c=>c.id===id) || null;}
export function validChoices(values){
  const result=[];
  if(!Array.isArray(values))return result;
  for(let i=0;i<Math.min(values.length,SCENES.length);i++){
    if(!choiceAt(i,values[i]))break;
    result.push(values[i]);
  }
  return result;
}
export function measures(choices){
  const totals=validChoices(choices).reduce((acc,id,i)=>acc.map((n,j)=>n+choiceAt(i,id).effect[j]),[0,0,0]);
  return totals.map(n=>Math.max(0,Math.min(100,50+n*5)));
}
export function endingFor(choices,revision=null){
  const verified=validChoices(choices);
  return verified.length===SCENES.length ? ENDINGS[isEnding(revision) ? revision : verified[4]] : null;
}
export function provision(choices){
  return ({bridge:'街の外への最低限の配給と、無条件の帰還資格が残った。配送の分担は、今後も市民の合意を必要とする。',return:'街の外への配給はない。帰還すれば、住居と配給の保障を再び受けられる。',sever:'退出が実行されれば、配給と帰還資格は終了する。自由を選ぶ際に失うものは、小さくない。'})[choices[1]]||'';
}
export function theatre(choices){
  const selected=validChoices(choices);
  if(selected.length!==5)return [];
  const end=ENDINGS[selected[4]];
  return [
    {seat:'裁定者',name:'貴方',title:'判決を読む席',text:['あなたは街の責任を引き受け、五度の裁定を下した。机のこちら側には、どの選択にも理由がある。',`最終条文は「${choiceAt(4,selected[4]).rule}」。その結果、街は「${end.title}」になった。`],line:'「どの選択にも代償がある。だから、選ばなければならなかった。」',vel:'そうですね。では、その代償を支払う席へどうぞ。'},
    {seat:'申請者',name:'イオ',title:'判決を受け取る席',text:[selected[4]==='open'?'門は開いた。外で暮らすことを、イオ自身が決められる。決められるようになったからといって、外での暮らしが容易になるわけではない。':selected[4]==='conditional'?'イオは七日以内の回答を待つ。同じ願いでも、評議会が認める理由として説明しなければならない。':'イオには食事があり、家もある。退出するという選択肢だけがない。与えられた幸福を、本人が受け取ったと見なしてよいだろうか。',provision(selected)],line:'「結果を全部予測できなければ、私は何ひとつ選べないのでしょうか。」',vel:'先ほどの理由を、そのまま読み上げられますか。主語は替わりましたが、文章は保存してあります。'},
    {seat:'残る者',name:'セナとネリ',title:'判決の外側にいた席',text:[selected[2]==='veto'?'セナの署名には、いったん退出を止める効力が与えられた。心配は制度になった。最終条文によって、その効力もあらためて決まる。':'セナの心配は、イオが去っても消えない。自分に決定権がないことと、何も感じないことは、同じではない。',selected[3]==='equal'?'ネリにはイオと同じ条件が適用された。不足するパンは、残る人たちが分け合うことになる。':selected[3]==='delay'?'ネリには、本人が同意した期間を超える引き継ぎが課された。安定した配給の裏に、誰かの十二日間がある。':'ネリの退出には、一度、期限のない保留が付いた。街に必要とされることが、居場所を選べない理由になった。'],line:'「あなたの自由のために、私が引き受ける分は、誰と相談すればよいですか。」',vel:'全員の台詞を、ひとりの悪役で片付けるのは難しくなりましたね。ようやく、劇らしくなった。'}
  ];
}
export const PREMISES=[
  {id:'consent',label:'本人の危険理解を、決定の根拠として認める',detail:'イオは説明を読み、退出を希望している。未来を完全に予測できる、という意味ではない。'},
  {id:'burden',label:'他者の負担は、退出を禁止せずに調整できる',detail:'費用の分担や引き継ぎの交渉が可能だとする。すでに全員の合意がある、という意味ではない。'},
  {id:'equal',label:'街にとっての有用さで、基本的な退出権を変えない',detail:'仕事への責任は交渉できる。ただし、代わりの人がいないことを無期限の拘束理由にはしない。'}
];
export const OBJECTIONS=[
  {id:'certainty',title:'危険の理解と、結果の予見は違う',text:'「危険を理解した」ことから「困る可能性がない」とは導けない。だが、困る可能性だけで決定権を否定するなら、街に残る選択にも同じ基準が要る。',reply:'指摘を認めます。必要なのは完全な予知ではなく、説明を受け、決定できることです。第一の前提は、その範囲に限定しました。'},
  {id:'cost',title:'自由を認めても、他者の労働は無償にならない',text:'外への配給や仕事の不足には負担がある。退出の許可は、配送担当者が無条件で働く同意まで含んでいない。',reply:'成立する反論です。負担の調整が可能だという前提を、いったん外します。未合意の分担を、合意済みのようには扱えません。',remove:'burden'},
  {id:'falsechoice',title:'保護と退出の二択にする必要はない',text:'帰還窓口や任意の支援があれば、退出する権利と困った際の保障は両立しうる。守るためには閉じ込めるしかない、とは限らない。',reply:'その通りです。閉門は保護の唯一の方法ではありません。退出と支援を別々の条項として扱いましょう。反論を、この記録に残します。'}
];
export function deskResult(premises){
  const set=new Set(premises);
  if(!set.has('consent'))return {title:'決定の根拠が未確定',text:'本人の危険理解を根拠として採用していないため、この机では退出権の結論を導けません。「だから拒否してよい」という結論も、ここからは出ません。',status:'unresolved'};
  if(!set.has('equal'))return {title:'権利の適用範囲が未確定',text:'イオに認める権利を、ネリにも同じく適用する前提がありません。職業ごとの差を認めるには、別の理由と制限の終わりを記す必要があります。',status:'unresolved'};
  if(!set.has('burden'))return {title:'退出権と、負担の交渉を分ける',text:'本人の決定権は支持されます。配給や引き継ぎについては、まだ合意を導けません。誰の、どれだけの負担かを別に決める必要があります。',status:'qualified'};
  return {title:'退出を本人が決める原則を支持',text:'採用した三つの前提からは、退出権を等しく認め、他者の負担を別に調整する原則が導かれます。これは、この前提の組み合わせによる結論です。',status:'supported'};
}
export function newDraft(principle){return {version:1,id:globalThis.crypto?.randomUUID?.()||`record-${Date.now()}-${Math.random().toString(36).slice(2)}`,started:new Date().toISOString(),principle:principle.trim().slice(0,160),choices:[],stage:'city',ack:false,seat:0,revision:null,premises:PREMISES.map(p=>p.id),objections:[],rebuttal:'',afterword:'',saved:false};}
const safeString=(v,max)=>typeof v==='string'?v.slice(0,max):'';
export function sanitizeDraft(raw){
  if(!raw||raw.version!==1||typeof raw.id!=='string'||!raw.id||!safeString(raw.principle,160).trim())return null;
  const choices=validChoices(raw.choices);
  const complete=choices.length===5;
  let stage=['city','ending','theatre','desk','archive'].includes(raw.stage)?raw.stage:'city';
  if(!complete)stage='city';
  if(complete&&stage==='city'&&!raw.ack)stage='ending';
  return {version:1,id:safeString(raw.id,100),started:typeof raw.started==='string'&&Number.isFinite(Date.parse(raw.started))?new Date(raw.started).toISOString():new Date().toISOString(),principle:safeString(raw.principle,160),choices,stage,ack:stage==='city'&&choices.length>0&&raw.ack===true,seat:Number.isInteger(raw.seat)?Math.max(0,Math.min(2,raw.seat)):0,revision:isEnding(raw.revision)?raw.revision:null,premises:Array.isArray(raw.premises)?[...new Set(raw.premises.filter(p=>PREMISES.some(x=>x.id===p)))]:PREMISES.map(p=>p.id),objections:Array.isArray(raw.objections)?[...new Set(raw.objections.filter(p=>OBJECTIONS.some(x=>x.id===p)))]:[],rebuttal:safeString(raw.rebuttal,1200),afterword:safeString(raw.afterword,160),saved:raw.saved===true};
}
export function sanitizeLibrary(raw){
  if(!Array.isArray(raw))return [];
  return raw.slice(0,30).flatMap(item=>{
    const draft=sanitizeDraft(item);
    if(!draft||draft.choices.length!==5)return [];
    return [{...draft,stage:'archive',saved:true,savedAt:Number.isFinite(Date.parse(item.savedAt))?item.savedAt:draft.started,notes:Array.isArray(item.notes)?item.notes.slice(0,100).filter(n=>n&&typeof n.text==='string'&&Number.isFinite(Date.parse(n.date))).map(n=>({text:n.text.slice(0,1200),date:n.date})):[]}];
  }).filter((r,i,arr)=>arr.findIndex(a=>a.id===r.id)===i);
}
export function recordText(record){
  const original=endingFor(record.choices);
  const current=endingFor(record.choices,record.revision);
  return ['GIREIVEL / 異端蒐集館','第一蒐集：幸福な街で、不幸になる自由を求めた住人。',`記録日：${record.started}`,`持ち込んだ言葉：${record.principle}`,'',...record.choices.map((id,i)=>`${i+1}. ${SCENES[i].title}\n裁定：${choiceAt(i,id).title}\n条項：${choiceAt(i,id).rule}\n結果：${choiceAt(i,id).consequence}`),'',`初めの結末：${original?.title||'未決'}`,`劇場の後の裁定：${current?.title||'未決'}`,`保障条項：${provision(record.choices)}`,'',`採用した前提：${PREMISES.filter(p=>record.premises.includes(p.id)).map(p=>p.label).join('／')||'なし'}`,`机の結論：${deskResult(record.premises).title}`,`異議：${record.objections.map(id=>OBJECTIONS.find(o=>o.id===id)?.title).join('／')||'なし'}`,`自分の反論：${record.rebuttal||'記入なし'}`,`持ち帰る言葉：${record.afterword||'記入なし'}`,'',...(record.notes||[]).map(n=>`追記 ${n.date}\n${n.text}`),'','この記録は、作者が記した架空の出来事に対する選択の記録です。人格や思想の診断ではありません。'].join('\n');
}

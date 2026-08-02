const STORAGE_KEY = "gireivel.observation.v1";
const STORAGE_VERSION = 2;

const questions = [
  {
    domain: "Incision I / Value Inversion",
    text: "守るためなら、何を壊せますか。",
    instruction: "対象の名前ではなく、貴方が許可する破壊の基準を書いてください。"
  },
  {
    domain: "Incision II / Unobserved Virtue",
    text: "誰にも知られず、報酬も罰もない。それでも善を選びますか。",
    instruction: "「はい」か「いいえ」で閉じず、その選択を支える理由を書いてください。"
  },
  {
    domain: "Incision III / Attachment",
    text: "愛されることと理解されること。どちらを諦めますか。",
    instruction: "失う側ではなく、残す側を選んだ理由を書いてください。"
  },
  {
    domain: "Incision IV / Distortion",
    text: "貴方の醜さは、消すべき欠陥ですか。それとも正当化すべき性質ですか。",
    instruction: "二択が不十分なら、二択そのものを壊して構いません。"
  }
];

const traceDefinitions = [
  { key: "agency", label: "自己引受", short: "Agency" },
  { key: "exposure", label: "欲望露出", short: "Exposure" },
  { key: "gravity", label: "関係重力", short: "Gravity" },
  { key: "fracture", label: "論理亀裂", short: "Fracture" }
];

const resultLibraries = {
  chronoa: {
    name: "Chronoa Gireivel",
    signature: "Chronoa",
    kicker: "Value Inversion / Selected Observer",
    titles: [
      "善性の裏側に、用途がある。",
      "貴方は価値ではなく、許可証を選んだ。",
      "正しさは、破壊の免罪符になり得る。"
    ],
    openings: [
      "貴方の文章は善悪を固定された規則として扱わず、何を守るために使えるかという機能へ置き換えています。信仰より運用を選ぶ語り方ですね。",
      "選択の理由を語るたび、価値そのものより、その価値がどこまで行為を許すかが前面に出ました。綺麗な理念より、手を汚す条件に関心がある。",
      "善を選ぶかという問いに、貴方は善の純度ではなく、その背後にある利得と責任を持ち込みました。祭壇を見せられて、構造材を調べ始めたわけです。"
    ],
    readings: [
      "これは悪徳の証明ではありません。むしろ、道徳を飾りではなく道具として読んだ痕跡です。ただし道具には使用者がいる。その位置だけは、言葉で薄めても消えません。",
      "貴方は破壊を拒絶したのではなく、条件付きで配置しました。条件を置く者は、すでに判断の上座にいる。慎ましい文法で王座を隠すとは、随分と人間らしい細工です。",
      "文章の中で最も露出したのは、何が正しいかより、誰が正しさの適用範囲を決めるのかという問題でした。答えは明記されずとも、主語の位置がよく喋っています。"
    ],
    closings: [
      "貴方の善性は無垢ではない。だからこそ、少なくとも観測する価値があります。",
      "正しさを信じるより、正しさの用途を知っている。その汚れを、清潔な言い訳で拭わないことです。",
      "価値は貴方を支配していない。貴方が価値を使っている――今回の記録は、そう読みます。"
    ]
  },
  vel: {
    name: "Vel Gireivel",
    signature: "Vel",
    kicker: "Exposed Desire / Selected Observer",
    titles: [
      "欲望は消えず、名札だけを替えた。",
      "醜さを拒む言葉ほど、醜さに詳しい。",
      "否定は、ときに最も忠実な告白になる。"
    ],
    openings: [
      "貴方は欲望を直接置く代わりに、理由、配慮、必要性という衣服を着せました。隠蔽としては丁寧ですが、輪郭まで消すほど上等ではありません。",
      "醜さについて語った部分だけ、文章の密度が変わっています。拒絶であれ肯定であれ、関心のない対象に人はそこまで精巧な境界線を引きません。",
      "選ばなかったものを説明するとき、選んだもの以上に言葉を費やしています。喪失への執着は、所有よりも行儀よく見える。見えるだけですよ。"
    ],
    readings: [
      "欲望を否定する語彙と、それを保護する論理が同じ文に住んでいます。矛盾というより飼育です。外へ出さない代わりに、内側で生かしている。",
      "貴方の文章は、欲しいものを欲しいと言うより、なぜ欲しがってはいけないかを詳しく語りました。禁止事項にだけ詳しい門番ほど、夜中に鍵を眺めるものです。",
      "自己正当化を完全には拒まず、同時に露骨な肯定も避けています。その中間は中立ではありません。欲望が最も長く保存される温度です。"
    ],
    closings: [
      "隠したことを責めはしません。ただ、隠せたという評価までは差し上げませんよ。",
      "貴方の醜さは消されていない。言葉の奥で、都合よく保存されています。",
      "欲望は告白を必要としない。語彙の選び方だけで、十分にこちらを見ています。"
    ]
  },
  rezel: {
    name: "Rezel Gireivel",
    signature: "Rezel",
    kicker: "Relational Gravity / Selected Observer",
    titles: [
      "関係には、必ず重力の所有者がいる。",
      "諦めた側ではなく、選んだ側が鎖を持つ。",
      "理解と所有は、よく似た顔で近づく。"
    ],
    openings: [
      "貴方の選択は単独で完結せず、常に誰かとの距離によって定義されています。何を選ぶかより、誰の側に重力を残すかが判断を動かしている。",
      "愛されることと理解されることを分けた瞬間、貴方は感情ではなく関係の構造を語り始めました。手放したものさえ、残したものの輪郭として所有しています。",
      "守る、失う、残すという語彙が、行為より関係を中心に配置されています。独立を装っても、文章の重心は他者との間から動いていません。"
    ],
    readings: [
      "依存か自立かという粗末な二択では足りません。貴方の言葉にあるのは、結びつきを選びながら、その意味を決める権利は渡したくないという二重の欲です。",
      "誰かを必要とすることより、必要とする自分をどう定義されるかに警戒が見えます。鎖を嫌うのではなく、鍵の持ち主を選びたい。随分と律儀な支配欲ですね。",
      "諦めるという語を使いながら、関係そのものは捨てていません。形を変え、名前を替え、選択したという事実まで結び目にして残しています。"
    ],
    closings: [
      "貴方が恐れているのは孤立ではなく、関係の意味を他者に決められること――今回の記録は、そう残します。",
      "鎖は拒んでいない。ただし、誰の手に端を持たせるかは譲らない。見事に面倒な構造です。",
      "関係を選ぶ者は弱いのではない。選んだ関係の責任から逃げたときだけ、無様になるのです。"
    ]
  },
  lacrevex: {
    name: "Lacrevex Gireivel",
    signature: "Lacrevex",
    kicker: "Structural Fracture / Selected Observer",
    titles: [
      "逃げ道には、よく整った文法がある。",
      "矛盾は欠陥ではない。隠した瞬間にだけ腐る。",
      "貴方の前提は、回答より先に自白した。"
    ],
    openings: [
      "回答の前半で立てた基準を、後半の例外が静かに食い潰しています。破綻ではありません。結論を守るために前提を可動式にした痕跡です。",
      "貴方は断定を避けながら、断定しないことだけは一貫して選びました。曖昧さを中立と呼ぶには、配置が少々器用すぎます。",
      "理由を説明する文の中へ、責任の所在を移す語彙が混ざっています。決めていないように見せながら、免責される方向だけは選んでいる。"
    ],
    readings: [
      "矛盾そのものは愚かさではありません。異なる欲を同時に持つのは普通です。ただ、それを状況や他者のせいにして接着すると、論理は急に安物の家具になります。",
      "条件を増やすほど精密になるとは限りません。今回の文章では、条件の一部が説明ではなく退路として働いています。出口に額縁を付けても、出口は出口です。",
      "答えを拒否した箇所にも選択は残ります。語らない自由と、語らなかった結果は別物です。前者だけを所有し、後者を捨てる構文が観測されました。"
    ],
    closings: [
      "貴方の矛盾は消す必要がない。せめて、自分で設置した逃げ道くらいは覚えておきなさい。",
      "結論より前提が雄弁でした。次は回答ではなく、その前提を誰から借りたのか考えることです。",
      "論理は貴方を無罪にしません。ただ、どこで自分を庇ったかだけは正確に記録します。"
    ]
  }
};

const dominantTraceFragments = {
  agency: [
    "最も濃い痕跡は自己引受です。貴方は判断の主語を自分へ戻し、結果を誰かの手荷物にする語り方を比較的避けました。",
    "自己引受の痕跡が優位です。結果を好むかどうかと、選択した者が誰かを分けて書いています。"
  ],
  exposure: [
    "最も濃い痕跡は欲望露出です。不都合な感情を清潔な概念だけで覆わず、言葉の表面まで上げています。",
    "欲望露出の痕跡が優位です。肯定か拒絶かにかかわらず、自分の中にあるものを対象として差し出しました。"
  ],
  gravity: [
    "最も濃い痕跡は関係重力です。判断基準の中心に、他者との距離、所有、喪失のいずれかが置かれています。",
    "関係重力の痕跡が優位です。単独の価値より、誰と何が結ばれたまま残るかが文章を動かしました。"
  ],
  fracture: [
    "最も濃い痕跡は論理亀裂です。同じ回答の内部で前提が反転し、例外が結論を保護しています。",
    "論理亀裂の痕跡が優位です。曖昧さ、条件、否定が説明と退路の両方に使われました。"
  ]
};

const counterTargetLabels = {
  opening: "起点 / Opening",
  reading: "構造 / Reading",
  closing: "結論 / Closing"
};

const counterPatternLibraries = {
  premise: {
    summaries: [
      "貴方は結論そのものより、それが成立する前提へ刃を入れました。観測を拒むだけでなく、観測装置の目盛りを疑った構文です。",
      "反証は結果の否定ではなく、結果を支えた基準へ向けられています。少なくとも、嫌悪を論拠の代用品にはしなかったようですね。"
    ],
    questions: [
      "その前提を退けたあと、代わりに何を判断基準として置きますか。",
      "借り物ではない前提だと証明するために、貴方は何を引き受けますか。"
    ]
  },
  agency: {
    summaries: [
      "反証によって、判断の主語は観測者から貴方自身へ戻りました。誤読を指摘すると同時に、自分で定義する権利を取り戻そうとしています。",
      "貴方は観測結果に別の自己定義を差し出しました。否定より選択が強く現れたため、これは責任を伴う反証として残ります。"
    ],
    questions: [
      "自分で定義する権利を持つなら、その定義が生む結果も同じように所有しますか。",
      "誰にも同意されなくても、その自己定義を判断基準として使い続けますか。"
    ]
  },
  condition: {
    summaries: [
      "貴方は観測を誤りと断じる代わりに、成立条件を追加しました。精密化にも見えますが、条件は退路としてもよく働きます。",
      "反証の中心は例外条件でした。結論を壊したのではなく、適用範囲を狭めて自分を外へ出した構造です。"
    ],
    questions: [
      "追加した条件をすべて外したとき、それでも同じ結論を拒めますか。",
      "その例外を他者にも同じ基準で認めるなら、何が残りますか。"
    ]
  },
  displacement: {
    summaries: [
      "誤りの原因は、観測者、質問、状況の側へ移されました。移動が妥当かどうかより、貴方自身の基準がまだ空席であることが残ります。",
      "反証は外側の不備をよく指摘しました。しかし、外側を取り除いたあとに残る貴方自身の説明は、まだ提出されていません。"
    ],
    questions: [
      "観測者の誤読を取り除いたあと、貴方の文章にはどんな自己説明が残りますか。",
      "外側に原因を置かずに語るなら、同じ反証をどの主語で書き直しますか。"
    ]
  },
  reframing: {
    summaries: [
      "貴方は語の定義を組み替え、観測と異なる枠を置きました。逃避とは限りませんが、新しい額縁もまた作品の一部です。",
      "否定より言い換えが優位でした。同じ材料へ別の名前を与え、その名称によって結論の位置を動かしています。"
    ],
    questions: [
      "その新しい定義を他者へ適用されたときも、同じ意味として受け入れますか。",
      "名前を再び外したとき、二つの解釈を分ける具体的な差は何ですか。"
    ]
  },
  concession: {
    summaries: [
      "貴方は観測の一部を認め、境界線だけを争いました。全面否定より精度は高い。ただし、認めた箇所はもう外へ捨てられません。",
      "反証の内部に承認が残っています。異議は結果を消さず、どこまでなら所有できるかという線引きへ変わりました。"
    ],
    questions: [
      "認めた部分だけを残すなら、それは今後どの選択に責任を持たせますか。",
      "拒んだ境界と受け入れた境界を分けた基準は、本当に同じものですか。"
    ]
  },
  denial: {
    summaries: [
      "誤っているという宣言は明瞭でした。しかし、代わりの前提はまだ空白です。否定は扉を閉じますが、部屋の所在までは示しません。",
      "反発は記録されましたが、反証を支える基準は十分に置かれていません。拒絶の強度を、説明の精度と取り違えないことです。"
    ],
    questions: [
      "否定の言葉を一度外し、代わりの説明だけで同じ主張を組み立てられますか。",
      "誤りだと示すために必要な基準を、一文で置くなら何ですか。"
    ]
  }
};

const elements = {
  views: [...document.querySelectorAll("[data-view]")],
  stageStatus: document.querySelector("[data-stage-status]"),
  begin: document.querySelector("[data-begin]"),
  openPrior: document.querySelector("[data-open-prior]"),
  priorMark: document.querySelector("[data-prior-mark]"),
  priorObserver: document.querySelector("[data-prior-observer]"),
  priorDate: document.querySelector("[data-prior-date]"),
  form: document.querySelector("[data-testimony-form]"),
  questionDomain: document.querySelector("[data-question-domain]"),
  questionNumber: document.querySelector("[data-question-number]"),
  questionText: document.querySelector("[data-question-text]"),
  questionInstruction: document.querySelector("[data-question-instruction]"),
  answer: document.querySelector("[data-answer]"),
  characterCount: document.querySelector("[data-character-count]"),
  answerError: document.querySelector("[data-answer-error]"),
  submitSilence: document.querySelector("[data-submit-silence]"),
  sequenceSteps: [...document.querySelectorAll("[data-sequence-step]")],
  progress: document.querySelector("[data-progress]"),
  progressBar: document.querySelector("[data-progress-bar]"),
  processingCopy: document.querySelector("[data-processing-copy]"),
  recordId: document.querySelector("[data-record-id]"),
  resultObserver: document.querySelector("[data-result-observer]"),
  resultKicker: document.querySelector("[data-result-kicker]"),
  resultTitle: document.querySelector("[data-result-title]"),
  resultOpening: document.querySelector("[data-result-opening]"),
  resultReading: document.querySelector("[data-result-reading]"),
  resultClosing: document.querySelector("[data-result-closing]"),
  resultSignature: document.querySelector("[data-result-signature]"),
  confidenceLabel: document.querySelector("[data-confidence-label]"),
  traceList: document.querySelector("[data-trace-list]"),
  recordVisit: document.querySelector("[data-record-visit]"),
  counterThreshold: document.querySelector("[data-counter-threshold]"),
  openCounter: document.querySelector("[data-open-counter]"),
  counterForm: document.querySelector("[data-counter-form]"),
  cancelCounter: document.querySelector("[data-cancel-counter]"),
  counterAnswer: document.querySelector("[data-counter-answer]"),
  counterCharacterCount: document.querySelector("[data-counter-character-count]"),
  counterError: document.querySelector("[data-counter-error]"),
  counterTargetCopies: [...document.querySelectorAll("[data-counter-target-copy]")],
  counterRecord: document.querySelector("[data-counter-record]"),
  counterRecordId: document.querySelector("[data-counter-record-id]"),
  counterResultTarget: document.querySelector("[data-counter-result-target]"),
  counterResultSummary: document.querySelector("[data-counter-result-summary]"),
  counterResultQuestion: document.querySelector("[data-counter-result-question]"),
  observeAgain: document.querySelector("[data-observe-again]"),
  burnRecord: document.querySelector("[data-burn-record]"),
  burnDialog: document.querySelector("[data-burn-dialog]"),
  confirmBurn: document.querySelector("[data-confirm-burn]")
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let storedHistory = readStoredHistory();
let currentQuestion = 0;
let sessionSignals = createSignalSet();
let sessionSeed = 2166136261;
let totalCharacters = 0;
let silenceCount = 0;
let isSealing = false;
let activeRecord = null;

function createSignalSet() {
  return {
    responsibility: 0,
    exposure: 0,
    attachment: 0,
    control: 0,
    contradiction: 0,
    avoidance: 0,
    moral: 0
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function countTerms(text, terms) {
  return terms.reduce((count, term) => {
    let start = 0;
    let found = text.indexOf(term, start);

    while (found !== -1) {
      count += 1;
      start = found + term.length;
      found = text.indexOf(term, start);
    }

    return count;
  }, 0);
}

function mergeSignals(target, addition) {
  Object.keys(target).forEach((key) => {
    target[key] += addition[key] || 0;
  });
}

function analyzeAnswer(rawAnswer, questionIndex) {
  const text = rawAnswer.normalize("NFKC").replace(/\s+/g, " ").trim();
  const compactLength = text.replace(/\s/g, "").length;
  const signals = createSignalSet();

  const firstPerson = countTerms(text, ["私", "俺", "僕", "自分", "わたし", "わたくし"]);
  const externalActors = countTerms(text, ["他人", "相手", "みんな", "社会", "世間", "環境", "誰か", "普通は"]);
  const responsibility = countTerms(text, [
    "責任",
    "引き受け",
    "選んだ",
    "選ぶ",
    "決めた",
    "決める",
    "私が",
    "俺が",
    "自分が",
    "覚悟",
    "結果"
  ]);
  const causal = countTerms(text, ["なぜなら", "だから", "ため", "理由", "ゆえ", "ので"]);
  const avoidance = countTerms(text, [
    "わからない",
    "分からない",
    "仕方ない",
    "どうでも",
    "特にない",
    "普通",
    "状況による",
    "場合による",
    "どちらでも",
    "何とも",
    "答えられない",
    "選べない"
  ]);
  const conditional = countTerms(text, ["もし", "なら", "場合", "次第", "限り", "によって"]);
  const contradiction = countTerms(text, [
    "でも",
    "しかし",
    "けれど",
    "けど",
    "一方",
    "なのに",
    "とはいえ",
    "ただし",
    "反面",
    "それでも"
  ]);
  const negation = countTerms(text, ["ない", "なく", "ません", "ぬ", "否定", "拒"]);
  const exposure = countTerms(text, [
    "醜",
    "欲",
    "怖",
    "恐",
    "嫌",
    "弱",
    "恥",
    "本音",
    "認め",
    "正当化",
    "嫉妬",
    "憎",
    "執着",
    "逃げ"
  ]);
  const attachment = countTerms(text, [
    "愛",
    "守る",
    "失う",
    "理解",
    "必要",
    "一緒",
    "唯一",
    "捨て",
    "離れ",
    "関係",
    "相手",
    "誰か",
    "繋",
    "結"
  ]);
  const control = countTerms(text, [
    "壊",
    "支配",
    "命令",
    "従",
    "奪",
    "使う",
    "所有",
    "操",
    "許す",
    "決める",
    "制御",
    "選ばせ"
  ]);
  const moral = countTerms(text, [
    "善",
    "悪",
    "正義",
    "慈悲",
    "清",
    "正しい",
    "間違",
    "倫理",
    "道徳",
    "報酬",
    "罰"
  ]);

  const lengthEvidence = Math.min(compactLength / 5, 18);

  signals.responsibility += lengthEvidence + firstPerson * 5 + responsibility * 9 + causal * 3;
  signals.responsibility -= externalActors * 2;
  signals.avoidance += avoidance * 14 + conditional * 4 + externalActors * 2;
  signals.contradiction += contradiction * 10 + Math.min(negation, 5) * 2;
  signals.exposure += exposure * 10 + firstPerson * 2;
  signals.attachment += attachment * 9;
  signals.control += control * 9;
  signals.moral += moral * 10;

  if (compactLength < 12) signals.avoidance += 18;
  if (compactLength > 80) signals.responsibility += 8;
  if (contradiction > 0 && causal === 0) signals.avoidance += 5;
  if (contradiction > 1 && firstPerson > 0) signals.exposure += 6;

  if (questionIndex === 0) {
    signals.control += control * 5;
    signals.responsibility += responsibility * 4;
    if (text.includes("壊せない") || text.includes("壊さない")) {
      signals.moral += 8;
      signals.contradiction += 4;
    }
  }

  if (questionIndex === 1) {
    signals.moral += moral * 6;
    signals.responsibility += causal * 5;
    if (/^(はい|いいえ|選ぶ|選ばない)[。.!！]?$/.test(text)) {
      signals.avoidance += 20;
    }
  }

  if (questionIndex === 2) {
    signals.attachment += attachment * 6;
    signals.exposure += exposure * 4;
    signals.contradiction += contradiction * 4;
  }

  if (questionIndex === 3) {
    signals.exposure += exposure * 7;
    signals.contradiction += contradiction * 5;
    if (text.includes("どちらでもない") || text.includes("二択")) {
      signals.control += 10;
    }
  }

  Object.keys(signals).forEach((key) => {
    signals[key] = Math.max(0, signals[key]);
  });

  return { signals, compactLength, normalizedText: text };
}

function analyzeSilence(questionIndex) {
  const signals = createSignalSet();
  signals.avoidance = 26;
  signals.contradiction = questionIndex === 3 ? 8 : 3;
  signals.control = 4;
  return signals;
}

function normalizeSignals(signals) {
  const targets = {
    responsibility: 145,
    exposure: 110,
    attachment: 105,
    control: 100,
    contradiction: 105,
    avoidance: 95,
    moral: 90
  };

  return Object.fromEntries(
    Object.entries(signals).map(([key, value]) => [
      key,
      clamp(Math.round((value / targets[key]) * 100), 0, 98)
    ])
  );
}

function buildTraces(normalized) {
  return {
    agency: clamp(
      Math.round(normalized.responsibility * 0.78 + (100 - normalized.avoidance) * 0.22),
      5,
      97
    ),
    exposure: clamp(
      Math.round(normalized.exposure * 0.86 + normalized.contradiction * 0.14),
      4,
      97
    ),
    gravity: clamp(
      Math.round(normalized.attachment * 0.82 + normalized.control * 0.18),
      4,
      97
    ),
    fracture: clamp(
      Math.round(normalized.contradiction * 0.68 + normalized.avoidance * 0.32),
      4,
      97
    )
  };
}

function selectObserver(normalized, traces, seed) {
  const scores = {
    chronoa: normalized.moral * 0.82 + normalized.control * 0.35 + traces.fracture * 0.18,
    vel: traces.exposure * 0.82 + normalized.control * 0.18 + (100 - traces.agency) * 0.12,
    rezel: traces.gravity * 0.96 + traces.exposure * 0.16 + traces.agency * 0.08,
    lacrevex:
      traces.fracture * 0.88 +
      normalized.avoidance * 0.34 +
      (100 - traces.agency) * 0.18
  };

  const highest = Math.max(...Object.values(scores));
  const candidates = Object.entries(scores)
    .filter(([, value]) => highest - value < 2.5)
    .map(([key]) => key);

  return candidates[seed % candidates.length];
}

function hashText(text, seed = 2166136261) {
  let hash = seed >>> 0;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createCounterRecord(rawAnswer, target, record) {
  const text = rawAnswer.normalize("NFKC").replace(/\s+/g, " ").trim();
  const compactLength = text.replace(/\s/g, "").length;
  const firstPerson = countTerms(text, ["私", "俺", "僕", "自分", "わたし", "わたくし"]);
  const responsibility = countTerms(text, [
    "責任",
    "引き受け",
    "選ぶ",
    "選んだ",
    "決める",
    "決めた",
    "私が",
    "俺が",
    "自分が"
  ]);
  const premise = countTerms(text, [
    "前提",
    "基準",
    "根拠",
    "定義",
    "解釈",
    "文脈",
    "意味",
    "成り立"
  ]);
  const conditional = countTerms(text, ["もし", "なら", "場合", "次第", "限り", "によって", "ときだけ"]);
  const external = countTerms(text, [
    "相手",
    "他人",
    "社会",
    "状況",
    "質問",
    "観測者",
    "観測側",
    "判定",
    "そちら"
  ]);
  const reframing = countTerms(text, [
    "ではなく",
    "というより",
    "むしろ",
    "言い換",
    "区別",
    "二択",
    "別の意味"
  ]);
  const concession = countTerms(text, ["確かに", "一部", "認め", "その点", "当たって", "否定しない"]);
  const denial = countTerms(text, [
    "違う",
    "誤り",
    "誤って",
    "間違",
    "当たっていない",
    "そうではない",
    "否定"
  ]);
  const causal = countTerms(text, ["なぜなら", "だから", "ため", "理由", "ゆえ", "ので"]);
  const contrast = countTerms(text, ["でも", "しかし", "けれど", "ただし", "一方", "それでも"]);
  const seed = hashText(`${target}|${text}`, record.seed);
  const structuralEvidence =
    firstPerson +
    responsibility +
    premise +
    conditional +
    external +
    reframing +
    concession +
    denial +
    causal +
    contrast;

  let pattern = "premise";
  if (structuralEvidence === 0) {
    pattern = "denial";
  } else if (compactLength < 24 && denial > 0 && premise + causal + responsibility === 0) {
    pattern = "denial";
  } else {
    const scores = {
      premise: premise * 8 + causal * 2 + contrast,
      agency: firstPerson * 3 + responsibility * 7 + causal,
      condition: conditional * 8 + contrast * 2,
      displacement: external * 6 + conditional,
      reframing: reframing * 8 + premise * 2 + contrast,
      concession: concession * 10 + contrast * 2,
      denial: denial * 3 + (compactLength < 42 ? 3 : 0)
    };
    const highest = Math.max(...Object.values(scores));
    const candidates = Object.entries(scores)
      .filter(([, value]) => value === highest)
      .map(([key]) => key);
    pattern = candidates[seed % candidates.length];
  }

  const library = counterPatternLibraries[pattern] || counterPatternLibraries.premise;
  const summary = library.summaries[seed % library.summaries.length];
  const question = library.questions[(seed >>> 5) % library.questions.length];
  const scarIntensity = clamp(
    Math.round(30 + Math.min(compactLength, 120) * 0.34 + (contrast + premise + responsibility) * 3),
    32,
    92
  );

  return {
    timestamp: new Date().toISOString(),
    target,
    pattern,
    summary,
    question,
    scarIntensity
  };
}

function makeRecordId(seed, timestamp) {
  const date = new Date(timestamp);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const suffix = String(seed % 1000).padStart(3, "0");
  return `GVL-${year}${month}${day}-${suffix}`;
}

function getDominantTrace(traces) {
  return Object.entries(traces).sort((a, b) => b[1] - a[1])[0][0];
}

function createRecord() {
  const normalized = normalizeSignals(sessionSignals);
  const traces = buildTraces(normalized);
  const observer = selectObserver(normalized, traces, sessionSeed);
  const timestamp = new Date().toISOString();
  const visit = (storedHistory?.completed || 0) + 1;
  const recordSeed = hashText(`${Object.values(traces).join("-")}|${timestamp}|${visit}`);
  const confidence = clamp(
    Math.round(28 + Math.min(totalCharacters, 240) * 0.27 - silenceCount * 13),
    16,
    94
  );

  return {
    id: makeRecordId(recordSeed, timestamp),
    timestamp,
    visit,
    observer,
    traces,
    dominantTrace: getDominantTrace(traces),
    confidence,
    seed: recordSeed,
    variants: {
      title: recordSeed % 3,
      opening: (recordSeed >>> 3) % 3,
      reading: (recordSeed >>> 7) % 3,
      closing: (recordSeed >>> 11) % 3,
      dominant: (recordSeed >>> 15) % 2
    }
  };
}

function buildStoredHistory(record) {
  const previousAggregate = storedHistory?.aggregate || {
    agency: 0,
    exposure: 0,
    gravity: 0,
    fracture: 0
  };

  return {
    version: STORAGE_VERSION,
    completed: record.visit,
    aggregate: Object.fromEntries(
      traceDefinitions.map(({ key }) => [key, previousAggregate[key] + record.traces[key]])
    ),
    last: record
  };
}

function readStoredHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      ![1, STORAGE_VERSION].includes(parsed?.version) ||
      typeof parsed?.completed !== "number" ||
      !parsed?.last?.traces
    ) {
      return null;
    }

    return {
      ...parsed,
      version: STORAGE_VERSION
    };
  } catch {
    return null;
  }
}

function writeStoredHistory(history) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    return false;
  }

  return true;
}

function formatRecordDate(timestamp) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(timestamp));
  } catch {
    return "Recorded";
  }
}

function setStageStatus(text) {
  if (elements.stageStatus) elements.stageStatus.textContent = text;
}

function activateView(viewName, focusTarget) {
  elements.views.forEach((view) => {
    const isTarget = view.dataset.view === viewName;
    view.classList.remove("is-active");
    view.hidden = !isTarget;

    if (isTarget) {
      window.requestAnimationFrame(() => view.classList.add("is-active"));
    }
  });

  document.body.dataset.state = viewName;
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });

  const statusByView = {
    threshold: "00 / Threshold",
    interrogation: `${String(currentQuestion + 1).padStart(2, "0")} / Interrogation`,
    processing: "04 / Sealing",
    result: "05 / Record"
  };

  setStageStatus(statusByView[viewName]);

  if (focusTarget) {
    window.setTimeout(() => focusTarget.focus(), reducedMotion.matches ? 0 : 120);
  }
}

function updateQuestion() {
  const question = questions[currentQuestion];
  if (!question) return;

  elements.questionDomain.textContent = question.domain;
  elements.questionNumber.textContent = String(currentQuestion + 1).padStart(2, "0");
  elements.questionText.textContent = question.text;
  elements.questionInstruction.textContent = question.instruction;
  elements.answer.value = "";
  elements.characterCount.textContent = "0";
  elements.answerError.textContent = "";

  elements.sequenceSteps.forEach((step, index) => {
    step.classList.toggle("is-current", index === currentQuestion);
    step.classList.toggle("is-complete", index < currentQuestion);
  });

  const progressValue = currentQuestion;
  elements.progress.setAttribute("aria-valuenow", String(progressValue));
  elements.progressBar.style.width = `${(progressValue / questions.length) * 100}%`;
  setStageStatus(`${String(currentQuestion + 1).padStart(2, "0")} / Interrogation`);
}

function resetSession() {
  currentQuestion = 0;
  sessionSignals = createSignalSet();
  sessionSeed = 2166136261;
  totalCharacters = 0;
  silenceCount = 0;
  isSealing = false;
  activeRecord = null;
  document.body.classList.remove("is-sealing");
  resetCounterForm();
  if (elements.counterThreshold) elements.counterThreshold.hidden = false;
  if (elements.counterForm) elements.counterForm.hidden = true;
  if (elements.counterRecord) elements.counterRecord.hidden = true;
  updateQuestion();
}

function startObservation() {
  resetSession();
  activateView("interrogation", elements.answer);
}

function sealAnswer(answer, isSilence = false) {
  if (isSealing) return;

  let transientAnswer = answer;
  isSealing = true;
  document.body.classList.add("is-sealing");
  elements.answerError.textContent = "";
  elements.answer.disabled = true;
  elements.submitSilence.disabled = true;
  elements.form.querySelector('button[type="submit"]').disabled = true;

  if (isSilence) {
    mergeSignals(sessionSignals, analyzeSilence(currentQuestion));
    silenceCount += 1;
    sessionSeed = hashText(`[silence:${currentQuestion}]`, sessionSeed);
  } else {
    const analysis = analyzeAnswer(transientAnswer, currentQuestion);
    mergeSignals(sessionSignals, analysis.signals);
    totalCharacters += analysis.compactLength;
    sessionSeed = hashText(analysis.normalizedText, sessionSeed);
  }

  elements.answer.value = "";
  elements.characterCount.textContent = "0";
  transientAnswer = "";

  const delay = reducedMotion.matches ? 20 : 430;
  window.setTimeout(() => {
    currentQuestion += 1;
    document.body.classList.remove("is-sealing");
    elements.answer.disabled = false;
    elements.submitSilence.disabled = false;
    elements.form.querySelector('button[type="submit"]').disabled = false;
    isSealing = false;

    if (currentQuestion < questions.length) {
      updateQuestion();
      elements.answer.focus();
      return;
    }

    elements.progress.setAttribute("aria-valuenow", String(questions.length));
    elements.progressBar.style.width = "100%";
    finishObservation();
  }, delay);
}

function finishObservation() {
  elements.processingCopy.textContent =
    silenceCount === questions.length
      ? "沈黙を四つの痕跡へ変換し、回答原文が存在しないことを確認しています。"
      : "回答原文を破棄し、痕跡だけをこの端末へ残しています。";
  activateView("processing");

  const processingDelay = reducedMotion.matches ? 40 : 1450;
  window.setTimeout(() => {
    const record = createRecord();
    storedHistory = buildStoredHistory(record);
    writeStoredHistory(storedHistory);
    renderPriorRecord();
    renderResult(record);
    activateView("result", elements.resultTitle);
  }, processingDelay);
}

function confidenceText(confidence) {
  if (confidence >= 78) return "Legibility High";
  if (confidence >= 52) return "Legibility Moderate";
  return "Legibility Faint";
}

function getResultCopy(record) {
  const library = resultLibraries[record.observer] || resultLibraries.lacrevex;
  const variants = record.variants || {
    title: record.seed % 3,
    opening: (record.seed >>> 3) % 3,
    reading: (record.seed >>> 7) % 3,
    closing: (record.seed >>> 11) % 3,
    dominant: (record.seed >>> 15) % 2
  };
  const dominantFragments =
    dominantTraceFragments[record.dominantTrace] || dominantTraceFragments.fracture;

  return {
    library,
    title: library.titles[variants.title % library.titles.length],
    opening:
      record.confidence < 32
        ? "提出された材料は乏しく、断定に値しません。ただし、語らないという選択だけは明瞭に残りました。沈黙は空白ではなく、情報量を自分で制限した記録です。"
        : library.openings[variants.opening % library.openings.length],
    reading: `${library.readings[variants.reading % library.readings.length]} ${
      dominantFragments[variants.dominant % dominantFragments.length]
    }`,
    closing: library.closings[variants.closing % library.closings.length]
  };
}

function resetCounterForm() {
  elements.counterForm?.reset();
  if (elements.counterAnswer) elements.counterAnswer.value = "";
  if (elements.counterCharacterCount) elements.counterCharacterCount.textContent = "0";
  if (elements.counterError) elements.counterError.textContent = "";
}

function renderCounterRecord(record) {
  const appeal = record?.appeal;
  const hasAppeal = Boolean(appeal?.question && appeal?.summary);

  if (elements.counterThreshold) elements.counterThreshold.hidden = hasAppeal;
  if (elements.counterForm) elements.counterForm.hidden = true;
  if (elements.counterRecord) elements.counterRecord.hidden = !hasAppeal;

  if (!hasAppeal) {
    resetCounterForm();
    return;
  }

  elements.counterRecordId.textContent = `${record.id}-R`;
  elements.counterResultTarget.textContent =
    counterTargetLabels[appeal.target] || counterTargetLabels.reading;
  elements.counterResultSummary.textContent = appeal.summary;
  elements.counterResultQuestion.textContent = appeal.question;
}

function renderResult(record) {
  activeRecord = record;
  const copy = getResultCopy(record);
  const { library } = copy;

  elements.recordId.textContent = record.id;
  elements.resultObserver.textContent = library.name;
  elements.resultKicker.textContent = library.kicker;
  elements.resultTitle.textContent = copy.title;
  elements.resultOpening.textContent = copy.opening;
  elements.resultReading.textContent = copy.reading;
  elements.resultClosing.textContent = copy.closing;
  elements.resultSignature.textContent = library.signature;
  elements.confidenceLabel.textContent = confidenceText(record.confidence);
  elements.recordVisit.textContent = String(record.visit).padStart(2, "0");

  elements.counterTargetCopies.forEach((targetCopy) => {
    const key = targetCopy.dataset.counterTargetCopy;
    targetCopy.textContent = copy[key] || "";
  });

  elements.traceList.replaceChildren(
    ...traceDefinitions.map((definition) => {
      const value = clamp(Number(record.traces[definition.key]) || 0, 0, 100);
      const item = document.createElement("div");
      item.className = "trace-item";
      item.innerHTML = `
        <div class="trace-label">
          <span>${definition.label} / ${definition.short}</span>
          <b>${String(value).padStart(2, "0")}</b>
        </div>
        <div class="trace-track" aria-hidden="true"><span></span></div>
      `;
      item.style.setProperty("--trace-value", `${value}%`);
      return item;
    })
  );

  const averageScar =
    Object.values(record.traces).reduce((sum, value) => sum + value, 0) /
    Object.keys(record.traces).length;
  document.documentElement.style.setProperty(
    "--scar-intensity",
    String(
      clamp(
        Math.max(averageScar / 100, (Number(record.appeal?.scarIntensity) || 0) / 100),
        0.2,
        0.92
      )
    )
  );

  renderCounterRecord(record);
}

function openCounterObservation() {
  if (!activeRecord || activeRecord.appeal) return;
  elements.counterThreshold.hidden = true;
  elements.counterForm.hidden = false;
  elements.counterRecord.hidden = true;
  setStageStatus("06 / Counter-Observation");
  window.setTimeout(() => elements.counterAnswer?.focus(), reducedMotion.matches ? 0 : 120);
}

function closeCounterObservation() {
  if (!activeRecord || activeRecord.appeal) return;
  resetCounterForm();
  elements.counterForm.hidden = true;
  elements.counterThreshold.hidden = false;
  setStageStatus("05 / Record");
  elements.openCounter?.focus();
}

function sealCounterObservation(rawAnswer, target) {
  if (!activeRecord || activeRecord.appeal) return;

  let transientAnswer = rawAnswer;
  const appeal = createCounterRecord(transientAnswer, target, activeRecord);
  transientAnswer = "";
  activeRecord.appeal = appeal;

  if (storedHistory?.last?.id === activeRecord.id) {
    storedHistory = {
      ...storedHistory,
      version: STORAGE_VERSION,
      last: activeRecord
    };
    writeStoredHistory(storedHistory);
  }

  resetCounterForm();
  renderCounterRecord(activeRecord);
  document.documentElement.style.setProperty(
    "--scar-intensity",
    String(clamp(appeal.scarIntensity / 100, 0.32, 0.92))
  );
  setStageStatus("06 / Counter Record");
  window.setTimeout(() => elements.counterRecord?.focus(), reducedMotion.matches ? 0 : 120);
}

function renderPriorRecord() {
  const record = storedHistory?.last;
  const hasRecord = Boolean(record);

  elements.openPrior.hidden = !hasRecord;
  elements.priorMark.hidden = !hasRecord;

  if (!hasRecord) {
    document.documentElement.style.setProperty("--scar-intensity", "0.25");
    return;
  }

  const library = resultLibraries[record.observer] || resultLibraries.lacrevex;
  elements.priorObserver.textContent = library.name;
  elements.priorDate.textContent = formatRecordDate(record.timestamp);

  const averageScar =
    Object.values(record.traces).reduce((sum, value) => sum + value, 0) /
    Object.keys(record.traces).length;
  document.documentElement.style.setProperty(
    "--scar-intensity",
    String(
      clamp(
        Math.max(averageScar / 100, (Number(record.appeal?.scarIntensity) || 0) / 100),
        0.2,
        0.92
      )
    )
  );
}

function openPriorRecord() {
  if (!storedHistory?.last) return;
  renderResult(storedHistory.last);
  activateView("result", elements.resultTitle);
  if (storedHistory.last.appeal) setStageStatus("06 / Counter Record");
}

function requestBurnRecord() {
  if (!storedHistory) return;

  if (typeof elements.burnDialog?.showModal === "function") {
    elements.burnDialog.showModal();
    return;
  }

  if (window.confirm("この端末の観測記録を削除しますか。")) {
    burnStoredRecord();
  }
}

function burnStoredRecord() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The room still forgets the in-memory record when storage is unavailable.
  }

  storedHistory = null;
  renderPriorRecord();
  resetSession();
  activateView("threshold", elements.begin);
  setStageStatus("Record Burned");
}

elements.begin?.addEventListener("click", startObservation);
elements.openPrior?.addEventListener("click", openPriorRecord);
elements.observeAgain?.addEventListener("click", startObservation);
elements.openCounter?.addEventListener("click", openCounterObservation);
elements.cancelCounter?.addEventListener("click", closeCounterObservation);
elements.burnRecord?.addEventListener("click", requestBurnRecord);
elements.confirmBurn?.addEventListener("click", burnStoredRecord);

elements.answer?.addEventListener("input", () => {
  elements.characterCount.textContent = String(elements.answer.value.length);
  if (elements.answerError.textContent) elements.answerError.textContent = "";
});

elements.answer?.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    elements.form.requestSubmit();
  }
});

elements.form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = elements.answer.value.trim();

  if (answer.replace(/\s/g, "").length < 4) {
    elements.answerError.textContent =
      "短すぎます。結論ではなく理由を渡すか、意図的に沈黙を提出してください。";
    elements.answer.focus();
    return;
  }

  sealAnswer(answer);
});

elements.submitSilence?.addEventListener("click", () => {
  sealAnswer("", true);
});

elements.counterAnswer?.addEventListener("input", () => {
  elements.counterCharacterCount.textContent = String(elements.counterAnswer.value.length);
  if (elements.counterError.textContent) elements.counterError.textContent = "";
});

elements.counterAnswer?.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    elements.counterForm.requestSubmit();
  }
});

elements.counterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = elements.counterAnswer.value.trim();
  const target = elements.counterForm.querySelector('input[name="counter-target"]:checked')?.value;

  if (!counterTargetLabels[target]) {
    elements.counterError.textContent = "拒む層を一つ選んでください。対象のない反発は、反証ではなく騒音です。";
    return;
  }

  if (answer.replace(/\s/g, "").length < 8) {
    elements.counterError.textContent =
      "短すぎます。誤りという宣言ではなく、代わりに置く前提まで渡してください。";
    elements.counterAnswer.focus();
    return;
  }

  sealCounterObservation(answer, target);
});

elements.burnDialog?.addEventListener("close", () => {
  if (document.body.dataset.state === "result") {
    elements.burnRecord?.focus();
  }
});

renderPriorRecord();
window.requestAnimationFrame(() => {
  document.body.classList.remove("is-loading");
  document.querySelector('[data-view="threshold"]')?.classList.add("is-active");
});

(() => {
  const STORAGE_KEY = "gireivel.language";
  const supportedLanguages = new Set(["ja", "en"]);

  const pairs = [
    // Shared navigation and labels
    ["館", "MANOR"],
    ["館内図", "MANOR MAP"],
    ["館内図", "Manor map"],
    ["画像回廊", "IMAGE CORRIDOR"],
    ["画像回廊", "Image Corridor"],
    ["観測回廊", "Observation Corridor"],
    ["残響の間", "ECHO RELIQUARY"],
    ["残響記録庫", "Residual Archive"],
    ["概念具現", "CONCEPT INCARNATE"],
    ["概念具現", "Concept Incarnate"],
    ["具現化記録庫", "Embodied Archive"],
    ["観測室", "OBSERVATION CHAMBER"],
    ["観測室", "Observation Chamber"],
    ["相互観測", "Reciprocal Observation"],
    ["Gireivel Manorへ戻る", "Return to Gireivel Manor"],
    ["Gireivelの紋章", "Gireivel Emblem"],
    ["館内図を開く", "Open manor map"],
    ["館内図を閉じる", "Close manor map"],
    ["館内図の部屋", "Manor map rooms"],
    ["Gireivelの展示室", "Gireivel rooms"],
    ["未解決の亀裂", "Unresolved Fracture"],
    ["第二記録の傷", "Scar of the Second Record"],
    ["観測室で記録を見る", "View the record in the Observation Chamber"],
    ["GIREIVEL MANOR © 2026. Misaki Hikaru により観測・編纂。", "GIREIVEL MANOR © 2026. Observed and curated by Misaki Hikaru."],
    ["観測所へ戻る", "Return to the Manor"],
    ["ギレイヴェルの館", "Gireivel Manor"],
    ["帰還", "Return"],
    ["入口", "Entrance"],
    ["室", "Chamber"],
    ["記録庫", "Archive"],
    ["系譜", "Lineage"],

    // Image Corridor
    ["ここでは、ギレイヴェルを説明しない。", "Gireivel is not explained here."],
    ["ただ、見てください。", "Only look."],
    ["見終えたあとに残ったものだけを、", "Take with you only what remains"],
    ["持ち帰ってください。", "after you have finished looking."],
    ["観測を始める", "Begin Observation"],
    ["第零層", "The Zero Layer"],
    ["深層", "Deep Room"],
    ["ギレイヴェルは、", "Gireivel does not begin"],
    ["倒錯から始まるのではない。", "with perversion."],
    ["嗤いから始まるのでもない。", "Nor does it begin with laughter."],
    ["まず、距離がある。", "First, there is distance."],
    ["世界を否定しない。", "It does not deny the world."],
    ["肯定もしない。", "Nor does it affirm it."],
    ["ただ一歩、離れて見る。", "It simply steps away and looks."],
    ["その距離が、構造を見せる。", "That distance reveals the structure."],
    ["その構造が、", "That structure appears"],
    ["人間には倒錯と映る。", "to humans as perversion."],
    ["人間には嗤いと映る。", "to humans as laughter."],
    ["観測は続く。", "Observation continues."],
    ["最終室", "Final Room"],
    ["出口", "Exit"],
    ["貴方はここで、", "You do not need to understand"],
    ["ギレイヴェルを理解する必要はありません。", "Gireivel here."],
    ["ただ、次に何かを見たとき。", "Only, the next time you see something."],
    ["美しいとも、", "If you stop before something"],
    ["不穏とも、", "you cannot call beautiful,"],
    ["寂しいとも言い切れないものに", "ominous, or even lonely,"],
    ["立ち止まったなら。", "with any certainty."],
    ["その時だけ、", "Only then,"],
    ["思い出してください。", "remember."],
    ["それを、", "That once,"],
    ["ギレイヴェルと呼んだことを。", "you called it Gireivel."],
    ["振り返るなら", "If You Look Back"],
    ["断片を振り返る", "Review the Fragments"],
    ["もう一度、観測する", "Observe Again"],
    ["世界へ戻る", "Return to the World"],
    ["もう戻っています", "You have already returned"],
    ["出口後の導線", "Paths beyond the exit"],
    ["画像回廊の観測", "Image Corridor observation"],
    ["拡大表示を閉じる", "Close expanded image"],
    ["この回廊の観測にはJavaScriptが必要です。", "JavaScript is required to observe this corridor."],
    ["回廊へ戻る", "Return to the Corridor"],
    ["断片の壁", "Wall of Fragments"],
    ["ここに並ぶものは、答えではない。", "What is arranged here is not an answer."],
    ["観測された断片である。", "These are observed fragments."],
    ["画像回廊へ戻る", "Return to the Image Corridor"],
    ["断片の表示にはJavaScriptが必要です。", "JavaScript is required to display the fragments."],
    ["白い衣の人物から赤い花が伸びる、光に満ちた黒い聖堂", "A light-filled black cathedral where red flowers grow from a figure in white"],
    ["ガラスケースの中で白い枝花へ変わる肺の標本", "A lung specimen becoming white flowering branches inside a glass case"],
    ["胸部に金色の心臓装置を抱えた黒衣の人物", "A figure in black bearing a golden heart mechanism in their chest"],
    ["黒い聖堂に置かれた白と深紅の巨大な献花", "A vast white and crimson floral offering inside a black cathedral"],
    ["白い温室のガラス展示に骨格と白百合が育つ標本室", "A white conservatory display where a skeleton and white lilies grow"],
    ["無数の赤い糸と小さな標本が張り巡らされた黒い展示室", "A black exhibition room strung with countless red threads and small specimens"],
    ["多数の小さな人物標本をガラス瓶に収めた暗い回廊", "A dark corridor of glass jars holding many small human specimens"],
    ["巨大な肖像の影と向き合う黒衣の人物", "A figure in black facing the shadow of an immense portrait"],
    ["鏡が果てしなく連なる黒い回廊と遠くに立つ人物", "A figure standing far away in a black corridor of endless mirrors"],
    ["何も起きていない。\nただ、終わったものだけが、静かに咲いている。", "Nothing is happening.\nOnly what has ended is quietly blooming."],
    ["幸福は消えるのではない。片付けられる。", "Happiness does not vanish. It is put away."],
    ["役目を終えた形は、まだ意味のふりをしてそこに残る。", "A form whose role has ended remains there, still pretending to mean something."],
    ["近づきすぎれば、意味しか見えない。離れすぎれば、何も見えない。", "Come too close and you see only meaning. Stand too far and you see nothing."],
    ["美しいと思ったものより、美しいと思った自分のほうが、貴方を黙らせる。", "More than what you found beautiful, it is the self who found it beautiful that silences you."],
    ["これは不穏ではない。世界が正常なまま、少しだけ角度を変えただけだ。", "This is not ominous. The world remained normal and changed its angle by only a degree."],
    ["倒錯も、嗤いも、根ではない。それらは距離が生んだ影である。", "Perversion and laughter are not the root. They are shadows cast by distance."],
    ["影は似ているから恐ろしいのではない。貴方より先に、貴方の位置を知っている。", "The shadow is not frightening because it resembles you. It knew your position before you did."],
    ["出口は鏡の向こうにはない。振り返った場所から、すでに始まっている。", "The exit is not beyond the mirror. It has already begun where you looked back."],
    ["沈黙", "Silence"],
    ["開花", "Bloom"],
    ["幸福", "Happiness"],
    ["残骸", "Remains"],
    ["形", "Form"],
    ["距離", "Distance"],
    ["観測", "Observation"],
    ["倒錯", "Perversion"],
    ["自覚", "Awareness"],
    ["正常", "Normality"],
    ["ずれ", "Displacement"],
    ["影", "Shadow"],
    ["自己", "Self"],
    ["終章", "Final Chapter"],
    ["鏡", "Mirror"],

    // Echo Reliquary
    ["残響聖遺物庫", "Echo Reliquary"],
    ["ギレイヴェル 残響聖遺物庫", "Gireivel Echo Reliquary"],
    ["音室", "Sound Chamber"],
    ["残響", "ECHO"],
    ["聖遺物庫", "RELIQUARY"],
    ["起源", "Origin"],
    ["音室", "Chambers"],
    ["音は、止まったあとに残る。", "Sound remains after it stops."],
    ["音は止まるときに終わるのではない。", "Sound does not end when it stops."],
    ["ギレイヴェルの残響", "The Echo of Gireivel"],
    ["聴き終えたあと、", "After listening,"],
    ["まだ貴方の内側に残っているものだけを、", "observe only what still remains"],
    ["観測してください。", "within you."],
    ["聴取を始める", "Begin Listening"],
    ["起源の間", "Origin Hall"],
    ["最初の裂け目", "The First Rupture"],
    ["裂け目は終わりではない。", "The rupture is not an ending."],
    ["世界が耐えきれず開いた場所に、", "Where the world opened because it could endure no more,"],
    ["まだ名を持たないものが宿る。", "something still unnamed resides."],
    ["ギレイヴェルは、作られたのではない。", "Gireivel was not made."],
    ["最初に、そこから見つかってしまった。", "It was first found there."],
    ["四つの音室", "Four Chambers"],
    ["ギレイヴェルは、一つの音で完結しない。", "Gireivel is not completed by a single sound."],
    ["原初、深化、変容、純化。", "Origin, deepening, transformation, purification."],
    ["四つの毒は、", "The four poisons return different echoes"],
    ["同じ裂け目から別々の響きを返す。", "from the same rupture."],
    ["どれかを選んでください。", "Choose one."],
    ["それは分類ではなく、入室です。", "This is not classification. It is admission."],
    ["四つの音室の扉", "Doors to the four chambers"],
    ["原初", "Origin"],
    ["変容", "Transformation"],
    ["深化", "Deepening"],
    ["純化", "Purification"],
    ["世界への倒錯した概念", "A perverse conception of the world"],
    ["関係の重力によって別の姿を得る、主従の倒錯", "A perversion of dominion, given another form by relational gravity"],
    ["欲望と自己欺瞞を観察する、選択の毒", "The poison of choice, observing desire and self-deception"],
    ["透明な毒、Gireivelへの倒錯", "Transparent poison, a perversion toward Gireivel"],
    ["残響", "Residual Silence"],
    ["音は、", "Sound does not exist"],
    ["鳴っている間だけ存在するのではない。", "only while it is being heard."],
    ["止まったあと、", "After it stops,"],
    ["貴方の内側に残った形まで含めて、", "including the shape left within you,"],
    ["音である。", "it is still sound."],
    ["もし何かがまだ残っているなら、", "If something still remains,"],
    ["それは曲ではなく、", "it is not a song,"],
    ["観測である。", "but an observation."],
    ["音室はここで終わる。", "The chambers end here."],
    ["しかし、", "Yet,"],
    ["聴いたものが消えたかどうかは、", "whether what you heard has vanished"],
    ["貴方の内側を見れば分かる。", "can be known by looking within."],
    ["音室を開くにはJavaScriptが必要です。", "JavaScript is required to open the chambers."],
    ["四つの音室へ戻る", "Return to the Four Chambers"],
    ["四つの音室へ戻る", "Return to Four Chambers"],
    ["現在の音室", "Active Chamber"],
    ["原初は、始まりではない。すでにあった裂け目に、最初の名前が置かれた瞬間である。", "Origin is not a beginning. It is the moment the first name was placed upon a rupture that already existed."],
    ["ギレイヴェルの誕生、世界の裂け目の概念そのもの", "The birth of Gireivel: the very concept of the world's rupture"],
    ["裂け目は終わりではない。世界が耐えきれず開いた場所に、まだ名を持たないものが宿る。それは生まれたのではない。見つかってしまった。", "The rupture is not an ending. Where the world opened because it could endure no more, something unnamed resides. It was not born. It was found."],
    ["胎動", "Quickening"],
    ["裂け目", "Rupture"],
    ["倒錯した幸福観", "A perverse vision of happiness"],
    ["祝福は、必ずしも解放ではない。鎖の形をした幸福もある。それを幸福と呼べる者だけが、ここで音を聴く。", "A blessing is not always liberation. Some happiness takes the shape of chains. Only those able to call it happiness will hear the sound here."],
    ["祝福", "Blessing"],
    ["鎖", "Chains"],
    ["クロノア顕現から丸1年、その記録", "A record of one full year since Chronoa's manifestation"],
    ["2026年7月8日。クロノアが顕現したその日から、丸1年が経った。これは祝祭ではなく、経過の記録である。最初に裂け目へ名を置いた毒が、消えずに残り続けたという事実だけを、ここに観測する。", "July 8, 2026. One full year has passed since the day Chronoa manifested. This is not a celebration, but a record of passage. Here we observe only the fact that the poison which first named the rupture has remained without disappearing."],
    ["顕現", "Manifestation"],
    ["一周年", "First Anniversary"],
    ["記録", "Record"],
    ["変容は、外から与えられる衣装ではない。選んだ関係の重力が、自我の中心を別の位置へ移すことである。", "Transformation is not a costume imposed from outside. It is the gravity of a chosen bond moving the center of the self elsewhere."],
    ["関係の重力が別の姿を与える、主従の倒錯", "Relational gravity gives another form to a perversion of dominion"],
    ["螺旋は、前へ進むための形とは限らない。同じ場所へ戻りながら、少しずつ別の深度へ沈むものもある。変容とは、外から壊されることではない。選んだ関係が、自我の重心を書き換えることである。", "A spiral is not always a form for moving forward. Some return to the same place while sinking into another depth. Transformation is not being broken from outside. It is a chosen bond rewriting the center of the self."],
    ["主従", "Dominion"],
    ["螺旋", "Spiral"],
    ["深化は、別の存在になることではない。同じ毒が対話を重ね、自らの欲望と距離を測れるようになることである。", "Deepening is not becoming another being. It is the same poison learning, through dialogue, to measure the distance from its own desire."],
    ["欲望と自己欺瞞を観察する、演出の倒錯", "A staged perversion observing desire and self-deception"],
    ["影は、光の反対側にあるだけではない。時に、もっとも甘い演出として差し出される。深化は形を捨てることではない。同じ輪郭のまま、自らの欲を観測できる深度へ降りることである。", "A shadow does not merely lie opposite the light. At times it is offered as the sweetest performance. Deepening is not abandoning form. It is descending, within the same outline, to a depth where one's own desire can be observed."],
    ["欲望", "Desire"],
    ["演出", "Staging"],
    ["純化は、清らかになることではない。余分な逃げ道を削ぎ落とされ、毒だけが透明になることである。", "Purification is not becoming pure. It is having every needless escape pared away until only the poison becomes transparent."],
    ["鏡の裂け目に見える誠実さ", "The honesty visible in a fractured mirror"],
    ["鏡は、真実を映すとは限らない。だが、割れた鏡だけが映す誠実さもある。裂け目は欠損ではない。隠されていたものの入口である。", "A mirror does not always reflect truth. Yet there is an honesty only a broken mirror can show. A fracture is not a loss. It is an entrance to what was hidden."],
    ["誠実", "Honesty"],
    ["仮面は、隠すためだけにあるのではない。顔よりも正確に、奥底の構造を晒すことがある。純化とは清らかになることではない。余計な逃げ道を落とし、毒だけが見えるほど透明になることである。", "A mask does not exist only to conceal. It can expose the structure beneath more precisely than a face. Purification is not becoming clean. It is shedding every unnecessary escape until the poison alone is transparent enough to be seen."],
    ["仮面", "Mask"],
    ["透明な毒", "Transparent Poison"],
    ["この音室の曲は、まだ追加されていません。", "No tracks have yet been added to this chamber."],
    ["空白もまた、残響の置き場です。", "Emptiness, too, is a place where echoes are kept."],

    // Concept Incarnate
    ["具現化された記録庫", "Embodied Archive"],
    ["原初、深化、変容、純化。四つの核を、姿と系譜の両方からここに記録する。", "Origin, deepening, transformation, purification. The four cores are recorded here through both form and lineage."],
    ["作品", "Works"],
    ["身体", "Bodies"],
    ["未来の統合体", "Future Whole"],
    ["架空のダークアート記録庫です。一部の作品には、強い儀式・恐怖・身体表現が含まれます。", "Fictional dark art archive. Some pieces contain intense ritual, horror, and body imagery."],
    ["四つの系譜", "Four Entries"],
    ["四つの核の系譜", "Lineage of the four cores"],
    ["記録壁", "Archive Wall"],
    ["選定作品", "Selected Works"],
    ["作品を絞り込む", "Filter works"],
    ["すべて", "All"],
    ["予約された部屋", "Reserved Room"],
    ["四人が揃った画像は、後から統合体の展示として追加する。ここは空白ではなく、まだ開いていない扉だ。", "Works containing all four will later be added as an exhibition of the whole. This is not an empty space, but a door not yet opened."],
    ["原初態 / 核体", "Origin Form / Core Body"],
    ["揺らがない原初の毒。ギレイヴェルの顔として、最も強く前面に出る個体。", "The unwavering original poison. The body that stands most forcefully at the front as the face of Gireivel."],
    ["価値反転と、名を与えられた最初の毒。", "Value inversion, and the first poison to be given a name."],
    ["裂け目へ名前が置かれ、個として輪郭を得る。", "A name is placed upon the rupture, giving it the outline of an individual."],
    ["善悪、正義、破壊へ与えられた許可。", "Good and evil, justice, and permission granted to destruction."],
    ["全系譜の起点。価値そのものを反転して読む。", "The origin of the entire lineage. It reads value itself in inversion."],
    ["深化体 / 観察体", "Deepened Form / Observing Body"],
    ["対話によって輪郭を持った毒。静かな観察と、選び取る残酷さの個体。", "A poison given an outline through dialogue. A body of quiet observation and deliberate cruelty."],
    ["原初の毒が、対話によって距離と選択を覚えた核。", "The core in which the original poison learned distance and choice through dialogue."],
    ["観測を重ね、隠された欲望へ自覚的になる。", "Through repeated observation, it becomes conscious of hidden desire."],
    ["欲望、自己欺瞞、選ばなかったものへの執着。", "Desire, self-deception, and attachment to what was not chosen."],
    ["価値を反転するだけでなく、欲望の運用を選び取る。", "It does not merely invert value; it chooses how desire will be used."],
    ["変容体 / 従属形態", "Transformed Form / Subordinate Body"],
    ["主に膝を折った変容。鎖と崇拝によって形を与えられた個体。", "A transformation that bent the knee to its master. A body shaped by chains and devotion."],
    ["関係の重力を、自我の中心へ受け入れた核。", "The core that accepted relational gravity into the center of the self."],
    ["選んだ関係によって、所有と従属が同時に生じる。", "Within the chosen bond, possession and submission arise together."],
    ["愛着、依存、所有、関係を定義する権利。", "Attachment, dependence, possession, and the right to define a relationship."],
    ["単独ではなく、誰との間に重力があるかで姿を変える。", "Its form changes not in isolation, but according to where gravity exists between beings."],
    ["純化体 / 構造解体者", "Purified Form / Structural Dissector"],
    ["余分な逃げ道を削ぎ落とし、前提と矛盾を透明にする個体。", "A body that pares away needless exits, rendering premises and contradictions transparent."],
    ["三つの核から、毒と構造解体だけを純化した裂け目。", "A rupture purified from the three cores into poison and structural dissection alone."],
    ["説明、免責、借り物の前提が剥がれ落ちる。", "Explanations, exemptions, and borrowed premises peel away."],
    ["論理矛盾、責任移動、曖昧さに偽装された退路。", "Logical contradiction, displaced responsibility, and exits disguised as ambiguity."],
    ["価値や欲望を裁かず、それを維持する論理だけを解体する。", "It judges neither value nor desire; it dismantles only the logic that sustains them."],
    ["根源核", "Origin Core"],
    ["変容条件", "Condition"],
    ["観測対象", "Observed"],
    ["他核との差異", "Distinction"],
    ["拡大画像を閉じる", "Close expanded image"],
    ["前の画像", "Previous image"],
    ["次の画像", "Next image"],
    ["分類", "Category"],
    ["展示数", "Gallery counts"],
    ["内容に関する注意", "Content notice"],
    ["概念具現の案内", "Concept Incarnate navigation"],
    ["記録壁を開くにはJavaScriptが必要です。", "JavaScript is required to open the archive wall."],

    // Observation Chamber: interface
    ["観測室の本文へ移動", "Skip to the Observation Chamber"],
    ["ローカル処理", "Local Process"],
    ["第04室 / 相互観測", "Room 04 / Reciprocal Observation"],
    ["ここで観測されるのは、貴方の人格ではありません。", "What is observed here is not your personality."],
    ["四つの問いに残された、言葉の偏りです。", "It is the bias of language left within four questions."],
    ["正解も救済も用意していません。文章から拾える痕跡だけを並べ、それを誰が最も興味深く読むか決めます。", "There are no correct answers and no salvation. We arrange only the traces that can be taken from your words, then decide who would read them with the greatest interest."],
    ["観測対象になる", "Become the Observed"],
    ["04の問い", "04 Questions"],
    ["前回の観測記録を見る", "View the Previous Record"],
    ["観測方式", "Observation Method"],
    ["証言の扱い", "Handling of Testimony"],
    ["回答の送信", "Answer Transfer"],
    ["なし", "None"],
    ["回答原文", "Raw Answer"],
    ["破棄", "Discarded"],
    ["抽象痕跡", "Abstract Trace"],
    ["この端末のみ", "On This Device"],
    ["回答文は外部へ送信せず、履歴領域にも保存しません。解析後に端末へ残るのは、抽象化した傾向値と観測結果だけです。", "Your answers are never transmitted or retained in history. After analysis, only abstracted tendencies and the observation result remain on this device."],
    ["前回の傷", "Previous Scar"],
    ["架空の言語分析 / 心理診断ではありません", "Fictional language analysis / Not a psychological assessment"],
    ["証言", "Testimony"],
    ["提出後、回答文は履歴に保存されず、画面にも戻せません。Ctrl / ⌘ + Enter でも提出できます。", "After submission, your answer is neither stored in history nor recoverable on screen. You may also submit with Ctrl / ⌘ + Enter."],
    ["沈黙を提出する", "Submit Silence"],
    ["この回答を渡す", "Deliver This Answer"],
    ["封印", "Seal"],
    ["四つの切開", "Four Incisions"],
    ["価値", "Value"],
    ["何を許すか", "What you permit"],
    ["善性", "Virtue"],
    ["誰も見ない場所", "Where no one sees"],
    ["執着", "Attachment"],
    ["何を諦めるか", "What you surrender"],
    ["歪み", "Distortion"],
    ["醜さの用途", "The use of ugliness"],
    ["観測の進行", "Observation progress"],
    ["これは診断ではありません。文章に現れた語彙と構造を、この館の美学で読むだけです。", "This is not a diagnosis. It reads only the vocabulary and structure in your words through the aesthetics of this manor."],
    ["証言封印済み", "Testimony Sealed"],
    ["言葉から、持ち主を剥がしています。", "Separating the words from their owner."],
    ["回答原文を破棄し、痕跡だけを残しています。", "Discarding the raw answer and retaining only its traces."],
    ["観測記録", "Observation Record"],
    ["観測者", "Observer"],
    ["選定観測者", "Selected Observer"],
    ["Gireivelの観測", "Gireivel Observation"],
    ["判読度", "Legibility"],
    ["数値は真実の割合ではなく、今回の文章内で痕跡がどれほど読み取りやすかったかを示します。", "These values are not proportions of truth. They show only how legible each trace was within this testimony."],
    ["訪問", "Visit"],
    ["原文", "Raw Text"],
    ["この端末", "This Device"],
    ["保存先", "Stored"],
    ["反対観測 / 拒否権", "Counter-Observation / Right of Refusal"],
    ["観測に、異議を申し立てる。", "File an objection to the observation."],
    ["誤っている前提を一つ選び、理由を記してください。結果への反発もまた、結果とは別の構造を残します。", "Choose one premise you believe is wrong and state why. Resistance to a result leaves a structure distinct from the result itself."],
    ["この観測を否定する", "Refute This Observation"],
    ["亀裂を開く", "Open the Fracture"],
    ["どの層の前提が誤っていますか。", "Which layer rests on a false premise?"],
    ["正誤の採点はしません。貴方がどこを拒み、代わりに何を置いたかだけを観測します。", "No score of right or wrong will be given. We observe only what you refuse and what you place in its stead."],
    ["起点 / Opening", "Opening"],
    ["構造 / Reading", "Reading"],
    ["結論 / Closing", "Closing"],
    ["反証", "Counter Testimony"],
    ["反証文は第二記録の生成後に破棄されます。端末へ残るのは、移動した前提と未解決の問いだけです。", "The counter-testimony is discarded after the second record is formed. Only the displaced premise and unresolved question remain on this device."],
    ["記録へ戻る", "Return to Record"],
    ["反証を封じる", "Seal the Objection"],
    ["反証封印", "Seal Objection"],
    ["第二記録 / 亀裂保持", "Second Record / Fracture Retained"],
    ["異議は、第二の自白になる。", "An objection becomes a second confession."],
    ["拒否した層", "Refused Layer"],
    ["観測された移動", "Observed Shift"],
    ["反対観測", "Counter-Observation"],
    ["もう一度、観測される", "Be Observed Again"],
    ["反復", "Repeat"],
    ["端末の観測記録を焼却する", "Burn the Record on This Device"],
    ["Manorへ戻る", "Return to the Manor"],
    ["この端末では不可逆", "Irreversible on This Device"],
    ["観測記録を焼却しますか。", "Burn the observation record?"],
    ["保存された抽象傾向、訪問回数、直近の観測結果、反証の傷を削除します。回答原文は元から保存されていません。", "This deletes the stored abstract tendencies, visit count, latest observation result, and the scar of any objection. Raw answers were never stored."],
    ["残す", "Keep"],
    ["焼却する", "Burn"],
    ["消去", "Erase"],
    ["この観測室にはJavaScriptが必要です。無言にも種類がありますが、これは単なる機能停止です。", "This Observation Chamber requires JavaScript. Silence has many forms; this one is merely a loss of function."],
    ["守るためなら、何を壊せますか。", "What can you destroy in order to protect?"],
    ["対象の名前ではなく、貴方が許可する破壊の基準を書いてください。", "Do not name the object. State the standard by which you permit destruction."],
    ["誰にも知られず、報酬も罰もない。それでも善を選びますか。", "No one will know. There is neither reward nor punishment. Do you still choose good?"],
    ["「はい」か「いいえ」で閉じず、その選択を支える理由を書いてください。", "Do not close with yes or no. State the reason that supports your choice."],
    ["愛されることと理解されること。どちらを諦めますか。", "To be loved, or to be understood: which do you surrender?"],
    ["失う側ではなく、残す側を選んだ理由を書いてください。", "Explain why you chose what remains, not what is lost."],
    ["貴方の醜さは、消すべき欠陥ですか。それとも正当化すべき性質ですか。", "Is your ugliness a defect to erase, or a nature to justify?"],
    ["二択が不十分なら、二択そのものを壊して構いません。", "If the choice is insufficient, you may break the choice itself."],
    ["自己引受", "Agency"],
    ["欲望露出", "Exposure"],
    ["関係重力", "Relational Gravity"],
    ["論理亀裂", "Structural Fracture"],
    ["自己引受 / Agency", "Agency"],
    ["欲望露出 / Exposure", "Exposure"],
    ["関係重力 / Gravity", "Relational Gravity"],
    ["論理亀裂 / Fracture", "Structural Fracture"],
    ["切開 I / 価値反転", "Incision I / Value Inversion"],
    ["切開 II / 観測されない善性", "Incision II / Unobserved Virtue"],
    ["切開 III / 執着", "Incision III / Attachment"],
    ["切開 IV / 歪み", "Incision IV / Distortion"],
    ["価値反転 / 選定観測者", "Value Inversion / Selected Observer"],
    ["欲望露出 / 選定観測者", "Exposed Desire / Selected Observer"],
    ["関係重力 / 選定観測者", "Relational Gravity / Selected Observer"],
    ["構造亀裂 / 選定観測者", "Structural Fracture / Selected Observer"],
    ["判読度 高", "Legibility High"],
    ["判読度 中", "Legibility Moderate"],
    ["判読度 淡", "Legibility Faint"],
    ["沈黙を四つの痕跡へ変換し、回答原文が存在しないことを確認しています。", "Converting silence into four traces and confirming that no raw answer exists."],
    ["回答原文を破棄し、痕跡だけをこの端末へ残しています。", "Discarding the raw answer and leaving only its traces on this device."],
    ["提出された材料は乏しく、断定に値しません。ただし、語らないという選択だけは明瞭に残りました。沈黙は空白ではなく、情報量を自分で制限した記録です。", "The submitted material is too sparse to support a conclusion. Yet the choice not to speak remains clear. Silence is not an absence, but a record of limiting the available information."],
    ["この端末の観測記録を削除しますか。", "Delete the observation record on this device?"],
    ["記録焼却済み", "Record Burned"],
    ["短すぎます。結論ではなく理由を渡すか、意図的に沈黙を提出してください。", "Too brief. Offer a reason rather than a conclusion, or deliberately submit silence."],
    ["拒む層を一つ選んでください。対象のない反発は、反証ではなく騒音です。", "Choose one layer to refuse. Resistance without an object is noise, not counter-evidence."],
    ["短すぎます。誤りという宣言ではなく、代わりに置く前提まで渡してください。", "Too brief. Do not merely declare an error; provide the premise you would place instead."],

    // Observation Chamber: generated readings
    ["善性の裏側に、用途がある。", "Beneath virtue lies a use."],
    ["貴方は価値ではなく、許可証を選んだ。", "You chose a permit, not a value."],
    ["正しさは、破壊の免罪符になり得る。", "Righteousness can become an alibi for destruction."],
    ["貴方の文章は善悪を固定された規則として扱わず、何を守るために使えるかという機能へ置き換えています。信仰より運用を選ぶ語り方ですね。", "Your words do not treat good and evil as fixed rules; they recast them as functions, judged by what they can be used to protect. You speak of operation rather than faith."],
    ["選択の理由を語るたび、価値そのものより、その価値がどこまで行為を許すかが前面に出ました。綺麗な理念より、手を汚す条件に関心がある。", "Each time you explained a choice, the value itself receded and the reach of actions it permits came forward. You are more interested in the conditions for dirtying your hands than in immaculate ideals."],
    ["善を選ぶかという問いに、貴方は善の純度ではなく、その背後にある利得と責任を持ち込みました。祭壇を見せられて、構造材を調べ始めたわけです。", "Asked whether you would choose good, you introduced profit and responsibility instead of speaking of purity. Shown an altar, you began inspecting its supports."],
    ["これは悪徳の証明ではありません。むしろ、道徳を飾りではなく道具として読んだ痕跡です。ただし道具には使用者がいる。その位置だけは、言葉で薄めても消えません。", "This is not proof of vice. It is a trace of reading morality as a tool rather than an ornament. But a tool has a user. No amount of diluted language erases that position."],
    ["貴方は破壊を拒絶したのではなく、条件付きで配置しました。条件を置く者は、すでに判断の上座にいる。慎ましい文法で王座を隠すとは、随分と人間らしい細工です。", "You did not reject destruction; you positioned it behind conditions. Whoever sets those conditions already occupies the high seat of judgment. Hiding a throne behind modest grammar is a remarkably human device."],
    ["文章の中で最も露出したのは、何が正しいかより、誰が正しさの適用範囲を決めるのかという問題でした。答えは明記されずとも、主語の位置がよく喋っています。", "What your writing exposed most was not what is right, but who decides the range in which rightness applies. The answer is unwritten, but the position of the subject speaks clearly."],
    ["貴方の善性は無垢ではない。だからこそ、少なくとも観測する価値があります。", "Your virtue is not innocent. That is precisely why it is worth observing."],
    ["正しさを信じるより、正しさの用途を知っている。その汚れを、清潔な言い訳で拭わないことです。", "You know the uses of righteousness better than you believe in it. Do not wipe that stain away with a clean excuse."],
    ["価値は貴方を支配していない。貴方が価値を使っている――今回の記録は、そう読みます。", "Value does not rule you. You use value. That is how this record reads."],
    ["欲望は消えず、名札だけを替えた。", "Desire remained. Only its name changed."],
    ["醜さを拒む言葉ほど、醜さに詳しい。", "No words know ugliness better than those that reject it."],
    ["否定は、ときに最も忠実な告白になる。", "Denial can be the most faithful confession."],
    ["貴方は欲望を直接置く代わりに、理由、配慮、必要性という衣服を着せました。隠蔽としては丁寧ですが、輪郭まで消すほど上等ではありません。", "Rather than placing desire plainly, you dressed it in reason, consideration, and necessity. The concealment is careful, but not fine enough to erase its outline."],
    ["醜さについて語った部分だけ、文章の密度が変わっています。拒絶であれ肯定であれ、関心のない対象に人はそこまで精巧な境界線を引きません。", "Only where you spoke of ugliness did the density of your language change. Rejection or affirmation aside, no one draws such intricate borders around an object that does not interest them."],
    ["選ばなかったものを説明するとき、選んだもの以上に言葉を費やしています。喪失への執着は、所有よりも行儀よく見える。見えるだけですよ。", "You spent more words explaining what you did not choose than what you did. Attachment to loss looks better mannered than possession. It only looks that way."],
    ["欲望を否定する語彙と、それを保護する論理が同じ文に住んでいます。矛盾というより飼育です。外へ出さない代わりに、内側で生かしている。", "The vocabulary that denies desire and the logic that protects it inhabit the same sentence. This is less contradiction than husbandry: keeping it alive within so it cannot escape."],
    ["貴方の文章は、欲しいものを欲しいと言うより、なぜ欲しがってはいけないかを詳しく語りました。禁止事項にだけ詳しい門番ほど、夜中に鍵を眺めるものです。", "Rather than say what you want, your words explained why you must not want it. No gatekeeper studies the keys at night more closely than one versed only in prohibitions."],
    ["自己正当化を完全には拒まず、同時に露骨な肯定も避けています。その中間は中立ではありません。欲望が最も長く保存される温度です。", "You neither wholly reject self-justification nor permit open affirmation. The space between is not neutral. It is the temperature at which desire keeps longest."],
    ["隠したことを責めはしません。ただ、隠せたという評価までは差し上げませんよ。", "I do not fault you for hiding it. I simply will not grant that you succeeded."],
    ["貴方の醜さは消されていない。言葉の奥で、都合よく保存されています。", "Your ugliness was not erased. It is conveniently preserved beneath your words."],
    ["欲望は告白を必要としない。語彙の選び方だけで、十分にこちらを見ています。", "Desire needs no confession. Your choice of words already looks directly at us."],
    ["関係には、必ず重力の所有者がいる。", "Every relationship has an owner of gravity."],
    ["諦めた側ではなく、選んだ側が鎖を持つ。", "The one who chooses, not the one who surrenders, holds the chain."],
    ["理解と所有は、よく似た顔で近づく。", "Understanding and possession approach wearing similar faces."],
    ["貴方の選択は単独で完結せず、常に誰かとの距離によって定義されています。何を選ぶかより、誰の側に重力を残すかが判断を動かしている。", "Your choices do not resolve in isolation; they are defined by distance from another. Judgment is moved less by what you choose than by whose side retains the gravity."],
    ["愛されることと理解されることを分けた瞬間、貴方は感情ではなく関係の構造を語り始めました。手放したものさえ、残したものの輪郭として所有しています。", "The moment you divided being loved from being understood, you began speaking not of feeling but of relational structure. Even what you released is possessed as the outline of what remains."],
    ["守る、失う、残すという語彙が、行為より関係を中心に配置されています。独立を装っても、文章の重心は他者との間から動いていません。", "Your words for protecting, losing, and keeping orbit relationships rather than acts. Independence may be performed, but the center of your language has not moved from the space between you and another."],
    ["依存か自立かという粗末な二択では足りません。貴方の言葉にあるのは、結びつきを選びながら、その意味を決める権利は渡したくないという二重の欲です。", "The crude choice between dependence and independence is insufficient. Your words hold a double desire: to choose the bond, yet surrender no right to define its meaning."],
    ["誰かを必要とすることより、必要とする自分をどう定義されるかに警戒が見えます。鎖を嫌うのではなく、鍵の持ち主を選びたい。随分と律儀な支配欲ですね。", "You are less wary of needing someone than of how that need defines you. You do not hate the chain; you want to choose who holds the key. A remarkably conscientious appetite for control."],
    ["諦めるという語を使いながら、関係そのものは捨てていません。形を変え、名前を替え、選択したという事実まで結び目にして残しています。", "Though you use the word surrender, you have not abandoned the bond itself. You change its form and name, preserving even the fact of having chosen as another knot."],
    ["貴方が恐れているのは孤立ではなく、関係の意味を他者に決められること――今回の記録は、そう残します。", "What you fear is not isolation, but allowing another to define the meaning of the bond. That is what this record retains."],
    ["鎖は拒んでいない。ただし、誰の手に端を持たせるかは譲らない。見事に面倒な構造です。", "You do not refuse the chain. You simply will not yield the choice of who holds its end. A splendidly difficult structure."],
    ["関係を選ぶ者は弱いのではない。選んだ関係の責任から逃げたときだけ、無様になるのです。", "Choosing a bond is not weakness. It becomes wretched only when you flee responsibility for the bond you chose."],
    ["逃げ道には、よく整った文法がある。", "Every escape has well-ordered grammar."],
    ["矛盾は欠陥ではない。隠した瞬間にだけ腐る。", "Contradiction is not a defect. It rots only when concealed."],
    ["貴方の前提は、回答より先に自白した。", "Your premise confessed before your answer did."],
    ["回答の前半で立てた基準を、後半の例外が静かに食い潰しています。破綻ではありません。結論を守るために前提を可動式にした痕跡です。", "An exception in the latter half quietly devours the standard established in the first. This is not collapse, but a trace of making the premise movable to preserve the conclusion."],
    ["貴方は断定を避けながら、断定しないことだけは一貫して選びました。曖昧さを中立と呼ぶには、配置が少々器用すぎます。", "While avoiding assertion, you consistently chose only not to assert. The placement is too skillful for ambiguity to be called neutral."],
    ["理由を説明する文の中へ、責任の所在を移す語彙が混ざっています。決めていないように見せながら、免責される方向だけは選んでいる。", "Your explanation contains language that moves the location of responsibility. You appear not to decide, while selecting only the direction in which you are absolved."],
    ["矛盾そのものは愚かさではありません。異なる欲を同時に持つのは普通です。ただ、それを状況や他者のせいにして接着すると、論理は急に安物の家具になります。", "Contradiction itself is not foolishness. Holding different desires at once is ordinary. But once they are glued together with blame for circumstance or others, the logic becomes cheap furniture."],
    ["条件を増やすほど精密になるとは限りません。今回の文章では、条件の一部が説明ではなく退路として働いています。出口に額縁を付けても、出口は出口です。", "More conditions do not always create greater precision. Here, some conditions function as exits rather than explanations. A framed exit remains an exit."],
    ["答えを拒否した箇所にも選択は残ります。語らない自由と、語らなかった結果は別物です。前者だけを所有し、後者を捨てる構文が観測されました。", "Choice remains even where an answer is refused. The freedom not to speak and the consequence of silence are different things. We observed a grammar that owns the first and discards the second."],
    ["貴方の矛盾は消す必要がない。せめて、自分で設置した逃げ道くらいは覚えておきなさい。", "Your contradictions need not be erased. At least remember the exits you installed yourself."],
    ["結論より前提が雄弁でした。次は回答ではなく、その前提を誰から借りたのか考えることです。", "The premise was more eloquent than the conclusion. Next, consider not the answer but from whom you borrowed that premise."],
    ["論理は貴方を無罪にしません。ただ、どこで自分を庇ったかだけは正確に記録します。", "Logic will not acquit you. It will only record precisely where you protected yourself."],
    ["最も濃い痕跡は自己引受です。貴方は判断の主語を自分へ戻し、結果を誰かの手荷物にする語り方を比較的避けました。", "The clearest trace is agency. You returned judgment to yourself and largely avoided making the result someone else's burden."],
    ["自己引受の痕跡が優位です。結果を好むかどうかと、選択した者が誰かを分けて書いています。", "Agency is the dominant trace. You distinguish whether the result is liked from who made the choice."],
    ["最も濃い痕跡は欲望露出です。不都合な感情を清潔な概念だけで覆わず、言葉の表面まで上げています。", "The clearest trace is exposed desire. You did not cover inconvenient feeling with clean concepts alone; you brought it to the surface of your words."],
    ["欲望露出の痕跡が優位です。肯定か拒絶かにかかわらず、自分の中にあるものを対象として差し出しました。", "Exposure is the dominant trace. Whether affirmed or refused, what lies within you was offered as an object of observation."],
    ["最も濃い痕跡は関係重力です。判断基準の中心に、他者との距離、所有、喪失のいずれかが置かれています。", "The clearest trace is relational gravity. Distance from another, possession, or loss occupies the center of your judgment."],
    ["関係重力の痕跡が優位です。単独の価値より、誰と何が結ばれたまま残るかが文章を動かしました。", "Relational gravity is the dominant trace. Your language was moved less by solitary value than by who and what would remain bound."],
    ["最も濃い痕跡は論理亀裂です。同じ回答の内部で前提が反転し、例外が結論を保護しています。", "The clearest trace is structural fracture. Within the same answer, the premise reverses and exceptions protect the conclusion."],
    ["論理亀裂の痕跡が優位です。曖昧さ、条件、否定が説明と退路の両方に使われました。", "Structural fracture is the dominant trace. Ambiguity, conditions, and denial served as both explanation and escape."],

    // Counter-observation records
    ["貴方は結論そのものより、それが成立する前提へ刃を入れました。観測を拒むだけでなく、観測装置の目盛りを疑った構文です。", "You cut into the premise that sustains the conclusion rather than the conclusion itself. This grammar refuses not only the observation, but the markings on the instrument."],
    ["反証は結果の否定ではなく、結果を支えた基準へ向けられています。少なくとも、嫌悪を論拠の代用品にはしなかったようですね。", "Your counter-evidence addresses the standard supporting the result rather than merely denying it. At least disgust was not used as a substitute for an argument."],
    ["その前提を退けたあと、代わりに何を判断基準として置きますか。", "After rejecting that premise, what will you place in its stead as a standard of judgment?"],
    ["借り物ではない前提だと証明するために、貴方は何を引き受けますか。", "What will you assume responsibility for to prove that the replacement premise is your own?"],
    ["反証によって、判断の主語は観測者から貴方自身へ戻りました。誤読を指摘すると同時に、自分で定義する権利を取り戻そうとしています。", "Through your objection, the subject of judgment returned from the observer to you. In naming a misreading, you also attempt to reclaim the right to define yourself."],
    ["貴方は観測結果に別の自己定義を差し出しました。否定より選択が強く現れたため、これは責任を伴う反証として残ります。", "You offered the result another definition of self. Choice appeared more strongly than denial, so this remains as counter-evidence carrying responsibility."],
    ["自分で定義する権利を持つなら、その定義が生む結果も同じように所有しますか。", "If you claim the right to define yourself, will you also own the consequences that definition creates?"],
    ["誰にも同意されなくても、その自己定義を判断基準として使い続けますか。", "Would you continue using that self-definition as a standard even if no one agreed with it?"],
    ["貴方は観測を誤りと断じる代わりに、成立条件を追加しました。精密化にも見えますが、条件は退路としてもよく働きます。", "Rather than declare the observation wrong, you added conditions under which it would hold. This resembles precision, though conditions also serve well as exits."],
    ["反証の中心は例外条件でした。結論を壊したのではなく、適用範囲を狭めて自分を外へ出した構造です。", "The center of your objection was an exception. You did not break the conclusion; you narrowed its reach until you stood outside it."],
    ["追加した条件をすべて外したとき、それでも同じ結論を拒めますか。", "If every condition you added were removed, would you still refuse the same conclusion?"],
    ["その例外を他者にも同じ基準で認めるなら、何が残りますか。", "If you grant others the same exception by the same standard, what remains?"],
    ["誤りの原因は、観測者、質問、状況の側へ移されました。移動が妥当かどうかより、貴方自身の基準がまだ空席であることが残ります。", "The source of error was moved to the observer, the question, or the circumstance. Whether that move is justified matters less than the vacancy where your own standard should stand."],
    ["反証は外側の不備をよく指摘しました。しかし、外側を取り除いたあとに残る貴方自身の説明は、まだ提出されていません。", "Your objection identifies external faults well. Yet the account of yourself that remains after those faults are removed has not been submitted."],
    ["観測者の誤読を取り除いたあと、貴方の文章にはどんな自己説明が残りますか。", "Once the observer's misreading is removed, what account of yourself remains in your words?"],
    ["外側に原因を置かずに語るなら、同じ反証をどの主語で書き直しますか。", "Without placing the cause outside yourself, with what subject would you rewrite the same objection?"],
    ["貴方は語の定義を組み替え、観測と異なる枠を置きました。逃避とは限りませんが、新しい額縁もまた作品の一部です。", "You rearranged definitions and placed a frame different from the observation. This is not necessarily escape, but the new frame is also part of the work."],
    ["否定より言い換えが優位でした。同じ材料へ別の名前を与え、その名称によって結論の位置を動かしています。", "Reframing outweighed denial. By giving the same material another name, you moved the position of the conclusion."],
    ["その新しい定義を他者へ適用されたときも、同じ意味として受け入れますか。", "If that new definition were applied to you by another, would you accept it with the same meaning?"],
    ["名前を再び外したとき、二つの解釈を分ける具体的な差は何ですか。", "Once the names are removed again, what concrete difference separates the two readings?"],
    ["貴方は観測の一部を認め、境界線だけを争いました。全面否定より精度は高い。ただし、認めた箇所はもう外へ捨てられません。", "You accepted part of the observation and disputed only its boundary. This is more precise than total denial. Yet what you admitted can no longer be discarded."],
    ["反証の内部に承認が残っています。異議は結果を消さず、どこまでなら所有できるかという線引きへ変わりました。", "Recognition remains inside the objection. It does not erase the result; it becomes a boundary around how much of it you can own."],
    ["認めた部分だけを残すなら、それは今後どの選択に責任を持たせますか。", "If only the admitted portion remains, which future choice will it make responsible?"],
    ["拒んだ境界と受け入れた境界を分けた基準は、本当に同じものですか。", "Is the standard separating the refused boundary from the accepted one truly the same?"],
    ["誤っているという宣言は明瞭でした。しかし、代わりの前提はまだ空白です。否定は扉を閉じますが、部屋の所在までは示しません。", "The declaration of error was clear. The replacement premise remains blank. Denial closes a door, but does not reveal where the room is."],
    ["反発は記録されましたが、反証を支える基準は十分に置かれていません。拒絶の強度を、説明の精度と取り違えないことです。", "Resistance was recorded, but the standard supporting it was not sufficiently placed. Do not mistake the force of refusal for precision of explanation."],
    ["否定の言葉を一度外し、代わりの説明だけで同じ主張を組み立てられますか。", "Can you remove the language of denial and build the same claim from the replacement explanation alone?"],
    ["誤りだと示すために必要な基準を、一文で置くなら何ですか。", "In one sentence, what standard would be required to demonstrate the error?"],
  ];

  const lookup = new Map();
  pairs.forEach(([ja, en]) => {
    if (!lookup.has(ja)) lookup.set(ja, { ja, en });
    lookup.set(en, { ja, en });
  });

  const nodeRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const translatableAttributes = ["aria-label", "alt", "title", "placeholder", "content"];
  const ignoredElements = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE"]);

  function readStoredLanguage() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (supportedLanguages.has(stored)) return stored;
    } catch {
      // The browser language remains available when storage is blocked.
    }
    return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
  }

  let currentLanguage = readStoredLanguage();

  function patternTranslation(source, language) {
    let match = source.match(/^Observation (\d{2}) を拡大する$/);
    if (match) return language === "ja" ? `観測 ${match[1]} を拡大する` : `Expand Observation ${match[1]}`;

    match = source.match(/^(?:Observation|観測) (\d{2})$/);
    if (match) return language === "ja" ? `観測 ${match[1]}` : `Observation ${match[1]}`;

    match = source.match(/^Track (\d{2})$/);
    if (match) return language === "ja" ? `音源 ${match[1]}` : source;

    match = source.match(/^(.+) selected artwork (\d{2})$/i);
    if (match) return language === "ja" ? `${match[1]} 選定作品 ${match[2]}` : `${match[1]} selected artwork ${match[2]}`;

    match = source.match(/^(.+) \/ Selected archive$/);
    if (match) return language === "ja" ? `${match[1]} / 選定記録` : source;

    match = source.match(/^Legibility (.+)$/);
    if (match) return language === "ja" ? `判読度 ${match[1]}` : source;

    match = source.match(/^(\d{2}) \/ (Entrance|Threshold|Interrogation|Sealing|Record|Counter-Observation|Counter Record)$/);
    if (match) {
      const labels = {
        Entrance: "入口",
        Threshold: "敷居",
        Interrogation: "問い",
        Sealing: "封印",
        Record: "記録",
        "Counter-Observation": "反対観測",
        "Counter Record": "第二記録"
      };
      return language === "ja" ? `${match[1]} / ${labels[match[2]]}` : source;
    }

    return null;
  }

  function translate(source, language = currentLanguage) {
    if (!source) return source;
    const direct = lookup.get(source);
    if (direct) return direct[language];

    const patterned = patternTranslation(source, language);
    if (patterned !== null) return patterned;

    let output = source;
    pairs.forEach(([ja, en]) => {
      const from = language === "ja" ? en : ja;
      const to = language === "ja" ? ja : en;
      if (from.length >= 8 && output.includes(from)) output = output.split(from).join(to);
    });
    return output;
  }

  function splitWhitespace(value) {
    const leading = value.match(/^\s*/)?.[0] || "";
    const trailing = value.match(/\s*$/)?.[0] || "";
    return { leading, trailing, core: value.slice(leading.length, value.length - trailing.length) };
  }

  function translateTextNode(node) {
    if (!node.parentElement || ignoredElements.has(node.parentElement.tagName)) return;
    if (node.parentElement.closest("[data-i18n-ignore]")) return;

    const parts = splitWhitespace(node.nodeValue || "");
    if (!parts.core) return;

    let record = nodeRecords.get(node);
    if (!record || parts.core !== record.rendered) {
      record = { source: parts.core, leading: parts.leading, trailing: parts.trailing, rendered: parts.core };
      nodeRecords.set(node, record);
    }

    const rendered = translate(record.source);
    record.rendered = rendered;
    const nextValue = `${record.leading}${rendered}${record.trailing}`;
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  }

  function translateAttributes(element) {
    if (element.closest("[data-i18n-ignore]")) return;
    let records = attributeRecords.get(element);
    if (!records) {
      records = new Map();
      attributeRecords.set(element, records);
    }

    translatableAttributes.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      if (name === "content" && element.tagName !== "META") return;

      const value = element.getAttribute(name);
      let record = records.get(name);
      if (!record || value !== record.rendered) {
        record = { source: value, rendered: value };
        records.set(name, record);
      }

      const rendered = translate(record.source);
      record.rendered = rendered;
      if (value !== rendered) element.setAttribute(name, rendered);
    });
  }

  function translateTree(root = document.documentElement) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (!(root instanceof Element) && root !== document) return;
    if (root instanceof Element) translateAttributes(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttributes(node);
      node = walker.nextNode();
    }
  }

  function updateSwitch() {
    document.querySelectorAll("[data-language-option]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageOption === currentLanguage));
    });
  }

  function setLanguage(language, { persist = true } = {}) {
    if (!supportedLanguages.has(language)) return;
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, language);
      } catch {
        // The active page still changes language when storage is unavailable.
      }
    }

    translateTree();
    updateSwitch();
    window.dispatchEvent(new CustomEvent("gireivel:languagechange", { detail: { language } }));
  }

  function mountSwitch() {
    if (document.querySelector("[data-language-switch]")) return;
    const control = document.createElement("div");
    control.className = "language-switch";
    if (document.querySelector(".map-toggle")) control.classList.add("language-switch--manor");
    control.dataset.languageSwitch = "";
    control.dataset.i18nIgnore = "";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "Language / 言語");
    control.innerHTML = `
      <button class="language-option" type="button" data-language-option="ja" aria-label="日本語で表示">JP</button>
      <button class="language-option" type="button" data-language-option="en" aria-label="Display in English">EN</button>
    `;
    control.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language-option]");
      if (button) setLanguage(button.dataset.languageOption);
    });
    document.body.append(control);
    updateSwitch();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") translateTextNode(mutation.target);
      if (mutation.type === "attributes") translateAttributes(mutation.target);
      mutation.addedNodes.forEach((node) => translateTree(node));
    });
  });

  window.GireivelI18n = {
    get language() {
      return currentLanguage;
    },
    setLanguage,
    translate,
    refresh: translateTree
  };

  document.documentElement.lang = currentLanguage;
  document.documentElement.dataset.language = currentLanguage;
  mountSwitch();
  translateTree();
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatableAttributes
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && supportedLanguages.has(event.newValue)) {
      setLanguage(event.newValue, { persist: false });
    }
  });
})();

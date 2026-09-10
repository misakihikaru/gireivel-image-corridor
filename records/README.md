# 痕跡録 / TRACES

Xに公開済みのギレイヴェル作品を辿る、静的な記録室。公開先は https://gireivel.com/records/ 。

- 文章・画像、四人、本文や公開用の画の意図、投稿日（JSTの開始日・終了日）を組み合わせて絞り込む。
- 新しい順・古い順。検索条件はURLに残る。`?entry=Xの投稿ID` で一件を直接開く。
- 名前は記録情報として表示する。画像の添え言葉と公開用の画の意図を掲載する。
- 月別の内容ハッシュ付きJSON。絞り込みに関係する月を順次読み、24件ずつ表示する。画像は遅延読み込み。
- 読み込み失敗は再試行可能。モデルの文章はHTMLとして挿入しない。

## 室内の意匠

館の鏡の画と縦書きの表題を、高さ約248px（スマートフォンは224px）の小さなヘッダーに置き、記録本文を中心にする。黒、象牙色、鈍い金、深い赤を用い、投稿本文は20px、タブレットは18px、スマートフォンは17pxで組む。名前は日時と同じ記録情報として控えめに表示し、画像と詳細画面は細い額縁で囲む。

形式の切り替えは常に表示し、言葉・名前・日付の検索は開閉できる。検索条件付きURLでは該当の入力欄を自動的に開く。スマートフォンでは記録情報を本文の上に移し、入力文字は16pxを保つ。装飾は既存の館の画像を再利用し、アニメーションや追加の外部依存はない。

## 公開データ

`data/manifest.json` が月別ファイルを指す。月別ファイル・画像は内容ハッシュ付きで追記し、最後にmanifestを切り替える。CDNのキャッシュが更新途中でも旧manifestから旧データを参照できる。

公開フィールドは `id, publishedAt, persona, medium, text, publicNote, alt, image, generatedByAI` と、新規作品の `sourceLanguage, textJa, publicNoteJa, altJa` のみ。`publishedAt` はXの投稿IDが持つ実際の公開時刻。制作開始時刻や試作日ではない。

非公開の `note, question, imagePrompt` とDB、認証情報は公開しない。過去の記録に `publicNote` がない場合は空欄とし、非公開メモから補完しない。

## 検証

```powershell
node --test records/tests/core.test.mjs
$env:GIREIVEL_TEST_DEPS='<jsdomを含む検証用node_modules>'
node --test records/tests/interaction.test.mjs
```

DOM試験は1000件の固定データで実施する。試験データを公開データへ追加しない。

## 英語原文と日本語訳

新規制作は英語原文をXへ送り、サイトでは保存されたtextJa・publicNoteJaを原文の下に併記する。sourceLanguageはen。altJaも公開用翻訳として保存する。翻訳は全体のJP / EN切り替えで置換せず、両言語で常に表示する。日本語訳も検索対象。旧記録の原文を変更したり、日本語の旧記録を英語と表示したりしない。

# 痕跡録 / TRACES

Xに公開済みのギレイヴェル作品を辿る、静的な記録室。公開先は https://gireivel.com/records/ 。

- 文章・画像、四人、本文や公開用の画の意図、投稿日（JSTの開始日・終了日）を組み合わせて絞り込む。
- 新しい順・古い順。検索条件はURLに残る。`?entry=Xの投稿ID` で一件を直接開く。
- 名前は記録情報として表示する。画像の添え言葉と公開用の画の意図を掲載する。
- 月別の内容ハッシュ付きJSON。絞り込みに関係する月を順次読み、24件ずつ表示する。画像は遅延読み込み。
- 読み込み失敗は再試行可能。モデルの文章はHTMLとして挿入しない。

## 公開データ

`data/manifest.json` が月別ファイルを指す。月別ファイル・画像は内容ハッシュ付きで追記し、最後にmanifestを切り替える。CDNのキャッシュが更新途中でも旧manifestから旧データを参照できる。

公開フィールドは `id, publishedAt, persona, medium, text, publicNote, alt, image, generatedByAI` のみ。`publishedAt` はXの投稿IDが持つ実際の公開時刻。制作開始時刻や試作日ではない。

非公開の `note, question, imagePrompt` とDB、認証情報は公開しない。過去の記録に `publicNote` がない場合は空欄とし、非公開メモから補完しない。

## 検証

```powershell
node --test records/tests/core.test.mjs
$env:GIREIVEL_TEST_DEPS='<jsdomを含む検証用node_modules>'
node --test records/tests/interaction.test.mjs
```

DOM試験は1000件の固定データで実施する。試験データを公開データへ追加しない。

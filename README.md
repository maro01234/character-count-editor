# 文字数カウントエディター

CharacterCountEditor.java の Swing アプリを、ブラウザで使える日本語ウェブアプリに移植しました。HTML / CSS / JavaScriptのみで動作し、Render Static Siteに対応しています。

## 機能

- 入力と同時にUnicodeコードポイント単位で文字数を更新（元Javaの codePointCount と同じ数え方）
- 空白・改行を除いた文字数、行数の表示
- 新規作成、UTF-8テキストの読み込み（最大10 MiB）、UTF-8ファイルのダウンロード
- 未保存の変更を破棄する前の確認、閉じる際のブラウザ標準警告
- Cmd / Ctrl + Sで保存、スマートフォンに対応

入力内容は外部へ送信せず、自動保存やアクセス解析も行いません。保存はブラウザのダウンロード機能です。保存先の選択・ダウンロードの完了はブラウザ側で確認してください。元アプリの「終了」はブラウザのタブを閉じる操作に相当します。

通常の絵文字は1文字、家族などの結合絵文字・結合文字は複数文字になります。ファイルのCRLF/CR改行はブラウザのtextareaによりLFへ統一され、改行は1文字で数えます。UTF-8のBOMは読み込み時に除きます。空白除外はJavaScriptのUnicode空白判定に従います。空文の行数は0、末尾改行の後の空行は1行に数えます。

## ローカル起動

プロジェクトのフォルダで実行します。

```sh
python3 -m http.server 10001 --bind 127.0.0.1 --directory public
```

http://localhost:10001 を開きます。Javaのインストールは不要です。

## テスト

```sh
node --test tests/counter.test.js
```

## Renderへのデプロイ

このフォルダの内容を専用GitHubリポジトリのルートに置きます。

Renderで New → Static Site を選択し、リポジトリを接続します。

- Build Command: `node --test tests/counter.test.js`
- Publish Directory: `public`
- Branch: `main`

Blueprintとして `render.yaml` を読み込むこともできます。ヘッダー設定はBlueprintに定義しています。CLIで直接サービスを作成する場合は別途適用してください。

公式資料: [Static Sites](https://render.com/docs/static-sites)、[Blueprint仕様](https://render.com/docs/blueprint-spec)

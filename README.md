# 水谷眼科診療所 患者様アンケート

水谷眼科診療所の診療・サービス改善に使用する、匿名の患者様アンケートです。スマートフォン（375〜430px）を中心に、文字の読みやすさと押しやすさを重視しています。氏名・電話番号・メールアドレス・住所は取得しません。

Google Apps Script（GAS）のURLが未設定でも、フォーム入力、必須チェック、スコア計算、サンクス画面までローカルで確認できます。Google口コミ案内は、待ち時間とスタッフ対応の両方が9点以上の場合だけ表示します。

## 質問内容

1. 性別（任意・単一選択）
2. 年代（任意・単一選択）
3. 待ち時間の満足度（必須・1〜10）
4. スタッフ対応の満足度（必須・1〜10）
5. 当院を選んだ理由（任意・複数選択。「その他」入力対応）
6. ご意見・ご要望（任意・最大1000文字）

Q3とQ4から合計スコアと平均スコアを計算し、回答と一緒に保存します。

## ローカル起動

Node.js 18.17以上（20 LTS推奨）とnpmを用意し、このディレクトリで次を実行します。

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。URLを未設定のままでも回答完了まで確認できます。

検証コマンド:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## 環境変数

`.env.example` を `.env.local` にコピーし、必要なURLを設定します。`.env.local` はGit管理対象外です。

```env
NEXT_PUBLIC_GAS_URL=
NEXT_PUBLIC_GOOGLE_REVIEW_URL=
```

- `NEXT_PUBLIC_GAS_URL`: GASをウェブアプリとしてデプロイした際に発行される `/exec` URL
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`: 水谷眼科診療所の正しいGoogle口コミ投稿先URL

`NEXT_PUBLIC_GAS_URL` は初期状態では未設定です。口コミURLは環境変数を優先し、未設定時は水谷眼科診療所のGoogle口コミページを使用します。変更後は開発サーバーを再起動します。

## Google Sheets・GAS設定

1. 回答保存先にする新しいGoogleスプレッドシートを作ります。
2. スプレッドシートの「拡張機能」→「Apps Script」を開きます。
3. エディタのコードを [gas/Code.gs](gas/Code.gs) の内容に置き換えて保存します。
4. 「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」を選びます。
5. 「次のユーザーとして実行」は自分、「アクセスできるユーザー」は回答者が利用できる公開範囲に設定します。
6. デプロイ後に発行されたURLを `NEXT_PUBLIC_GAS_URL` に設定します。
7. テスト回答を1件送り、次の列順で保存されることを確認します。

`回答日時 / 性別 / 年代 / 待ち時間満足度 / スタッフ対応満足度 / 合計スコア / 平均スコア / 当院を選んだ理由 / その他理由 / 自由記述`

空のシートでは、最初の回答時にヘッダーが自動作成されます。GASコードを更新した場合は、新しいバージョンとして再デプロイしてください。

## Google口コミURL設定

環境ごとに別の口コミ先を使う場合は、`NEXT_PUBLIC_GOOGLE_REVIEW_URL` に設定します。未設定時は、コードに定義した水谷眼科診療所のGoogle口コミ先を使用します。

自由記述がある場合、回答者は自分で入力した文章をコピーしてからGoogle口コミ画面へ移動できます。投稿内容や星の数はGoogleの画面で本人が自由に編集します。

## Vercel公開方法

1. このプロジェクトをGitHubリポジトリへ登録します（`.env.local` は登録しません）。
2. Vercelで「Add New Project」からリポジトリを読み込みます。
3. Framework PresetがNext.js、Build Commandが `npm run build` であることを確認します。
4. Project SettingsのEnvironment Variablesに、確定済みの `NEXT_PUBLIC_GAS_URL` と `NEXT_PUBLIC_GOOGLE_REVIEW_URL` を追加します。
5. Deployを実行し、スマートフォン実機で回答保存と口コミリンクを確認します。

環境変数を変更したときは再デプロイが必要です。GAS側のウェブアプリ公開範囲も本番利用前に確認してください。

## 今後の変更方法

- 医院情報・外部URL: `data/config.ts` と環境変数
- 質問の選択肢・フォーム型: `data/questions.ts`
- validation・スコア・payload: `lib/survey.ts`
- フォーム画面: `app/page.tsx`
- 完了・口コミ画面: `app/thanks/page.tsx`
- 色・余白・スマートフォン表示: `app/globals.css`
- Sheetsの列・保存処理: `gas/Code.gs`

質問や保存項目を変更するときは、画面だけでなく `data/questions.ts`、`lib/survey.ts`、`gas/Code.gs`、テストを同時に更新してください。

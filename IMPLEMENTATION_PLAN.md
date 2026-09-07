# 水谷眼科診療所 患者様アンケート 実装計画

## 調査結果

- `CODEX_TASK.md` を本案件の最優先仕様とする。
- `sangrier-ques-system` から、Next.js App Router、GAS への `no-cors` 送信、送信中・通信エラー状態、`sessionStorage` を使ったサンクス画面への回答引き継ぎを参考にする。
- `kawaratani-clinic-questionnaire` から、スマートフォンで横一列に並ぶ 1〜10 の丸型評価UIとクリニック向けの簡潔な画面構成を参考にする。
- Google口コミ導線は、待ち時間とスタッフ対応がともに9点以上の回答者にだけ表示する。
- Builderの共通基盤仕様は将来構想も含むため、本案件では `CODEX_TASK.md` に指定された単院向け Next.js + GAS 構成を採用する。
- 公式サイトの清潔感と指定ブランドカラー `#5E969E` を基調に、白背景、十分な余白、大きな文字・タップ領域で構成する。

## 採用構成

- Next.js 14 / App Router
- React 18 / TypeScript
- Tailwind CSS
- Node標準テストランナー + TypeScript実行用 `tsx`
- Google Apps Script経由のGoogle Sheets保存
- `sessionStorage` に合計スコアと自由記述を一時保存
- npm（参考実装と整合）

Google口コミURLとGAS URLは、それぞれ `NEXT_PUBLIC_GOOGLE_REVIEW_URL` と `NEXT_PUBLIC_GAS_URL` からのみ取得し、未設定時もローカル完了フローを確認できるようにする。

## ファイル構成

```text
app/
  globals.css
  layout.tsx
  page.tsx
  thanks/page.tsx
components/
  ClinicMark.tsx
  QuestionCard.tsx
  ScoreSelector.tsx
data/
  config.ts
  questions.ts
lib/
  survey.ts
gas/
  Code.gs
tests/
  survey.test.ts
.env.example
.gitignore
package.json
README.md
```

## 実装手順

1. Next.js / Tailwind / TypeScriptの基本構成を作成する。
2. 共通設定、質問定義、validation・スコア・payload生成の純粋関数を実装する。
3. 6問のフォーム、10段階評価、複数選択と「その他」、1000文字textarea、エラー項目へのフォーカスを実装する。
4. 二重送信防止、GAS送信、未設定時のローカルモード、通信エラー再試行を実装する。
5. サンクス画面、低評価時の改善メッセージ、URL設定時のみ全回答者へ表示する口コミCTAを実装する。
6. Google Sheets用GAS、環境変数例、READMEを作成する。
7. 依存関係を導入し、unit test、lint、TypeScript、buildを実行する。
8. ローカルサーバーで `/` と `/thanks` の応答を確認し、可能ならブラウザで375 / 390 / 430pxを確認する。
9. `git status` と `git diff --check` を確認する。

## テスト項目

- Q3・Q4未回答時の日本語validationと最初のエラーへの誘導
- Q3・Q4で1〜10を選択可能
- Q5の複数選択と「その他」入力欄の表示・値の保持
- 自由記述の最大1000文字と文字数表示
- 合計・平均スコア（整数・小数）の計算
- 指定順序と内容のGAS payload
- GAS URL未設定時のローカル完了
- GAS URL設定時の送信と通信エラー時の再試行
- 送信中表示と二重送信防止
- `/thanks` 遷移と低評価メッセージ
- Google口コミCTAは、待ち時間とスタッフ対応がともに9点以上の場合だけ表示
- 375px / 390px / 430pxで横スクロールなし
- lint、TypeScript、unit test、production build

# CLAUDE.md

このファイルは、本リポジトリで作業する Claude Code (claude.ai/code) 向けのガイダンス。

## プロジェクト概要

- マネーフォワード クラウド請求書API v3 用の TypeScript クライアントライブラリ
- **Google Apps Script (GAS) ライブラリ**として配布(スタンドアロンアプリ・サーバーではない)
- 利用者は自分の GAS プロジェクト(スプレッドシート紐付け)にスクリプトIDで追加する
- 利用ドキュメント: `docs/reference.md`

## コマンド

- `npm run lint` — ライセンスヘッダー付与(`license-check-and-add`)→ `eslint --fix`。ファイルを書き換える(read-onlyではない)
- `npm run lint:fix` — `eslint --fix` のみ(ライセンスヘッダー付与なし)
- `npm run lint:ci` — `eslint`(`--fix` なし)。CI が使用する
- `npm run format` — `prettier --write src/ test/`
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — `vitest run`。coverage 常時有効(v8 provider、text + html レポート)。単一ファイル実行: `npx vitest run test/lib/date-util.test.ts`
- `npm run build` — clean → Rollup バンドル → `dist/` に出力。`package.json` の `main` は `build/index.js` を指しているが実際の出力先は `dist/`(既知の不整合、黙って直さない)
- `npm run deploy` — lint + test + build 後、`.clasp-dev.json` を使い **dev** GAS プロジェクトへ `clasp push -f`。Claude が自律実行してよい
- `npm run deploy:prod` — 同様に `.clasp-prod.json` を使い **本番** GAS プロジェクトへ `clasp push`(`-f` なし)。**実行前に必ずユーザーに確認する**(不可逆な本番デプロイ)
- deploy 系コマンドは `.clasp-dev.json` / `.clasp-prod.json`(gitignore対象、リポジトリ外)とローカルの `clasp login` セッションが必要
- pre-commit hook(`.husky/pre-commit`): `lint-staged`(eslint --fix + prettier --write + `src/**/*.ts` は `vitest related --run`)→ `tsc --noEmit`
- CI(`.github/workflows/ci.yml`): push・PR で `npm ci` → `typecheck` → `lint:ci` → `test` を実行(Node.js 24)

## ディレクトリ構成

- `src/index.ts` — GAS から直接呼ばれる公開API(`createClient`, `getPaymentStatus`, `getOrderStatus`, `mfCallback` など)
- `src/lib/` — 基盤処理: `mf-client.ts`(APIクライアント)/ `mf-oauth2.ts`(OAuth2フロー)/ `date-util.ts` / `text-link-util.ts`
- `src/service/` — MF請求書APIリソース単位のサービス(`billing-service.ts` / `quote-service.ts` / `partner-service.ts` / `item-service.ts` / `office-service.ts`)、いずれも `service-base.ts` を継承
- `src/@types/` — `lib/` / `service/` 各モジュールに1:1対応する `.d.ts` 宣言
- 外部GASライブラリ(`OAuth2` / apps-script-oauth2、`appsscript.json` で宣言)に依存するが npm 依存には現れない

## テスト

- `test/lib/date-util.test.ts` — `DateUtil` の単体テスト
- `test/factories/` — factory.ts ベースのテストデータ生成基盤(7ドメイン型・13ファクトリー)。規約詳細は `test/CLAUDE.md` / `test/factories/CLAUDE.md` 参照
- `src/service/*`・OAuthフロー・HTTPクライアントは未テスト。現状はスプレッドシート経由で実際のMF APIに対し手動検証している
- `src/service/*.ts` / `src/lib/*.ts` を変更する際は、可能な範囲で単体テストを追加する(`UrlFetchApp` / `PropertiesService` 等のGASグローバルはモックし、実APIは叩かない)。テストデータは `test/factories/` のファクトリー経由で生成する

## 開発規約

- コミットメッセージ: `{Prefix}: [{scope}] 日本語の説明`(例: `Add: [factories] テストファクトリー基盤を追加`, `Mod: [test] 既存テストの規約違反を修正`)。Conventional Commits(`feat:`/`fix:`)ではない。Prefix は `Add`/`Fix`/`Mod`/`Refactor`/`Del`/`Verup`/`Doc` のいずれか
- フォーマット: 2-space indent、シングルクォート、trailing comma(`es5`)、arrow関数の引数括弧は単一引数時省略(`arrowParens: avoid`)。ESLint flat config(`eslint.config.mjs`、ESLint v9 + typescript-eslint + eslint-plugin-n + prettier)と `.prettierrc.json` で強制
- Node.js バージョン: `>=24`(`.nvmrc` も `24`)
- ライセンスヘッダー: `src/**/*.ts`(および `.js`/`.mjs`)にのみ単一行の Copyright 表記を付与。`test/`・`CLAUDE.md`・ルート設定ファイル類は対象外(`license-config.json` 参照)

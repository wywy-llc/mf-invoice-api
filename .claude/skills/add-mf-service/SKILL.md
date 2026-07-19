---
name: add-mf-service
description: MoneyForward Cloud Invoice API v3 の新しいリソース(例: 新エンドポイント)をこのライブラリに追加する定型手順。既存の service 群(billing/quote/partner/item/office)と同じパターンで実装・型定義・公開APIへの配線を一括で行う。Triggers: 新しいAPIリソース追加, 新エンドポイント対応, service追加, MF API 新機能対応.
---

# MF API リソースの追加

`src/service/` 配下の既存 5 ファイル(`billing-service.ts` / `quote-service.ts` / `partner-service.ts` / `item-service.ts` / `office-service.ts`)は全て同一パターンで実装されている。新しい MF Invoice API リソースを追加する際は、以下 5 箇所を一貫して更新すること。`office-service.ts` が最小構成の参考実装。

## 手順

1. **`src/service/<resource>-service.ts` を作成**
   - `ServiceBase` を継承 (`import { ReqMethod, ServiceBase } from './service-base'`)
   - `baseUrl` は `ServiceBase.API_BASE_URL + '/<resource-path>'`
   - 各メソッドは `this.fetch(reqUrl, method, body?)` → `this.processResponse(res)` の形
   - 戻り値型は `MfInvoiceApi.<Xxx>` を参照 (実体は次の手順で定義する `.d.ts` 側)

2. **`src/@types/<resource>-service.d.ts` を作成**
   - `declare namespace MfInvoiceApi { interface <Xxx>Service extends ServiceBase { ... } }`
   - 手順1のクラスのプロパティ・メソッドシグネチャを 1:1 でミラーする
   - レスポンス型が新規なら同じ namespace 内(または `src/@types/mf-invoice-api.d.ts`)にデータ構造の `interface` を追加

3. **`src/lib/mf-client.ts` に配線**
   - `import { <Xxx>Service } from '../service/<resource>-service'` を追加
   - `MfClient` クラスに `public <resourceName>: <Xxx>Service;` プロパティを追加
   - コンストラクタで `this.<resourceName> = new <Xxx>Service(accessToken);` を追加

4. **`src/@types/mf-client.d.ts` に配線**
   - `MfClient` interface に同じ `<resourceName>: <Xxx>Service;` プロパティを追加(手順3と1:1対応)

5. **必要なら `src/index.ts` に GAS 公開関数を追加**
   - `MfClient` のメソッド呼び出しをラップするトップレベル関数のみ(既存の `getPaymentStatus` 等のパターンを参照)
   - 単純な CRUD のみで追加のラップが不要なら、この手順はスキップしてよい(利用者は `client.<resourceName>.xxx()` を直接呼べる)

6. **テスト追加**
   - `test/service/<resource>-service.test.ts` を作成し、`UrlFetchApp` 等の GAS グローバルをモックして `fetch`/`processResponse` の呼び出しを検証する(CLAUDE.md のテスト方針を参照)

7. **README 更新の要否を確認**
   - 新リソースが利用者向けの主要機能なら `README.md` の使用例セクションに追記を検討する(必須ではない)

## 注意

- OAuth スコープが新規に必要な場合、README に記載済みの「スコープ変更時は `logout()` が必要」という既知の制約が発生する。スコープ追加を伴う変更では README の該当セクションへの追記も検討する。
- `appsscript.json` の依存ライブラリ(`OAuth2`)は変更不要 — 新リソース追加はこのライブラリの改修範囲外。

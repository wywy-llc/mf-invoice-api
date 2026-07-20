# MfInvoiceApi 使い方(AIエージェント向け)

このファイルは `mf-invoice-api`(マネーフォワード クラウド請求書API v3 用 GAS クライアントライブラリ)を
**自分の GAS プロジェクトに追加して使う側**の利用者が、Claude Code / Codex 等のコーディングエージェントに
使い方を読み込ませるための配布物。自分の GAS プロジェクトのリポジトリにコピーして使う。

- Claude Code 利用者: プロジェクトの `CLAUDE.md` から `@AGENTS.md` で import する
- Codex / Cursor / Amp 等: `AGENTS.md` というファイル名のまま置けば自動で読み込まれる
- 型補完・型チェックも使いたい場合は同ディレクトリの `mf-invoice-api.d.ts` も一緒にコピーする

ライブラリ本体のソース: <https://github.com/wywy-llc/mf-invoice-api> / 詳細リファレンス: <https://github.com/wywy-llc/mf-invoice-api/blob/main/docs/reference.md>

## ライブラリの追加

準備を省略したい場合は[完成版スプレッドシート](https://docs.google.com/spreadsheets/d/1tVfW1rHVow5GjmiuqtIpmDNxXp0AisnbvQ6eCdCEAWE/copy)をコピーしてよい。

1. GAS エディタ > ライブラリの「＋」
2. スクリプトID `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4` を検索
3. 最新バージョンを選択して追加 → 名前空間 `MfInvoiceApi` が使えるようになる

Client ID / Client Secret は MFアプリポータルで発行し、GASのスクリプト プロパティ(`CLIENT_ID` / `CLIENT_SECRET`)に設定する。リダイレクトURIは `https://script.google.com/macros/d/{このGASのスクリプトID}/usercallback`。

## 初期設定(トリガー・シート作成、コピペ雛形)

`office`/`partners`/`items`/`billings`/`billingItems`/`quotes`/`quoteItems` の7シートを作成し、スプレッドシートを開いた時のメニューを登録する。列定義は各モデル(`Office`/`Partner`/`Item`/`Billing`/`BillingItem`/`Quote`/`QuoteItem`)のフィールド名(全列は `mf-invoice-api.d.ts` 参照)。

```javascript
function initialize() {
  const initTriggers = () => {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    for (const trigger of ScriptApp.getProjectTriggers()) {
      if (trigger.getHandlerFunction() === 'onOpen') ScriptApp.deleteTrigger(trigger);
    }
    ScriptApp.newTrigger('onOpen').forSpreadsheet(spreadsheet).onOpen().create();
  };
  const schemas = {
    office: ['id', 'name', 'zip', 'prefecture', 'address1', 'address2', 'tel', 'fax', 'office_type', 'office_code', 'registration_code', 'created_at', 'updated_at'],
    partners: ['id', 'code', 'name', 'name_kana', 'name_suffix', 'memo', 'created_at', 'updated_at', 'departments'],
    items: ['id', 'name', 'code', 'detail', 'unit', 'price', 'quantity', 'is_deduct_withholding_tax', 'excise', 'created_at', 'updated_at'],
    billings: ['id', 'pdf_url', 'partner_name', 'title', 'billing_date', 'due_date', 'payment_status', 'total_price', 'created_at', 'updated_at'],
    billingItems: ['id', 'name', 'code', 'detail', 'unit', 'price', 'quantity', 'excise', 'created_at', 'updated_at', 'billing_id'],
    quotes: ['id', 'pdf_url', 'partner_name', 'title', 'quote_date', 'expired_date', 'order_status', 'total_price', 'created_at', 'updated_at'],
    quoteItems: ['id', 'name', 'code', 'detail', 'unit', 'price', 'quantity', 'excise', 'created_at', 'updated_at', 'quote_id'],
  };
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  for (const name of Object.keys(schemas)) {
    let sheet = spreadsheet.getSheetByName(name);
    if (sheet) spreadsheet.deleteSheet(sheet);
    sheet = spreadsheet.insertSheet(name);
    const attrs = schemas[name];
    sheet.getRange(1, 1, 1, attrs.length).setBackground('#bdbdbd').setValues([attrs]);
  }
  initTriggers();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('MF請求書API連携').addItem('認証処理を開始する', 'showMfApiAuthDialog').addToUi();
}
```

`billings`/`quotes`/`billingItems`/`quoteItems` は上記では代表列のみ抜粋(全 `excise_price_of_*`/`subtotal_*` 系列は `Billing`/`Quote` interface 参照)。`initialize` 実行 → スプレッドシート再読み込みで「MF請求書API連携」メニューが表示される。

## 認証まわりの定型コード(コピペ雛形)

これらの関数(`getMfCredentials_` / `getMfClient_` など)は**利用者側のプロジェクトに書く**コード。名前空間 `MfInvoiceApi` はライブラリ側。

```javascript
/**
 * MF認証情報を取得します。
 */
function getMfCredentials_() {
  const scriptProps = PropertiesService.getScriptProperties();
  const clientId = scriptProps.getProperty('CLIENT_ID');
  if (!clientId) {
    throw new Error('CLIENT_IDが設定されていません。');
  }
  const clientSecret = scriptProps.getProperty('CLIENT_SECRET');
  if (!clientSecret) {
    throw new Error('CLIENT_SECRETが設定されていません。');
  }
  return { clientId, clientSecret };
}

/**
 * MF請求書API認証ダイアログを表示します。
 */
function showMfApiAuthDialog() {
  const credentials = getMfCredentials_();
  MfInvoiceApi.showMfApiAuthDialog(credentials.clientId, credentials.clientSecret);
}

/**
 * MF認証のコールバック関数です。
 * 関数名は mfCallback で固定(ライブラリ内部の setCallbackFunction('mfCallback') が
 * この名前を直接参照するため、リネームすると認証コールバックが届かない)。
 * @param request
 */
function mfCallback(request) {
  const credentials = getMfCredentials_();
  return MfInvoiceApi.mfCallback(request, credentials.clientId, credentials.clientSecret);
}

/**
 * MF請求書APIクライアントを生成します。
 * @returns {MfInvoiceApi.MfClient}
 */
function getMfClient_() {
  const credentials = getMfCredentials_();
  return MfInvoiceApi.createClient(credentials.clientId, credentials.clientSecret);
}

/**
 * 保存済みトークンを破棄します(ライブラリ更新でスコープが増えた場合の再認可に使用)。
 */
function logout() {
  const credentials = getMfCredentials_();
  MfInvoiceApi.logout(credentials.clientId, credentials.clientSecret);
}
```

**注意(再認可)**: ライブラリ更新で要求スコープが増えても、保存済みトークンは自動で無効化されない(`apps-script-oauth2` の `hasAccess()` は有効期限のみ確認)。スコープ変更後は上記 `logout()` を実行してから再認証すること。要求スコープは `mfc/invoice/data.write mfc/invoice/data.read`。

## トップレベル関数(`MfInvoiceApi.xxx`)

| 関数 | シグネチャ | 用途 |
|---|---|---|
| `createClient` | `(clientId: string, clientSecret: string): MfClient` | APIクライアント生成(認証必須、未認証はthrow) |
| `showMfApiAuthDialog` | `(clientId: string, clientSecret: string): void` | 認証ダイアログ表示 |
| `mfCallback` | `(request: any, clientId: string, clientSecret: string): HtmlOutput` | OAuth2コールバック処理 |
| `logout` | `(clientId: string, clientSecret: string): void` | 保存済みトークン破棄 |
| `getDateUtil` | `(baseDate: Date): DateUtil` | 日付ユーティリティ生成 |
| `getPaymentStatus` | `(status: string): string` | 入金ステータス名 → 数値文字列 |
| `getOrderStatus` | `(status: string): string` | 受注ステータス名 → 数値文字列 |
| `createMfAuthUrl` | `(clientId: string, clientSecret: string): string` | 認証URL取得(通常は `showMfApiAuthDialog` 経由で十分) |
| `getRedirectUri` | `(): string` | このGASのリダイレクトURI取得 |

`getMfClient_().<service>.<method>(...)` の形で6サービスにアクセスする。

## サービス早見表(`MfClient` の各プロパティ)

| プロパティ | サービス | 主なメソッド |
|---|---|---|
| `billings` | 請求書API | `getBillings(from, to, query?, page?, perPage?, rangeKey?)` / `createNew(billingReqBody)` / `getBilling(id)` / `updateBilling(id, body)` / `updatePaymentStatus(id, status)` / `deleteBilling(id)` / `getBillingItems(id)` / `getBillingItem(id, itemId)` / `attachBillingItem(id, body)` / `deleteBillingItem(id, itemId)` / `applyToPostBilling(id)` / `cancelPostBilling(id)` |
| `quotes` | 見積書API | `getQuotes(from, to, query?, page?, perPage?, rangeKey?, filters?)` / `createNew(quoteReqBody)` / `getQuote(id)` / `updateQuote(id, body)` / `deleteQuote(id)` / `getQuoteItems(id)` / `getQuoteItem(id, itemId)` / `attachQuoteItem(id, body)` / `deleteQuoteItem(id, itemId)` / `applyToPostQuote(id)` / `cancelPostQuote(id)` / `updateOrderStatus(id, status)` / `convertQuoteToBilling(id)` |
| `partners` | 取引先API | `getPartners(page?, perPage?)` / `createNew(partnerReqBody)` / `getPartner(id)` / `updatePartner(id, body)` / `deletePartner(id)` / `getDepartments(id, page?, perPage?)` / `createDepartment(id, body)` / `getDepartment(id, deptId)` / `updateDepartment(id, deptId, body)` / `deleteDepartment(id, deptId)` / `getAll()`(全ページ走査) |
| `items` | 品目API | `getItems(page?, perPage?, name?, code?)` / `createNew(itemReqBody)` / `getItem(id)` / `deleteItem(id)` / `updateItem(id, body)`(部分更新可) |
| `office` | 事業所API | `getMyOffice()` / `updateOffice(body)` / `updateRegistrationCode(code)` / `deleteRegistrationCode()` |
| `sentHistories` | 送付履歴API | `getSentHistories(page?, perPage?)` |

## 列挙型(enum)

- `PaymentStatus`(入金ステータス): `default:'0'` / `not_payment:'1'` / `completed:'2'` / `unpaid:'3'` / `transferred:'4'`(`updatePaymentStatus` に渡せるのは `'0'|'1'|'2'` のみ、未払い・振込済みはAPI側で自動計算)
- `OrderStatus`(受注ステータス): `failure:'-1'` / `default:'0'` / `not_received:'1'` / `received:'2'`(`Quote.order_status` の実レスポンスは別表記の語形になる場合がある点に注意)
- `BillingRangeKey`: `billing_date` / `due_date` / `sales_date` / `created_at` / `updated_at`
- `QuoteRangeKey`: `quote_date` / `expired_date` / `created_at` / `updated_at`
- `Excise`(税率): `untaxable` / `non_taxable` / `tax_exemption` / `five_percent` / `eight_percent` / `eight_percent_as_reduced_tax_rate` / `ten_percent`

## 動作サンプル

### 例1: 事業者情報を取得する

```javascript
function getMyOffice() {
  const office = getMfClient_().office.getMyOffice();
  console.log(office);
  // office.name / office.zip / office.registration_code などにアクセス可能
}
```

### 例2: 請求書一覧を取得する(先月末〜来月末・入金済み)

```javascript
function getBillings() {
  const dateUtil = MfInvoiceApi.getDateUtil(new Date());
  const from = dateUtil.getEndDateLastMonth();
  const to = dateUtil.getEndDateNextMonth();

  const billings = getMfClient_().billings.getBillings(from, to, '入金済み');
  console.log(billings.data[0]);
  console.log('件数: ' + billings.pagination.total_count);
}
```

`billings.data[0]` は請求書1件分のフルデータ(`id` / `pdf_url` / `partner_name` / `billing_date` / `items` / 各種 `excise_price_of_*` など)。詳細フィールドは `mf-invoice-api.d.ts` の `Billing` interface、または <https://github.com/wywy-llc/mf-invoice-api/blob/main/docs/reference.md> を参照。

## 既知の注意点

- `getBillings()` / `getQuotes()` 等の一覧系メソッドは全て `{ data: [...], pagination: {...} }` 形。`pagination.total_count` で総件数、`page` / `perPage` 引数でページング。
- `BillingsResponse.data` の宣言型は `.d.ts` 上 `BillingItem[]` だが、`getBillings()` の実際の要素は `Billing`(請求書本体)の形。エージェントがコード生成する際は本 README の実例の形を優先すること(`getBillingItems()` は正しく `BillingItem[]` を返す)。
- `updatePaymentStatus` に渡せる値は3値のみ(未設定/未入金/入金済み)。未払い・振込済みはAPI側の自動計算のため直接指定不可。
- 未認証状態で `createClient()` を呼ぶと即 `Error` を投げる(先に `showMfApiAuthDialog` での認証フローが必要)。
- API呼び出しが成功すると実行ログに `Request success.` が出力される(動作確認の目印)。
- サンプルコード(実装例)は <https://github.com/wywy-llc/mf-Invoice-api-sample> にも公開されている。

# MF Invoice API v3 GASクライアント リファレンス

マネーフォワード クラウド請求書API v3 用GASクライアントライブラリ(`MfInvoiceApi`)の全メソッドリファレンス。セットアップ手順・認証フローは [README](../README.md) を参照。

## 目次

- [クイックスタート](#クイックスタート)
- サービス
  - [billings(請求書API)](#サービス-billings請求書api)
  - [quotes(見積書API)](#サービス-quotes見積書api)
  - [partners(取引先API)](#サービス-partners取引先api)
  - [items(品目API)](#サービス-items品目api)
  - [office(事業所API)](#サービス-office事業所api)
  - [sentHistories(送付履歴API)](#サービス-senthistories送付履歴api)
- [トップレベル関数](#トップレベル関数-mfinvoiceapi)
  - [setRequestLogEnabled(実行ログの抑止)](#setrequestlogenabled)
- [DateUtil](#dateutil)
- [既知の注意点・仕様上の齟齬](#既知の注意点仕様上の齟齬)

## クイックスタート

スクリプトID `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4` でGASプロジェクトにこのライブラリを追加すると、名前空間 `MfInvoiceApi` から全メソッドにアクセスできる(追加手順は [README](../README.md) を参照)。

以降のサンプルコードは、スクリプト プロパティに `CLIENT_ID` / `CLIENT_SECRET` を設定済みという前提で、各関数の中で次のように `MfInvoiceApi.createClient()` を呼んでクライアントを取得して使う。

```javascript
function example() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(
    props.getProperty('CLIENT_ID'),
    props.getProperty('CLIENT_SECRET')
  );
  // client.billings / client.quotes / client.partners / client.items / client.office / client.sentHistories
}
```

## サービス: billings(請求書API)

`client.billings.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getBillings

請求書一覧を取得する。

**構文**

```javascript
const res = client.billings.getBillings(from, to, query, page, perPage, rangeKey);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `from` | string | ○ | 検索範囲の開始日(`YYYY-MM-DD`) |
| `to` | string | ○ | 検索範囲の終了日 |
| `query` | string | - | 検索文字列(例: `'入金済み'`)。URLエンコード済みの文字列を渡しても二重エンコードされない([誤判定条件](#既知の注意点仕様上の齟齬)あり) |
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |
| `rangeKey` | `BillingRangeKey` | - | 期間の絞込対象(省略時は請求日) |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は請求書1件分のデータ(`id`/`partner_name`/`billing_date`/`payment_status`/`items`/`total_price` 等)。`pagination.total_count` で総件数を取得できる。

**実装例**

```javascript
function listPaidBillings() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const dateUtil = MfInvoiceApi.getDateUtil(new Date());
  const res = client.billings.getBillings(
    dateUtil.getEndDateLastMonth(),
    dateUtil.getEndDateNextMonth(),
    '入金済み'
  );
  console.log('件数: ' + res.pagination.total_count);
  console.log(res.data[0]);
}
```

### createNew

インボイス制度に対応した形式で請求書を作成する。

**構文**

```javascript
const billing = client.billings.createNew(billingReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingReqBody` | object | ○ | `{ department_id, billing_date, title?, memo?, due_date?, items?, ... }`(取引先部署ID・請求日は必須) |

**戻り値**

作成された請求書(`Billing`)。

**実装例**

```javascript
function createBilling() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const billing = client.billings.createNew({
    department_id: 'hz06NCst0B89gCyoVcjgxA',
    title: '件名',
    billing_date: '2024-01-01',
    items: [{ name: '品目名', price: 1000, quantity: 1, excise: 'ten_percent' }],
  });
  console.log(billing.id);
}
```

### getBilling

請求書を1件取得する。

**構文**

```javascript
const billing = client.billings.getBilling(billingId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |

**戻り値**

請求書(`Billing`)。

**実装例**

```javascript
function showBilling(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const billing = client.billings.getBilling(billingId);
  console.log(billing.title, billing.total_price);
}
```

### updateBilling

請求書を更新する。

**構文**

```javascript
const billing = client.billings.updateBilling(billingId, billingReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |
| `billingReqBody` | object | ○ | `createNew`と同じ形のリクエストボディ |

**戻り値**

更新後の請求書(`Billing`)。

**実装例**

```javascript
function renameBilling(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.billings.updateBilling(billingId, { title: '新しい件名' });
}
```

### updatePaymentStatus

入金ステータスを変更する。

**構文**

```javascript
const billing = client.billings.updatePaymentStatus(billingId, paymentStatus);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |
| `paymentStatus` | string | ○ | `PaymentStatus` の値。渡せるのは `'0'`(未設定)/`'1'`(未入金)/`'2'`(入金済)の3種のみ |

**戻り値**

更新後の請求書(`Billing`)。

**実装例**

```javascript
function markAsPaid(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.billings.updatePaymentStatus(billingId, MfInvoiceApi.getPaymentStatus('completed'));
}
```

### deleteBilling

請求書を削除する。

**構文**

```javascript
const ok = client.billings.deleteBilling(billingId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |

**戻り値**

削除成功時は `true`(boolean)。

**実装例**

```javascript
function removeBilling(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.billings.deleteBilling(billingId);
}
```

### getBillingItems

請求書に紐づく品目一覧を取得する。

**構文**

```javascript
const res = client.billings.getBillingItems(billingId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は品目データ(`id`/`name`/`price`/`quantity`/`excise` 等)。

**実装例**

```javascript
function listBillingItems(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const res = client.billings.getBillingItems(billingId);
  res.data.forEach(item => console.log(item.name, item.price));
}
```

### getBillingItem

請求書に紐づく品目を1件取得する。

**構文**

```javascript
const item = client.billings.getBillingItem(billingId, itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |
| `itemId` | string | ○ | 品目ID |

**戻り値**

品目データ(`BillingItem`)。

### attachBillingItem

請求書に品目を追加する。

**構文**

```javascript
const ok = client.billings.attachBillingItem(billingId, itemReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |
| `itemReqBody` | object | ○ | `{ item_id?, name?, price?, quantity?, excise? }`。`item_id`(既存品目を紐づけ)または`name`(新規品目名)のいずれかが必須 |

**戻り値**

成功時は `true`(boolean)。

**実装例**

```javascript
function addItem(billingId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.billings.attachBillingItem(billingId, {
    name: '追加品目',
    price: 500,
    quantity: 1,
    excise: 'ten_percent',
  });
}
```

### deleteBillingItem

請求書に紐づく品目を削除する。

**構文**

```javascript
const ok = client.billings.deleteBillingItem(billingId, itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |
| `itemId` | string | ○ | 品目ID |

**戻り値**

削除成功時は `true`(boolean)。

### applyToPostBilling

請求書の郵送を依頼する。

**構文**

```javascript
const ok = client.billings.applyToPostBilling(billingId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |

**戻り値**

郵送依頼成功時は `true`(boolean)。

### cancelPostBilling

請求書の郵送依頼をキャンセルする。

**構文**

```javascript
const ok = client.billings.cancelPostBilling(billingId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `billingId` | string | ○ | 請求書ID |

**戻り値**

キャンセル成功時は `true`(boolean)。

## サービス: quotes(見積書API)

`client.quotes.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getQuotes

見積書一覧を取得する。

**構文**

```javascript
const res = client.quotes.getQuotes(from, to, query, page, perPage, rangeKey, filters);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `from` | string | ○ | 検索範囲の開始日 |
| `to` | string | ○ | 検索範囲の終了日 |
| `query` | string | - | 検索文字列(指定時は`filters`は無視される)。URLエンコード済みの文字列を渡しても二重エンコードされない([誤判定条件](#既知の注意点仕様上の齟齬)あり) |
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |
| `rangeKey` | `QuoteRangeKey` | - | 期間の絞込対象(省略時は見積日) |
| `filters` | object | - | `{ partnerId?, documentNumber?, status?, partnerName?, tags? }`(取引先ID等での絞込) |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は見積書1件分のデータ(`id`/`partner_name`/`quote_date`/`order_status`/`items`/`total_price` 等)。

**実装例**

```javascript
function listQuotes() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const dateUtil = MfInvoiceApi.getDateUtil(new Date());
  const res = client.quotes.getQuotes(
    dateUtil.getEndDateLastMonth(),
    dateUtil.getEndDateNextMonth()
  );
  console.log('件数: ' + res.pagination.total_count);
}
```

### createNew

見積書を作成する。

**構文**

```javascript
const quote = client.quotes.createNew(quoteReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteReqBody` | object | ○ | `{ department_id, quote_date, expired_date, title?, memo?, items?, ... }`(取引先部署ID・見積日・有効期限は必須) |

**戻り値**

作成された見積書(`Quote`)。

**実装例**

```javascript
function createQuote() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const quote = client.quotes.createNew({
    department_id: 'hz06NCst0B89gCyoVcjgxA',
    quote_date: '2024-01-01',
    expired_date: '2024-01-31',
    items: [{ name: '品目名', price: 1000, quantity: 1, excise: 'ten_percent' }],
  });
  console.log(quote.id);
}
```

### getQuote

見積書を1件取得する。

**構文**

```javascript
const quote = client.quotes.getQuote(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

見積書(`Quote`)。

### updateQuote

見積書を更新する。

**構文**

```javascript
const quote = client.quotes.updateQuote(quoteId, quoteReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |
| `quoteReqBody` | object | ○ | `createNew`と同じ形のリクエストボディ |

**戻り値**

更新後の見積書(`Quote`)。

### deleteQuote

見積書を削除する。

**構文**

```javascript
const ok = client.quotes.deleteQuote(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

削除成功時は `true`(boolean)。

### getQuoteItems

見積書に紐づく品目一覧を取得する。

**構文**

```javascript
const res = client.quotes.getQuoteItems(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は品目データ(`id`/`name`/`price`/`quantity`/`excise` 等)。

### getQuoteItem

見積書に紐づく品目を1件取得する。

**構文**

```javascript
const item = client.quotes.getQuoteItem(quoteId, itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |
| `itemId` | string | ○ | 品目ID |

**戻り値**

品目データ(`Item`)。

### attachQuoteItem

見積書に品目を追加する。

**構文**

```javascript
const ok = client.quotes.attachQuoteItem(quoteId, quoteItemReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |
| `quoteItemReqBody` | object | ○ | `{ item_id?, name?, price?, quantity?, excise? }`。`item_id`または`name`のいずれかが必須 |

**戻り値**

成功時は `true`(boolean)。

### deleteQuoteItem

見積書に紐づく品目を削除する。

**構文**

```javascript
const ok = client.quotes.deleteQuoteItem(quoteId, itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |
| `itemId` | string | ○ | 品目ID |

**戻り値**

削除成功時は `true`(boolean)。

### applyToPostQuote

見積書の郵送を依頼する。

**構文**

```javascript
const ok = client.quotes.applyToPostQuote(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

郵送依頼成功時は `true`(boolean)。

### cancelPostQuote

見積書の郵送依頼をキャンセルする。

**構文**

```javascript
const ok = client.quotes.cancelPostQuote(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

キャンセル成功時は `true`(boolean)。

### updateOrderStatus

見積書の受注ステータスを更新する。

**構文**

```javascript
const ok = client.quotes.updateOrderStatus(quoteId, orderStatus);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |
| `orderStatus` | string | ○ | `OrderStatus` の値(数値文字列 `'-1'`〜`'2'`) |

**戻り値**

成功時は `true`(boolean)。

**実装例**

```javascript
function markAsReceived(quoteId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.quotes.updateOrderStatus(quoteId, MfInvoiceApi.getOrderStatus('received'));
}
```

注意: レスポンス側の`Quote.order_status`はキー語形(`'received'`等)で返るが、送信値は数値文字列。詳細は [既知の注意点](#既知の注意点仕様上の齟齬) を参照。

### convertQuoteToBilling

見積書を請求書に変換する。

**構文**

```javascript
const billing = client.quotes.convertQuoteToBilling(quoteId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `quoteId` | string | ○ | 見積書ID |

**戻り値**

変換後の請求書(`Billing`)。

**実装例**

```javascript
function convertQuote(quoteId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const billing = client.quotes.convertQuoteToBilling(quoteId);
  console.log('請求書ID: ' + billing.id);
}
```

## サービス: partners(取引先API)

`client.partners.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getPartners

取引先一覧を取得する。

**構文**

```javascript
const res = client.partners.getPartners(page, perPage);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は取引先データ(`id`/`name`/`departments` 等)。

**実装例**

```javascript
function listPartners() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const res = client.partners.getPartners();
  res.data.forEach(partner => console.log(partner.name));
}
```

### createNew

取引先を作成する。

**構文**

```javascript
const partner = client.partners.createNew(partnerReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerReqBody` | object | ○ | `{ name, code?, name_kana?, memo?, departments? }`(取引先名は必須) |

**戻り値**

作成された取引先(`Partner`)。

**実装例**

```javascript
function createPartner() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const partner = client.partners.createNew({ name: '取引先名' });
  console.log(partner.id);
}
```

### getPartner

取引先を1件取得する。

**構文**

```javascript
const partner = client.partners.getPartner(partnerId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |

**戻り値**

取引先(`Partner`)。

### updatePartner

取引先を更新する。

**構文**

```javascript
const partner = client.partners.updatePartner(partnerId, partnerReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `partnerReqBody` | object | ○ | `createNew`と同じ形のリクエストボディ |

**戻り値**

更新後の取引先(`Partner`)。

### deletePartner

取引先を削除する。

**構文**

```javascript
const ok = client.partners.deletePartner(partnerId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |

**戻り値**

削除成功時は `true`(boolean)。

### getDepartments

取引先に紐づく部署一覧を取得する。

**構文**

```javascript
const res = client.partners.getDepartments(partnerId, page, perPage);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は部署データ(`id`/`person_name`/`email` 等)。

### createDepartment

取引先に部署を追加する。

**構文**

```javascript
const department = client.partners.createDepartment(partnerId, departmentReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `departmentReqBody` | object | ○ | `{ person_name?, email?, tel?, zip?, ... }`(全フィールド任意、少なくとも1項目指定) |

**戻り値**

作成された部署(`Department`)。

**実装例**

```javascript
function addDepartment(partnerId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const department = client.partners.createDepartment(partnerId, {
    person_name: '担当者名',
    email: 'contact@example.com',
  });
  console.log(department.id);
}
```

### getDepartment

取引先に紐づく部署を1件取得する。

**構文**

```javascript
const department = client.partners.getDepartment(partnerId, departmentId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `departmentId` | string | ○ | 取引先部署ID |

**戻り値**

部署(`Department`)。

### updateDepartment

取引先に紐づく部署を更新する。

**構文**

```javascript
const department = client.partners.updateDepartment(partnerId, departmentId, departmentReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `departmentId` | string | ○ | 取引先部署ID |
| `departmentReqBody` | object | ○ | `createDepartment`と同じ形のリクエストボディ |

**戻り値**

更新後の部署(`Department`)。

### deleteDepartment

取引先に紐づく部署を削除する。

**構文**

```javascript
const ok = client.partners.deleteDepartment(partnerId, departmentId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `partnerId` | string | ○ | 取引先ID |
| `departmentId` | string | ○ | 取引先部署ID |

**戻り値**

削除成功時は `true`(boolean)。

### getAll

全ての取引先を取得する(ページングを内部で自動的に繰り返す)。

**構文**

```javascript
const partners = client.partners.getAll();
```

**引数**

なし。

**戻り値**

取引先の配列(`Partner[]`)。100ページを超える場合は打ち切り、取得できた分のみを返す(実行ログに警告が出力される)。

**実装例**

```javascript
function listAllPartners() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const partners = client.partners.getAll();
  console.log('件数: ' + partners.length);
}
```

## サービス: items(品目API)

`client.items.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getItems

品目一覧を取得する。

**構文**

```javascript
const res = client.items.getItems(page, perPage, name, code);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |
| `name` | string | - | 品目名で絞込(部分一致、カンマ区切りで複数指定可) |
| `code` | string | - | 品目コードで絞込(カンマ区切りで複数指定可) |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は品目データ(`id`/`name`/`price`/`excise` 等)。

**実装例**

```javascript
function listItems() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const res = client.items.getItems();
  res.data.forEach(item => console.log(item.name, item.price));
}
```

### createNew

品目を作成する。

**構文**

```javascript
const item = client.items.createNew(itemReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `itemReqBody` | object | ○ | `{ name, excise, code?, price?, quantity?, ... }`(品目名・税率は必須) |

**戻り値**

作成された品目(`Item`)。

**実装例**

```javascript
function createItem() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const item = client.items.createNew({
    name: '品目名',
    price: 1000,
    excise: 'ten_percent',
  });
  console.log(item.id);
}
```

### getItem

品目を1件取得する。

**構文**

```javascript
const item = client.items.getItem(itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `itemId` | string | ○ | 品目ID |

**戻り値**

品目(`Item`)。

### deleteItem

品目を削除する。

**構文**

```javascript
const ok = client.items.deleteItem(itemId);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `itemId` | string | ○ | 品目ID |

**戻り値**

削除成功時は `true`(boolean)。

### updateItem

品目を更新する(部分更新可、全フィールド任意)。

**構文**

```javascript
const item = client.items.updateItem(itemId, itemReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `itemId` | string | ○ | 品目ID |
| `itemReqBody` | object | ○ | `createNew`の全フィールドを任意にしたもの |

**戻り値**

更新後の品目(`Item`)。

**実装例**

```javascript
function updateItemPrice(itemId) {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.items.updateItem(itemId, { price: 1200 });
}
```

## サービス: office(事業所API)

`client.office.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getMyOffice

自分の事業者情報を取得する。

**構文**

```javascript
const office = client.office.getMyOffice();
```

**引数**

なし。

**戻り値**

事業者情報(`Office`)。主なフィールド: `id`/`name`/`zip`/`prefecture`/`address1`/`tel`/`registration_code`。

**実装例**

```javascript
function getMyOffice() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const office = client.office.getMyOffice();
  console.log(office.name, office.registration_code);
}
```

### updateOffice

事業者情報を更新する(全フィールド任意、少なくとも1項目指定)。

**構文**

```javascript
const office = client.office.updateOffice(officeReqBody);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `officeReqBody` | object | ○ | `{ name?, zip?, prefecture?, address1?, address2?, tel?, fax? }` |

**戻り値**

更新後の事業者情報(`Office`)。

**実装例**

```javascript
function updateOfficeTel() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  client.office.updateOffice({ tel: '03-1234-5678' });
}
```

### updateRegistrationCode

適格請求書発行事業者番号(インボイス番号)を作成・更新する。

**構文**

```javascript
const res = client.office.updateRegistrationCode(registrationCode);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `registrationCode` | string | ○ | 適格請求書発行事業者番号(`T`+13桁) |

**戻り値**

`{ registration_code: string }`。

### deleteRegistrationCode

適格請求書発行事業者番号を削除する。

**構文**

```javascript
const ok = client.office.deleteRegistrationCode();
```

**引数**

なし。

**戻り値**

削除成功時は `true`(boolean)。

## サービス: sentHistories(送付履歴API)

`client.sentHistories.<method>(...)` の形でアクセスする(`client` は [クイックスタート](#クイックスタート) で取得したもの)。

### getSentHistories

送付履歴一覧を取得する。

**構文**

```javascript
const res = client.sentHistories.getSentHistories(page, perPage);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `page` | number | - | ページ番号 |
| `perPage` | number | - | 1ページあたりの件数 |

**戻り値**

`{ data: [...], pagination: {...} }` の形。`data`の各要素は送付履歴データ(`document_type`/`from`/`to`/`sent_at` 等)。

**実装例**

```javascript
function listSentHistories() {
  const props = PropertiesService.getScriptProperties();
  const client = MfInvoiceApi.createClient(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
  const res = client.sentHistories.getSentHistories();
  res.data.forEach(h => console.log(h.document_type, h.sent_at));
}
```

## トップレベル関数 MfInvoiceApi.*

サービス経由ではなく `MfInvoiceApi.<function>(...)` の形で直接呼び出す関数群。

### createClient

APIクライアントを生成する。生成時に一度だけ認証状態を確認し、未認証の場合は`Error`を投げる。

**構文**

```javascript
const client = MfInvoiceApi.createClient(clientId, clientSecret);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `clientId` | string | ○ | MFアプリポータルで発行したClient ID |
| `clientSecret` | string | ○ | MFアプリポータルで発行したClient Secret |

**戻り値**

APIクライアント(`MfClient`)。`billings`/`quotes`/`partners`/`items`/`office`/`sentHistories`の6サービスを持つ。生成時に一度だけ認証状態を確認し、未認証の場合は`Error`を投げる。取得方法は [クイックスタート](#クイックスタート) を参照。

### showMfApiAuthDialog

認証用のモーダルダイアログを表示する。

**構文**

```javascript
MfInvoiceApi.showMfApiAuthDialog(clientId, clientSecret);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `clientId` | string | ○ | Client ID |
| `clientSecret` | string | ○ | Client Secret |

**戻り値**

なし(`void`)。

### mfCallback

OAuth2認証のコールバックを処理する。**関数名は`mfCallback`に固定**(ライブラリ内部が直接この名前を参照するため、利用者側でリネームすると認証コールバックが届かない)。

**構文**

```javascript
function mfCallback(request) {
  return MfInvoiceApi.mfCallback(request, clientId, clientSecret);
}
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `request` | any | ○ | GASが渡すコールバックリクエスト |
| `clientId` / `clientSecret` | string | ○ | Client ID / Client Secret |

**戻り値**

`HtmlOutput`(認証成功・失敗を表示するHTML)。

### createMfAuthUrl

認証URLを直接取得する。通常は [`showMfApiAuthDialog`](#showmfapiauthdialog) で十分。

**構文**

```javascript
const url = MfInvoiceApi.createMfAuthUrl(clientId, clientSecret);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `clientId` / `clientSecret` | string | ○ | Client ID / Client Secret |

**戻り値**

認証URL(string)。

### logout

保存済みのアクセストークンを破棄する。ライブラリ更新でスコープが増えた場合の再認可に使う。

**構文**

```javascript
MfInvoiceApi.logout(clientId, clientSecret);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `clientId` / `clientSecret` | string | ○ | Client ID / Client Secret |

**戻り値**

なし(`void`)。

**実装例**

```javascript
function logout() {
  const props = PropertiesService.getScriptProperties();
  MfInvoiceApi.logout(props.getProperty('CLIENT_ID'), props.getProperty('CLIENT_SECRET'));
}
```

### getRedirectUri

このGASのリダイレクトURIを取得する。

**構文**

```javascript
const uri = MfInvoiceApi.getRedirectUri();
```

**引数**

なし。

**戻り値**

`https://script.google.com/macros/d/{このGASのスクリプトID}/usercallback` の形の文字列。

### getDateUtil

日付操作用のユーティリティを生成する。

**構文**

```javascript
const dateUtil = MfInvoiceApi.getDateUtil(baseDate);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `baseDate` | Date | ○ | 基準日 |

**戻り値**

[DateUtil](#dateutil)。

### setRequestLogEnabled

リクエストURLの実行ログ出力を切り替える(既定は出力あり)。[`getAll()`](#getall) のようなページング処理ではリクエスト数だけログが増えるため、抑止したい場合に使う。

**構文**

```javascript
MfInvoiceApi.setRequestLogEnabled(enabled);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `enabled` | boolean | ○ | 出力する場合は `true`、抑止する場合は `false` |

**戻り値**

なし。

**実装例**

```javascript
function example() {
  MfInvoiceApi.setRequestLogEnabled(false);
  const partners = client.partners.getAll(); // ページごとのURLログが出力されない
}
```

### getPaymentStatus

入金ステータスのキー名を数値文字列へ変換する。

**構文**

```javascript
const value = MfInvoiceApi.getPaymentStatus(status);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `status` | string | ○ | `PaymentStatus` のキー名(例: `'completed'`) |

**戻り値**

対応する値(例: `'2'`)。

**実装例**

```javascript
MfInvoiceApi.getPaymentStatus('completed'); // => '2'
```

### getOrderStatus

受注ステータスのキー名を数値文字列へ変換する。

**構文**

```javascript
const value = MfInvoiceApi.getOrderStatus(status);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `status` | string | ○ | `OrderStatus` のキー名(例: `'received'`) |

**戻り値**

対応する値(例: `'2'`)。

## DateUtil

`MfInvoiceApi.getDateUtil(baseDate)` の戻り値。

### getDateString

日付文字列を取得する。

**構文**

```javascript
const s = dateUtil.getDateString(type);
```

**引数**

| 引数 | 型 | 必須 | 説明 |
|---|---|---|---|
| `type` | number | - | 出力パターン(1: `YYYY-MM-DD` / 2: `YYYYMM` / 3: `YYYY年MM月`。省略時は1) |

**戻り値**

日付文字列(string)。

### getTimeString

時刻文字列を取得する。

**構文**

```javascript
const s = dateUtil.getTimeString();
```

**引数**

なし。

**戻り値**

`YYYY-MM-DD hh:mm:dd` 形式の文字列。

### getEndDateBaseMonth

基準日の月末日付を取得する。

**構文**

```javascript
const s = dateUtil.getEndDateBaseMonth();
```

**引数**

なし。

**戻り値**

`YYYY-MM-DD` 形式の文字列。

### getEndDateLastMonth

先月末の日付を取得する。

**構文**

```javascript
const s = dateUtil.getEndDateLastMonth();
```

**引数**

なし。

**戻り値**

`YYYY-MM-DD` 形式の文字列。

### getEndDateNextMonth

来月末の日付を取得する。

**構文**

```javascript
const s = dateUtil.getEndDateNextMonth();
```

**引数**

なし。

**戻り値**

`YYYY-MM-DD` 形式の文字列。

**実装例**

```javascript
function getBillingRange() {
  const dateUtil = MfInvoiceApi.getDateUtil(new Date());
  const from = dateUtil.getEndDateLastMonth();
  const to = dateUtil.getEndDateNextMonth();
  console.log(from, to);
}
```

## 既知の注意点・仕様上の齟齬

- `getBillings()`/`getBillingItems()`はどちらも同じ型(`data: BillingItem[]`)で宣言されているが、`getBillings()`の実際の`data`要素は請求書本体(`Billing`)の形。`getBillingItems()`は宣言通り品目(`BillingItem`)を返す
- [`updatePaymentStatus()`](#updatepaymentstatus)に渡せる値は `'0'`(未設定)/`'1'`(未入金)/`'2'`(入金済)の3種のみ。未払い・振込済みはAPI側の自動計算のため直接指定できない
- [`updateOrderStatus()`](#updateorderstatus)への送信値は数値文字列(`'-1'`〜`'2'`)だが、`Quote.order_status`(レスポンス側)はキー語形(`'failure'`/`'default'`/`'not_received'`/`'received'`)で返る
- コールバック関数名は `mfCallback` に固定(ライブラリ内部が直接この名前を参照するため、リネーム不可)
- 未認証状態で [`createClient()`](#createclient) を呼ぶと即 `Error` を投げる。先に [`showMfApiAuthDialog()`](#showmfapiauthdialog) での認証が必要
- API呼び出しが成功すると実行ログに `Request success.` が出力される(動作確認の目印)
- リクエスト送信前に実行ログへ `Request URL: {method} {URL}` が出力される。認証情報は含まれないが、検索文字列と各種IDはURLに載るため実行ログに残る。抑止したい場合は [`setRequestLogEnabled(false)`](#setrequestlogenabled) を呼ぶ
- [`getBillings()`](#getbillings)/[`getQuotes()`](#getquotes) の `query` は、URLエンコード済みの文字列をそのまま渡しても二重エンコードされない。ただし `'50%20OFF'` のようにエンコード済みと同じ形式を持つ生文字列はエンコード済みと誤判定し、MF側には `'50 OFF'` として渡る。生文字列として検索する場合は `%` を `%25` にエスケープして渡す(`'50%2520OFF'`)

# マネーフォワード クラウド請求書API v3 対応のGASクライアント

スクリプトID： `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`

## 概要

- マネーフォワード クラウド請求書API v3 用のGAS(Google Apps Script)クライアントライブラリです。
- ゼロから自分で開発するよりも素早くAPI連携を実現できます。

## API対応状況とライブラリのリファレンス

https://wywy.jp/docs/mfapi-v3-client/reference

## セットアップの流れ

1. スプレッドシートとGASを準備する
2. ライブラリを追加する
3. Client ID / Client Secret を設定する
4. 初期設定(トリガー・シート作成)
5. クラウド請求書APIに認証する

## 1. スプレッドシートとGASを準備する

このライブラリはスプレッドシート + GAS の利用を前提とします。

準備を省略する場合は、以下のURLから完成版のスプレッドシートをコピーしてください。

https://docs.google.com/spreadsheets/d/1tVfW1rHVow5GjmiuqtIpmDNxXp0AisnbvQ6eCdCEAWE/copy

### GASエディタを起動する

1. Googleドライブでスプレッドシートを新規作成する
2. GASエディタを起動する
   - メニュー > 拡張機能 > Apps Script をクリック
3. GASエディタが表示される

## 2. ライブラリを追加する

GASエディタで以下を設定します。

1. ライブラリの「＋」をクリック
   - <img width="256" alt="スクリーンショット 2023-08-06 22 22 26" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/9d3aa366-f65e-41ee-aa31-22b9051686d9">
2. スクリプトIDに以下を入力して検索する
   - `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`
   - <img width="256" alt="スクリーンショット 2023-08-06 22 26 40" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/d423222e-21f0-4324-ba31-6e7c8815663a">
3. 最新のバージョンを選択する
4. 「追加」ボタンをクリックする
5. 「MfInvoiceApi」というライブラリが追加される

## 3. Client ID / Client Secret を設定する

API連携にはMFアプリポータルで発行する `Client ID` と `Client Secret` が必要です。取得してGASのスクリプト プロパティに設定します。

1. MFアプリポータルのアプリ新規登録画面に遷移する
   - <img width="500" alt="スクリーンショット 2023-08-06 22 54 48" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/72f8448b-b22e-4138-beb2-8a6b5fb0a527">
   - アプリ名称: [検証用]MFクライアント
   - リダイレクトURI: `https://script.google.com/macros/d/{SCRIPT ID}/usercallback`
     - 例: スクリプトIDが `1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D` の場合、`https://script.google.com/macros/d/1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D/usercallback`
     - スクリプトIDは GASエディタの `プロジェクト設定 > スクリプト ID` から取得できます。
       - <img width="500" alt="スクリーンショット 2023-08-06 22 51 51" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/52fb5c23-106d-4063-82d7-84973eafe119">
   - クライアント認証方式: `CLIENT_SECRET_POST` を選択する
2. アプリ詳細画面の `Client ID` と `Client Secret` を控える
3. GASエディタのプロジェクト設定画面に遷移する
   - <img width="256" alt="スクリーンショット 2023-08-06 22 38 17" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ed2fc686-399a-48a9-a413-c2442261d403">
4. スクリプト プロパティに `CLIENT_ID` と `CLIENT_SECRET` を追加する
   - CLIENT_ID: MFアプリポータルの `Client ID`
   - CLIENT_SECRET: MFアプリポータルの `Client Secret`
   - <img width="500" alt="スクリーンショット 2023-08-06 22 39 43" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/1312398a-ca8b-4aa5-af6c-808f83bf9564">

## 4. 初期設定(トリガー・シート作成)

1. GASエディタで `コード.gs` に以下をコピー&ペーストする

```javascript
/**
 * 初期設定
 * ・トリガー作成
 * ・シート作成
 */
function initialize() {
  const initTriggers = () => {
    // トリガー作成
    const functionNames = ['onOpen'];
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
      const fname = trigger.getHandlerFunction();
      if (functionNames.includes(fname)) {
        ScriptApp.deleteTrigger(trigger);
        switch (fname) {
          case 'onOpen':
            ScriptApp.newTrigger(fname).forSpreadsheet(spreadsheet).onOpen().create();
        }
      }
    }
  }
  const schemas = {
    office: [
      'id',
      'name',
      'zip',
      'prefecture',
      'address1',
      'address2',
      'tel',
      'fax',
      'office_type',
      'office_code',
      'registration_code',
      'created_at',
      'updated_at',
    ],
    partners: [
      'id',
      'code',
      'name',
      'name_kana',
      'name_suffix',
      'memo',
      'created_at',
      'updated_at',
      'departments',
    ],
    items: [
      'id',
      'name',
      'code',
      'detail',
      'unit',
      'price',
      'quantity',
      'is_deduct_withholding_tax',
      'excise',
      'created_at',
      'updated_at'
    ],
    billings: ['id',
      'pdf_url',
      'operator_id',
      'department_id',
      'member_id',
      'member_name',
      'partner_id',
      'partner_name',
      'office_id',
      'office_name',
      'office_detail',
      'title',
      'memo',
      'payment_condition',
      'billing_date',
      'due_date',
      'sales_date',
      'billing_number',
      'note',
      'document_name',
      'payment_status',
      'email_status',
      'posting_status',
      'created_at',
      'updated_at',
      'is_downloaded',
      'is_locked',
      'deduct_price',
      'tag_names',
      'items',
      'excise_price',
      'excise_price_of_untaxable',
      'excise_price_of_non_taxable',
      'excise_price_of_tax_exemption',
      'excise_price_of_five_percent',
      'excise_price_of_eight_percent',
      'excise_price_of_eight_percent_as_reduced_tax_rate',
      'excise_price_of_ten_percent',
      'subtotal_price',
      'subtotal_of_untaxable_excise',
      'subtotal_of_non_taxable_excise',
      'subtotal_of_tax_exemption_excise',
      'subtotal_of_five_percent_excise',
      'subtotal_of_eight_percent_excise',
      'subtotal_of_eight_percent_as_reduced_tax_rate_excise',
      'subtotal_of_ten_percent_excise',
      'subtotal_with_tax_of_untaxable_excise',
      'subtotal_with_tax_of_non_taxable_excise',
      'subtotal_with_tax_of_five_percent_excise',
      'subtotal_with_tax_of_tax_exemption_excise',
      'subtotal_with_tax_of_eight_percent_excise',
      'subtotal_with_tax_of_eight_percent_as_reduced_tax_rate_excise',
      'subtotal_with_tax_of_ten_percent_excise',
      'total_price',
      'registration_code',
      'use_invoice_template',
      'config'
    ],
    billingItems: [
      'id',
      'name',
      'code',
      'detail',
      'unit',
      'price',
      'quantity',
      'is_deduct_withholding_tax',
      'excise',
      'delivery_date',
      'delivery_number',
      'created_at',
      'updated_at',
      'billing_id'
    ],
    quotes: [
      'id',
      'pdf_url',
      'operator_id',
      'department_id',
      'member_id',
      'member_name',
      'partner_id',
      'partner_name',
      'partner_detail',
      'office_id',
      'office_name',
      'office_detail',
      'title',
      'memo',
      'quote_date',
      'quote_number',
      'note',
      'expired_date',
      'document_name',
      'order_status',
      'transmit_status',
      'posting_status',
      'created_at',
      'updated_at',
      'is_downloaded',
      'is_locked',
      'deduct_price',
      'tag_names',
      'items',
      'excise_price',
      'excise_price_of_untaxable',
      'excise_price_of_non_taxable',
      'excise_price_of_tax_exemption',
      'excise_price_of_five_percent',
      'excise_price_of_eight_percent',
      'excise_price_of_eight_percent_as_reduced_tax_rate',
      'excise_price_of_ten_percent',
      'subtotal_price',
      'subtotal_of_untaxable_excise',
      'subtotal_of_non_taxable_excise',
      'subtotal_of_tax_exemption_excise',
      'subtotal_of_five_percent_excise',
      'subtotal_of_eight_percent_excise',
      'subtotal_of_eight_percent_as_reduced_tax_rate_excise',
      'subtotal_of_ten_percent_excise',
      'total_price'
    ],
    quoteItems: [
      'id',
      'name',
      'code',
      'detail',
      'unit',
      'price',
      'quantity',
      'is_deduct_withholding_tax',
      'excise',
      'created_at',
      'updated_at',
      'quote_id'
    ]
  };
  const initSheets = () => {
    // シート作成
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

    for (const schema of Object.keys(schemas)) {
      let sheet = spreadsheet.getSheetByName(schema);
      if (sheet) {
        // シートの削除（初期化のため）
        spreadsheet.deleteSheet(sheet);
      }
      // シートの挿入
      sheet = spreadsheet.insertSheet(schema);
      const attrs = schemas[schema];
      const range = sheet.getRange(1, 1, 1, attrs.length);
      range.setBackground("#bdbdbd");
      range.setValues([attrs]);

      // 不要な列を削除する
      if (attrs.length < sheet.getMaxColumns()) {
        sheet.deleteColumns(attrs.length + 1, sheet.getMaxColumns() - attrs.length);
      }
    }
  }
  initTriggers();
  initSheets();
}

/**
 * シンプルトリガー
 * スプレッドシート、をユーザーが開く時に呼び出される関数です。
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui
    .createMenu('MF請求書API連携')
    .addItem('認証処理を開始する', 'showMfApiAuthDialog');
  menu.addToUi();
}

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
  const credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
  };
  return credentials;
}

/**
 * MF請求書API認証ダイアログを表示します。
 */
function showMfApiAuthDialog() {
  const credentials = getMfCredentials_();
  MfInvoiceApi.showMfApiAuthDialog(
    credentials.clientId,
    credentials.clientSecret
  );
}

/**
 * MF認証のコールバック関数です。
 * @param request
 */
function mfCallback(request) {
  const credentials = getMfCredentials_();
  return MfInvoiceApi.mfCallback(
    request,
    credentials.clientId,
    credentials.clientSecret
  );
}

/**
 * MF請求書APIクライアントを生成します。
 * @returns {MfClient}
 */
function getMfClient_() {
  const credentials = getMfCredentials_();
  return MfInvoiceApi.createClient(
    credentials.clientId,
    credentials.clientSecret
  );
}
```

2. `initialize` 関数を実行する
   - トリガー作成とシート作成が自動で行われます。
   - このトリガーにより、スプレッドシートのメニューに「MF請求書API連携」が追加されます。
3. 「MF請求書API連携」メニューを確認する
   - スプレッドシートの画面を再読み込みします。再読み込み時にトリガーが実行されます。
   - 「MF請求書API連携」メニューが表示されれば完了です。
   - <img width="500" alt="スクリーンショット 2023-08-07 8 23 06" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/c7dd2a57-1cae-4f31-bd4e-be687b859e85">

ここまでで、スプレッドシートとGASの準備は完了です。

## 5. クラウド請求書APIに認証する

必要な情報が揃ったので、クラウド請求書APIに認証します。

1. 認証処理を開始する
   - スプレッドシートメニュー > MF請求書API連携 > 認証処理を開始する
   - <img width="300" alt="スクリーンショット 2023-08-07 8 35 50" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ae2320bb-29fd-41d4-a450-3373e0cb0c02">
2. Google権限を許可する
3. 「認証処理を開始する」を再実行する
4. クラウド請求書APIのサイトで認証処理を継続する
   - <img width="256" alt="スクリーンショット 2023-08-07 8 40 32" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/5393fa9b-96f2-4bbd-8347-4f90c76afa0d">
   - 「こちらをクリックして認証処理を継続してください」をクリックする
   - URLに認証に必要な情報が記載されています。
   - エラーが発生する場合は以下を確認してください。
     - リダイレクトURIが正しいか
       - 認証処理しているGASとマネーフォワード クラウド請求書に登録したリダイレクトURIが不一致の場合があります。
     - クライアント認証方式で `CLIENT_SECRET_POST` を選択したか
       - 初期値は `CLIENT_SECRET_BASIC` のため、選択し忘れる場合があります。
5. 認証成功を確認する
   - 「認証成功しました。このタブを閉じてください。」と表示されれば認証完了です。

### ライブラリ更新でスコープが変わった場合の再認可

ライブラリ更新で要求スコープが変わった場合(例: 読み取り用の `mfc/invoice/data.read` の追加)、認証済み環境では保存済みのアクセストークンがそのまま再利用され、追加スコープが反映されません。`apps-script-oauth2` の `hasAccess()` は保存済みトークンの有効期限のみを確認し、スコープの変更は検知しないためです。

更新後は以下の `logout` を実行して保存済みトークンを破棄し、あらためて「認証処理を開始する」を実行して再認可してください。

```javascript
/**
 * 保存済みトークンを破棄します。
 */
function logout() {
  const credentials = getMfCredentials_();
  MfInvoiceApi.logout(credentials.clientId, credentials.clientSecret);
}
```

## 例1: 事業者情報を取得する

自分の事業者情報をAPIから取得します。リファレンス:

[事業者情報の取得 | MF Invoice API v3 GASクライアントのリファレンス](https://wywy.jp/54bea26952aa430b928ca9a09deafc4c)

1. `コード.gs` に以下をコピー&ペーストする

```javascript
/**
 * 事業者情報の取得
 */
function getMyOffice() {
  // API実行： 事業者情報の取得
  const office = getMfClient_().office.getMyOffice();
  console.log(office);

  // スプレッドシートに追加
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("office");
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
  const row = [];
  for (const attr in office) {
    row.push(office[attr]);
  }
  sheet.appendRow(row);
}
```

2. `getMyOffice` 関数を実行する
3. ログを確認する
   - `Request success.` と表示されれば成功です。
4. スプレッドシートの `office` シートにデータが追加されたことを確認する

### 事業者情報のデータ

`const office = getMfClient_().office.getMyOffice();` の `office` には以下のようなデータが格納されます。

```javascript
{
  id: 'AbebZQVzNNwX3YCBqXq11Q',
  name: '事業者名',
  zip: '7700053',
  prefecture: '徳島県',
  address1: '徳島市南島田町２丁目 ５８ー３',
  address2: 'オレス南島田Ｂ棟',
  tel: '03-1234-5678',
  fax: '03-1234-5678',
  office_type: '個人',
  office_code: '5018-5904',
  registration_code: 'T7480003001692',
  created_at: '2022-10-28 10:00:58 +0900',
  updated_at: '2022-11-16 20:22:22 +0900'
}
```

例えば事業者名を取得する場合は `office.name` で取得できます。

他のデータもリファレンスで確認できます。

[MF Invoice API v3 GASクライアントのリファレンス](https://wywy.jp/docs/mfapi-v3-client/reference)

## 例2: 請求書一覧を取得する

請求書一覧をAPIから取得します。リファレンス:

[請求書一覧の取得 | MF Invoice API v3 GASクライアントのリファレンス](https://wywy.jp/56b6b828e6eb4a758142759ae4643fbf)

1. `コード.gs` に以下をコピー&ペーストする

```javascript
/**
 * 請求書一覧の取得
 */
function getBillings() {
  // 日付操作
  const baseDate = new Date();
  const dateUtil = MfInvoiceApi.getDateUtil(baseDate);

  // 先月末
  const from = dateUtil.getEndDateLastMonth();

  // 来月末
  const to = dateUtil.getEndDateNextMonth();

  // 検索キー
  const query = '入金済み';

  // API実行： 請求書一覧の取得
  const billings = getMfClient_().billings.getBillings(from, to, query);
  console.log(billings.data[0]);
  console.log('件数: ' + billings.pagination.total_count);

  // スプレッドシートに追加
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("billings");
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
  for (const billing of billings.data) {
    const row = [];
    for (const attr in billing) {
      if (attr === 'items' || attr === 'tag_names') {
        row.push(JSON.stringify(billing[attr]));
        continue;
      }
      row.push(billing[attr]);
    }
    sheet.appendRow(row);
  }
}
```

2. `getBillings` 関数を実行する
3. ログを確認する
   - `Request success.` と表示されれば成功です。
4. スプレッドシートの `billings` シートにデータが追加されたことを確認する

### 請求書のデータ

`const billings = getMfClient_().billings.getBillings(from, to, query);` の `billings` には以下のようなデータが格納されます。

```javascript
{
  data: [
    {
      id: 'sg8qU4G0CrsCGUsyZFxtgg',
      pdf_url: 'https://invoice.moneyforward.com/api/v3/billings/file.pdf',
      operator_id: 'qMqFf7ECe6vYQEyrFgXoOg',
      department_id: 'hz06NCst0B89gCyoVcjgxA',
      member_id: 'xtxwZOK-ygfxyTHgilikLA',
      member_name: '自社担当者',
      partner_id: 'KVmEY0dSgFZPYekVvA7R0g',
      partner_name: '取引先名',
      office_id: 'AbebZQVzNNwX3YCBqXq11Q',
      office_name: '事業者名',
      office_detail:
        '〒770-0053\n徳島県徳島市南島田町２丁目 ５８ー３\nオレス南島田Ｂ棟\nTEL: 088-676-3199\n',
      title: '件名',
      memo: 'メモ',
      payment_condition: '振込先',
      billing_date: '2023/08/02',
      due_date: '2023/09/30',
      sales_date: '2023/07/31',
      billing_number: '請求書番号',
      note: '備考',
      document_name: '帳票名',
      payment_status: '入金済み',
      email_status: '未送信',
      posting_status: '未郵送',
      created_at: '2023-08-02 20:38:00 +0900',
      updated_at: '2023-08-02 20:38:01 +0900',
      is_downloaded: false,
      is_locked: false,
      deduct_price: '0.0',
      tag_names: [],
      items: [
        {
          id: '1nHYARjYb_kXv2cIPAHHtw',
          name: '品目名',
          code: '202305_C0003_h7',
          detail: '詳細',
          unit: '単位',
          price: '1354.0',
          quantity: '1.0',
          is_deduct_withholding_tax: false,
          excise: 'ten_percent',
          delivery_date: null,
          delivery_number: null,
          created_at: '2023-08-02 20:38:00 +0900',
          updated_at: '2023-08-02 20:38:00 +0900',
        },
      ],
      excise_price: '135.0',
      excise_price_of_untaxable: '0.0',
      excise_price_of_non_taxable: '0.0',
      excise_price_of_tax_exemption: '0.0',
      excise_price_of_five_percent: '0.0',
      excise_price_of_eight_percent: '0.0',
      excise_price_of_eight_percent_as_reduced_tax_rate: '0.0',
      excise_price_of_ten_percent: '135.0',
      subtotal_price: '1354.0',
      subtotal_of_untaxable_excise: '0.0',
      subtotal_of_non_taxable_excise: '0.0',
      subtotal_of_tax_exemption_excise: '0.0',
      subtotal_of_five_percent_excise: '0.0',
      subtotal_of_eight_percent_excise: '0.0',
      subtotal_of_eight_percent_as_reduced_tax_rate_excise: '0.0',
      subtotal_of_ten_percent_excise: '1354.0',
      subtotal_with_tax_of_untaxable_excise: '0.0',
      subtotal_with_tax_of_non_taxable_excise: '0.0',
      subtotal_with_tax_of_five_percent_excise: '0.0',
      subtotal_with_tax_of_tax_exemption_excise: '0.0',
      subtotal_with_tax_of_eight_percent_excise: '0.0',
      subtotal_with_tax_of_eight_percent_as_reduced_tax_rate_excise: '0.0',
      subtotal_with_tax_of_ten_percent_excise: '0.0',
      total_price: '1489.0',
      registration_code: 'T7480003001692',
      use_invoice_template: true,
    },
  ],
  pagination: {
    total_count: 1,
    total_pages: 1,
    per_page: 100,
    current_page: 1,
  },
};
```

例えば1件目の請求書データは `billings.data[0]` で取得できます。

## その他のサンプルコード

GitHubにサンプルコード(実装例)を公開しています。

https://github.com/wywy-llc/mf-Invoice-api-sample/blob/main/%E3%82%B3%E3%83%BC%E3%83%89.gs

## AIコーディングエージェントで使う

Claude Code / Codex 等のエージェントに、このライブラリを使ったコードを書かせる場合は以下を利用してください。

- [`examples/agent-context/AGENTS.md`](examples/agent-context/AGENTS.md) — 名前空間・認証の定型コード・6サービスの早見表・動作サンプルをまとめた配布用ファイル。利用者(ライブラリを追加する側)の GAS プロジェクトのリポジトリにコピーして使う(Claude Code なら `CLAUDE.md` から `@AGENTS.md` で import、Codex 等はファイル名のまま自動読込)
- [`examples/agent-context/mf-invoice-api.d.ts`](examples/agent-context/mf-invoice-api.d.ts) — 公開関数・型の統合 TypeScript 宣言。型補完・型チェックを使いたい場合に `AGENTS.md` と一緒にコピーする
- [`llms.txt`](llms.txt) / [`llms-full.txt`](llms-full.txt) — URLで渡して読み込ませる場合の索引・全文ドキュメント

## 問い合わせ

以下のメール、またはIssue登録でご連絡ください。

- FUJISAWA Yuki
- yuki_fujisawa@wywy.jp

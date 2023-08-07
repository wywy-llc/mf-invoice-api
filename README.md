# mf-invoice-api

MFクラウド請求書API v3 対応のGAS(Google Apps Script)クライアント

スクリプトID：`1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`

## 概要

- GAS(Google Apps Script)用のMFクラウド請求書APIv3用のAPIクライアントライブラリです。
- 0から自分で開発するよりも素早くAPI連携を実現できます。

## 実装状況

このライブラリの実装状況は以下、スプレッドシートにまとめてありますのでご確認ください。

https://docs.google.com/spreadsheets/d/1TN6DP0YYggmnanaSpYuf8Y2bEE6YBVCE-BV_17iW0VE/edit?usp=sharing

## スプレッドシートとGASの準備

このライブラリは、スプレッドシート + GASを前提として話を進めます。

この準備を省略する場合は、以下のURLより完成版をコピーしてください。
https://docs.google.com/spreadsheets/d/1tVfW1rHVow5GjmiuqtIpmDNxXp0AisnbvQ6eCdCEAWE/copy

### GASエディタを起動

1. Googleドライブで、スプレッドシートを新規作成
2. GASエディタの起動
    - メニュー > 拡張機能 > App Scriptをクリック
3. GASエディタの表示

### ライブラリ追加

このライブラリを利用するには、GASエディタで以下の設定をしてください。

1. ライブラリの "＋" をクリック
    - <img width="256" alt="スクリーンショット 2023-08-06 22 22 26" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/9d3aa366-f65e-41ee-aa31-22b9051686d9">
2. スクリプトIDに以下入力して検索する
    - `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`
    - <img width="256" alt="スクリーンショット 2023-08-06 22 26 40" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/d423222e-21f0-4324-ba31-6e7c8815663a">
3. 最新のバージョンを選択
4. 「追加」ボタンをクリック
5. 「MfInvoiceApi」というライブラリが追加

### 初期設定

1. 以下、`コード.gs` にコピー＆ペーストしてください。

```javascript
/**
 * 初期設定
 * ・トリガー設定
 */
function initialize() {
  // トリガー設定
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
 * MF請求書API認証ダイアログを表示します。
 */
function showMfApiAuthDialog() {
  const scriptProps = PropertiesService.getScriptProperties();
  const clientId = scriptProps.getProperty('CLIENT_ID');
  const clientSecret = scriptProps.getProperty('CLIENT_SECRET');
  MfInvoiceApi.showMfApiAuthDialog(clientId, clientSecret);
}

/**
 * MF認証のコールバック関数です。
 * @param request
 */
function mfCallback(request) {
  const scriptProps = PropertiesService.getScriptProperties();
  const clientId = scriptProps.getProperty('CLIENT_ID');
  const clientSecret = scriptProps.getProperty('CLIENT_SECRET');
  return MfInvoiceApi.mfCallback(request, clientId, clientSecret);
}
```

2. `initialize関数`を実行
    - トリガーを自動設定します。
    - このトリガーによってMF請求書API連携用のメニューをスプレッドシートのメニューに追加します。
3. `MF請求書API連携`メニューの表示
   - スプレッドシートの画面を再読み込みしてください。再読み込みすると、スプレッドシートの起動時にトリガーが実行されます。
   - `MF請求書API連携`メニューの表示されたらOKです。
   - <img width="500" alt="スクリーンショット 2023-08-07 8 23 06" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/c7dd2a57-1cae-4f31-bd4e-be687b859e85">

ここまでで、スプレッドシートとGASの準備が完了です。

次に、API認証に必要な`Client ID`と`Client Secret`をMFのアプリポータルから取得します。

## Client IDとClient Secretの取得

ここでは、MFのアプリポータルからAPI連携に必要な`Client ID`と`Client Secret`を取得し、GASのスクリプト プロパティに設定します。

1. MFのアプリポータルのアプリ新規登録画面に遷移
    -  <img width="500" alt="スクリーンショット 2023-08-06 22 54 48" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/72f8448b-b22e-4138-beb2-8a6b5fb0a527">
    - アプリ名称： [検証用]MFクライアント
    - リダイレクトURI： `https://script.google.com/macros/d/{SCRIPT ID}/usercallback`
        - 例：スクリプト IDが`1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D`の場合は、`https://script.google.com/macros/d/1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D/usercallback`
        - スクリプトIDは、GASエディタの `プロジェクト設定 > スクリプト ID`から取得してください。
            - <img width="500" alt="スクリーンショット 2023-08-06 22 51 51" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/52fb5c23-106d-4063-82d7-84973eafe119">
    - クライアント認証方式： `CLIENT_SECRET_POST` を選択してください。
2. アプリ詳細画面の`Client ID`と`Client Secret`をメモ
3. GASエディタのプロジェクト設定画面に遷移
    - <img width="256" alt="スクリーンショット 2023-08-06 22 38 17" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ed2fc686-399a-48a9-a413-c2442261d403"> 
4. スクリプト プロパティに`CLIENT_ID`と`CLIENT_SECRET`を追加
    - CLIENT_ID： MFアプリポータルの`Client ID`
    - CLIENT_SECRET： MFアプリポータルの`Client Secret`
    - <img width="500" alt="スクリーンショット 2023-08-06 22 39 43" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/1312398a-ca8b-4aa5-af6c-808f83bf9564">

## MFクラウド請求APIへの認証

ここまでで、接続に必要な環境と情報が揃ったので、MFクラウド請求APIに認証して接続します。

1. MFクラウド請求APIへの認証処理を開始
    - スプレッドシートメニュ  > MF請求書API連携 > 認証処理を開始する
    - <img width="300" alt="スクリーンショット 2023-08-07 8 35 50" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ae2320bb-29fd-41d4-a450-3373e0cb0c02">
2. Google権限を許可
3. `認証処理を開始する` を再実行する
4. MFクラウド請求APIのサイトで認証処理を継続する
    - <img width="256" alt="スクリーンショット 2023-08-07 8 40 32" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/5393fa9b-96f2-4bbd-8347-4f90c76afa0d">
    - `こちらをクリックして認証処理を継続してください` をクリックする
    - URLに認証に必要な情報が記載されています。
    - ここでエラーが発生する場合は、以下、確認してください。
      - リダイレクトURIが間違っていませんか？
        - 認証処理しているGASとMF請求書に登録したリダイレクトURIが不一致の場合があります。
      - クライアント認証方式で`CLIENT_SECRET_POST`を選択しましたか？
        - 初期値だと、`CLIENT_SECRET_BASIC` になっているので間違って設定する場合があります。
5. 認証が成功したことを確認
    - `認証成功しました。このタブを閉じてください。` と表示されたら認証完了です

## 事業者情報の取得を取得してみよう

1. 以下、`コード.gs` にコピー＆ペーストしてください。

```javascript
/**
 * MF請求書APIクライアントを生成します。
 * @returns {MfClient}
 */
function getMfClient_() {
  const scriptProps = PropertiesService.getScriptProperties();
  const clientId = scriptProps.getProperty('CLIENT_ID');
  const clientSecret = scriptProps.getProperty('CLIENT_SECRET');
  return MfInvoiceApi.createClient(clientId, clientSecret);
}

/**
 * 事業者情報の取得
 */
function getMyOffice() {
  // API実行： 事業者情報の取得
  const office = getMfClient_().office.getMyOffice();
  console.log(office);
}
```

2. getMyOffice関数を実行します。
3. 事業者情報が無事に取得できたことを確認する

Request success.と表示されたらOKです。

```
Request URL: https://invoice.moneyforward.com/api/v3/office
Request success.
{
  id: ...
}
```

### 事業者情報のデータ型

上記、`const office = getMfClient_().office.getMyOffice();` の変数officeには、以下のデータが格納されています。

```
  /**
   * Office
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Office
   */
  interface Office {
    id: string;
    name: string;
    zip: string;
    prefecture: string;
    address1: string;
    address2: string;
    tel: string;
    fax: string;
    office_type: string;
    office_code: string;
    registration_code: string;
    created_at: string;
    updated_at: string;
  }
```

例えば、name(事業者名) を取得したい場合は、`office.name` で取得することができます。

他のデータに関してもデータ型を公開しておりますので、データ型を確認する場合は、以下のURLから確認してください。

https://github.com/wywy-llc/mf-invoice-api/blob/main/src/%40types/mf-invoice-api.d.ts


## その他サンプルコード

以下、Githubにサンプルコード(実装例)がありますので、そちらもぜひ、参考にしてみてください。

https://github.com/wywy-llc/mf-Invoice-api-sample/blob/main/%E3%82%B3%E3%83%BC%E3%83%89.gs





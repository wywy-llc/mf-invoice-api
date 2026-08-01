# マネーフォワード クラウド請求書API v3 対応のGASクライアント

スクリプトID： `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`

## 概要

- マネーフォワード クラウド請求書API v3 用のGAS(Google Apps Script)クライアントライブラリです。
- ゼロから自分で開発するよりも素早くAPI連携を実現できます。

## ライブラリのリファレンス

[docs/reference.md](docs/reference.md)

## 開発方法を選ぶ

このライブラリは2通りの方法で利用できます。

| 方法 | コードを書く場所 | ライブラリの追加方法 |
| --- | --- | --- |
| A. GASエディタ | ブラウザのGASエディタ | ライブラリの「＋」で検索 |
| B. clasp | ローカルのリポジトリ | `appsscript.json` に記述 |

以下の手順は方法Aを基本に説明します。
方法Bの差分は各章の「claspの場合」に記載します。
型定義ファイルを使いたい場合は方法Bを選んでください。

## セットアップの流れ

1. スプレッドシートとGASを準備する
2. ライブラリを追加する
3. Client ID / Client Secret を設定する
4. 初期設定・認証する

## 1. スプレッドシートとGASを準備する

このライブラリはスプレッドシート + GAS の利用を前提とします。

### GASエディタを起動する

1. Googleドライブでスプレッドシートを新規作成する
2. GASエディタを起動する
   - メニュー > 拡張機能 > Apps Script をクリック
3. GASエディタが表示される

## 2. ライブラリを追加する

### GASエディタの場合

GASエディタで以下を設定します。

1. ライブラリの「＋」をクリック
   - <img width="256" alt="スクリーンショット 2023-08-06 22 22 26" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/9d3aa366-f65e-41ee-aa31-22b9051686d9">
2. スクリプトIDに以下を入力して検索する
   - `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`
   - <img width="256" alt="スクリーンショット 2023-08-06 22 26 40" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/d423222e-21f0-4324-ba31-6e7c8815663a">
3. 最新のバージョンを選択する
4. 「追加」ボタンをクリックする
5. 「MfInvoiceApi」というライブラリが追加される

### claspの場合

マニフェストにライブラリを記述します。

1. `srcDir` 配下の `appsscript.json` を開く
2. `dependencies.libraries` 配列の要素として以下を追加する
   - `libraries` 配列が無い場合は配列ごと作成してください。

```json
{
  "userSymbol": "MfInvoiceApi",
  "libraryId": "1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4",
  "version": "19",
  "developmentMode": false
}
```

3. `clasp push` で反映する

補足です。

- `userSymbol` がコード上の名前空間になります。
- `version` はGASライブラリのバージョン番号です。
- `19` は 2026-08-01 時点の最新版です。
- GitHubのリリースタグ(`v1.2.0` 等)とは別の番号です。
- 対応関係は[バージョン対応表](#バージョン対応表)を参照してください。
- `developmentMode` は `false` のままにしてください。

最新のバージョン番号は `clasp list-versions` で確認できます。
ライブラリのIDを書いた `.clasp.json` を用意して実行します。

```bash
mkdir -p /tmp/mf-lib && cd /tmp/mf-lib
echo '{"scriptId":"1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4","srcDir":"."}' > .clasp.json
clasp list-versions
```

閲覧権限がないアカウントでは失敗する場合があります。
そのときはGASエディタのライブラリ追加画面で確認してください。

## 3. Client ID / Client Secret を設定する

API連携にはMFアプリポータルで発行する `Client ID` と `Client Secret` が必要です。取得してGASのスクリプト プロパティに設定します。

1. MFアプリポータルのアプリ新規登録画面に遷移する
   - <img width="500" alt="スクリーンショット 2023-08-06 22 54 48" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/72f8448b-b22e-4138-beb2-8a6b5fb0a527">
   - アプリ名称: [検証用]MFクライアント
   - リダイレクトURI: `https://script.google.com/macros/d/{SCRIPT ID}/usercallback`
     - 例: スクリプトIDが `1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D` の場合、`https://script.google.com/macros/d/1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D/usercallback`
     - スクリプトIDは GASエディタの `プロジェクト設定 > スクリプト ID` から取得できます。
     - claspの場合は `.clasp.json` の `scriptId` が同じ値です。
     - ライブラリのスクリプトIDではない点にご注意ください。
       - <img width="500" alt="スクリーンショット 2023-08-06 22 51 51" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/52fb5c23-106d-4063-82d7-84973eafe119">
   - クライアント認証方式: `CLIENT_SECRET_POST` を選択する
2. アプリ詳細画面の `Client ID` と `Client Secret` を控える
3. GASエディタのプロジェクト設定画面に遷移する
   - <img width="256" alt="スクリーンショット 2023-08-06 22 38 17" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ed2fc686-399a-48a9-a413-c2442261d403">
4. スクリプト プロパティに `CLIENT_ID` と `CLIENT_SECRET` を追加する
   - CLIENT_ID: MFアプリポータルの `Client ID`
   - CLIENT_SECRET: MFアプリポータルの `Client Secret`
   - <img width="500" alt="スクリーンショット 2023-08-06 22 39 43" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/1312398a-ca8b-4aa5-af6c-808f83bf9564">

スクリプト プロパティは clasp から設定できません。
claspの場合もこの設定はGASエディタで行ってください。

## 4. 初期設定・認証する

1. GASエディタで `コード.gs` に以下をコピー&ペーストする
   - claspの場合はローカルの `.js` に書いて `clasp push` します。
   - 関数の実行はどちらの場合もGASエディタから行います。

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
            ScriptApp.newTrigger(fname)
              .forSpreadsheet(spreadsheet)
              .onOpen()
              .create();
        }
      }
    }
  };
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
  };
  const initSheets = () => {
    // シート作成
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

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
      range.setBackground('#bdbdbd');
      range.setValues([attrs]);

      // 不要な列を削除する
      if (attrs.length < sheet.getMaxColumns()) {
        sheet.deleteColumns(
          attrs.length + 1,
          sheet.getMaxColumns() - attrs.length
        );
      }
    }
  };
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
    .addItem('認証処理を開始する', 'showMfApiAuthDialog')
    .addItem('事業者情報を取得する', 'fetchOfficeInfo');
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
 * 事業者情報を取得して office シートに反映します。
 */
function fetchOfficeInfo() {
  const credentials = getMfCredentials_();
  const client = MfInvoiceApi.createClient(
    credentials.clientId,
    credentials.clientSecret
  );
  const office = client.office.getMyOffice();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('office');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => office[header]);
  sheet.getRange(2, 1, 1, row.length).setValues([row]);
}
```

2. `initialize` 関数を実行する
   - トリガー作成とシート作成が自動で行われます。
   - このトリガーにより、スプレッドシートのメニューに「MF請求書API連携」が追加されます。
3. 「MF請求書API連携」メニューを確認する
   - スプレッドシートの画面を再読み込みします。再読み込み時にトリガーが実行されます。
   - 「MF請求書API連携」メニューが表示されれば完了です。
   - <img width="500" alt="スクリーンショット 2023-08-07 8 23 06" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/c7dd2a57-1cae-4f31-bd4e-be687b859e85">
4. 認証処理を開始する
   - スプレッドシートメニュー > MF請求書API連携 > 認証処理を開始する
   - <img width="300" alt="スクリーンショット 2023-08-07 8 35 50" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ae2320bb-29fd-41d4-a450-3373e0cb0c02">
5. Google権限を許可する
6. 「認証処理を開始する」を再実行する
7. クラウド請求書APIのサイトで認証処理を継続する
   - <img width="256" alt="スクリーンショット 2023-08-07 8 40 32" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/5393fa9b-96f2-4bbd-8347-4f90c76afa0d">
   - 「こちらをクリックして認証処理を継続してください」をクリックする
   - URLに認証に必要な情報が記載されています。
   - エラーが発生する場合は以下を確認してください。
     - リダイレクトURIが正しいか
       - 認証処理しているGASとマネーフォワード クラウド請求書に登録したリダイレクトURIが不一致の場合があります。
     - クライアント認証方式で `CLIENT_SECRET_POST` を選択したか
       - 初期値は `CLIENT_SECRET_BASIC` のため、選択し忘れる場合があります。
8. 認証成功を確認する
   - 「認証成功しました。このタブを閉じてください。」と表示されれば認証完了です。

ここまでで、スプレッドシートとGASの準備・認証は完了です。

## 事業者情報を取得する

認証まで完了すると、`fetchOfficeInfo` 関数(「4. 初期設定・認証する」でコピペ済み)で事業者情報を取得できます。

1. スプレッドシートメニュー > MF請求書API連携 > 事業者情報を取得する、を実行する
2. `office` シートを開く
   - 2行目に `office.getMyOffice()` で取得した事業者情報が反映されていれば成功です。

`office.getMyOffice()` 自体の引数・戻り値の詳細は [docs/reference.md](docs/reference.md#getmyoffice) を参照してください。

## バージョン対応表

GASライブラリの版番号と npm の semver の対応です。
`appsscript.json` に書く番号は左列の値です。

| GAS版番号 | semver | 備考 |
| --- | --- | --- |
| 19 | v1.1.0 / v1.2.0 | 現在の最新版(v1.2.0は文書のみの更新) |

運用ルールは以下のとおりです。

- ライブラリ本体(`src/`)を変更した場合のみGAS版を作成します。
- 新しいGAS版を作成したら、この表に1行追加してください。
- ドキュメントのみの変更ではGAS版番号を上げません。
- その場合は semver だけを更新し、既存行に併記してください。

## その他のサンプルコード

GitHubにサンプルコード(実装例)を公開しています。

https://github.com/wywy-llc/mf-Invoice-api-sample/blob/main/%E3%82%B3%E3%83%BC%E3%83%89.gs

## AIコーディングエージェントで使う

Claude Code / Codex 等のエージェントに、このライブラリを使ったコードを書かせる場合は以下を利用してください。

- [`examples/agent-context/AGENTS.md`](examples/agent-context/AGENTS.md) — 名前空間・認証の定型コード・6サービスの早見表・動作サンプルをまとめた配布用ファイル。利用者(ライブラリを追加する側)の GAS プロジェクトのリポジトリにコピーして使う(Claude Code なら `CLAUDE.md` から `@AGENTS.md` で import、Codex 等はファイル名のまま自動読込)
- [`examples/agent-context/mf-invoice-api.d.ts`](examples/agent-context/mf-invoice-api.d.ts) — 公開関数・型の統合 TypeScript 宣言。型補完・型チェックを使いたい場合に `AGENTS.md` と一緒にコピーする(方法B専用。GASエディタでは読み込まれません)
- [`llms.txt`](llms.txt) / [`llms-full.txt`](llms-full.txt) — URLで渡して読み込ませる場合の索引・全文ドキュメント

## 問い合わせ

以下のメール、またはIssue登録でご連絡ください。

- FUJISAWA Yuki
- yuki_fujisawa@wywy.jp

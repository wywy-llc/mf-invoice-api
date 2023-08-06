# mf-invoice-api

MFクラウド請求書API v3 GAS(Google Apps Script)クライアント

## 概要

- GAS(Google Apps Script)用のMFクラウド請求書APIv3用のAPIクライアントライブラリです。
- 0から自分で開発するよりも素早くAPI連携を実現できます。

## セットアップ

### ライブラリ追加

このライブラリを利用するには、GASエディタで以下の設定をしてください。

1. ライブラリの "＋" をクリック
    - <img width="256" alt="スクリーンショット 2023-08-06 22 22 26" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/9d3aa366-f65e-41ee-aa31-22b9051686d9">
2. スクリプトIDに以下入力して検索する
    - `1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4`
    - <img width="256" alt="スクリーンショット 2023-08-06 22 26 40" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/d423222e-21f0-4324-ba31-6e7c8815663a">
3. 最新のバージョンを選択する
4. 「追加」ボタンをクリックする

### Client IDとClient Secretの取得

次に、API連携のClient IDとClient SecretをGASのスクリプト プロパティに設定します。

1. MFのアプリポータルのアプリ新規登録画面に遷移する。
    -  <img width="500" alt="スクリーンショット 2023-08-06 22 54 48" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/72f8448b-b22e-4138-beb2-8a6b5fb0a527">
    - アプリ名称： [検証用]MFクライアント
    - リダイレクトURI： `https://script.google.com/macros/d/{SCRIPT ID}/usercallback`
        - 例：スクリプト IDが`1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D`の場合は、`https://script.google.com/macros/d/1Yu-155Yao3Zzwv9fMR-axTKskkDEdngs-M3z1GhhG6dS2HK15rlod59D/usercallback`
        - スクリプトIDは、GASエディタの `プロジェクト設定 > スクリプト ID`から取得してください。
            - <img width="500" alt="スクリーンショット 2023-08-06 22 51 51" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/52fb5c23-106d-4063-82d7-84973eafe119">
    - クライアント認証方式： `CLIENT_SECRET_POST` を選択してください。
2. アプリ詳細画面の`Client ID`と`Client Secret`をメモする。
3. GASエディタのプロジェクト設定画面に遷移する。
    - <img width="256" alt="スクリーンショット 2023-08-06 22 38 17" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/ed2fc686-399a-48a9-a413-c2442261d403"> 
4. スクリプト プロパティに`CLIENT_ID`と`CLIENT_SECRET`を追加する。
    - CLIENT_ID： MFアプリポータルの`Client ID`
    - CLIENT_SECRET： MFアプリポータルの`Client Secret`
    - <img width="500" alt="スクリーンショット 2023-08-06 22 39 43" src="https://github.com/wywy-llc/mf-invoice-api/assets/10007402/1312398a-ca8b-4aa5-af6c-808f83bf9564">


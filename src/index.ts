/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfClient } from './lib/mf-client';
import { DateUtil } from './lib/date-util';
import { MfOAuth2 } from './lib/mf-oauth2';

//== 基本的な関数 ==//

/**
 * MF請求書APIクライアントを生成します。
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 * @returns {MfClient} MF請求書APIクライアント
 */
function createClient(clientId: string, clientSecret: string): MfClient {
  const mfOAuth2 = MfOAuth2.create(clientId, clientSecret);
  const accessToken = mfOAuth2.getMfService().getAccessToken();
  return new MfClient(accessToken);
}

/**
 * 日付操作用のユーティリティクラスを生成します。
 * @param {Date} baseDate
 * @returns {DateUtil} 日付操作用のユーティリティクラス
 */
function getDateUtil(baseDate: Date): DateUtil {
  return new DateUtil(baseDate);
}

/**
 * mfからログアウトします。
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 */
function logout(clientId: string, clientSecret: string) {
  const mfOAuth2 = MfOAuth2.create(clientId, clientSecret);
  try {
    mfOAuth2.logout();
  } catch (e) {
    console.info('未ログインのためログアウトできませんでした。');
  }
}

/**
 * MF認証のコールバック関数です。
 * @param {any} request リクエスト
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any, clientId: string, clientSecret: string) {
  const mfOAuth2 = new MfOAuth2(clientId, clientSecret);
  return mfOAuth2.handleCallback(request);
}

/**
 * MF請求書API認証ダイアログを表示します。
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 */
function showMfApiAuthDialog(clientId: string, clientSecret: string) {
  const result = Browser.msgBox(
    '認証処理を開始してよろしいでしょうか？',
    Browser.Buttons.OK_CANCEL
  );
  if (result === 'cancel') {
    return;
  }
  try {
    const mfOAuth2 = new MfOAuth2(clientId, clientSecret);
    mfOAuth2.logout();
  } catch (e) {
    /* empty */
  }
  const htmlOutput = HtmlService.createHtmlOutput(
    `<p><a href="${createMfAuthUrl(
      clientId,
      clientSecret
    )}" target="blank">こちらをクリックして認証処理を継続してください</a>
      <br>＊認証が完了したらこちらのウィンドウは閉じてください。</p>`
  )
    .setWidth(250)
    .setHeight(300);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'MF請求API認証');
}

/**
 * 認証URLを取得します。
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 */
function createMfAuthUrl(clientId: string, clientSecret: string) {
  const mfOAuth2 = MfOAuth2.create(clientId, clientSecret);
  const authUrl = mfOAuth2.getMfService().getAuthorizationUrl();
  console.info(authUrl);
  return authUrl;
}

/**
 * リダイレクトURIを取得します。
 * @returns {string} リダイレクトURI
 */
function getRedirectUri() {
  const scriptId = ScriptApp.getScriptId();
  return (
    'https://script.google.com/macros/d/' +
    encodeURIComponent(scriptId) +
    '/usercallback'
  );
}

/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfClient } from './lib/mf-client';
import { DateUtil } from './lib/date-util';
import { MfOAuth2 } from './lib/mf-oauth2';
import {
  BillingRangeKey,
  OrderStatus,
  PaymentStatus,
} from './service/service-base';

//== 基本的な関数 ==//

/**
 * MF請求書APIクライアントを生成します。
 * @param {string} clientId クライアントID
 * @param {string} clientSecret クライアントシークレット
 * @returns {MfInvoiceApi.MfClient} MF請求書APIクライアント
 */
function createClient(clientId: string, clientSecret: string): MfClient {
  const mfOAuth2 = MfOAuth2.create(clientId, clientSecret);
  const accessToken = mfOAuth2.getMfService().getAccessToken();
  return new MfClient(accessToken);
}

/**
 * 入金ステータスを取得します。
 * - default: '0', // 未設定
 * - not_payment: '1', // 未入金
 * - completed: '2', // 入金済
 * - unpaid: '3', // 未払い
 * - transferred: '4', // 振込済
 * @param status 入金ステータス
 * @returns 入金ステータス(数値)
 */
function getPaymentStatus(status: string): string {
  return PaymentStatus[status as keyof typeof PaymentStatus];
}

/**
 * 受注ステータスを取得します。
 * - failure: '-1', // 失注
 * - default: '0', // 未設定
 * - not_received: '1', // 未受注
 * - received: '2', // 受注済
 * @param status 受注ステータス
 * @returns 受注ステータス(数値)
 */
function getOrderStatus(status: string): string {
  return OrderStatus[status as keyof typeof OrderStatus];
}

/**
 * 日付操作用のユーティリティクラスを生成します。
 * @param {Date} baseDate
 * @returns {MfInvoiceApi.DateUtil} 日付操作用のユーティリティクラス
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
 * @returns {string} 認証URL
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

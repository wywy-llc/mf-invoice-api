/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfInvoiceClient } from './lib/mf-invoice-client';
import { DateUtil } from './lib/date-util';
import { MfOAuth2 } from './lib/mf-oauth2';

//== 基本的な関数 ==//

/**
 * MF請求書APIクライアントを生成します。
 * @returns {MfInvoiceClient}
 */
function create(clientId: string, clientSecret: string): MfInvoiceClient {
  const mfOAuth2 = MfOAuth2.create(clientId, clientSecret);
  const accessToken = mfOAuth2.getMfService().getAccessToken();
  return new MfInvoiceClient(accessToken);
}

/**
 * 日付操作用のユーティリティクラスを生成します。
 * @param baseDate 基準日
 * @returns {DateUtil} 日付操作用のユーティリティクラス
 */
function getDateUtil(baseDate: Date): DateUtil {
  return new DateUtil(baseDate);
}

/**
 * mfからログアウトします。
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
 * @param request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any, clientId: string, clientSecret: string) {
  const mfOAuth2 = new MfOAuth2(clientId, clientSecret);
  return mfOAuth2.handleCallback(request);
}

/**
 * MF請求書API認証ダイアログを表示します。
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

//== テスト用 ==//

// function testbillingsList() {
//   const baseDate = new Date();
//   const dateUtil: DateUtil = new DateUtil(baseDate);
//   const to = dateUtil.getEndDateNextMonth();
//   const from = dateUtil.getEndDateLastMonth();
//   const query = '入金済み';
//   const client = createClient();
//   console.log(createClient().billings.getBillings(from, to, query));
// }

// function testQuotesList() {
//   const baseDate = new Date();
//   const dateUtil: DateUtil = new DateUtil(baseDate);
//   const to = dateUtil.getEndDateNextMonth();
//   const from = dateUtil.getEndDateLastMonth();
//   const query = '';
//   console.log(createClient().quotes.getQuotes(from, to, query));
// }

// function testPartnersList() {
//   console.log(createClient().partners.getPartners());
// }

// function testItemList() {
//   console.log(createClient().items.getItems());
// }

// function testOffice() {
//   console.log(createClient().office.getMyOffice());
// }

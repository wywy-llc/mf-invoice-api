/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfInvoiceClient } from './lib/mf-invoice-client';
import { DateUtil } from './lib/date-util';
import { MfOAuthUtil } from './lib/mf-oauth-util';

//== 基本的な関数 ==//

function getMfClient_() {
  const accessToken = MfOAuthUtil.createService().getAccessToken();
  return new MfInvoiceClient(accessToken);
}

/**
 * MF認証のコールバック関数です。
 * @param request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any) {
  return MfOAuthUtil.handleCallback(request);
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
  const result = Browser.msgBox(
    '認証処理を開始してよろしいでしょうか？',
    Browser.Buttons.OK_CANCEL
  );
  if (result === 'cancel') {
    return;
  }
  try {
    MfOAuthUtil.logout();
  } catch (e) {
    /* empty */
  }

  const htmlOutput = HtmlService.createHtmlOutput(
    `<p><a href="${MfOAuthUtil.createService().getAuthorizationUrl()}" target="blank">こちらをクリックして認証処理を継続してください</a>
      <br>＊認証が完了したらこちらのウィンドウは閉じてください。</p>`
  )
    .setWidth(250)
    .setHeight(300);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'MF請求API認証');
}

//== テスト用 ==//

function authorizationUrl() {
  Logger.log(MfOAuthUtil.createService().getAuthorizationUrl());
}

function testbillingsList() {
  const baseDate = new Date();
  const dateUtil: DateUtil = new DateUtil(baseDate);
  const to = dateUtil.getEndDateNextMonth();
  const from = dateUtil.getEndDateLastMonth();
  const query = '入金済み';
  Logger.log(getMfClient_().billings.getBillings(from, to, query));
}

// function testQuotesList() {
//   Logger.log(getMfClient_().quotes.list());
// }

// function testPartnersList() {
//   Logger.log(getMfClient_().partners.list());
// }

// function testItemList() {
//   Logger.log(getMfClient_().items.list());
// }

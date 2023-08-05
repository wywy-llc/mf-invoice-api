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
function createClient(): MfInvoiceClient {
  const accessToken = MfOAuth2.getMfService().getAccessToken();
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
 * MF認証のコールバック関数です。
 * @param request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any) {
  return MfOAuth2.handleCallback(request);
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
    MfOAuth2.logout();
  } catch (e) {
    /* empty */
  }

  const htmlOutput = HtmlService.createHtmlOutput(
    `<p><a href="${createMfAuthUrl()}" target="blank">こちらをクリックして認証処理を継続してください</a>
      <br>＊認証が完了したらこちらのウィンドウは閉じてください。</p>`
  )
    .setWidth(250)
    .setHeight(300);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'MF請求API認証');
}

/**
 * 認証URLを取得します。
 */
function createMfAuthUrl() {
  console.log(MfOAuth2.getMfService().getAuthorizationUrl());
}

//== テスト用 ==//

function testbillingsList() {
  const baseDate = new Date();
  const dateUtil: DateUtil = new DateUtil(baseDate);
  const to = dateUtil.getEndDateNextMonth();
  const from = dateUtil.getEndDateLastMonth();
  const query = '入金済み';
  const client = createClient();
  console.log(createClient().billings.getBillings(from, to, query));
}

function testQuotesList() {
  const baseDate = new Date();
  const dateUtil: DateUtil = new DateUtil(baseDate);
  const to = dateUtil.getEndDateNextMonth();
  const from = dateUtil.getEndDateLastMonth();
  const query = '';
  console.log(createClient().quotes.getQuotes(from, to, query));
}

function testPartnersList() {
  console.log(createClient().partners.getPartners());
}

function testItemList() {
  console.log(createClient().items.getItems());
}

function testOffice() {
  console.log(createClient().office.getMyOffice());
}

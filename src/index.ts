/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfInvoiceClient } from './lib/mf-invoice-client';

//== 基本的な関数 ==//

function getMfClient_() {
  return new MfInvoiceClient();
}

/**
 * MF認証のコールバック関数です。
 * @param request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any) {
  getMfClient_().handleCallback(request);
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
 * GASに
 */
function showMfApiAuthDialog() {
  getMfClient_().showApiAuthDialog();
}

//== テスト用 ==//

function authorizationUrl() {
  Logger.log(getMfClient_().getAuthorizationUrl());
}

function testbillingsList() {
  Logger.log(getMfClient_().billings.list());
}

function testQuotesList() {
  Logger.log(getMfClient_().quotes.list());
}

function testPartnersList() {
  Logger.log(getMfClient_().partners.list());
}

function testItemList() {
  Logger.log(getMfClient_().items.list());
}

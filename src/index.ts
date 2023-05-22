/* eslint-disable @typescript-eslint/no-unused-vars */
import { MfInvoiceClient } from './app/mf-invoice-client';

function createClient_() {
  return new MfInvoiceClient();
}

function authorizationUrl() {
  Logger.log(createClient_().getAuthorizationUrl());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any) {
  createClient_().handleCallback(request);
}

function testbillingsList() {
  Logger.log(createClient_().billings.list());
}

//テスト用
function testQuotesList() {
  Logger.log(createClient_().quotes.list());
}

function testPartnersList() {
  Logger.log(createClient_().partners.list());
}

function testItemList() {
  Logger.log(createClient_().items.list());
}

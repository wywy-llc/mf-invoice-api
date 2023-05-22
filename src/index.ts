import { MfInvoiceClient } from './app/mf-invoice-client';

function createClient() {
  return new MfInvoiceClient();
}

function authorizationUrl() {
  Logger.log(createClient().getAuthorizationUrl());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mfCallback(request: any) {
  createClient().handleCallback(request);
}

declare namespace MfInvoiceApi {
  interface MfOAuth2 {
    getMfService(): OAuth2Service;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCallback(request: any): GoogleAppsScript.HTML.HtmlOutput;
    logout(): void;
    getAuthorizationUrl(): string;
  }
}

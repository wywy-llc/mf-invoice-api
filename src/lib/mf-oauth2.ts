export class MfOAuth2 {
  private clientId: string;
  private clientSecret: string;
  constructor(clientId: string, clientSecret: string) {
    if (!clientId || !clientSecret) {
      throw new Error(
        'スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。'
      );
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  static create(clientId: string, clientSecret: string) {
    return new MfOAuth2(clientId, clientSecret);
  }
  getMfService() {
    return OAuth2.createService('mf-invoice-client-v3')
      .setAuthorizationBaseUrl('https://api.biz.moneyforward.com/authorize')
      .setTokenUrl('https://api.biz.moneyforward.com/token')
      .setClientId(this.clientId)
      .setClientSecret(this.clientSecret)
      .setCallbackFunction('mfCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setCache(CacheService.getUserCache())
      .setLock(LockService.getUserLock())
      .setScope('mfc/invoice/data.write');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCallback(request: any) {
    return HtmlService.createHtmlOutput(
      this.getMfService().handleCallback(request)
        ? '認証成功しました。このタブを閉じてください。'
        : '認証に失敗しました。'
    );
  }

  logout() {
    this.getMfService().reset();
  }

  getAuthorizationUrl() {
    return this.getMfService().getAuthorizationUrl();
  }
}

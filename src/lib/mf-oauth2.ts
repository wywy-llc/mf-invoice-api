export class MfOAuth2 {
  static getMfService() {
    const clientId =
      PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
    if (!clientId) {
      throw new Error('スクリプトプロパティにCLIENT_IDを設定してください。');
    }
    const clientSecret =
      PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');
    if (!clientSecret) {
      throw new Error(
        'スクリプトプロパティにCLIENT_SECRETを設定してください。'
      );
    }
    return OAuth2.createService('moneyforward-v3')
      .setAuthorizationBaseUrl('https://api.biz.moneyforward.com/authorize')
      .setTokenUrl('https://api.biz.moneyforward.com/token')
      .setClientId(clientId)
      .setClientSecret(clientSecret)
      .setCallbackFunction('mfCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setCache(CacheService.getUserCache())
      .setScope('mfc/invoice/data.write');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handleCallback(request: any) {
    return HtmlService.createHtmlOutput(
      MfOAuth2.getMfService().handleCallback(request)
        ? '認証成功しました。このタブを閉じてください。'
        : '認証に失敗しました。'
    );
  }

  static logout() {
    MfOAuth2.getMfService().reset();
  }

  static getAuthorizationUrl() {
    return MfOAuth2.getMfService().getAuthorizationUrl();
  }
}

export class MfOAuthUtil {
  static createService() {
    const clientId =
      PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
    if (!clientId) {
      throw new Error('CLIENT_IDが設定されていません。');
    }
    const clientSecret =
      PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');
    if (!clientSecret) {
      throw new Error('CLIENT_SECRETが設定されていません。');
    }
    return OAuth2.createService('moneyforward-v3')
      .setAuthorizationBaseUrl('https://api.biz.moneyforward.com/authorize')
      .setTokenUrl('https://api.biz.moneyforward.com/token')
      .setClientId(clientId)
      .setClientSecret(clientSecret)
      .setCallbackFunction('mfCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope('mfc/invoice/data.write');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handleCallback(request: any) {
    return HtmlService.createHtmlOutput(
      MfOAuthUtil.createService().handleCallback(request)
        ? '認証成功しました。このタブを閉じてください。'
        : '認証に失敗しました。'
    );
  }

  static logout() {
    MfOAuthUtil.createService().reset();
  }

  static getAuthorizationUrl() {
    return MfOAuthUtil.createService().getAuthorizationUrl();
  }
}

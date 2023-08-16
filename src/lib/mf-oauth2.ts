export class MfOAuth2 {
  private clientId: string;
  private clientSecret: string;
  /**
   * コンストラクタ
   * @param {string} clientId MFのクライアントID
   * @param {string} clientSecret MFのクライアントシークレット
   */
  constructor(clientId: string, clientSecret: string) {
    if (!clientId || !clientSecret) {
      throw new Error(
        'スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。'
      );
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  /**
   * Mf用のOAuth2オブジェクトを生成します。
   * @param clientId MFのクライアントID
   * @param clientSecret MFのクライアントシークレット
   * @returns {MfInvoiceApi.MfOAuth2} MfOAuth2オブジェクト
   */
  static create(clientId: string, clientSecret: string): MfInvoiceApi.MfOAuth2 {
    return new MfOAuth2(clientId, clientSecret);
  }
  /**
   * OAuth2オブジェクトを取得します。
   * @returns {OAuth2} OAuth2オブジェクト
   */
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
  /**
   * MFからのコールバックリクエストを処理します。
   * @param {any} request コールバックリクエスト
   * @returns {GoogleAppsScript.HTML.HtmlOutput} HtmlOutput
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCallback(request: any) {
    return HtmlService.createHtmlOutput(
      this.getMfService().handleCallback(request)
        ? '認証成功しました。このタブを閉じてください。'
        : '認証に失敗しました。'
    );
  }

  /**
   * MF認証をリセットします。
   */
  logout() {
    this.getMfService().reset();
  }

  /**
   * MF認証用のURLを取得します。
   * @returns {string} MF認証用のURL
   */
  getAuthorizationUrl() {
    return this.getMfService().getAuthorizationUrl();
  }
}

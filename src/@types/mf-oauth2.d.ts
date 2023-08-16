declare namespace MfInvoiceApi {
  interface MfOAuth2 {
    /**
     * OAuth2オブジェクトを取得します。
     * @returns {OAuth2} OAuth2オブジェクト
     */
    getMfService(): OAuth2.OAuth2Service;
    /**
     * MFからのコールバックリクエストを処理します。
     * @param {any} request コールバックリクエスト
     * @returns {GoogleAppsScript.HTML.HtmlOutput} HtmlOutput
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCallback(request: any): GoogleAppsScript.HTML.HtmlOutput;
    /**
     * MF認証をリセットします。
     */
    logout(): void;
    /**
     * MF認証用のURLを取得します。
     * @returns {string} MF認証用のURL
     */
    getAuthorizationUrl(): string;
  }
}

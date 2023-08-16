declare namespace MfInvoiceApi {
  /**
   * MF請求書APIクライアントを生成します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   * @returns {MfInvoiceApi.MfClient} MF請求書APIクライアント
   */
  declare function createClient(
    clientId: string,
    clientSecret: string
  ): MfInvoiceApi.MfInvoiceClient;
  /**
   * 日付操作用のユーティリティクラスを生成します。
   * @param {Date} baseDate
   * @returns {DateUtil} 日付操作用のユーティリティクラス
   */
  declare function getDateUtil(baseDate: Date): DateUtil;
  /**
   * mfからログアウトします。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function logout(clientId: string, clientSecret: string): void;
  /**
   * MF認証のコールバック関数です。
   * @param {any} request リクエスト
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function mfCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any,
    clientId: string,
    clientSecret: string
  ): GoogleAppsScript.HTML.HtmlOutput;
  /**
   * MF請求書API認証ダイアログを表示します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function showMfApiAuthDialog(
    clientId: string,
    clientSecret: string
  ): void;
  /**
   * 認証URLを取得します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function createMfAuthUrl(
    clientId: string,
    clientSecret: string
  ): string;
  /**
   * リダイレクトURIを取得します。
   * @returns {string} リダイレクトURI
   */
  declare function getRedirectUri(): string;
}

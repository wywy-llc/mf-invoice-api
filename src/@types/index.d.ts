declare namespace MfInvoiceApi {
  /**
   * MF請求書APIクライアントを生成します。
   * @returns {MfInvoiceClient}
   */
  declare function createClient(
    clientId: string,
    clientSecret: string
  ): MfInvoiceClient;
  /**
   * 日付操作用のユーティリティクラスを生成します。
   * @param baseDate 基準日
   * @returns {DateUtil} 日付操作用のユーティリティクラス
   */
  declare function getDateUtil(baseDate: Date): DateUtil;
  /**
   * mfからログアウトします。
   */
  declare function logout(clientId: string, clientSecret: string): void;
  /**
   * MF認証のコールバック関数です。
   * @param request
   */
  declare function mfCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any,
    clientId: string,
    clientSecret: string
  ): GoogleAppsScript.HTML.HtmlOutput;
  /**
   * MF請求書API認証ダイアログを表示します。
   */
  declare function showMfApiAuthDialog(
    clientId: string,
    clientSecret: string
  ): void;
  /**
   * 認証URLを取得します。
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

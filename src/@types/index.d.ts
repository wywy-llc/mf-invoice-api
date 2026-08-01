/**
 * Copyright 2026 wywy LLC and contributors
 */
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
  ): MfInvoiceApi.MfClient;
  /**
   * 入金ステータスを取得します。
   * - default: '0', // 未設定
   * - not_payment: '1', // 未入金
   * - completed: '2', // 入金済
   * - unpaid: '3', // 未払い
   * - transferred: '4', // 振込済
   * @param {string} status 入金ステータス
   * @returns {string} 入金ステータス(数値)
   */
  declare function getPaymentStatus(status: string): string;
  /**
   * 受注ステータスを取得します。
   * - failure: '-1', // 失注
   * - default: '0', // 未設定
   * - not_received: '1', // 未受注
   * - received: '2', // 受注済
   * @param {string} status 受注ステータス
   * @returns {string} 受注ステータス(数値)
   */
  declare function getOrderStatus(status: string): string;
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
  /**
   * リクエストURLの実行ログ出力を切り替えます(既定は出力あり)。
   * getAll()のようなページング処理ではリクエスト数だけログが増えるため、
   * ログを抑えたい場合に false を指定します。
   * @param {boolean} enabled 出力する場合はtrue
   */
  declare function setRequestLogEnabled(enabled: boolean): void;
}

/// <reference types="google-apps-script" />
declare namespace MfInvoiceApi {
  /**
   * 請求の期間絞込対象
   */
  export declare const BillingRangeKey: {
    readonly billing_date: 'billing_date';
    readonly due_date: 'due_date';
    readonly sales_date: 'sales_date';
    readonly created_at: 'created_at';
    readonly updated_at: 'updated_at';
  };
  export type BillingRangeKey =
    (typeof BillingRangeKey)[keyof typeof BillingRangeKey];
  /**
   * 見積の期間絞込対象
   */
  export declare const QuoteRangeKey: {
    readonly quote_date: 'quote_date';
    readonly expired_date: 'expired_date';
    readonly created_at: 'created_at';
    readonly updated_at: 'updated_at';
  };
  export type QuoteRangeKey =
    (typeof QuoteRangeKey)[keyof typeof QuoteRangeKey];
  export declare const ReqMethod: {
    readonly get: 'get';
    readonly post: 'post';
    readonly put: 'put';
    readonly delete: 'delete';
  };
  export type ReqMethod = (typeof ReqMethod)[keyof typeof ReqMethod];
  /**
   * 税率
   */
  export declare const Excise: {
    untaxable: 'untaxable'; // 不課税
    non_taxable: 'non_taxable'; // 非課税
    tax_exemption: 'tax_exemption'; // 免税
    five_percent: 'five_percent'; // 5%
    eight_percent: 'eight_percent'; // 8%
    eight_percent_as_reduced_tax_rate: 'eight_percent_as_reduced_tax_rate'; // 8%(軽減税率)
    ten_percent: 'ten_percent'; // 10%
  };
  export type Excise = (typeof Excise)[keyof typeof Excise];
  /**
   * サービスの基底クラス
   */
  interface ServiceBase {
    /**
     * リクエストを送信する
     * @param reqUrl リクエストURL
     * @param method リクエストメソッド
     * @param payload リクエストボディ
     * @returns
     */
    fetch(
      reqUrl: string,
      method: GoogleAppsScript.URL_Fetch.HttpMethod,
      payload?: string
    ): GoogleAppsScript.URL_Fetch.HTTPResponse;
    /**
     * レスポンスを処理する
     * @param res レスポンス
     * @returns レスポンスのオブジェクト
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processResponse(res: GoogleAppsScript.URL_Fetch.HTTPResponse): any;
    /**
     * 認証情報を含んだリクエストヘッダーを取得する。
     * @returns リクエストヘッダー
     */
    getHeaders(): GoogleAppsScript.URL_Fetch.HttpHeaders;
  }
}

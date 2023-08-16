/// <reference types="google-apps-script" />
declare namespace MfInvoiceApi {
  /**
   * 入金ステータス
   */
  export declare const PaymentStatus: {
    readonly default: '0'; // 未設定
    readonly not_payment: '1'; // 未入金
    readonly completed: '2'; // 入金済
    readonly unpaid: '3'; // 未払い
    readonly transferred: '4'; // 振込済
  };

  export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];

  /**
   * 受注ステータス
   */
  export declare const OrderStatus: {
    readonly failure: '-1'; // 失注
    readonly default: '0'; // 未設定
    readonly not_received: '1'; // 未受注
    readonly received: '2'; // 受注済
  };

  export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
  /**
   * 請求の期間絞込対象
   */
  export declare const BillingRangeKey: {
    readonly billing_date: 'billing_date'; // 請求日
    readonly due_date: 'due_date'; // 支払期日
    readonly sales_date: 'sales_date'; // 売上計上日
    readonly created_at: 'created_at'; // 作成日
    readonly updated_at: 'updated_at'; // 更新日
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
  /**
   * 税率
   */
  export declare const Excise: {
    readonly untaxable: 'untaxable';
    readonly non_taxable: 'non_taxable';
    readonly tax_exemption: 'tax_exemption';
    readonly five_percent: 'five_percent';
    readonly eight_percent: 'eight_percent';
    readonly eight_percent_as_reduced_tax_rate: 'eight_percent_as_reduced_tax_rate';
    readonly ten_percent: 'ten_percent';
  };
  export type Excise = (typeof Excise)[keyof typeof Excise];
  export declare const ReqMethod: {
    readonly get: 'get';
    readonly post: 'post';
    readonly put: 'put';
    readonly delete: 'delete';
  };
  export type ReqMethod = (typeof ReqMethod)[keyof typeof ReqMethod];
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

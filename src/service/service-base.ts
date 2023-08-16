/**
 * 入金ステータス
 */
export const PaymentStatus = {
  default: '0', // 未設定
  not_payment: '1', // 未入金
  completed: '2', // 入金済
  unpaid: '3', // 未払い
  transferred: '4', // 振込済
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * 受注ステータス
 */
export const OrderStatus = {
  failure: '-1', // 失注
  default: '0', // 未設定
  not_received: '1', // 未受注
  received: '2', // 受注済
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * 請求の期間絞込対象
 */
export const BillingRangeKey = {
  billing_date: 'billing_date', // 請求日
  due_date: 'due_date', // 支払期日
  sales_date: 'sales_date', // 売上計上日
  created_at: 'created_at', // 作成日
  updated_at: 'updated_at', // 更新日
} as const;

export type BillingRangeKey =
  (typeof BillingRangeKey)[keyof typeof BillingRangeKey];

/**
 * 見積の期間絞込対象
 */
export const QuoteRangeKey = {
  quote_date: 'quote_date', // 見積日
  expired_date: 'expired_date', // 有効期限
  created_at: 'created_at', // 作成日
  updated_at: 'updated_at', // 更新日
} as const;

export type QuoteRangeKey = (typeof QuoteRangeKey)[keyof typeof QuoteRangeKey];

/**
 * 税率
 */
export const Excise = {
  untaxable: 'untaxable', // 不課税
  non_taxable: 'non_taxable', // 非課税
  tax_exemption: 'tax_exemption', // 免税
  five_percent: 'five_percent', // 5%
  eight_percent: 'eight_percent', // 8%
  eight_percent_as_reduced_tax_rate: 'eight_percent_as_reduced_tax_rate', // 8%(軽減税率)
  ten_percent: 'ten_percent', // 10%
} as const;

export type Excise = (typeof Excise)[keyof typeof Excise];

export const ReqMethod = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
} as const;

export type ReqMethod = (typeof ReqMethod)[keyof typeof ReqMethod];

/**
 * サービスの基底クラス
 */
export class ServiceBase {
  /**
   * APIのベースURL
   */
  static readonly API_BASE_URL = 'https://invoice.moneyforward.com/api/v3';

  /**
   * アクセストークン
   */
  private accessToken: string;

  /**
   *  コンストラクタ
   * @param accessToken アクセストークン
   */
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

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
    payload: string = ''
  ) {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: method,
      muteHttpExceptions: true,
      headers: this.getHeaders(),
    };
    if ((method === 'post' || method === 'put') && payload) {
      options.payload = payload;
      options.contentType = 'application/json';
    }
    console.info('Request URL: ' + reqUrl);
    const res = UrlFetchApp.fetch(reqUrl, options);
    return res;
  }

  /**
   * レスポンスを処理する
   * @param res レスポンス
   * @returns レスポンスのオブジェクト
   */
  processResponse(res: GoogleAppsScript.URL_Fetch.HTTPResponse) {
    if (
      res.getResponseCode() === 200 ||
      res.getResponseCode() === 201 ||
      res.getResponseCode() === 204
    ) {
      console.info('Request success.');
      if (res.getContentText()) {
        return JSON.parse(res.getContentText());
      }
      return true;
    } else {
      console.error('Request failed.');
      throw new Error(
        `Request Failed !!. ${res.getResponseCode()}: ${res.getContentText()}`
      );
    }
  }
  /**
   * 認証情報を含んだリクエストヘッダーを取得する。
   * @returns リクエストヘッダー
   */
  getHeaders(): GoogleAppsScript.URL_Fetch.HttpHeaders {
    return {
      accept: 'application/json',
      Authorization: 'Bearer ' + this.accessToken,
    };
  }
}

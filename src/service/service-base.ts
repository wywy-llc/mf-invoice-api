/**
 * 請求の期間絞込対象
 */
export const BillingRangeKey = {
  billing_date: 'billing_date',
  due_date: 'billing_date',
  sales_date: 'sales_date',
  created_at: 'created_at',
  updated_at: 'updated_at',
} as const;

export type BillingRangeKey =
  (typeof BillingRangeKey)[keyof typeof BillingRangeKey];

/**
 * 見積の期間絞込対象
 */
export const QuoteRangeKey = {
  quote_date: 'quote_date',
  expired_date: 'expired_date',
  created_at: 'created_at',
  updated_at: 'updated_at',
} as const;

export type QuoteRangeKey = (typeof QuoteRangeKey)[keyof typeof QuoteRangeKey];

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
    if (method === 'post') {
      options.payload = payload;
      options.contentType = 'application/json';
    }
    const res = UrlFetchApp.fetch(reqUrl, options);
    return res;
  }

  /**
   * レスポンスを処理する
   * @param res レスポンス
   * @returns レスポンスのオブジェクト
   */
  processResponse(res: GoogleAppsScript.URL_Fetch.HTTPResponse) {
    if (res.getResponseCode() === 200 || res.getResponseCode() === 201) {
      Logger.log('Request success.');
      return JSON.parse(res.getContentText());
    } else {
      Logger.log('Request failed.');
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

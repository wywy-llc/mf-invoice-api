/**
 * Copyright 2026 wywy LLC and contributors
 */
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
   * アクセストークンを取得する関数。リクエストの都度呼び出すことで、
   * OAuth2ライブラリ側の有効期限チェック・自動リフレッシュに追従させる。
   */
  private getAccessToken: () => string;

  /**
   *  コンストラクタ
   * @param getAccessToken アクセストークンを取得する関数
   */
  constructor(getAccessToken: () => string) {
    if (typeof getAccessToken !== 'function') {
      throw new Error('accessToken is required.');
    }
    this.getAccessToken = getAccessToken;
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
    const res = UrlFetchApp.fetch(reqUrl, options);
    if (res.getResponseCode() >= 400) {
      // 機密情報を含むクエリ文字列を除いたパスのみを記録し、障害調査時の到達性を確保する
      console.error(`Request failed: ${method} ${reqUrl.split('?')[0]}`);
    }
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
      const contentText = res.getContentText();
      if (contentText) {
        try {
          return JSON.parse(contentText);
        } catch {
          throw new Error(
            `Response body is not valid JSON !!. ${res.getResponseCode()}: ${contentText}`
          );
        }
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
      Authorization: 'Bearer ' + this.getAccessToken(),
    };
  }

  /**
   * リクエストを送信し、レスポンスを処理した結果を返す。
   * 各サービスで重複していた「fetch → processResponse」の定型パターンを集約したヘルパー
   * @param reqUrl リクエストURL
   * @param method リクエストメソッド
   * @param payload リクエストボディ
   * @returns レスポンスを処理した結果
   */
  protected request<T>(
    reqUrl: string,
    method: GoogleAppsScript.URL_Fetch.HttpMethod,
    payload?: string
  ): T {
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res) as T;
  }

  /**
   * 値が空でないクエリパラメータのみをURLに付与する
   * @param reqUrl 元のリクエストURL
   * @param query 付与するクエリ(値が空の場合は付与しない)
   * @returns クエリを付与したURL
   */
  protected appendQuery(
    reqUrl: string,
    query: Record<string, string | undefined>
  ): string {
    let result = reqUrl;
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        result += `&${key}=${encodeURIComponent(value)}`;
      }
    }
    return result;
  }

  /**
   * 期間・検索文字列・ページングで絞り込む一覧取得リクエストを送信する
   * (billing/quoteのgetBillings・getQuotesで共通の実装)
   * @param baseUrl リソースのベースURL
   * @param from 検索範囲_開始日
   * @param to 検索範囲_終了日
   * @param query 検索文字列
   * @param page ページ番号
   * @param perPage 1ページあたりの件数
   * @param rangeKey 検索範囲キー
   * @param extraQuery 追加の絞込クエリ(値が空の場合は付与しない)
   * @returns レスポンスを処理した結果
   */
  protected fetchListWithRange<T>(
    baseUrl: string,
    from: string,
    to: string,
    query: string,
    page: number,
    perPage: number,
    rangeKey: string,
    extraQuery?: Record<string, string | undefined>
  ): T {
    const reqUrl = this.appendQuery(
      `${baseUrl}?page=${page}&per_page=${perPage}&range_key=${rangeKey}&from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}&q=${encodeURIComponent(query)}`,
      extraQuery ?? {}
    );
    return this.request<T>(reqUrl, ReqMethod.get);
  }
}

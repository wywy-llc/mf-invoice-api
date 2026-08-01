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
   * リクエストURLを実行ログへ出力するかどうか(既定は出力する)。
   * getAll()のようなページング処理ではリクエスト数だけログが増えるため、
   * MfInvoiceApi.setRequestLogEnabled()で利用者側から抑止できるようにしている。
   */
  static requestLogEnabled: boolean = true;

  /**
   * encodeURIComponentの出力形式(unreserved文字と%XX列のみ)。
   * これに合致しない文字列は、区切り文字などの生文字を含むためエンコード済みではないと判定する。
   */
  private static readonly ENCODED_QUERY_PATTERN =
    /^(?:[A-Za-z0-9\-_.!~*'()]|%[0-9A-Fa-f]{2})*$/;

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
    // GASの実行ログから実際のリクエスト内容を追跡できるようにする
    // - 認証情報はgetHeadersが組み立てるoptions.headers側のため、このログには出力されない
    // - URLのクエリ文字列に含まれる検索語・各種IDは実行ログに残る
    // - ログ量が問題になる利用者はrequestLogEnabledで抑止できる
    if (ServiceBase.requestLogEnabled) {
      console.info(`Request URL: ${method} ${reqUrl}`);
    }
    const res = UrlFetchApp.fetch(reqUrl, options);
    if (res.getResponseCode() >= 400) {
      // 検索語などの機密性が高いクエリ文字列を除き、失敗の事実とパスのみ記録する
      // (クエリ込みの全体は、有効時のみ出力される送信前のRequest URLログ側にある)
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
   * 検索文字列をURLエンコードする。エンコード済みの文字列はそのまま返す。
   *
   * 生の文字列を渡す利用者と、旧実装(エンコードせずURLへ埋め込んでいた頃)に合わせて
   * 呼び出し側でエンコード済みの文字列を渡す利用者の双方を壊さないための互換措置。
   * - 判定条件: エンコード形式に合致し、かつデコードで値が変わる場合のみエンコード済みとみなす
   * - 形式判定が必要な理由: `a%3Db&c=1` のように区切り文字の生文字が混じる文字列をそのまま送ると、
   *   `&c=1` が独立したクエリパラメータとして解釈されURL構造が壊れる
   * - 残る制約: `50%20OFF` のようにエンコード形式と一致する生文字列は誤判定する
   * - 回避策: 生文字列として検索する場合は `%` を `%25` にエスケープして渡す
   *
   * @param query 検索文字列
   * @returns URLエンコード済みの検索文字列
   */
  protected encodeSearchQuery(query: string): string {
    if (ServiceBase.ENCODED_QUERY_PATTERN.test(query)) {
      try {
        if (decodeURIComponent(query) !== query) {
          return query;
        }
      } catch {
        // 単独サロゲート等、形式は正しくてもデコードできない文字列は通常どおりエンコードする
      }
    }
    return encodeURIComponent(query);
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
   * @param query 検索文字列(URLエンコード済みの文字列を渡しても二重エンコードしない。
   * ただし`50%20OFF`のようにエンコード形式と一致する生文字列は誤判定するため、`%`は`%25`にエスケープして渡す)
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
      )}&to=${encodeURIComponent(to)}&q=${this.encodeSearchQuery(query)}`,
      extraQuery ?? {}
    );
    return this.request<T>(reqUrl, ReqMethod.get);
  }
}

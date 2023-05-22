/**
 * マネーフォワード請求API用クライアント
 * ■ Money Forward Invoice API
 * https://invoice.moneyforward.com/docs/api/v3/index.html#/
 */
export class MfInvoiceClient {
  private baseUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public billings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public quotes: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public partners: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public items: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public office: any;

  /**
   * コンストラクタ
   */
  constructor() {
    this.baseUrl = 'https://invoice.moneyforward.com/api/v3/';
    this.initApiMethod();
  }
  /**
   * API系のメソッドを生成します。
   */
  initApiMethod() {
    /**
     * 請求書関連
     */
    this.billings = {
      /**
       * 一覧取得
       */
      list: (): Billings => {
        const reqUrl = this.baseUrl + 'billings';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
          reqUrl,
          options
        );
        return this.processResponse(method, reqUrl, res);
      },
      /**
       * 検索
       * @param {string} query 検索文字列。取引先(完全一致)、ステータス、件名etc
       * @param {string} from 開始日
       * @param {string} to 終了日
       */
      // search: (query: string, from: string, to: string): Billings => {
      //   const reqUrl = this.baseUrl + 'billings';
      //   const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
      //   const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      //     method: method,
      //     muteHttpExceptions: true,
      //     headers: this.getHeaders(),
      //   };
      //   const res: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
      //     reqUrl,
      //     options
      //   );
      //   const billings: Billings = this.processResponse(method, reqUrl, res);
      //   if (billings.data) {
      //     billings.data = billings.data.filter(billing => {
      //       //
      //       return billing.payment_status === query;
      //     });
      //   }
      //   return billings;
      // },
      /**
       * 作成
       */
      create: (billing: Billing) => {
        const reqUrl = this.baseUrl + 'invoice_template_billings';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'post';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          payload: JSON.stringify(billing),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(billing);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
    };
    /**
     * 見積書関連
     */
    this.quotes = {
      /**
       * 一覧取得
       */
      list: (): Quotes => {
        const reqUrl = this.baseUrl + 'quotes';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
      /**
       * 作成
       */
      create: (quote: Quote): Quote => {
        const reqUrl = this.baseUrl + 'quotes';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'post';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          payload: JSON.stringify(quote),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(quote);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
      // pdf: id => {
      //   const reqUrl = this.baseUrl + 'quotes/' + id + '.pdf';
      //   const method = 'GET';
      //   const options = {
      //     method: method,
      //     headers: {
      //       Authorization: 'Bearer ' + this.getAccessToken(),
      //     },
      //   };
      //   return UrlFetchApp.fetch(reqUrl, options).getAs('application/pdf');
      // },
    };
    /**
     * 取引先関連
     */
    this.partners = {
      /**
       * 一覧取得
       */
      list: (page = 1, perPage = 100) => {
        const reqUrl =
          this.baseUrl + `partners?page=${page}&per_page=${perPage}`;
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
      /**
       * 作成
       */
      create: (partner: Partner) => {
        const reqUrl = this.baseUrl + 'partners';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'post';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          payload: JSON.stringify(partner),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(partner);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
    };
    /**
     * 品目関連
     */
    this.items = {
      /**
       * 一覧取得
       */
      list: () => {
        const reqUrl = this.baseUrl + 'items';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
      /**
       * 作成
       */
      create: (item: Item) => {
        const reqUrl = this.baseUrl + 'items';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'post';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          payload: JSON.stringify(item),
          contentType: 'application/json',
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        Logger.log(item);
        const res = UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
    };
    /**
     * 事業者情報取得
     */
    this.office = {
      /**
       * 一覧取得
       */
      find: () => {
        const reqUrl = this.baseUrl + 'office';
        const method: GoogleAppsScript.URL_Fetch.HttpMethod = 'get';
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          method: method,
          muteHttpExceptions: true,
          headers: this.getHeaders(),
        };
        const res = UrlFetchApp.fetch(reqUrl, options);
        UrlFetchApp.fetch(reqUrl, options);
        return this.processResponse(method, reqUrl, res);
      },
    };
  }
  processResponse(
    method: string,
    reqUrl: string,
    res: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) {
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

  getAuthorizationUrl() {
    return this.getService().getAuthorizationUrl();
  }

  getService() {
    const clientId =
      PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
    if (!clientId) {
      throw new Error('CLIENT_IDが設定されていません。');
    }
    const clientSecret =
      PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');
    if (!clientSecret) {
      throw new Error('CLIENT_SECRETが設定されていません。');
    }
    return OAuth2.createService('moneyforward-v3')
      .setAuthorizationBaseUrl('https://api.biz.moneyforward.com/authorize')
      .setTokenUrl('https://api.biz.moneyforward.com/token')
      .setClientId(clientId)
      .setClientSecret(clientSecret)
      .setCallbackFunction('mfCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope('mfc/invoice/data.write');
  }

  getAccessToken() {
    return this.getService().getAccessToken();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCallback(request: any) {
    return HtmlService.createHtmlOutput(
      this.getService().handleCallback(request)
        ? '認証成功しました。このタブを閉じてください。'
        : '認証に失敗しました。'
    );
  }

  getHeaders(): GoogleAppsScript.URL_Fetch.HttpHeaders {
    return {
      accept: 'application/json',
      Authorization: 'Bearer ' + this.getAccessToken(),
    };
  }

  logout() {
    this.getService().reset();
  }
}

// function testSeachBillings() {
//   const page = 1;
//   const query = encodeURI('入金済み');
//   const to = getThisMonthLastDay();
//   let from = new Date();
//   from.setDate(1);
//   from.setHours(0);
//   from.setMinutes(0);
//   from.setSeconds(0);
//   from.setMonth(from.getMonth() - 3);
//   from = convertDateToString(from)
//   Logger.log(JSON.stringify(createClient().billings.search(page, query, from, to)));
// }

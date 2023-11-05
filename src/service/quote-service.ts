import { QuoteRangeKey, ReqMethod, ServiceBase } from './service-base';

export class QuoteService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/quotes';

  /**
   * 見積書一覧の取得
   * @param {string} from 検索範囲_開始日
   * @param {string} to 検索範囲_終了日
   * @param {string} query 検索文字列
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりのデータ数
   * @param {QuoteRangeKey} rangeKey 検索範囲_キー
   * - billing_date: 請求日
   * - due_date: 支払期日
   * - sales_date: 売上日
   * - created_at: 作成日
   * - updated_at: 更新日
   * @returns {MfInvoiceApi.QuotesResponse} 見積書レスポンス
   */
  getQuotes(
    from: string,
    to: string,
    query: string = '',
    page: number = 1,
    perPage: number = 100,
    rangeKey: QuoteRangeKey = 'quote_date'
  ): MfInvoiceApi.QuotesResponse {
    if (!from || !to) {
      throw new Error('from and to are required.');
    }
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}&range_key=${rangeKey}&from=${from}&to=${to}&q=${query}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書の作成
   * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
   * @returns {MfInvoiceApi.Quote} 見積書
   */
  createNew(quoteReqBody: MfInvoiceApi.QuoteReqBody): MfInvoiceApi.Quote {
    if (!quoteReqBody) {
      throw new Error('quoteReqBody is required.');
    }
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(quoteReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 見積書の取得
   * @param {string} quoteId 見積書ID
   * @returns {MfInvoiceApi.Quote} 見積書
   */
  getQuote(quoteId: String): MfInvoiceApi.Quote {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書の更新
   * @param {string} quoteId 見積書ID
   * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
   * @returns {MfInvoiceApi.Quote} 見積書
   */
  updateQuote(
    quoteId: string,
    quoteReqBody: MfInvoiceApi.QuoteReqBody
  ): MfInvoiceApi.Quote {
    if (!quoteId || !quoteReqBody) {
      throw new Error('quoteId and quoteReqBody are required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}`;
    const method = ReqMethod.put;
    const payload = JSON.stringify(quoteReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 見積書の削除
   * @param {string} quoteId 見積書ID
   * @returns {boolean} 削除成功時はtrue
   */
  deleteQuote(quoteId: string): boolean {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書に紐づく品目一覧の取得
   * @param {string} quoteId 見積書ID
   * @returns {MfInvoiceApi.QuoteItemResponse} 見積書品目レスポンス
   */
  getQuoteItems(quoteId: string): MfInvoiceApi.QuoteItemResponse {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/items`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書に紐づく品目を取得
   * @param {string} quoteId 見積書ID
   * @param {string} itemId 品目ID
   * @returns {MfInvoiceApi.Item} 品目
   */
  getQuoteItem(quoteId: string, itemId: string): MfInvoiceApi.Item {
    if (!quoteId || !itemId) {
      throw new Error('quoteId and itemId are required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/items/${itemId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書に品目を追加
   * @param {string} quoteId 見積書ID
   * @param {MfInvoiceApi.QuoteItemReqBody} quoteItemReqBody 見積書品目リクエストボディ
   * @returns {boolean} 成功時はtrue
   */
  attachQuoteItem(
    quoteId: string,
    quoteItemReqBody: MfInvoiceApi.QuoteItemReqBody
  ): boolean {
    if (!quoteId || !quoteItemReqBody) {
      throw new Error('quoteId and quoteItemReqBody are required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/items`;
    const method = ReqMethod.post;
    const payload = JSON.stringify(quoteItemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 見積書に紐づく品目を削除
   * @param {string} quoteId 見積書ID
   * @param {string} itemId 品目ID
   * @returns {boolean} 削除成功時はtrue
   */
  deleteQuoteItem(quoteId: string, itemId: string): boolean {
    if (!quoteId || !itemId) {
      throw new Error('quoteId and itemId are required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/items/${itemId}`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書の郵送依頼
   * @param {string} quoteId 見積書ID
   * @returns {boolean} 郵送依頼成功時はtrue
   */
  applyToPostQuote(quoteId: string): boolean {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/posting`;
    const method = ReqMethod.post;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書の郵送キャンセル
   * @param {string} quoteId 見積書ID
   * @returns {boolean} 郵送キャンセル成功時はtrue
   */
  cancelPostQuote(quoteId: string): boolean {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }

    const reqUrl = `${this.baseUrl}/${quoteId}/posting`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 見積書の受注ステータス更新
   * @param {string} quoteId 見積書ID
   * @param {MfInvoiceApi.OrderStatus} status 受注ステータス
   */
  updateOrderStatus(
    quoteId: string,
    orderStatus: MfInvoiceApi.OrderStatus
  ): boolean {
    if (!quoteId || !orderStatus) {
      throw new Error('quoteId and status are required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/order_status`;
    const method = ReqMethod.put;
    const payload = JSON.stringify({ order_status: orderStatus });
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 見積書を請求書に変換
   * @param {string} quoteId 見積書ID
   * @returns {MfInvoiceApi.Billing} 請求書
   */
  convertQuoteToBilling(quoteId: string): MfInvoiceApi.Billing {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}/convert_to_billing`;
    const method = ReqMethod.post;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

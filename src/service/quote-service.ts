/**
 * Copyright 2026 wywy LLC and contributors
 */
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
   * - quote_date: 見積日
   * - expired_date: 有効期限
   * - created_at: 作成日
   * - updated_at: 更新日
   * @param {MfInvoiceApi.QuoteListFilters} filters 取引先ID・見積書番号・ステータス・取引先名・タグでの絞込(queryを指定した場合はこれらは検索に使用されない)
   * @returns {MfInvoiceApi.QuotesResponse} 見積書レスポンス
   */
  getQuotes(
    from: string,
    to: string,
    query: string = '',
    page: number = 1,
    perPage: number = 100,
    rangeKey: QuoteRangeKey = 'quote_date',
    filters?: MfInvoiceApi.QuoteListFilters
  ): MfInvoiceApi.QuotesResponse {
    if (!from || !to) {
      throw new Error('from and to are required.');
    }
    return this.fetchListWithRange<MfInvoiceApi.QuotesResponse>(
      this.baseUrl,
      from,
      to,
      query,
      page,
      perPage,
      rangeKey,
      {
        partner_id: filters?.partnerId,
        document_number: filters?.documentNumber,
        status: filters?.status,
        partner_name: filters?.partnerName,
        tags: filters?.tags,
      }
    );
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
    return this.request<MfInvoiceApi.Quote>(
      this.baseUrl,
      ReqMethod.post,
      JSON.stringify(quoteReqBody)
    );
  }

  /**
   * 見積書の取得
   * @param {string} quoteId 見積書ID
   * @returns {MfInvoiceApi.Quote} 見積書
   */
  getQuote(quoteId: string): MfInvoiceApi.Quote {
    if (!quoteId) {
      throw new Error('quoteId is required.');
    }
    const reqUrl = `${this.baseUrl}/${quoteId}`;
    return this.request<MfInvoiceApi.Quote>(reqUrl, ReqMethod.get);
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
    return this.request<MfInvoiceApi.Quote>(
      reqUrl,
      ReqMethod.put,
      JSON.stringify(quoteReqBody)
    );
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
    return this.request<boolean>(reqUrl, ReqMethod.delete);
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
    return this.request<MfInvoiceApi.QuoteItemResponse>(reqUrl, ReqMethod.get);
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
    return this.request<MfInvoiceApi.Item>(reqUrl, ReqMethod.get);
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
    return this.request<boolean>(
      reqUrl,
      ReqMethod.post,
      JSON.stringify(quoteItemReqBody)
    );
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
    return this.request<boolean>(reqUrl, ReqMethod.delete);
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
    return this.request<boolean>(reqUrl, ReqMethod.post);
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
    return this.request<boolean>(reqUrl, ReqMethod.delete);
  }

  /**
   * 見積書の受注ステータス更新
   * 注意: spec上、このPUTリクエストのenumは数値文字列('-1'〜'2')だが、
   * Quoteレスポンスの order_status は別表記(語形: failure/default/not_received/received)になっている
   * (仕様側の request/response enum不一致。本メソッドの送信値はrequest契約に準拠)
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
    return this.request<boolean>(
      reqUrl,
      ReqMethod.put,
      JSON.stringify({ order_status: orderStatus })
    );
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
    return this.request<MfInvoiceApi.Billing>(reqUrl, ReqMethod.post);
  }
}

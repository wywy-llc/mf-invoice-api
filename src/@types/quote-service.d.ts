declare namespace MfInvoiceApi {
  interface QuoteService extends ServiceBase {
    baseUrl: string;
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
      query: string,
      page?: number,
      perPage?: number,
      rangeKey?: QuoteRangeKey
    ): MfInvoiceApi.QuotesResponse;
    /**
     * 見積書の作成
     * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    createNew(quoteReqBody: MfInvoiceApi.QuoteReqBody): MfInvoiceApi.Quote;
    /**
     * 見積書の取得
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    getQuote(quoteId: String): MfInvoiceApi.Quote;
    /**
     * 見積書の更新
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    updateQuote(quoteId: string): MfInvoiceApi.Quote;
    /**
     * 見積書の削除
     */
    deleteQuote(quoteId: string): boolean;
    /**
     * 見積書に紐づく品目一覧の取得
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.QuoteItemResponse} 見積書品目レスポンス
     */
    getQuoteItems(quoteId: string): MfInvoiceApi.QuoteItemResponse;
    /**
     * 見積書に紐づく品目を取得
     * @param {string} quoteId 見積書ID
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.Item} 品目
     */
    getQuoteItem(quoteId: string, itemId: string): MfInvoiceApi.Item;
    /**
     * 見積書に紐づく品目を削除
     * @param {string} quoteId 見積書ID
     * @param {string} itemId 品目ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteQuoteItem(quoteId: string, itemId: string): boolean;
    /**
     * 見積書の郵送依頼
     * @param {string} quoteId 見積書ID
     * @returns {boolean} 郵送依頼成功時はtrue
     */
    applyToPostQuote(quoteId: string): boolean;
    /**
     * 見積書の郵送キャンセル
     * @param {string} quoteId 見積書ID
     * @returns {boolean} 郵送キャンセル成功時はtrue
     */
    cancelPostQuote(quoteId: string): boolean;
    /**
     * 見積書のステータス更新
     * @param {string} quoteId 見積書ID
     * @param {MfInvoiceApi.OrderStatus} status 受注ステータス
     */
    updateOrderStatus(
      quoteId: string,
      status: MfInvoiceApi.OrderStatus
    ): boolean;
    /**
     * 見積書を請求書に変換
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    convertQuoteToBilling(quoteId: string): MfInvoiceApi.Billing;
  }
}

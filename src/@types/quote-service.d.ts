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
     * @param {MfInvoiceApi.QuoteRangeKey} rangeKey 検索範囲_キー
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
     * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    updateQuote(
      quoteId: string,
      quoteReqBody: MfInvoiceApi.QuoteReqBody
    ): MfInvoiceApi.Quote;
  }
}

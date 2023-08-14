declare namespace MfInvoiceApi {
  interface QuoteService extends ServiceBase {
    baseUrl: string;
    /**
     * 見積書一覧の取得
     * @param from 検索範囲_開始日
     * @param to 検索範囲_終了日
     * @param query 検索文字列
     * @param page ページ番号
     * @param perPage 1ページあたりのデータ数
     * @param rangeKey 検索範囲_キー
     *  - billing_date: 請求日
     *  - due_date: 支払期日
     *  - sales_date: 売上日
     *  - created_at: 作成日
     *  - updated_at: 更新日
     * @returns 見積書レスポンス
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
     * @param quoteReqBody 見積書
     * @returns 見積書
     */
    createNew(quoteReqBody: MfInvoiceApi.QuoteReqBody): MfInvoiceApi.Quote;
    /**
     * 見積書の取得
     * @param quoteId 見積書ID
     * @returns 見積書
     */
    getQuote(quoteId: String): MfInvoiceApi.Quote;
    /**
     * 見積書の更新
     * @param quoteId 見積書ID
     * @param quoteReqBody 見積書
     * @returns 見積書
     */
    updateQuote(
      quoteId: string,
      quoteReqBody: MfInvoiceApi.QuoteReqBody
    ): MfInvoiceApi.Quote;
  }
}

declare namespace MfInvoiceApi {
  interface BillingService extends ServiceBase {
    baseUrl: string;
    /**
     * 請求書一覧の取得
     * @param from 検索範囲_開始日
     * @param to 検索範囲_終了日
     * @param query 検索文字列
     * @param page ページ番号
     * @param perPage 1ページあたりの件数
     * @param rangeKey 検索範囲キー
     *  - billing_date: 請求日
     *  - due_date: 支払期日
     *  - sales_date: 売上日
     *  - created_at: 作成日
     *  - updated_at : 更新日
     * @returns 請求書一覧
     */
    getBillings(
      from: string,
      to: string,
      query: string,
      page?: number,
      perPage?: number,
      rangeKey?: BillingRangeKey
    ): MfInvoiceApi.BillingsResponse;
    /**
     * インボイス制度に対応した形式の請求書の作成
     * @param billingReqBody 請求書
     * @returns 請求書
     */
    createNew(
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の取得
     * @returns
     */
    getBilling(billingId: string): MfInvoiceApi.Billing;
    /**
     * 請求書の更新
     * @param billingId 請求書ID
     * @param billingReqBody 請求書
     * @returns 請求書
     */
    updateBilling(
      billingId: string,
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
  }
}

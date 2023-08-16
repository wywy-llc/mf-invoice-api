declare namespace MfInvoiceApi {
  /**
   * マネーフォワード請求API用クライアント
   * ■ Money Forward Invoice API
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/
   */
  interface MfClient {
    /**
     * 請求API
     * @type {MfInvoiceApi.BillingService}
     */
    billings: BillingService;
    /**
     * 見積API
     * @type {MfInvoiceApi.QuoteService}
     */
    quotes: QuoteService;
    /**
     * 取引先API
     * @type {MfInvoiceApi.PartnerService}
     */
    partners: PartnerService;
    /**
     * 品目API
     * @type {MfInvoiceApi.ItemService}
     */
    items: ItemService;
    /**
     * 事業所API
     * @type {MfInvoiceApi.OfficeService}
     */
    office: OfficeService;
  }
}

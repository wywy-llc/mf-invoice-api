declare namespace MfInvoiceApi {
  /**
   * マネーフォワード請求API用クライアント
   * ■ Money Forward Invoice API
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/
   */
  interface MfClient {
    billings: BillingService;
    quotes: QuoteService;
    partners: PartnerService;
    items: ItemService;
    office: OfficeService;
  }
}

declare namespace MfInvoiceApi {
  interface BillingService extends ServiceBase {
    baseUrl: string;
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
     */
    createNew(billing: MfInvoiceApi.Billing): MfInvoiceApi.Billing;
    /**
     * 請求書の取得
     * @returns
     */
    getBilling(id: string): MfInvoiceApi.Billing;
  }
}

declare namespace MfInvoiceApi {
  interface OfficeService extends ServiceBase {
    /**
     * baseUrl
     */
    baseUrl: string;
    /**
     * 事業者情報の取得
     * @returns {MfInvoiceApi.Office} 事業者情報
     */
    getMyOffice(): MfInvoiceApi.Office;
  }
}

declare namespace MfInvoiceApi {
  interface OfficeService extends ServiceBase {
    baseUrl: string;
    getMyOffice(): MfInvoiceApi.Office;
  }
}
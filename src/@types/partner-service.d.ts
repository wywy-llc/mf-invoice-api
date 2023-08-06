declare namespace MfInvoiceApi {
  interface PartnerService extends ServiceBase {
    baseUrl: string;
    getPartners(page?: number, perPage?: number): MfInvoiceApi.PartnersResponse;
    createNew(partner: MfInvoiceApi.Partner): MfInvoiceApi.Partner;
    getAll(): MfInvoiceApi.Partner[];
  }
}

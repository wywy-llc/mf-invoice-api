declare namespace MfInvoiceApi {
  interface PartnerService extends ServiceBase {
    baseUrl: string;
    getPartners(page?: number, perPage?: number): PartnersResponse;
    createNew(partner: PartnerReqBody): Partner;
    getAll(): Partner[];
  }
}

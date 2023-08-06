import { ReqMethod, ServiceBase } from './service-base';

export class PartnerService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/partners';

  getPartners(
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.PartnersResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  createNew(partner: MfInvoiceApi.Partner): MfInvoiceApi.Partner {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(partner);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  getAll(): MfInvoiceApi.Partner[] {
    const partners: MfInvoiceApi.Partner[] = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const partnersRes = this.getPartners(page);
      totalPages = partnersRes.pagination.total_pages;
      if (partnersRes.data.length === 0) {
        break;
      }
      partners.push(...partnersRes.data);
      page += 1;
    }
    console.log(partners.length + '件の取引先取得に成功。');
    return partners;
  }
}

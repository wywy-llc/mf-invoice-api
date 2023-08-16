import { ReqMethod, ServiceBase } from './service-base';

/**
 * OfficeService
 */
export class OfficeService extends ServiceBase {
  /**
   * baseUrl
   */
  baseUrl: string = ServiceBase.API_BASE_URL + '/office';

  /**
   * 事業者情報の取得
   * @returns {MfInvoiceApi.Office} 事業者情報
   */
  getMyOffice(): MfInvoiceApi.Office {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

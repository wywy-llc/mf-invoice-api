/**
 * Copyright 2026 wywy LLC and contributors
 */
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
    return this.request<MfInvoiceApi.Office>(this.baseUrl, ReqMethod.get);
  }
}

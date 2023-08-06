import { Billing, BillingsResponse } from '../@types/mf-invoice-client';
import { ServiceBase, BillingRangeKey, ReqMethod } from './service-base';

export class BillingService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/billings';
  getBillings(
    from: string,
    to: string,
    query: string,
    page: number = 1,
    perPage: number = 100,
    rangeKey: BillingRangeKey = 'billing_date'
  ): BillingsResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}&range_key=${rangeKey}&from=${from}&to=${to}&q=${query}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * インボイス制度に対応した形式の請求書の作成
   */
  createNew(billing: Billing): Billing {
    const reqUrl = `${ServiceBase.API_BASE_URL}/invoice_template_billings`;
    const method = ReqMethod.post;
    const payload = JSON.stringify(billing);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }
  /**
   * 請求書の取得
   * @returns
   */
  getBilling(id: string): Billing {
    const reqUrl = `${this.baseUrl}/${id}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

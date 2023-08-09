import { ReqMethod, ServiceBase } from './service-base';

export class ItemService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/items';

  getItems(
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.ItemsResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  createNew(item: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(item);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  getItem(id: String): MfInvoiceApi.Item {
    const reqUrl = `${this.baseUrl}/${id}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

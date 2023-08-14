import { ReqMethod, ServiceBase } from './service-base';

export class ItemService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/items';

  /**
   * 品目一覧の取得
   * @param page ページ番号
   * @param perPage 1ページあたりのデータ数
   * @returns 品目一覧レスポンス
   */
  getItems(
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.ItemsResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 品目の作成
   * @param itemReqBody 品目
   * @returns 品目
   */
  createNew(itemReqBody: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(itemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 品目の取得
   * @param id 品目ID
   * @returns 品目
   */
  getItem(itemId: String): MfInvoiceApi.Item {
    const reqUrl = `${this.baseUrl}/${itemId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 品目の更新
   * @param itemId 品目ID
   * @param itemReqBody 品目
   * @returns 品目
   */
  updateItem(
    itemId: string,
    itemReqBody: MfInvoiceApi.ItemReqBody
  ): MfInvoiceApi.Item {
    const reqUrl = `${this.baseUrl}/${itemId}`;
    const method = ReqMethod.put;
    const payload = JSON.stringify(itemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }
}

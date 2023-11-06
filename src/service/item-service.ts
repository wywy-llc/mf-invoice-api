import { ReqMethod, ServiceBase } from './service-base';

export class ItemService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/items';

  /**
   * 品目一覧の取得
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりのデータ数
   * @returns {MfInvoiceApi.ItemsResponse} 品目一覧レスポンス
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
   * @param {MfInvoiceApi.ItemReqBody} itemReqBody 品目リクエストボディ
   * @returns {MfInvoiceApi.Item} 品目
   */
  createNew(itemReqBody: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item {
    if (!itemReqBody) {
      throw new Error('itemReqBody is required.');
    }
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(itemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 品目の取得
   * @param {string} itemId 品目ID
   * @returns {MfInvoiceApi.Item} 品目
   */
  getItem(itemId: String): MfInvoiceApi.Item {
    if (!itemId) {
      throw new Error('itemId is required.');
    }
    const reqUrl = `${this.baseUrl}/${itemId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 品目の削除
   * @param {string} itemId 品目ID
   * @returns {boolean} 成功時はtrue
   */
  deleteItem(itemId: string): void {
    if (!itemId) {
      throw new Error('itemId is required.');
    }
    const reqUrl = `${this.baseUrl}/${itemId}`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 品目の更新
   * @param {string} itemId 品目ID
   * @param {MfInvoiceApi.ItemReqBody} itemReqBody 品目リクエストボディ
   * @returns {MfInvoiceApi.Item} 品目
   */
  updateItem(
    itemId: string,
    itemReqBody: MfInvoiceApi.ItemReqBody
  ): MfInvoiceApi.Item {
    if (!itemId || !itemReqBody) {
      throw new Error('itemId and itemReqBody are required.');
    }
    const reqUrl = `${this.baseUrl}/${itemId}`;
    const method = ReqMethod.put;
    const payload = JSON.stringify(itemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }
}

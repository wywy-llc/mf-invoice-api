/**
 * Copyright 2026 wywy LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
  getItem(itemId: string): MfInvoiceApi.Item {
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

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
declare namespace MfInvoiceApi {
  interface ItemService extends ServiceBase {
    baseUrl: string;
    /**
     * 品目一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.ItemsResponse} 品目一覧レスポンス
     */
    getItems(page?: number, perPage?: number): MfInvoiceApi.ItemsResponse;
    /**
     * 品目の作成
     * @param {MfInvoiceApi.ItemReqBody} itemReqBody 品目リクエストボディ
     * @returns {MfInvoiceApi.Item} 品目
     */
    createNew(itemReqBody: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item;
    /**
     * 品目の取得
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.Item} 品目
     */
    getItem(itemId: string): MfInvoiceApi.Item;
    /**
     * 品目の削除
     * @param {string} itemId 品目ID
     * @returns {boolean} 成功時はtrue
     */
    deleteItem(itemId: string): void;
    /**
     * 品目の更新
     * @param {string} itemId 品目ID
     * @param {MfInvoiceApi.ItemReqBody} itemReqBody 品目リクエストボディ
     * @returns {MfInvoiceApi.Item} 品目
     */
    updateItem(
      itemId: string,
      itemReqBody: MfInvoiceApi.ItemReqBody
    ): MfInvoiceApi.Item;
  }
}

/**
 * Copyright 2026 wywy LLC and contributors
 */
declare namespace MfInvoiceApi {
  interface ItemService extends ServiceBase {
    baseUrl: string;
    /**
     * 品目一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @param {string} name 品目名で絞り込む(部分一致、カンマ区切りで複数指定可)
     * @param {string} code 品目コードで絞り込む(カンマ区切りで複数指定可)
     * @returns {MfInvoiceApi.ItemsResponse} 品目一覧レスポンス
     */
    getItems(
      page?: number,
      perPage?: number,
      name?: string,
      code?: string
    ): MfInvoiceApi.ItemsResponse;
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
    deleteItem(itemId: string): boolean;
    /**
     * 品目の更新(部分更新可、全フィールド任意)
     * @param {string} itemId 品目ID
     * @param {MfInvoiceApi.ItemUpdateReqBody} itemReqBody 品目更新リクエストボディ
     * @returns {MfInvoiceApi.Item} 品目
     */
    updateItem(
      itemId: string,
      itemReqBody: MfInvoiceApi.ItemUpdateReqBody
    ): MfInvoiceApi.Item;
  }
}

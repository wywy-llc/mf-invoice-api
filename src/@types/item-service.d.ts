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
    getItem(itemId: String): MfInvoiceApi.Item;
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

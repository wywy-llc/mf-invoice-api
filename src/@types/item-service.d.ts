declare namespace MfInvoiceApi {
  interface ItemService extends ServiceBase {
    baseUrl: string;
    /**
     * 品目一覧の取得
     * @param page ページ番号
     * @param perPage 1ページあたりのデータ数
     * @returns 品目一覧レスポンス
     */
    getItems(page?: number, perPage?: number): MfInvoiceApi.ItemsResponse;
    /**
     * 品目の作成
     * @param itemReqBody 品目
     * @returns 品目
     */
    createNew(itemReqBody: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item;
    /**
     * 品目の取得
     * @param id 品目ID
     * @returns 品目
     */
    getItem(itemId: String): MfInvoiceApi.Item;
    /**
     * 品目の更新
     * @param itemId 品目ID
     * @param itemReqBody 品目
     * @returns 品目
     */
    updateItem(
      itemId: string,
      itemReqBody: MfInvoiceApi.ItemReqBody
    ): MfInvoiceApi.Item;
  }
}

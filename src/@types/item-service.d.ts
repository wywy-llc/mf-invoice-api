declare namespace MfInvoiceApi {
  interface ItemService extends ServiceBase {
    baseUrl: string;
    getItems(page?: number, perPage?: number): ItemsResponse;
    createNew(item: ItemReqBody): Item;
    getItem(id: String): Item;
  }
}

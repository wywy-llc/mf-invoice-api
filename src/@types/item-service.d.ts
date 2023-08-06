declare namespace MfInvoiceApi {
  interface ItemService extends ServiceBase {
    baseUrl: string;
    getItems(page?: number, perPage?: number): MfInvoiceApi.ItemsResponse;
    createNew(item: MfInvoiceApi.Item): MfInvoiceApi.Item;
    getItem(id: String): MfInvoiceApi.Item;
  }
}

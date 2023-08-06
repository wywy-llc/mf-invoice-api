declare namespace MfInvoiceApi {
  interface QuoteService extends ServiceBase {
    baseUrl: string;
    getQuotes(
      from: string,
      to: string,
      query: string,
      page?: number,
      perPage?: number,
      rangeKey?: QuoteRangeKey
    ): MfInvoiceApi.QuotesResponse;
    createNew(quote: MfInvoiceApi.Quote): MfInvoiceApi.Quote;
    getQuote(id: String): MfInvoiceApi.Quote;
  }
}

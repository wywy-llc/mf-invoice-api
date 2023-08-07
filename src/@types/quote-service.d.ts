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
    ): QuotesResponse;
    createNew(quote: Quote): Quote;
    getQuote(id: String): Quote;
  }
}

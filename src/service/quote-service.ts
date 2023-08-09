import { QuoteRangeKey, ReqMethod, ServiceBase } from './service-base';

export class QuoteService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/quotes';

  getQuotes(
    from: string,
    to: string,
    query: string,
    page: number = 1,
    perPage: number = 100,
    rangeKey: QuoteRangeKey = 'quote_date'
  ): MfInvoiceApi.QuotesResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}&range_key=${rangeKey}&from=${from}&to=${to}&q=${query}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  createNew(quote: MfInvoiceApi.QuoteReqBody): MfInvoiceApi.Quote {
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(quote);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  getQuote(id: String): MfInvoiceApi.Quote {
    const reqUrl = `${this.baseUrl}/${id}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

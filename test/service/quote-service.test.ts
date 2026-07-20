import { QuoteService } from '../../src/service/quote-service';
import { OrderStatus } from '../../src/service/service-base';
import {
  quoteFactory,
  quotesResponseFactory,
  quoteReqBodyFactory,
  quoteItemReqBodyFactory,
  itemFactory,
  itemsResponseFactory,
  billingFactory,
} from '../factories';
import { stubUrlFetchJson, stubUrlFetchEmpty } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/quotes';

describe('QuoteService', () => {
  let quoteService: QuoteService;

  beforeEach(() => {
    vi.clearAllMocks();
    quoteService = new QuoteService(() => ACCESS_TOKEN);
  });

  describe('getQuotes', () => {
    it('from/toのみ指定すると、見積書一覧を返し、デフォルト値を含むリクエストを送信する', () => {
      const response = quotesResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(quoteService.getQuotes('2024-06-01', '2024-06-30')).toEqual(
        response
      );
      // query='', page=1, perPage=100, rangeKey='quote_date' のデフォルト値でGETする
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100&range_key=quote_date&from=2024-06-01&to=2024-06-30&q=`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('query/page/perPage/rangeKeyを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = quotesResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      quoteService.getQuotes(
        '2024-06-01',
        '2024-06-30',
        '検索語',
        2,
        50,
        'expired_date'
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=2&per_page=50&range_key=expired_date&from=2024-06-01&to=2024-06-30&q=${encodeURIComponent(
          '検索語'
        )}`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('fromまたはtoが未指定だと、"from and to are required."エラー', () => {
      expect(() => quoteService.getQuotes('', '2024-06-30')).toThrow(
        'from and to are required.'
      );
      expect(() => quoteService.getQuotes('2024-06-01', '')).toThrow(
        'from and to are required.'
      );
    });
  });

  describe('createNew', () => {
    it('quoteReqBodyを指定すると、作成した見積書を返し、baseUrlへPOSTする', () => {
      const quote = quoteFactory.build();
      const reqBody = quoteReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(quote);

      expect(quoteService.createNew(reqBody)).toEqual(quote);
      expect(fetchMock).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('quoteReqBody未指定だと、"quoteReqBody is required."エラー', () => {
      expect(() =>
        quoteService.createNew(
          undefined as unknown as MfInvoiceApi.QuoteReqBody
        )
      ).toThrow('quoteReqBody is required.');
    });
  });

  describe('getQuote', () => {
    it('quoteIdを指定すると、該当する見積書を返す', () => {
      const quote = quoteFactory.build({ id: 'quote_1' });
      const fetchMock = stubUrlFetchJson(quote);

      expect(quoteService.getQuote('quote_1')).toEqual(quote);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.getQuote('')).toThrow('quoteId is required.');
    });
  });

  describe('updateQuote', () => {
    it('quoteIdとquoteReqBodyを指定すると、更新後の見積書を返し、PUTリクエストを送信する', () => {
      const quote = quoteFactory.build({ id: 'quote_1' });
      const reqBody = quoteReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(quote);

      expect(quoteService.updateQuote('quote_1', reqBody)).toEqual(quote);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('quoteIdまたはquoteReqBodyが未指定だと、"quoteId and quoteReqBody are required."エラー', () => {
      const reqBody = quoteReqBodyFactory.build();
      expect(() => quoteService.updateQuote('', reqBody)).toThrow(
        'quoteId and quoteReqBody are required.'
      );
      expect(() =>
        quoteService.updateQuote(
          'quote_1',
          undefined as unknown as MfInvoiceApi.QuoteReqBody
        )
      ).toThrow('quoteId and quoteReqBody are required.');
    });
  });

  describe('deleteQuote', () => {
    it('quoteIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(quoteService.deleteQuote('quote_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.deleteQuote('')).toThrow(
        'quoteId is required.'
      );
    });
  });

  describe('getQuoteItems', () => {
    it('quoteIdを指定すると、該当する品目一覧を返す', () => {
      // QuoteItemResponse は ItemsResponse と同一構造(data: Item[], pagination)のため流用
      const response = itemsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(quoteService.getQuoteItems('quote_1')).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/items`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.getQuoteItems('')).toThrow(
        'quoteId is required.'
      );
    });
  });

  describe('getQuoteItem', () => {
    it('quoteIdとitemIdを指定すると、該当する品目を返す', () => {
      const item = itemFactory.build({ id: 'item_1' });
      const fetchMock = stubUrlFetchJson(item);

      expect(quoteService.getQuoteItem('quote_1', 'item_1')).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/items/item_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('quoteIdまたはitemIdが未指定だと、"quoteId and itemId are required."エラー', () => {
      expect(() => quoteService.getQuoteItem('', 'item_1')).toThrow(
        'quoteId and itemId are required.'
      );
      expect(() => quoteService.getQuoteItem('quote_1', '')).toThrow(
        'quoteId and itemId are required.'
      );
    });
  });

  describe('attachQuoteItem', () => {
    it('quoteIdとquoteItemReqBodyを指定すると、trueを返し、POSTリクエストを送信する', () => {
      const reqBody = quoteItemReqBodyFactory.build();
      const fetchMock = stubUrlFetchEmpty();

      expect(quoteService.attachQuoteItem('quote_1', reqBody)).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/items`,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('quoteIdまたはquoteItemReqBodyが未指定だと、"quoteId and quoteItemReqBody are required."エラー', () => {
      const reqBody = quoteItemReqBodyFactory.build();
      expect(() => quoteService.attachQuoteItem('', reqBody)).toThrow(
        'quoteId and quoteItemReqBody are required.'
      );
      expect(() =>
        quoteService.attachQuoteItem(
          'quote_1',
          undefined as unknown as MfInvoiceApi.QuoteItemReqBody
        )
      ).toThrow('quoteId and quoteItemReqBody are required.');
    });
  });

  describe('deleteQuoteItem', () => {
    it('quoteIdとitemIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(quoteService.deleteQuoteItem('quote_1', 'item_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/items/item_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('quoteIdまたはitemIdが未指定だと、"quoteId and itemId are required."エラー', () => {
      expect(() => quoteService.deleteQuoteItem('', 'item_1')).toThrow(
        'quoteId and itemId are required.'
      );
      expect(() => quoteService.deleteQuoteItem('quote_1', '')).toThrow(
        'quoteId and itemId are required.'
      );
    });
  });

  describe('applyToPostQuote', () => {
    it('quoteIdを指定すると、trueを返し、payloadなしでPOSTする', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(quoteService.applyToPostQuote('quote_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/quote_1/posting`, {
        method: 'post',
        muteHttpExceptions: true,
        headers: quoteService.getHeaders(),
      });
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.applyToPostQuote('')).toThrow(
        'quoteId is required.'
      );
    });
  });

  describe('cancelPostQuote', () => {
    it('quoteIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(quoteService.cancelPostQuote('quote_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/posting`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.cancelPostQuote('')).toThrow(
        'quoteId is required.'
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('quoteIdとorderStatusを指定すると、trueを返し、order_statusをPUTする', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(
        quoteService.updateOrderStatus('quote_1', OrderStatus.received)
      ).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/order_status`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify({ order_status: OrderStatus.received }),
          contentType: 'application/json',
        })
      );
    });

    it('orderStatusに文字列"0"(未設定)や"-1"(失注)を指定しても、バリデーションを通過してリクエストを送信する', () => {
      // OrderStatus.default('0')/failure('-1')は文字列としてtruthyなため、!orderStatusでは弾かれない
      const fetchMock = stubUrlFetchEmpty();

      quoteService.updateOrderStatus('quote_1', OrderStatus.default);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/order_status`,
        expect.objectContaining({
          payload: JSON.stringify({ order_status: OrderStatus.default }),
        })
      );

      quoteService.updateOrderStatus('quote_1', OrderStatus.failure);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/order_status`,
        expect.objectContaining({
          payload: JSON.stringify({ order_status: OrderStatus.failure }),
        })
      );
    });

    it('quoteIdまたはorderStatusが未指定だと、"quoteId and status are required."エラー', () => {
      expect(() =>
        quoteService.updateOrderStatus('', OrderStatus.received)
      ).toThrow('quoteId and status are required.');
      expect(() =>
        quoteService.updateOrderStatus(
          'quote_1',
          undefined as unknown as MfInvoiceApi.OrderStatus
        )
      ).toThrow('quoteId and status are required.');
    });
  });

  describe('convertQuoteToBilling', () => {
    it('quoteIdを指定すると、変換後の請求書を返し、payloadなしでPOSTする', () => {
      const billing = billingFactory.build();
      const fetchMock = stubUrlFetchJson(billing);

      expect(quoteService.convertQuoteToBilling('quote_1')).toEqual(billing);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/quote_1/convert_to_billing`,
        {
          method: 'post',
          muteHttpExceptions: true,
          headers: quoteService.getHeaders(),
        }
      );
    });

    it('quoteId未指定だと、"quoteId is required."エラー', () => {
      expect(() => quoteService.convertQuoteToBilling('')).toThrow(
        'quoteId is required.'
      );
    });
  });
});

import { QuoteService } from '../../src/service/quote-service';

describe('QuoteService', () => {
  describe('getQuotes', () => {
    test('q パラメータの予約文字を URL エンコードする', () => {
      const fetchMock = jest.fn().mockReturnValue({
        getResponseCode: () => 200,
        getContentText: () => '',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).UrlFetchApp = { fetch: fetchMock };

      const service = new QuoteService('dummy-token');
      service.getQuotes('2024-01-01', '2024-01-31', 'A&B+C#1');

      const calledUrl = fetchMock.mock.calls[0][0];
      expect(calledUrl).toContain('q=A%26B%2BC%231');
    });
  });
});

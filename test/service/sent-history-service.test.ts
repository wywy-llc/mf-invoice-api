import { SentHistoryService } from '../../src/service/sent-history-service';
import { sentHistoriesResponseFactory } from '../factories';
import { stubUrlFetchJson } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/sent_histories';

describe('SentHistoryService', () => {
  let sentHistoryService: SentHistoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    sentHistoryService = new SentHistoryService(ACCESS_TOKEN);
  });

  describe('getSentHistories', () => {
    it('引数を指定しないと、送付履歴一覧を返し、デフォルト値でリクエストを送信する', () => {
      const response = sentHistoriesResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(sentHistoryService.getSentHistories()).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('page/perPageを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = sentHistoriesResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      sentHistoryService.getSentHistories(2, 50);

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=2&per_page=50`,
        expect.objectContaining({ method: 'get' })
      );
    });
  });
});

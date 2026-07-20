import { PartnerService } from '../../src/service/partner-service';
import {
  partnerFactory,
  partnersResponseFactory,
  partnerReqBodyFactory,
  paginationDataFactory,
} from '../factories';
import {
  stubUrlFetchJson,
  stubUrlFetchEmpty,
  makeHttpResponse,
} from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const BASE_URL = 'https://invoice.moneyforward.com/api/v3/partners';

describe('PartnerService', () => {
  let partnerService: PartnerService;

  beforeEach(() => {
    vi.clearAllMocks();
    partnerService = new PartnerService(() => ACCESS_TOKEN);
  });

  describe('getPartners', () => {
    it('引数を指定しないと、取引先一覧を返し、デフォルト値でリクエストを送信する', () => {
      const response = partnersResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(partnerService.getPartners()).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('page/perPageを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = partnersResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      partnerService.getPartners(2, 50);

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=2&per_page=50`,
        expect.objectContaining({ method: 'get' })
      );
    });
  });

  describe('createNew', () => {
    it('partnerReqBodyを指定すると、作成した取引先を返し、POSTリクエストを送信する', () => {
      const partner = partnerFactory.build();
      const reqBody = partnerReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(partner);

      expect(partnerService.createNew(reqBody)).toEqual(partner);
      expect(fetchMock).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('partnerReqBody未指定だと、"partnerReqBody is required."エラー', () => {
      expect(() =>
        partnerService.createNew(
          undefined as unknown as MfInvoiceApi.PartnerReqBody
        )
      ).toThrow('partnerReqBody is required.');
    });
  });

  describe('getPartner', () => {
    it('partnerIdを指定すると、該当する取引先を返す', () => {
      const partner = partnerFactory.build({ id: 'partner_1' });
      const fetchMock = stubUrlFetchJson(partner);

      expect(partnerService.getPartner('partner_1')).toEqual(partner);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/partner_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('partnerId未指定だと、"partnerId is required."エラー', () => {
      expect(() => partnerService.getPartner('')).toThrow(
        'partnerId is required.'
      );
    });
  });

  describe('updatePartner', () => {
    it('partnerIdとpartnerReqBodyを指定すると、更新後の取引先を返し、PUTリクエストを送信する', () => {
      const partner = partnerFactory.build({ id: 'partner_1' });
      const reqBody = partnerReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(partner);

      expect(partnerService.updatePartner('partner_1', reqBody)).toEqual(
        partner
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/partner_1`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('partnerIdまたはpartnerReqBodyが未指定だと、"partnerId and partnerReqBody are required."エラー', () => {
      const reqBody = partnerReqBodyFactory.build();
      expect(() => partnerService.updatePartner('', reqBody)).toThrow(
        'partnerId and partnerReqBody are required.'
      );
      expect(() =>
        partnerService.updatePartner(
          'partner_1',
          undefined as unknown as MfInvoiceApi.PartnerReqBody
        )
      ).toThrow('partnerId and partnerReqBody are required.');
    });
  });

  describe('deletePartner', () => {
    it('partnerIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(partnerService.deletePartner('partner_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/partner_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('partnerId未指定だと、"partnerId is required."エラー', () => {
      expect(() => partnerService.deletePartner('')).toThrow(
        'partnerId is required.'
      );
    });
  });

  describe('getAll', () => {
    it('複数ページに跨る取引先が存在すると、全ページを取得して集約した配列を返す', () => {
      // テストデータ: 2ページ分の取引先レスポンス
      const page1 = partnersResponseFactory.build({
        data: partnerFactory.buildList(2),
        pagination: paginationDataFactory.build({
          total_pages: 2,
          current_page: 1,
        }),
      });
      const page2 = partnersResponseFactory.build({
        data: partnerFactory.buildList(1),
        pagination: paginationDataFactory.build({
          total_pages: 2,
          current_page: 2,
        }),
      });

      // モック: 1回目はpage1、2回目はpage2を返す
      const fetchMock = vi
        .fn()
        .mockReturnValueOnce(makeHttpResponse(200, JSON.stringify(page1)))
        .mockReturnValueOnce(makeHttpResponse(200, JSON.stringify(page2)));
      vi.stubGlobal('UrlFetchApp', { fetch: fetchMock });

      // 実行+検証
      // 1. 全ページのdataを結合した配列が返却される
      expect(partnerService.getAll()).toEqual([...page1.data, ...page2.data]);
      // 2. 2ページ分、page番号をインクリメントしてリクエストする
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        `${BASE_URL}?page=1&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${BASE_URL}?page=2&per_page=100`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('1ページ目のdataが空の場合、それ以上ページを取得せず空配列を返す', () => {
      // total_pagesが3でも、dataが空なら1回のfetchでbreakする
      const page1 = partnersResponseFactory.build({
        data: [],
        pagination: paginationDataFactory.build({
          total_pages: 3,
          current_page: 1,
        }),
      });
      const fetchMock = stubUrlFetchJson(page1);

      expect(partnerService.getAll()).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('取引先が1ページに収まる場合、1回のリクエストで全件を返す', () => {
      const page1 = partnersResponseFactory.build({
        data: partnerFactory.buildList(3),
        pagination: paginationDataFactory.build({
          total_pages: 1,
          current_page: 1,
        }),
      });
      const fetchMock = stubUrlFetchJson(page1);

      expect(partnerService.getAll()).toEqual(page1.data);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('総ページ数がMAX_PAGES(100)を超える場合、100ページ分で打ち切って返す', () => {
      // 全ページ同一データ(1件+total_pages=999)を返す固定モック
      // → 実装がMAX_PAGESで打ち切ることをfetch回数と集約件数から検証する
      const page = partnersResponseFactory.build({
        data: partnerFactory.buildList(1),
        pagination: paginationDataFactory.build({
          total_pages: 999,
          current_page: 1,
        }),
      });
      const fetchMock = stubUrlFetchJson(page);

      expect(partnerService.getAll()).toHaveLength(100);
      expect(fetchMock).toHaveBeenCalledTimes(100);
    });
  });
});

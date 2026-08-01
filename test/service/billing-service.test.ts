import { BillingService } from '../../src/service/billing-service';
import { PaymentStatus } from '../../src/service/service-base';
import {
  billingFactory,
  billingsResponseFactory,
  billingReqBodyFactory,
  billingItemFactory,
  billingItemReqBodyFactory,
} from '../factories';
import { stubUrlFetchJson, stubUrlFetchEmpty } from '../helpers/gas-mock';

const ACCESS_TOKEN = 'test_access_token';
const API_BASE_URL = 'https://invoice.moneyforward.com/api/v3';
const BASE_URL = `${API_BASE_URL}/billings`;

describe('BillingService', () => {
  let billingService: BillingService;

  beforeEach(() => {
    vi.clearAllMocks();
    billingService = new BillingService(() => ACCESS_TOKEN);
  });

  describe('getBillings', () => {
    it('from/toのみ指定すると、請求書一覧を返し、デフォルト値を含むリクエストを送信する', () => {
      // テストデータ: 請求書一覧レスポンス
      const response = billingsResponseFactory.build();

      // モック: UrlFetchAppが請求書一覧レスポンスを返す
      const fetchMock = stubUrlFetchJson(response);

      // 実行+検証
      // 1. レスポンスがそのまま返却される
      expect(billingService.getBillings('2024-06-01', '2024-06-30')).toEqual(
        response
      );
      // 2. query='', page=1, perPage=100, rangeKey='billing_date' のデフォルト値でGETする
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100&range_key=billing_date&from=2024-06-01&to=2024-06-30&q=`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('query/page/perPage/rangeKeyを指定すると、クエリに反映したリクエストを送信する', () => {
      const response = billingsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      billingService.getBillings(
        '2024-06-01',
        '2024-06-30',
        '検索語',
        2,
        50,
        'due_date'
      );

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=2&per_page=50&range_key=due_date&from=2024-06-01&to=2024-06-30&q=${encodeURIComponent(
          '検索語'
        )}`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('queryがURLエンコード済みだと、二重エンコードせずそのままqに設定する', () => {
      const response = billingsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      // テストデータ: 呼び出し側でエンコード済みの検索文字列('入金済み')
      const encodedQuery = encodeURIComponent('入金済み');
      billingService.getBillings('2024-06-01', '2024-06-30', encodedQuery);

      // 検証: %25E5... へ再エンコードされず、エンコード済みの値がそのままqに載る
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100&range_key=billing_date&from=2024-06-01&to=2024-06-30&q=${encodedQuery}`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('queryが%を含む生文字列だと、エンコードしてqに設定する', () => {
      const response = billingsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      // テストデータ: デコード不能な%シーケンスを含む生文字列(エンコード済みではない)
      billingService.getBillings('2024-06-01', '2024-06-30', '100%OFF');

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}?page=1&per_page=100&range_key=billing_date&from=2024-06-01&to=2024-06-30&q=${encodeURIComponent(
          '100%OFF'
        )}`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('fromまたはtoが未指定だと、"from and to are required."エラー', () => {
      expect(() => billingService.getBillings('', '2024-06-30')).toThrow(
        'from and to are required.'
      );
      expect(() => billingService.getBillings('2024-06-01', '')).toThrow(
        'from and to are required.'
      );
    });
  });

  describe('createNew', () => {
    it('billingReqBodyを指定すると、作成した請求書を返し、invoice_template_billingsへPOSTする', () => {
      // テストデータ: 作成される請求書と、送信するリクエストボディ
      const billing = billingFactory.build();
      const reqBody = billingReqBodyFactory.build();

      // モック: UrlFetchAppが作成済み請求書を返す
      const fetchMock = stubUrlFetchJson(billing);

      // 実行+検証
      // 1. 作成した請求書が返却される
      expect(billingService.createNew(reqBody)).toEqual(billing);
      // 2. baseUrlでなく invoice_template_billings エンドポイントへPOSTする(インボイス制度対応)
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/invoice_template_billings`,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('billingReqBody未指定だと、"billingReqBody is required."エラー', () => {
      expect(() =>
        billingService.createNew(
          undefined as unknown as MfInvoiceApi.BillingReqBody
        )
      ).toThrow('billingReqBody is required.');
    });
  });

  describe('getBilling', () => {
    it('billingIdを指定すると、該当する請求書を返す', () => {
      const billing = billingFactory.build({ id: 'billing_1' });
      const fetchMock = stubUrlFetchJson(billing);

      expect(billingService.getBilling('billing_1')).toEqual(billing);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('billingId未指定だと、"billingId is required."エラー', () => {
      expect(() => billingService.getBilling('')).toThrow(
        'billingId is required.'
      );
    });
  });

  describe('updateBilling', () => {
    it('billingIdとbillingReqBodyを指定すると、更新後の請求書を返し、PUTリクエストを送信する', () => {
      const billing = billingFactory.build({ id: 'billing_1' });
      const reqBody = billingReqBodyFactory.build();
      const fetchMock = stubUrlFetchJson(billing);

      expect(billingService.updateBilling('billing_1', reqBody)).toEqual(
        billing
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('billingIdまたはbillingReqBodyが未指定だと、"billingId and billingReqBody are required."エラー', () => {
      const reqBody = billingReqBodyFactory.build();
      expect(() => billingService.updateBilling('', reqBody)).toThrow(
        'billingId and billingReqBody are required.'
      );
      expect(() =>
        billingService.updateBilling(
          'billing_1',
          undefined as unknown as MfInvoiceApi.BillingReqBody
        )
      ).toThrow('billingId and billingReqBody are required.');
    });
  });

  describe('updatePaymentStatus', () => {
    it('billingIdとpaymentStatusを指定すると、更新後の請求書を返し、payment_statusをPUTする', () => {
      const billing = billingFactory.build({ id: 'billing_1' });
      const fetchMock = stubUrlFetchJson(billing);

      expect(
        billingService.updatePaymentStatus('billing_1', PaymentStatus.completed)
      ).toEqual(billing);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/payment_status`,
        expect.objectContaining({
          method: 'put',
          payload: JSON.stringify({ payment_status: PaymentStatus.completed }),
          contentType: 'application/json',
        })
      );
    });

    it('paymentStatusに文字列"0"(未設定)を指定しても、バリデーションを通過してリクエストを送信する', () => {
      // PaymentStatus.default('0')は文字列としてtruthyなため、!paymentStatusでは弾かれない
      const billing = billingFactory.build({ id: 'billing_1' });
      const fetchMock = stubUrlFetchJson(billing);

      billingService.updatePaymentStatus('billing_1', PaymentStatus.default);

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/payment_status`,
        expect.objectContaining({
          payload: JSON.stringify({ payment_status: PaymentStatus.default }),
        })
      );
    });

    it('billingIdまたはpaymentStatusが未指定だと、"billingId and paymentStatus are required."エラー', () => {
      expect(() =>
        billingService.updatePaymentStatus('', PaymentStatus.completed)
      ).toThrow('billingId and paymentStatus are required.');
      expect(() =>
        billingService.updatePaymentStatus(
          'billing_1',
          undefined as unknown as Extract<
            MfInvoiceApi.PaymentStatus,
            '0' | '1' | '2'
          >
        )
      ).toThrow('billingId and paymentStatus are required.');
    });
  });

  describe('deleteBilling', () => {
    it('billingIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(billingService.deleteBilling('billing_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('billingId未指定だと、"billingId is required."エラー', () => {
      expect(() => billingService.deleteBilling('')).toThrow(
        'billingId is required.'
      );
    });
  });

  describe('getBillingItems', () => {
    it('billingIdを指定すると、該当する品目一覧を返す', () => {
      const response = billingsResponseFactory.build();
      const fetchMock = stubUrlFetchJson(response);

      expect(billingService.getBillingItems('billing_1')).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/items`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('billingId未指定だと、"billingId is required."エラー', () => {
      expect(() => billingService.getBillingItems('')).toThrow(
        'billingId is required.'
      );
    });
  });

  describe('getBillingItem', () => {
    it('billingIdとitemIdを指定すると、該当する品目を返す', () => {
      const item = billingItemFactory.build({ id: 'billing_item_1' });
      const fetchMock = stubUrlFetchJson(item);

      expect(
        billingService.getBillingItem('billing_1', 'billing_item_1')
      ).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/items/billing_item_1`,
        expect.objectContaining({ method: 'get' })
      );
    });

    it('billingIdまたはitemIdが未指定だと、"billingId and itemId are required."エラー', () => {
      expect(() => billingService.getBillingItem('', 'billing_item_1')).toThrow(
        'billingId and itemId are required.'
      );
      expect(() => billingService.getBillingItem('billing_1', '')).toThrow(
        'billingId and itemId are required.'
      );
    });
  });

  describe('attachBillingItem', () => {
    it('billingIdとitemReqBodyを指定すると、trueを返し、POSTリクエストを送信する', () => {
      const reqBody = billingItemReqBodyFactory.build();
      const fetchMock = stubUrlFetchEmpty();

      expect(billingService.attachBillingItem('billing_1', reqBody)).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/items`,
        expect.objectContaining({
          method: 'post',
          payload: JSON.stringify(reqBody),
          contentType: 'application/json',
        })
      );
    });

    it('billingIdまたはitemReqBodyが未指定だと、"billingId and item are required."エラー', () => {
      const reqBody = billingItemReqBodyFactory.build();
      expect(() => billingService.attachBillingItem('', reqBody)).toThrow(
        'billingId and item are required.'
      );
      expect(() =>
        billingService.attachBillingItem(
          'billing_1',
          undefined as unknown as MfInvoiceApi.BillingItemReqBody
        )
      ).toThrow('billingId and item are required.');
    });
  });

  describe('deleteBillingItem', () => {
    it('billingIdとitemIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(
        billingService.deleteBillingItem('billing_1', 'billing_item_1')
      ).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/items/billing_item_1`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('billingIdまたはitemIdが未指定だと、"billingId and itemId are required."エラー', () => {
      expect(() =>
        billingService.deleteBillingItem('', 'billing_item_1')
      ).toThrow('billingId and itemId are required.');
      expect(() => billingService.deleteBillingItem('billing_1', '')).toThrow(
        'billingId and itemId are required.'
      );
    });
  });

  describe('applyToPostBilling', () => {
    it('billingIdを指定すると、trueを返し、payloadなしでPOSTする', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(billingService.applyToPostBilling('billing_1')).toBe(true);
      // payload無しのPOSTのため、payload/contentTypeは付与されない
      expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/billing_1/posting`, {
        method: 'post',
        muteHttpExceptions: true,
        headers: billingService.getHeaders(),
      });
    });

    it('billingId未指定だと、"billingId is required."エラー', () => {
      expect(() => billingService.applyToPostBilling('')).toThrow(
        'billingId is required.'
      );
    });
  });

  describe('cancelPostBilling', () => {
    it('billingIdを指定すると、trueを返し、DELETEリクエストを送信する', () => {
      const fetchMock = stubUrlFetchEmpty();

      expect(billingService.cancelPostBilling('billing_1')).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/billing_1/posting`,
        expect.objectContaining({ method: 'delete' })
      );
    });

    it('billingId未指定だと、"billingId is required."エラー', () => {
      expect(() => billingService.cancelPostBilling('')).toThrow(
        'billingId is required.'
      );
    });
  });
});

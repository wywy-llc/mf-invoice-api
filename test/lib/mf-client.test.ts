import { MfClient } from '../../src/lib/mf-client';
import { BillingService } from '../../src/service/billing-service';
import { ItemService } from '../../src/service/item-service';
import { OfficeService } from '../../src/service/office-service';
import { PartnerService } from '../../src/service/partner-service';
import { QuoteService } from '../../src/service/quote-service';

describe('MfClient', () => {
  it('getAccessToken関数を指定すると、各リソース用サービスがインスタンス化される', () => {
    const client = new MfClient(() => 'token');
    expect(client.billings).toBeInstanceOf(BillingService);
    expect(client.quotes).toBeInstanceOf(QuoteService);
    expect(client.partners).toBeInstanceOf(PartnerService);
    expect(client.items).toBeInstanceOf(ItemService);
    expect(client.office).toBeInstanceOf(OfficeService);
  });

  it('getAccessTokenが関数でないと、"アクセストークンが不正です"エラーを投げる', () => {
    expect(() => new MfClient(undefined as unknown as () => string)).toThrow(
      'アクセストークンが不正です'
    );
  });

  describe('サービス注入(DI)', () => {
    it('一部のサービスを注入すると、注入分はそのまま設定され残りは新規生成される', () => {
      const billingsMock = {} as BillingService;
      const client = new MfClient(() => 'token', { billings: billingsMock });
      expect(client.billings).toBe(billingsMock);
      expect(client.quotes).toBeInstanceOf(QuoteService);
      expect(client.partners).toBeInstanceOf(PartnerService);
      expect(client.items).toBeInstanceOf(ItemService);
      expect(client.office).toBeInstanceOf(OfficeService);
    });

    it('全サービスを注入すると、実サービスを新規生成せず注入したインスタンスがそのまま設定される', () => {
      const services = {
        billings: {} as BillingService,
        quotes: {} as QuoteService,
        partners: {} as PartnerService,
        items: {} as ItemService,
        office: {} as OfficeService,
      };
      const client = new MfClient(() => 'token', services);
      expect(client.billings).toBe(services.billings);
      expect(client.quotes).toBe(services.quotes);
      expect(client.partners).toBe(services.partners);
      expect(client.items).toBe(services.items);
      expect(client.office).toBe(services.office);
    });
  });
});

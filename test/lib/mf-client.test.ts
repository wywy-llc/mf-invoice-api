import { MfClient } from '../../src/lib/mf-client';
import { BillingService } from '../../src/service/billing-service';
import { ItemService } from '../../src/service/item-service';
import { OfficeService } from '../../src/service/office-service';
import { PartnerService } from '../../src/service/partner-service';
import { QuoteService } from '../../src/service/quote-service';

describe('MfClient', () => {
  it('アクセストークンを指定すると、各リソース用サービスがインスタンス化される', () => {
    const client = new MfClient('token');
    expect(client.billings).toBeInstanceOf(BillingService);
    expect(client.quotes).toBeInstanceOf(QuoteService);
    expect(client.partners).toBeInstanceOf(PartnerService);
    expect(client.items).toBeInstanceOf(ItemService);
    expect(client.office).toBeInstanceOf(OfficeService);
  });

  it('アクセストークンが空文字だと、"アクセストークンが不正です"エラーを投げる', () => {
    expect(() => new MfClient('')).toThrow('アクセストークンが不正です');
  });
});

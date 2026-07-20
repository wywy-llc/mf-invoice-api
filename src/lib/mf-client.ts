/**
 * Copyright 2026 wywy LLC and contributors
 */
import { BillingService } from '../service/billing-service';
import { ItemService } from '../service/item-service';
import { OfficeService } from '../service/office-service';
import { PartnerService } from '../service/partner-service';
import { QuoteService } from '../service/quote-service';

/**
 * MfClientが保持するリソース別サービス群。テスト時のモック注入に使用します。
 */
export interface MfClientServices {
  billings: BillingService;
  quotes: QuoteService;
  partners: PartnerService;
  items: ItemService;
  office: OfficeService;
}

/**
 * マネーフォワード請求API用クライアント
 * ■ Money Forward Invoice API
 * https://invoice.moneyforward.com/docs/api/v3/index.html#/
 */
export class MfClient {
  /**
   * 請求API
   * @type {MfInvoiceApi.BillingService}
   */
  public billings: BillingService;
  /**
   * 見積API
   * @type {MfInvoiceApi.QuoteService}
   */
  public quotes: QuoteService;
  /**
   * 取引先API
   * @type {MfInvoiceApi.PartnerService}
   */
  public partners: PartnerService;
  /**
   * 品目API
   * @type {MfInvoiceApi.ItemService}
   */
  public items: ItemService;
  /**
   * 事業所API
   * @type {MfInvoiceApi.OfficeService}
   */
  public office: OfficeService;

  /**
   * コンストラクタ
   * @param {string} accessToken アクセストークン
   * @param {Partial<MfClientServices>} services テスト用に注入するサービス(未指定時は各サービスを新規生成)
   */
  constructor(accessToken: string, services: Partial<MfClientServices> = {}) {
    if (!accessToken) {
      throw new Error('アクセストークンが不正です');
    }
    this.billings = services.billings ?? new BillingService(accessToken);
    this.quotes = services.quotes ?? new QuoteService(accessToken);
    this.partners = services.partners ?? new PartnerService(accessToken);
    this.items = services.items ?? new ItemService(accessToken);
    this.office = services.office ?? new OfficeService(accessToken);
  }
}

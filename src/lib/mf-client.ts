/* eslint-disable no-constant-condition */

import { BillingService } from '../service/billing-service';
import { ItemService } from '../service/item-service';
import { OfficeService } from '../service/office-service';
import { PartnerService } from '../service/partner-service';
import { QuoteService } from '../service/quote-service';

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
   */
  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('アクセストークンが不正です');
    }
    this.billings = new BillingService(accessToken);
    this.quotes = new QuoteService(accessToken);
    this.partners = new PartnerService(accessToken);
    this.items = new ItemService(accessToken);
    this.office = new OfficeService(accessToken);
  }
}

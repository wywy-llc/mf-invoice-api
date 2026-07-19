/**
 * Copyright 2026 wywy LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

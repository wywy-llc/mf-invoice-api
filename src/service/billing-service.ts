import { ServiceBase, BillingRangeKey, ReqMethod } from './service-base';

export class BillingService extends ServiceBase {
  /**
   * 請求書APIのベースURL
   */
  baseUrl: string = ServiceBase.API_BASE_URL + '/billings';
  /**
   * 請求書一覧の取得
   * @param {string} from 検索範囲_開始日
   * @param {string} to 検索範囲_終了日
   * @param {string} query 検索文字列
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりの件数
   * @param {BillingRangeKey} rangeKey 検索範囲キー
   * - billing_date: 請求日
   * - due_date: 支払期日
   * - sales_date: 売上日
   * - created_at: 作成日
   * - updated_at : 更新日
   * @returns {MfInvoiceApi.BillingsResponse} 請求書レスポンス
   */
  getBillings(
    from: string,
    to: string,
    query: string = '',
    page: number = 1,
    perPage: number = 100,
    rangeKey: BillingRangeKey = 'billing_date'
  ): MfInvoiceApi.BillingsResponse {
    if (!from || !to) {
      throw new Error('from and to are required.');
    }
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}&range_key=${rangeKey}&from=${from}&to=${to}&q=${query}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * インボイス制度に対応した形式の請求書の作成
   * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
   * @returns {MfInvoiceApi.Billing} 請求書
   */
  createNew(billingReqBody: MfInvoiceApi.BillingReqBody): MfInvoiceApi.Billing {
    if (!billingReqBody) {
      throw new Error('billingReqBody is required.');
    }
    const reqUrl = `${ServiceBase.API_BASE_URL}/invoice_template_billings`;
    const method = ReqMethod.post;
    const payload = JSON.stringify(billingReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 請求書の取得
   * @param {string} billingId 請求書ID
   * @returns {MfInvoiceApi.Billing} 請求書
   */
  getBilling(billingId: string): MfInvoiceApi.Billing {
    if (!billingId) {
      throw new Error('billingId is required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 請求書の更新
   * @param {string} billingId 請求書ID
   * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
   * @returns {MfInvoiceApi.Billing} 請求書
   */
  updateBilling(
    billingId: string,
    billingReqBody: MfInvoiceApi.BillingReqBody
  ): MfInvoiceApi.Billing {
    if (!billingId || !billingReqBody) {
      throw new Error('billingId and billingReqBody are required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}`;
    const method = ReqMethod.put;
    const payload = JSON.stringify(billingReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 請求書の入金ステータス変更
   * @param {string} billingId 請求書ID
   * @param {MfInvoiceApi.PaymentStatus} paymentStatus 入金ステータス
   */
  updatePaymentStatus(
    billingId: string,
    paymentStatus: MfInvoiceApi.PaymentStatus
  ): MfInvoiceApi.Billing {
    if (!billingId || !paymentStatus) {
      throw new Error('billingId and paymentStatus are required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/payment_status`;
    const method = ReqMethod.put;
    const payload = JSON.stringify({ payment_status: paymentStatus });
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 請求書の削除
   * @param {string} billingId 請求書ID
   * @returns {MfInvoiceApi.Billing} 請求書
   */
  deleteBilling(billingId: string): boolean {
    if (!billingId) {
      throw new Error('billingId is required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 請求書に紐づく品目一覧の取得
   * @param {string} billingId 請求書ID
   * @returns {MfInvoiceApi.BillingsResponse} 請求書レスポンス
   */
  getBillingItems(billingId: string): MfInvoiceApi.BillingsResponse {
    if (!billingId) {
      throw new Error('billingId is required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/items`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 請求書に紐づく品目の取得
   * @param {string} billingId 請求書ID
   * @param {string} itemId 品目ID
   * @returns {MfInvoiceApi.BillingItem} 請求書品目
   */
  getBillingItem(billingId: string, itemId: string): MfInvoiceApi.BillingItem {
    if (!billingId || !itemId) {
      throw new Error('billingId and itemId are required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/items/${itemId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 請求書に品目を追加
   * @param billingId 請求書ID
   * @param itemReqBody 品目リクエストボディ
   * @returns {boolean} 成功時はtrue
   */
  attachBillingItem(
    billingId: string,
    itemReqBody: MfInvoiceApi.BillingItemReqBody
  ): MfInvoiceApi.BillingItem {
    if (!billingId || !itemReqBody) {
      throw new Error('billingId and item are required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/items`;
    const method = ReqMethod.post;
    const payload = JSON.stringify(itemReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 請求書に紐づく品目の削除
   * @param {string} billingId 請求書ID
   * @param {string} itemId 品目ID
   * @returns {boolean} 削除成功時はtrue
   */
  deleteBillingItem(billingId: string, itemId: string): boolean {
    if (!billingId || !itemId) {
      throw new Error('billingId and itemId are required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/items/${itemId}`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
  /**
   * 請求書の郵送依頼
   * @param {string} billingId 請求書ID
   * @returns {boolean} 郵送依頼成功時はtrue
   */
  applyToPostBilling(billingId: string): boolean {
    if (!billingId) {
      throw new Error('billingId is required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/posting`;
    const method = ReqMethod.post;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
  /**
   * 請求書の郵送キャンセル
   * @param {string} billingId 請求書ID
   * @returns {boolean} 郵送キャンセル成功時はtrue
   */
  cancelPostBilling(billingId: string): boolean {
    if (!billingId) {
      throw new Error('billingId is required.');
    }
    const reqUrl = `${this.baseUrl}/${billingId}/posting`;
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }
}

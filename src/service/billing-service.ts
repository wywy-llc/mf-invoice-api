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
    query: string,
    page: number = 1,
    perPage: number = 100,
    rangeKey: BillingRangeKey = 'billing_date'
  ): MfInvoiceApi.BillingsResponse {
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
    const reqUrl = `${this.baseUrl}/${billingId}`;
    const method = ReqMethod.put;
    const payload = JSON.stringify(billingReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }
}

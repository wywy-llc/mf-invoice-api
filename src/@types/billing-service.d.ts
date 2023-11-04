declare namespace MfInvoiceApi {
  interface BillingService extends ServiceBase {
    /**
     * 請求書APIのベースURL
     */
    baseUrl: string;
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
      query?: string,
      page?: number,
      perPage?: number,
      rangeKey?: BillingRangeKey
    ): MfInvoiceApi.BillingsResponse;
    /**
     * インボイス制度に対応した形式の請求書の作成
     * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    createNew(
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の取得
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    getBilling(billingId: string): MfInvoiceApi.Billing;
    /**
     * 請求書の更新
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    updateBilling(billingId: string): MfInvoiceApi.Billing;
    /**
     * 請求書の入金ステータス変更
     * @param {string} billingId 請求書ID
     * @param {MfInvoiceApi.PaymentStatus} paymentStatus 入金ステータス
     */
    updatePaymentStatus(
      billingId: string,
      paymentStatus: MfInvoiceApi.PaymentStatus
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の削除
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    deleteBilling(billingId: string): boolean;
    /**
     * 請求書に紐づく品目一覧の取得
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.BillingsResponse} 請求書レスポンス
     */
    getBillingItems(billingId: string): MfInvoiceApi.BillingsResponse;
    /**
     * 請求書に紐づく品目の取得
     * @param {string} billingId 請求書ID
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.BillingItem} 請求書品目
     */
    getBillingItem(billingId: string, itemId: string): MfInvoiceApi.BillingItem;
    /**
     * 請求書に品目を追加
     * @param billingId 請求書ID
     * @param itemReqBody 品目リクエストボディ
     * @returns {boolean} 成功時はtrue
     */
    attachBillingItem(
      billingId: string,
      itemReqBody: MfInvoiceApi.BillingItemReqBody
    ): MfInvoiceApi.BillingItem;
    /**
     * 請求書に紐づく品目の削除
     * @param {string} billingId 請求書ID
     * @param {string} itemId 品目ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteBillingItem(billingId: string, itemId: string): boolean;
    /**
     * 請求書の郵送依頼
     * @param {string} billingId 請求書ID
     * @returns {boolean} 郵送依頼成功時はtrue
     */
    applyToPostBilling(billingId: string): boolean;
    /**
     * 請求書の郵送キャンセル
     * @param {string} billingId 請求書ID
     * @returns {boolean} 郵送キャンセル成功時はtrue
     */
    cancelPostBilling(billingId: string): boolean;
  }
}

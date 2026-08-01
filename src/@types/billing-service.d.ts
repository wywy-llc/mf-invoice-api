/**
 * Copyright 2026 wywy LLC and contributors
 */
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
     * @param {string} query 検索文字列(URLエンコード済みの文字列を渡しても二重エンコードしない。
     * ただし`50%20OFF`のようにエンコード形式と一致する生文字列は誤判定するため、`%`は`%25`にエスケープして渡す)
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
     * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    updateBilling(
      billingId: string,
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の入金ステータス変更
     * このエンドポイントは仕様上、未設定・未入金・入金済みの3値のみ受け付ける
     * (未払い・振込済みはAPI側で自動計算されるため直接指定不可)
     * @param {string} billingId 請求書ID
     * @param {Extract<MfInvoiceApi.PaymentStatus, '0' | '1' | '2'>} paymentStatus 入金ステータス
     */
    updatePaymentStatus(
      billingId: string,
      paymentStatus: Extract<MfInvoiceApi.PaymentStatus, '0' | '1' | '2'>
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の削除
     * @param {string} billingId 請求書ID
     * @returns {boolean} 削除成功時はtrue
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
     * @param itemReqBody 品目リクエストボディ(item_idまたはnameのいずれかが必須)
     * @returns {boolean} 成功時はtrue
     */
    attachBillingItem(
      billingId: string,
      itemReqBody: MfInvoiceApi.BillingItemReqBody
    ): boolean;
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

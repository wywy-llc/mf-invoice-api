/**
 * Copyright 2026 wywy LLC and contributors
 */
declare namespace MfInvoiceApi {
  interface PartnerService extends ServiceBase {
    baseUrl: string;
    /**
     * 取引先一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.PartnersResponse} 取引先一覧
     */
    getPartners(page?: number, perPage?: number): MfInvoiceApi.PartnersResponse;
    /**
     * 取引先の作成
     * @param {MfInvoiceApi.PartnerReqBody} 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    createNew(
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の取得
     * @param {string} partnerId 取引先ID
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    getPartner(partnerId: string): MfInvoiceApi.Partner;
    /**
     * 取引先の更新
     * @param {string} partnerId 取引先ID
     * @param {MfInvoiceApi.PartnerReqBody} partnerReqBody 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    updatePartner(
      partnerId: string,
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の削除
     * @param partnerId 取引先ID
     * @returns {boolean} 削除成功時はtrue
     */
    deletePartner(partnerId: string): boolean;
    /**
     * 全ての取引先を取得
     * MAX_PAGES(100ページ)を超える場合は打ち切り、取得できた分のみを返す(console.errorで警告出力)
     * @returns {MfInvoiceApi.Partner[]} 取引先一覧
     */
    getAll(): MfInvoiceApi.Partner[];
  }
}

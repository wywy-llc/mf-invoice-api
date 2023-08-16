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
    getPartner(partnerId: String): MfInvoiceApi.Partner;
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
     * 全ての取引先を取得
     * @returns {MfInvoiceApi.Partner[]} 取引先一覧
     */
    getAll(): MfInvoiceApi.Partner[];
  }
}

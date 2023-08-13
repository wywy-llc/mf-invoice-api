declare namespace MfInvoiceApi {
  interface PartnerService extends ServiceBase {
    baseUrl: string;
    /**
     * 取引先一覧の取得
     * @param page ページ番号
     * @param perPage 1ページあたりのデータ数
     * @returns 取引先一覧
     */
    getPartners(page?: number, perPage?: number): MfInvoiceApi.PartnersResponse;
    /**
     * 取引先の作成
     * @param partnerReqBody 取引先
     * @returns 取引先
     */
    createNew(
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の取得
     * @param partnerId 取引先ID
     * @returns 取引先
     */
    getPartner(partnerId: String): MfInvoiceApi.Partner;
    /**
     * 取引先の更新
     * @param partnerId 取引先ID
     * @param partnerReqBody 取引先
     * @returns 取引先
     */
    updatePartner(
      partnerId: string,
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 全ての取引先を取得
     * @returns 全ての取引先
     */
    getAll(): MfInvoiceApi.Partner[];
  }
}

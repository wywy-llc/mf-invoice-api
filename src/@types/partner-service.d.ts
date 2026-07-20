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
     * 取引先に紐づく部署一覧の取得
     * @param {string} partnerId 取引先ID
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.DepartmentsResponse} 取引先部署一覧
     */
    getDepartments(
      partnerId: string,
      page?: number,
      perPage?: number
    ): MfInvoiceApi.DepartmentsResponse;
    /**
     * 取引先に部署を追加
     * @param {string} partnerId 取引先ID
     * @param {MfInvoiceApi.DepartmentReqBody} departmentReqBody 取引先部署リクエストボディ
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    createDepartment(
      partnerId: string,
      departmentReqBody: MfInvoiceApi.DepartmentReqBody
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の取得
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    getDepartment(
      partnerId: string,
      departmentId: string
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の更新
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @param {MfInvoiceApi.DepartmentReqBody} departmentReqBody 取引先部署リクエストボディ
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    updateDepartment(
      partnerId: string,
      departmentId: string,
      departmentReqBody: MfInvoiceApi.DepartmentReqBody
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の削除
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteDepartment(partnerId: string, departmentId: string): boolean;
    /**
     * 全ての取引先を取得
     * @returns {MfInvoiceApi.Partner[]} 取引先一覧
     */
    getAll(): MfInvoiceApi.Partner[];
  }
}

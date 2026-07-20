/**
 * Copyright 2026 wywy LLC and contributors
 */
import { ReqMethod, ServiceBase } from './service-base';

export class PartnerService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/partners';

  /**
   * getAllで取得を打ち切るページ数の上限
   * GASの実行時間上限(6分)超過を防ぐための安全弁
   */
  private static readonly MAX_PAGES = 100;

  /**
   * 取引先一覧の取得
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりのデータ数
   * @returns {MfInvoiceApi.PartnersResponse} 取引先一覧
   */
  getPartners(
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.PartnersResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}`;
    return this.request<MfInvoiceApi.PartnersResponse>(reqUrl, ReqMethod.get);
  }

  /**
   * 取引先の作成
   * @param {MfInvoiceApi.PartnerReqBody} 取引先リクエストボディ
   * @returns {MfInvoiceApi.Partner} 取引先
   */
  createNew(partnerReqBody: MfInvoiceApi.PartnerReqBody): MfInvoiceApi.Partner {
    if (!partnerReqBody) {
      throw new Error('partnerReqBody is required.');
    }
    return this.request<MfInvoiceApi.Partner>(
      this.baseUrl,
      ReqMethod.post,
      JSON.stringify(partnerReqBody)
    );
  }

  /**
   * 取引先の取得
   * @param {string} partnerId 取引先ID
   * @returns {MfInvoiceApi.Partner} 取引先
   */
  getPartner(partnerId: string): MfInvoiceApi.Partner {
    if (!partnerId) {
      throw new Error('partnerId is required.');
    }
    const reqUrl = `${this.baseUrl}/${partnerId}`;
    return this.request<MfInvoiceApi.Partner>(reqUrl, ReqMethod.get);
  }

  /**
   * 取引先の更新
   * @param {string} partnerId 取引先ID
   * @param {MfInvoiceApi.PartnerReqBody} partnerReqBody 取引先リクエストボディ
   * @returns {MfInvoiceApi.Partner} 取引先
   */
  updatePartner(
    partnerId: string,
    partnerReqBody: MfInvoiceApi.PartnerReqBody
  ): MfInvoiceApi.Partner {
    if (!partnerId || !partnerReqBody) {
      throw new Error('partnerId and partnerReqBody are required.');
    }
    const reqUrl = `${this.baseUrl}/${partnerId}`;
    return this.request<MfInvoiceApi.Partner>(
      reqUrl,
      ReqMethod.put,
      JSON.stringify(partnerReqBody)
    );
  }
  /**
   * 取引先の削除
   * @param partnerId 取引先ID
   * @returns {boolean} 削除成功時はtrue
   */
  deletePartner(partnerId: string): boolean {
    if (!partnerId) {
      throw new Error('partnerId is required.');
    }
    const reqUrl = `${this.baseUrl}/${partnerId}`;
    return this.request<boolean>(reqUrl, ReqMethod.delete);
  }

  /**
   * 取引先に紐づく部署一覧の取得
   * @param {string} partnerId 取引先ID
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりのデータ数
   * @returns {MfInvoiceApi.DepartmentsResponse} 取引先部署一覧
   */
  getDepartments(
    partnerId: string,
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.DepartmentsResponse {
    if (!partnerId) {
      throw new Error('partnerId is required.');
    }
    const reqUrl = `${this.baseUrl}/${encodeURIComponent(
      partnerId
    )}/departments?page=${page}&per_page=${perPage}`;
    return this.request<MfInvoiceApi.DepartmentsResponse>(
      reqUrl,
      ReqMethod.get
    );
  }

  /**
   * 取引先に部署を追加
   * @param {string} partnerId 取引先ID
   * @param {MfInvoiceApi.DepartmentReqBody} departmentReqBody 取引先部署リクエストボディ
   * @returns {MfInvoiceApi.Department} 取引先部署
   */
  createDepartment(
    partnerId: string,
    departmentReqBody: MfInvoiceApi.DepartmentReqBody
  ): MfInvoiceApi.Department {
    if (
      !partnerId ||
      !departmentReqBody ||
      Object.keys(departmentReqBody).length === 0
    ) {
      throw new Error(
        'partnerId and departmentReqBody(at least one property) are required.'
      );
    }
    const reqUrl = `${this.baseUrl}/${encodeURIComponent(
      partnerId
    )}/departments`;
    return this.request<MfInvoiceApi.Department>(
      reqUrl,
      ReqMethod.post,
      JSON.stringify(departmentReqBody)
    );
  }

  /**
   * 取引先に紐づく部署の取得
   * @param {string} partnerId 取引先ID
   * @param {string} departmentId 取引先部署ID
   * @returns {MfInvoiceApi.Department} 取引先部署
   */
  getDepartment(
    partnerId: string,
    departmentId: string
  ): MfInvoiceApi.Department {
    if (!partnerId || !departmentId) {
      throw new Error('partnerId and departmentId are required.');
    }
    const reqUrl = `${this.baseUrl}/${encodeURIComponent(
      partnerId
    )}/departments/${encodeURIComponent(departmentId)}`;
    return this.request<MfInvoiceApi.Department>(reqUrl, ReqMethod.get);
  }

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
  ): MfInvoiceApi.Department {
    if (
      !partnerId ||
      !departmentId ||
      !departmentReqBody ||
      Object.keys(departmentReqBody).length === 0
    ) {
      throw new Error(
        'partnerId and departmentId and departmentReqBody(at least one property) are required.'
      );
    }
    const reqUrl = `${this.baseUrl}/${encodeURIComponent(
      partnerId
    )}/departments/${encodeURIComponent(departmentId)}`;
    return this.request<MfInvoiceApi.Department>(
      reqUrl,
      ReqMethod.put,
      JSON.stringify(departmentReqBody)
    );
  }

  /**
   * 取引先に紐づく部署の削除
   * @param {string} partnerId 取引先ID
   * @param {string} departmentId 取引先部署ID
   * @returns {boolean} 削除成功時はtrue
   */
  deleteDepartment(partnerId: string, departmentId: string): boolean {
    if (!partnerId || !departmentId) {
      throw new Error('partnerId and departmentId are required.');
    }
    const reqUrl = `${this.baseUrl}/${encodeURIComponent(
      partnerId
    )}/departments/${encodeURIComponent(departmentId)}`;
    return this.request<boolean>(reqUrl, ReqMethod.delete);
  }

  /**
   * 全ての取引先を取得
   * MAX_PAGES(100ページ)を超える場合は打ち切り、取得できた分のみを返す(console.errorで警告出力)
   * @returns {MfInvoiceApi.Partner[]} 取引先一覧
   */
  getAll(): MfInvoiceApi.Partner[] {
    const partners: MfInvoiceApi.Partner[] = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages && page <= PartnerService.MAX_PAGES) {
      const partnersRes = this.getPartners(page);
      totalPages = partnersRes.pagination.total_pages;
      if (partnersRes.data.length === 0) {
        break;
      }
      partners.push(...partnersRes.data);
      page += 1;
    }
    if (page > PartnerService.MAX_PAGES) {
      // MAX_PAGESで打ち切ったため取得漏れがある可能性を明示する
      console.error(
        `getAll: MAX_PAGES(${PartnerService.MAX_PAGES})に達したため取得を打ち切りました。全${totalPages}ページ中${PartnerService.MAX_PAGES}ページのみ取得。`
      );
    }
    console.info(partners.length + '件の取引先取得に成功。');
    return partners;
  }
}

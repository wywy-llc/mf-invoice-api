import { ReqMethod, ServiceBase } from './service-base';

export class PartnerService extends ServiceBase {
  baseUrl: string = ServiceBase.API_BASE_URL + '/partners';

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
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
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
    const reqUrl = this.baseUrl;
    const method = ReqMethod.post;
    const payload = JSON.stringify(partnerReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
  }

  /**
   * 取引先の取得
   * @param {string} partnerId 取引先ID
   * @returns {MfInvoiceApi.Partner} 取引先
   */
  getPartner(partnerId: String): MfInvoiceApi.Partner {
    if (!partnerId) {
      throw new Error('partnerId is required.');
    }
    const reqUrl = `${this.baseUrl}/${partnerId}`;
    const method = ReqMethod.get;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
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
    const method = ReqMethod.put;
    const payload = JSON.stringify(partnerReqBody);
    const res = this.fetch(reqUrl, method, payload);
    return this.processResponse(res);
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
    const method = ReqMethod.delete;
    const res = this.fetch(reqUrl, method);
    return this.processResponse(res);
  }

  /**
   * 全ての取引先を取得
   * @returns {MfInvoiceApi.Partner[]} 取引先一覧
   */
  getAll(): MfInvoiceApi.Partner[] {
    const partners: MfInvoiceApi.Partner[] = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const partnersRes = this.getPartners(page);
      totalPages = partnersRes.pagination.total_pages;
      if (partnersRes.data.length === 0) {
        break;
      }
      partners.push(...partnersRes.data);
      page += 1;
    }
    console.log(partners.length + '件の取引先取得に成功。');
    return partners;
  }
}

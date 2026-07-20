/**
 * Copyright 2026 wywy LLC and contributors
 */
import { ReqMethod, ServiceBase } from './service-base';

/**
 * OfficeService
 */
export class OfficeService extends ServiceBase {
  /**
   * baseUrl
   */
  baseUrl: string = ServiceBase.API_BASE_URL + '/office';

  /**
   * 適格請求書発行事業者番号の形式(T+13桁)
   */
  private static readonly REGISTRATION_CODE_PATTERN = /^T\d{13}$/;

  /**
   * 事業者情報の取得
   * @returns {MfInvoiceApi.Office} 事業者情報
   */
  getMyOffice(): MfInvoiceApi.Office {
    return this.request<MfInvoiceApi.Office>(this.baseUrl, ReqMethod.get);
  }

  /**
   * 事業者情報の更新
   * @param {MfInvoiceApi.OfficeReqBody} officeReqBody 事業者情報リクエストボディ
   * @returns {MfInvoiceApi.Office} 更新後の事業者情報
   */
  updateOffice(officeReqBody: MfInvoiceApi.OfficeReqBody): MfInvoiceApi.Office {
    if (!officeReqBody || Object.keys(officeReqBody).length === 0) {
      throw new Error('officeReqBody(at least one property) is required.');
    }
    return this.request<MfInvoiceApi.Office>(
      this.baseUrl,
      ReqMethod.put,
      JSON.stringify(officeReqBody)
    );
  }

  /**
   * 適格請求書発行事業者番号の作成・更新
   * @param {string} registrationCode 適格請求書発行事業者番号(T+13桁)
   * @returns {MfInvoiceApi.RegistrationCodeResponse} 登録番号レスポンス
   */
  updateRegistrationCode(
    registrationCode: string
  ): MfInvoiceApi.RegistrationCodeResponse {
    if (!registrationCode) {
      throw new Error('registrationCode is required.');
    }
    if (!OfficeService.REGISTRATION_CODE_PATTERN.test(registrationCode)) {
      throw new Error(
        'registrationCode must match the format "T" followed by 13 digits.'
      );
    }
    const reqUrl = `${this.baseUrl}/registration_code`;
    return this.request<MfInvoiceApi.RegistrationCodeResponse>(
      reqUrl,
      ReqMethod.put,
      JSON.stringify({ registration_code: registrationCode })
    );
  }

  /**
   * 適格請求書発行事業者番号の削除
   * @returns {boolean} 削除成功時はtrue
   */
  deleteRegistrationCode(): boolean {
    const reqUrl = `${this.baseUrl}/registration_code`;
    return this.request<boolean>(reqUrl, ReqMethod.delete);
  }
}

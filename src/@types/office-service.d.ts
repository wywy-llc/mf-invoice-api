/**
 * Copyright 2026 wywy LLC and contributors
 */
declare namespace MfInvoiceApi {
  interface OfficeService extends ServiceBase {
    /**
     * baseUrl
     */
    baseUrl: string;
    /**
     * 事業者情報の取得
     * @returns {MfInvoiceApi.Office} 事業者情報
     */
    getMyOffice(): MfInvoiceApi.Office;
    /**
     * 事業者情報の更新
     * @param {MfInvoiceApi.OfficeReqBody} officeReqBody 事業者情報リクエストボディ
     * @returns {MfInvoiceApi.Office} 更新後の事業者情報
     */
    updateOffice(
      officeReqBody: MfInvoiceApi.OfficeReqBody
    ): MfInvoiceApi.Office;
    /**
     * 適格請求書発行事業者番号の作成・更新
     * @param {string} registrationCode 適格請求書発行事業者番号(T+13桁)
     * @returns {MfInvoiceApi.RegistrationCodeResponse} 登録番号レスポンス
     */
    updateRegistrationCode(
      registrationCode: string
    ): MfInvoiceApi.RegistrationCodeResponse;
    /**
     * 適格請求書発行事業者番号の削除
     * @returns {boolean} 削除成功時はtrue
     */
    deleteRegistrationCode(): boolean;
  }
}

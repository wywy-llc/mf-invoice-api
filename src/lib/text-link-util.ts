export class TextLinkUtil {
  /**
   * MF請求書URLを生成します。
   * @param {string} billingNumber 請求書番号
   * @returns {string} MF請求書URL
   */
  static createMfBillingUrl(billingNumber: String) {
    return `https://invoice.moneyforward.com/billings?view_mode=list&document_number=${billingNumber}`;
  }

  /**
   * MF取引先URLを生成します。
   * @param {string} partnerId 取引先ID
   * @returns {string} MF取引先URL
   */
  static createPartnerUrl(partnerId: String) {
    return `https://invoice.moneyforward.com/partners?action=edit&id=${partnerId}`;
  }
}

export class TextLinkUtil {
  /**
   * MF請求書URLを生成します。
   * @param {string} billingNumber 請求書番号
   */
  static createMfBillingUrl(billingNumber: String) {
    return `https://invoice.moneyforward.com/billings?view_mode=list&document_number=${billingNumber}`;
  }

  /**
   * 取引先URLを生成します。
   */
  static createPartnerUrl(partnerId: String) {
    return `https://invoice.moneyforward.com/partners?action=edit&id=${partnerId}`;
  }
}

declare namespace MfInvoiceApi {
  export declare class TextLinkUtil {
    /**
     * MF請求書URLを生成します。
     * @param {string} billingNumber 請求書番号
     */
    static createMfBillingUrl(billingNumber: string): string;
    /**
     * 取引先URLを生成します。
     */
    static createPartnerUrl(partnerId: string): string;
  }
}

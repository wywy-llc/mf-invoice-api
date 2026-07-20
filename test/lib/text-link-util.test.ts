import { TextLinkUtil } from '../../src/lib/text-link-util';

describe('TextLinkUtil', () => {
  describe('createMfBillingUrl', () => {
    it('請求書番号を指定すると、MF請求書一覧URLを返す', () => {
      const result = TextLinkUtil.createMfBillingUrl('12345');
      expect(result).toBe(
        'https://invoice.moneyforward.com/billings?view_mode=list&document_number=12345'
      );
    });
    it('空文字を指定すると、document_numberが空のURLを返す', () => {
      const result = TextLinkUtil.createMfBillingUrl('');
      expect(result).toBe(
        'https://invoice.moneyforward.com/billings?view_mode=list&document_number='
      );
    });
  });

  describe('createPartnerUrl', () => {
    it('取引先IDを指定すると、MF取引先編集URLを返す', () => {
      const result = TextLinkUtil.createPartnerUrl('p_1');
      expect(result).toBe(
        'https://invoice.moneyforward.com/partners?action=edit&id=p_1'
      );
    });
    it('空文字を指定すると、idが空のURLを返す', () => {
      const result = TextLinkUtil.createPartnerUrl('');
      expect(result).toBe(
        'https://invoice.moneyforward.com/partners?action=edit&id='
      );
    });
  });
});

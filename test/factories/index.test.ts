import {
  billingFactory,
  billingItemFactory,
  partnerFactory,
  paginationDataFactory,
  resetAllFactorySequences,
} from './index';

describe('factories', () => {
  describe('リセット', () => {
    it('resetAllFactorySequencesを呼び出すと、全ファクトリーの連番がリセットされる', () => {
      const before = billingItemFactory.build();
      resetAllFactorySequences();
      const after = billingItemFactory.build();
      expect(after.id).toBe(before.id);
    });
  });

  describe('ネストしたファクトリー合成', () => {
    it('billingFactoryをbuildすると、itemsを1件含む', () => {
      const billing = billingFactory.build();
      expect(billing.items).toHaveLength(1);
    });

    it('partnerFactoryをbuildすると、departmentsを1件含む', () => {
      const partner = partnerFactory.build();
      expect(partner.departments).toHaveLength(1);
    });
  });

  describe('paginationDataFactory', () => {
    it('デフォルトでbuildすると、1ページ目のページネーション情報を返す', () => {
      const pagination = paginationDataFactory.build();
      expect(pagination.current_page).toBe(1);
    });
  });
});

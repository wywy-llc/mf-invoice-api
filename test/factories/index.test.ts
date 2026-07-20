import {
  billingFactory,
  billingItemFactory,
  partnerFactory,
  paginationDataFactory,
  resetAllFactorySequences,
} from './index';

describe('factories', () => {
  describe('連番の一意性', () => {
    test('id はビルドごとにインクリメントされる', () => {
      const first = billingItemFactory.build();
      const second = billingItemFactory.build();
      expect(first.id).not.toBe(second.id);
    });

    test('resetAllFactorySequences で連番がリセットされる', () => {
      const before = billingItemFactory.build();
      resetAllFactorySequences();
      const after = billingItemFactory.build();
      expect(after.id).toBe(before.id);
    });
  });

  describe('オーバーライド', () => {
    test('build に渡した値でデフォルト値を上書きできる', () => {
      const billing = billingFactory.build({ title: '2024年6月分請求書' });
      expect(billing.title).toBe('2024年6月分請求書');
    });
  });

  describe('ネストしたファクトリー合成', () => {
    test('billingFactory は items を1件含む', () => {
      const billing = billingFactory.build();
      expect(billing.items).toHaveLength(1);
    });

    test('partnerFactory は departments を1件含む', () => {
      const partner = partnerFactory.build();
      expect(partner.departments).toHaveLength(1);
    });
  });

  describe('buildList', () => {
    test('指定件数のリストを生成する', () => {
      const items = billingItemFactory.buildList(3);
      expect(items).toHaveLength(3);
      expect(new Set(items.map(item => item.id)).size).toBe(3);
    });
  });

  describe('paginationDataFactory', () => {
    test('デフォルトで1ページ目のページネーション情報を生成する', () => {
      const pagination = paginationDataFactory.build();
      expect(pagination.current_page).toBe(1);
    });
  });
});

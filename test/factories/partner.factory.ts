/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { departmentFactory } from './department.factory';
import { paginationDataFactory } from './pagination-data.factory';

/**
 * 取引先のテストデータを生成するファクトリー
 *
 * Factory.tsパターンを使用してPartnerオブジェクトを生成します。
 * 取引先部署(departments)はデフォルトでdepartmentFactoryが生成した1件を含みます。
 *
 * @example
 * const partner = partnerFactory.build();
 *
 * @example
 * const partner = partnerFactory.build({ name: '株式会社サンプル' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * partnerFactory.resetSequenceNumber();
 */
export const partnerFactory = Factory.Sync.makeFactory<MfInvoiceApi.Partner>({
  id: Factory.each(i => `partner_${i + 1}`),
  code: Factory.each(i => `PTN-${String(i + 1).padStart(4, '0')}`),
  name: Factory.each(i => `テスト取引先${i + 1}`),
  name_kana: '',
  name_suffix: '御中',
  memo: '',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  departments: Factory.each(() => departmentFactory.buildList(1)),
});

/**
 * 取引先一覧レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = partnersResponseFactory.build();
 */
export const partnersResponseFactory =
  Factory.Sync.makeFactory<MfInvoiceApi.PartnersResponse>({
    data: Factory.each(() => partnerFactory.buildList(1)),
    pagination: Factory.each(() => paginationDataFactory.build()),
  });

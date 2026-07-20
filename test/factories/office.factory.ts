/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';

/**
 * 事業者情報のテストデータを生成するファクトリー
 *
 * @example
 * const office = officeFactory.build();
 *
 * @example
 * const office = officeFactory.build({ name: '株式会社サンプル' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * officeFactory.resetSequenceNumber();
 */
export const officeFactory = Factory.Sync.makeFactory<MfInvoiceApi.Office>({
  id: Factory.each(i => `office_${i + 1}`),
  name: 'テスト事業者',
  zip: '100-0001',
  prefecture: '東京都',
  address1: '千代田区1-1-1',
  address2: '',
  tel: '03-1234-5678',
  fax: '',
  office_type: '',
  office_code: '',
  registration_code: 'T1234567890123',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
});

/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { createFactoryWrapper } from './base.factory';

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
export const officeFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.Office>({
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
  })
);

/**
 * 事業者情報更新リクエストボディのテストデータを生成するファクトリー
 *
 * @example
 * const reqBody = officeReqBodyFactory.build();
 *
 * @example
 * const reqBody = officeReqBodyFactory.build({ name: '株式会社サンプル' });
 */
export const officeReqBodyFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.OfficeReqBody>({
    name: 'テスト事業者',
    zip: '100-0001',
    prefecture: '東京都',
    address1: '千代田区1-1-1',
    address2: '',
    tel: '03-1234-5678',
    fax: '',
  })
);

/**
 * 適格請求書発行事業者番号レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = registrationCodeResponseFactory.build();
 *
 * @example
 * const response = registrationCodeResponseFactory.build({
 *   registration_code: 'T9876543210123',
 * });
 */
export const registrationCodeResponseFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.RegistrationCodeResponse>({
    registration_code: 'T1234567890123',
  })
);

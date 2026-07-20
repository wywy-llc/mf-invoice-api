/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { createFactoryWrapper } from './base.factory';

/**
 * 取引先部署のテストデータを生成するファクトリー
 *
 * @example
 * const department = departmentFactory.build();
 *
 * @example
 * const department = departmentFactory.build({ person_name: '山田太郎' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * departmentFactory.resetSequenceNumber();
 */
export const departmentFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.Department>({
    id: Factory.each(i => `department_${i + 1}`),
    zip: '100-0001',
    tel: '03-1234-5678',
    prefecture: '東京都',
    address1: '千代田区1-1-1',
    address2: '',
    person_name: Factory.each(i => `担当者${i + 1}`),
    person_title: '',
    person_dept: '営業部',
    email: Factory.each(i => `contact${i + 1}@example.com`),
    cc_emails: '',
    office_member_id: '',
    office_member_name: '',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  })
);

/**
 * 取引先部署作成リクエストボディのテストデータを生成するファクトリー
 *
 * @example
 * const reqBody = departmentReqBodyFactory.build();
 *
 * @example
 * const reqBody = departmentReqBodyFactory.build({ person_name: '山田太郎' });
 */
export const departmentReqBodyFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.DepartmentReqBody>({
    zip: '100-0001',
    tel: '03-1234-5678',
    prefecture: '東京都',
    address1: '千代田区1-1-1',
    address2: '',
    person_name: Factory.each(i => `担当者${i + 1}`),
    person_title: '',
    person_dept: '営業部',
    office_member_name: '',
    email: Factory.each(i => `contact${i + 1}@example.com`),
    cc_emails: '',
  })
);

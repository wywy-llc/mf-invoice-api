/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { Excise } from '../../src/service/service-base';
import { createFactoryWrapper } from './base.factory';

/**
 * 請求書品目のテストデータを生成するファクトリー
 *
 * @example
 * const item = billingItemFactory.build();
 *
 * @example
 * const item = billingItemFactory.build({ name: 'コンサルティング費用', price: '50000' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * billingItemFactory.resetSequenceNumber();
 */
export const billingItemFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.BillingItem>({
    id: Factory.each(i => `billing_item_${i + 1}`),
    name: Factory.each(i => `テスト品目${i + 1}`),
    code: Factory.each(i => `ITEM-${String(i + 1).padStart(4, '0')}`),
    detail: '',
    unit: '個',
    price: '1000',
    quantity: '1',
    is_deduct_withholding_tax: false,
    excise: Excise.ten_percent,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    delivery_number: '',
    delivery_date: '',
  })
);

/**
 * 請求書品目作成リクエストボディのテストデータを生成するファクトリー
 *
 * @example
 * const reqBody = billingItemReqBodyFactory.build();
 *
 * @example
 * const reqBody = billingItemReqBodyFactory.build({ item_id: 'item_1', quantity: 2 });
 */
export const billingItemReqBodyFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.BillingItemReqBody>({
    item_id: Factory.each(i => `item_${i + 1}`),
    delivery_number: '',
    delivery_date: '',
    detail: '',
    unit: '個',
    price: 1000,
    quantity: 1,
    is_deduct_withholding_tax: false,
    excise: Excise.ten_percent,
  })
);

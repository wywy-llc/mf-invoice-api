/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { Excise } from '../../src/service/service-base';
import { paginationDataFactory } from './pagination-data.factory';
import { createFactoryWrapper } from './base.factory';

/**
 * 品目のテストデータを生成するファクトリー
 *
 * @example
 * const item = itemFactory.build();
 *
 * @example
 * const item = itemFactory.build({ name: 'コンサルティング費用' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * itemFactory.resetSequenceNumber();
 */
export const itemFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.Item>({
    id: Factory.each(i => `item_${i + 1}`),
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
  })
);

/**
 * 品目一覧レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = itemsResponseFactory.build();
 */
export const itemsResponseFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.ItemsResponse>({
    data: Factory.each(() => itemFactory.buildList(1)),
    pagination: Factory.each(() => paginationDataFactory.build()),
  })
);

/**
 * Copyright 2026 wywy LLC and contributors
 */
export * from './base.factory';
export * from './pagination-data.factory';
export * from './billing-item.factory';
export * from './billing.factory';
export * from './department.factory';
export * from './partner.factory';
export * from './item.factory';
export * from './office.factory';
export * from './quote.factory';

import { resetAllFactories } from './base.factory';
import { paginationDataFactory } from './pagination-data.factory';
import {
  billingItemFactory,
  billingItemReqBodyFactory,
} from './billing-item.factory';
import {
  billingConfigFactory,
  billingFactory,
  billingsResponseFactory,
  billingReqBodyFactory,
} from './billing.factory';
import {
  departmentFactory,
  departmentReqBodyFactory,
} from './department.factory';
import {
  partnerFactory,
  partnersResponseFactory,
  partnerReqBodyFactory,
} from './partner.factory';
import {
  itemFactory,
  itemsResponseFactory,
  itemReqBodyFactory,
} from './item.factory';
import { officeFactory } from './office.factory';
import {
  quoteFactory,
  quotesResponseFactory,
  quoteItemReqBodyFactory,
  quoteReqBodyFactory,
} from './quote.factory';

/**
 * すべてのファクトリーのシーケンス番号をリセットする
 *
 * テストの独立性を保つため、beforeEach で必ず呼び出す(test/setup.ts で自動実行される)。
 * 新規ファクトリー追加時はここに登録する。
 *
 * @example
 * beforeEach(() => {
 *   resetAllFactorySequences();
 * });
 */
export function resetAllFactorySequences(): void {
  resetAllFactories(
    paginationDataFactory,
    billingItemFactory,
    billingItemReqBodyFactory,
    billingConfigFactory,
    billingFactory,
    billingsResponseFactory,
    billingReqBodyFactory,
    departmentFactory,
    departmentReqBodyFactory,
    partnerFactory,
    partnersResponseFactory,
    partnerReqBodyFactory,
    itemFactory,
    itemsResponseFactory,
    itemReqBodyFactory,
    officeFactory,
    quoteFactory,
    quotesResponseFactory,
    quoteItemReqBodyFactory,
    quoteReqBodyFactory
  );
}

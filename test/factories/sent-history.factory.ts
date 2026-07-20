/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { createFactoryWrapper } from './base.factory';
import { paginationDataFactory } from './pagination-data.factory';

/**
 * 送付履歴のテストデータを生成するファクトリー
 *
 * @example
 * const sentHistory = sentHistoryFactory.build();
 *
 * @example
 * const sentHistory = sentHistoryFactory.build({ type: 'FAX' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * sentHistoryFactory.resetSequenceNumber();
 */
export const sentHistoryFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.SentHistory>({
    id: Factory.each(i => i + 1),
    type: 'メール',
    operator_id: Factory.each(i => `operator_${i + 1}`),
    document_type: '請求書',
    document_id: Factory.each(i => `billing_${i + 1}`),
    from: 'do_not_reply@moneyforward.com',
    to: 'to@example.com',
    cc: '',
    sender_name: '',
    replay_to: '',
    sent_at: '2024-01-01T00:00:00.000Z',
  })
);

/**
 * 送付履歴一覧レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = sentHistoriesResponseFactory.build();
 */
export const sentHistoriesResponseFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.SentHistoriesResponse>({
    data: Factory.each(() => sentHistoryFactory.buildList(1)),
    pagination: Factory.each(() => paginationDataFactory.build()),
  })
);

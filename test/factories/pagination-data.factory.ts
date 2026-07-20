/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';

/**
 * ページネーション情報のテストデータを生成するファクトリー
 *
 * @example
 * const pagination = paginationDataFactory.build();
 *
 * @example
 * const pagination = paginationDataFactory.build({ current_page: 2 });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * paginationDataFactory.resetSequenceNumber();
 */
export const paginationDataFactory =
  Factory.Sync.makeFactory<MfInvoiceApi.PaginationData>({
    total_count: 1,
    total_pages: 1,
    per_page: 100,
    current_page: 1,
  });

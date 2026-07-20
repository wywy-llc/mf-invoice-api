/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { Excise, OrderStatus } from '../../src/service/service-base';
import { paginationDataFactory } from './pagination-data.factory';
import { createFactoryWrapper } from './base.factory';

/**
 * 見積書のテストデータを生成するファクトリー
 *
 * @example
 * const quote = quoteFactory.build();
 *
 * @example
 * const quote = quoteFactory.build({ title: '2024年6月分見積書' });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * quoteFactory.resetSequenceNumber();
 */
export const quoteFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.Quote>({
    id: Factory.each(i => `quote_${i + 1}`),
    pdf_url: Factory.each(
      i => `https://invoice.moneyforward.com/pdf/quote_${i + 1}.pdf`
    ),
    operator_id: 'operator_1',
    department_id: 'department_1',
    member_id: 'member_1',
    member_name: 'テスト担当者',
    partner_id: Factory.each(i => `partner_${i + 1}`),
    partner_name: Factory.each(i => `テスト取引先${i + 1}`),
    partner_detail: '',
    office_id: 'office_1',
    office_name: 'テスト事業者',
    office_detail: '東京都千代田区1-1-1',
    title: Factory.each(i => `見積書${i + 1}`),
    memo: '',
    quote_date: '2024-06-01',
    quote_number: Factory.each(i => `QUO-${String(i + 1).padStart(6, '0')}`),
    note: '',
    expired_date: '2024-07-01',
    document_name: '',
    order_status: OrderStatus.not_received,
    transmit_status: '',
    posting_status: '',
    created_at: '2024-06-01T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z',
    is_downloaded: false,
    is_locked: false,
    deduct_price: '0',
    tag_names: [],
    items: [],
    excise_price: '1000',
    excise_price_of_untaxable: '0',
    excise_price_of_non_taxable: '0',
    excise_price_of_tax_exemption: '0',
    excise_price_of_five_percent: '0',
    excise_price_of_eight_percent: '0',
    excise_price_of_eight_percent_as_reduced_tax_rate: '0',
    excise_price_of_ten_percent: '1000',
    subtotal_price: '10000',
    subtotal_of_untaxable_excise: '0',
    subtotal_of_non_taxable_excise: '0',
    subtotal_of_tax_exemption_excise: '0',
    subtotal_of_five_percent_excise: '0',
    subtotal_of_eight_percent_excise: '0',
    subtotal_of_eight_percent_as_reduced_tax_rate_excise: '0',
    subtotal_of_ten_percent_excise: '10000',
    total_price: '10000',
  })
);

/**
 * 見積書一覧レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = quotesResponseFactory.build();
 */
export const quotesResponseFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.QuotesResponse>({
    data: Factory.each(() => quoteFactory.buildList(1)),
    pagination: Factory.each(() => paginationDataFactory.build()),
  })
);

/**
 * 見積書品目作成リクエストボディのテストデータを生成するファクトリー
 *
 * @example
 * const reqBody = quoteItemReqBodyFactory.build();
 */
export const quoteItemReqBodyFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.QuoteItemReqBody>({
    item_id: Factory.each(i => `item_${i + 1}`),
    detail: '',
    unit: '個',
    price: 1000,
    quantity: 1,
    is_deduct_withholding_tax: false,
    excise: Excise.ten_percent,
  })
);

/**
 * 見積書作成リクエストボディのテストデータを生成するファクトリー
 *
 * @example
 * const reqBody = quoteReqBodyFactory.build();
 *
 * @example
 * const reqBody = quoteReqBodyFactory.build({ title: '2024年6月分見積書' });
 */
export const quoteReqBodyFactory = createFactoryWrapper(
  Factory.Sync.makeFactory<MfInvoiceApi.QuoteReqBody>({
    department_id: 'department_1',
    quote_number: Factory.each(i => `QUO-${String(i + 1).padStart(6, '0')}`),
    title: Factory.each(i => `見積書${i + 1}`),
    memo: '',
    quote_date: '2024-06-01',
    expired_date: '2024-07-01',
    note: '',
    tag_names: [],
    document_name: '',
    items: Factory.each(() => quoteItemReqBodyFactory.buildList(1)),
  })
);

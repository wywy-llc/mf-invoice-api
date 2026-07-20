/**
 * Copyright 2026 wywy LLC and contributors
 */
import * as Factory from 'factory.ts';
import { PaymentStatus } from '../../src/service/service-base';
import { billingItemFactory } from './billing-item.factory';
import { paginationDataFactory } from './pagination-data.factory';

/**
 * 請求書の詳細設定のテストデータを生成するファクトリー
 *
 * @example
 * const config = billingConfigFactory.build();
 */
export const billingConfigFactory =
  Factory.Sync.makeFactory<MfInvoiceApi.BillingConfig>({
    rounding: 'round',
    rounding_consumption_tax: 'round',
    consumption_tax_display_type: 'included',
  });

/**
 * 請求書のテストデータを生成するファクトリー
 *
 * Factory.tsパターンを使用してBillingオブジェクトを生成します。
 * 品目(items)はデフォルトでbillingItemFactoryが生成した1件を含みます。
 *
 * @example
 * // 基本的な使用例
 * const billing = billingFactory.build();
 *
 * @example
 * // 部分的な上書き
 * const billing = billingFactory.build({
 *   title: '2024年6月分請求書',
 *   partner_name: '株式会社サンプル',
 * });
 *
 * @example
 * // シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
 * billingFactory.resetSequenceNumber();
 */
export const billingFactory = Factory.Sync.makeFactory<MfInvoiceApi.Billing>({
  id: Factory.each(i => `billing_${i + 1}`),
  pdf_url: Factory.each(
    i => `https://invoice.moneyforward.com/pdf/billing_${i + 1}.pdf`
  ),
  operator_id: 'operator_1',
  department_id: 'department_1',
  member_id: 'member_1',
  member_name: 'テスト担当者',
  partner_id: Factory.each(i => `partner_${i + 1}`),
  partner_name: Factory.each(i => `テスト取引先${i + 1}`),
  office_id: 'office_1',
  office_name: 'テスト事業者',
  office_detail: '東京都千代田区1-1-1',
  title: Factory.each(i => `請求書${i + 1}`),
  memo: '',
  payment_condition: '',
  billing_date: '2024-06-01',
  due_date: '2024-06-30',
  sales_date: '2024-06-01',
  billing_number: Factory.each(i => `INV-${String(i + 1).padStart(6, '0')}`),
  note: '',
  document_name: '',
  payment_status: PaymentStatus.not_payment,
  email_status: '',
  posting_status: '',
  created_at: '2024-06-01T00:00:00.000Z',
  updated_at: '2024-06-01T00:00:00.000Z',
  is_downloaded: false,
  is_locked: false,
  deduct_price: '0',
  tag_names: [],
  items: Factory.each(() => billingItemFactory.buildList(1)),
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
  subtotal_with_tax_of_untaxable_excise: '0',
  subtotal_with_tax_of_non_taxable_excise: '0',
  subtotal_with_tax_of_tax_exemption_excise: '0',
  subtotal_with_tax_of_five_percent_excise: '0',
  subtotal_with_tax_of_eight_percent_excise: '0',
  subtotal_with_tax_of_eight_percent_as_reduced_tax_rate_excise: '0',
  subtotal_with_tax_of_ten_percent_excise: '11000',
  total_price: '11000',
  registration_code: 'T1234567890123',
  use_invoice_template: true,
  config: Factory.each(() => billingConfigFactory.build()),
});

/**
 * 請求書一覧レスポンスのテストデータを生成するファクトリー
 *
 * @example
 * const response = billingsResponseFactory.build();
 *
 * @example
 * const response = billingsResponseFactory.build({
 *   data: billingItemFactory.buildList(3),
 * });
 */
export const billingsResponseFactory =
  Factory.Sync.makeFactory<MfInvoiceApi.BillingsResponse>({
    data: Factory.each(() => billingItemFactory.buildList(1)),
    pagination: Factory.each(() => paginationDataFactory.build()),
  });

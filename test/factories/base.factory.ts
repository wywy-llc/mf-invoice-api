/**
 * Copyright 2026 wywy LLC and contributors
 */
/**
 * Base Factory
 *
 * factory.tsを使用したテストデータ生成の共通基盤
 * - ファクトリ管理のオブジェクトリテラルパターン
 */
import type { RecPartial } from 'factory.ts/lib/shared';

/**
 * 全フィールドにデフォルト値があるファクトリのインターフェース
 * factory.tsのFactory<T, keyof T>と互換
 */
interface CompleteFactory<T> {
  build(item?: RecPartial<T>): T;
  buildList(count: number, item?: RecPartial<T>): T[];
  resetSequenceNumber(newSequenceNumber?: number): void;
  // extend()の戻り値はfactory.tsの内部型を含むため、このインターフェース自体を返す
  extend(def: RecPartial<unknown>): CompleteFactory<T>;
}

/**
 * ファクトリラッパー作成
 *
 * factory.tsのファクトリをオブジェクトリテラルパターンでラップし、
 * build/buildList/resetSequenceNumber の統一インターフェースを提供する。
 *
 * 注: 全フィールドにデフォルト値があるファクトリ（makeFactoryで作成）専用
 *
 * @example
 * export const billingItemFactory = createFactoryWrapper(
 *   Factory.Sync.makeFactory<MfInvoiceApi.BillingItem>({ ... })
 * );
 */
export const createFactoryWrapper = <T, R = T>(
  factory: CompleteFactory<T>,
  transform?: (data: T) => R
) => {
  const build = (overrides?: RecPartial<T>): R => {
    const data = factory.build(overrides);
    return transform ? transform(data) : (data as unknown as R);
  };

  const buildList = (count: number, overrides?: RecPartial<T>): R[] =>
    Array.from({ length: count }, () => build(overrides));

  const resetSequenceNumber = (): void => {
    factory.resetSequenceNumber();
  };

  return {
    build,
    buildList,
    resetSequenceNumber,
    /** 派生バリエーション作成用に内部ファクトリを公開 */
    _factory: factory,
  } as const;
};

/**
 * 複数ファクトリのシーケンスリセット
 *
 * @example
 * resetAllFactories(billingFactory, quoteFactory, partnerFactory);
 */
export const resetAllFactories = (
  ...wrappers: Array<{ resetSequenceNumber: () => void }>
): void => {
  wrappers.forEach(w => w.resetSequenceNumber());
};

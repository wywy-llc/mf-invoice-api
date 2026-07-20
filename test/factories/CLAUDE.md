# テストファクトリー規約

<metadata>
  <scope>test/factories/ 配下</scope>
  <purpose>テストデータ生成の一元管理(手動オブジェクトリテラル禁止)</purpose>
  <parent>test/CLAUDE.md（競合時は親が優先）</parent>
</metadata>

## §1 命名

<constraints scope="factory-naming">
  <always>
    - ファイル名: `{domain}.factory.ts`（例: billing.factory.ts, quote.factory.ts）
    - エクスポート名: `{domain}Factory`（例: billingFactory）
    - レスポンス型（一覧+pagination）は同一ファイル内に `{domain}sResponseFactory` として併記
  </always>
</constraints>

## §2 パターン選択

<constraints scope="factory-pattern">
  <always>
    - ネスト深度 &lt;= 1 かつ状態パターン &lt;= 2種 → Factory.ts（`Factory.Sync.makeFactory`）
    - ネスト深度 &gt;= 2 または状態パターン &gt;= 3種 → Builder（class + メソッドチェーン + build() でのdeep copy）
    - mf-invoice-api の型（MfInvoiceApi.* namespace）は基本的にフラット〜1段ネストのため、現状すべて Factory.ts パターンで統一
  </always>
  <rationale>単純な型に Builder は過剰、複雑な型に Factory.ts はチェーン不能で可読性が落ちる</rationale>
</constraints>

## §3 一意性のある値

<constraints scope="factory-uniqueness">
  <always>
    - id / code / name など一意性が必要なフィールドは `Factory.each(i => ...)` で連番生成
    - 固定でよいフィールド（unit, prefecture 等の定数的な値）はリテラルのまま
    - 子エンティティは他ファクトリーの `.build()` / `.buildList()` を呼び出して合成（オブジェクトリテラルで手書きしない）
  </always>
</constraints>

```typescript
export const billingFactory = Factory.Sync.makeFactory<MfInvoiceApi.Billing>({
  id: Factory.each((i) => `billing_${i + 1}`),
  items: Factory.each(() => billingItemFactory.buildList(1)),
  // ...
});
```

## §4 リセット

<constraints scope="factory-reset">
  <always>
    - 各ファクトリーは factory.ts が標準搭載する `.resetSequenceNumber()` をそのまま利用する（独自ラッパーは作らない）
    - すべてのファクトリーの reset は test/factories/index.ts の `resetAllFactorySequences()` に集約する
    - 新規ファクトリー追加時は index.ts の export と `resetAllFactorySequences()` の両方を更新する
    - リセットの呼び出し自体は test/setup.ts の全体 beforeEach が自動で行うため、個別テストファイルでの呼び出しは不要
  </always>
  <rationale>テスト間の連番依存を排除し、実行順序に依存しないテストにする</rationale>
</constraints>

```typescript
// 例: シーケンス番号のリセット(通常は test/setup.ts の beforeEach で自動実行される)
billingFactory.resetSequenceNumber();
```

## §5 JSDoc

<constraints scope="factory-jsdoc">
  <always>
    - 各ファクトリーのエクスポートに JSDoc + 最低1つの `@example` を付与する
    - 部分的な上書きを行う `@example` も可能な範囲で併記する
  </always>
</constraints>

<reminders>
  CRITICAL:
  - テストデータはファクトリー経由でのみ生成（手動オブジェクトリテラル禁止、test/CLAUDE.md §2 参照）
  - 新規ドメイン型を追加したら test/factories/ にファクトリーを追加し index.ts に登録
</reminders>

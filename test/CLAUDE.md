# テストコード品質規約

<metadata>
  <scope>test/ 配下全テストファイル</scope>
  <purpose>テストの一貫性・可読性・保守性を担保</purpose>
  <parent>プロジェクトルート CLAUDE.md（競合時は親が優先）</parent>
</metadata>

## §1 構造

<constraints scope="test-structure">
  <always>
    - describe でサービス/関数をグループ化
    - it で個別ケースを記述
    - 正常系と異常系を明確に分離
    - エッジケースは明示指示時のみ生成
  </always>
</constraints>

## §2 データ

<constraints scope="test-data">
  <always>テストデータは ./factories 配下のファクトリーのみ使用（オブジェクトリテラルの手動作成はしない）</always>
  <rationale>生成元一元管理 → 仕様変更耐性 + 再利用性</rationale>
  <fallback>対象型のファクトリーが存在しない場合は test/factories/ に新規作成してから使用</fallback>
  <reference>test/factories/CLAUDE.md</reference>
</constraints>

```typescript
// ファクトリーを使用
const user = UserFactory.build({ role: 'admin' });
```

## §3 実行

<constraints scope="test-execution">
  <always>
    - 全 describe に beforeEach を設置
    - beforeEach でモック + ファクトリーシーケンスをリセット
  </always>
  <rationale>テスト間依存排除 → 実行順序非依存</rationale>
</constraints>

```typescript
describe('Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Factory.resetSequenceNumber();
  });
});
```

## §4 検証

<constraints scope="test-assertion">
  <always>
    - it 名は「何を」「どうすると」「どうなる」を日本語で明記
    - expect は具体値で検証（エラー時はメッセージを含む）
  </always>
  <rationale>意図明確化 + 失敗時の即理解</rationale>
</constraints>

```typescript
// 具体的なエラーメッセージで検証
it('無効メールで"Invalid email format"エラー', () => {
  expect(() => Service.call(user)).toThrow('Invalid email format');
});
```

## §5 コメント

<constraints scope="test-comments">
  <always>
    - データセクション冒頭: 役割 + 意図
    - モックセクション冒頭: 目的 + 想定挙動
    - 検証セクション: 各 expect の確認内容
    - 複数検証は番号付きリスト
    - コードから明らかな内容は説明不要（「何」より「なぜ」を優先）
    - 全テストで統一スタイルを維持
  </always>
</constraints>

```typescript
it('既存バッチジョブ存在時、そのバッチ結果返却', () => {
  // テストデータ: PROCESSING状態バッチキュー（処理中）
  const queue = Factory.createBatch({ status: PROCESSING });
  const expected = Result.success('既存ジョブ実行中');

  // モック: 既存ジョブ存在（重複実行防止）
  checkExisting.mockReturnValue(expected);

  // 実行+検証: 早期リターンで重複実行防止
  expect(Handler.call(queue)).toBe(expected);
  expect(checkExisting).toHaveBeenCalledWith(queue);
  expect(generateService.call).not.toHaveBeenCalled();
});
```

## §6 モック

<constraints scope="test-mocks">
  <always>
    - GASグローバルオブジェクト（UrlFetchApp, PropertiesService 等）はテストファイル内で `vi.fn()` / `vi.stubGlobal()` を使い直接モックする
    - 実際の MF API を叩かない（service-base.ts の fetch/processResponse をモック経由で検証する）
  </always>
  <fallback>複数テストファイルで同じ GAS モック形状が繰り返し必要になった場合、test/setup.ts に共通ヘルパーとして切り出す</fallback>
</constraints>

## §7 適用除外

<constraints scope="test-exclusions">
  <always>
    - ログ出力テストは作成しない（console.log 等の有無検証は対象外。デバッグ利用は許可）
    - 外部ライブラリのテストは作成しない（Vitest/GAS自体の挙動検証は対象外。自作ロジックのみ対象）
  </always>
</constraints>

<reminders>
  CRITICAL:
  - テストデータは必ずファクトリーから生成（手動オブジェクトリテラル禁止）
  - beforeEach で vi.clearAllMocks() + Factory.resetSequenceNumber()
  - it 名は「何を」「どうすると」「どうなる」を日本語で明記
</reminders>

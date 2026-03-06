# 梁計算UI重複解消 設計ドキュメント（F-03 / F-12）

## 目的

`/tools/beams/simple-supported` と `/tools/beams/cantilever` の UI/状態管理の重複を段階的に削減し、
見た目と計算結果を変えずに保守性を改善する。

- 対象: F-03 / F-12
- 非対象: 計算ロジック（`lib/beams/*.ts`）の式変更

## 現状把握

2画面は以下の要素がほぼ同一。

- 材料プリセット選択（E, 許容応力）
- 荷重入力（kg/kN切替）
- 断面入力（形状入力 / 直接入力）
- 結果表示（応力・たわみ・判定）
- 計算履歴/PDF出力に渡す入力スナップショット

相違は主に以下。

- 荷重ケースの定義（単純梁/片持ち梁で値域が異なる）
- たわみ許容デフォルト（L/300 vs L/200）
- 採用する計算関数 (`calcSimpleBeam` / `calcCantilever`)
- 図示コンポーネント (`BeamDiagram` のバリアント)

## 共通化境界

### 1. `useBeamForm()`（PR-6）

責務:

- UI入力状態の管理
- 材料プリセット反映
- 単位切替（kg/kN, cm3/mm3, cm4/mm4）
- 断面モード切替と shape 断面の派生値生成

引数（想定）:

- `defaultDeflectionN: number`
- `defaultLoadCase: LoadCase`

返却（想定）:

- state群（`L`, `loadValue`, `sectionMode`, `shapeDims` など）
- setter群
- 派生値（`shapeResult`, `shapeErrors`, `isCustomMaterial`）
- event handler（`handleMaterialChange`, `handleLoadUnitChange`）

### 2. `BeamCalculatorLayout`（PR-7）

責務:

- 画面レイアウト（セクション順、見出し、注意文）
- フォーム部品の配置
- 「計算する」「印刷」ボタン、結果カード描画

計算個別ロジックは props で注入。

- `onCalculate`
- `formulaSteps`
- `diagram`
- `result`

## 移行手順

### PR-6: state/hook 抽出（見た目不変）

1. `useBeamForm` を新規追加
2. 片側（単純梁）へ先行適用
3. テスト通過後、片持ち梁へ適用

### PR-7: レイアウト共通化（見た目維持）

1. `BeamCalculatorLayout` を追加
2. 両画面を同レイアウトへ移行
3. 文言差分・図差分は props で吸収

## テスト観点

- 既存: `npm run lint` / `npm run build`
- 追加:
  - 同一入力で旧実装と同一出力（応力/たわみ/判定）
  - 単位切替往復で値が破綻しない
  - 形状入力→直接入力切替時に不整合が出ない

## ロールバック方針

- PR-6 と PR-7 を分離してマージする。
- PR-7 で不具合が出た場合は PR-7 のみ revert し、PR-6 の hook 抽出は維持。
- 計算式変更は含めないため、数値不整合時は UI 層差分を優先的に切り戻す。

## 工数見積もり

- PR-6: 1.0〜1.5日
- PR-7: 1.0日
- レビュー/修正: 0.5日

合計: 2.5〜3.0日（並行レビュー前提）

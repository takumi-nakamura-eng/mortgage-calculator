# Beam Refactor Design Doc（PR-5）

対象: F-03 / F-12  
作成日: 2026-03-06

## 1. 目的

`SimpleSupportedCalculator` と `CantileverCalculator` は、入力状態・バリデーション・履歴保存・結果表示の大半が重複している。  
本設計では、**見た目と挙動を維持したまま**、次の2段階で重複を減らす。

- PR-6: `useBeamForm()` へ状態管理と計算実行を抽出（UIは既存維持）
- PR-7: `BeamCalculatorLayout` へ入力/結果表示の共通レイアウトを移行

---

## 2. 現状の重複概要

- `MATERIAL_PRESETS` 定数が2ファイルに重複
- 単位切替（`kg↔kN`, `cm3↔mm3`, `cm4↔mm4`）ロジックが重複
- `shapeResult` / `shapeErrors` の導出ロジックが重複
- `handleCalculate` の前半（parse/validate/error handling）がほぼ重複
- 履歴保存 (`addEngHistoryEntry`) の入力マッピングが重複
- 結果セクションや補助表示（`loadKNDisplay`, `wDisplay`）も重複

差分は主に以下のみ。

- 計算エンジン: `calcSimpleBeam` vs `calcCantileverBeam`
- 途中式生成: `buildBeamFormulaSteps` vs `buildCantileverFormulaSteps`
- 既定たわみ基準: 300 vs 200
- ツール識別子/名称: `simple-beam` vs `cantilever`
- 図コンポーネント: `BeamDiagram` vs `CantileverDiagram`
- 一部文言（「スパン」「先端集中荷重」など）

---

## 3. state一覧（抽出対象）

`useBeamForm()` へ寄せる state は次の通り。

### 3.1 入力 state

- 材料: `materialIdx`, `E_GPa`, `sigmaAllow`
- スパン: `L`
- 荷重: `loadCase`, `loadValue`, `loadUnit`
- 断面モード: `sectionMode`
- 断面直接入力: `Z`, `ZUnit`, `I`, `IUnit`
- 断面形状入力: `selectedShape`, `shapeDims`
- 許容たわみ: `deflectionNStr`
- 用途メモ: `purpose`

### 3.2 出力/派生 state

- 計算結果: `result`
- エラー/警告: `formErrors`, `formWarnings`
- 正規化荷重: `loadKNNormalized`
- 履歴: `lastEntry`
- 途中式: `formulaSteps`
- 派生表示: `shapeResult`, `shapeErrors`, `loadKNDisplay`, `wDisplay`, `wKNperMDisplay`, `spanLabel`, `loadLabelForDiagram`

---

## 4. 共通化境界

## 4.1 hook境界: `useBeamForm(config)`

`app/tools/beams/_shared/useBeamForm.ts`（新規）を想定。

### 入力（config）

- `toolId`: `'simple-beam' | 'cantilever'`
- `toolName`: 表示名
- `defaultDeflectionLimitN`: number
- `calculate`: `(inputs) => BeamResult`
- `buildFormulaSteps`: `(params) => FormulaStep[]`
- `trackToolId`: analytics用ID（`beam` / `cantilever`）

### 出力

- 全入力 state と setter
- 実行ハンドラ: `handleCalculate`, `handleMaterialChange`, `handleSectionModeChange`, `handleShapeChange`, 単位切替ハンドラ
- 派生表示値

### hookに含める責務

- 入力 parse/validate
- 計算実行
- 途中式生成
- 履歴保存
- analytics track

### hookに含めない責務

- 画面文言
- 図の具体実装
- 最終的な DOM 構造（レイアウト）

## 4.2 レイアウト境界: `BeamCalculatorLayout`

`app/tools/beams/_shared/BeamCalculatorLayout.tsx`（PR-7で追加）を想定。

- 共通フォームセクション（材料・荷重・断面入力・結果）を共通化
- 可変要素は props で受ける
  - `diagram`（ReactNode）
  - `labels`（「② スパン」「③ 荷重」の文言差分）
  - `loadCaseLabels`（中央集中/先端集中など）
  - `formulaStepsTitle`（必要なら）

## 4.3 計算関数境界

- 既存の `lib/beams/simpleBeam.ts` / `lib/beams/cantileverBeam.ts` は維持
- hookは計算式ロジックを持たず、`calculate` 注入のみ
- 途中式生成も注入し、Hookが実装差分を知らない構造にする

---

## 5. 差分点一覧（PR-6/7で残す差分）

最終的に差分として残してよい箇所を固定する。

1. 計算関数・途中式関数の注入値
2. 既定たわみ基準（300 / 200）
3. ツールID・ツール名・analytics ID
4. 図コンポーネント
5. 文言差分（ラベル、説明文）

上記以外の差分は「不要重複」と見なし、共通化対象とする。

---

## 6. 実装分割（工数見積もり）

## PR-6: `useBeamForm()` 抽出（見た目不変）

- 変更範囲
  - 新規: `app/tools/beams/_shared/useBeamForm.ts`
  - 更新: `SimpleSupportedCalculator.tsx` / `CantileverCalculator.tsx`（hook利用へ置換）
- 想定工数: 1.5〜2.0日
- リスク
  - 履歴保存 payload の欠落
  - バリデーションエラーキー不一致
- 受入条件
  - UI差分なし
  - 同一入力で結果数値一致
  - 履歴/PDF出力が従来通り

## PR-7: `BeamCalculatorLayout` 導入（見た目維持）

- 変更範囲
  - 新規: `app/tools/beams/_shared/BeamCalculatorLayout.tsx`
  - 更新: 両 Calculator の JSX を layout props に移行
- 想定工数: 1.5〜2.5日
- リスク
  - 文言・アクセシビリティ属性の欠落
  - スタイルクラス付け替え漏れ
- 受入条件
  - 主要表示の見た目一致
  - フォーム操作フロー一致

総工数見積もり: **3.0〜4.5日**

---

## 7. ロールバック方針

- PR-6/7 はそれぞれ独立 revert 可能に保つ
- 各PRで旧実装断片を一括削除せず、同PR内で動作同等を確認してから削除
- 不具合時の復旧優先順位
  1. 履歴保存/計算失敗の復旧
  2. バリデーション表示の復旧
  3. レイアウト差分の復旧
- 緊急時は `SimpleSupportedCalculator.tsx` / `CantileverCalculator.tsx` を直前コミットに戻して復旧可能とする

---

## 8. レビュー合意事項（この設計で確認したい点）

1. `useBeamForm` に履歴保存まで含めるか（現案: 含める）
2. `BeamCalculatorLayout` に結果セクションまで含めるか（現案: 含める）
3. PR-6 は **挙動不変のみ** を厳守し、UI改善を混ぜない
4. PR-7 は **文言変更なし** を原則にし、必要変更は別PR化

上記4点のレビュー合意をもって、PR-6/7 の実装着手条件を満たす。

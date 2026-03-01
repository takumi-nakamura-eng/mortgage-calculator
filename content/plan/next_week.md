# 週次PLAN（2026-03-02）

## 0) 実行前提

- ブランチ: `plan/weekly-2026-03-02`
- `main` 最新化: ネットワーク制限により `git pull origin main` は未実施（要後追い同期）
- 需要CSV: `content/demand/gsc_90d.csv` は 2026-03-02 04:00:05 +0900 更新

## 1) SERP観察メモの不足（今週の調査対象）

`content/demand/serp_notes/` に個別メモが未作成の候補:

- simple-beam
- section-properties
- anchor
- shaft-torsion
- motor-power-speed
- belt-pulley
- piping-pressure-loss

## 2) demand-report Top20（現状8件）

実行コマンド: `node --experimental-strip-types scripts/demand-report.ts`

1. bolt-length: 87.5（需要40 / 未充足19.5 / 実務性19 / ソース9）
2. simple-beam: 83.0（需要40 / 未充足16 / 実務性18 / ソース9）
3. section-properties: 81.7（需要37.6 / 未充足18 / 実務性17.6 / ソース8.5）
4. anchor: 64.7（需要16.8 / 未充足21.5 / 実務性18.4 / ソース8）
5. shaft-torsion: 53.8（需要7.8 / 未充足24 / 実務性15 / ソース7）
6. belt-pulley: 47.7（需要5.1 / 未充足22.5 / 実務性13.6 / ソース6.5）
7. motor-power-speed: 41.8（需要6.1 / 未充足14.7 / 実務性14 / ソース7）
8. piping-pressure-loss: 40.8（需要4.6 / 未充足15.3 / 実務性14.4 / ソース6.5）

## 3) 今週の投資判断（必須）

- 選択: **A. 既存ページ改善**
- 理由:
  - score上位3件（bolt-length / simple-beam / section-properties）は既存ツール資産と一致し、共食いなく押し上げ余地が大きい
  - 平均掲載順位が 8-20 帯にあり、CTR改善施策のROIが高い
  - 新規追加候補としての anchor は score 64.7 でゲート未達（>=70 不達）

## 4) 新規候補の採否（差別化ゲート）

- **採用なし（create見送り）**
- 却下理由:
  - anchor: score 64.7 で閾値未達（>=70 条件未達）
  - score>=70 の候補は既存主力意図（bolt-length / simple-beam / section-properties）と重なるため、今週は新規追加より改善優先

## 5) 今週の狙い

- bolt-length: 入力再利用・途中式表示・規格丸め根拠の可視化で比較検討離脱を抑制
- simple-beam周辺: 許容たわみ基準の意思決定（L/200・L/300・L/400）を即断できる導線へ改善


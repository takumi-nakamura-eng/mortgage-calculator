# calcnavi AGENTS

## 開発ルール

このファイルは、このリポジトリで Codex が作業する際の標準ルールです。
ルールは短く、安定していて、実務的に保ってください。

### Core Workflow

- コミット、ブランチ作成、PR 作成のタイミングはユーザーが判断する。
  - Codex は明示的に依頼された場合のみ、コミット、ブランチ作成、PR 用の変更整理や説明文作成を行う。
- 作業目的を分けたいときは、新しいスレッドで扱う。
  - 現在のスレッドでは、その依頼の目的に直接関係する修正のみを優先し、無関係な変更は原則含めない。
- 新しいスレッドで実装や修正を始めるときは、その目的に合ったブランチを必ず作成する。
  - ブランチ名は `codex/<purpose>` を基本とし、番号付きでもよい。例: `codex/01-bolt-length`
- 別目的の作業が見つかった場合は、現在の変更に無理に混ぜない。
  - 必要なら「別スレッドで扱うべき内容」として短く切り分けて提示する。

### Article Rules

- 記事 frontmatter は `title`, `description`, `publishedAt`, `updatedAt`, `category`, `sources` を必ず揃える。
- 記事は実務判断に役立つ内容で書く。結論、判断基準、関連する内部リンクを入れる。
- 情報源は一次情報、公的規格、メーカー資料を優先する。URL と確認日を残す。
- 関連記事や関連ツールは、記事の判断や実務フローに直接効くものだけを追加する。

### Tool Rules

- 計算ロジックは `lib/` に純粋関数として置く。式や判定条件を page-level UI に埋め込まない。
- ツール構成は原則として、`app/tools/<link>/page.tsx` をページ枠、`app/tools/<link>/<Name>Calculator.tsx` を UI、`lib/<domain>/<feature>.ts` を計算ロジック、`lib/diagrams/tools/<link>.tsx` を正規 SVG とする。
- ツールの `href`、`diagramKey`、図ファイル名は可能な限り link slug に揃える。例: `bolt-length` -> `diagramKey: "bolt-length"` -> `lib/diagrams/tools/bolt-length.tsx`
- ツール図はツールごとに正規ソースを 1 つにする。本体ページ、カード、印刷・出力用ヘルパーは同じ React SVG コンポーネントから派生させる。
- ツールページは `buildMetadata()`、`Breadcrumbs`、`SoftwareApplication` JSON-LD、関連解説導線を標準構成とする。
- 結果は数値だけでなく、単位、判定文脈、入力条件を保持する。
- 明示的に必要な場合を除き、履歴、PDF/印刷、関連導線を壊さない。

### Diagram Rules

- 図の正規ソースは `lib/diagrams/tools/` と `lib/diagrams/articles/` に分ける。ツール図と記事図を同じ名前空間で混ぜない。
- `diagramKey` は最終的な図の入口として使い、記事とツールで別々に解決する。記事カードがツール図を直接拾う実装に戻さない。
- 記事の `diagramKey` は可能な限り記事 slug に揃える。例: `/articles/three-threads` -> `diagramKey: "three-threads"` -> `lib/diagrams/articles/three-threads.tsx`
- 本文、カード、関連表示の図は共通の図レジストリ経由で描画する。個別ページに図コンポーネント import を増やし続けない。
- `thumbnailSvg` のような本文からの生 `<svg>` 抽出には依存しない。図の再利用は正規 SVG コンポーネントを基準に行う。

### UI Rules

- 既存のページ構造と `container`、`page-title`、`page-description` などの共有クラスを優先して使う。
- SEO とサイト共通 metadata の判断は `lib/seo.ts` と `lib/site.ts` に集約する。
- パンくず、関連リンク、記事カード、ツールカードは既存の共有コンポーネントを優先して使う。
- UI変更は見た目だけでなく、構造と導線の変更として扱う。

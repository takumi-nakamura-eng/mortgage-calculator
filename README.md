# ローン計算機

住宅ローンや車ローンなどの月々の返済額を試算できる Web アプリです。

## 機能

- 元利均等返済方式による月々の返済額・総返済額・総利息額の計算
- 返済スケジュール（回数・月々の返済額・元金・利息・残高）の一覧表示
- 計算履歴のブラウザ保存（LocalStorage）
- 履歴の個別削除・全削除
- レスポンシブデザイン（スマートフォン対応）
- SEO 対応メタ情報（各ページで `metadata` を設定）

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript |
| スタイル | カスタム CSS（フレームワーク不使用） |
| データ永続化 | LocalStorage（サーバーサイド不要） |

## 計算式

元利均等返済方式：

```
月利率  r = 年利率 / 12 / 100
返済回数 n = 返済期間（年）× 12
月々の返済額 = P × r × (1+r)^n / ((1+r)^n − 1)
```

年利率が 0% の場合は `P / n` で計算します。

## プロジェクト構成

```
calcnavi/
├── app/
│   ├── layout.tsx              # ルートレイアウト（Nav・グローバルmetadata）
│   ├── page.tsx                # 計算ページ (/)
│   ├── globals.css             # カスタムグローバルスタイル
│   ├── history/
│   │   └── page.tsx            # 履歴ページ (/history)
│   └── components/
│       ├── Nav.tsx             # ヘッダーナビゲーション
│       ├── LoanCalculator.tsx  # ローン計算フォーム（Client Component）
│       ├── AmortizationTable.tsx # 返済スケジュール表
│       └── HistoryList.tsx     # 計算履歴一覧（Client Component）
├── lib/
│   ├── types.ts                # TypeScript 型定義
│   ├── calculator.ts           # 計算ロジック
│   └── storage.ts              # LocalStorage ユーティリティ
└── README.md
```

## 開発環境の起動

### 前提条件

- Node.js 18.17.0 以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd calcnavi

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

ホットリロードが有効なため、ファイルを編集すると即座に反映されます。

## ビルド

```bash
# プロダクションビルド（静的最適化・型チェック含む）
npm run build

# プロダクションサーバーを起動
npm start
```

## Vercel へのデプロイ

### 方法 1：Vercel CLI

```bash
# Vercel CLI をインストール（初回のみ）
npm i -g vercel

# デプロイ（初回はプロジェクト設定のウィザードが起動します）
vercel

# 本番環境へデプロイ
vercel --prod
```

### 方法 2：GitHub 連携（推奨）

1. このリポジトリを GitHub にプッシュ
2. [vercel.com](https://vercel.com) でサインイン
3. "New Project" → GitHub リポジトリを選択
4. ビルド設定はデフォルトのまま "Deploy" をクリック

デプロイ後は自動で HTTPS が付与され、`main` ブランチへの push ごとに自動デプロイされます。プレビューデプロイも各 PR ごとに生成されます。

### 環境変数

このアプリは外部 API やデータベースを使用しないため、環境変数の設定は不要です。

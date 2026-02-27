import type { Metadata } from 'next';
import BoltCalculator from './BoltCalculator';

export const metadata: Metadata = {
  title: 'ボルト長さ計算 | ナット・座金込みの必要長さを計算',
  description:
    'ボルト呼び径・ナット・座金の組み合わせから必要なボルト長さ（先端3山確保）と推奨購入長さを計算します。M6〜M24対応。',
};

export default function BoltPage() {
  return (
    <main className="container">
      <h1 className="page-title">ボルト長さ計算</h1>
      <p className="page-description">
        ナット・座金の組み合わせから、先端3山確保に必要なボルト長さと推奨購入長さを計算します（M6〜M24）。
      </p>
      <BoltCalculator />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.7 }}>
        ※ 本ツールの結果は参考値です。最終確認は規格・メーカー・専門家にお問い合わせください。
      </p>
    </main>
  );
}

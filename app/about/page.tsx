import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'calcnaviの運営者情報。運営目的・サイト方針についてご案内します。',
};

export default function AboutPage() {
  return (
    <main className="container">
      <h1 className="page-title">運営者情報</h1>
      <div className="static-content">
        <ul>
          <li>運営目的：計算ツールと解説記事の無料提供</li>
          <li>
            お問い合わせは<a href="/contact">お問い合わせページ</a>からどうぞ。
          </li>
          <li>サイト方針：継続的に計算ツール・解説を追加・改善していきます。</li>
        </ul>
      </div>
    </main>
  );
}

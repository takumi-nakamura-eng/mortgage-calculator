import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'calcnavi | 計算ツールと解説まとめ',
  description: '計算ツールと解説をまとめたサイトです。ローン計算・ボルト計算などを無料で提供しています。',
};

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="page-title">calcnavi</h1>
      <p className="page-description">計算ツールと解説をまとめたサイトです。</p>

      <section className="portal-section">
        <h2 className="portal-section-title">計算ツール</h2>
        <div className="portal-cards">
          <Link href="/loan" className="portal-card">
            <div className="portal-card-title">ローン計算機</div>
            <div className="portal-card-desc">月々の返済額・総返済額・総利息を試算</div>
          </Link>
          <div className="portal-card portal-card--soon">
            <div className="portal-card-title">ボルト長さ計算（3山）</div>
            <div className="portal-card-desc">準備中</div>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <h2 className="portal-section-title">解説</h2>
        <div className="portal-cards">
          <Link href="/bolt/nut" className="portal-card">
            <div className="portal-card-title">ナットの基礎知識</div>
            <div className="portal-card-desc">ナットの種類・規格・選び方を解説</div>
          </Link>
        </div>
      </section>

      <section className="portal-section">
        <h2 className="portal-section-title">サイト情報</h2>
        <div className="portal-info-links">
          <Link href="/contact">お問い合わせ</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/disclaimer">免責事項</Link>
          <Link href="/about">運営者情報</Link>
        </div>
      </section>
    </main>
  );
}

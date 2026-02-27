import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSearch from './home/HeroSearch';

export const metadata: Metadata = {
  title: 'calcnavi（計算ナビ）| 設計・施工・暮らしの計算ツール',
  description:
    '設計・施工・暮らしに役立つ計算ツールと解説をまとめたサイト。住宅ローン・ボルト計算など無料でご利用いただけます。',
};

const POPULAR = [
  { title: '住宅ローン計算機', desc: '月々の返済額・総返済額・総利息を試算', href: '/tools/loan' },
];

const ARTICLES = [
  { title: 'ナットの基礎知識', desc: 'ナットの種類・規格・選び方を解説。JIS B 1181 の 1種・2種・3種の違いなど。', href: '/articles/nut-basics' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Free Calculation Tools</p>
          <h1 className="hero-title">
            calcnavi
            <span className="hero-title-ja">計算ナビ</span>
          </h1>
          <p className="hero-sub">設計・施工・暮らしの計算ツールをまとめて提供</p>
          <HeroSearch />
        </div>
      </section>

      <div className="home-wrap">
        <section className="home-section">
          <div className="home-section-head">
            <h2 className="home-section-title">人気のツール</h2>
            <Link href="/tools" className="home-section-link">すべて見る →</Link>
          </div>
          <div className="tool-list">
            {POPULAR.map((tool, i) => (
              <Link key={tool.title} href={tool.href} className="tool-item">
                <span className="tool-item-rank">{i + 1}</span>
                <span className="tool-item-body">
                  <span className="tool-item-title">{tool.title}</span>
                  <span className="tool-item-desc">{tool.desc}</span>
                </span>
                <span className="tool-item-arrow">›</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2 className="home-section-title">人気の記事</h2>
            <Link href="/articles" className="home-section-link">すべて見る →</Link>
          </div>
          <div className="tool-list">
            {ARTICLES.map((article, i) => (
              <Link key={article.title} href={article.href} className="tool-item">
                <span className="tool-item-rank">{i + 1}</span>
                <span className="tool-item-body">
                  <span className="tool-item-title">{article.title}</span>
                  <span className="tool-item-desc">{article.desc}</span>
                </span>
                <span className="tool-item-arrow">›</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="home-info-strip">
          計算結果はすべて参考値です。実際の数値は専門家または各機関にご確認ください。
          &ensp;|&ensp;
          <Link href="/disclaimer">免責事項</Link>
          &ensp;|&ensp;
          <Link href="/privacy">プライバシーポリシー</Link>
          &ensp;|&ensp;
          <Link href="/contact">お問い合わせ</Link>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSearch from './home/HeroSearch';

export const metadata: Metadata = {
  title: 'calcnavi（計算ナビ）| 設計・施工・暮らしの計算ツール',
  description:
    '設計・施工・暮らしに役立つ計算ツールと解説をまとめたサイト。住宅ローン・ボルト計算など無料でご利用いただけます。',
};

const CATEGORIES = [
  { icon: '🏠', name: '住宅・金融', count: '1ツール', href: '/loan' },
  { icon: '🔩', name: 'ボルト・ナット', count: '1解説', href: '/bolt/nut' },
  { icon: '📐', name: '構造・梁', count: '準備中', href: '/tools' },
  { icon: '📏', name: '単位換算', count: '準備中', href: '/tools' },
];

const POPULAR = [
  { title: '住宅ローン計算機', desc: '月々の返済額・総返済額・総利息を試算', href: '/loan' },
  { title: 'ナットの基礎知識', desc: 'ナットの種類・規格・選び方を解説', href: '/bolt/nut' },
  { title: '梁のたわみ計算', desc: '単純梁・片持ち梁のたわみ量を計算（準備中）', href: '/tools' },
  { title: 'アンカーボルト強度計算', desc: '引張・せん断強度を試算（準備中）', href: '/tools' },
  { title: '単位換算ツール', desc: 'mm↔inch、N↔kgf など建設・機械系単位（準備中）', href: '/tools' },
];

const LATEST = [
  { title: 'ナットの基礎知識', date: '2024/12', href: '/bolt/nut' },
  { title: '住宅ローン計算機', date: '2024/11', href: '/loan' },
  { title: '梁のたわみ計算（準備中）', date: '2025/01', href: '/tools' },
  { title: 'アンカーボルト強度計算（準備中）', date: '2025/02', href: '/tools' },
  { title: '単位換算ツール（準備中）', date: '2025/03', href: '/tools' },
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
            <h2 className="home-section-title">カテゴリから探す</h2>
            <Link href="/tools" className="home-section-link">すべて見る →</Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className="category-card">
                <span className="category-card-icon">{cat.icon}</span>
                <span className="category-card-name">{cat.name}</span>
                <span className="category-card-count">{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

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
            <h2 className="home-section-title">新着・更新</h2>
          </div>
          <div className="tool-list">
            {LATEST.map((item) => (
              <Link key={item.title} href={item.href} className="tool-item">
                <span className="tool-item-body">
                  <span className="tool-item-title">{item.title}</span>
                </span>
                <span className="tool-item-date">{item.date}</span>
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

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CalcNavi | 無料の計算機ツール集',
  description:
    'ローン計算機をはじめとする無料の計算機ツールを提供しています。月々の返済額・総返済額など、複雑な計算を簡単に。',
};

const calculators = [
  {
    href: '/loan',
    title: 'ローン計算機',
    description:
      '住宅ローン・車ローンなどの月々の返済額、総返済額、総利息額を計算。詳細な返済スケジュール表も確認できます。',
    tags: ['住宅ローン', '車ローン', '元利均等返済'],
  },
];

export default function HomePage() {
  return (
    <main className="container">
      <div className="top-hero">
        <h1 className="page-title">計算機ツール集</h1>
        <p className="page-description">
          ローン・財務計算など、日々の計算をサポートする無料ツールを提供しています。
        </p>
      </div>

      <ul className="calc-grid">
        {calculators.map((calc) => (
          <li key={calc.href}>
            <Link href={calc.href} className="calc-card">
              <h2 className="calc-card-title">{calc.title}</h2>
              <p className="calc-card-desc">{calc.description}</p>
              <div className="calc-card-tags">
                {calc.tags.map((tag) => (
                  <span key={tag} className="calc-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

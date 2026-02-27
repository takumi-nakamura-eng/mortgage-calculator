'use client';

import { useState } from 'react';
import Link from 'next/link';

const ARTICLES = [
  {
    id: 'nut-basics',
    title: 'ナットの基礎知識',
    desc: 'ナットの種類・規格・選び方を解説。JIS B 1181 に基づく 1種・2種・3種の違いなど。',
    href: '/articles/nut-basics',
    available: true,
  },
  {
    id: 'bolt-strength',
    title: 'ボルトの強度区分',
    desc: 'ボルトの強度区分（4.8・8.8・10.9 等）と用途の目安を解説します。',
    href: '#',
    available: false,
  },
  {
    id: 'loan-basics',
    title: '住宅ローンの基礎知識',
    desc: '元利均等・元金均等の違いや金利の仕組みをわかりやすく解説します。',
    href: '#',
    available: false,
  },
];

export default function ArticlesPage() {
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter((a) => {
    const q = query.trim().toLowerCase();
    return !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
  });

  return (
    <div className="tools-wrap">
      <div className="tools-page-head">
        <h1 className="tools-page-title">解説記事</h1>
        <p className="tools-page-desc">計算ツールに関連する基礎知識・解説記事をまとめています。</p>
      </div>

      <div className="tools-filter-bar">
        <input
          className="tools-search"
          type="search"
          placeholder="キーワード検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="記事を検索"
        />
      </div>

      <div className="tools-grid">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致する記事が見つかりませんでした。</p>
        )}
        {filtered.map((article) =>
          article.available ? (
            <Link key={article.id} href={article.href} className="tools-card">
              <span className="tools-card-title">{article.title}</span>
              <span className="tools-card-desc">{article.desc}</span>
            </Link>
          ) : (
            <div key={article.id} className="tools-card tools-card--soon">
              <span className="tools-card-title">{article.title}</span>
              <span className="tools-card-desc">{article.desc}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

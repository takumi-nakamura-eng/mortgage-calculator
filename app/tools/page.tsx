'use client';

import { useState } from 'react';
import Link from 'next/link';

const TOOLS = [
  {
    id: 'loan',
    title: '住宅ローン計算機',
    desc: '月々の返済額・総返済額・総利息を試算。詳細な返済スケジュール表も確認できます。',
    href: '/tools/loan',
    available: true,
  },
  {
    id: 'beam',
    title: '梁のたわみ計算',
    desc: '単純梁・片持ち梁のたわみ量を計算します。',
    href: '#',
    available: false,
  },
  {
    id: 'anchor',
    title: 'アンカーボルト強度計算',
    desc: 'アンカーボルトの引張・せん断強度を試算します。',
    href: '#',
    available: false,
  },
  {
    id: 'unit',
    title: '単位換算ツール',
    desc: 'mm↔inch、N↔kgf など建設・機械系でよく使う単位を変換します。',
    href: '#',
    available: false,
  },
  {
    id: 'bolt-length',
    title: 'ボルト長さ計算',
    desc: 'ナット・座金の組み合わせから必要なボルト長さと推奨購入長さを計算します。',
    href: '/tools/bolt',
    available: true,
  },
];

export default function ToolsPage() {
  const [query, setQuery] = useState('');

  const filtered = TOOLS.filter((t) => {
    if (!t.available) return false;
    const q = query.trim().toLowerCase();
    return !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
  });

  return (
    <div className="tools-wrap">
      <div className="tools-page-head">
        <h1 className="tools-page-title">計算ツール</h1>
        <p className="tools-page-desc">設計・施工・暮らしに役立つ計算ツールを提供しています。</p>
      </div>

      <div className="tools-filter-bar">
        <input
          className="tools-search"
          type="search"
          placeholder="キーワード検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="ツールを検索"
        />
      </div>

      <div className="tools-grid">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致するツールが見つかりませんでした。</p>
        )}
        {filtered.map((tool) => (
          <Link key={tool.id} href={tool.href} className="tools-card">
            <span className="tools-card-title">{tool.title}</span>
            <span className="tools-card-desc">{tool.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

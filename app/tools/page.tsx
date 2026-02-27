'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

const ALL_TOOLS = [
  {
    id: 'loan',
    title: '住宅ローン計算機',
    desc: '月々の返済額・総返済額・総利息を試算。詳細な返済スケジュール表も確認できます。',
    category: '住宅・金融',
    tags: ['free', 'save'],
    icon: '🏠',
    href: '/loan',
    available: true,
  },
  {
    id: 'nut-guide',
    title: 'ナットの基礎知識',
    desc: 'ナットの種類・規格・選び方を解説。現場でのボルト選定に役立てられます。',
    category: 'ボルト・ナット',
    tags: ['free', 'field'],
    icon: '🔩',
    href: '/bolt/nut',
    available: true,
  },
  {
    id: 'beam-deflection',
    title: '梁のたわみ計算',
    desc: '単純梁・片持ち梁のたわみ量を計算します。',
    category: '構造・梁',
    tags: ['free', 'soon'],
    icon: '📐',
    href: '/tools',
    available: false,
  },
  {
    id: 'anchor-bolt',
    title: 'アンカーボルト強度計算',
    desc: 'アンカーボルトの引張・せん断強度を試算します。',
    category: 'ボルト・ナット',
    tags: ['free', 'field', 'soon'],
    icon: '⚓',
    href: '/tools',
    available: false,
  },
  {
    id: 'unit-convert',
    title: '単位換算ツール',
    desc: 'mm↔inch、N↔kgf など建設・機械系でよく使う単位を変換します。',
    category: '単位換算',
    tags: ['free', 'soon'],
    icon: '📏',
    href: '/tools',
    available: false,
  },
  {
    id: 'bolt-length',
    title: 'ボルト長さ計算（3山）',
    desc: 'ねじ山3山確保に必要なボルト長さを計算します。',
    category: 'ボルト・ナット',
    tags: ['free', 'field', 'soon'],
    icon: '🔧',
    href: '/tools',
    available: false,
  },
];

const CATEGORIES = ['すべて', '住宅・金融', 'ボルト・ナット', '構造・梁', '単位換算'];

const TAG_LABELS: Record<string, { label: string; cls: string }> = {
  free:  { label: '無料', cls: 'tools-card-tag--free' },
  field: { label: '現場向け', cls: 'tools-card-tag--field' },
  save:  { label: '保存可', cls: 'tools-card-tag--save' },
  soon:  { label: '準備中', cls: 'tools-card-tag--soon' },
};

function ToolsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeCat, setActiveCat] = useState('すべて');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const filtered = ALL_TOOLS.filter((tool) => {
    const matchCat = activeCat === 'すべて' || tool.category === activeCat;
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      tool.title.toLowerCase().includes(q) ||
      tool.desc.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.replace(`/tools?q=${encodeURIComponent(q)}`);
    else router.replace('/tools');
  };

  return (
    <div className="tools-wrap">
      <div className="tools-page-head">
        <h1 className="tools-page-title">ツール一覧</h1>
        <p className="tools-page-desc">計算ツール・解説記事をカテゴリやキーワードで絞り込めます。</p>
      </div>

      {/* Filter bar */}
      <form className="tools-filter-bar" onSubmit={handleSearch} role="search">
        <input
          className="tools-search"
          type="search"
          placeholder="キーワード検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="ツールを検索"
        />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-btn${activeCat === cat ? ' cat-btn--active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </form>

      {/* Grid */}
      <div className="tools-grid" id="guides">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致するツールが見つかりませんでした。</p>
        )}
        {filtered.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className={`tools-card${!tool.available ? ' tools-card--soon' : ''}`}
          >
            <span className="tools-card-icon">{tool.icon}</span>
            <span className="tools-card-title">{tool.title}</span>
            <span className="tools-card-desc">{tool.desc}</span>
            <span className="tools-card-tags">
              {tool.tags.map((t) => {
                const meta = TAG_LABELS[t];
                return meta ? (
                  <span key={t} className={`tools-card-tag ${meta.cls}`}>
                    {meta.label}
                  </span>
                ) : null;
              })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense>
      <ToolsContent />
    </Suspense>
  );
}

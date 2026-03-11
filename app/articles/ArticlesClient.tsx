'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ArticleMeta } from '@/lib/content/articles';
import CardDiagram from '@/app/components/CardDiagram';

export default function ArticlesClient({
  initialArticles,
  initialQuery = '',
}: {
  initialArticles: ArticleMeta[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialArticles.filter((article) => {
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [initialArticles, query]);

  return (
    <>
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

        {filtered.map((article) => (
          <Link key={article.slug} href={article.href} className="tools-card">
            <CardDiagram variant="article" diagramKey={article.diagramKey} className="tools-card-diagram" />
            <h3 className="tools-card-title">{article.title}</h3>
            <p className="tools-card-desc">{article.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

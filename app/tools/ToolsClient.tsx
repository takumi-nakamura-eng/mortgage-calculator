'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ToolItem } from '@/lib/data/tools';
import CardDiagram from '@/app/components/CardDiagram';

export default function ToolsClient({
  initialTools,
  initialQuery = '',
}: {
  initialTools: ToolItem[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialTools.filter((t) => {
      if (!q) return true;

      return (
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((keyword) => keyword.toLowerCase().includes(q))
      );
    });
  }, [initialTools, query]);

  return (
    <>
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
            <CardDiagram variant="tool" diagramKey={tool.diagramKey} className="tools-card-diagram" />
            <h3 className="tools-card-title">{tool.title}</h3>
            <p className="tools-card-desc">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

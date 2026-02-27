'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  };

  return (
    <form className="hero-search" onSubmit={handleSubmit} role="search">
      <input
        className="hero-search-input"
        type="search"
        placeholder="ツール名・キーワードを検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="ツールを検索"
      />
      <button type="submit" className="hero-search-btn">
        検索
      </button>
    </form>
  );
}

'use client';

import Link from 'next/link';
import { trackRelatedClick } from '@/lib/analytics/events';
import CardDiagram from '@/app/components/CardDiagram';

export interface RelatedArticleItem {
  slug: string;
  title: string;
  description: string;
  href: string;
  diagramKey: string;
}

export default function RelatedArticles({
  items,
  source,
}: {
  items: RelatedArticleItem[];
  source: string;
}) {
  return (
    <section className="related-block">
      <h2 className="home-section-title related-title">関連解説記事</h2>
      {items.length === 0 ? (
        <p className="page-description">関連解説記事は準備中です。</p>
      ) : (
        <div className="portal-cards">
          {items.map((article) => (
            <Link
              key={article.slug}
              href={article.href}
              className="portal-card"
              onClick={() =>
                trackRelatedClick({
                  source,
                  destinationType: 'article',
                  destinationId: article.slug,
                })
              }
            >
              <CardDiagram
                variant="article"
                diagramKey={article.diagramKey}
                className="portal-card-diagram"
              />
              <span className="portal-card-title">{article.title}</span>
              <span className="portal-card-desc">{article.description}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

import type { Metadata } from 'next';
import BoltStrengthCalculator from './BoltStrengthCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ボルト引張・せん断耐力計算ツール',
  description:
    '締結用ボルトの許容引張耐力・許容せん断耐力を即時計算。強度区分4.8/8.8/10.9、M6〜M24対応。相互作用チェック付き。',
  path: '/tools/bolt-strength',
});

export default async function BoltStrengthPage() {
  const tool = getToolById('bolt-strength');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ボルト引張・せん断耐力計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      '締結用ボルトの許容引張耐力・許容せん断耐力を計算する無料ツール。相互作用チェック対応。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/bolt-strength`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: 'ボルト引張・せん断耐力計算' },
        ]}
      />

      <h1 className="page-title">ボルト引張・せん断耐力計算ツール</h1>
      <p className="page-description">
        締結用ボルトの許容引張耐力・許容せん断耐力を即時計算します。引張＋せん断の相互作用チェックにも対応。
      </p>

      <BoltStrengthCalculator />

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL}
        className="tool-ad"
        pageType="tool"
      />

      <RelatedArticles
        source="tool:bolt-strength"
        items={relatedArticles.map((article) => ({
          slug: article.slug,
          title: article.title,
          description: article.description,
          href: article.href,
          diagramKey: article.diagramKey,
        }))}
      />
    </main>
  );
}

import type { Metadata } from 'next';
import BoltStrengthCalculator from './BoltStrengthCalculator';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolDisclaimer from '@/app/components/ToolDisclaimer';
import ToolHero from '@/app/components/ToolHero';
import { formatContentDate } from '@/lib/contentDates';
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

      <ToolHero
        title="ボルト引張・せん断耐力計算"
        description="締結用ボルトの許容引張耐力・許容せん断耐力を計算できるツールです。強度区分4.8〜10.9、M6〜M24に対応し、相互作用チェックや一次確認に使えます。"
        labels={[
          { label: '対応範囲', value: 'M6〜M24' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '締結 / ボルト / 耐力' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-04')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="bolt-strength"
        diagramMaxWidth={190}
      />

      <BoltStrengthCalculator />
      <ToolDisclaimer />

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

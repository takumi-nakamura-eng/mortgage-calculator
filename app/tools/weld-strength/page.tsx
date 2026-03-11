import type { Metadata } from 'next';
import WeldStrengthCalculator from './WeldStrengthCalculator';
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
  title: '溶接強度計算ツール',
  description: '隅肉溶接・突合せ溶接の必要溶接長さと許容荷重を計算します。',
  path: '/tools/weld-strength',
});

export default async function WeldStrengthPage() {
  const tool = getToolById('weld-strength');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) => tool?.relatedArticleSlugs.includes(article.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '溶接強度計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '隅肉溶接・突合せ溶接の必要溶接長さと許容荷重を計算する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/weld-strength`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール', href: '/tools' }, { name: '溶接強度計算' }]} />
      <ToolHero
        title="溶接強度計算"
        description="フィレット溶接と突合せ溶接について、設計荷重から必要溶接長さを求める計算と、溶接長さから許容荷重を求める計算に対応したツールです。"
        labels={[
          { label: '対応形式', value: '隅肉 / 突合せ' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '溶接 / 強度' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="weld-strength"
        diagramMaxWidth={220}
      />
      <WeldStrengthCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:weld-strength"
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

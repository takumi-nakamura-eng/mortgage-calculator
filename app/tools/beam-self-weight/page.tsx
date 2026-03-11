import type { Metadata } from 'next';
import BeamSelfWeightCalculator from './BeamSelfWeightCalculator';
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
  title: '梁自重計算ツール',
  description: '断面寸法と長さから梁の自重と等分布荷重を計算します。',
  path: '/tools/beam-self-weight',
});

export default async function BeamSelfWeightPage() {
  const tool = getToolById('beam-self-weight');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) => tool?.relatedArticleSlugs.includes(article.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '梁自重計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '断面積、密度、長さから単位重量、梁自重、総重量を算定する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/beam-self-weight`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール', href: '/tools' }, { name: '梁自重計算' }]} />
      <ToolHero
        title="梁自重計算"
        description="H形鋼、角形鋼管、平鋼などの断面寸法と長さから断面積、単位重量、梁自重 kN/m、総重量 kN を計算し、梁計算ツールへ転用できます。"
        labels={[
          { label: '対応形状', value: '鋼材断面' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '梁 / 自重' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="beam-self-weight"
        diagramMaxWidth={220}
      />
      <BeamSelfWeightCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:beam-self-weight"
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

import type { Metadata } from 'next';
import SectionPropertiesCalculator from './SectionPropertiesCalculator';
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
  title: '断面性能計算ツール',
  description:
    'H形鋼・Tバー・角形鋼管・丸形鋼管・丸棒・フラットバー・アングル・チャンネルの断面二次モーメント・断面係数・断面二次半径・単位重量を計算できます。',
  path: '/tools/section-properties',
});

export default async function SectionPropertiesPage() {
  const tool = getToolById('section-properties');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '断面性能計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      '各種鋼材形状の断面二次モーメント、断面係数、断面二次半径、単位重量を計算する無料ツール。強軸・弱軸に対応します。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/section-properties`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: '断面性能計算' },
        ]}
      />

      <ToolHero
        title="断面性能計算"
        description="H形鋼・Tバー・角形鋼管・丸形鋼管・丸棒・フラットバー・アングル・チャンネルの断面二次モーメント（I）・断面係数（Z）・断面二次半径・単位重量を計算できるツールです。"
        labels={[
          { label: '対応形状', value: '8断面' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '梁 / 断面 / 断面性能' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-01')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="section-properties"
        diagramMaxWidth={220}
      />
      <SectionPropertiesCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:section-properties"
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

import type { Metadata } from 'next';
import SteelWeightCalculator from './SteelWeightCalculator';
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
  title: '鋼材重量計算ツール',
  description:
    '平板・丸棒・角棒・丸パイプ・角パイプ・H形鋼・Cチャンネル・角形鋼管の重量と kN 換算荷重を計算し、明細表で積み上げ管理します。',
  path: '/tools/steel-weight',
});

export default async function SteelWeightPage() {
  const tool = getToolById('steel-weight');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '鋼材重量計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      '鋼材の形状・寸法から重量と kN 換算荷重を計算し、明細テーブルで合計値を管理できる無料ツール。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/steel-weight`,
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
          { name: '鋼材重量計算' },
        ]}
      />

      <ToolHero
        title="鋼材重量計算"
        description="平板・丸棒・角棒・丸パイプ・角パイプ・H形鋼・Cチャンネル・角形鋼管の寸法と長さから重量を計算し、明細表で合計重量と合計荷重を集計できるツールです。"
        labels={[
          { label: '対応形状', value: '8形状' },
          { label: '用途', value: '拾い出し' },
          { label: '種別', value: '鋼材 / 重量 / 集計' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-04')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="steel-weight"
        diagramMaxWidth={190}
      />

      <SteelWeightCalculator />
      <ToolDisclaimer />

      <RelatedArticles
        source="tool:steel-weight"
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

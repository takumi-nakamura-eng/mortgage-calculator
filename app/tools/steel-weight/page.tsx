import type { Metadata } from 'next';
import SteelWeightCalculator from './SteelWeightCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '鋼材重量計算ツール',
  description:
    '平板・丸棒・角棒・丸パイプ・角パイプの重量を計算し、明細表で積み上げ管理。鋼材の自重計算・材料拾いに。',
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
      '鋼材の形状・寸法から重量を計算し、明細テーブルで合計重量を管理できる無料ツール。',
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

      <h1 className="page-title">鋼材重量計算ツール</h1>
      <p className="page-description">
        鋼材の形状・寸法・長さを入力して重量を計算し、明細テーブルに積み上げます。材料拾い・重量見積もりにご活用ください。
      </p>

      <SteelWeightCalculator />

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL}
        className="tool-ad"
        pageType="tool"
      />

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

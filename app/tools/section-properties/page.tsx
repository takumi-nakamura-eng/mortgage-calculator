import type { Metadata } from 'next';
import SectionPropertiesCalculator from './SectionPropertiesCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '断面性能計算ツール',
  description:
    'H形鋼・角形鋼管・丸形鋼管・フラットバー・アングル・チャンネルの断面二次モーメント（I）・断面係数（Z）・断面積・重量を計算します。強軸・弱軸対応。',
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
      '各種鋼材形状の断面二次モーメント、断面係数、断面積、重量を計算する無料ツール。',
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

      <h1 className="page-title">断面性能計算ツール</h1>
      <p className="page-description">
        断面形状と寸法を入力すると、断面二次モーメント（I）・断面係数（Z）・断面積・重量を計算します。
        強軸・弱軸の両方に対応。梁設計・柱設計の断面選定にご活用ください。
      </p>
      <p className="tool-flow">入力条件 → 計算結果 → 図解・途中式・PDF出力 の順に確認できます。</p>
      <SectionPropertiesCalculator />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
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

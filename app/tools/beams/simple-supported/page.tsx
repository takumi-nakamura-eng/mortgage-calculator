import type { Metadata } from 'next';
import SimpleSupportedCalculator from './SimpleSupportedCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolDisclaimer from '@/app/components/ToolDisclaimer';
import ToolHero from '@/app/components/ToolHero';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '単純梁（単純支持）計算',
  description:
    '単純支持梁（ピン・ローラー）の曲げ応力とたわみを計算します。中央集中荷重・等分布荷重に対応。OK/NG判定つき。',
  path: '/tools/beams/simple-supported',
});

export default async function SimpleSupportedPage() {
  const tool = getToolById('beam');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '単純梁（単純支持）計算',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      '単純梁の中央集中荷重・等分布荷重に対する曲げ応力と最大たわみを計算する無料ツール。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/beams/simple-supported`,
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
          { name: '単純梁（単純支持）計算' },
        ]}
      />

      <ToolHero
        title="単純梁（単純支持）計算"
        description="ピン・ローラー支持の単純梁について、中央集中荷重・等分布荷重の曲げ応力と最大たわみを計算できるツールです。OK/NGの一次確認と寸法検討に使えます。"
        labels={[
          { label: '荷重条件', value: '集中 / 等分布' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '梁 / 応力 / たわみ' },
        ]}
        diagramKey="simple-supported"
        diagramMaxWidth={220}
      />
      <SimpleSupportedCalculator />
      <ToolDisclaimer />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
      <RelatedArticles
        source="tool:beam"
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

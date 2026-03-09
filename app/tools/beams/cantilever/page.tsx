import type { Metadata } from 'next';
import CantileverCalculator from './CantileverCalculator';
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
  title: '片持ち梁（カンチレバー）計算',
  description:
    '片持ち梁（固定端・自由端）の曲げ応力とたわみを計算します。先端集中荷重・等分布荷重に対応。OK/NG判定つき。',
  path: '/tools/beams/cantilever',
});

export default async function CantileverPage() {
  const tool = getToolById('cantilever');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '片持ち梁（カンチレバー）計算',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      '片持ち梁の先端集中荷重・等分布荷重に対する曲げ応力と最大たわみを計算する無料ツール。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/beams/cantilever`,
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
          { name: '梁計算ツール', href: '/tools/beams' },
          { name: '片持ち梁（カンチレバー）計算' },
        ]}
      />

      <ToolHero
        title="片持ち梁（カンチレバー）計算"
        description="固定端・自由端の片持ち梁について、先端集中荷重・等分布荷重の曲げ応力と最大たわみを計算できるツールです。OK/NGの一次確認と寸法検討に使えます。"
        labels={[
          { label: '荷重条件', value: '集中 / 等分布' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '梁 / 片持ち / たわみ' },
        ]}
        diagramKey="cantilever"
        diagramMaxWidth={220}
      />
      <CantileverCalculator />
      <ToolDisclaimer />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
      <RelatedArticles
        source="tool:cantilever"
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

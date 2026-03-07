import type { Metadata } from 'next';
import CantileverCalculator from './CantileverCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
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

      <h1 className="page-title">片持ち梁（カンチレバー）計算</h1>
      <p className="page-description">
        固定端・自由端の片持ち梁に対して、曲げ応力・最大たわみを計算し OK/NG 判定を行います。
        先端集中荷重・等分布荷重（総荷重入力）に対応。
      </p>
      <p className="tool-flow">入力条件 → 計算結果（OK/NG） → 途中式・履歴・PDF の順に確認できます。</p>
      <CantileverCalculator />
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

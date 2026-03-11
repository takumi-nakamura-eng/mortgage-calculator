import type { Metadata } from 'next';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolDisclaimer from '@/app/components/ToolDisclaimer';
import ToolHero from '@/app/components/ToolHero';
import BeamCaseCalculator from '@/app/tools/beams/BeamCaseCalculator';
import { formatContentDate } from '@/lib/contentDates';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '単純梁 等分布荷重計算',
  description: '単純梁の等分布荷重について、反力・最大曲げモーメント・最大たわみ・曲げ応力を計算します。',
  path: '/tools/beams/simple-supported-uniform-load',
});

export default async function SimpleSupportedUniformLoadPage() {
  const tool = getToolById('simple-supported-uniform-load');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '単純梁 等分布荷重計算',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '単純梁の等分布荷重に限定して、反力・最大曲げモーメント・最大たわみ・曲げ応力を計算する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/beams/simple-supported-uniform-load`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: '梁計算ツール', href: '/tools/beams' },
          { name: '単純梁ツール一覧', href: '/tools/beams/simple-supported' },
          { name: '等分布荷重' },
        ]}
      />
      <ToolHero
        title="単純梁 等分布荷重計算"
        description="単純梁の等分布荷重について、反力・最大曲げモーメント・最大たわみ・最大曲げ応力を I/Z 入力ベースで確認できます。"
        labels={[
          { label: '支持条件', value: '単純梁' },
          { label: '荷重条件', value: '等分布荷重' },
          { label: '入力', value: 'I / Z 直接入力' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="simple-supported-uniform-load"
        diagramMaxWidth={220}
      />
      <BeamCaseCalculator
        toolId="simple-supported-uniform-load"
        toolName="単純梁 等分布荷重計算"
        support="simple-supported"
        loadType="uniform"
        defaultDeflectionLimit={300}
      />
      <ToolDisclaimer />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
      <RelatedArticles
        source="tool:simple-supported-uniform-load"
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

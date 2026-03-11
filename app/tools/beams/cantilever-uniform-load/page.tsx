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
  title: '片持ち梁 等分布荷重計算',
  description: '片持ち梁の等分布荷重について、固定端反力・最大曲げモーメント・最大たわみ・曲げ応力を計算します。',
  path: '/tools/beams/cantilever-uniform-load',
});

export default async function CantileverUniformLoadPage() {
  const tool = getToolById('cantilever-uniform-load');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '片持ち梁 等分布荷重計算',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '片持ち梁の等分布荷重に限定して、固定端反力・最大曲げモーメント・最大たわみ・曲げ応力を計算する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/beams/cantilever-uniform-load`,
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
          { name: '片持ち梁ツール一覧', href: '/tools/beams/cantilever' },
          { name: '等分布荷重' },
        ]}
      />
      <ToolHero
        title="片持ち梁 等分布荷重計算"
        description="片持ち梁の等分布荷重について、固定端反力・固定端モーメント・最大たわみ・最大曲げ応力を I/Z 入力ベースで確認できます。"
        labels={[
          { label: '支持条件', value: '片持ち梁' },
          { label: '荷重条件', value: '等分布荷重' },
          { label: '入力', value: 'I / Z 直接入力' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="cantilever-uniform-load"
        diagramMaxWidth={220}
      />
      <BeamCaseCalculator
        toolId="cantilever-uniform-load"
        toolName="片持ち梁 等分布荷重計算"
        support="cantilever"
        loadType="uniform"
        defaultDeflectionLimit={200}
      />
      <ToolDisclaimer />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
      <RelatedArticles
        source="tool:cantilever-uniform-load"
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

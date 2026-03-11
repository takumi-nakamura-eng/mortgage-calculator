import type { Metadata } from 'next';
import SectionComparisonCalculator from './SectionComparisonCalculator';
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
  title: '断面係数比較ツール',
  description: '複数の断面形状を並べて I、Z、A、重量を比較できます。',
  path: '/tools/section-comparison',
});

export default async function SectionComparisonPage() {
  const tool = getToolById('section-comparison');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) => tool?.relatedArticleSlugs.includes(article.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '断面係数比較ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '複数の断面形状を入力して I、Z、A、重量を比較し、Z/A 比の高い断面を確認できる無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/section-comparison`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール', href: '/tools' }, { name: '断面係数比較' }]} />
      <ToolHero
        title="断面係数比較"
        description="複数の断面候補を同じ画面で並べ、断面二次モーメント I、断面係数 Z、断面積 A、重量、Z/A 比を比較できるツールです。"
        labels={[
          { label: '比較項目', value: 'I / Z / A / 重量' },
          { label: '用途', value: '候補比較' },
          { label: '種別', value: '梁 / 断面比較' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="section-comparison"
        diagramMaxWidth={220}
      />
      <SectionComparisonCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:section-comparison"
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

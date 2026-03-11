import type { Metadata } from 'next';
import PipeWallThicknessCalculator from './PipeWallThicknessCalculator';
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
  title: '配管肉厚計算ツール',
  description: '設計圧力・外径・材料強度から必要肉厚と名目肉厚を計算します。',
  path: '/tools/pipe-wall-thickness',
});

export default async function PipeWallThicknessPage() {
  const tool = getToolById('pipe-wall-thickness');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) => tool?.relatedArticleSlugs.includes(article.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '配管肉厚計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '設計圧力・外径・材料強度・腐食余裕から必要肉厚と名目肉厚を計算する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/pipe-wall-thickness`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール', href: '/tools' }, { name: '配管肉厚計算' }]} />
      <ToolHero
        title="配管肉厚計算"
        description="設計圧力 P、外径 D、最小降伏応力 S、設計係数 F、溶接効率 E、腐食余裕 A から必要肉厚と名目肉厚を算定するツールです。"
        labels={[
          { label: '入力', value: 'P / D / S / F / E / A' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '配管 / 肉厚' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="pipe-wall-thickness"
        diagramMaxWidth={220}
      />
      <PipeWallThicknessCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:pipe-wall-thickness"
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

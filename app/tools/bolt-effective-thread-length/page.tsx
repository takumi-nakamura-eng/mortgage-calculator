import type { Metadata } from 'next';
import AdSlot from '@/app/components/ads/AdSlot';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolDisclaimer from '@/app/components/ToolDisclaimer';
import ToolHero from '@/app/components/ToolHero';
import BoltEffectiveThreadLengthCalculator from './BoltEffectiveThreadLengthCalculator';
import { formatContentDate } from '@/lib/contentDates';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ボルト有効ねじ長さチェック',
  description: '呼び径と板厚・ナット・座金構成から、必要ねじ長さと有効かみ合い長の目安を確認します。',
  path: '/tools/bolt-effective-thread-length',
});

export default async function BoltEffectiveThreadLengthPage() {
  const tool = getToolById('bolt-effective-thread-length');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ボルト有効ねじ長さチェック',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '呼び径と板厚・ナット・座金構成から、必要ねじ長さと有効かみ合い長の目安を確認する無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/bolt-effective-thread-length`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: 'ボルト有効ねじ長さチェック' },
        ]}
      />
      <ToolHero
        title="ボルト有効ねじ長さチェック"
        description="呼び径、板厚、ナット・座金構成から、必要ねじ長さと有効かみ合い長の目安を確認できます。ねじ山のかみ合い不足がないか一次確認したい場面向けです。"
        labels={[
          { label: '対応範囲', value: 'M6〜M24' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '締結 / ねじ長さ / かみ合い' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="bolt-length"
      />
      <BoltEffectiveThreadLengthCalculator />
      <ToolDisclaimer />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />
      <RelatedArticles
        source="tool:bolt-effective-thread-length"
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

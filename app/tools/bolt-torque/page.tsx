import type { Metadata } from 'next';
import BoltTorqueCalculator from './BoltTorqueCalculator';
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
  title: 'ボルトトルク計算ツール',
  description: '目標軸力と締付けトルクを相互変換し、応力と面圧を確認できます。',
  path: '/tools/bolt-torque',
});

export default async function BoltTorquePage() {
  const tool = getToolById('bolt-torque');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) => tool?.relatedArticleSlugs.includes(article.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ボルトトルク計算ツール',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description: '目標軸力から締付けトルクを、締付けトルクから軸力を求める無料ツール。',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    url: `${SITE_URL}/tools/bolt-torque`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール', href: '/tools' }, { name: 'ボルトトルク計算' }]} />
      <ToolHero
        title="ボルトトルク計算"
        description="呼び径、ピッチ、強度区分、摩擦係数から、目標軸力と締付けトルクを相互換算し、軸応力と面圧も一次確認できます。"
        labels={[
          { label: '対応範囲', value: 'M6〜M24' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '締結 / トルク' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-11')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="bolt-torque"
        diagramMaxWidth={220}
      />
      <BoltTorqueCalculator />
      <ToolDisclaimer />
      <RelatedArticles
        source="tool:bolt-torque"
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

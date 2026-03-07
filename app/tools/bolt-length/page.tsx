import type { Metadata } from 'next';
import BoltLengthCalculator from './BoltLengthCalculator';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolHero from '@/app/components/ToolHero';
import AdSlot from '@/app/components/ads/AdSlot';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ボルト長さ計算',
  description:
    'ナット・座金の組み合わせから、必要なボルト長さと推奨購入長さを計算できるツールです。M6〜M24に対応し、締結条件の一次確認や寸法確認、PDF出力に使えます。',
  path: '/tools/bolt-length',
});

export const revalidate = 3600;

export default async function BoltLengthPage() {
  const tool = getToolById('bolt-length');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ボルト長さ計算',
    operatingSystem: 'Web',
    applicationCategory: 'EngineeringApplication',
    description:
      'ナット・座金の組み合わせから、必要なボルト長さと推奨購入長さを計算できる無料ツール。M6〜M24に対応し、一次確認や寸法確認に使えます。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/bolt-length`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '先端3山とは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ナット締結後にボルト先端側へねじ山を3山以上出す目安です。不完全ねじ部を有効かかり長から外すために使われます。',
        },
      },
      {
        '@type': 'Question',
        name: '推奨購入長さはどう決まりますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '計算値を市販ボルト長さの刻みに丸めて表示します。100mm以下は5mm、200mm以下は10mm、それ以上は25mm刻みです。',
        },
      },
    ],
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: 'ボルト長さ計算' },
        ]}
      />

      <ToolHero
        title="ボルト長さ計算"
        description="ナット・座金の組み合わせから、必要なボルト長さと推奨購入長さを計算できるツールです。M6〜M24に対応し、締結条件の一次確認や寸法確認、PDF出力に使えます。"
        labels={[
          { label: '対応範囲', value: 'M6〜M24' },
          { label: '用途', value: '一次確認' },
          { label: '種別', value: '締結 / ボルト / 長さ算定' },
        ]}
        diagramKey="bolt-length"
        note="入力条件 → 計算結果 → 途中式・PDF出力の順で確認できます。"
      />
      <BoltLengthCalculator />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.7 }}>
        ※ 本ツールの結果は参考値です。最終確認は規格・メーカー・専門家にお問い合わせください。
      </p>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" pageType="tool" />

      <RelatedArticles
        source="tool:bolt-length"
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

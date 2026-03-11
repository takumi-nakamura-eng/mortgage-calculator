import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedArticles from '@/app/components/RelatedArticles';
import ToolDisclaimer from '@/app/components/ToolDisclaimer';
import ToolHero from '@/app/components/ToolHero';
import { formatContentDate } from '@/lib/contentDates';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '片持ち梁ツール一覧',
  description:
    '片持ち梁の先端集中荷重計算と等分布荷重計算を荷重条件別に選べる一覧ページです。',
  path: '/tools/beams/cantilever',
});

const TOOLS = [
  {
    href: '/tools/beams/cantilever-point-load',
    title: '先端集中荷重',
    desc: '片持ち梁の先端荷重に限定して、固定端反力・最大曲げモーメント・最大たわみ・曲げ応力を確認します。',
  },
  {
    href: '/tools/beams/cantilever-uniform-load',
    title: '等分布荷重',
    desc: '片持ち梁の等分布荷重に限定して、固定端反力・最大曲げモーメント・最大たわみ・曲げ応力を確認します。',
  },
] as const;

export default async function CantileverPage() {
  const tool = getToolById('cantilever');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  return (
    <main className="container">
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: '梁計算ツール', href: '/tools/beams' },
          { name: '片持ち梁ツール一覧' },
        ]}
      />

      <ToolHero
        title="片持ち梁ツール一覧"
        description="片持ち梁は先端集中荷重と等分布荷重で固定端反力とたわみ式が異なるため、荷重条件ごとに分けています。対象荷重に合わせて選んでください。"
        labels={[
          { label: '荷重条件', value: '2種類' },
          { label: '入力', value: 'I / Z 直接入力' },
          { label: '種別', value: '梁 / 片持ち' },
        ]}
        publishedLabel={formatContentDate(tool?.publishedAt ?? '2026-03-04')}
        updatedLabel={formatContentDate(tool?.updatedAt ?? '2026-03-11')}
        diagramKey="cantilever"
        diagramMaxWidth={220}
      />
      <div className="portal-cards">
        {TOOLS.map((entry) => (
          <Link key={entry.href} href={entry.href} className="portal-card">
            <span className="portal-card-title">{entry.title}</span>
            <span className="portal-card-desc">{entry.desc}</span>
          </Link>
        ))}
      </div>
      <ToolDisclaimer />
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

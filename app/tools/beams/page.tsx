import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '梁計算ツール一覧',
  description:
    '単純梁・片持ち梁などの梁計算ツールをまとめたページです。曲げ応力・たわみをかんたんに計算できます。',
  path: '/tools/beams',
});

const BEAM_TOOLS = [
  {
    href: '/tools/beams/simple-supported',
    title: '単純梁',
    desc: '中央集中荷重と等分布荷重を荷重条件別ツールに分けて選べます。',
    available: true,
  },
  {
    href: '/tools/beams/cantilever',
    title: '片持ち梁（カンチレバー）',
    desc: '先端集中荷重と等分布荷重を荷重条件別ツールに分けて選べます。',
    available: true,
  },
  {
    href: '/tools/beams/fixed-fixed',
    title: '両端固定梁',
    desc: '両端固定条件の梁に対して、不静定梁の曲げモーメント・たわみを計算します。',
    available: false,
  },
] as const;

export default function BeamsPage() {
  return (
    <main className="container">
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '計算ツール', href: '/tools' },
          { name: '梁計算ツール' },
        ]}
      />
      <h1 className="page-title">梁計算ツール</h1>
      <p className="page-description">
        各種支持条件・荷重パターンの梁計算ツールです。曲げ応力・最大たわみの OK/NG 判定まで行えます。
      </p>

      <div className="portal-cards">
        {BEAM_TOOLS.map((tool) =>
          tool.available ? (
            <Link key={tool.href} href={tool.href} className="portal-card">
              <span className="portal-card-title">{tool.title}</span>
              <span className="portal-card-desc">{tool.desc}</span>
            </Link>
          ) : (
            <div key={tool.href} className="portal-card portal-card--soon">
              <span className="portal-card-title">
                {tool.title}{' '}
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#f1f5f9',
                    color: '#64748b',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '999px',
                    marginLeft: '0.25rem',
                  }}
                >
                  準備中
                </span>
              </span>
              <span className="portal-card-desc">{tool.desc}</span>
            </div>
          ),
        )}
      </div>

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginTop: '2rem',
          lineHeight: 1.7,
        }}
      >
        ※ 計算結果は参考値です。最終判断は設計基準・仕様書・専門家にご確認ください。
      </p>
    </main>
  );
}

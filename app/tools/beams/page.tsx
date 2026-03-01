import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '梁計算ツール一覧',
  description:
    '単純梁・片持ち梁などの梁計算ツールをまとめたページです。曲げ応力・たわみをかんたんに計算できます。',
};

const BEAM_TOOLS = [
  {
    href: '/tools/beams/simple-supported',
    title: '単純梁（単純支持）',
    desc: 'ピン・ローラー支持の梁に対して、中央集中荷重または等分布荷重の曲げ応力・最大たわみを計算します。',
    available: true,
  },
  {
    href: '/tools/beams/cantilever',
    title: '片持ち梁（カンチレバー）',
    desc: '固定端・自由端の片持ち梁に対して、集中荷重・等分布荷重の曲げ応力・たわみを計算します。',
    available: false,
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

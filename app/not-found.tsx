import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 className="page-title">ページが見つかりません</h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        トップページに戻る
      </Link>
    </main>
  );
}

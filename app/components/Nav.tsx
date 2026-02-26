import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          CalcNavi
        </Link>
        <div className="nav-links">
          <Link href="/loan">ローン計算機</Link>
          <Link href="/loan/history">履歴</Link>
        </div>
      </div>
    </nav>
  );
}

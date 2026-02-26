import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          calcnavi
        </Link>
        <div className="nav-links">
          <Link href="/loan">ローン計算</Link>
          <Link href="/history">履歴</Link>
          <Link href="/contact">お問い合わせ</Link>
          <Link href="/privacy">プライバシー</Link>
          <Link href="/disclaimer">免責</Link>
          <Link href="/about">運営者</Link>
        </div>
      </div>
    </nav>
  );
}

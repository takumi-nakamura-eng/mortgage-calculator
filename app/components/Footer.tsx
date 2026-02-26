import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/">ホーム</Link>
          <Link href="/contact">お問い合わせ</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/disclaimer">免責事項</Link>
          <Link href="/about">運営者情報</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} calcnavi</p>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={close}>
          <span className="nav-logo-texts">
            <span className="nav-logo-en">calcnavi</span>
            <span className="nav-logo-ja">計算ナビ</span>
          </span>
        </Link>

        <button
          className="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links${open ? ' nav-links--open' : ''}`}>
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/tools" onClick={close}>計算ツール</Link>
          <Link href="/articles" onClick={close}>解説記事</Link>
          <Link href="/history" onClick={close}>履歴</Link>
          <Link href="/contact" onClick={close}>お問い合わせ</Link>
        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

function CalcIcon() {
  return (
    <svg
      className="nav-logo-icon"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="24" height="24" rx="5" fill="currentColor" opacity="0.15" />
      <rect x="2" y="2" width="24" height="24" rx="5" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="5.5" width="16" height="6" rx="2" fill="currentColor" opacity="0.75" />
      <circle cx="8.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="14" cy="17" r="1.5" fill="currentColor" />
      <circle cx="19.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="22" r="1.5" fill="currentColor" />
      <circle cx="14" cy="22" r="1.5" fill="currentColor" />
      <circle cx="19.5" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/home" className="nav-logo" onClick={close}>
          <CalcIcon />
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
          <Link href="/home" onClick={close}>Home</Link>
          <Link href="/tools" onClick={close}>Tools</Link>
          <Link href="/tools#guides" onClick={close}>Guides</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}

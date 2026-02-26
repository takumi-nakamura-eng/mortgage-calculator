import type { Metadata } from 'next';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'calcnavi | 計算ツールと解説まとめ',
    template: '%s | calcnavi',
  },
  description:
    '計算ツールと解説をまとめたサイトです。ローン計算・ボルト計算などを無料で提供しています。',
  verification: {
    google: '_s1QVEtZdDk23z5f3faZKgRjWDcR1MuOGDZd_35LFDk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Nav />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-Q6PTFR8RMG" />
      </body>
    </html>
  );
}

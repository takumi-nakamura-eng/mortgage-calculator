import type { Metadata } from 'next';
import Nav from './components/Nav';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CalcNavi | 無料の計算機ツール集',
    template: '%s | CalcNavi',
  },
  description:
    'ローン計算機をはじめとする無料の計算機ツールを提供しています。住宅ローン・車ローンの月々返済額、総返済額、総利息額を簡単に計算できます。',
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
        <GoogleAnalytics gaId="G-Q6PTFR8RMG" />
      </body>
    </html>
  );
}

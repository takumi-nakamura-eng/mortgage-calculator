import type { Metadata } from 'next';
import Script from 'next/script';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 計算ツールと解説まとめ`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'calcnavi + 計算ナビ',
      },
    ],
  },
  // X (formerly Twitter) still consumes twitter:* card metadata keys.
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  verification: {
    google: '_s1QVEtZdDk23z5f3faZKgRjWDcR1MuOGDZd_35LFDk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? 'G-Q6PTFR8RMG';
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsenseEnabled =
    process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true' && Boolean(adsenseClient);

  return (
    <html lang="ja">
      <body>
        <Nav />
        {children}
        <Footer />
        {adsenseEnabled ? (
          <Script
            id="adsense-script"
            strategy="afterInteractive"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}

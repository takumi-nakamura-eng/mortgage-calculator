import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = `${SITE_URL}${input.path}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? 'website',
      locale: 'ja_JP',
      url,
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
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
      title: input.title,
      description: input.description,
      images: ['/og-image.png'],
    },
  };
}

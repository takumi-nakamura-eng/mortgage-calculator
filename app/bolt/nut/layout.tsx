import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '六角ナットの基礎知識',
  description:
    '六角ナット（JIS B 1181）の基礎知識。ナット高さ（m）の意味、1種・2種・3種の違い、呼び径とサイズの関係を解説します。',
};

export default function NutLayout({ children }: { children: React.ReactNode }) {
  return <article className="prose mx-auto max-w-2xl px-4 py-8">{children}</article>;
}

import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getAvailableTools } from '@/lib/data/tools';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '計算ツール',
  description: '設計・施工・暮らしに役立つ計算ツールを提供しています。',
  path: '/tools',
});

export const revalidate = 3600;

function normalizeQueryParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }>;
}) {
  const params = (await searchParams) ?? {};
  const tools = getAvailableTools();

  return (
    <div className="tools-wrap">
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール' }]} />
      <div className="tools-page-head">
        <h1 className="tools-page-title">計算ツール</h1>
        <p className="tools-page-desc">設計・施工・暮らしに役立つ計算ツールを提供しています。</p>
      </div>
      <ToolsClient initialTools={tools} initialQuery={normalizeQueryParam(params.q)} />
    </div>
  );
}

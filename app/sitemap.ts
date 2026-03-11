import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content/articles';
import { TOOLS } from '@/lib/data/tools';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixedPaths = [
    '/',
    '/tools',
    '/tools/bolt-length',
    '/tools/bolt-effective-thread-length',
    '/tools/beams',
    '/tools/beams/simple-supported',
    '/tools/beams/simple-supported-point-load',
    '/tools/beams/simple-supported-uniform-load',
    '/tools/beams/cantilever',
    '/tools/beams/cantilever-point-load',
    '/tools/beams/cantilever-uniform-load',
    '/tools/section-properties',
    '/articles',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/editorial-policy',
  ];

  const toolPaths = TOOLS.filter((tool) => tool.available).map((tool) => tool.href);
  const articles = await getAllArticles();
  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}${article.href}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const uniquePaths = Array.from(new Set([...fixedPaths, ...toolPaths]));

  const staticEntries = uniquePaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : path.startsWith('/tools/') || path.startsWith('/articles/') ? 0.8 : 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}

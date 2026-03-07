import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const MAX_QUOTE_LENGTH = 120;

export interface ArticleFaqItem {
  q: string;
  a: string;
}

export interface ArticleSource {
  title: string;
  url: string;
  site?: string;
  accessedAt: string;
  note?: string;
  quote?: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  toolRefs: string[];
  diagramKey: string;
  faq: ArticleFaqItem[];
  sources: ArticleSource[];
  href: string;
  hideHeaderDescription?: boolean;
}

export interface Article {
  meta: ArticleMeta;
  body: string;
}

interface ParsedFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  toolRefs: string[];
  diagramKey: string;
  faq: ArticleFaqItem[];
  sources: ArticleSource[];
  hideHeaderDescription?: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function transformMarkdownTables(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let i = 0;
  let inCodeBlock = false;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      i += 1;
      continue;
    }

    if (!inCodeBlock) {
      const header = lines[i];
      const separator = lines[i + 1];
      const headerMatch = /^\s*\|.*\|\s*$/.test(header ?? '');
      const separatorMatch = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(
        separator ?? '',
      );

      if (headerMatch && separatorMatch) {
        const parseCells = (row: string) =>
          row
            .trim()
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((cell) => cell.trim());

        const headerCells = parseCells(header);
        const bodyRows: string[][] = [];
        i += 2;

        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          bodyRows.push(parseCells(lines[i]));
          i += 1;
        }

        out.push('<table className="article-table">');
        out.push('<thead><tr>');
        for (const cell of headerCells) {
          out.push(`<th>${escapeHtml(cell)}</th>`);
        }
        out.push('</tr></thead>');
        out.push('<tbody>');
        for (const row of bodyRows) {
          out.push('<tr>');
          for (const cell of row) {
            out.push(`<td>${escapeHtml(cell)}</td>`);
          }
          out.push('</tr>');
        }
        out.push('</tbody></table>');
        continue;
      }
    }

    out.push(line);
    i += 1;
  }

  return out.join('\n');
}

function stripQuotes(value: string): string {
  return value.replace(/^['\"]|['\"]$/g, '');
}

function isValidHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidDate(input: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return false;
  const date = new Date(`${input}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function toPosixPath(value: string): string {
  return value.replace(/\\/g, '/');
}

export function isPublicArticle(target: string | Pick<ArticleMeta, 'slug'>): boolean {
  const raw = typeof target === 'string' ? target : target.slug;
  const normalized = toPosixPath(raw).replace(/\.mdx$/, '');
  const basename = normalized.split('/').filter(Boolean).pop() ?? '';
  if (basename.startsWith('_')) return false;
  return true;
}

async function listMdxFilesRecursively(
  dir: string,
  base = '',
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listMdxFilesRecursively(abs, rel);
      files.push(...nested);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(toPosixPath(rel));
    }
  }

  return files;
}

function parseFrontmatter(source: string): { data: ParsedFrontmatter; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error('Missing frontmatter block');
  }

  const block = match[1];
  const body = source.slice(match[0].length);
  const record: Record<string, string | boolean | string[] | ArticleFaqItem[] | ArticleSource[]> = {};
  let currentListKey: string | null = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, rawValue] = keyValueMatch;
      if (!rawValue) {
        currentListKey = key;
        record[key] = key === 'faq' || key === 'sources' ? [] : [];
        continue;
      }

      currentListKey = null;

      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        const list = rawValue
          .slice(1, -1)
          .split(',')
          .map((part) => stripQuotes(part.trim()))
          .filter(Boolean);
        record[key] = list;
        continue;
      }

      const parsedValue = stripQuotes(rawValue.trim());
      if (parsedValue === 'true' || parsedValue === 'false') {
        record[key] = parsedValue === 'true';
        continue;
      }

      record[key] = parsedValue;
      continue;
    }

    if (!currentListKey) continue;

    if (currentListKey === 'faq') {
      const qMatch = line.match(/^\s*-\s*q:\s*(.+)$/);
      if (qMatch) {
        const faqList = record.faq as ArticleFaqItem[];
        faqList.push({ q: stripQuotes(qMatch[1].trim()), a: '' });
        continue;
      }

      const aMatch = line.match(/^\s*a:\s*(.+)$/);
      if (aMatch) {
        const faqList = record.faq as ArticleFaqItem[];
        const last = faqList[faqList.length - 1];
        if (last) last.a = stripQuotes(aMatch[1].trim());
      }
      continue;
    }

    if (currentListKey === 'sources') {
      const titleMatch = line.match(/^\s*-\s*title:\s*(.+)$/);
      if (titleMatch) {
        const sourceList = record.sources as ArticleSource[];
        sourceList.push({
          title: stripQuotes(titleMatch[1].trim()),
          url: '',
          accessedAt: '',
        });
        continue;
      }

      const sourceFieldMatch = line.match(/^\s*([A-Za-z0-9_]+):\s*(.+)$/);
      if (sourceFieldMatch) {
        const [, fieldKey, rawFieldValue] = sourceFieldMatch;
        const sourceList = record.sources as ArticleSource[];
        const last = sourceList[sourceList.length - 1];
        if (!last) continue;
        const value = stripQuotes(rawFieldValue.trim());
        if (fieldKey === 'url') last.url = value;
        if (fieldKey === 'site') last.site = value;
        if (fieldKey === 'accessedAt') last.accessedAt = value;
        if (fieldKey === 'note') last.note = value;
        if (fieldKey === 'quote') last.quote = value;
      }
      continue;
    }

    const listMatch = line.match(/^\s*-\s*(.+)$/);
    if (listMatch) {
      const list = record[currentListKey];
      if (Array.isArray(list)) {
        (list as string[]).push(stripQuotes(listMatch[1].trim()));
      }
    }
  }

  const faq = Array.isArray(record.faq) ? (record.faq as ArticleFaqItem[]) : [];
  const sources = Array.isArray(record.sources) ? (record.sources as ArticleSource[]) : [];

  return {
    data: {
      title: String(record.title ?? ''),
      description: String(record.description ?? ''),
      publishedAt: String(record.publishedAt ?? ''),
      updatedAt: String(record.updatedAt ?? ''),
      category: String(record.category ?? ''),
      tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
      toolRefs: Array.isArray(record.toolRefs) ? (record.toolRefs as string[]) : [],
      diagramKey: String(record.diagramKey ?? ''),
      faq,
      sources,
      hideHeaderDescription: record.hideHeaderDescription === true,
    },
    body,
  };
}

function validateSources(slug: string, sources: ArticleSource[]): void {
  const issues: string[] = [];

  if (sources.length < 3) {
    issues.push('sources(3件以上)');
  }

  for (const [index, source] of sources.entries()) {
    const label = `sources[${index + 1}]`;
    if (!source.title?.trim()) issues.push(`${label}.title`);
    if (!source.url?.trim() || !isValidHttpUrl(source.url)) issues.push(`${label}.url`);
    if (!source.accessedAt?.trim() || !isValidDate(source.accessedAt)) {
      issues.push(`${label}.accessedAt`);
    }
    if (source.quote && source.quote.length > MAX_QUOTE_LENGTH) {
      issues.push(`${label}.quote(${MAX_QUOTE_LENGTH}文字以内)`);
    }
  }

  if (issues.length === 0) return;

  throw new Error(`Article ${slug}.mdx has invalid sources: ${issues.join(', ')}`);
}

function validateArticleContent(slug: string, meta: ParsedFrontmatter, body: string): void {
  validateSources(slug, meta.sources);
  const missing: string[] = [];

  if (!meta.title.trim()) missing.push('title');
  if (!meta.description.trim()) missing.push('description');
  if (!meta.publishedAt.trim()) missing.push('publishedAt');
  if (!meta.updatedAt.trim()) missing.push('updatedAt');
  if (!meta.category.trim()) missing.push('category');
  if (!meta.diagramKey.trim()) missing.push('diagramKey');
  if (meta.toolRefs.length === 0) missing.push('toolRefs');
  if (meta.tags.length === 0) missing.push('tags');
  if (meta.faq.length < 2 || meta.faq.some((item) => !item.q.trim() || !item.a.trim())) {
    missing.push('faq(2件以上)');
  }

  if (!/^##\s+図解/m.test(body) || !/(<svg[\s>]|<Diagram[\s/>]|<[A-Z][A-Za-z0-9]*Svg[\s/>])/m.test(body)) {
    missing.push('図解(SVG)');
  }

  if (!/^##\s+比較表/m.test(body) || !/\|.+\|.+\|\n\|[-:|\s]+\|/m.test(body)) {
    missing.push('比較表');
  }

  if (!/^##\s+計算例/m.test(body)) {
    missing.push('計算例');
  }

  if (!/^##\s+FAQ/m.test(body)) {
    missing.push('FAQセクション');
  }

  if (missing.length > 0) {
    throw new Error(`Article ${slug}.mdx is missing required blocks: ${missing.join(', ')}`);
  }
}

async function readArticleFile(slug: string): Promise<Article | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const source = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(source);
  validateArticleContent(slug, data, body);

  return {
    meta: {
      slug,
      href: `/articles/${slug}`,
      ...data,
    },
    body,
  };
}

export const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  const allFiles = await listMdxFilesRecursively(ARTICLES_DIR);
  const slugs = allFiles
    .filter((file) => isPublicArticle(file))
    .map((file) => file.replace(/\.mdx$/, ''));

  const articles = await Promise.all(slugs.map((slug) => readArticleFile(slug)));

  return articles
    .filter((item): item is Article => item !== null)
    .map((article) => article.meta)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  if (!isPublicArticle(slug)) return null;
  try {
    return await readArticleFile(slug);
  } catch {
    return null;
  }
});

export const getRelatedArticles = cache(
  async (slug: string, limit = 3): Promise<ArticleMeta[]> => {
    const current = await getArticleBySlug(slug);
    if (!current) return [];

    const all = await getAllArticles();
    const currentTags = new Set(current.meta.tags);

    return all
      .filter((article) => article.slug !== slug)
      .map((article) => {
        const sharedTagCount = article.tags.filter((tag) => currentTags.has(tag)).length;
        const sharedCategory = article.category === current.meta.category ? 1 : 0;
        return { article, score: sharedTagCount * 2 + sharedCategory };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.article.publishedAt.localeCompare(a.article.publishedAt);
      })
      .slice(0, limit)
      .map((row) => row.article);
  },
);

export const getArticleComponent = cache(async (slug: string) => {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const evaluated = await evaluate(transformMarkdownTables(article.body), {
    ...runtime,
  });

  return evaluated.default;
});

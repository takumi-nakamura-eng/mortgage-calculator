import type { Metadata } from 'next';
import type React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import ArticleViewTracker from '@/app/components/ArticleViewTracker';
import ArticleEngagementTracker from '@/app/components/ArticleEngagementTracker';
import ArticleHero from '@/app/components/ArticleHero';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import CardDiagram from '@/app/components/CardDiagram';
import Diagram from '@/app/components/Diagram';
import MdxOutboundLink from '@/app/components/MdxOutboundLink';
import Quote from '@/app/components/mdx/Quote';
import RelatedArticles from '@/app/components/RelatedArticles';
import RelatedTools from '@/app/components/RelatedTools';
import AdSenseBlock from '@/app/components/AdSenseBlock';
import { TOOLS } from '@/lib/data/tools';
import {
  getAllArticles,
  getArticleBySlug,
  getArticleComponent,
  getRelatedArticles,
} from '@/lib/content/articles';
import { formatContentDate } from '@/lib/contentDates';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

const LEGACY_ARTICLE_REDIRECTS: Record<string, string> = {
  'beam-deflection-formula': '/articles/simple-beam-reaction-basics',
  'bolt-strength-class': '/articles/bolt-strength-class-selection',
  'tube-section-weight-comparison': '/tools/section-properties',
};

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({
      title: '記事が見つかりません',
      description: '指定された記事が見つかりませんでした。',
      path: `/articles/${slug}`,
      type: 'article',
    });
  }

  return buildMetadata({
    title: article.meta.title,
    description: article.meta.description,
    path: article.meta.href,
    type: 'article',
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const redirectPath = LEGACY_ARTICLE_REDIRECTS[slug];
  if (redirectPath) permanentRedirect(redirectPath);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const MDXContent = await getArticleComponent(slug);
  if (!MDXContent) notFound();

  const relatedArticles = await getRelatedArticles(slug, 3);
  const relatedTools = TOOLS.filter(
    (tool) => tool.available && article.meta.toolRefs.includes(tool.id),
  );
  const showHeaderDescription = !article.meta.hideHeaderDescription;
  const useHeroDiagram = article.meta.heroDiagram === true;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.meta.title,
    description: article.meta.description,
    datePublished: article.meta.publishedAt,
    dateModified: article.meta.updatedAt,
    inLanguage: 'ja',
    mainEntityOfPage: `${SITE_URL}${article.meta.href}`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '解説記事',
        item: `${SITE_URL}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.meta.title,
        item: `${SITE_URL}${article.meta.href}`,
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.meta.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
  const hasFaq = article.meta.faq.length > 0;

  return (
    <main className="container article-page">
      <ArticleViewTracker slug={article.meta.slug} category={article.meta.category} />
      <ArticleEngagementTracker slug={article.meta.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {hasFaq ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '解説記事', href: '/articles' },
          { name: article.meta.title },
        ]}
      />

      {useHeroDiagram ? (
        <ArticleHero
          title={article.meta.title}
          description={showHeaderDescription ? article.meta.description : undefined}
          publishedLabel={formatContentDate(article.meta.publishedAt)}
          updatedLabel={formatContentDate(article.meta.updatedAt)}
          readingMinutes={article.meta.readingMinutes}
          diagramKey={article.meta.diagramKey}
        />
      ) : null}

      <article id="article-content" className="static-content article-content">
        {!useHeroDiagram ? (
          <header className="article-header article-header--inside">
            <h1 className="page-title">{article.meta.title}</h1>
            {showHeaderDescription ? (
              <p className="page-description">{article.meta.description}</p>
            ) : null}
            <div className="article-meta">
              <span>公開日: {formatContentDate(article.meta.publishedAt)}</span>
              <span>更新日: {formatContentDate(article.meta.updatedAt)}</span>
              <span>カテゴリ: {article.meta.category}</span>
            </div>
          </header>
        ) : null}
        <AdSenseBlock
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE}
          className="article-ad article-ad--inline"
          pageType="article"
        />
        <MDXContent
          components={{
            a: (props: React.ComponentProps<'a'>) => (
              <MdxOutboundLink {...props} source={`article:${article.meta.slug}`} />
            ),
            Quote,
            CardDiagram,
            Diagram,
          }}
        />
      </article>

      <section className="article-sources">
        <h2>出典・参考</h2>
        <ul>
          {article.meta.sources.map((source, index) => (
            <li key={`${source.url}-${index}`}>
              <MdxOutboundLink
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                source={`article:${article.meta.slug}:sources`}
              >
                {source.title}
              </MdxOutboundLink>
              {source.site ? <span>（{source.site}）</span> : null}
              <span> - 参照日: {source.accessedAt}</span>
              {source.note ? <span> - {source.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <RelatedTools
        source={`article:${article.meta.slug}`}
        items={relatedTools.map((tool) => ({
          id: tool.id,
          title: tool.title,
          desc: tool.desc,
          href: tool.href,
          diagramKey: tool.diagramKey,
        }))}
      />

      <RelatedArticles
        source={`article:${article.meta.slug}`}
        items={relatedArticles.map((item) => ({
          slug: item.slug,
          title: item.title,
          description: item.description,
          href: item.href,
          diagramKey: item.diagramKey,
        }))}
      />
    </main>
  );
}

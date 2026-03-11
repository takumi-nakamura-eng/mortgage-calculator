import Diagram from './Diagram';

interface ArticleHeroProps {
  title: string;
  description?: string;
  publishedLabel: string;
  updatedLabel: string;
  readingMinutes: number;
  diagramKey: string;
}

export default function ArticleHero({
  title,
  description,
  publishedLabel,
  updatedLabel,
  readingMinutes,
  diagramKey,
}: ArticleHeroProps) {
  return (
    <section className="article-hero" aria-label="記事概要">
      <div className="article-hero__content">
        <h1 className="page-title article-hero__title">{title}</h1>
        {description ? <p className="page-description article-hero__description">{description}</p> : null}
        <div className="article-hero__meta" aria-label="記事メタ情報">
          <span className="article-hero__meta-item">
            公開日: {publishedLabel}
          </span>
          <span className="article-hero__meta-item">
            更新日: {updatedLabel}
          </span>
          <span className="article-hero__meta-item">
            読了目安: 約{readingMinutes}分
          </span>
        </div>
      </div>
      <div className="article-hero__visual" aria-hidden="true">
        <div className="article-hero__diagram">
          <Diagram
            diagramKey={diagramKey}
            width="100%"
            maxWidth={520}
            framed={false}
            ariaHidden
            role="presentation"
          />
        </div>
      </div>
    </section>
  );
}

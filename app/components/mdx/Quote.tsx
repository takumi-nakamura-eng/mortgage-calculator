import MdxOutboundLink from '@/app/components/MdxOutboundLink';

interface QuoteProps {
  text: string;
  sourceTitle: string;
  sourceUrl: string;
  accessedAt: string;
}

export default function Quote({
  text,
  sourceTitle,
  sourceUrl,
  accessedAt,
}: QuoteProps) {
  return (
    <figure className="article-quote">
      <blockquote>{text}</blockquote>
      <figcaption>
        <MdxOutboundLink
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          source="article:quote"
        >
          {sourceTitle}
        </MdxOutboundLink>
        <span>（参照日: {accessedAt}）</span>
      </figcaption>
    </figure>
  );
}

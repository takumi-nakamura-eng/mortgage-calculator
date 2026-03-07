import { DiagramRenderer } from '@/lib/diagrams/registry';

interface ToolHeroLabel {
  label: string;
  value: string;
}

interface ToolHeroProps {
  title: string;
  description: string;
  labels: ToolHeroLabel[];
  diagramKey: string;
  diagramMaxWidth?: number;
}

export default function ToolHero({
  title,
  description,
  labels,
  diagramKey,
  diagramMaxWidth = 180,
}: ToolHeroProps) {
  return (
    <section className="tool-hero" aria-label="ツール概要">
      <div className="tool-hero__content">
        <div className="tool-hero__content-inner">
          <h1 className="page-title tool-hero__title">{title}</h1>
          <p className="page-description tool-hero__description">{description}</p>
          <div className="tool-hero__labels" aria-label="ツール補助情報">
            {labels.map((item) => (
              <span key={`${item.label}:${item.value}`} className="tool-hero__label">
                <span className="tool-hero__label-name">{item.label}</span>
                <span className="tool-hero__label-value">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="tool-hero__visual" aria-hidden="true">
        <div className="tool-hero__diagram">
          <DiagramRenderer
            kind="tool"
            diagramKey={diagramKey}
            width="100%"
            maxWidth={diagramMaxWidth}
            renderContext="hero"
            framed={false}
            ariaHidden
            role="presentation"
          />
        </div>
      </div>
    </section>
  );
}

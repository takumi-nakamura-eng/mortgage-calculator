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
  note?: string;
}

export default function ToolHero({
  title,
  description,
  labels,
  diagramKey,
  note,
}: ToolHeroProps) {
  return (
    <section className="tool-hero" aria-label="ツール概要">
      <div className="tool-hero__content">
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
        {note ? <p className="tool-hero__note">{note}</p> : null}
      </div>
      <div className="tool-hero__visual" aria-hidden="true">
        <div className="tool-hero__visual-panel">
          <div className="tool-hero__diagram">
            <DiagramRenderer
              kind="tool"
              diagramKey={diagramKey}
              width="100%"
              maxWidth={420}
              framed={false}
              ariaHidden
              role="presentation"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

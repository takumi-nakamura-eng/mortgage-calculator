import Diagram from './Diagram';

interface CardDiagramProps {
  diagramKey: string;
  variant: 'article' | 'tool';
  className?: string;
}

export default function CardDiagram({ diagramKey, variant, className }: CardDiagramProps) {
  return (
    <div className={className}>
      <Diagram
        kind={variant}
        diagramKey={diagramKey}
        width="100%"
        height="100%"
        framed={false}
        ariaHidden
        role="presentation"
        maxWidth={variant === 'tool' ? undefined : 240}
      />
    </div>
  );
}

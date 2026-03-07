import { getBoltSvgMarkup } from '@/lib/bolts/boltSVG';

export default function BoltLengthDimensionDiagram() {
  return (
    <div
      aria-label="ボルト締結の概略図"
      role="img"
      dangerouslySetInnerHTML={{
        __html: getBoltSvgMarkup({
          width: '100%',
          maxWidth: 680,
          includeXmlns: false,
        }),
      }}
    />
  );
}

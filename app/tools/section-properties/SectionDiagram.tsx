import type { SectionShape } from '@/lib/beams/sections';
import { SectionPropertiesSvg } from '@/lib/diagrams/tools/section-properties';

export function SectionDiagram({ shape }: { shape: SectionShape }) {
  return <SectionPropertiesSvg shape={shape} />;
}

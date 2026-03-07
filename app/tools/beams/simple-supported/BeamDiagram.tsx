import type { LoadCase } from '@/lib/beams/simpleBeam';
import { SimpleSupportedSvg } from '@/lib/diagrams/tools/simple-supported';

interface Props {
  loadCase: LoadCase;
  spanLabel?: string;
  loadLabel?: string;
}

export default function BeamDiagram({ loadCase, spanLabel, loadLabel }: Props) {
  return <SimpleSupportedSvg loadCase={loadCase} spanLabel={spanLabel} loadLabel={loadLabel} />;
}

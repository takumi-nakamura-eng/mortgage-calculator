import type { LoadCase } from '@/lib/beams/simpleBeam';
import { CantileverSvg } from '@/lib/diagrams/tools/cantilever';

interface Props {
  loadCase: LoadCase;
  spanLabel?: string;
  loadLabel?: string;
}

export default function CantileverDiagram({ loadCase, spanLabel, loadLabel }: Props) {
  return <CantileverSvg loadCase={loadCase} spanLabel={spanLabel} loadLabel={loadLabel} />;
}

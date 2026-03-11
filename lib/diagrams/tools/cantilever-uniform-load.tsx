import type { BoltLengthSvgProps } from './bolt-length';
import { CantileverSvg } from './cantilever';

export function CantileverUniformLoadSvg(props: BoltLengthSvgProps) {
  return <CantileverSvg {...props} loadCase="uniform" ariaLabel="片持ち梁の等分布荷重模式図" />;
}

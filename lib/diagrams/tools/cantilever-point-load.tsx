import type { BoltLengthSvgProps } from './bolt-length';
import { CantileverSvg } from './cantilever';

export function CantileverPointLoadSvg(props: BoltLengthSvgProps) {
  return <CantileverSvg {...props} loadCase="center" ariaLabel="片持ち梁の先端集中荷重模式図" />;
}

import type { BoltLengthSvgProps } from './bolt-length';
import { SimpleSupportedSvg } from './simple-supported';

export function SimpleSupportedUniformLoadSvg(props: BoltLengthSvgProps) {
  return <SimpleSupportedSvg {...props} loadCase="uniform" ariaLabel="単純梁の等分布荷重模式図" />;
}

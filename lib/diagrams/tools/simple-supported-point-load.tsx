import type { BoltLengthSvgProps } from './bolt-length';
import { SimpleSupportedSvg } from './simple-supported';

export function SimpleSupportedPointLoadSvg(props: BoltLengthSvgProps) {
  return <SimpleSupportedSvg {...props} loadCase="center" ariaLabel="単純梁の中央集中荷重模式図" />;
}

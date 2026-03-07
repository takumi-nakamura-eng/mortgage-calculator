import type { BoltLengthSvgProps } from './bolt-length';

export function UnitSvg(props: BoltLengthSvgProps) {
  return (
    <svg viewBox="0 0 240 140" width={props.width ?? 240} height={props.height ?? 140} aria-label={props.ariaHidden ? undefined : props.ariaLabel ?? '単位換算図'} aria-hidden={props.ariaHidden} role={props.role} className={props.className} style={{ display: 'block', maxWidth: props.maxWidth ?? 240, ...(props.framed === false ? null : { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }) }}>
      <text x="72" y="60" fontSize="18" fontWeight="700" fill="#1d4ed8">mm</text>
      <text x="118" y="60" fontSize="18" fontWeight="700" fill="#334155">↔</text>
      <text x="166" y="60" fontSize="18" fontWeight="700" fill="#dc2626">inch</text>
      <text x="72" y="98" fontSize="18" fontWeight="700" fill="#1d4ed8">N</text>
      <text x="118" y="98" fontSize="18" fontWeight="700" fill="#334155">↔</text>
      <text x="160" y="98" fontSize="18" fontWeight="700" fill="#dc2626">kgf</text>
    </svg>
  );
}

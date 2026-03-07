import type { BoltLengthSvgProps } from './bolt-length';

export function AnchorSvg(props: BoltLengthSvgProps) {
  return (
    <svg viewBox="0 0 240 140" width={props.width ?? 240} height={props.height ?? 140} aria-label={props.ariaHidden ? undefined : props.ariaLabel ?? 'アンカー図'} aria-hidden={props.ariaHidden} role={props.role} className={props.className} style={{ display: 'block', maxWidth: props.maxWidth ?? 240, ...(props.framed === false ? null : { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }) }}>
      <rect x="44" y="28" width="24" height="84" fill="#94a3b8" stroke="#334155" />
      <path d="M56 112 Q84 120 102 96" fill="none" stroke="#334155" strokeWidth="4" />
      <rect x="108" y="90" width="88" height="18" fill="#e2e8f0" stroke="#64748b" />
      <text x="120" y="44" fontSize="11" fill="#334155">アンカー</text>
    </svg>
  );
}

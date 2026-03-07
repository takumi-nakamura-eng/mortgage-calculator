import { BoltLengthSvg } from '@/lib/bolts/boltLengthSvg';

function BoltLengthCardDiagram() {
  return (
    <BoltLengthSvg width="100%" height="100%" framed={false} ariaHidden role="presentation" />
  );
}

function BeamSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#eff6ff" />
      <rect x="36" y="66" width="168" height="12" rx="5" fill="#2563eb" />
      <polygon points="44,78 32,96 56,96" fill="#334155" />
      <polygon points="196,78 184,96 208,96" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="196" cy="101" r="4" fill="none" stroke="#334155" strokeWidth="2" />
      <line x1="120" y1="36" x2="120" y2="62" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="120,69 114,60 126,60" fill="#dc2626" />
      <line x1="44" y1="112" x2="196" y2="112" stroke="#475569" strokeWidth="1.2" />
      <text x="120" y="126" textAnchor="middle" fontSize="11" fill="#334155">
        L
      </text>
    </svg>
  );
}

function SectionSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f8fafc" />
      <rect x="60" y="30" width="120" height="16" rx="4" fill="#334155" />
      <rect x="110" y="46" width="20" height="48" fill="#334155" />
      <rect x="60" y="94" width="120" height="16" rx="4" fill="#334155" />
      <line x1="40" y1="70" x2="200" y2="70" stroke="#2563eb" strokeDasharray="5 4" />
      <line x1="58" y1="22" x2="182" y2="22" stroke="#64748b" />
      <line x1="58" y1="22" x2="58" y2="28" stroke="#64748b" />
      <line x1="182" y1="22" x2="182" y2="28" stroke="#64748b" />
      <text x="120" y="18" textAnchor="middle" fontSize="11" fill="#475569">
        B
      </text>
    </svg>
  );
}

function GenericSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f1f5f9" />
      <rect x="30" y="26" width="180" height="88" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <line x1="45" y1="50" x2="195" y2="50" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="68" x2="170" y2="68" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="86" x2="155" y2="86" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

export function resolveArticleCardDiagram(diagramKey: string) {
  const key = diagramKey.toLowerCase();
  if (
    key.includes('thread') ||
    key.includes('nut') ||
    key.includes('washer') ||
    key.includes('bolt')
  ) {
    return <BoltLengthCardDiagram />;
  }
  if (
    key.includes('beam') ||
    key.includes('deflection') ||
    key.includes('stress') ||
    key.includes('channel')
  ) {
    return <BeamSketch />;
  }
  if (
    key.includes('section') ||
    key.includes('modulus') ||
    key.includes('inertia') ||
    key.includes('tube')
  ) {
    return <SectionSketch />;
  }
  return <GenericSketch />;
}

export function resolveToolCardDiagram(diagramKey: string) {
  switch (diagramKey) {
    case 'bolt-length':
      return <BoltLengthCardDiagram />;
    case 'beam':
      return <BeamSketch />;
    case 'section-properties':
      return <SectionSketch />;
    default:
      return <GenericSketch />;
  }
}

interface CardDiagramProps {
  diagramKey: string;
  variant: 'article' | 'tool';
  className?: string;
  svgMarkup?: string;
}

function BoltSketch() {
  return (
    <svg viewBox="0 0 520 270" aria-hidden="true">
      <rect x="0" y="0" width="520" height="270" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <line x1="52" y1="126" x2="470" y2="126" stroke="#94a3b8" strokeDasharray="4 3" />

      <polygon
        points="76,93 106,93 115,105 115,147 106,159 76,159 67,147 67,105"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="1.4"
      />
      <rect x="106" y="114" width="188" height="24" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <rect x="106" y="92" width="92" height="68" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.3" />
      <rect x="198" y="82" width="12" height="88" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
      <rect x="210" y="87" width="12" height="78" fill="#e2e8f0" stroke="#334155" strokeDasharray="4 2" strokeWidth="1.2" />
      <polygon
        points="222,96 268,96 276,106 276,146 268,156 222,156"
        fill="#a3b8cf"
        stroke="#334155"
        strokeWidth="1.3"
      />

      <line x1="280" y1="114" x2="280" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="286" y1="114" x2="286" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="292" y1="114" x2="292" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="298" y1="114" x2="298" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="304" y1="114" x2="304" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="310" y1="114" x2="310" y2="138" stroke="#cbd5e1" strokeWidth="1.1" />

      <text x="91" y="84" textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ボルト頭</text>
      <text x="152" y="84" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight={700}>締結体</text>
      <text x="204" y="74" textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>平座金</text>
      <text x="224" y="74" textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ばね座金</text>
      <text x="249" y="88" textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ナット</text>

      <line x1="106" y1="54" x2="328" y2="54" stroke="#334155" strokeWidth="1.1" />
      <line x1="106" y1="50" x2="106" y2="58" stroke="#334155" strokeWidth="1.1" />
      <line x1="328" y1="50" x2="328" y2="58" stroke="#334155" strokeWidth="1.1" />
      <text x="217" y="67" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>L_required（首下長さ）</text>

      <line x1="294" y1="184" x2="328" y2="184" stroke="#334155" strokeWidth="1.1" />
      <line x1="294" y1="180" x2="294" y2="188" stroke="#334155" strokeWidth="1.1" />
      <line x1="328" y1="180" x2="328" y2="188" stroke="#334155" strokeWidth="1.1" />
      <text x="311" y="197" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>&gt;3p</text>

      <line x1="106" y1="200" x2="198" y2="200" stroke="#334155" strokeWidth="1.1" />
      <line x1="106" y1="196" x2="106" y2="204" stroke="#334155" strokeWidth="1.1" />
      <line x1="198" y1="196" x2="198" y2="204" stroke="#334155" strokeWidth="1.1" />
      <text x="152" y="213" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>t</text>

      <line x1="198" y1="216" x2="210" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="198" y1="212" x2="198" y2="220" stroke="#334155" strokeWidth="1.1" />
      <line x1="210" y1="212" x2="210" y2="220" stroke="#334155" strokeWidth="1.1" />
      <text x="204" y="229" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>Hpw</text>

      <line x1="210" y1="232" x2="222" y2="232" stroke="#334155" strokeWidth="1.1" />
      <line x1="210" y1="228" x2="210" y2="236" stroke="#334155" strokeWidth="1.1" />
      <line x1="222" y1="228" x2="222" y2="236" stroke="#334155" strokeWidth="1.1" />
      <text x="216" y="245" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>Hsw</text>

      <line x1="222" y1="248" x2="268" y2="248" stroke="#334155" strokeWidth="1.1" />
      <line x1="222" y1="244" x2="222" y2="252" stroke="#334155" strokeWidth="1.1" />
      <line x1="268" y1="244" x2="268" y2="252" stroke="#334155" strokeWidth="1.1" />
      <text x="245" y="261" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight={700}>Hnut</text>
    </svg>
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

function resolveArticleSketch(diagramKey: string) {
  const key = diagramKey.toLowerCase();
  if (
    key.includes('thread') ||
    key.includes('nut') ||
    key.includes('washer') ||
    key.includes('bolt')
  ) {
    return <BoltSketch />;
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

function resolveToolSketch(diagramKey: string) {
  switch (diagramKey) {
    case 'bolt-length':
      return <BoltSketch />;
    case 'beam':
      return <BeamSketch />;
    case 'section-properties':
      return <SectionSketch />;
    default:
      return <GenericSketch />;
  }
}

export default function CardDiagram({ diagramKey, variant, className, svgMarkup }: CardDiagramProps) {
  if (variant === 'article' && svgMarkup) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
  }
  const sketch = variant === 'article' ? resolveArticleSketch(diagramKey) : resolveToolSketch(diagramKey);
  return <div className={className}>{sketch}</div>;
}

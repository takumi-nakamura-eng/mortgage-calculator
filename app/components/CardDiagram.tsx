interface CardDiagramProps {
  diagramKey: string;
  variant: 'article' | 'tool';
  className?: string;
  svgMarkup?: string;
}

function BoltSketch() {
  return (
    <svg viewBox="0 0 620 260" aria-hidden="true">
      <rect x="0" y="0" width="620" height="260" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <line x1="90" y1="132" x2="530" y2="132" stroke="#94a3b8" strokeDasharray="4 3" />

      <polygon points="214,98 248,98 259,112 259,152 248,166 214,166 203,152 203,112" fill="#94a3b8" stroke="#334155" strokeWidth="1.4" />
      <rect x="248" y="120" width="166" height="24" fill="#64748b" stroke="#334155" strokeWidth="1" />

      <rect x="248" y="92" width="70" height="80" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.3" />

      <rect x="318" y="96" width="12" height="72" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
      <rect x="330" y="100" width="12" height="64" fill="#e2e8f0" stroke="#334155" strokeDasharray="4 2" strokeWidth="1.2" />

      <polygon points="342,104 394,104 402,114 402,150 394,160 342,160" fill="#a3b8cf" stroke="#334155" strokeWidth="1.3" />

      <line x1="394" y1="120" x2="394" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="399" y1="120" x2="399" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="404" y1="120" x2="404" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="409" y1="120" x2="409" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="414" y1="120" x2="414" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />

      <text x="231" y="88" textAnchor="middle" fontSize="12" fill="#334155" fontWeight={700}>ボルト</text>
      <text x="283" y="88" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight={700}>締結体</text>

      <text x="306" y="64" textAnchor="end" fontSize="11" fill="#334155" fontWeight={700}>平座金</text>
      <line x1="307" y1="68" x2="324" y2="96" stroke="#334155" strokeWidth="1" />

      <text x="352" y="64" textAnchor="start" fontSize="11" fill="#334155" fontWeight={700}>ばね座金</text>
      <line x1="354" y1="68" x2="336" y2="100" stroke="#334155" strokeWidth="1" />

      <text x="368" y="96" textAnchor="middle" fontSize="12" fill="#334155" fontWeight={700}>ナット</text>

      <line x1="248" y1="34" x2="414" y2="34" stroke="#334155" strokeWidth="1.1" />
      <line x1="248" y1="30" x2="248" y2="38" stroke="#334155" strokeWidth="1.1" />
      <line x1="414" y1="30" x2="414" y2="38" stroke="#334155" strokeWidth="1.1" />
      <text x="331" y="24" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>L_required（首下長さ）</text>

      <line x1="248" y1="212" x2="318" y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1="248" y1="208" x2="248" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="318" y1="208" x2="318" y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="283" y="226" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>t</text>

      <line x1="318" y1="212" x2="330" y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1="318" y1="208" x2="318" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="330" y1="208" x2="330" y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="308" y="198" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>Hpw</text>
      <line x1="312" y1="201" x2="324" y2="209" stroke="#334155" strokeWidth="1" />

      <line x1="330" y1="212" x2="342" y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1="330" y1="208" x2="330" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="342" y1="208" x2="342" y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="354" y="198" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>Hsw</text>
      <line x1="350" y1="201" x2="336" y2="209" stroke="#334155" strokeWidth="1" />

      <line x1="342" y1="212" x2="394" y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1="342" y1="208" x2="342" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="394" y1="208" x2="394" y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="368" y="226" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>Hnut</text>

      <line x1="394" y1="212" x2="414" y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1="394" y1="208" x2="394" y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1="414" y1="208" x2="414" y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="404" y="226" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>&gt;3p</text>
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

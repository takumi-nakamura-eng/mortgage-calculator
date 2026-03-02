'use client';

function Hdim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#334155" strokeWidth="1.1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <text x={(x1 + x2) / 2} y={y + 14} textAnchor="middle" fontSize="12" fontWeight={700} fill="#1f2937">
        {label}
      </text>
    </g>
  );
}

export default function BoltDimensionDiagram() {
  const cy = 132;

  const headX = 214;
  const headW = 34;

  const shankX1 = 248;
  const plateX1 = 248;
  const plateX2 = 318;

  const pwX1 = 318;
  const pwX2 = 330;

  const swX1 = 330;
  const swX2 = 342;

  const nutX1 = 342;
  const nutX2 = 394;

  const tipX1 = 394;
  const tipX2 = 414;

  return (
    <svg
      viewBox="0 0 620 260"
      width="100%"
      aria-label="ボルト締結の概略図"
      style={{ display: 'block', maxWidth: 680 }}
    >
      <rect x="0" y="0" width="620" height="260" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <line x1="90" y1={cy} x2="530" y2={cy} stroke="#94a3b8" strokeDasharray="4 3" />

      <polygon
        points="214,98 248,98 259,112 259,152 248,166 214,166 203,152 203,112"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="1.4"
      />
      <rect x={shankX1} y="120" width="166" height="24" fill="#64748b" stroke="#334155" strokeWidth="1" />

      <rect x={plateX1} y="92" width={plateX2 - plateX1} height="80" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.3" />

      <rect x={pwX1} y="96" width={pwX2 - pwX1} height="72" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
      <rect x={swX1} y="100" width={swX2 - swX1} height="64" fill="#e2e8f0" stroke="#334155" strokeDasharray="4 2" strokeWidth="1.2" />

      <polygon
        points="342,104 394,104 402,114 402,150 394,160 342,160"
        fill="#a3b8cf"
        stroke="#334155"
        strokeWidth="1.3"
      />

      <line x1="394" y1="120" x2="394" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="399" y1="120" x2="399" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="404" y1="120" x2="404" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="409" y1="120" x2="409" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />
      <line x1="414" y1="120" x2="414" y2="144" stroke="#cbd5e1" strokeWidth="1.1" />

      <text x={headX + headW / 2} y="88" textAnchor="middle" fontSize="12" fill="#334155" fontWeight={700}>ボルト</text>
      <text x={(plateX1 + plateX2) / 2} y="88" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight={700}>締結体</text>

      <text x="306" y="64" textAnchor="end" fontSize="11" fill="#334155" fontWeight={700}>平座金</text>
      <line x1="307" y1="68" x2="324" y2="96" stroke="#334155" strokeWidth="1" />

      <text x="352" y="64" textAnchor="start" fontSize="11" fill="#334155" fontWeight={700}>ばね座金</text>
      <line x1="354" y1="68" x2="336" y2="100" stroke="#334155" strokeWidth="1" />

      <text x="368" y="96" textAnchor="middle" fontSize="12" fill="#334155" fontWeight={700}>ナット</text>

      <Hdim x1={shankX1} x2={tipX2} y={34} label="L_required（首下長さ）" />

      <Hdim x1={plateX1} x2={plateX2} y={212} label="t" />
      <Hdim x1={nutX1} x2={nutX2} y={212} label="Hnut" />
      <Hdim x1={tipX1} x2={tipX2} y={212} label=">3p" />

      <line x1={pwX1} y1="212" x2={pwX2} y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1={pwX1} y1="208" x2={pwX1} y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1={pwX2} y1="208" x2={pwX2} y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="308" y="198" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>Hpw</text>
      <line x1="312" y1="201" x2="324" y2="209" stroke="#334155" strokeWidth="1" />

      <line x1={swX1} y1="212" x2={swX2} y2="212" stroke="#334155" strokeWidth="1.1" />
      <line x1={swX1} y1="208" x2={swX1} y2="216" stroke="#334155" strokeWidth="1.1" />
      <line x1={swX2} y1="208" x2={swX2} y2="216" stroke="#334155" strokeWidth="1.1" />
      <text x="354" y="198" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight={700}>Hsw</text>
      <line x1="350" y1="201" x2="336" y2="209" stroke="#334155" strokeWidth="1" />
    </svg>
  );
}

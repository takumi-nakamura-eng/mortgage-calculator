function hdim(x1: number, x2: number, y: number, label: string): string {
  const cx = (x1 + x2) / 2;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#334155" stroke-width="1"/>
  <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <text x="${cx}" y="${y + 13}" text-anchor="middle" font-size="11" fill="#1f2937" font-weight="700">${label}</text>`;
}

export function getBoltSVGString(): string {
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

  return `<svg viewBox="0 0 620 260" xmlns="http://www.w3.org/2000/svg" width="420" height="176" style="display:block;max-width:100%;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;">
  <line x1="90" y1="132" x2="530" y2="132" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1"/>

  <polygon points="214,98 248,98 259,112 259,152 248,166 214,166 203,152 203,112" fill="#94a3b8" stroke="#334155" stroke-width="1.4"/>
  <rect x="248" y="120" width="166" height="24" fill="#64748b" stroke="#334155" stroke-width="1"/>

  <rect x="248" y="92" width="70" height="80" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.3"/>

  <rect x="318" y="96" width="12" height="72" fill="#cbd5e1" stroke="#334155" stroke-width="1.2"/>
  <rect x="330" y="100" width="12" height="64" fill="#e2e8f0" stroke="#334155" stroke-dasharray="4 2" stroke-width="1.2"/>

  <polygon points="342,104 394,104 402,114 402,150 394,160 342,160" fill="#a3b8cf" stroke="#334155" stroke-width="1.3"/>

  <line x1="394" y1="120" x2="394" y2="144" stroke="#cbd5e1" stroke-width="1.1"/>
  <line x1="399" y1="120" x2="399" y2="144" stroke="#cbd5e1" stroke-width="1.1"/>
  <line x1="404" y1="120" x2="404" y2="144" stroke="#cbd5e1" stroke-width="1.1"/>
  <line x1="409" y1="120" x2="409" y2="144" stroke="#cbd5e1" stroke-width="1.1"/>
  <line x1="414" y1="120" x2="414" y2="144" stroke="#cbd5e1" stroke-width="1.1"/>

  <text x="231" y="88" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">ボルト</text>
  <text x="283" y="88" text-anchor="middle" font-size="12" fill="#1d4ed8" font-weight="700">締結体</text>

  <text x="306" y="64" text-anchor="end" font-size="11" fill="#334155" font-weight="700">平座金</text>
  <line x1="307" y1="68" x2="324" y2="96" stroke="#334155" stroke-width="1"/>

  <text x="352" y="64" text-anchor="start" font-size="11" fill="#334155" font-weight="700">ばね座金</text>
  <line x1="354" y1="68" x2="336" y2="100" stroke="#334155" stroke-width="1"/>

  <text x="368" y="96" text-anchor="middle" font-size="12" fill="#334155" font-weight="700">ナット</text>

  ${hdim(shankX1, tipX2, 34, 'L_required（首下長さ）')}

  ${hdim(plateX1, plateX2, 212, 't')}
  ${hdim(nutX1, nutX2, 212, 'Hnut')}
  ${hdim(tipX1, tipX2, 212, '>3p')}

  <line x1="${pwX1}" y1="212" x2="${pwX2}" y2="212" stroke="#334155" stroke-width="1"/>
  <line x1="${pwX1}" y1="208" x2="${pwX1}" y2="216" stroke="#334155" stroke-width="1"/>
  <line x1="${pwX2}" y1="208" x2="${pwX2}" y2="216" stroke="#334155" stroke-width="1"/>
  <text x="308" y="198" text-anchor="middle" font-size="12" fill="#1f2937" font-weight="700">Hpw</text>
  <line x1="312" y1="201" x2="324" y2="209" stroke="#334155" stroke-width="1"/>

  <line x1="${swX1}" y1="212" x2="${swX2}" y2="212" stroke="#334155" stroke-width="1"/>
  <line x1="${swX1}" y1="208" x2="${swX1}" y2="216" stroke="#334155" stroke-width="1"/>
  <line x1="${swX2}" y1="208" x2="${swX2}" y2="216" stroke="#334155" stroke-width="1"/>
  <text x="354" y="198" text-anchor="middle" font-size="12" fill="#1f2937" font-weight="700">Hsw</text>
  <line x1="350" y1="201" x2="336" y2="209" stroke="#334155" stroke-width="1"/>
  </svg>`;
}

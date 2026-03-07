export interface ToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  available: boolean;
  category: string;
  keywords: string[];
  relatedArticleSlugs: string[];
  diagramKey: string;
}

export const TOOLS: ToolItem[] = [
  {
    id: 'bolt-length',
    title: 'ボルト長さ計算',
    desc: 'ナット・座金の組み合わせから必要なボルト長さと推奨購入長さを計算します。',
    href: '/tools/bolt-length',
    available: true,
    category: 'ねじ・締結',
    keywords: ['ボルト', 'ナット', '座金', 'ピッチ', '3山'],
    relatedArticleSlugs: [
      'coarse-thread',
      'washer-role',
      'three-threads',
      'nut-basics',
      'grip-length-basics',
      'bolt-strength-class-selection',
    ],
    diagramKey: 'bolt-length',
  },
  {
    id: 'beam',
    title: '単純梁（単純支持）計算',
    desc: '曲げ応力・最大たわみを計算し OK/NG 判定。中央集中荷重・等分布荷重に対応。',
    href: '/tools/beams/simple-supported',
    available: true,
    category: '梁・断面',
    keywords: ['単純梁', 'たわみ', '曲げ応力', '断面係数', '断面二次モーメント'],
    relatedArticleSlugs: [
      'simple-beam-reaction-basics',
      'uniform-load-basics',
      'point-vs-uniform-load',
      'beam-self-weight-calculation',
      'section-modulus-basics',
      'allowable-stress-basics',
      'deflection-limit-l-over-n',
      'h-beam-vs-channel-selection',
    ],
    diagramKey: 'simple-supported',
  },
  {
    id: 'section-properties',
    title: '断面性能計算',
    desc: 'H形鋼・角形鋼管・丸形鋼管など6断面形状の断面二次モーメント・断面係数・断面積・重量を計算します。',
    href: '/tools/section-properties',
    available: true,
    category: '梁・断面',
    keywords: ['断面二次モーメント', '断面係数', '断面積', '重量', 'H形鋼'],
    relatedArticleSlugs: [
      'section-modulus-basics',
      'moment-of-inertia-basics',
      'h-beam-size-reading',
      'square-tube-strength-basics',
      'round-vs-square-tube-selection',
      'c-channel-vs-light-gauge-selection',
      'h-beam-vs-channel-selection',
      'steel-material-properties',
    ],
    diagramKey: 'section-properties',
  },
  {
    id: 'cantilever',
    title: '片持ち梁（カンチレバー）計算',
    desc: '固定端・自由端の片持ち梁に対して、集中荷重・等分布荷重の曲げ応力・たわみを計算します。',
    href: '/tools/beams/cantilever',
    available: true,
    category: '梁・断面',
    keywords: ['片持ち梁', 'カンチレバー', 'たわみ', '曲げ応力', '固定端'],
    relatedArticleSlugs: [
      'cantilever-beam-basics',
      'moment-of-inertia-basics',
      'youngs-modulus-basics',
      'allowable-stress-basics',
      'deflection-limit-l-over-n',
    ],
    diagramKey: 'cantilever',
  },
  {
    id: 'steel-weight',
    title: '鋼材重量計算',
    desc: '平板・丸棒・角棒・丸パイプ・角パイプの重量を計算し、明細テーブルで合計重量を管理します。',
    href: '/tools/steel-weight',
    available: true,
    category: '材料・重量',
    keywords: ['鋼材', '重量', '自重', '密度', '材料拾い', 'kg'],
    relatedArticleSlugs: [
      'steel-weight-calculation-basics',
      'beam-self-weight-calculation',
      'steel-material-properties',
      'allowable-stress-basics',
    ],
    diagramKey: 'steel-weight',
  },
  {
    id: 'bolt-strength',
    title: 'ボルト引張・せん断耐力計算',
    desc: '締結用ボルトの許容引張耐力・許容せん断耐力を即時計算。強度区分4.8/8.8/10.9、M6〜M24対応。',
    href: '/tools/bolt-strength',
    available: true,
    category: 'ねじ・締結',
    keywords: ['ボルト', '引張耐力', 'せん断耐力', '強度区分', '相互作用'],
    relatedArticleSlugs: [
      'bolt-strength-class-selection',
      'bolt-shear-strength-basics',
      'bolt-tensile-strength-basics',
      'allowable-shear-stress-basics',
      'allowable-stress-basics',
      'nut-basics',
    ],
    diagramKey: 'bolt-strength',
  },
  {
    id: 'anchor',
    title: 'アンカーボルト強度計算',
    desc: 'アンカーボルトの引張・せん断強度を試算します。',
    href: '#',
    available: false,
    category: 'ねじ・締結',
    keywords: ['アンカーボルト', '引張強度', 'せん断強度'],
    relatedArticleSlugs: [
      'anchor-bolt-selection-basics',
      'chemical-vs-mechanical-anchor',
      'anchor-edge-distance-basics',
    ],
    diagramKey: 'anchor',
  },
  {
    id: 'unit',
    title: '単位換算ツール',
    desc: 'mm↔inch、N↔kgf など建設・機械系でよく使う単位を変換します。',
    href: '#',
    available: false,
    category: '基礎計算',
    keywords: ['単位換算', 'mm', 'inch', 'N', 'kgf'],
    relatedArticleSlugs: ['n-vs-kgf-basics'],
    diagramKey: 'unit',
  },
];

export function getToolById(id: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolByHref(href: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.href === href);
}

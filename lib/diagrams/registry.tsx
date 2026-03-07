import type { CSSProperties, ComponentType } from 'react';
import { AllowableStressBasicsSvg } from './articles/allowable-stress-basics';
import { BeamDeflectionFormulaSvg } from './articles/beam-deflection-formula';
import { BoltStrengthClassSelectionSvg } from './articles/bolt-strength-class-selection';
import { BoltStrengthClassSvg } from './articles/bolt-strength-class';
import { CantileverBeamBasicsSvg } from './articles/cantilever-beam-basics';
import { CoarseThreadSvg } from './articles/coarse-thread';
import { DeflectionLimitLOverNSvg } from './articles/deflection-limit-l-over-n';
import { GripLengthBasicsSvg } from './articles/grip-length-basics';
import { HBeamVsChannelSelectionSvg } from './articles/h-beam-vs-channel-selection';
import { MomentOfInertiaBasicsSvg } from './articles/moment-of-inertia-basics';
import { NutBasicsSvg } from './articles/nut-basics';
import { SectionModulusBasicsSvg } from './articles/section-modulus-basics';
import { SimpleBeamReactionBasicsSvg } from './articles/simple-beam-reaction-basics';
import { SteelMaterialPropertiesSvg } from './articles/steel-material-properties';
import { TemplateDiagramSvg } from './articles/template-diagram';
import { ThreeThreadsSvg } from './articles/three-threads';
import { TubeSectionWeightComparisonSvg } from './articles/tube-section-weight-comparison';
import { WasherRoleSvg } from './articles/washer-role';
import { AnchorSvg } from './tools/anchor';
import { SimpleSupportedSvg } from './tools/simple-supported';
import { BoltLengthSvg, type BoltLengthSvgProps } from './tools/bolt-length';
import { BoltStrengthSvg } from './tools/bolt-strength';
import { CantileverSvg } from './tools/cantilever';
import { SectionPropertiesSvg } from './tools/section-properties';
import { SteelWeightSvg } from './tools/steel-weight';
import { UnitSvg } from './tools/unit';

export interface DiagramProps extends BoltLengthSvgProps {
  diagramKey: string;
  kind?: 'article' | 'tool';
}

type DiagramComponent = ComponentType<BoltLengthSvgProps>;

const FRAME_COLORS = {
  fill: '#f8fafc',
  stroke: '#cbd5e1',
} as const;

function buildFrameStyle(options: Pick<BoltLengthSvgProps, 'maxWidth' | 'framed'>): CSSProperties {
  return {
    display: 'block',
    maxWidth: options.maxWidth !== undefined ? `${options.maxWidth}px` : '100%',
    ...(options.framed === false
      ? null
      : {
          background: FRAME_COLORS.fill,
          border: `1px solid ${FRAME_COLORS.stroke}`,
          borderRadius: '6px',
        }),
  };
}

function BeamSketch({
  width = 240,
  height = 140,
  maxWidth,
  ariaLabel = '梁の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: BoltLengthSvgProps) {
  return (
    <svg
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildFrameStyle({ maxWidth, framed })}
    >
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#eff6ff" />
      <rect x="36" y="66" width="168" height="12" rx="5" fill="#2563eb" />
      <polygon points="44,78 32,96 56,96" fill="#334155" />
      <polygon points="196,78 184,96 208,96" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="196" cy="101" r="4" fill="none" stroke="#334155" strokeWidth="2" />
      <line x1="120" y1="36" x2="120" y2="62" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="120,69 114,60 126,60" fill="#dc2626" />
      <line x1="44" y1="112" x2="196" y2="112" stroke="#475569" strokeWidth="1.2" />
      <text x="120" y="126" textAnchor="middle" fontSize="11" fill="#334155">L</text>
    </svg>
  );
}

function SectionSketch({
  width = 240,
  height = 140,
  maxWidth,
  ariaLabel = '断面の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: BoltLengthSvgProps) {
  return (
    <svg
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildFrameStyle({ maxWidth, framed })}
    >
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f8fafc" />
      <rect x="60" y="30" width="120" height="16" rx="4" fill="#334155" />
      <rect x="110" y="46" width="20" height="48" fill="#334155" />
      <rect x="60" y="94" width="120" height="16" rx="4" fill="#334155" />
      <line x1="40" y1="70" x2="200" y2="70" stroke="#2563eb" strokeDasharray="5 4" />
      <line x1="58" y1="22" x2="182" y2="22" stroke="#64748b" />
      <line x1="58" y1="22" x2="58" y2="28" stroke="#64748b" />
      <line x1="182" y1="22" x2="182" y2="28" stroke="#64748b" />
      <text x="120" y="18" textAnchor="middle" fontSize="11" fill="#475569">B</text>
    </svg>
  );
}

function GenericSketch({
  width = 240,
  height = 140,
  maxWidth,
  ariaLabel = '記事の概略図',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: BoltLengthSvgProps) {
  return (
    <svg
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildFrameStyle({ maxWidth, framed })}
    >
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f1f5f9" />
      <rect x="30" y="26" width="180" height="88" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <line x1="45" y1="50" x2="195" y2="50" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="68" x2="170" y2="68" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="86" x2="155" y2="86" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

const TOOL_DIAGRAMS: Record<string, DiagramComponent> = {
  'bolt-length': BoltLengthSvg,
  'simple-supported': SimpleSupportedSvg,
  cantilever: CantileverSvg,
  'section-properties': SectionPropertiesSvg,
  'bolt-strength': BoltStrengthSvg,
  'steel-weight': SteelWeightSvg,
  anchor: AnchorSvg,
  unit: UnitSvg,
};

const ARTICLE_DIAGRAMS: Record<string, DiagramComponent> = {
  'allowable-stress-basics': AllowableStressBasicsSvg,
  'beam-deflection-formula': BeamDeflectionFormulaSvg,
  'bolt-strength-class-selection': BoltStrengthClassSelectionSvg,
  'bolt-strength-class': BoltStrengthClassSvg,
  'cantilever-beam-basics': CantileverBeamBasicsSvg,
  'coarse-thread': CoarseThreadSvg,
  'deflection-limit-l-over-n': DeflectionLimitLOverNSvg,
  'grip-length-basics': GripLengthBasicsSvg,
  'h-beam-vs-channel-selection': HBeamVsChannelSelectionSvg,
  'moment-of-inertia-basics': MomentOfInertiaBasicsSvg,
  'nut-basics': NutBasicsSvg,
  'section-modulus-basics': SectionModulusBasicsSvg,
  'simple-beam-reaction-basics': SimpleBeamReactionBasicsSvg,
  'steel-material-properties': SteelMaterialPropertiesSvg,
  'template-diagram': TemplateDiagramSvg,
  'three-threads': ThreeThreadsSvg,
  'tube-section-weight-comparison': TubeSectionWeightComparisonSvg,
  'washer-role': WasherRoleSvg,
};

function resolveToolFallbackDiagram(diagramKey: string): DiagramComponent {
  const key = diagramKey.toLowerCase();
  if (key.includes('bolt')) return BoltLengthSvg;
  if (key.includes('beam') || key.includes('cantilever') || key.includes('deflection')) return BeamSketch;
  if (key.includes('section') || key.includes('steel') || key.includes('tube')) return SectionSketch;
  return GenericSketch;
}

function resolveArticleFallbackDiagram(diagramKey: string): DiagramComponent {
  const key = diagramKey.toLowerCase();
  if (key.includes('beam') || key.includes('deflection') || key.includes('cantilever')) return BeamSketch;
  if (key.includes('section') || key.includes('modulus') || key.includes('inertia') || key.includes('tube')) return SectionSketch;
  return GenericSketch;
}

export function getDiagramComponent(kind: 'article' | 'tool', diagramKey: string): DiagramComponent {
  if (kind === 'tool') {
    return TOOL_DIAGRAMS[diagramKey] ?? resolveToolFallbackDiagram(diagramKey);
  }
  return ARTICLE_DIAGRAMS[diagramKey] ?? resolveArticleFallbackDiagram(diagramKey);
}

export function DiagramRenderer({ diagramKey, kind = 'article', ...props }: DiagramProps) {
  const DiagramComponent = getDiagramComponent(kind, diagramKey);
  return <DiagramComponent {...props} />;
}

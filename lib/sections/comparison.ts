import {
  calcSection,
  validateSectionDims,
  type SectionShape,
  type SectionResult,
} from '@/lib/beams/sections';

export interface SectionComparisonInputItem {
  id: string;
  shape: SectionShape;
  dims: Record<string, number>;
}

export interface SectionComparisonRow {
  id: string;
  shape: SectionShape;
  shapeLabel: string;
  section: SectionResult;
  efficiency_Z_over_A: number;
}

export function compareSections(
  items: SectionComparisonInputItem[],
  resolveShapeLabel: (shape: SectionShape) => string,
): {
  rows: SectionComparisonRow[];
  bestId: string | null;
  errors: Record<string, string[]>;
} {
  const rows: SectionComparisonRow[] = [];
  const errors: Record<string, string[]> = {};

  for (const item of items) {
    const itemErrors = validateSectionDims(item.shape, item.dims);
    if (itemErrors.length > 0) {
      errors[item.id] = itemErrors;
      continue;
    }
    const section = calcSection(item.shape, item.dims);
    if (!section) {
      errors[item.id] = ['断面性能を計算できませんでした。'];
      continue;
    }
    rows.push({
      id: item.id,
      shape: item.shape,
      shapeLabel: resolveShapeLabel(item.shape),
      section,
      efficiency_Z_over_A: section.Z_mm3 / section.area_mm2,
    });
  }

  let bestId: string | null = null;
  if (rows.length > 0) {
    bestId = rows.reduce((best, row) => (row.efficiency_Z_over_A > best.efficiency_Z_over_A ? row : best)).id;
  }

  return { rows, bestId, errors };
}

import fs from 'node:fs/promises';
import path from 'node:path';
import { calculateDemandScore, type DemandScoreInput } from '../lib/demand/score.ts';

interface CsvRow {
  candidateId: string;
  impressions: number;
  ctr: number;
  avgPosition: number;
  practicality: number;
  sourceCoverage: number;
}

function parseNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseCsv(input: string): CsvRow[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [];

  const [header, ...rows] = lines;
  const cols = header.split(',').map((c) => c.trim());
  const idx = (key: string) => cols.indexOf(key);

  return rows.map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    return {
      candidateId: cells[idx('candidateId')] ?? '',
      impressions: parseNumber(cells[idx('impressions')] ?? '0'),
      ctr: parseNumber(cells[idx('ctr')] ?? '0'),
      avgPosition: parseNumber(cells[idx('avgPosition')] ?? '0'),
      practicality: parseNumber(cells[idx('practicality')] ?? '0'),
      sourceCoverage: parseNumber(cells[idx('sourceCoverage')] ?? '0'),
    };
  });
}

function toInput(row: CsvRow): DemandScoreInput {
  return {
    candidateId: row.candidateId,
    impressions: row.impressions,
    ctr: row.ctr,
    avgPosition: row.avgPosition,
    practicality: row.practicality,
    sourceCoverage: row.sourceCoverage,
  };
}

async function main() {
  const csvPath = path.join(process.cwd(), 'content/demand/gsc_90d.csv');
  const content = await fs.readFile(csvPath, 'utf8');
  const rows = parseCsv(content);

  const report = rows
    .map((row) => ({
      candidateId: row.candidateId,
      ...calculateDemandScore(toInput(row)),
    }))
    .sort((a, b) => b.total - a.total);

  console.table(report);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

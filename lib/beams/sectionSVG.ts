/**
 * Pure SVG string generators for cross-section diagrams.
 * Used for embedding in HTML print reports.
 *
 * Shows only schematic parameter labels and intermediate dimension identifiers
 * (hw, di, hi/bi, yc, xc). Numerical values are NOT shown inside the SVG.
 */

import type { SectionShape } from './sections';

// ─── Shared constants ─────────────────────────────────────────────────────────

const FILL   = '#dde3ed';
const STROKE = '#1e3a5f';
const SW     = 1.8;
const DIM    = '#4b5563';
const LABEL  = '#111827';
const AXIS_C = '#2563eb';
const LOAD_C = '#dc2626';
const ANN_C  = '#6d28d9';   // intermediate dim label color
const FS     = 12;
const FSS    = 10;

// ─── SVG element helpers ──────────────────────────────────────────────────────

function hdim(x1: number, x2: number, y: number, label: string): string {
  const mx = (x1 + x2) / 2;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${DIM}" stroke-width="0.8"/>
  <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="${DIM}" stroke-width="0.8"/>
  <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="${DIM}" stroke-width="0.8"/>
  <text x="${mx}" y="${y - 5}" text-anchor="middle" font-size="${FS}" font-weight="700" fill="${LABEL}">${label}</text>`;
}

function vdim(x: number, y1: number, y2: number, label: string): string {
  const my = (y1 + y2) / 2;
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${DIM}" stroke-width="0.8"/>
  <line x1="${x - 4}" y1="${y1}" x2="${x + 4}" y2="${y1}" stroke="${DIM}" stroke-width="0.8"/>
  <line x1="${x - 4}" y1="${y2}" x2="${x + 4}" y2="${y2}" stroke="${DIM}" stroke-width="0.8"/>
  <text x="${x - 7}" y="${my + 4}" text-anchor="end" font-size="${FS}" font-weight="700" fill="${LABEL}">${label}</text>`;
}

function leader(lx: number, ly: number, text: string, anchor = 'start'): string {
  return `<text x="${lx}" y="${ly}" font-size="${FSS}" fill="${DIM}" text-anchor="${anchor}">${text}</text>`;
}

function neutAxis(y: number, x1 = 50, x2 = 230): string {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${AXIS_C}" stroke-width="1.2" stroke-dasharray="6 3"/>
  <text x="${x1 - 2}" y="${y + 4}" font-size="${FSS}" fill="${AXIS_C}" text-anchor="end" font-style="italic">x</text>
  <text x="${x2 + 2}" y="${y + 4}" font-size="${FSS}" fill="${AXIS_C}" font-style="italic">x</text>`;
}

function loadArrow(cx: number, top: number): string {
  return `<line x1="${cx}" y1="${top - 18}" x2="${cx}" y2="${top - 2}" stroke="${LOAD_C}" stroke-width="2"/>
  <polygon points="${cx - 5},${top - 2} ${cx + 5},${top - 2} ${cx},${top + 6}" fill="${LOAD_C}"/>
  <text x="${cx + 8}" y="${top - 8}" font-size="${FSS}" fill="${LOAD_C}">&#33655;&#37325;</text>`;
}

/** Formula-form annotation at bottom (no numerical values) */
function ann(y: number, text: string): string {
  return `<text x="140" y="${y}" text-anchor="middle" font-size="8.5" fill="${ANN_C}" font-family="'Courier New', Courier, monospace" font-style="italic">${text}</text>`;
}

// ─── Shape generators ─────────────────────────────────────────────────────────

function hBeamSVG(): string {
  const B = 100, H = 150, tf = 13, tw = 10;
  const lx = 90, ty = 40;
  const cx = lx + B / 2;
  const by = ty + H;
  const ny = ty + H / 2;
  const hw_s = H - 2 * tf;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="${lx}" y="${ty}" width="${B}" height="${tf}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  <rect x="${cx - tw / 2}" y="${ty + tf}" width="${tw}" height="${hw_s}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  <rect x="${lx}" y="${by - tf}" width="${B}" height="${tf}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny)}
  ${loadArrow(cx, ty)}
  ${vdim(lx - 18, ty, by, 'H')}
  ${hdim(lx, lx + B, ty - 16, 'B')}
  ${leader(lx + B + 6, ty + tf / 2 + 3, 'tf')}
  <line x1="${lx + B}" y1="${ty + tf / 2}" x2="${lx + B + 5}" y2="${ty + tf / 2}" stroke="${DIM}" stroke-width="0.7"/>
  ${leader(cx + tw / 2 + 5, ny + 3, 'tw')}
  <line x1="${cx + tw / 2}" y1="${ny}" x2="${cx + tw / 2 + 4}" y2="${ny}" stroke="${DIM}" stroke-width="0.7"/>
  <line x1="${cx - tw / 2 - 6}" y1="${ty + tf}" x2="${cx - tw / 2 - 6}" y2="${by - tf}" stroke="${ANN_C}" stroke-width="0.8" stroke-dasharray="3 2"/>
  <text x="${cx - tw / 2 - 9}" y="${ny + 4}" text-anchor="end" font-size="9" fill="${ANN_C}" font-style="italic">hw</text>
  ${ann(212, 'hw = H \u2212 2\u00d7tf')}
</svg>`;
}

function tBarSVG(): string {
  const B = 110, H = 150, tf = 16, tw = 12;
  const lx = 85, ty = 40;
  const cx = lx + B / 2;
  const by = ty + H;
  const hw = H - tf;
  const ny = ty + 58;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="${lx}" y="${ty}" width="${B}" height="${tf}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  <rect x="${cx - tw / 2}" y="${ty + tf}" width="${tw}" height="${hw}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny)}
  ${loadArrow(cx, ty)}
  ${vdim(lx - 18, ty, by, 'H')}
  ${hdim(lx, lx + B, ty - 16, 'B')}
  ${leader(lx + B + 6, ty + tf / 2 + 3, 'tf')}
  ${leader(cx + tw / 2 + 5, ty + tf + hw / 2, 'tw')}
  <line x1="${cx + tw / 2}" y1="${ty + tf + hw / 2}" x2="${cx + tw / 2 + 4}" y2="${ty + tf + hw / 2}" stroke="${DIM}" stroke-width="0.7"/>
  ${ann(212, 'hw = H − tf')}
</svg>`;
}

function rectTubeSVG(): string {
  const B = 100, H = 150, t = 13;
  const lx = 90, ty = 40;
  const cx = lx + B / 2;
  const by = ty + H;
  const ny = ty + H / 2;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="${lx}" y="${ty}" width="${B}" height="${H}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  <rect x="${lx + t}" y="${ty + t}" width="${B - 2 * t}" height="${H - 2 * t}" fill="white" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny)}
  ${loadArrow(cx, ty)}
  ${vdim(lx - 18, ty, by, 'H')}
  ${hdim(lx, lx + B, ty - 16, 'B')}
  ${leader(lx + B + 6, ty + t / 2 + 3, 't')}
  <line x1="${lx + B}" y1="${ty + t / 2}" x2="${lx + B + 5}" y2="${ty + t / 2}" stroke="${DIM}" stroke-width="0.7"/>
  ${leader(lx + t / 2 - 4, ty - 4, 't', 'middle')}
  ${ann(210, 'hi = H \u2212 2t,  bi = B \u2212 2t')}
</svg>`;
}

function circTubeSVG(): string {
  const R = 68, r = 52;
  const cx = 140, cy = 115;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(cy)}
  ${loadArrow(cx, cy - R)}
  ${hdim(cx - R, cx + R, cy + R + 18, 'D\uff08\u5916\u5f84\uff09')}
  <line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy - r}" stroke="${DIM}" stroke-width="1.5"/>
  <line x1="${cx - 5}" y1="${cy - R}" x2="${cx + 5}" y2="${cy - R}" stroke="${DIM}" stroke-width="0.8"/>
  <line x1="${cx - 5}" y1="${cy - r}" x2="${cx + 5}" y2="${cy - r}" stroke="${DIM}" stroke-width="0.8"/>
  <text x="${cx + 7}" y="${cy - R + (R - r) / 2 + 4}" font-size="${FS}" font-weight="700" fill="${LABEL}">t</text>
  <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${ANN_C}" stroke-width="0.7" stroke-dasharray="3 2"/>
  <text x="${cx + r + 5}" y="${cy + 4}" font-size="9" fill="${ANN_C}" font-style="italic">di</text>
  ${ann(215, 'di = D \u2212 2t \uff08\u5185\u5f84\uff09')}
</svg>`;
}

function roundBarSVG(): string {
  const R = 64;
  const cx = 140, cy = 115;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(cy)}
  ${loadArrow(cx, cy - R)}
  ${hdim(cx - R, cx + R, cy + R + 18, 'D（直径）')}
  ${ann(214, 'Ix = Iy = πD⁴ / 64')}
</svg>`;
}

function flatBarSVG(): string {
  const B = 80, H = 150;
  const lx = 100, ty = 40;
  const cx = lx + B / 2;
  const by = ty + H;
  const ny = ty + H / 2;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="${lx}" y="${ty}" width="${B}" height="${H}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny)}
  ${loadArrow(cx, ty)}
  ${vdim(lx - 18, ty, by, 'H')}
  ${hdim(lx, lx + B, ty - 16, 'B')}
  ${ann(212, 'Ix = B\u00d7H\u00b3/12,  Iy = H\u00d7B\u00b3/12')}
</svg>`;
}

function angleSVG(): string {
  const b = 125, t = 13;
  const ox = 70, oy = 190;
  const pts = [
    [ox, oy - b], [ox + t, oy - b], [ox + t, oy - t],
    [ox + b, oy - t], [ox + b, oy], [ox, oy],
  ].map(p => p.join(',')).join(' ');

  const yc_s = (b * b + b * t - t * t) / (2 * (2 * b - t));
  const ny = oy - yc_s;

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${pts}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny, 42, 220)}
  ${loadArrow(ox + t / 2, oy - b)}
  ${vdim(ox - 18, oy - b, oy, 'b')}
  ${hdim(ox, ox + b, oy + 16, 'b')}
  ${hdim(ox, ox + t, oy - b / 2, 't')}
  <line x1="${ox - 5}" y1="${ny}" x2="${ox}" y2="${ny}" stroke="${ANN_C}" stroke-width="0.8"/>
  <text x="${ox - 7}" y="${ny + 3}" text-anchor="end" font-size="8.5" fill="${ANN_C}" font-style="italic">yc</text>
  ${ann(210, 'yc = (b\u00b2+bt\u2212t\u00b2) / (2(2b\u2212t))')}
</svg>`;
}

function channelSVG(): string {
  const H = 150, B = 75, tw = 10, tf = 13;
  const ox = 90, ty = 40;
  const by = ty + H;
  const cx_shape = ox + B / 2;
  const ny = ty + H / 2;

  const pts = [
    [ox, ty], [ox + B, ty], [ox + B, ty + tf], [ox + tw, ty + tf],
    [ox + tw, by - tf], [ox + B, by - tf], [ox + B, by], [ox, by],
  ].map(p => p.join(',')).join(' ');

  return `<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${pts}" fill="${FILL}" stroke="${STROKE}" stroke-width="${SW}"/>
  ${neutAxis(ny)}
  ${loadArrow(cx_shape, ty)}
  ${vdim(ox - 18, ty, by, 'H')}
  ${hdim(ox, ox + B, ty - 16, 'B')}
  ${leader(ox + B + 6, ty + tf / 2 + 3, 'tf')}
  <line x1="${ox + B}" y1="${ty + tf / 2}" x2="${ox + B + 5}" y2="${ty + tf / 2}" stroke="${DIM}" stroke-width="0.7"/>
  ${leader(ox + tw / 2 - 4, ny - 4, 'tw', 'middle')}
  <line x1="${ox - 5}" y1="${ty + tf}" x2="${ox}" y2="${ty + tf}" stroke="${ANN_C}" stroke-width="0.8"/>
  <line x1="${ox - 5}" y1="${by - tf}" x2="${ox}" y2="${by - tf}" stroke="${ANN_C}" stroke-width="0.8"/>
  <line x1="${ox - 4}" y1="${ty + tf}" x2="${ox - 4}" y2="${by - tf}" stroke="${ANN_C}" stroke-width="0.8" stroke-dasharray="3 2"/>
  <text x="${ox - 7}" y="${ny + 3}" text-anchor="end" font-size="8.5" fill="${ANN_C}" font-style="italic">hw</text>
  ${ann(212, 'hw = H \u2212 2\u00d7tf,  xc = (B\u00b2tf + hw\u00b7tw\u00b2/2) / A')}
</svg>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getSectionSVGString(shape: SectionShape): string {
  switch (shape) {
    case 'H':         return hBeamSVG();
    case 't-bar':     return tBarSVG();
    case 'rect-tube': return rectTubeSVG();
    case 'circ-tube': return circTubeSVG();
    case 'round-bar': return roundBarSVG();
    case 'flat':      return flatBarSVG();
    case 'angle':     return angleSVG();
    case 'channel':   return channelSVG();
    default:          return hBeamSVG();
  }
}

import { FAMILIES, LINEAGE_NODES, type LineageNode } from "@/data/lineage";

/**
 * Deterministic descent-chart layout: x is the founding year, y is a row packed
 * inside the node's family band so nothing overlaps. No layout engine, no
 * randomness — the chart looks the same on every build.
 */

export const AXIS_MIN = 1993;
export const AXIS_MAX = 2026;
export const PLOT_LEFT = 96;
export const PLOT_RIGHT = 1180;
export const CHART_WIDTH = 1300;
export const NODE_W = 106;
export const NODE_H = 24;
export const ROW_H = 40;
export const BAND_HEAD = 26;
export const BAND_PAD = 16;
export const TOP = 62;

export function xFor(year: number): number {
  const clamped = Math.min(Math.max(year, AXIS_MIN), AXIS_MAX);
  const t = (clamped - AXIS_MIN) / (AXIS_MAX - AXIS_MIN);
  return Math.round(PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT));
}

export interface PlacedNode extends LineageNode {
  x: number;
  y: number;
  /** True when the founding year predates the axis and it sits in the gutter. */
  offChart: boolean;
}

export interface PlacedBand {
  id: string;
  name: string;
  blurb: string;
  top: number;
  height: number;
}

export interface Layout {
  nodes: PlacedNode[];
  bands: PlacedBand[];
  height: number;
}

export const LAYOUT: Layout = (() => {
  const nodes: PlacedNode[] = [];
  const bands: PlacedBand[] = [];
  let cursor = TOP;

  for (const family of FAMILIES) {
    const members = LINEAGE_NODES.filter((n) => n.family === family.id).sort(
      (a, b) => a.year - b.year || a.name.localeCompare(b.name),
    );
    // Greedy row packing: first row whose last box ends before this one starts.
    const rowEnds: number[] = [];
    const bandTop = cursor + BAND_HEAD;

    for (const node of members) {
      const offChart = node.year < AXIS_MIN;
      const x = offChart ? 18 : xFor(node.year);
      let row = rowEnds.findIndex((end) => x - end >= 12);
      if (row === -1) {
        row = rowEnds.length;
        rowEnds.push(0);
      }
      rowEnds[row] = x + NODE_W;
      nodes.push({ ...node, x, y: bandTop + row * ROW_H, offChart });
    }

    const height = Math.max(1, rowEnds.length) * ROW_H;
    bands.push({ ...family, top: cursor, height: height + BAND_HEAD });
    cursor = bandTop + height + BAND_PAD;
  }

  return { nodes, bands, height: cursor + 18 };
})();

export const PLACED_BY_SLUG = new Map(LAYOUT.nodes.map((n) => [n.slug, n]));

/** Year ticks, every other year, plus both ends. */
export const TICKS: number[] = (() => {
  const out: number[] = [];
  for (let y = AXIS_MIN + 1; y <= AXIS_MAX; y += 3) out.push(y);
  return out;
})();

export interface EdgePath {
  d: string;
  /** Midpoint, for the hit area. */
  mx: number;
  my: number;
}

/** Cubic elbow between two boxes, entering from whichever side is closer. */
export function pathBetween(from: PlacedNode, to: PlacedNode): EdgePath {
  const forward = to.x >= from.x;
  const sx = forward ? from.x + NODE_W : from.x;
  const tx = forward ? to.x : to.x + NODE_W;
  const sy = from.y + NODE_H / 2;
  const ty = to.y + NODE_H / 2;
  const span = Math.max(34, Math.abs(tx - sx) / 2.3);
  const c1 = forward ? sx + span : sx - span;
  const c2 = forward ? tx - span : tx + span;
  return {
    d: `M ${sx} ${sy} C ${c1} ${sy}, ${c2} ${ty}, ${tx} ${ty}`,
    mx: (sx + tx) / 2,
    my: (sy + ty) / 2,
  };
}

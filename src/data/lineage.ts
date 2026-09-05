import { LINEAGE_EDGES } from "./lineage-edges";
import { LINEAGE_NODES } from "./lineage-nodes";
import {
  EDGE_STYLES,
  FAMILIES,
  edgeStyle,
  type EdgeKind,
  type LineageEdge,
  type LineageNode,
} from "./lineage-types";

export { EDGE_STYLES, FAMILIES, LINEAGE_EDGES, LINEAGE_NODES, edgeStyle };
export type { EdgeKind, LineageEdge, LineageNode };

export const NODE_BY_SLUG = new Map(LINEAGE_NODES.map((n) => [n.slug, n]));

export function nodeName(slug: string): string {
  return NODE_BY_SLUG.get(slug)?.name ?? slug;
}

/** Edges touching a node, in either direction. */
export function edgesFor(slug: string): LineageEdge[] {
  return LINEAGE_EDGES.filter((e) => e.from === slug || e.to === slug);
}

const adjacency = (() => {
  const map = new Map<string, string[]>();
  for (const e of LINEAGE_EDGES) {
    map.set(e.from, [...(map.get(e.from) ?? []), e.to]);
    map.set(e.to, [...(map.get(e.to) ?? []), e.from]);
  }
  return map;
})();

/** Everything reachable from a node, following lines in either direction. */
export function chainFrom(slug: string): Set<string> {
  const seen = new Set<string>([slug]);
  const queue = [slug];
  while (queue.length) {
    for (const next of adjacency.get(queue.shift()!) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}

/** Connected groups, largest first — used for the "longest line" stat. */
export const CHAINS: string[][] = (() => {
  const done = new Set<string>();
  const out: string[][] = [];
  for (const n of LINEAGE_NODES) {
    if (done.has(n.slug)) continue;
    const chain = chainFrom(n.slug);
    chain.forEach((s) => done.add(s));
    if (chain.size > 1) out.push([...chain]);
  }
  return out.sort((a, b) => b.length - a.length);
})();

export const LINKED_COUNT = LINEAGE_NODES.filter((n) => edgesFor(n.slug).length > 0).length;
export const CONTEXT_COUNT = LINEAGE_NODES.filter((n) => !n.inHoldings).length;

export const EDGES_BY_KIND = EDGE_STYLES.map((style) => ({
  style,
  edges: LINEAGE_EDGES.filter((e) => e.kind === style.id),
}));

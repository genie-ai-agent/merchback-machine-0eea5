/**
 * Descent chart vocabulary. Every edge in this dataset is a documented,
 * publicly reported relationship — no inferred lineage, no vibes.
 */

export type EdgeKind = "founder" | "alumni" | "spinout" | "acquired" | "batch" | "capital";

export interface EdgeStyle {
  id: EdgeKind;
  label: string;
  gloss: string;
  color: string;
  width: number;
  dash?: string;
}

export const EDGE_STYLES: EdgeStyle[] = [
  {
    id: "founder",
    label: "Same hands",
    gloss: "One founder, two companies",
    color: "#1b1a17",
    width: 2.1,
  },
  {
    id: "alumni",
    label: "Alumni",
    gloss: "Founders came out of the earlier company",
    color: "#4a463d",
    width: 1.2,
    dash: "5 3",
  },
  {
    id: "spinout",
    label: "Spun out",
    gloss: "Split off, open-sourced, or renamed into its own thing",
    color: "#1d6f6f",
    width: 2.1,
  },
  {
    id: "acquired",
    label: "Acquired",
    gloss: "Bought, and pointed at the buyer",
    color: "#b03a20",
    width: 1.7,
    dash: "7 4",
  },
  {
    id: "batch",
    label: "Same batch",
    gloss: "Went through Y Combinator",
    color: "#7d776a",
    width: 1.4,
    dash: "1 3",
  },
  {
    id: "capital",
    label: "Wrote the cheque",
    gloss: "Funded the later company",
    color: "#a98b1f",
    width: 1.6,
    dash: "2 2",
  },
];

export function edgeStyle(kind: EdgeKind): EdgeStyle {
  return EDGE_STYLES.find((e) => e.id === kind) ?? EDGE_STYLES[0]!;
}

export interface Family {
  id: string;
  name: string;
  blurb: string;
}

export const FAMILIES: Family[] = [
  { id: "open-web", name: "The open web", blurb: "Browsers, licences, runtimes." },
  { id: "search-social", name: "Search & social", blurb: "Feeds, links, follows." },
  { id: "payments", name: "Payments & the PayPal line", blurb: "Money moving, and the people it funded." },
  { id: "infra", name: "Servers, clouds, databases", blurb: "The part nobody wears to a party." },
  { id: "tools", name: "Tools & studios", blurb: "Software for making software." },
  { id: "models", name: "The model era", blurb: "2015 onward." },
];

export interface LineageNode {
  /** Matches `companySlug` in the collection when `inHoldings` is true. */
  slug: string;
  name: string;
  /** Founding year, used for the x position. */
  year: number;
  /** Printed instead of `year` when the founding date isn't the point. */
  yearLabel?: string;
  family: string;
  /** False = context node: connective tissue, no merch in the archive. */
  inHoldings: boolean;
  /** One line on why it's on the chart. */
  note?: string;
  /** How it ended, when it ended. */
  fate?: string;
}

export interface LineageEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  note: string;
}

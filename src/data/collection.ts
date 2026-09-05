import { EARLY } from "./artifacts-early";
import { MODERN } from "./artifacts-modern";
import { OBJECT_TYPES, WINGS, type Artifact, type ObjectType, type Wing } from "./types";

export { OBJECT_TYPES, WINGS };
export type { Artifact, ObjectType, Wing };

export const ALL: Artifact[] = [...EARLY, ...MODERN].sort(
  (a, b) => a.year - b.year || a.company.localeCompare(b.company) || a.name.localeCompare(b.name),
);

export const FIRST_YEAR = ALL[0]!.year;
export const LAST_YEAR = ALL[ALL.length - 1]!.year;
export const CATALOGUE_UPDATED = "2026-09-04";

/** Accession numbers: MBM-1995.001, stable because ALL is deterministically sorted. */
const accessionMap = new Map<string, string>();
{
  const perYear = new Map<number, number>();
  for (const a of ALL) {
    const n = (perYear.get(a.year) ?? 0) + 1;
    perYear.set(a.year, n);
    accessionMap.set(a.id, `MBM-${a.year}.${String(n).padStart(3, "0")}`);
  }
}

export function accession(a: Artifact | string): string {
  const id = typeof a === "string" ? a : a.id;
  return accessionMap.get(id) ?? "MBM-—";
}

export interface YearBar {
  year: number;
  count: number;
  items: Artifact[];
}

/** Every year in range, including empty ones — the timeline needs the gaps. */
export const YEAR_BARS: YearBar[] = (() => {
  const bars: YearBar[] = [];
  for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
    const items = ALL.filter((a) => a.year === y);
    bars.push({ year: y, count: items.length, items });
  }
  return bars;
})();

export const MAX_YEAR_COUNT = Math.max(...YEAR_BARS.map((b) => b.count));
export const YEARS_WITH_HOLDINGS = YEAR_BARS.filter((b) => b.count > 0).map((b) => b.year);

export interface CompanyRecord {
  slug: string;
  name: string;
  count: number;
  firstYear: number;
  lastYear: number;
  ink: string;
  base: string;
  items: Artifact[];
}

export const COMPANIES: CompanyRecord[] = (() => {
  const map = new Map<string, Artifact[]>();
  for (const a of ALL) {
    const list = map.get(a.companySlug) ?? [];
    list.push(a);
    map.set(a.companySlug, list);
  }
  return [...map.entries()]
    .map(([slug, items]) => ({
      slug,
      name: items[0]!.company,
      count: items.length,
      firstYear: Math.min(...items.map((i) => i.year)),
      lastYear: Math.max(...items.map((i) => i.year)),
      ink: items[0]!.ink,
      base: items[0]!.base,
      items,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

export const TYPE_COUNTS = OBJECT_TYPES.map((t) => ({
  ...t,
  count: ALL.filter((a) => a.type === t.id).length,
})).filter((t) => t.count > 0);

export function typeLabel(t: ObjectType): string {
  return OBJECT_TYPES.find((o) => o.id === t)?.label ?? t;
}

export function wingFor(year: number): Wing {
  return WINGS.find((w) => year >= w.from && year <= w.to) ?? WINGS[WINGS.length - 1]!;
}

export function byId(id: string): Artifact | undefined {
  return ALL.find((a) => a.id === id);
}

export function byYear(year: number): Artifact[] {
  return ALL.filter((a) => a.year === year);
}

export function byCompany(slug: string): Artifact[] {
  return ALL.filter((a) => a.companySlug === slug);
}

export function neighbors(id: string): { prev?: Artifact; next?: Artifact } {
  const i = ALL.findIndex((a) => a.id === id);
  if (i < 0) return {};
  return { prev: ALL[i - 1], next: ALL[i + 1] };
}

/** Curator's picks for the rotunda on the front page. */
export const FEATURED_IDS = [
  "anthropic-thinking-cap",
  "cursor-tab-key",
  "netscape-mozilla-tee",
  "aol-timewarner-merger-tee",
  "venmo-tee",
  "ifttt-argyle-socks",
  "openai-devday-token-plaque",
  "jelly-house-tee",
  "redhat-shadowman-fedora",
  "allen-co-sun-valley-vest",
];

export const FEATURED: Artifact[] = FEATURED_IDS.map((id) => byId(id)).filter(
  (a): a is Artifact => Boolean(a),
);

export const DOCUMENTED_COUNT = ALL.filter((a) => a.dating === "documented").length;

export const RARITY_LABEL: Record<Artifact["rarity"], string> = {
  common: "Widely distributed",
  uncommon: "Limited circulation",
  rare: "Scarce",
  grail: "Grail",
};

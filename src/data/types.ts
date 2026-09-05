export type ObjectType =
  | "tee"
  | "hoodie"
  | "cap"
  | "sticker"
  | "keycap"
  | "plush"
  | "socks"
  | "book"
  | "pin"
  | "tote"
  | "mug"
  | "oddity";

export const OBJECT_TYPES: { id: ObjectType; label: string; plural: string }[] = [
  { id: "tee", label: "T-shirt", plural: "T-shirts" },
  { id: "hoodie", label: "Hoodie", plural: "Hoodies" },
  { id: "cap", label: "Cap", plural: "Caps" },
  { id: "sticker", label: "Sticker", plural: "Stickers" },
  { id: "keycap", label: "Keycap", plural: "Keycaps" },
  { id: "plush", label: "Plush", plural: "Plushies" },
  { id: "socks", label: "Socks", plural: "Socks" },
  { id: "book", label: "Print", plural: "Print" },
  { id: "pin", label: "Pin", plural: "Pins" },
  { id: "tote", label: "Tote", plural: "Totes" },
  { id: "mug", label: "Drinkware", plural: "Drinkware" },
  { id: "oddity", label: "Oddity", plural: "Oddities" },
];

export type Dating = "documented" | "estimated";
export type Rarity = "common" | "uncommon" | "rare" | "grail";

export interface Artifact {
  id: string;
  name: string;
  company: string;
  companySlug: string;
  year: number;
  dating: Dating;
  type: ObjectType;
  base: string;
  ink: string;
  trim?: string;
  motif?: string;
  label: string;
  rarity: Rarity;
  tags: string[];
}

export interface Wing {
  id: string;
  name: string;
  from: number;
  to: number;
  blurb: string;
}

export const WINGS: Wing[] = [
  {
    id: "protocol",
    name: "Protocol Wing",
    from: 1994,
    to: 2001,
    blurb:
      "Browser wars, IPO tube socks, conference-booth cotton. Proof you were in the building.",
  },
  {
    id: "social",
    name: "Read/Write Wing",
    from: 2002,
    to: 2011,
    blurb:
      "Web 2.0 gloss, rounded logos, laptop-lid sticker culture. Whole identities on a 3-inch die-cut.",
  },
  {
    id: "cloud",
    name: "Cloud Wing",
    from: 2012,
    to: 2019,
    blurb:
      "Developer-relations budgets meet the sock. Swag becomes a supply chain, mascots go plush.",
  },
  {
    id: "model",
    name: "Model Wing",
    from: 2020,
    to: 2026,
    blurb:
      "Merch as status object. Small runs, no logos, one word on a washed cap.",
  },
];

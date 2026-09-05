/**
 * Desiderata: objects named by the curator that the archive cannot yet describe
 * honestly. They get an accession number once someone supplies the actual piece,
 * the year, and a photograph. Listing a want is not the same as holding one.
 */

export interface Want {
  company: string;
  /** What we are looking for, in as few words as it takes. */
  wanted: string;
  /** Why the record isn't written yet. */
  gap: string;
  /** A place to start looking. */
  lead?: { label: string; url: string };
}

export const WANTED: Want[] = [
  {
    company: "Wefunder",
    wanted: "Any issued piece: founder tee, investor hoodie, sticker",
    gap: "No public shop and no photographed drop found, so there is nothing to date or describe.",
    lead: {
      label: "wefunder.com",
      url: "https://wefunder.com",
    },
  },
  {
    company: "Discord",
    wanted: "Wumpus plush, original run",
    gap: "The current Discord shop lists Wumpus apparel and keycaps, no plush.",
    lead: {
      label: "discordmerch.com",
      url: "https://discordmerch.com/collections/all",
    },
  },
  {
    company: "Cursor",
    wanted: "Tab key, photographed",
    gap: "The shop URL now redirects to the marketing site, so the object has no live source.",
  },
];

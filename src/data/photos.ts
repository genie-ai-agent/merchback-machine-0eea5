/**
 * Photographs on loan.
 *
 * The archive ships illustrated specimen plates by default. When you have a real photo
 * you are allowed to show, do two things:
 *
 *   1. Drop the file in `public/plates/` (e.g. `public/plates/cursor-tab-key.jpg`).
 *      Keep it under ~400 KB, roughly square, and named after the artifact id.
 *   2. Add one line to PHOTOS below, keyed by that same artifact id.
 *
 * `credit` is printed under the image and `creditUrl` links back to where it came from,
 * so the record carries its own attribution. Leave an entry out and the record quietly
 * falls back to the drawn plate — nothing breaks.
 */

export interface Photo {
  /** Path under /public, e.g. "/plates/cursor-tab-key.jpg" */
  src: string;
  /** Printed under the image. Name the photographer or the shop it came from. */
  credit: string;
  /** Link back to the original page. */
  creditUrl?: string;
  /** Optional: "CC BY-SA 4.0", "press image", "used with permission". */
  license?: string;
  /** Optional alt text override. */
  alt?: string;
}

export const PHOTOS: Record<string, Photo> = {
  // "cursor-tab-key": {
  //   src: "/plates/cursor-tab-key.jpg",
  //   credit: "Photo: Cursor",
  //   creditUrl: "https://swagalogue.com/company/cursor",
  //   license: "used with permission",
  // },
};

export function photoFor(id: string): Photo | undefined {
  return PHOTOS[id];
}

export const PHOTO_COUNT = Object.keys(PHOTOS).length;

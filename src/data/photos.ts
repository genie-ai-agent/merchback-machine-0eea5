/**
 * Photographs on loan.
 *
 * A record shows a real photograph the moment there is one to show; otherwise it falls
 * back to the drawn plate, clearly marked as a drawing. To accession a photo:
 *
 *   1. Drop the file in `public/plates/`, named after the artifact id.
 *   2. Add one entry to PHOTOS below, keyed by that same id.
 *
 * `credit` prints under the image, `creditUrl` links back to where it came from, and
 * `note` is for the honest caveat: a photo of the current production run standing in
 * for an older original, a colourway that differs, a stand-in object.
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
  /** Honest caveat printed in small type under the credit. */
  note?: string;
}

export const PHOTOS: Record<string, Photo> = {
  "github-octocat-sticker": {
    src: "/plates/github-octocat-sticker.jpg",
    credit: "Photo: The GitHub Shop, \u201cMona Octocat Stickers\u201d",
    creditUrl: "https://shop.github.com/products/ghsp-0004-mona-octocat-stickers",
    license: "brand product photo",
    note: "Current shop run. The 2008 sticker sheet in the record is still undocumented.",
  },
  "figma-config-tote": {
    src: "/plates/figma-config-tote.png",
    credit: "Photo: The Figma Store, \u201cEcho tote\u201d",
    creditUrl: "https://store.figma.com/products/echo-tote",
    license: "brand product photo",
    note: "Stands in for the conference tote: same store, current run, not the Config-year bag.",
  },
  "supabase-launch-week-hoodie": {
    src: "/plates/supabase-launch-week-hoodie.png",
    credit: "Photo: supabase.store",
    creditUrl: "https://supabase.store/products/supabase-hoodie",
    license: "brand product photo",
    note: "The house hoodie as the shop lists it today; Launch Week runs differ year to year.",
  },
  "railway-conductor-cap": {
    src: "/plates/railway-conductor-cap.jpg",
    credit: "Photo: Railway Shop, \u201cFive Panel Hat\u201d",
    creditUrl: "https://shop.railway.com/products/five-panel-cap-1",
    license: "brand product photo",
    note: "Railway's current cap, photographed by the shop.",
  },
  "duolingo-duo-plush": {
    src: "/plates/duolingo-duo-plush.png",
    credit: "Photo: Duolingo Store, \u201cDuo Plushie\u201d",
    creditUrl: "https://store.duolingo.com/products/duo-plushie",
    license: "brand product photo",
  },
  "firefox-launch-tee": {
    src: "/plates/firefox-launch-tee.png",
    credit: "Photo: Mozilla Store, \u201cTail t-shirt\u201d",
    creditUrl: "https://shop.mozilla.com/products/firefox-t-shirt",
    license: "brand product photo",
    note: "Mozilla's current Firefox tee. The 2004 launch shirt in the record is still undocumented.",
  },
  "netscape-mozilla-tee": {
    src: "/plates/netscape-mozilla-tee.png",
    credit: "Photo: Mozilla Store, \u201cMozilla Dino t-shirt\u201d",
    creditUrl: "https://shop.mozilla.com/products/mozilla-dino-t-shirt",
    license: "brand product photo",
    note: "The Mozilla dinosaur as the house shop prints it today, standing in for the Netscape-era original. test",
  },
  "digitalocean-sammy-plush": {
    src: "/plates/digitalocean-sammy-plush.png",
    credit: "Photo: DigitalOcean Swag Store, \u201cSammy Plush Toy\u201d",
    creditUrl: "https://store.digitalocean.com/doswag/products",
    license: "brand product photo",
  },
  "zo-computer-tee": {
    src: "/plates/zo-computer-tee.png",
    credit: "Photo: Zo Computer store",
    creditUrl: "https://zo-computer.canarycanary.com/store",
    license: "brand product photo",
  },
};

export function photoFor(id: string): Photo | undefined {
  return PHOTOS[id];
}

export const PHOTO_COUNT = Object.keys(PHOTOS).length;

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
    note: "The Mozilla dinosaur as the house shop prints it today, standing in for the Netscape-era original.",
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
  "cursor-tab-key": {
    src: "/plates/cursor-tab-key.jpg",
    credit: "Photo: Swagalogue / Cursor swag",
    creditUrl: "https://swagalogue.com/company/cursor",
    license: "community swag photo",
    note: "Physical Tab keycap macropad with Cursor mark, as photographed for Swagalogue.",
  },
  "anthropic-thinking-cap": {
    src: "/plates/anthropic-thinking-cap.jpg",
    credit: "Photo: Swagalogue / Anthropic swag",
    creditUrl: "https://swagalogue.com/company/anthropic",
    license: "community swag photo",
    note: "Embroidered \u201cthinking\u201d caps from an Anthropic/Claude pop-up, via Swagalogue.",
  },
  "anthropic-claude-keycaps": {
    src: "/plates/anthropic-claude-keycaps.jpg",
    credit: "Photo: Swagalogue / Anthropic swag",
    creditUrl: "https://swagalogue.com/company/anthropic",
    license: "community swag photo",
    note: "Includes Anthropic artisan keycaps in a mixed AI set; not the Code with Claude conference pack specifically.",
  },
  "google-spellout-tee": {
    src: "/plates/google-spellout-tee.jpg",
    credit: "Photo: Google Merch Shop, \u201cGoogle Eco Tee White\u201d",
    creditUrl: "https://shop.merch.google/product/google-eco-tee-white-ggoegxxx2134",
    license: "brand product photo",
    note: "Current Google Merch Shop white logo tee standing in for the 1999 spell-out shirt.",
  },
  "vercel-triangle-tee": {
    src: "/plates/vercel-triangle-tee.jpg",
    credit: "Photo: Swagalogue / Vercel swag",
    creditUrl: "https://swagalogue.com/company/vercel",
    license: "community swag photo",
    note: "Flat lay including a black ▲ Vercel tee (with Next.js/Vercel mugs and quarter-zip).",
  },
  "stripe-press-hardcover": {
    src: "/plates/stripe-press-hardcover.jpg",
    credit: "Photo: Stripe Press, Scaling People",
    creditUrl: "https://press.stripe.com/scaling-people",
    license: "brand product photo",
    note: "Official Stripe Press cover art for Scaling People.",
  },
  "discord-wumpus-plush": {
    src: "/plates/discord-wumpus-plush.jpg",
    credit: "Photo: Discord Merch, \u201cJetpack Wumpus\u201d",
    creditUrl: "https://discordmerch.com/products/jetpack-wumpus",
    license: "brand product photo",
    note: "Official Discord store Jetpack Wumpus figure standing in for the classic Wumpus plush.",
  },
  "airbnb-belo-tee": {
    src: "/plates/airbnb-belo-tee.jpg",
    credit: "Photo: Swagalogue / Airbnb swag",
    creditUrl: "https://swagalogue.com/company/airbnb",
    license: "community swag photo",
    note: "Grey Bélo-logo tee (with matching hoodie) via Swagalogue; not a dated 2014 conference run.",
  },
  "mongodb-leaf-tee": {
    src: "/plates/mongodb-leaf-tee.jpg",
    credit: "Photo: Swagalogue / MongoDB swag",
    creditUrl: "https://swagalogue.com/company/mongodb",
    license: "community swag photo",
    note: "Green Bug Bounty tee with brace motif; leaf-mark conference tees differ.",
  },
  "reddit-snoo-sticker": {
    src: "/plates/reddit-snoo-sticker.jpg",
    credit: "Photo: Swagalogue / Reddit swag",
    creditUrl: "https://swagalogue.com/company/reddit",
    license: "community swag photo",
    note: "Snoo plush standing in for the sticker; the original sticker sheet is still undocumented.",
  },
  "slack-hash-socks": {
    src: "/plates/slack-hash-socks.jpg",
    credit: "Photo: Swagalogue / Slack swag",
    creditUrl: "https://swagalogue.com/company/slack",
    license: "community swag photo",
    note: "Official Slack sock drop (argyle colourway) with branded box; four-colour hash socks still undocumented.",
  },
  "square-reader-oddity": {
    src: "/plates/square-reader-oddity.jpg",
    credit: "Photo: Best Buy / Square Reader for magstripe",
    creditUrl: "https://www.bestbuy.com/site/square-reader-for-magstripe-with-headset-jack-white/3282053.p?skuId=3282053",
    license: "retail product photo",
    note: "Classic white headset-jack magstripe reader (A-SKU-0047).",
  },
  "huggingface-emoji-plush": {
    src: "/plates/huggingface-emoji-plush.jpg",
    credit: "Photo: AI Store, Hugging Face sticker sheet",
    creditUrl: "https://www.artificial-intelligence.store/collections/hugging-face",
    license: "brand product photo",
    note: "Hugging Face emoji sticker sheet standing in for the plush; official HF shop is currently dark.",
  },
  "yc-orange-hoodie": {
    src: "/plates/yc-orange-hoodie.jpg",
    credit: "Photo: Swagalogue / Y Combinator swag",
    creditUrl: "https://swagalogue.com/company/y-combinator",
    license: "community swag photo",
    note: "W22 founder box (motto tee, orange Y mug, North Face with YC patch); the orange batch hoodie itself is still undocumented.",
  },
  "twitch-glitch-plush": {
    src: "/plates/twitch-glitch-plush.jpg",
    credit: "Photo: Twitch Merch / Amazon, “Glitch Pillow Plush”",
    creditUrl: "https://www.amazon.com/Twitch-Glitch-Pillow-Plush/dp/B08XW3XCNN",
    license: "brand product photo",
  },
  "docker-whale-sticker": {
    src: "/plates/docker-whale-sticker.jpg",
    credit: "Photo: Docker Store, “Works On My Machine Round Foil Sticker”",
    creditUrl: "https://stores.kotisdesign.com/docker/stickers/works-on-my-machine-round-foil-sticker/171561",
    license: "brand product photo",
    note: "Official Docker store foil sticker with whale marks; classic Moby sticker sheet still undocumented.",
  },
  "bluesky-butterfly-tee": {
    src: "/plates/bluesky-butterfly-tee.jpg",
    credit: "Photo: Bluesky, “Mundus Sine Caesaribus” tee",
    creditUrl: "https://worldwithoutcaesars.com/",
    license: "brand product photo",
    note: "Official Bluesky fundraiser tee (butterfly mark at the collar); not a butterfly-graphic shirt.",
  },
  "openai-devday-token-plaque": {
    src: "/plates/openai-devday-token-plaque.jpg",
    credit: "Photo: Swagalogue / OpenAI swag",
    creditUrl: "https://swagalogue.com/company/openai",
    license: "community swag photo",
    note: "OpenAI apparel/bottle/cap flat lay standing in for the DevDay token plaque.",
  },
  "mailchimp-freddie-sticker": {
    src: "/plates/mailchimp-freddie-sticker.jpg",
    credit: "Photo: Mailchimp Brand Assets (Freddie)",
    creditUrl: "https://mailchimp.com/about/brand-assets/",
    license: "brand asset",
    note: "Official winking Freddie brand mark standing in for a physical sticker sheet.",
  },
};

export function photoFor(id: string): Photo | undefined {
  return PHOTOS[id];
}

export const PHOTO_COUNT = Object.keys(PHOTOS).length;

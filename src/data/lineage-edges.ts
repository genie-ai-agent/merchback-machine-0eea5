import type { LineageEdge } from "./lineage-types";

/**
 * Each line is a relationship that was publicly reported at the time.
 * Nothing here is inferred from "they seem similar".
 */
export const LINEAGE_EDGES: LineageEdge[] = [
  // ---- the open web -------------------------------------------------------
  {
    from: "netscape",
    to: "mozilla",
    kind: "spinout",
    note: "Netscape open-sourced its browser in 1998. The project outlived the company by decades.",
  },
  {
    from: "node-js",
    to: "deno",
    kind: "founder",
    note: "Ryan Dahl wrote Node.js in 2009, then Deno in 2018 as an explicit do-over.",
  },
  {
    from: "facebook",
    to: "the-browser-company",
    kind: "alumni",
    note: "Josh Miller sold Branch to Facebook in 2014, did a stint at the White House, then built Arc.",
  },

  // ---- search & social ----------------------------------------------------
  {
    from: "sun-microsystems",
    to: "google",
    kind: "alumni",
    note: "Eric Schmidt, Sun's CTO, took the Google CEO seat in 2001.",
  },
  { from: "yahoo", to: "flickr", kind: "acquired", note: "Yahoo bought Flickr in 2005." },
  { from: "yahoo", to: "delicious", kind: "acquired", note: "Yahoo bought Delicious in 2005 too." },
  {
    from: "yahoo",
    to: "tumblr",
    kind: "acquired",
    note: "Yahoo paid $1.1B for Tumblr in 2013. Automattic later picked it up for a reported ~$3M.",
  },
  {
    from: "napster",
    to: "facebook",
    kind: "alumni",
    note: "Sean Parker went from Napster co-founder to Facebook's first president in 2004.",
  },
  { from: "facebook", to: "instagram", kind: "acquired", note: "$1B in 2012, for a 13-person team." },
  {
    from: "google",
    to: "instagram",
    kind: "alumni",
    note: "Kevin Systrom was a Google APM before Burbn turned into Instagram.",
  },
  {
    from: "google",
    to: "foursquare",
    kind: "alumni",
    note: "Google bought Dodgeball in 2005; Dennis Crowley left and rebuilt the idea as Foursquare.",
  },
  {
    from: "google",
    to: "duolingo",
    kind: "alumni",
    note: "Luis von Ahn sold reCAPTCHA to Google, then went back to Pittsburgh to teach languages.",
  },
  {
    from: "google",
    to: "doubleclick",
    kind: "acquired",
    note: "$3.1B in 2007, which is how the ad business got its shape.",
  },
  { from: "twitter", to: "square", kind: "founder", note: "Jack Dorsey, twice, at the same time." },
  {
    from: "twitter",
    to: "bluesky",
    kind: "spinout",
    note: "Started as a Twitter-funded protocol project in 2019; became its own company in 2021.",
  },
  {
    from: "openfeint",
    to: "discord",
    kind: "founder",
    note: "Jason Citron sold OpenFeint to GREE, then founded the studio Discord fell out of.",
  },
  {
    from: "flickr",
    to: "slack",
    kind: "founder",
    note: "Stewart Butterfield's failed games left behind Flickr, then Slack. Same move, eight years apart.",
  },

  // ---- payments -----------------------------------------------------------
  {
    from: "venmo",
    to: "braintree",
    kind: "acquired",
    note: "Braintree bought Venmo in 2012, reportedly for about $26M.",
  },
  {
    from: "braintree",
    to: "paypal",
    kind: "acquired",
    note: "PayPal bought Braintree for $800M in 2013 — and Venmo came in the box.",
  },
  {
    from: "paypal",
    to: "openai",
    kind: "founder",
    note: "Elon Musk co-founded both. Peter Thiel was among OpenAI's first backers.",
  },
  {
    from: "paypal",
    to: "thiel-fellowship",
    kind: "founder",
    note: "Peter Thiel put his PayPal money into paying people to leave school.",
  },
  {
    from: "thiel-fellowship",
    to: "figma",
    kind: "capital",
    note: "Dylan Field took the fellowship and left Brown in 2012.",
  },
  {
    from: "stripe",
    to: "openai",
    kind: "alumni",
    note: "Greg Brockman left the Stripe CTO seat to co-found OpenAI in 2015.",
  },

  // ---- infrastructure -----------------------------------------------------
  {
    from: "doubleclick",
    to: "mongodb",
    kind: "alumni",
    note: "Dwight Merriman and Eliot Horowitz built DoubleClick's ad engine, then 10gen.",
  },
  {
    from: "webex",
    to: "zoom",
    kind: "alumni",
    note: "Eric Yuan, WebEx founding engineer, quit Cisco in 2011 to build the thing again.",
  },

  // ---- Y Combinator's batches --------------------------------------------
  { from: "y-combinator", to: "reddit", kind: "batch", note: "The very first batch, summer 2005." },
  { from: "y-combinator", to: "dropbox", kind: "batch", note: "S07." },
  { from: "y-combinator", to: "justin-tv", kind: "batch", note: "W07." },
  { from: "y-combinator", to: "heroku", kind: "batch", note: "S08." },
  { from: "y-combinator", to: "airbnb", kind: "batch", note: "W09, after the cereal." },
  { from: "y-combinator", to: "stripe", kind: "batch", note: "S09, filed as /dev/payments." },
  { from: "y-combinator", to: "replit", kind: "batch", note: "W18." },
  { from: "y-combinator", to: "supabase", kind: "batch", note: "S20." },
  {
    from: "justin-tv",
    to: "twitch",
    kind: "spinout",
    note: "The gaming channel was spun out in 2011 and the parent was shut down in 2014.",
  },

  // ---- tools & the model era ---------------------------------------------
  {
    from: "airbnb",
    to: "linear",
    kind: "alumni",
    note: "Karri Saarinen led design systems at Airbnb; his co-founders came out of Uber and Coinbase.",
  },
  {
    from: "openai",
    to: "anthropic",
    kind: "spinout",
    note: "Dario and Daniela Amodei left with a group of OpenAI researchers in 2021.",
  },
  {
    from: "openai",
    to: "cursor",
    kind: "capital",
    note: "The OpenAI Startup Fund led Anysphere's $8M seed in 2023.",
  },
  {
    from: "dropbox",
    to: "cursor",
    kind: "capital",
    note: "Dropbox co-founder Arash Ferdowsi angel-invested in that same round.",
  },
  {
    from: "github",
    to: "cursor",
    kind: "capital",
    note: "So did Nat Friedman, GitHub's CEO through the Microsoft years.",
  },
];

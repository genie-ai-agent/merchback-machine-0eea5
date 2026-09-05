import { createClient } from "@neondatabase/neon-js";

/**
 * Both URLs are public by design; the database enforces who can read what.
 * Used only by the registrar's desk — the rest of the archive is static.
 */
export const db = createClient({
  auth: {
    url: "https://ep-ancient-credit-aunjcn4f.neonauth.c-10.us-east-1.aws.neon.tech/neondb/auth",
    allowAnonymous: true,
  },
  dataApi: {
    url: "https://ep-ancient-credit-aunjcn4f.apirest.c-10.us-east-1.aws.neon.tech/neondb/rest/v1",
  },
});

/** Phones block popups and hate them anyway: those get a same-tab redirect. */
function prefersRedirect(): boolean {
  if (typeof window === "undefined") return true;
  const narrow = window.matchMedia?.("(max-width: 820px)")?.matches ?? false;
  const touch = navigator.maxTouchPoints > 1;
  const ua = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return narrow || (touch && ua);
}

export async function signInWithGoogle(): Promise<"popup" | "redirect"> {
  // The callback page needs to know where to put the visitor back down.
  const next = window.location.pathname + window.location.search;
  const callback = `${window.location.origin}/auth-callback.html?next=${encodeURIComponent(next)}`;

  // Opened before the first await or the browser treats it as unsolicited.
  const popup = prefersRedirect()
    ? null
    : window.open("about:blank", "signin", "width=480,height=640");

  const { data, error } = await db.auth.signIn.social({
    provider: "google",
    callbackURL: callback,
    errorCallbackURL: callback,
    disableRedirect: true,
  });

  if (error || !data?.url) {
    popup?.close();
    throw error ?? new Error("Google sign-in did not return a URL.");
  }

  // Popup blocked or skipped: send this tab there, so the button is never dead.
  if (popup && !popup.closed) {
    popup.location.href = data.url;
    return "popup";
  }
  window.location.href = data.url;
  return "redirect";
}

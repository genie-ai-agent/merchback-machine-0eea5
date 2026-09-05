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

export async function signInWithGoogle(): Promise<void> {
  // Opened before the first await or the browser treats it as unsolicited.
  const popup = window.open("about:blank", "signin", "width=480,height=640");

  const { data, error } = await db.auth.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}/auth-callback.html`,
    errorCallbackURL: `${window.location.origin}/auth-callback.html`,
    disableRedirect: true,
  });

  if (error || !data?.url) {
    popup?.close();
    throw error ?? new Error("no sign-in url");
  }

  if (popup) popup.location.href = data.url;
  else window.location.href = data.url;
}

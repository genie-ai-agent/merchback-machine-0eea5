import { useEffect, useRef, useState } from "react";
import { db, signInWithGoogle } from "@/lib/db";

interface Props {
  onDone: () => Promise<void> | void;
}

export default function SignInPanel({ onDone }: Props) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const poll = useRef<number | null>(null);

  // Never leave an interval running after the panel goes away.
  useEffect(
    () => () => {
      if (poll.current !== null) window.clearInterval(poll.current);
    },
    [],
  );

  async function google() {
    setError(null);
    let mode: "popup" | "redirect";
    try {
      mode = await signInWithGoogle();
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} You can sign in with email instead.`
          : "Google sign-in failed. You can sign in with email instead.",
      );
      return;
    }
    if (mode !== "popup") return; // this tab is already on its way to Google

    // Belt and braces: if the popup's message never lands, watch the session.
    setWaiting(true);
    const started = Date.now();
    if (poll.current !== null) window.clearInterval(poll.current);
    poll.current = window.setInterval(async () => {
      const { data } = await db.auth.getSession();
      if (data?.user) {
        if (poll.current !== null) window.clearInterval(poll.current);
        poll.current = null;
        setWaiting(false);
        await onDone();
      } else if (Date.now() - started > 180000) {
        if (poll.current !== null) window.clearInterval(poll.current);
        poll.current = null;
        setWaiting(false);
      }
    }, 2000);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res =
      mode === "up"
        ? await db.auth.signUp.email({ email, password, name: name || email })
        : await db.auth.signIn.email({ email, password });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? "That didn't work.");
      return;
    }
    await onDone();
  }

  const field =
    "w-full border border-ink bg-[var(--color-card)] px-3 py-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-capture)]";

  return (
    <div className="frame mx-auto max-w-md p-5">
      <p className="meta">Staff entrance</p>
      <h2 className="mt-1 font-display text-xl font-bold">Sign in to the registrar's desk</h2>
      <p className="acc mt-2 leading-relaxed">
        The intake log is closed to the public. Donors never need an account.
      </p>

      <button
        type="button"
        onClick={google}
        className="mt-5 flex w-full items-center justify-center gap-2 border border-ink bg-ink px-4 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-[var(--color-paper)] transition-colors hover:bg-[var(--color-stamp)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.98h5.32c-.23 1.4-1.65 4.1-5.32 4.1a5.9 5.9 0 0 1 0-11.8c1.5 0 2.6.6 3.2 1.15l2.2-2.12A8.8 8.8 0 0 0 12.18 3a9 9 0 0 0 0 18c5.2 0 8.63-3.65 8.63-8.8 0-.6-.07-1.05-.16-1.5Z"
          />
        </svg>
        Continue with Google
      </button>

      {waiting && (
        <p className="acc mt-2">Waiting on the Google window. Nothing opened? Use email below.</p>
      )}

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--color-rule)]" />
        <span className="meta">or</span>
        <span className="h-px flex-1 bg-[var(--color-rule)]" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "up" && (
          <div>
            <label htmlFor="reg-name" className="meta">
              Name
            </label>
            <input
              id="reg-name"
              className={`${field} mt-1`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label htmlFor="reg-email" className="meta">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            required
            className={`${field} mt-1`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="reg-pass" className="meta">
            Password
          </label>
          <input
            id="reg-pass"
            type="password"
            required
            minLength={8}
            className={`${field} mt-1`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "up" ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <p className="acc border-l-2 border-[var(--color-stamp)] pl-2 text-[var(--color-stamp)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full border border-ink bg-[var(--color-paper-2)] px-4 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase transition-colors hover:bg-[var(--color-highlight)] disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setError(null);
        }}
        className="acc mt-4 underline-ink"
      >
        {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/db";
import SignInPanel from "./SignInPanel";
import SubmissionCard, { type Submission } from "./SubmissionCard";

const RARITY_ORDER = ["grail", "rare", "uncommon", "common"];

export default function RegistrarDesk() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "year">("newest");
  const [copied, setCopied] = useState(false);

  /** The one function that knows about the session. Everything else calls it. */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data } = await db.auth.getSession();
    const session = data?.user ?? null;
    setUser(session ? { id: session.id, email: session.email } : null);

    if (!session) {
      setRows(null);
      setLoading(false);
      return;
    }

    const res = await db
      .from("submissions")
      .select(
        "id, artifact, company, year, object_type, rarity, notes, lore, source_url, submitter_name, submitter_email, status, created_at",
      )
      .order("id", { ascending: false })
      .limit(200);

    if (res.error) setError(res.error.message ?? "The Data API refused that read.");
    setRows((res.data as Submission[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data === "signed-in") void refresh();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [refresh]);

  const visible = useMemo(() => {
    let out = [...(rows ?? [])];
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter((r) =>
        [r.artifact, r.company, r.object_type, r.notes, r.lore ?? "", r.submitter_name]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (rarity !== "all") out = out.filter((r) => r.rarity === rarity);
    if (sort === "oldest") out.sort((a, b) => a.id - b.id);
    else if (sort === "year") out.sort((a, b) => a.year - b.year);
    else out.sort((a, b) => b.id - a.id);
    return out;
  }, [rows, query, rarity, sort]);

  const control =
    "border border-ink bg-[var(--color-card)] px-2.5 py-2 font-mono text-[0.65rem] tracking-[0.1em] uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-capture)]";

  // ---- loading ----
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 w-full animate-pulse bg-[var(--color-paper-2)]" />
        <div className="h-32 w-full animate-pulse bg-[var(--color-paper-2)]" />
        <div className="h-32 w-full animate-pulse bg-[var(--color-paper-2)]" />
        <p className="meta">Opening the intake log…</p>
      </div>
    );
  }

  // ---- signed out ----
  if (!user) return <SignInPanel onDone={refresh} />;

  return (
    <div>
      {/* who's on duty */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-ink bg-ink px-3 py-2 text-[var(--color-paper)]">
        <span className="font-mono text-[0.6rem] tracking-[0.16em] uppercase opacity-70">On duty</span>
        <span className="font-mono text-[0.7rem] break-all">{user.email ?? user.id}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="border border-[var(--color-paper)] px-2 py-1 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-colors hover:bg-[var(--color-paper)] hover:text-ink"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={async () => {
              await db.auth.signOut();
              await refresh();
            }}
            className="border border-[var(--color-stamp)] px-2 py-1 font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[var(--color-highlight)] transition-colors hover:bg-[var(--color-stamp)] hover:text-[var(--color-paper)]"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <p className="acc mt-3 border-l-2 border-[var(--color-stamp)] bg-[var(--color-card)] p-3 text-[var(--color-stamp)]">
          {error}
        </p>
      )}

      {/* locked: signed in, but this id isn't on the read policy yet */}
      {rows !== null && rows.length === 0 && (
        <div className="frame mt-4 p-4 sm:p-5">
          <p className="stamp">restricted</p>
          <h2 className="mt-3 font-display text-xl font-bold">This desk isn't unlocked yet</h2>
          <p className="mt-2 text-sm leading-relaxed">
            The intake table is closed by default, so an empty log here means one of two things: no
            donations have come in, or this account hasn't been added to the read policy. Send Genie
            the id below and it'll open the drawer.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-ink bg-[var(--color-paper-2)] p-3">
            <code className="font-mono text-xs break-all">{user.id}</code>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(user.id);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                }
              }}
              className="ml-auto border border-ink px-2 py-1 font-mono text-[0.6rem] tracking-[0.14em] uppercase hover:bg-[var(--color-highlight)]"
            >
              {copied ? "Copied" : "Copy id"}
            </button>
          </div>
          <p className="acc mt-3">
            Meanwhile every donation posts straight into the Genie chat as it lands, and the full log
            can be read back there on request.
          </p>
        </div>
      )}

      {/* the log */}
      {rows !== null && rows.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-ink bg-[var(--color-paper-2)] px-3 py-2.5">
            <label htmlFor="reg-q" className="sr-only">
              Search the log
            </label>
            <input
              id="reg-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search intake…"
              className={`${control} min-w-0 flex-1 normal-case tracking-normal`}
            />
            <select
              aria-label="Filter by rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className={control}
            >
              <option value="all">All rarities</option>
              {RARITY_ORDER.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              aria-label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className={control}
            >
              <option value="newest">Newest filed</option>
              <option value="oldest">Oldest filed</option>
              <option value="year">By object year</option>
            </select>
            <span className="meta ml-auto">
              {visible.length} of {rows.length}
            </span>
          </div>

          {visible.length === 0 ? (
            <p className="frame mt-4 p-4 text-sm">Nothing in the log matches that.</p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {visible.map((s) => (
                <SubmissionCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

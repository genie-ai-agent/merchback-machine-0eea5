import { useState } from "react";

const SUBMIT_URL = "https://api.genie.jellyjelly.com/forms/Ei-TT09JL8DTTgy6-gzSiP8_p39cgGj7";

const OBJECT_TYPES = [
  ["tee", "T-shirt"],
  ["hoodie", "Hoodie / crewneck"],
  ["cap", "Cap / hat"],
  ["sticker", "Sticker"],
  ["keycap", "Keycap"],
  ["plush", "Plush"],
  ["socks", "Socks"],
  ["book", "Print / book"],
  ["pin", "Pin"],
  ["tote", "Tote / bag"],
  ["mug", "Drinkware"],
  ["oddity", "Oddity"],
] as const;

const RARITIES = [
  ["common", "Common — they printed thousands"],
  ["uncommon", "Uncommon — a conference run, a launch week"],
  ["rare", "Rare — employees and close friends only"],
  ["grail", "Grail — people ask about it by name"],
] as const;

const field =
  "w-full border border-ink bg-[var(--color-paper)] px-3 py-2.5 font-mono text-sm placeholder:text-[var(--color-ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-capture)]";
const lbl = "meta mb-1 block";

export default function DonateForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError("");
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          artifact: String(fd.get("artifact") ?? "").trim(),
          company: String(fd.get("company") ?? "").trim(),
          year: Number(fd.get("year")),
          object_type: String(fd.get("object_type") ?? ""),
          rarity: String(fd.get("rarity") ?? ""),
          notes: String(fd.get("notes") ?? "").trim(),
          lore: String(fd.get("lore") ?? "").trim() || undefined,
          source_url: String(fd.get("source_url") ?? "").trim() || undefined,
          submitter_name: String(fd.get("submitter_name") ?? "").trim(),
          submitter_email: String(fd.get("submitter_email") ?? "").trim(),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "The accession desk rejected that record.");
        setState("error");
        return;
      }
      form.reset();
      setState("done");
    } catch {
      setError("Couldn't reach the accession desk. Nothing was filed — try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="frame p-6 text-center">
        <p className="stamp">accession pending</p>
        <h3 className="mt-4 font-display text-xl font-bold">Filed with the registrar</h3>
        <p className="acc mx-auto mt-2 max-w-md">
          In the queue. If it checks out, it gets an accession number and a plate.
        </p>
        <button type="button" onClick={() => setState("idle")} className="acc mt-4 underline-ink">
          Submit another object
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="frame p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl} htmlFor="d-artifact">
            Object name *
          </label>
          <input
            id="d-artifact"
            name="artifact"
            required
            minLength={2}
            maxLength={120}
            placeholder="e.g. Launch Week embroidered beanie"
            className={field}
          />
        </div>
        <div>
          <label className={lbl} htmlFor="d-company">
            Company *
          </label>
          <input
            id="d-company"
            name="company"
            required
            maxLength={80}
            placeholder="e.g. Figma"
            className={field}
          />
        </div>
        <div>
          <label className={lbl} htmlFor="d-year">
            Year (best guess) *
          </label>
          <input
            id="d-year"
            name="year"
            type="number"
            required
            min={1970}
            max={2030}
            placeholder="2024"
            className={field}
          />
        </div>
        <div>
          <label className={lbl} htmlFor="d-type">
            Object type *
          </label>
          <select id="d-type" name="object_type" required defaultValue="tee" className={field}>
            {OBJECT_TYPES.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl} htmlFor="d-rarity">
            Rarity *
          </label>
          <select id="d-rarity" name="rarity" required defaultValue="uncommon" className={field}>
            {RARITIES.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl} htmlFor="d-name">
            Your name *
          </label>
          <input id="d-name" name="submitter_name" required maxLength={80} className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl} htmlFor="d-email">
            Your email *
          </label>
          <input id="d-email" name="submitter_email" type="email" required className={field} />
          <p className="acc mt-1 text-[var(--color-ink-3)]">Not published.</p>
        </div>
        <div className="sm:col-span-2">
          <label className={lbl} htmlFor="d-notes">
            The record * <span className="normal-case">(10–1200 characters)</span>
          </label>
          <textarea
            id="d-notes"
            name="notes"
            required
            minLength={10}
            maxLength={1200}
            rows={5}
            placeholder="What is it, where did you get it, what makes it worth keeping?"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl} htmlFor="d-lore">
            Lore <span className="normal-case">(optional)</span>
          </label>
          <textarea
            id="d-lore"
            name="lore"
            minLength={3}
            maxLength={1200}
            rows={3}
            placeholder="The story nobody outside the company would know. Why it exists, who fought over it, what went wrong at the printer."
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl} htmlFor="d-source">
            Photo or listing link <span className="normal-case">(optional)</span>
          </label>
          <input
            id="d-source"
            name="source_url"
            type="url"
            maxLength={500}
            placeholder="https://…"
            className={field}
          />
          <p className="acc mt-1 text-[var(--color-ink-3)]">
            Where the object or a photo of it lives, so we can credit it properly.
          </p>
        </div>
      </div>

      {state === "error" && (
        <p className="mt-4 border border-[var(--color-stamp)] bg-[var(--color-paper-2)] px-3 py-2 font-mono text-xs text-[var(--color-stamp)]">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="border border-ink bg-ink px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-[var(--color-paper)] transition-colors hover:bg-[var(--color-stamp)] disabled:opacity-50"
        >
          {state === "sending" ? "Filing…" : "Submit to the registrar"}
        </button>
        <p className="meta">Reviewed by hand</p>
      </div>
    </form>
  );
}

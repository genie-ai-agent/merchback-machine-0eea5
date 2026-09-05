import { useEffect, useMemo, useState } from "react";
import SpecimenPlate from "@/components/SpecimenPlate";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Artifact } from "@/data/types";

interface Props {
  artifacts: Artifact[];
  accessions: Record<string, string>;
  typeOptions: { id: string; label: string; count: number }[];
  companyOptions: { slug: string; name: string; count: number }[];
  wings: { id: string; name: string; from: number; to: number }[];
  rarityLabels: Record<string, string>;
}

type Sort = "year-desc" | "year-asc" | "company" | "rarity";

const RARITY_ORDER: Record<string, number> = { grail: 0, rare: 1, uncommon: 2, common: 3 };

const selectClass =
  "w-full border border-ink bg-[var(--color-card)] px-2.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] focus:outline-none focus:ring-2 focus:ring-[var(--color-capture)]";
const labelClass = "meta mb-1 block";

export default function ArchiveBrowser({
  artifacts,
  accessions,
  typeOptions,
  companyOptions,
  wings,
  rarityLabels,
}: Props) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [company, setCompany] = useState("all");
  const [wing, setWing] = useState("all");
  const [sort, setSort] = useState<Sort>("year-desc");
  const [view, setView] = useState<"plates" | "ledger">("plates");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");
    if (initial) setQ(initial);
    const t = params.get("type");
    if (t) setType(t);
    const c = params.get("company");
    if (c) setCompany(c);
    const w = params.get("wing");
    if (w) setWing(w);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const w = wings.find((x) => x.id === wing);
    const out = artifacts.filter((a) => {
      if (type !== "all" && a.type !== type) return false;
      if (company !== "all" && a.companySlug !== company) return false;
      if (w && (a.year < w.from || a.year > w.to)) return false;
      if (!needle) return true;
      return [a.name, a.company, String(a.year), a.type, a.label, ...a.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    out.sort((a, b) => {
      if (sort === "year-desc") return b.year - a.year || a.company.localeCompare(b.company);
      if (sort === "year-asc") return a.year - b.year || a.company.localeCompare(b.company);
      if (sort === "company") return a.company.localeCompare(b.company) || a.year - b.year;
      return (RARITY_ORDER[a.rarity] ?? 9) - (RARITY_ORDER[b.rarity] ?? 9) || b.year - a.year;
    });
    return out;
  }, [artifacts, q, type, company, wing, sort, wings]);

  const open = openId ? (artifacts.find((a) => a.id === openId) ?? null) : null;
  const filtered = type !== "all" || company !== "all" || wing !== "all" || q.trim() !== "";

  function reset() {
    setQ("");
    setType("all");
    setCompany("all");
    setWing("all");
  }

  return (
    <div>
      <div className="frame p-3 sm:p-4">
        <label className={labelClass} htmlFor="browse-q">
          Search the finding aid
        </label>
        <input
          id="browse-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="tab key, socks, mascot, 1999…"
          className="w-full border border-ink bg-[var(--color-paper)] px-3 py-2.5 font-mono text-sm placeholder:text-[var(--color-ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-capture)]"
        />

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="f-wing">
              Wing
            </label>
            <select id="f-wing" className={selectClass} value={wing} onChange={(e) => setWing(e.target.value)}>
              <option value="all">All eras</option>
              {wings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.from}–{w.to})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="f-type">
              Object type
            </label>
            <select id="f-type" className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All objects</option>
              {typeOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.count})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="f-company">
              Company
            </label>
            <select
              id="f-company"
              className={selectClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="all">All companies</option>
              {companyOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="f-sort">
              Order
            </label>
            <select
              id="f-sort"
              className={selectClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="year-desc">Newest first</option>
              <option value="year-asc">Oldest first</option>
              <option value="company">Company A–Z</option>
              <option value="rarity">Scarcity</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-2">
        <p className="meta">
          <span className="font-semibold text-[var(--color-stamp)]">{results.length}</span> of{" "}
          {artifacts.length} objects
          {filtered && (
            <button type="button" onClick={reset} className="ml-3 underline-ink normal-case">
              clear filters
            </button>
          )}
        </p>
        <div className="flex items-stretch">
          {(
            [
              ["plates", "Plates"],
              ["ledger", "Ledger"],
            ] as const
          ).map(([id, lbl]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`border border-ink px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.14em] uppercase ${
                view === id
                  ? "bg-ink text-[var(--color-paper)]"
                  : "bg-[var(--color-card)] text-[var(--color-ink-2)]"
              } ${id === "ledger" ? "border-l-0" : ""}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 && (
        <div className="frame-thin mt-6 border-dashed p-8 text-center">
          <p className="stamp">no captures</p>
          <h3 className="mt-4 font-display text-xl font-bold">Nothing in the stacks matches that</h3>
          <p className="acc mx-auto mt-2 max-w-md">
            The collection has gaps — plenty of them. Try a broader term, or send the front desk
            whatever it is we're missing.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="acc underline-ink">
              Reset the finding aid
            </button>
            <a href="/about#donate" className="acc underline-ink">
              Donate an artifact
            </a>
          </div>
        </div>
      )}

      {results.length > 0 && view === "plates" && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setOpenId(a.id)}
              className="plate frame group relative block text-left"
            >
              {a.rarity === "grail" && (
                <span className="stamp absolute top-2 right-2 z-10 bg-[var(--color-card)]">grail</span>
              )}
              <div className="scanlines relative border-b border-ink">
                <SpecimenPlate artifact={a} />
              </div>
              <div className="p-3">
                <p className="acc text-[var(--color-capture)]">{accessions[a.id]}</p>
                <h3 className="mt-1 font-display text-[0.95rem] leading-snug font-bold group-hover:text-[var(--color-stamp)]">
                  {a.name}
                </h3>
                <p className="meta mt-1.5">
                  {a.company} · {a.year}
                  {a.dating === "estimated" ? " ≈" : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.length > 0 && view === "ledger" && (
        <div className="mt-6">
          <div className="hidden grid-cols-[7.5rem_1fr_9rem_7rem] gap-4 border-b border-ink pb-1 sm:grid">
            <span className="meta">Accession</span>
            <span className="meta">Object</span>
            <span className="meta">Type</span>
            <span className="meta text-right">Scarcity</span>
          </div>
          {results.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setOpenId(a.id)}
              className="group grid w-full grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-rule py-3 text-left hover:bg-[var(--color-paper-2)] sm:grid-cols-[7.5rem_1fr_9rem_7rem]"
            >
              <span className="acc text-[var(--color-capture)]">{accessions[a.id]}</span>
              <span className="font-display text-sm font-bold group-hover:text-[var(--color-stamp)]">
                {a.name}
                <span className="meta ml-2">
                  {a.company} · {a.year}
                </span>
              </span>
              <span className="meta col-start-2 sm:col-start-3">
                {typeOptions.find((t) => t.id === a.type)?.label ?? a.type}
              </span>
              <span className="meta col-start-2 sm:col-start-4 sm:text-right">
                {rarityLabels[a.rarity]}
              </span>
            </button>
          ))}
        </div>
      )}

      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent
          style={{ background: "#fbf8f0" }}
          className="max-h-[90vh] overflow-y-auto border border-ink p-0 sm:max-w-2xl"
        >
          {open && (
            <div>
              <div className="grid sm:grid-cols-[200px_1fr]">
                <div className="scanlines relative border-b border-ink sm:border-r sm:border-b-0">
                  <SpecimenPlate artifact={open} />
                </div>
                <div className="p-5">
                  <p className="acc text-[var(--color-capture)]">{accessions[open.id]}</p>
                  <DialogTitle className="mt-1 font-display text-2xl leading-tight font-bold">
                    {open.name}
                  </DialogTitle>
                  <p className="meta mt-2">
                    {open.company} · {open.year}{" "}
                    {open.dating === "estimated" ? "(estimated)" : "(documented)"}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed">{open.label}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-rule pt-4">
                    <div>
                      <dt className="meta">Object</dt>
                      <dd className="acc">{typeOptions.find((t) => t.id === open.type)?.label}</dd>
                    </div>
                    <div>
                      <dt className="meta">Scarcity</dt>
                      <dd className="acc">{rarityLabels[open.rarity]}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="meta">Subject terms</dt>
                      <dd className="acc">{open.tags.join(" · ")}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <a href={`/artifact/${open.id}`} className="acc underline-ink">
                      Full catalogue record →
                    </a>
                    <a href={`/year/${open.year}`} className="acc underline-ink">
                      Everything from {open.year}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface Submission {
  id: number;
  artifact: string;
  company: string;
  year: number;
  object_type: string;
  rarity: string;
  notes: string;
  lore: string | null;
  source_url: string | null;
  submitter_name: string;
  submitter_email: string;
  status: string;
  created_at: string;
}

const RARITY: Record<string, string> = {
  common: "Widely distributed",
  uncommon: "Limited circulation",
  rare: "Scarce",
  grail: "Grail",
};

function accession(s: Submission): string {
  return `INT-${String(s.id).padStart(4, "0")}`;
}

export default function SubmissionCard({ s }: { s: Submission }) {
  const filed = new Date(s.created_at);
  const stamp = Number.isNaN(filed.getTime())
    ? s.created_at
    : filed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

  return (
    <article className="frame p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink pb-2">
        <div>
          <p className="meta">{accession(s)}</p>
          <h3 className="mt-0.5 font-display text-lg leading-tight font-bold">{s.artifact}</h3>
        </div>
        <p className="acc text-right">
          {s.company} · {s.year}
          <br />
          <span className="text-[var(--color-ink-3)]">{s.object_type}</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="stamp">{RARITY[s.rarity] ?? s.rarity}</span>
        <span className="meta">filed {stamp}</span>
        <span className="meta ml-auto border border-rule px-1.5 py-0.5">{s.status}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed">{s.notes}</p>

      {s.lore && (
        <div className="mt-3 border-l-2 border-[var(--color-capture)] pl-3">
          <p className="meta">Lore</p>
          <p className="mt-0.5 text-sm leading-relaxed italic">{s.lore}</p>
        </div>
      )}

      <dl className="mt-4 grid gap-x-6 gap-y-1 border-t border-rule pt-3 sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="meta shrink-0">Donor</dt>
          <dd className="acc">{s.submitter_name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="meta shrink-0">Contact</dt>
          <dd className="acc break-all">
            <a href={`mailto:${s.submitter_email}`} className="underline-ink">
              {s.submitter_email}
            </a>
          </dd>
        </div>
        {s.source_url && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="meta shrink-0">Source</dt>
            <dd className="acc break-all">
              <a href={s.source_url} target="_blank" rel="noreferrer" className="underline-ink">
                {s.source_url}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}

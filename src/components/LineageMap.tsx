import { useMemo, useState } from "react";
import {
  EDGE_STYLES,
  LINEAGE_EDGES,
  chainFrom,
  edgeStyle,
  edgesFor,
  nodeName,
  type EdgeKind,
} from "@/data/lineage";
import {
  AXIS_MAX,
  AXIS_MIN,
  CHART_WIDTH,
  LAYOUT,
  NODE_H,
  NODE_W,
  PLACED_BY_SLUG,
  PLOT_LEFT,
  PLOT_RIGHT,
  TICKS,
  pathBetween,
  xFor,
} from "@/lib/lineage-layout";

interface Props {
  /** slug -> objects held, so the panel can link into the catalogue. */
  holdings: Record<string, number>;
}

const ALL_KINDS = EDGE_STYLES.map((s) => s.id);

export default function LineageMap({ holdings }: Props) {
  const [kinds, setKinds] = useState<EdgeKind[]>(ALL_KINDS);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = selected ?? hovered;
  const visibleEdges = useMemo(
    () => LINEAGE_EDGES.filter((e) => kinds.includes(e.kind)),
    [kinds],
  );
  const chain = useMemo(() => (active ? chainFrom(active) : null), [active]);
  const node = active ? PLACED_BY_SLUG.get(active) : undefined;
  const nodeEdges = active ? edgesFor(active) : [];

  function toggle(kind: EdgeKind) {
    setKinds((k) => (k.includes(kind) ? k.filter((x) => x !== kind) : [...k, kind]));
  }

  const dim = (slug: string) => (chain && !chain.has(slug) ? 0.22 : 1);

  return (
    <div>
      {/* ---- controls ---- */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-ink bg-[var(--color-paper-2)] px-3 py-2.5">
        <span className="meta">Lines shown</span>
        {EDGE_STYLES.map((s) => {
          const on = kinds.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              title={s.gloss}
              aria-pressed={on}
              className={`flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase transition-colors ${
                on
                  ? "border-ink bg-[var(--color-card)] text-ink"
                  : "border-rule bg-transparent text-[var(--color-ink-3)] line-through"
              }`}
            >
              <svg width="20" height="6" aria-hidden="true">
                <line
                  x1="0"
                  y1="3"
                  x2="20"
                  y2="3"
                  stroke={s.color}
                  strokeWidth={s.width}
                  strokeDasharray={s.dash}
                />
              </svg>
              {s.label}
            </button>
          );
        })}
        {selected && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ml-auto border border-[var(--color-stamp)] px-2 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-stamp)]"
          >
            Clear {nodeName(selected)}
          </button>
        )}
      </div>

      {/* ---- chart ---- */}
      <div className="relative border-x border-b border-ink bg-[var(--color-card)]">
        <div className="no-scrollbar overflow-x-auto">
          <svg
            width={CHART_WIDTH}
            height={LAYOUT.height}
            viewBox={`0 0 ${CHART_WIDTH} ${LAYOUT.height}`}
            role="img"
            aria-label="Descent chart of startups connected by founders, spinouts, acquisitions and funding"
            style={{ display: "block" }}
            onMouseLeave={() => setHovered(null)}
          >
            {/* family bands */}
            {LAYOUT.bands.map((b, i) => (
              <g key={b.id}>
                <rect
                  x="0"
                  y={b.top}
                  width={CHART_WIDTH}
                  height={b.height}
                  fill={i % 2 === 0 ? "rgba(27,26,23,0.028)" : "transparent"}
                />
                <line
                  x1="0"
                  y1={b.top}
                  x2={CHART_WIDTH}
                  y2={b.top}
                  stroke="#cfc6b1"
                  strokeWidth="1"
                />
                <text x="14" y={b.top + 16} className="font-mono" fontSize="9.5" letterSpacing="1.6" fill="#7d776a">
                  {b.name.toUpperCase()}
                </text>
              </g>
            ))}

            {/* year grid */}
            {TICKS.map((t) => (
              <g key={t}>
                <line
                  x1={xFor(t)}
                  y1="40"
                  x2={xFor(t)}
                  y2={LAYOUT.height - 6}
                  stroke="#cfc6b1"
                  strokeWidth="0.6"
                  strokeDasharray="2 4"
                />
                <text
                  x={xFor(t)}
                  y="32"
                  className="font-mono"
                  fontSize="10"
                  fill="#7d776a"
                  textAnchor="middle"
                >
                  {t}
                </text>
              </g>
            ))}
            <line x1="0" y1="40" x2={CHART_WIDTH} y2="40" stroke="#1b1a17" strokeWidth="1" />
            <text x="14" y="18" className="font-mono" fontSize="9.5" letterSpacing="1.6" fill="#1b1a17">
              DESCENT CHART · {AXIS_MIN}–{AXIS_MAX}
            </text>
            <text x="14" y="32" className="font-mono" fontSize="9" fill="#b03a20">
              ◀ earlier
            </text>

            {/* edges */}
            {visibleEdges.map((e, i) => {
              const a = PLACED_BY_SLUG.get(e.from);
              const b = PLACED_BY_SLUG.get(e.to);
              if (!a || !b) return null;
              const s = edgeStyle(e.kind);
              const lit = !chain || (chain.has(e.from) && chain.has(e.to));
              const { d } = pathBetween(a, b);
              return (
                <path
                  key={`${e.from}-${e.to}-${i}`}
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={lit && chain ? s.width + 0.7 : s.width}
                  strokeDasharray={s.dash}
                  opacity={lit ? (chain ? 0.95 : 0.62) : 0.07}
                  strokeLinecap="round"
                />
              );
            })}

            {/* nodes */}
            {LAYOUT.nodes.map((n) => {
              const isActive = n.slug === active;
              const inChain = chain?.has(n.slug) ?? false;
              return (
                <g
                  key={n.slug}
                  opacity={dim(n.slug)}
                  onMouseEnter={() => setHovered(n.slug)}
                  onClick={() => setSelected((s) => (s === n.slug ? null : n.slug))}
                  style={{ cursor: "pointer" }}
                >
                  {isActive && (
                    <text
                      x={n.x + 2}
                      y={n.y - 5}
                      className="font-mono"
                      fontSize="9"
                      fill="#b03a20"
                      letterSpacing="0.8"
                    >
                      {n.yearLabel ?? n.year}
                    </text>
                  )}
                  <rect
                    x={n.x}
                    y={n.y}
                    width={NODE_W}
                    height={NODE_H}
                    fill={isActive ? "#1b1a17" : n.inHoldings ? "#fbf8f0" : "#eae3d2"}
                    stroke={isActive ? "#b03a20" : "#1b1a17"}
                    strokeWidth={isActive || inChain ? 1.5 : 0.9}
                    strokeDasharray={n.inHoldings ? undefined : "3 2"}
                  />
                  <text
                    x={n.x + 7}
                    y={n.y + 16}
                    className="font-mono"
                    fontSize="9.6"
                    letterSpacing="0.2"
                    fill={isActive ? "#f3eee1" : n.inHoldings ? "#1b1a17" : "#4a463d"}
                  >
                    {n.name}
                  </text>
                  {n.inHoldings && holdings[n.slug] ? (
                    <text
                      x={n.x + NODE_W - 5}
                      y={n.y + 16}
                      className="font-mono"
                      fontSize="8"
                      textAnchor="end"
                      fill={isActive ? "#e8c547" : "#b03a20"}
                    >
                      {holdings[n.slug]}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {/* plot end caps */}
            <line x1={PLOT_LEFT - 34} y1="40" x2={PLOT_LEFT - 34} y2={LAYOUT.height - 6} stroke="#1b1a17" strokeWidth="0.8" />
            <line x1={PLOT_RIGHT + NODE_W + 8} y1="40" x2={PLOT_RIGHT + NODE_W + 8} y2={LAYOUT.height - 6} stroke="#cfc6b1" strokeWidth="0.8" />
          </svg>
        </div>
        <p className="meta border-t border-rule px-3 py-1.5 sm:hidden">Drag the chart sideways · tap a box</p>
      </div>

      {/* ---- record panel ---- */}
      <div className="frame mt-4 p-4 sm:p-5">
        {!node ? (
          <div>
            <p className="meta">Reading the chart</p>
            <p className="mt-2 text-sm leading-relaxed">
              Tap any box to light up everything it connects to, forwards and backwards. Dashed
              outlines are context: companies with nothing in the holdings, kept because the lines
              run through them. The red number is objects catalogued.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink pb-2">
              <h3 className="font-display text-xl font-bold">{node.name}</h3>
              <p className="acc">
                {node.yearLabel ? node.yearLabel : `founded ${node.year}`}
                {node.inHoldings && holdings[node.slug]
                  ? ` · ${holdings[node.slug]} object${holdings[node.slug] === 1 ? "" : "s"} held`
                  : " · no holdings"}
              </p>
            </div>
            {node.note && <p className="mt-3 text-sm leading-relaxed">{node.note}</p>}
            {node.fate && (
              <p className="acc mt-2">
                <span className="text-[var(--color-stamp)]">†</span> {node.fate}
              </p>
            )}

            <ul className="mt-4 space-y-2">
              {nodeEdges.map((e, i) => {
                const s = edgeStyle(e.kind);
                const other = e.from === node.slug ? e.to : e.from;
                const outbound = e.from === node.slug;
                return (
                  <li key={i} className="border-l-2 pl-3" style={{ borderColor: s.color }}>
                    <p className="acc">
                      <span style={{ color: s.color }}>{s.label}</span> ·{" "}
                      {outbound ? "→ " : "← "}
                      <button
                        type="button"
                        className="underline-ink"
                        onClick={() => setSelected(other)}
                      >
                        {nodeName(other)}
                      </button>
                    </p>
                    <p className="mt-0.5 text-sm leading-snug">{e.note}</p>
                  </li>
                );
              })}
              {nodeEdges.length === 0 && (
                <li className="acc">No descent recorded. Standing on its own.</li>
              )}
            </ul>

            {node.inHoldings && holdings[node.slug] ? (
              <a href={`/company/${node.slug}`} className="acc mt-4 inline-block underline-ink">
                Open the {node.name} wing →
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

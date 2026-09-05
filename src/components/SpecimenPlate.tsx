import type { Artifact, ObjectType } from "@/data/types";

interface Props {
  artifact: Artifact;
  className?: string;
}

function fitMotif(motif: string): { text: string; size: number } {
  const t = motif.length > 18 ? motif.slice(0, 17) + "…" : motif;
  const size = t.length <= 2 ? 34 : t.length <= 6 ? 20 : t.length <= 11 ? 13 : 9;
  return { text: t, size };
}

function Motif({ artifact, x, y }: { artifact: Artifact; x: number; y: number }) {
  if (!artifact.motif) return null;
  const { text, size } = fitMotif(artifact.motif);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={artifact.ink}
      fontFamily="'IBM Plex Mono', monospace"
      fontSize={size}
      fontWeight={600}
      letterSpacing={text.length > 6 ? 0.5 : 1.5}
    >
      {text}
    </text>
  );
}

function shape(a: Artifact, type: ObjectType) {
  const { base, ink } = a;
  const trim = a.trim ?? ink;

  switch (type) {
    case "tee":
      return (
        <>
          <path
            d="M70 34 L46 46 L32 82 L52 90 L54 74 L54 166 L146 166 L146 74 L148 90 L168 82 L154 46 L130 34 C122 46 78 46 70 34 Z"
            fill={base}
            stroke={ink}
            strokeWidth={2}
          />
          <path d="M70 34 C80 50 120 50 130 34" fill="none" stroke={ink} strokeWidth={2} />
          <Motif artifact={a} x={100} y={112} />
        </>
      );
    case "hoodie":
      return (
        <>
          <path
            d="M68 38 L42 50 L28 92 L50 100 L52 82 L52 172 L148 172 L148 82 L150 100 L172 92 L158 50 L132 38 Z"
            fill={base}
            stroke={ink}
            strokeWidth={2}
          />
          <path d="M68 38 C82 66 118 66 132 38" fill={trim} opacity={0.35} stroke={ink} strokeWidth={2} />
          <path d="M86 60 L92 96 M114 60 L108 96" stroke={trim} strokeWidth={3} strokeLinecap="round" />
          <rect x="70" y="128" width="60" height="28" fill="none" stroke={ink} strokeWidth={1.5} opacity={0.5} />
          <Motif artifact={a} x={100} y={108} />
        </>
      );
    case "cap":
      return (
        <>
          <path d="M40 118 C40 66 160 66 160 118 Z" fill={base} stroke={ink} strokeWidth={2} />
          <path d="M100 70 L100 118" stroke={ink} strokeWidth={1} opacity={0.4} />
          <path d="M38 118 L178 118 C178 136 150 140 38 130 Z" fill={base} stroke={ink} strokeWidth={2} />
          <circle cx="100" cy="70" r="4" fill={ink} />
          <Motif artifact={a} x={100} y={100} />
        </>
      );
    case "sticker":
      return (
        <g transform="rotate(-6 100 100)">
          <rect x="38" y="52" width="124" height="96" rx="10" fill={base} stroke={ink} strokeWidth={2} />
          <rect
            x="46"
            y="60"
            width="108"
            height="80"
            rx="6"
            fill="none"
            stroke={ink}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            opacity={0.7}
          />
          <Motif artifact={a} x={100} y={100} />
        </g>
      );
    case "keycap":
      return (
        <>
          <path d="M52 72 L148 72 L166 148 L34 148 Z" fill={base} stroke={ink} strokeWidth={2} />
          <path d="M64 82 L136 82 L148 132 L52 132 Z" fill={trim} opacity={0.18} stroke={ink} strokeWidth={1.5} />
          <Motif artifact={a} x={100} y={108} />
        </>
      );
    case "plush":
      return (
        <>
          <path
            d="M100 44 C142 44 162 74 162 106 C162 142 134 164 100 164 C66 164 38 142 38 106 C38 74 58 44 100 44 Z"
            fill={base}
            stroke={ink}
            strokeWidth={2}
          />
          <circle cx="82" cy="98" r="5" fill={ink} />
          <circle cx="118" cy="98" r="5" fill={ink} />
          <path d="M86 120 C94 130 106 130 114 120" fill="none" stroke={ink} strokeWidth={2.5} strokeLinecap="round" />
          <Motif artifact={a} x={100} y={68} />
        </>
      );
    case "socks":
      return (
        <>
          {[0, 1].map((i) => (
            <path
              key={i}
              d={`M${58 + i * 52} 44 L${86 + i * 52} 44 L${86 + i * 52} 116 L${104 + i * 52} 132 L${88 + i * 52} 152 L${58 + i * 52} 128 Z`}
              fill={base}
              stroke={ink}
              strokeWidth={2}
            />
          ))}
          <path d="M58 60 L86 60 M110 60 L138 60" stroke={trim} strokeWidth={4} />
          <Motif artifact={a} x={100} y={176} />
        </>
      );
    case "book":
      return (
        <>
          <rect x="52" y="40" width="96" height="124" fill={base} stroke={ink} strokeWidth={2} />
          <rect x="52" y="40" width="14" height="124" fill={trim} opacity={0.3} stroke={ink} strokeWidth={1.5} />
          <path d="M78 60 L134 60 M78 70 L120 70" stroke={ink} strokeWidth={1.5} opacity={0.5} />
          <Motif artifact={a} x={106} y={110} />
        </>
      );
    case "pin":
      return (
        <>
          <circle cx="100" cy="96" r="52" fill={base} stroke={ink} strokeWidth={2} />
          <circle cx="100" cy="96" r="42" fill="none" stroke={trim} strokeWidth={2} opacity={0.6} />
          <path d="M100 148 L100 176" stroke={ink} strokeWidth={3} />
          <Motif artifact={a} x={100} y={96} />
        </>
      );
    case "tote":
      return (
        <>
          <rect x="48" y="70" width="104" height="98" fill={base} stroke={ink} strokeWidth={2} />
          <path d="M74 70 C74 38 126 38 126 70" fill="none" stroke={ink} strokeWidth={4} />
          <Motif artifact={a} x={100} y={120} />
        </>
      );
    case "mug":
      return (
        <>
          <rect x="54" y="62" width="84" height="94" rx="6" fill={base} stroke={ink} strokeWidth={2} />
          <path d="M138 84 C170 84 170 130 138 130" fill="none" stroke={ink} strokeWidth={5} />
          <Motif artifact={a} x={96} y={110} />
        </>
      );
    default:
      return (
        <>
          <path
            d="M100 40 L146 60 L166 106 L146 152 L100 172 L54 152 L34 106 L54 60 Z"
            fill={base}
            stroke={ink}
            strokeWidth={2}
          />
          <path
            d="M100 54 L136 68 L152 106 L136 144 L100 158 L64 144 L48 106 L64 68 Z"
            fill="none"
            stroke={trim}
            strokeWidth={1.5}
            opacity={0.6}
          />
          <Motif artifact={a} x={100} y={106} />
        </>
      );
  }
}

export default function SpecimenPlate({ artifact, className = "" }: Props) {
  const light = isLight(artifact.base);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${artifact.name}, ${artifact.company}, ${artifact.year} — illustrated specimen plate`}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <rect width="200" height="200" fill={light ? "#e6dfcd" : "#f1ebdc"} />
      <g opacity={0.5}>
        <path d="M0 40 H200 M0 160 H200 M40 0 V200 M160 0 V200" stroke="#c9bfa6" strokeWidth={0.6} />
      </g>
      <g>{shape(artifact, artifact.type)}</g>
      <rect
        x="4"
        y="4"
        width="192"
        height="192"
        fill="none"
        stroke="#1b1a17"
        strokeWidth={0.8}
        opacity={0.25}
      />
    </svg>
  );
}

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.75;
}

/** Original SVG ornaments: a leafy blossom branch and a small divider. */

type Pt = [number, number];
const P: [Pt, Pt, Pt, Pt] = [
  [18, 292],
  [26, 196],
  [66, 104],
  [168, 26],
];

function bez(t: number): Pt {
  const u = 1 - t;
  const x = u ** 3 * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t ** 3 * P[3][0];
  const y = u ** 3 * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t ** 3 * P[3][1];
  return [x, y];
}

function angle(t: number): number {
  const u = 1 - t;
  const dx =
    3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]);
  const dy =
    3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

const LEAF = "M0 0 C 7 -9, 22 -11, 36 0 C 22 11, 7 9, 0 0 Z";

function Blossom({ x, y, s, r = 0 }: { x: number; y: number; s: number; r?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-9" rx="6.2" ry="9.5" transform={`rotate(${a})`} className="bot-petal" />
      ))}
      <circle r="3.4" className="bot-core" />
    </g>
  );
}

export function Botanical({ className = "" }: { className?: string }) {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const t = 0.08 + i * 0.1;
    const [x, y] = bez(t);
    const side = i % 2 === 0 ? 1 : -1;
    const rot = angle(t) + side * 52;
    const s = 1.25 - t * 0.55;
    return { x, y, rot, s, key: i };
  });
  const d = `M${P[0]} C${P[1]} ${P[2]} ${P[3]}`;
  const blooms: { t: number; dx: number; dy: number; s: number; r: number }[] = [
    { t: 0.34, dx: -16, dy: 4, s: 0.95, r: -20 },
    { t: 0.6, dx: 14, dy: 12, s: 0.85, r: 25 },
    { t: 0.82, dx: -8, dy: -16, s: 0.7, r: 10 },
    { t: 1, dx: 0, dy: 0, s: 1.35, r: 12 },
  ];
  return (
    <svg className={`botanical ${className}`} viewBox="0 0 200 300" aria-hidden="true" focusable="false">
      <path d={d} className="bot-stem" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      {leaves.map((l) => (
        <path
          key={l.key}
          d={LEAF}
          className="bot-leaf"
          transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.s.toFixed(2)})`}
        />
      ))}
      {blooms.map((b) => {
        const [x, y] = bez(b.t);
        return <Blossom key={b.t} x={x + b.dx} y={y + b.dy} s={b.s} r={b.r} />;
      })}
    </svg>
  );
}

export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg className={`flourish ${className}`} viewBox="0 0 240 24" aria-hidden="true" focusable="false">
      <path d="M4 12h86M150 12h86" className="fl-line" strokeWidth="1" fill="none" />
      <path d="M120 3l7 9-7 9-7-9z" className="fl-gem" />
      <circle cx="100" cy="12" r="2" className="fl-gem" />
      <circle cx="140" cy="12" r="2" className="fl-gem" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7zm0 9.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"
        fill="currentColor"
      />
    </svg>
  );
}

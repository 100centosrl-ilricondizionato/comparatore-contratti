interface MeterGaugeProps {
  percentuale: number; // 0-100+
  size?: number;
}

const CX = 130;
const CY = 130;
const R = 104;
const START_ANGLE = -210; // degrees, left end
const END_ANGLE = 30; // degrees, right end

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(r: number, from: number, to: number) {
  const start = polar(CX, CY, r, from);
  const end = polar(CX, CY, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export default function MeterGauge({ percentuale, size = 260 }: MeterGaugeProps) {
  const clamped = Math.max(0, Math.min(60, percentuale));
  const t = clamped / 60; // 0..1 mapped across the dial's meaningful range
  const needleAngle = START_ANGLE + t * (END_ANGLE - START_ANGLE);
  const tip = polar(CX, CY, R - 14, needleAngle);
  const tail = polar(CX, CY, 20, needleAngle + 180);

  const ticks = Array.from({ length: 13 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 260 190"
      width={size}
      height={(size * 190) / 260}
      className="overflow-visible"
    >
      {/* outer track */}
      <path
        d={arcPath(R, START_ANGLE, END_ANGLE)}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* filled progress */}
      <path
        d={arcPath(R, START_ANGLE, needleAngle)}
        fill="none"
        stroke="var(--color-spark)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* ticks */}
      {ticks.map((i) => {
        const a = START_ANGLE + (i / (ticks.length - 1)) * (END_ANGLE - START_ANGLE);
        const p1 = polar(CX, CY, R + 12, a);
        const p2 = polar(CX, CY, R + 20, a);
        const major = i % 3 === 0;
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--color-ink-soft)"
            strokeWidth={major ? 2 : 1}
            opacity={major ? 0.6 : 0.3}
          />
        );
      })}
      {/* needle */}
      <line
        x1={tail.x}
        y1={tail.y}
        x2={tip.x}
        y2={tip.y}
        stroke="var(--color-ink)"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={9} fill="var(--color-ink)" />
      <circle cx={CX} cy={CY} r={3.5} fill="var(--color-spark)" />
    </svg>
  );
}

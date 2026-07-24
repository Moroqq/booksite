"use client";

import { useState } from "react";
import { CONSONANTS } from "@/lib/content";

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 130;
const INNER_R = 70;
const LABEL_R = 150;

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const p1 = polarPoint(cx, cy, outerR, startAngle);
  const p2 = polarPoint(cx, cy, outerR, endAngle);
  const p3 = polarPoint(cx, cy, innerR, endAngle);
  const p4 = polarPoint(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

const SECTOR_COLORS = [
  "#C9A24B", "#C97B63", "#8FA9B8", "#7C8B6F", "#6B6585", "#C9A24B",
  "#C97B63", "#8FA9B8", "#7C8B6F", "#6B6585", "#C9A24B", "#C97B63",
];

export default function ZodiacCircle() {
  const [active, setActive] = useState<number | null>(null);
  const step = 360 / CONSONANTS.length;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* SVG zodiac */}
        <div className="relative shrink-0">
          <svg
            width={SIZE + 40}
            height={SIZE + 40}
            viewBox={`-20 -20 ${SIZE + 40} ${SIZE + 40}`}
            aria-label="Интерактивный зодиакальный круг согласных звуков"
            role="img"
          >
            {CONSONANTS.map((c, i) => {
              const start = i * step - step / 2;
              const end = start + step;
              const mid = i * step;
              const isActive = active === i;
              const labelPos = polarPoint(CX, CY, LABEL_R, mid);
              const letterPos = polarPoint(CX, CY, (OUTER_R + INNER_R) / 2, mid);
              const color = SECTOR_COLORS[i];

              return (
                <g
                  key={c.sign}
                  onClick={() => setActive(isActive ? null : i)}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${c.sign}: ${c.letters}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActive(isActive ? null : i)}
                >
                  <path
                    d={sectorPath(CX, CY, INNER_R, OUTER_R, start, end)}
                    fill={color}
                    opacity={isActive ? 0.8 : 0.15}
                    stroke="var(--bg)"
                    strokeWidth="1.5"
                    style={{ transition: "opacity 0.3s ease" }}
                  />
                  {/* Symbol label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                    fill={isActive ? color : "var(--ink-soft)"}
                    opacity={isActive ? 1 : 0.6}
                    style={{ pointerEvents: "none", transition: "all 0.3s ease" }}
                  >
                    {c.symbol}
                  </text>
                  {/* Letters in sector */}
                  <text
                    x={letterPos.x}
                    y={letterPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isActive ? 13 : 10}
                    fontFamily="var(--font-cormorant), Georgia, serif"
                    fontWeight="500"
                    fill={isActive ? "var(--bg)" : color}
                    opacity={isActive ? 1 : 0.7}
                    style={{ pointerEvents: "none", transition: "all 0.3s ease" }}
                  >
                    {c.letters}
                  </text>
                </g>
              );
            })}

            {/* Inner circle */}
            <circle cx={CX} cy={CY} r={INNER_R - 1} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fill="var(--ink-soft)"
              opacity={0.5}
            >
              Согласные
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fill="var(--ink-soft)"
              opacity={0.5}
            >
              и зодиак
            </text>
          </svg>
        </div>

        {/* Info panel */}
        <div className="flex-1 min-h-[200px]">
          {active !== null ? (
            <div key={active} style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards" }}>
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="font-cormorant text-5xl"
                  style={{ color: SECTOR_COLORS[active] }}
                >
                  {CONSONANTS[active].symbol}
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)]/60">
                    Знак зодиака
                  </p>
                  <p
                    className="font-cormorant text-2xl font-light"
                    style={{ color: SECTOR_COLORS[active] }}
                  >
                    {CONSONANTS[active].sign}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <span className="font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)]/60 mr-2">
                  Звуки:
                </span>
                <span
                  className="font-cormorant text-xl font-medium"
                  style={{ color: SECTOR_COLORS[active] }}
                >
                  {CONSONANTS[active].letters}
                </span>
              </div>
              <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                {CONSONANTS[active].description}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-inter text-sm text-[var(--ink-soft)]/60 italic mb-6">
                Нажмите на сектор, чтобы узнать о согласном звуке
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CONSONANTS.map((c, i) => (
                  <button
                    key={c.sign}
                    onClick={() => setActive(i)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-[var(--line)] hover:border-[var(--gold)]/40 transition-colors duration-300 text-left"
                    aria-label={`${c.sign}: ${c.letters}`}
                  >
                    <span
                      className="text-base"
                      style={{ color: SECTOR_COLORS[i] }}
                    >
                      {c.symbol}
                    </span>
                    <span className="font-inter text-xs text-[var(--ink-soft)]">
                      {c.letters}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

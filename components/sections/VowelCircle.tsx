"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { VOWELS } from "@/lib/content";

const RADIUS = 130;
const CX = 180;
const CY = 180;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const POSITIONS = VOWELS.map((v, i) => {
  const angle = (i * 360) / VOWELS.length;
  return polarToCartesian(CX, CY, RADIUS, angle);
});

export default function VowelCircle({ soundsReady = false }: { soundsReady?: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  const handleSound = (index: number) => {
    const audio = new Audio(VOWELS[index].soundFile);
    audio.play().catch(() => {});
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* SVG circle */}
        <div className="relative shrink-0">
          <svg
            width={360}
            height={360}
            viewBox="0 0 360 360"
            aria-label="Интерактивная схема гласных звуков и планет"
            role="img"
          >
            {/* Background circle */}
            <circle cx={CX} cy={CY} r={RADIUS + 20} fill="none" stroke="rgba(74,68,60,0.22)" strokeWidth="1" />
            <circle cx={CX} cy={CY} r={4} fill="var(--gold)" opacity="0.5" />

            {/* Connectors */}
            {POSITIONS.map((pos, i) => (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={pos.x}
                y2={pos.y}
                stroke={active === i ? VOWELS[i].colorHex : "var(--line)"}
                strokeWidth={active === i ? 1.5 : 0.5}
                style={{ transition: "all 0.4s ease" }}
              />
            ))}

            {/* Vowel nodes */}
            {VOWELS.map((vowel, i) => {
              const pos = POSITIONS[i];
              const isActive = active === i;
              return (
                <g
                  key={vowel.letter}
                  onClick={() => setActive(isActive ? null : i)}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`Гласная ${vowel.letter} — ${vowel.planet}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActive(isActive ? null : i)}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 30 : 22}
                    fill={vowel.colorHex}
                    opacity={isActive ? 0.18 : 0.06}
                    style={{ transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  {/* Main node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 20 : 14}
                    fill={isActive ? vowel.colorHex : "var(--bg)"}
                    stroke={vowel.colorHex}
                    strokeWidth={isActive ? 0 : 1.5}
                    style={{ transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  {/* Letter */}
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isActive ? 18 : 14}
                    fontFamily="var(--font-cormorant), Georgia, serif"
                    fontWeight="500"
                    fill={isActive ? "var(--bg)" : vowel.colorHex}
                    style={{ transition: "all 0.4s ease", pointerEvents: "none" }}
                  >
                    {vowel.letter}
                  </text>
                  {/* Planet label */}
                  {isActive && (
                    <text
                      x={pos.x}
                      y={pos.y + 34}
                      textAnchor="middle"
                      fontSize={9}
                      fontFamily="var(--font-inter), system-ui, sans-serif"
                      fill={vowel.colorHex}
                      opacity={0.9}
                      style={{ pointerEvents: "none" }}
                    >
                      {vowel.planet}
                    </text>
                  )}
                </g>
              );
            })}

          </svg>

          {/* Active color glow behind svg */}
          {active !== null && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none -z-10"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${VOWELS[active].colorHex}18, transparent 70%)`,
                transition: "background 0.5s ease",
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Info panel */}
        <div className="flex-1 min-h-[200px]">
          {active !== null ? (
            <div key={active} style={{ animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards" }}>
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="font-cormorant text-6xl font-light"
                  style={{ color: VOWELS[active].colorHex }}
                >
                  {VOWELS[active].letter}
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)]/60">
                    Планета
                  </p>
                  <p
                    className="font-cormorant text-2xl font-light"
                    style={{ color: VOWELS[active].colorHex }}
                  >
                    {VOWELS[active].planet}
                  </p>
                </div>
              </div>
              <p className="font-inter text-[var(--ink-soft)] leading-relaxed mb-6">
                {VOWELS[active].description}
              </p>
              {soundsReady && (
                <button
                  className="flex items-center gap-2 font-inter text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-300 group"
                  onClick={() => handleSound(active)}
                  aria-label={`Услышать звук ${VOWELS[active].letter}`}
                >
                  <span
                    className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:border-[var(--gold)] transition-colors duration-300"
                    style={{ borderColor: VOWELS[active].colorHex + "60" }}
                  >
                    <Volume2 size={14} style={{ color: VOWELS[active].colorHex }} />
                  </span>
                  Услышать поток
                </button>
              )}
            </div>
          ) : (
            <div className="text-center lg:text-left">
              <p className="font-inter text-sm text-[var(--ink-soft)]/60 italic">
                Наведите на гласную, чтобы узнать о ней
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {VOWELS.map((v, i) => (
                  <button
                    key={v.letter}
                    onClick={() => setActive(i)}
                    className="w-10 h-10 rounded-full border font-cormorant text-xl font-light transition-all duration-300 hover:scale-110"
                    style={{ borderColor: v.colorHex, color: v.colorHex }}
                    aria-label={`Гласная ${v.letter}`}
                  >
                    {v.letter}
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

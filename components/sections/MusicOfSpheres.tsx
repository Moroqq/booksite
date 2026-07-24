"use client";

import { useState } from "react";
import { VOWELS } from "@/lib/content";

const ORBITS = [
  { r: 42, period: 8, vowelIndex: 4 },   // У — Сатурн (outermost)
  { r: 56, period: 11, vowelIndex: 3 },  // О — Юпитер
  { r: 70, period: 5, vowelIndex: 0 },   // А — Венера
  { r: 82, period: 3, vowelIndex: 2 },   // И — Меркурий
  { r: 92, period: 14, vowelIndex: 1 },  // Е — Марс (outermost in classical)
];

export default function MusicOfSpheres() {
  const [active, setActive] = useState<number | null>(null);
  const vowel = active !== null ? VOWELS[active] : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: 240, height: 240 }}>
        <svg viewBox="0 0 200 200" width="240" height="240" aria-label="Музыка сфер — интерактивная схема">
          {/* Sun / centre */}
          <circle cx="100" cy="100" r="6" fill="var(--gold)" opacity="0.7" />

          {ORBITS.map((orbit, i) => {
            const v = VOWELS[orbit.vowelIndex];
            const isActive = active === orbit.vowelIndex;
            return (
              <g key={v.letter}>
                {/* Orbit ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={orbit.r}
                  fill="none"
                  stroke={isActive ? v.colorHex : "rgba(201,162,75,0.12)"}
                  strokeWidth={isActive ? 1 : 0.5}
                  style={{ transition: "stroke 0.3s" }}
                />
                {/* Planet node — positioned at top of orbit, user clicks it */}
                <g
                  className={`orbit-node-${i}`}
                  onClick={() => setActive(active === orbit.vowelIndex ? null : orbit.vowelIndex)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${v.letter} — ${v.planet}`}
                  onKeyDown={(e) => e.key === "Enter" && setActive(active === orbit.vowelIndex ? null : orbit.vowelIndex)}
                  style={{ cursor: "pointer", transformOrigin: "100px 100px" }}
                >
                  <circle
                    cx="100"
                    cy={100 - orbit.r}
                    r={isActive ? 8 : 6}
                    fill={v.colorHex}
                    opacity={isActive ? 0.95 : 0.55}
                    style={{ transition: "r 0.3s, opacity 0.3s" }}
                  />
                  <text
                    x="100"
                    y={100 - orbit.r + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
                    fontFamily="var(--font-cormorant), Georgia, serif"
                    fill={isActive ? "white" : "var(--bg)"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {v.letter}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        <style>{`
          ${ORBITS.map((o, i) => `
            .orbit-node-${i} {
              animation: orbit-rotate ${o.period}s linear infinite;
            }
          `).join("")}
          @keyframes orbit-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Info panel */}
      <div
        className="min-h-[80px] text-center max-w-xs transition-all duration-300"
        aria-live="polite"
      >
        {vowel ? (
          <>
            <p className="font-cormorant text-2xl font-medium mb-1" style={{ color: vowel.colorHex }}>
              {vowel.letter} — {vowel.planet}
            </p>
            <p className="font-inter text-sm text-[var(--text-on-dark-soft)] leading-relaxed">
              {vowel.description}
            </p>
          </>
        ) : (
          <p className="font-inter text-sm text-[var(--text-on-dark-muted)]">
            Нажмите на планету, чтобы узнать о гласном
          </p>
        )}
      </div>
    </div>
  );
}

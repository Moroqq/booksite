"use client";

import { useState } from "react";

const RINGS = [
  {
    label: "Я-организация",
    r: 28,
    color: "#C9A24B",
    colorAlpha: "rgba(201,162,75,0.15)",
    description: "Духовное ядро человека. Индивидуальное Я, которое пронизывает и преобразует все остальные тела.",
  },
  {
    label: "Астральное тело",
    r: 50,
    color: "#6B6585",
    colorAlpha: "rgba(107,101,133,0.12)",
    description: "Тело чувств и ощущений. Несёт в себе весь мир внутренних переживаний, симпатий и антипатий.",
  },
  {
    label: "Эфирное тело",
    r: 70,
    color: "#7C8B6F",
    colorAlpha: "rgba(124,139,111,0.1)",
    description: "Тело жизни. Поддерживает жизненные процессы, ритмы роста и восстановления.",
  },
  {
    label: "Физическое тело",
    r: 88,
    color: "#8FA9B8",
    colorAlpha: "rgba(143,169,184,0.08)",
    description: "Видимая, осязаемая форма. Несёт в себе минеральное царство и законы вещества.",
  },
];

export default function ThreeRings() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Labels above the diagram */}
      <div className="flex flex-wrap justify-center gap-2">
        {RINGS.map((ring, i) => (
          <button
            key={ring.label}
            onClick={() => setActive(active === i ? null : i)}
            className="font-inter text-xs px-3 py-1.5 rounded-full border transition-all duration-300"
            style={{
              borderColor: ring.color + (active === i ? "cc" : "55"),
              color: ring.color,
              opacity: active === i ? 1 : 0.65,
              boxShadow: "none",
            }}
            aria-label={ring.label}
          >
            {ring.label}
          </button>
        ))}
      </div>

      {/* SVG diagram */}
      <svg
        viewBox="0 0 200 200"
        width="220"
        height="220"
        aria-label="Четыре тела человека — концентрические кольца"
      >
        {RINGS.slice().reverse().map((ring, revI) => {
          const i = RINGS.length - 1 - revI;
          const isActive = active === i;
          return (
            <g
              key={ring.label}
              onClick={() => setActive(active === i ? null : i)}
              role="button"
              tabIndex={0}
              aria-label={ring.label}
              onKeyDown={(e) => e.key === "Enter" && setActive(active === i ? null : i)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx="100"
                cy="100"
                r={ring.r}
                fill={isActive ? ring.colorAlpha : "transparent"}
                style={{ transition: "fill 0.4s" }}
              />
              <circle
                cx="100"
                cy="100"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.35}
                style={{ transition: "all 0.3s" }}
              />
            </g>
          );
        })}
        <circle cx="100" cy="100" r="4" fill="var(--gold)" opacity="0.6" />
      </svg>

      {/* Info panel */}
      <div className="min-h-[64px] text-center max-w-xs" aria-live="polite">
        {active !== null ? (
          <>
            <p className="font-cormorant text-xl mb-1" style={{ color: RINGS[active].color }}>
              {RINGS[active].label}
            </p>
            <p className="font-inter text-sm text-[var(--ink-soft)]">{RINGS[active].description}</p>
          </>
        ) : (
          <p className="font-inter text-xs text-[var(--ink-soft)]/40">
            Нажмите на кольцо, чтобы узнать о теле человека
          </p>
        )}
      </div>
    </div>
  );
}

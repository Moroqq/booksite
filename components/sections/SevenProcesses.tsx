"use client";

import { useState } from "react";

const PROCESSES = [
  { label: "Дыхание", description: "Ритмическое движение между внутренним и внешним. Основа всех семи процессов." },
  { label: "Тепло", description: "Согревание. Живое тепло как предпосылка для всякого роста и преобразования." },
  { label: "Питание", description: "Принятие внешнего и его превращение во внутреннее — пища, впечатления, звук." },
  { label: "Выделение", description: "Освобождение от отработанного. Творческий отказ, граница, завершение." },
  { label: "Рост", description: "Расширение, умножение живого. Движение от центра к периферии." },
  { label: "Воспроизведение", description: "Сохранение и передача существенного. Память, традиция, семя." },
  { label: "Поддержание жизни", description: "Равновесие, гомеостаз. Удержание целого в непрерывном изменении." },
];

const N = PROCESSES.length;
const CX = 100;
const CY = 100;
const R = 72;

function point(i: number, r: number) {
  const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

function heptagramPath() {
  const pts = Array.from({ length: N }, (_, i) => point(i, R));
  const step = 3;
  let d = "";
  let cur = 0;
  const visited: number[] = [0];
  for (let s = 0; s < N; s++) {
    const next = (cur + step) % N;
    const from = pts[cur];
    const to = pts[next];
    d += s === 0 ? `M ${from.x} ${from.y}` : "";
    d += ` L ${to.x} ${to.y}`;
    cur = next;
    visited.push(cur);
    if (cur === 0) break;
  }
  return d + " Z";
}

export default function SevenProcesses() {
  const [active, setActive] = useState<number | null>(null);

  const activePt = active !== null ? point(active, R) : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        viewBox="0 0 200 200"
        width="280"
        height="280"
        aria-label="Семь жизненных процессов — гептаграмма"
      >
        {/* Outer guide circle */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(201,162,75,0.1)" strokeWidth="0.5" />

        {/* Heptagram */}
        <path
          d={heptagramPath()}
          fill="none"
          stroke="rgba(201,162,75,0.25)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Rays + nodes */}
        {PROCESSES.map((p, i) => {
          const pt = point(i, R);
          const isActive = active === i;
          return (
            <g key={p.label}>
              {/* Ray from centre */}
              <line
                x1={CX}
                y1={CY}
                x2={pt.x}
                y2={pt.y}
                stroke={isActive ? "var(--gold)" : "rgba(201,162,75,0.15)"}
                strokeWidth={isActive ? 1 : 0.5}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
              {/* Node */}
              <g
                onClick={() => setActive(active === i ? null : i)}
                role="button"
                tabIndex={0}
                aria-label={p.label}
                onKeyDown={(e) => e.key === "Enter" && setActive(active === i ? null : i)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 7 : 5}
                  fill={isActive ? "var(--gold)" : "var(--bg-deep)"}
                  stroke="var(--gold)"
                  strokeWidth={isActive ? 1.5 : 0.8}
                  opacity={isActive ? 1 : 0.6}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={pt.x}
                  y={pt.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5.5"
                  fontFamily="var(--font-inter), system-ui, sans-serif"
                  fill={isActive ? "var(--bg)" : "var(--gold-soft)"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {String(i + 1)}
                </text>
              </g>
            </g>
          );
        })}

        {/* Centre dot */}
        <circle cx={CX} cy={CY} r="3" fill="var(--gold)" opacity="0.5" />

        {/* Highlight active point glow */}
        {activePt && (
          <circle
            cx={activePt.x}
            cy={activePt.y}
            r="12"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        )}
      </svg>

      {/* Label list */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {PROCESSES.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setActive(active === i ? null : i)}
            className={`font-inter text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 ${
              active === i
                ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                : "border-white/15 text-[var(--text-on-dark-soft)] hover:border-[var(--gold)]/40"
            }`}
          >
            {String(i + 1)}. {p.label}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="min-h-[56px] text-center max-w-xs" aria-live="polite">
        {active !== null ? (
          <>
            <p className="font-cormorant text-xl text-[var(--gold)] mb-1">{PROCESSES[active].label}</p>
            <p className="font-inter text-sm text-[var(--text-on-dark-soft)]">{PROCESSES[active].description}</p>
          </>
        ) : (
          <p className="font-inter text-xs text-[var(--text-on-dark-muted)]">
            Нажмите на узел или название, чтобы узнать о процессе
          </p>
        )}
      </div>
    </div>
  );
}

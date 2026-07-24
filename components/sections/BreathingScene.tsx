"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "inhale" | "hold" | "exhale";

const PHASES: { key: Phase; label: string; duration: number }[] = [
  { key: "inhale", label: "Вдох", duration: 4000 },
  { key: "hold", label: "Пауза", duration: 2000 },
  { key: "exhale", label: "Выдох", duration: 6000 },
];

const PHASE_SCALE: Record<Phase, number> = {
  inhale: 1.45,
  hold: 1.45,
  exhale: 0.72,
};

const PHASE_COLOR: Record<Phase, string> = {
  inhale: "rgba(201,162,75,0.18)",
  hold: "rgba(201,162,75,0.28)",
  exhale: "rgba(143,169,184,0.18)",
};

export default function BreathingScene() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseIndexRef = useRef(0);

  const currentPhase = PHASES[phaseIndexRef.current];
  const scale = PHASE_SCALE[phase];
  const glowColor = PHASE_COLOR[phase];

  useEffect(() => {
    if (!running) return;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const phaseDuration = PHASES[phaseIndexRef.current].duration;
      const p = Math.min(elapsed / phaseDuration, 1);
      setProgress(p);

      if (p >= 1) {
        phaseIndexRef.current = (phaseIndexRef.current + 1) % PHASES.length;
        startRef.current = now;
        setPhase(PHASES[phaseIndexRef.current].key);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const toggle = () => {
    if (!running) {
      phaseIndexRef.current = 0;
      startRef.current = 0;
      setPhase("inhale");
      setProgress(0);
    }
    setRunning((r) => !r);
  };

  const transitionDuration = currentPhase ? currentPhase.duration / 1000 : 1;

  return (
    <div className="flex flex-col items-center gap-8 py-8 select-none">
      {/* SVG scene */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          width="288"
          height="288"
          aria-hidden="true"
          className="absolute inset-0"
        >
          {/* Outer static ring */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,162,75,0.12)" strokeWidth="1" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(201,162,75,0.08)" strokeWidth="0.5" />

          {/* Progress arc */}
          {running && (
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray={`${565 * progress} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              opacity="0.6"
            />
          )}
        </svg>

        {/* Animated circle */}
        <div
          className="rounded-full flex items-center justify-center transition-all"
          style={{
            width: 100,
            height: 100,
            transform: `scale(${running ? scale : 1})`,
            transitionDuration: `${transitionDuration}s`,
            transitionTimingFunction: phase === "hold" ? "linear" : "cubic-bezier(0.4,0,0.2,1)",
            background: running ? glowColor : "rgba(201,162,75,0.08)",
            border: "1.5px solid rgba(201,162,75,0.3)",
            boxShadow: running
              ? `0 0 ${32 * scale}px ${glowColor}, 0 0 ${60 * scale}px ${glowColor}`
              : "none",
          }}
        >
          <span
            className="font-cormorant text-2xl text-[var(--gold)]"
            style={{ opacity: running ? 1 : 0.4 }}
          >
            {running ? PHASES[phaseIndexRef.current].label.charAt(0) : "○"}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <div className="text-center min-h-[3rem]">
        {running ? (
          <>
            <p className="font-cormorant text-2xl text-[var(--text-on-dark)]">{currentPhase.label}</p>
            <p className="font-inter text-xs uppercase tracking-widest text-[var(--text-on-dark-muted)] mt-1">
              {(currentPhase.duration / 1000).toFixed(0)} сек
            </p>
          </>
        ) : (
          <p className="font-inter text-sm text-[var(--text-on-dark-soft)]">
            Нажмите, чтобы начать
          </p>
        )}
      </div>

      {/* Control */}
      <button
        onClick={toggle}
        className="font-inter text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors duration-300"
        aria-label={running ? "Остановить дыхание" : "Начать упражнение на дыхание"}
      >
        {running ? "Остановить" : "Начать"}
      </button>

      <p className="font-inter text-xs text-[var(--text-on-dark-muted)] text-center max-w-xs">
        Вдох 4 с · Пауза 2 с · Выдох 6 с
      </p>
    </div>
  );
}

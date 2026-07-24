"use client";

export default function BreathingCircle({ color = "var(--gold)" }: { color?: string }) {
  return (
    <div className="relative flex items-center justify-center" aria-hidden="true">
      {/* Outer pulse rings */}
      <div
        className="absolute rounded-full border border-[var(--gold)]/20"
        style={{
          width: 160,
          height: 160,
          animation: "breathe 6s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute rounded-full border border-[var(--gold)]/12"
        style={{
          width: 200,
          height: 200,
          animation: "breathe 6s ease-in-out infinite",
          animationDelay: "-2s",
        }}
      />
      {/* Core circle */}
      <div
        className="rounded-full"
        style={{
          width: 80,
          height: 80,
          background: `radial-gradient(circle at 40% 40%, ${color}, transparent 70%)`,
          opacity: 0.5,
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

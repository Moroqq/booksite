"use client";

import { useEffect, useRef } from "react";

interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  opacity: number;
}

const WAVES: WaveConfig[] = [
  { amplitude: 28, frequency: 0.012, speed: 0.018, color: "#C9A24B", opacity: 0.18 },
  { amplitude: 18, frequency: 0.018, speed: 0.012, color: "#E8D5A4", opacity: 0.14 },
  { amplitude: 35, frequency: 0.008, speed: 0.008, color: "#C97B63", opacity: 0.10 },
];

export default function SoundWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const centerY = h * 0.5;

      WAVES.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = 1.5;

        for (let x = 0; x <= w; x += 2) {
          const noise = Math.sin(x * 0.003 + timeRef.current * 0.7) * 6;
          const y =
            centerY +
            Math.sin(x * wave.frequency + timeRef.current * wave.speed) * wave.amplitude +
            noise;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      timeRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Static fallback
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const centerY = h * 0.5;
      WAVES.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= w; x += 2) {
          const y = centerY + Math.sin(x * wave.frequency) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

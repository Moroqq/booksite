"use client";

import { useEffect, useRef } from "react";

const FIRST = 36;
const LAST = 151;
const COUNT = LAST - FIRST + 1; // 116 frames
const FPS = 24;

export default function IntroAnimationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const curRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: HTMLImageElement[] = Array.from({ length: COUNT }, (_, i) => {
      const img = new Image();
      img.src = `/frames/intro_frame_${String(FIRST + i).padStart(3, "0")}.png`;
      return img;
    });
    framesRef.current = frames;

    frames[0].onload = () => {
      canvas.width = frames[0].naturalWidth;
      canvas.height = frames[0].naturalHeight;
      ctx.drawImage(frames[0], 0, 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    function tick(timestamp: number) {
      if (curRef.current >= COUNT - 1) return;
      if (timestamp - lastTimeRef.current >= 1000 / FPS) {
        curRef.current++;
        const img = framesRef.current[curRef.current];
        if (img?.complete && img.naturalWidth) {
          ctx!.drawImage(img, 0, 0, canvas!.width, canvas!.height);
        }
        lastTimeRef.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section aria-hidden="true" className="w-full pt-16 md:pt-20 flex justify-center bg-white">
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "50%", height: "auto" }}
      />
    </section>
  );
}

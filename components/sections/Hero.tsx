"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { QUOTES } from "@/lib/content";

const TITLE_WORDS = ["Духовная", "звукотерапия", "гласных", "и", "согласных"];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ animation: "ambient 40s ease-in-out infinite" }}
      aria-label="Главный экран"
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(201,162,75,0.06), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-layout text-center flex flex-col items-center gap-10 pt-28 pb-20">
        <p
          className="font-inter text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)] opacity-0"
          style={mounted ? { animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s forwards" } : {}}
        >
          Метод Арнольда Дорхаут Мэйс · 1935–2018
        </p>

        <h1
          className="font-cormorant font-light leading-[1.05] tracking-tight text-[var(--ink)]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          {TITLE_WORDS.map((word, i) => (
            <span
              key={word}
              className="inline-block mr-[0.2em] opacity-0"
              style={
                mounted
                  ? { animation: `fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.12}s forwards` }
                  : {}
              }
            >
              {word}
            </span>
          ))}
        </h1>

        <blockquote
          className="max-w-xl text-center opacity-0 border-none pl-0 my-0"
          style={mounted ? { animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 1.1s forwards" } : {}}
        >
          <p
            className="font-fraunces italic text-[var(--ink-soft)]"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
          >
            «{QUOTES.steiner1}»
          </p>
        </blockquote>

        <div
          className="flex flex-wrap items-center justify-center gap-4 opacity-0"
          style={mounted ? { animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 1.4s forwards" } : {}}
        >
          <Button href="/book/order" variant="gold">
            Купить книгу
          </Button>
          <Button href="/seminars" variant="ghost">
            Записаться на семинар
          </Button>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
          style={mounted ? { animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 2.2s forwards" } : {}}
          aria-hidden="true"
        >
          <span className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]/60">
            листать
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[var(--gold)]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

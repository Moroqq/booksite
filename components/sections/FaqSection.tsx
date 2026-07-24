"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeSection from "@/components/ui/FadeSection";
import { FAQ } from "@/lib/content";

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;

  return (
    <FadeSection delay={index * 60}>
      <div className="border-b border-[var(--line)] last:border-none">
        <button
          className="w-full flex items-start justify-between gap-4 py-6 text-left group"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
        >
          <span className="font-cormorant text-xl font-medium text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors duration-300">
            {question}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 mt-1 text-[var(--gold)] transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
        <div
          id={id}
          className={`overflow-hidden transition-all duration-500 ease-smooth ${
            open ? "max-h-96 pb-6" : "max-h-0"
          }`}
        >
          <p className="font-inter text-[var(--ink-soft)] leading-relaxed">{answer}</p>
        </div>
      </div>
    </FadeSection>
  );
}

export default function FaqSection() {
  return (
    <section className="section-padding bg-[var(--bg)]" aria-labelledby="faq-heading">
      <div className="container-layout max-w-3xl">
        <FadeSection className="mb-12">
          <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">
            Вопросы и ответы
          </p>
          <h2
            id="faq-heading"
            className="font-cormorant font-light text-[var(--ink)]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
          >
            Часто спрашивают
          </h2>
        </FadeSection>

        <div>
          {FAQ.map((item, i) => (
            <FaqItem key={i} index={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

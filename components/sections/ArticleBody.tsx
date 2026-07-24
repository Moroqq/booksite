"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/lib/articles";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: EASE,
    },
  }),
};

function AnimatedLead({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p
      className="font-fraunces italic leading-relaxed text-[var(--ink-soft)]"
      style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 12, letterSpacing: "0.04em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
          transition={{
            delay: 0.6 + i * 0.04,
            duration: 0.5,
            ease: EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export default function ArticleBody({ article }: { article: Article }) {
  return (
    <>
      {/* Hero */}
      <section data-theme="light" className="section-padding bg-[var(--bg)]">
        <div className="container-layout max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6"
          >
            <Link
              href="/blog"
              className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] link-underline"
            >
              ← Все статьи
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
          >
            <time className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50 block mb-5">
              {formatDate(article.date)} · {article.readingTime} мин
            </time>
            <h1
              className="font-cormorant font-light text-[var(--ink)] mb-8"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {article.title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-12"
          >
            <AnimatedLead text={article.lead} />
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section data-theme="light" className="pb-24 bg-[var(--bg)]">
        <div className="container-layout max-w-3xl">
          <div className="space-y-7">
            {article.sections.map((section, i) => {
              if (section.type === "heading") {
                return (
                  <motion.h2
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="font-cormorant font-light text-[var(--ink)] mt-10"
                    style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                  >
                    {section.text}
                  </motion.h2>
                );
              }

              if (section.type === "quote") {
                return (
                  <motion.blockquote
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                  >
                    <p>«{section.text}»</p>
                    {section.cite && (
                      <footer className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mt-3">
                        {section.cite}
                      </footer>
                    )}
                  </motion.blockquote>
                );
              }

              return (
                <motion.p
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="font-inter text-[var(--ink-soft)] leading-relaxed"
                >
                  {section.text}
                </motion.p>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-16 pt-10 border-t border-[var(--line)] flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <div className="flex-1">
              <p className="font-cormorant text-xl text-[var(--ink)] mb-1">Хотите узнать больше?</p>
              <p className="font-inter text-sm text-[var(--ink-soft)]">
                Полная теория и практика — в книге и на семинарах.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/book#order"
                className="btn-gold font-inter text-xs uppercase tracking-widest px-5 py-2.5 rounded-full"
              >
                Книга
              </Link>
              <Link
                href="/seminars"
                className="font-inter text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--gold)] hover:text-[var(--ink)] transition-colors duration-300"
              >
                Семинары
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

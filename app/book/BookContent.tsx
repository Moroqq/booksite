"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { BOOK_INFO, QUOTES, TESTIMONIALS } from "@/lib/content";

function TocAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--line)] rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--gold)]/5 transition-colors duration-300"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-cormorant text-xl text-[var(--ink)]">Оглавление</span>
        <ChevronDown
          size={20}
          className={`text-[var(--gold)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[800px]" : "max-h-0"}`}>
        <ol className="px-6 pb-6 space-y-3">
          {BOOK_INFO.toc.map((item, i) => (
            <li key={i} className="flex items-start gap-4 font-inter text-sm text-[var(--ink-soft)]">
              <span className="text-[var(--gold)] font-light mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function BookContent({ spreads }: { spreads: number[] }) {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeSection className="flex justify-center">
              <div className="relative" style={{ perspective: 800 }}>
                <div
                  className="relative w-56 md:w-72 shadow-2xl rounded-sm overflow-hidden"
                  style={{ boxShadow: "20px 20px 60px rgba(0,0,0,0.15)" }}
                >
                  <Image
                    src="/images/book-cover.jpg"
                    alt="Обложка книги «Духовная звукотерапия гласных и согласных звуков»"
                    width={288}
                    height={408}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div
                  className="absolute -inset-10 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(201,162,75,0.08), transparent 70%)" }}
                  aria-hidden="true"
                />
              </div>
            </FadeSection>

            <div>
              <FadeSection delay={100}>
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Книга</p>
                <h1
                  className="font-cormorant font-light text-[var(--ink)] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  {BOOK_INFO.title}
                </h1>
                <p className="font-inter text-sm text-[var(--ink-soft)] mb-1">{BOOK_INFO.author}</p>
                <p className="font-inter text-xs text-[var(--ink-soft)]/60 uppercase tracking-wider mb-8">
                  {BOOK_INFO.publisher}, {BOOK_INFO.year} · {BOOK_INFO.pages} стр. · ISBN {BOOK_INFO.isbn}
                </p>
              </FadeSection>
              <FadeSection delay={150}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed mb-4">{BOOK_INFO.annotation}</p>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed mb-8">{BOOK_INFO.audience}</p>
              </FadeSection>
              <FadeSection delay={200}>
                <TocAccordion />
              </FadeSection>
              <FadeSection delay={250}>
                <div className="mt-8 flex items-center gap-4">
                  <span className="font-cormorant text-4xl text-[var(--gold)]">{BOOK_INFO.priceFormatted}</span>
                  <Button href="/book/order" variant="gold">Купить</Button>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* Развороты показываем, только если файлы есть — иначе блок скрыт */}
        {spreads.length > 0 && (
          <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-label="Страницы из книги">
            <div className="container-layout">
              <FadeSection className="mb-12 text-center">
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Внутри книги</p>
                <h2
                  className="font-cormorant font-light text-white"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
                >
                  Страницы и развороты
                </h2>
              </FadeSection>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {spreads.map((n) => (
                  <FadeSection key={n} delay={n * 60}>
                    <Image
                      src={`/images/spread-${n}.jpg`}
                      alt={`Разворот ${n} из книги «Духовная звукотерапия»`}
                      width={240}
                      height={170}
                      className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                  </FadeSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quotes */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-3xl">
            <FadeSection>
              <div className="space-y-10">
                {[QUOTES.steiner2, QUOTES.breath, QUOTES.arnold1].map((q, i) => (
                  <blockquote key={i}>
                    <p>«{q}»</p>
                    {i === 0 && (
                      <footer className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mt-3">
                        {QUOTES.steiner2Source}
                      </footer>
                    )}
                  </blockquote>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Testimonials */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-label="Отзывы читателей">
          <div className="container-layout">
            <FadeSection className="mb-12">
              <h2
                className="font-cormorant font-light text-[var(--ink)] text-center"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
              >
                Что говорят читатели
              </h2>
            </FadeSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <FadeSection key={i} delay={i * 80}>
                  <figure className="p-6 rounded-2xl border border-[var(--line)] bg-white/40 h-full flex flex-col">
                    <blockquote className="border-none pl-0 my-0 flex-1">
                      <p className="font-fraunces italic text-[var(--ink-soft)] leading-relaxed">«{t.text}»</p>
                    </blockquote>
                    <figcaption className="mt-4 pt-4 border-t border-[var(--line)]">
                      <span className="font-inter text-sm text-[var(--ink)] block">{t.author}</span>
                      {t.role && (
                        <span className="font-inter text-xs text-[var(--ink-soft)]/60 uppercase tracking-wider">
                          {t.role}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

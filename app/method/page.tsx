import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import VowelCircle from "@/components/sections/VowelCircle";
import ZodiacCircle from "@/components/sections/ZodiacCircle";
import BreathingScene from "@/components/sections/BreathingScene";
import MusicOfSpheres from "@/components/sections/MusicOfSpheres";
import SevenProcesses from "@/components/sections/SevenProcesses";
import ThreeRings from "@/components/sections/ThreeRings";
import { METHOD_OVERVIEW, QUOTES } from "@/lib/content";
import { vowelSoundsReady } from "@/lib/media";

export const metadata: Metadata = {
  title: "Метод духовной звукотерапии — гласные, согласные, планеты, зодиак",
};

const ANTHROPOSOPHIC_BODIES = [
  { name: "Физическое тело", description: "Видимая, осязаемая форма. Несёт в себе минеральное царство." },
  { name: "Эфирное тело", description: "Тело жизни. Поддерживает жизненные процессы, ритмы роста и восстановления." },
  { name: "Астральное тело", description: "Тело чувств и ощущений. Несёт в себе мир внутренних переживаний." },
  { name: "Я-организация", description: "Духовное ядро человека. Индивидуальное Я, которое пронизывает и преобразует все остальные тела." },
];

export default function MethodPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-3xl">
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Метод</p>
              <h1 className="font-cormorant font-light text-[var(--ink)] mb-8" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                Духовная звукотерапия<br />
                <span className="text-[var(--gold)]">гласных и согласных</span>
              </h1>
              <p className="font-inter text-[var(--ink-soft)] text-lg leading-relaxed">
                {METHOD_OVERVIEW.intro}
              </p>
            </FadeSection>
          </div>
        </section>

        {/* Four steps */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="steps-heading">
          <div className="container-layout">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Основы</p>
              <h2 id="steps-heading" className="font-cormorant font-light text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Дыхание — Звук — Ритм — Речь
              </h2>
            </FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {METHOD_OVERVIEW.steps.map((step, i) => (
                <FadeSection key={step.title} delay={i * 80}>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--gold)]/40 transition-colors duration-300 h-full">
                    <span className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] block mb-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-cormorant text-2xl font-medium text-white mb-3">{step.title}</h3>
                    <p className="font-inter text-sm text-[var(--text-on-dark-soft)] leading-relaxed">{step.description}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* Vowels circle */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="vowels-heading">
          <div className="container-layout">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Интерактив</p>
              <h2 id="vowels-heading" className="font-cormorant font-light text-[var(--ink)]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Гласные звуки и планеты
              </h2>
              <p className="font-inter text-[var(--ink-soft)] mt-4 max-w-xl">
                Каждый гласный звук связан с определённой планетой и её формообразующей силой. Нажмите на гласную, чтобы узнать подробнее.
              </p>
            </FadeSection>
            <FadeSection delay={100}>
              <VowelCircle soundsReady={vowelSoundsReady()} />
            </FadeSection>
          </div>
        </section>

        {/* Zodiac circle */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="zodiac-heading">
          <div className="container-layout">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Интерактив</p>
              <h2 id="zodiac-heading" className="font-cormorant font-light text-[var(--ink)]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Согласные звуки и зодиакальный круг
              </h2>
              <p className="font-inter text-[var(--ink-soft)] mt-4 max-w-xl">
                Согласные несут в себе силы зодиакального круга. Каждый знак связан с определёнными звуками, органами и процессами в теле.
              </p>
            </FadeSection>
            <FadeSection delay={100}>
              <ZodiacCircle />
            </FadeSection>
          </div>
        </section>

        {/* В книге teaser */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="inbook-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection className="mb-12">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">В книге</p>
              <h2 id="inbook-heading" className="font-cormorant font-light text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Практика звукотерапии
              </h2>
              <p className="font-inter text-[var(--text-on-dark-soft)] mt-4">
                Полные звукоряды, авторские методики и разборы из практики — в книге и на семинарах.
              </p>
            </FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "Звукоряды", desc: "Более 6 000 звукорядов, разработанных Арнольдом за десятилетия практики." },
                { title: "Методики", desc: "Пошаговые алгоритмы для специалистов и самостоятельной работы с голосом." },
                { title: "Примеры из практики", desc: "Реальные случаи из работы Арнольда с детьми и взрослыми." },
              ].map((card, i) => (
                <FadeSection key={card.title} delay={i * 80}>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--gold)]/40 transition-colors duration-300 h-full flex flex-col gap-3">
                    <h3 className="font-cormorant text-xl font-medium text-[var(--gold)]">{card.title}</h3>
                    <p className="font-inter text-sm text-[var(--text-on-dark-soft)] leading-relaxed">{card.desc}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
            <FadeSection delay={260} className="mt-8">
              <Button href="/book" variant="gold">Купить книгу</Button>
            </FadeSection>
          </div>
        </section>

        {/* Строение человека — Три кольца */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="bodies-heading">
          <div className="container-layout">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Антропософия</p>
              <h2 id="bodies-heading" className="font-cormorant font-light text-[var(--ink)]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Строение человека
              </h2>
              <p className="font-inter text-[var(--ink-soft)] mt-4 max-w-xl">
                Метод работает с четырьмя «телами» человека в понимании антропософии.
                Нажмите на кольцо, чтобы узнать подробнее.
              </p>
            </FadeSection>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <FadeSection delay={100} className="flex-shrink-0">
                <ThreeRings />
              </FadeSection>
              <FadeSection delay={180} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {ANTHROPOSOPHIC_BODIES.map((body, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-[var(--line)] bg-white/40">
                    <h3 className="font-cormorant text-lg font-medium text-[var(--gold)] mb-2">{body.name}</h3>
                    <p className="font-inter text-sm text-[var(--ink-soft)] leading-relaxed">{body.description}</p>
                  </div>
                ))}
              </FadeSection>
            </div>
          </div>
        </section>

        {/* Дыхание + Музыка сфер + Семь процессов */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="interactive-scenes-heading">
          <div className="container-layout">
            <FadeSection className="mb-14 text-center">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Интерактивные схемы</p>
              <h2 id="interactive-scenes-heading" className="font-cormorant font-light text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Дыхание, планеты, процессы
              </h2>
            </FadeSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FadeSection delay={80}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-6">Дыхание</p>
                  <BreathingScene />
                </div>
              </FadeSection>
              <FadeSection delay={160}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-6">Музыка сфер</p>
                  <MusicOfSpheres />
                </div>
              </FadeSection>
              <FadeSection delay={240}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-6">Семь процессов</p>
                  <SevenProcesses />
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="applications-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection className="mb-10">
              <h2 id="applications-heading" className="font-cormorant font-light text-[var(--text-on-dark)]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Области применения
              </h2>
            </FadeSection>
            <FadeSection delay={100}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {METHOD_OVERVIEW.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-3 font-inter text-sm text-[var(--text-on-dark-soft)]">
                    <span className="text-[var(--gold)] mt-0.5 shrink-0">—</span>
                    {app}
                  </li>
                ))}
              </ul>
              {/* Disclaimer — gold-bordered plaque */}
              <div className="border-l-2 border-[var(--gold)] pl-5 py-1">
                <p className="font-inter text-sm text-[var(--text-on-dark-soft)] leading-relaxed">
                  {METHOD_OVERVIEW.disclaimer}
                </p>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Steiner quote */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-2xl text-center">
            <FadeSection>
              <blockquote>
                <p className="font-fraunces italic" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
                  «{QUOTES.steiner3}»
                </p>
                <footer className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mt-5">
                  Рудольф Штайнер
                </footer>
              </blockquote>
            </FadeSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { SEMINAR_AUDIENCE } from "@/lib/seminars";
import { getAllSeminars } from "@/lib/seminars-db";

export const metadata: Metadata = {
  title: "Семинары по духовной звукотерапии",
};

export const dynamic = "force-dynamic";

const FORMAT_COLORS: Record<string, string> = {
  Очный: "text-[var(--rose-color)]",
  Онлайн: "text-[var(--sky-color)]",
  Выездной: "text-[var(--sage)]",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function SeminarsPage() {
  const SEMINARS = getAllSeminars();
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-3xl">
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Обучение</p>
              <h1 className="font-cormorant font-light text-[var(--ink)] mb-6" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                Семинары по духовной<br />звукотерапии
              </h1>
              <p className="font-inter text-[var(--ink-soft)] text-lg leading-relaxed">
                Очные и онлайн-форматы. Практика живого звука, звукоряды, работа в парах и группах.
                Ведущая — Татьяна Рожукене-Дорхаут Мэйс.
              </p>
            </FadeSection>
          </div>
        </section>

        {/* Seminar cards */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="schedule-heading">
          <div className="container-layout">
            <FadeSection className="mb-12">
              <h2 id="schedule-heading" className="font-cormorant font-light text-[var(--ink)]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Ближайшие даты
              </h2>
            </FadeSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SEMINARS.map((seminar, i) => (
                <FadeSection key={seminar.id} delay={i * 80}>
                  <article id={seminar.id} className="flex flex-col h-full rounded-2xl border border-[var(--line)] bg-white/60 hover:border-[var(--gold)]/40 hover:shadow-lg transition-all duration-500 overflow-hidden p-7">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`font-inter text-xs uppercase tracking-widest ${FORMAT_COLORS[seminar.format]}`}>
                        {seminar.format}
                      </span>
                      {seminar.spotsLeft <= 4 && (
                        <span className="font-inter text-xs text-[var(--rose-color)] bg-[var(--rose-color)]/10 px-2 py-0.5 rounded-full">
                          Осталось {seminar.spotsLeft} мест
                        </span>
                      )}
                    </div>
                    <h2 className="font-cormorant text-2xl font-medium text-[var(--ink)] mb-3">{seminar.title}</h2>
                    <p className="font-inter text-sm text-[var(--ink-soft)] leading-relaxed mb-6">{seminar.description}</p>
                    <div className="mt-auto">
                      <div className="mb-4 space-y-1.5 border-t border-[var(--line)] pt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50 w-20">Место</span>
                          <span className="font-inter text-sm text-[var(--ink-soft)]">{seminar.location}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50 w-20 pt-0.5">Даты</span>
                          <span className="font-inter text-sm text-[var(--ink-soft)]">
                            {seminar.sessionDates?.length ? seminar.sessionDates.join(", ") : `${formatDate(seminar.dateStart)} — ${formatDate(seminar.dateEnd)}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50 w-20">Формат</span>
                          <span className="font-inter text-sm text-[var(--ink-soft)]">{seminar.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50 w-20">Ведущий</span>
                          <span className="font-inter text-sm text-[var(--ink-soft)]">{seminar.instructor}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-cormorant text-3xl text-[var(--gold)]">{seminar.priceFormatted}</span>
                        <Button href="mailto:info@zvukoterapia.ru" variant="ghost">Написать нам</Button>
                      </div>
                    </div>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* For whom */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="audience-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection className="mb-10">
              <h2 id="audience-heading" className="font-cormorant font-light text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Для кого эти семинары
              </h2>
            </FadeSection>
            <FadeSection delay={100}>
              <div className="flex flex-wrap gap-3">
                {SEMINAR_AUDIENCE.map((a, i) => (
                  <span
                    key={i}
                    className="font-inter text-sm text-[var(--text-on-dark-soft)] bg-white/5 border border-white/10 px-4 py-2 rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Individual */}
        <section className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-3xl text-center">
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Индивидуально</p>
              <h2 className="font-cormorant font-light text-[var(--ink)] mb-6" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                Нет подходящей даты?
              </h2>
              <p className="font-inter text-[var(--ink-soft)] mb-8">
                Напишите нам — мы подберём формат: индивидуальную консультацию или запишем вас в группу продолжающих.
              </p>
              <Button href="mailto:info@zvukoterapia.ru" variant="ghost">Написать нам</Button>
            </FadeSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

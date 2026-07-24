import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import Image from "next/image";
import { ARNOLD_BIO, TATIANA_BIO, QUOTES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Арнольд Дорхаут Мэйс и Институт духовной звукотерапии",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout max-w-4xl">
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Об авторах</p>
              <h1 className="font-cormorant font-light text-[var(--ink)] mb-6" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                Арнольд Дорхаут Мэйс<br />
                <span className="text-[var(--gold)]">1935–2018</span>
              </h1>
            </FadeSection>
            <FadeSection delay={100}>
              <p className="font-inter text-[var(--ink-soft)] text-lg leading-relaxed max-w-2xl">
                {ARNOLD_BIO.shortBio}
              </p>
            </FadeSection>
          </div>
        </section>

        {/* Photos + bio */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-label="Биография Арнольда">
          <div className="container-layout grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Photos */}
            <FadeSection className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <Image
                  key={n}
                  src={`/images/arnold-${n}.jpg`}
                  alt={`Арнольд Дорхаут Мэйс — фото ${n}`}
                  width={320}
                  height={240}
                  className="w-full h-auto rounded-2xl shadow-md"
                />
              ))}
            </FadeSection>

            {/* Bio text */}
            <div className="lg:col-span-2 space-y-8">
              <FadeSection delay={100}>
                <blockquote>
                  <p>«{QUOTES.arnold1}»</p>
                </blockquote>
              </FadeSection>
              <FadeSection delay={150}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                  Родился 18 апреля 1935 г. в нидерландском городке Эссен. Мать — шведка, отец — голландец.
                  С детства любил петь и слушать природу. В 1953 году начал учиться биодинамическому земледелию,
                  где познакомился с антропософией и эвритмией.
                </p>
              </FadeSection>
              <FadeSection delay={200}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                  В 1958 году переехал в Дорнах (Швейцария) учиться лечебной эвритмии. В 1964–65 гг. защитил
                  диплом в Стокгольме. Работал в Голландии с неговорящими детьми, занимался музыкальной терапией
                  с Фредерикой Лангеркорш.
                </p>
              </FadeSection>
              <FadeSection delay={250}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                  В 1972 году в Бруммене встретил Тие Онэ Майер-Смитс и Лори Майер-Смитс — учениц великой
                  Вальборг Вербек-Свердстрём. С этого года начинается формирование метода духовной звукотерапии.
                  К 1973 году было наработано около 6 000 звукорядов.
                </p>
              </FadeSection>
              <FadeSection delay={300}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                  Преподавал в Германии, Голландии, Швеции, Финляндии, США, Новой Зеландии, Литве.
                  В 2009 году приехал в Санкт-Петербург, остался в России, принял православие.
                  Ушёл из жизни 3 апреля 2018 г. Похоронен на Смоленском кладбище в Санкт-Петербурге.
                </p>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]" aria-labelledby="timeline-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Хронология</p>
              <h2 id="timeline-heading" className="font-cormorant font-light text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                Ключевые события
              </h2>
            </FadeSection>
            <ol className="relative border-l border-[var(--gold)]/30 ml-4 space-y-0">
              {ARNOLD_BIO.timeline.map((event, i) => (
                <FadeSection key={i} delay={i * 60} as="li" className="pl-8 pb-10 last:pb-0">
                  <div className="absolute -left-2 w-4 h-4 rounded-full border-2 border-[var(--gold)] bg-[var(--bg-deep)]" aria-hidden="true" />
                  <span className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] block mb-1">
                    {event.year}
                  </span>
                  <p className="font-inter text-sm text-[var(--text-on-dark-soft)] leading-relaxed">
                    {event.text}
                  </p>
                </FadeSection>
              ))}
            </ol>
          </div>
        </section>

        {/* Tatiana */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="tatiana-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Соавтор</p>
              <h2 id="tatiana-heading" className="font-cormorant font-light text-[var(--ink)] mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                {TATIANA_BIO.name}
              </h2>
              <p className="font-inter text-sm text-[var(--ink-soft)]/70 uppercase tracking-wider mb-6">
                {TATIANA_BIO.role}
              </p>
              <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                {TATIANA_BIO.description}
              </p>
            </FadeSection>
          </div>
        </section>

        {/* Institute */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="institute-heading">
          <div className="container-layout max-w-3xl">
            <FadeSection>
              <div className="p-8 rounded-2xl border border-[var(--line)] bg-white/40">
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Институт</p>
                <h2 id="institute-heading" className="font-cormorant text-2xl font-medium text-[var(--ink)] mb-4">
                  Институт духовной звукотерапии гласных и согласных им. А. Д. Мэйс
                </h2>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed mb-4">
                  Основан в память об Арнольде Дорхаут Мэйс. Институт ведёт образовательную деятельность
                  в России и Нидерландах, организует семинары, готовит специалистов в области духовной
                  звукотерапии, сохраняет и развивает метод.
                </p>
                <p className="font-inter text-sm text-[var(--ink-soft)]/70">
                  Санкт-Петербург · Нидерланды
                </p>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Verbeck quote */}
        <section data-theme="dark" className="section-padding bg-[var(--bg-deep)]">
          <div className="container-layout max-w-2xl text-center">
            <FadeSection>
              <blockquote className="border-none pl-0 my-0">
                <p className="font-fraunces italic text-white/90" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}>
                  «{QUOTES.verbeck}»
                </p>
                <footer className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mt-6">
                  {QUOTES.verbeckSource}
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

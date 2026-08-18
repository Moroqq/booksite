import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import FadeImage from "@/components/ui/FadeImage";
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
                <FadeImage
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

        {/* Tatiana */}
        <section data-theme="light" className="section-padding bg-[var(--bg)]" aria-labelledby="tatiana-heading">
          <div className="container-layout max-w-4xl">
            <FadeSection className="mb-12">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Автор</p>
              <h2 id="tatiana-heading" className="font-cormorant font-light text-[var(--ink)] mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
                {TATIANA_BIO.name}
              </h2>
              <p className="font-inter text-sm text-[var(--ink-soft)]/70 uppercase tracking-wider">
                {TATIANA_BIO.role}
              </p>
            </FadeSection>
          </div>
          <div className="container-layout grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Photos */}
            <FadeSection className="flex flex-col gap-4">
              {[
                { src: "/images/tatiana-1.jpg", alt: "Татьяна Рожукене-Дорхаут Мэйс проводит занятие" },
                { src: "/images/tatiana-2.jpg", alt: "Татьяна Рожукене-Дорхаут Мэйс" },
                { src: "/images/tatiana-pink.jpg", alt: "Татьяна Рожукене-Дорхаут Мэйс" },
                { src: "/images/tatiana-group.jpg", alt: "Татьяна Рожукене-Дорхаут Мэйс с группой участников занятий" },
              ].map((photo) => (
                <FadeImage
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  width={320}
                  height={240}
                  className="w-full h-auto rounded-2xl shadow-md"
                />
              ))}
            </FadeSection>

            {/* Bio text */}
            <div className="lg:col-span-2 space-y-5">
              {TATIANA_BIO.bio.map((paragraph, i) => (
                <FadeSection key={i} delay={i * 40}>
                  <p className="font-inter text-[var(--ink-soft)] leading-relaxed">
                    {paragraph}
                  </p>
                </FadeSection>
              ))}
              <FadeSection delay={TATIANA_BIO.bio.length * 40}>
                <p className="font-inter text-[var(--ink-soft)] leading-relaxed italic border-l-2 border-[var(--gold)]/40 pl-4 mt-2">
                  {TATIANA_BIO.closing}
                </p>
              </FadeSection>

              <FadeSection delay={TATIANA_BIO.bio.length * 40 + 60} className="pt-4">
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Дипломы</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { src: "/images/tatiana-diploma-1.jpg", alt: "Диплом лечебного педагога, Бад-Боль, Германия, 2002" },
                    { src: "/images/tatiana-diploma-2.jpg", alt: "Свидетельство Rudolf Steinerseminariet, Ярна, Швеция" },
                  ].map((diploma) => (
                    <a key={diploma.src} href={diploma.src} target="_blank" rel="noopener noreferrer" className="block">
                      <FadeImage
                        src={diploma.src}
                        alt={diploma.alt}
                        width={320}
                        height={452}
                        className="w-full h-auto rounded-xl border border-[var(--line)] shadow-sm transition-opacity hover:opacity-80"
                      />
                    </a>
                  ))}
                </div>
              </FadeSection>
            </div>
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

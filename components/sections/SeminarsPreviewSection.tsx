import Link from "next/link";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { getAllSeminars } from "@/lib/seminars-db";

const FORMAT_COLORS: Record<string, string> = {
  Очный: "text-[var(--rose)]",
  Онлайн: "text-[var(--sky-color)]",
  Выездной: "text-[var(--sage)]",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SeminarsPreviewSection() {
  const upcoming = getAllSeminars().slice(0, 3);

  return (
    <section className="section-padding bg-[var(--bg)]" aria-labelledby="seminars-preview-heading">
      <div className="container-layout">
        <FadeSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">
              Ближайшие семинары
            </p>
            <h2
              id="seminars-preview-heading"
              className="font-cormorant font-light text-[var(--ink)]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
            >
              Практика живого звука
            </h2>
          </div>
          <Button href="/seminars" variant="ghost">
            Все семинары
          </Button>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((seminar, i) => (
            <FadeSection key={seminar.id} delay={i * 80}>
              <article className="group relative flex flex-col h-full rounded-2xl border border-[var(--line)] bg-white/60 hover:border-[var(--gold)]/40 hover:shadow-lg transition-all duration-500 overflow-hidden p-6">
                {/* Format badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-inter text-xs uppercase tracking-widest ${FORMAT_COLORS[seminar.format]}`}
                  >
                    {seminar.format}
                  </span>
                  {seminar.spotsLeft <= 4 && (
                    <span className="font-inter text-xs text-[var(--rose)] bg-[var(--rose)]/10 px-2 py-0.5 rounded-full">
                      Осталось {seminar.spotsLeft} мест
                    </span>
                  )}
                </div>

                <h3 className="font-cormorant text-xl font-medium text-[var(--ink)] mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">
                  {seminar.title}
                </h3>

                <p className="font-inter text-sm text-[var(--ink-soft)] leading-relaxed mb-auto">
                  {seminar.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-sm text-[var(--ink-soft)]">
                      {seminar.location}
                    </span>
                    <span className="font-cormorant text-lg text-[var(--gold)]">
                      {seminar.priceFormatted}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-[var(--ink-soft)]/60">
                    {formatDate(seminar.dateStart)} — {formatDate(seminar.dateEnd)} · {seminar.duration}
                  </p>
                </div>

                <Link
                  href={`/seminars#${seminar.id}`}
                  className="mt-5 btn-gold font-inter text-xs uppercase tracking-widest px-5 py-2.5 rounded-full text-center transition-all duration-300"
                >
                  Записаться
                </Link>
              </article>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

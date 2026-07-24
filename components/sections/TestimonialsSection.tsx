import FadeSection from "@/components/ui/FadeSection";
import { TESTIMONIALS, QUOTES } from "@/lib/content";

export default function TestimonialsSection() {
  return (
    <section
      data-theme="dark"
      className="section-padding"
      style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #047857 100%)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container-layout">
        <FadeSection className="text-center mb-16">
          <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">
            Отзывы
          </p>
          <blockquote className="border-none pl-0 my-0 max-w-2xl mx-auto">
            <p
              className="font-fraunces italic text-white/90"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
            >
              «{QUOTES.steiner2}»
            </p>
            <footer className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mt-4">
              {QUOTES.steiner2Source}
            </footer>
          </blockquote>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeSection key={i} delay={i * 80}>
              <figure className="flex flex-col h-full p-7 rounded-2xl border border-white/10 bg-white/5 hover:border-[var(--gold)]/30 transition-colors duration-300">
                <blockquote className="border-none pl-0 my-0 flex-1">
                  <p className="font-fraunces italic text-[var(--text-on-dark-soft)] leading-relaxed text-base">
                    «{t.text}»
                  </p>
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-white/10">
                  <span className="font-inter text-sm text-white block">{t.author}</span>
                  {t.role && (
                    <span className="font-inter text-xs text-[var(--text-on-dark-muted)] uppercase tracking-wider">
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
  );
}

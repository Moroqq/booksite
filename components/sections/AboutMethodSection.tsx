import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { METHOD_OVERVIEW, QUOTES } from "@/lib/content";

export default function AboutMethodSection() {
  return (
    <section className="section-padding !pt-5 bg-[var(--bg)]" aria-labelledby="method-heading">
      <div className="container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: intro */}
          <div>
            <FadeSection>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">
                О методе
              </p>
              <h2
                id="method-heading"
                className="font-cormorant font-light text-[var(--ink)] mb-8"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Звук — это не просто фонема,
                <br />а <em className="text-[var(--gold)] not-italic">формообразующий поток</em>
              </h2>
            </FadeSection>
            <FadeSection delay={100}>
              <p className="font-inter text-[var(--ink-soft)] leading-relaxed mb-8">
                {METHOD_OVERVIEW.intro}
              </p>
            </FadeSection>
            <FadeSection delay={200}>
              <blockquote className="mb-8">
                <p>«{QUOTES.breath}»</p>
              </blockquote>
            </FadeSection>
            <FadeSection delay={300}>
              <Button href="/method" variant="ghost">
                Читать о методе подробно
              </Button>
            </FadeSection>
          </div>

          {/* Right: four steps + applications */}
          <div className="space-y-8">
            <FadeSection delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {METHOD_OVERVIEW.steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="p-5 rounded-2xl border border-[var(--line)] bg-white/40 hover:border-[var(--gold)]/40 transition-colors duration-300"
                  >
                    <span className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] block mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-cormorant text-xl font-medium text-[var(--ink)] mb-2">
                      {step.title}
                    </h3>
                    <p className="font-inter text-sm text-[var(--ink-soft)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </FadeSection>

            <FadeSection delay={200}>
              <div className="p-6 rounded-2xl bg-[var(--bg-deep)] text-[var(--gold-soft)]">
                <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-4">
                  Метод помогает при
                </p>
                <ul className="space-y-2">
                  {METHOD_OVERVIEW.applications.map((app) => (
                    <li key={app} className="flex items-start gap-3 font-inter text-sm">
                      <span className="text-[var(--gold)] mt-0.5 shrink-0">—</span>
                      <span className="text-[var(--gold-soft)]/80">{app}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-xs text-[var(--gold-soft)]/50 mt-5 border-t border-white/10 pt-4">
                  {METHOD_OVERVIEW.disclaimer}
                </p>
              </div>
            </FadeSection>
          </div>
        </div>
      </div>
    </section>
  );
}

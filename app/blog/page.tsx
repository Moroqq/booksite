import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeSection from "@/components/ui/FadeSection";
import { getPublishedArticles } from "@/lib/articles-db";

export const metadata: Metadata = {
  title: "Статьи о духовной звукотерапии — практики и размышления",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const articles = getPublishedArticles();
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        <section data-theme="light" className="section-padding bg-[var(--bg)]">
          <div className="container-layout">
            <FadeSection className="mb-14">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">Статьи</p>
              <h1
                className="font-cormorant font-light text-[var(--ink)]"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                Практики и размышления
              </h1>
            </FadeSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article, i) => (
                <FadeSection key={article.slug} delay={i * 80}>
                  <article className="group flex flex-col h-full">
                    <Link href={`/blog/${article.slug}`} className="block">
                      <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)]/30 mb-5 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow duration-300">
                        <span
                          className="font-cormorant text-6xl font-light text-[var(--gold)]/40"
                          aria-hidden="true"
                        >
                          {article.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <time className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/50">
                          {formatDate(article.date)}
                        </time>
                        <span className="font-inter text-xs text-[var(--ink-soft)]/40">
                          · {article.readingTime} мин
                        </span>
                      </div>
                      <h2 className="font-cormorant text-2xl font-medium text-[var(--ink)] mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">
                        {article.title}
                      </h2>
                      <p className="font-inter text-sm text-[var(--ink-soft)] leading-relaxed">
                        {article.excerpt}
                      </p>
                      <span className="font-inter text-sm text-[var(--gold)] mt-4 inline-block link-underline">
                        Читать дальше
                      </span>
                    </Link>
                  </article>
                </FadeSection>
              ))}
            </div>
            {articles.length === 0 && (
              <p className="font-inter text-[var(--ink-soft)]">Опубликованных статей пока нет.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

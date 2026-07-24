import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/sections/ArticleBody";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        <ArticleBody article={article} />
      </main>
      <Footer />
    </>
  );
}

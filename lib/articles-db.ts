import crypto from "node:crypto";
import { ARTICLES, type Article, type ArticleSection } from "./articles";
import { readLocalData, writeLocalData } from "./local-data";

export type ArticleStatus = "draft" | "published";
export type AdminArticle = Article & { id: string; status: ArticleStatus; updatedAt: string };
export type ArticleInput = { title: string; excerpt: string; lead: string; body: string; status: ArticleStatus; date: string };
type StoredArticle = Omit<AdminArticle, "readingTime" | "sections"> & { body: string };
type Store = { articles: StoredArticle[]; seminars?: unknown; orders?: unknown };

function initialArticles(): StoredArticle[] {
  return ARTICLES.map((article, index) => ({
    id: `article-seed-${index + 1}`, slug: article.slug, title: article.title, excerpt: article.excerpt,
    lead: article.lead, body: article.sections.map((section) => section.text).join("\n\n"),
    status: "published", date: article.date, updatedAt: article.date,
  }));
}
function store() { const saved = readLocalData<Store>({ articles: initialArticles() }); return { ...saved, articles: saved.articles?.length ? saved.articles : initialArticles() }; }
function save(value: Store) { writeLocalData(value); }
function toArticle(row: StoredArticle): AdminArticle {
  const sections: ArticleSection[] = row.body.split(/\n{2,}/).map((text): ArticleSection => ({ type: "paragraph", text: text.trim() })).filter((section) => section.text);
  return { ...row, status: row.status as ArticleStatus, readingTime: Math.max(1, Math.ceil(row.body.split(/\s+/).filter(Boolean).length / 180)), sections };
}
export function getAdminArticles() { return store().articles.sort((a, b) => b.date.localeCompare(a.date)).map(toArticle); }
export function getAdminArticle(id: string) { const found = store().articles.find((article) => article.id === id); return found ? toArticle(found) : null; }
export function getPublishedArticles(): Article[] { return getAdminArticles().filter((article) => article.status === "published"); }
export function getPublishedArticleBySlug(slug: string): Article | null { return getPublishedArticles().find((article) => article.slug === slug) || null; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-+|-+$/g, "") || `article-${Date.now().toString(36)}`; }
export function createArticle(input: ArticleInput) { const value = store(); const base = slugify(input.title); let slug = base; let number = 2; while (value.articles.some((article) => article.slug === slug)) slug = `${base}-${number++}`; const id = `article-${crypto.randomUUID()}`; value.articles.push({ id, slug, ...input, updatedAt: new Date().toISOString() }); save(value); return id; }
export function updateArticle(id: string, input: ArticleInput) { const value = store(); const article = value.articles.find((item) => item.id === id); if (!article) return; Object.assign(article, input, { updatedAt: new Date().toISOString() }); save(value); }
export function deleteArticle(id: string) { const value = store(); value.articles = value.articles.filter((article) => article.id !== id); save(value); }

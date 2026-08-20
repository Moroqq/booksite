import type { Metadata } from "next";
import { existingSpreads } from "@/lib/media";
import BookContent from "./BookContent";

export const metadata: Metadata = {
  title: "Книга «Духовная звукотерапия гласных и согласных звуков»",
  description:
    "Книга Арнольда Дорхаут Мэйс о духовной звукотерапии: гласные и согласные звуки, планетарные и зодиакальные силы, терапевтическое применение.",
};

export default function BookPage() {
  // Разворотов может не быть — тогда блок «Страницы и развороты» не показывается,
  // чтобы у посетителя не было пустых мест вместо картинок.
  return <BookContent spreads={existingSpreads()} />;
}

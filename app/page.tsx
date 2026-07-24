import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroAnimationSection from "@/components/sections/IntroAnimationSection";
import AboutMethodSection from "@/components/sections/AboutMethodSection";
import BookPreviewSection from "@/components/sections/BookPreviewSection";
import SeminarsPreviewSection from "@/components/sections/SeminarsPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";

export const metadata: Metadata = {
  title: "Духовная звукотерапия гласных и согласных — метод Арнольда Д. Мэйс",
  description:
    "Авторский метод духовной звукотерапии, книга, семинары. Институт духовной звукотерапии им. А. Д. Мэйс.",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <IntroAnimationSection />
        <AboutMethodSection />
        <BookPreviewSection />
        <SeminarsPreviewSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}

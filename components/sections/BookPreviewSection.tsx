import Image from "next/image";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { BOOK_INFO } from "@/lib/content";

export default function BookPreviewSection() {
  return (
    <section
      data-theme="dark"
      className="section-padding"
      style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #047857 100%)" }}
      aria-labelledby="book-preview-heading"
    >
      <div className="container-layout">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Book mockup */}
          <FadeSection className="flex justify-center lg:justify-start">
            <div
              className="relative"
              style={{ perspective: 800 }}
            >
              <div
                className="relative w-48 md:w-64 shadow-2xl rounded-sm overflow-hidden transition-transform duration-700 hover:rotate-y-2"
                style={{ boxShadow: "20px 20px 60px rgba(0,0,0,0.5), -4px 0 20px rgba(0,0,0,0.3)" }}
              >
                <Image
                  src="/images/book-cover.png"
                  alt="Обложка книги «Духовная звукотерапия гласных и согласных звуков»"
                  width={256}
                  height={360}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUHBP/EACIQAAIBBAMBAQEAAAAAAAAAAAECAwQREiExBRNBgf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQARMiH/2gAMAwEAAhEDEQA/AKzZTi7VTkrlCFvGKVqzGmPGxnP3X4c5GOVLnVJLk3R1m3CRiRGPQY2gHb3JVt7SljUC8RLmb7biqE6NNSio3CVElFW5tBh8P4GJuJbFmDhakFW0C7aN+EGwGVv7Sf/Z"
                  priority={false}
                />
              </div>
              {/* Decorative gold glow */}
              <div
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(201,162,75,0.12), transparent 70%)",
                }}
                aria-hidden="true"
              />
            </div>
          </FadeSection>

          {/* Text */}
          <div className="text-[var(--gold-soft)]">
            <FadeSection delay={100}>
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-5">
                Книга
              </p>
              <h2
                id="book-preview-heading"
                className="font-cormorant font-light text-white mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
              >
                {BOOK_INFO.title}
              </h2>
            </FadeSection>

            <FadeSection delay={150}>
              <p className="font-inter text-sm text-[var(--gold-soft)]/80 leading-relaxed mb-4">
                {BOOK_INFO.annotation}
              </p>
              <p className="font-inter text-sm text-[var(--gold-soft)]/70 leading-relaxed mb-8">
                {BOOK_INFO.audience}
              </p>
            </FadeSection>

            <FadeSection delay={250}>
              <div className="flex items-center gap-3 mb-8">
                <span className="font-cormorant text-3xl text-[var(--gold)]">
                  {BOOK_INFO.priceFormatted}
                </span>
                <span className="font-inter text-xs text-[var(--gold-soft)]/50 uppercase tracking-wider">
                  {BOOK_INFO.pages} стр. · {BOOK_INFO.publisher}, {BOOK_INFO.year}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button href="/book#order" variant="gold">
                  Купить книгу
                </Button>
                <Button href="/book" variant="dark">
                  Подробнее о книге
                </Button>
              </div>
            </FadeSection>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthGate from "@/components/auth/AuthGate";
import { getCurrentUser, isLoginRequired } from "@/lib/customer-auth";
import { BOOK_INFO } from "@/lib/content";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Оформление заказа — Духовная звукотерапия" };

export default function BookOrderPage() {
  const user = getCurrentUser();

  if (isLoginRequired() && !user) {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-screen pt-20">
          <section className="pt-5 pb-24 bg-[var(--bg)]">
            <div className="container-layout max-w-2xl">
              <Link href="/book" className="inline-flex items-center gap-1 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]">
                <ChevronLeft size={16} /> К книге
              </Link>
              <header className="mt-5">
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Оформление заказа</p>
                <h1 className="mt-2 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">Купить книгу</h1>
                <p className="mt-3 font-inter text-[var(--ink-soft)]">{BOOK_INFO.title} · {BOOK_INFO.priceFormatted}</p>
              </header>
              <div className="mt-7">
                <AuthGate
                  next="/book/order"
                  title="Сначала войдите"
                  description="Заказ привязывается к вашему аккаунту — так вы сможете видеть его состояние: проверяем ли мы оплату, готовим к отправке или книга уже в пути."
                />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return <OrderForm user={user} />;
}

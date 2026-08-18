import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthGate from "@/components/auth/AuthGate";
import { getCurrentUser, isLoginRequired } from "@/lib/customer-auth";
import { getSeminarById } from "@/lib/seminars-db";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Запись на семинар — Духовная звукотерапия" };

export default function SeminarSignupPage({ searchParams }: { searchParams: { seminar?: string } }) {
  const seminar = searchParams.seminar ? getSeminarById(searchParams.seminar) : null;
  if (!seminar) redirect("/seminars");

  const user = getCurrentUser();
  const next = `/seminars/signup?seminar=${encodeURIComponent(seminar.id)}`;
  const dates = seminar.sessionDates?.length ? seminar.sessionDates.join(", ") : seminar.dateStart;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-5 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-2xl">
            <Link href="/seminars" className="inline-flex items-center gap-1 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]">
              <ChevronLeft size={16} /> К семинарам
            </Link>
            <header className="mt-5">
              <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Запись на семинар</p>
              <h1 className="mt-2 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">{seminar.title}</h1>
              <p className="mt-3 font-inter text-[var(--ink-soft)]">
                {dates} · {seminar.location} · {seminar.priceFormatted}
              </p>
            </header>

            <div className="mt-7">
              {isLoginRequired() && !user ? (
                <AuthGate
                  next={next}
                  title="Сначала войдите"
                  description="Запись привязывается к вашему аккаунту — так вы будете видеть даты занятий и состояние заявки: ждёт подтверждения или место за вами закреплено."
                />
              ) : (
                <SignupForm seminarId={seminar.id} user={user} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

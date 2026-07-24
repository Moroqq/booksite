"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FadeSection from "@/components/ui/FadeSection";
import Button from "@/components/ui/Button";
import { seminarSignupSchema, type SeminarSignupData, PROFESSION_LABELS } from "@/lib/schema";
import { SEMINARS } from "@/lib/seminars";

export default function ContactFormSection() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SeminarSignupData>({
    resolver: zodResolver(seminarSignupSchema),
  });

  const onSubmit = async (data: SeminarSignupData) => {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "seminar", ...data }),
    });
    setSent(true);
  };

  const inputClass =
    "w-full font-inter text-sm bg-white/60 border border-[var(--line)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--gold)] transition-colors duration-300";
  const errorClass = "font-inter text-xs text-[var(--rose)] mt-1";

  return (
    <section className="section-padding bg-[var(--bg)]" aria-labelledby="signup-heading">
      <div className="container-layout max-w-2xl">
        <FadeSection className="mb-12 text-center">
          <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-4">
            Запись на семинар
          </p>
          <h2
            id="signup-heading"
            className="font-cormorant font-light text-[var(--ink)]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
          >
            Оставьте заявку
          </h2>
          <p className="font-inter text-[var(--ink-soft)] mt-4 max-w-lg mx-auto">
            Мы свяжемся с вами и расскажем о ближайших датах, формате и условиях участия.
          </p>
        </FadeSection>

        <FadeSection delay={100}>
          {sent ? (
            <div className="text-center py-16 flex flex-col items-center gap-6">
              <div
                className="w-20 h-20 rounded-full border-2 border-[var(--gold)]"
                style={{ animation: "breathe 6s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <p className="font-cormorant text-2xl text-[var(--ink)]">
                Заявка получена
              </p>
              <p className="font-inter text-[var(--ink-soft)] text-sm">
                Мы напишем вам в течение 24 часов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <input
                    {...register("fullName")}
                    placeholder="Имя и фамилия"
                    className={inputClass}
                    aria-label="Имя и фамилия"
                  />
                  {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                </div>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className={inputClass}
                    aria-label="Email"
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Телефон"
                    className={inputClass}
                    aria-label="Телефон"
                  />
                  {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>
                <div>
                  <select
                    {...register("profession")}
                    className={`${inputClass} appearance-none cursor-pointer`}
                    aria-label="Профессия"
                    defaultValue=""
                  >
                    <option value="" disabled>Профессия</option>
                    {Object.entries(PROFESSION_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  {errors.profession && <p className={errorClass}>{errors.profession.message}</p>}
                </div>
              </div>

              <div>
                <select
                  {...register("seminarId")}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  aria-label="Семинар"
                  defaultValue=""
                >
                  <option value="" disabled>Выберите семинар</option>
                  {SEMINARS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.location}
                    </option>
                  ))}
                </select>
                {errors.seminarId && <p className={errorClass}>{errors.seminarId.message}</p>}
              </div>

              <div>
                <textarea
                  {...register("motivation")}
                  placeholder="Почему вам интересен этот метод?"
                  rows={4}
                  className={`${inputClass} resize-none`}
                  aria-label="Мотивация"
                />
                {errors.motivation && <p className={errorClass}>{errors.motivation.message}</p>}
              </div>

              <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Отправляем…" : "Отправить заявку"}
              </Button>
            </form>
          )}
        </FadeSection>
      </div>
    </section>
  );
}

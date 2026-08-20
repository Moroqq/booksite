"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, isLoginRequired } from "@/lib/customer-auth";
import { getSeminarById } from "@/lib/seminars-db";
import { createSeminarSignup, hasActiveSignup } from "@/lib/seminar-signups-db";
import { PROFESSION_LABELS } from "@/lib/schema";
import { sendSignupCreated } from "@/lib/letters";

export type SignupSubmission = {
  seminarId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  motivation: string;
};

const clean = (value: string) => value.trim();
const isPhoneComplete = (value: string) => value.replace(/\D/g, "").length === 11;

export async function submitSeminarSignup(input: SignupSubmission) {
  const user = getCurrentUser();
  if (isLoginRequired() && !user) {
    return { ok: false, message: "Сессия истекла. Войдите заново, чтобы записаться." };
  }

  const seminar = getSeminarById(clean(input.seminarId));
  if (!seminar) return { ok: false, message: "Семинар не найден. Вернитесь к списку и выберите другой." };

  if (user && hasActiveSignup(user.id, seminar.id)) {
    return { ok: false, message: "Вы уже записаны на этот семинар — заявка есть в личном кабинете." };
  }

  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const profession = clean(input.profession);
  const motivation = clean(input.motivation);

  if (!firstName || !lastName || !email) {
    return { ok: false, message: "Пожалуйста, заполните имя, фамилию и электронную почту." };
  }
  if (!isPhoneComplete(phone)) {
    return { ok: false, message: "Введите номер телефона полностью, например +7 999 000-00-00." };
  }
  if (!PROFESSION_LABELS[profession]) {
    return { ok: false, message: "Выберите, кем вы работаете." };
  }
  if (motivation.length < 10) {
    return { ok: false, message: "Расскажите чуть подробнее, почему вам интересен семинар (минимум 10 символов)." };
  }

  const signup = createSeminarSignup({
    userId: user?.id,
    seminarId: seminar.id,
    seminarTitle: seminar.title,
    seminarDate: seminar.sessionDates?.length ? seminar.sessionDates.join(", ") : seminar.dateStart,
    customer: { firstName, lastName, email, phone },
    profession,
    motivation,
  });

  await sendSignupCreated(signup);
  revalidatePath("/admin");
  revalidatePath("/admin/signups");
  revalidatePath("/account");
  return { ok: true, number: signup.number, token: signup.token };
}

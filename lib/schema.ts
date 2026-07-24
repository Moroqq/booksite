import { z } from "zod";

export const bookOrderSchema = z.object({
  fullName: z.string().min(2, "Введите имя и фамилию"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().min(10, "Введите номер телефона"),
  address: z.string().min(5, "Введите адрес доставки"),
  delivery: z.enum(["cdek", "post", "pickup"] as const),
  quantity: z.number().min(1).max(10),
  comment: z.string().optional(),
});

export const seminarSignupSchema = z.object({
  fullName: z.string().min(2, "Введите имя и фамилию"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().min(10, "Введите номер телефона"),
  seminarId: z.string().min(1, "Выберите семинар"),
  profession: z.enum(
    ["teacher", "doctor", "speech_therapist", "musician", "art_therapist", "parent", "other"] as const
  ),
  motivation: z.string().min(10, "Расскажите, почему вам это интересно (мин. 10 символов)"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Введите ваше имя"),
  email: z.string().email("Введите корректный email"),
  message: z.string().min(10, "Сообщение слишком короткое"),
});

export type BookOrderData = z.infer<typeof bookOrderSchema>;
export type SeminarSignupData = z.infer<typeof seminarSignupSchema>;
export type ContactData = z.infer<typeof contactSchema>;

export const PROFESSION_LABELS: Record<string, string> = {
  teacher: "Педагог",
  doctor: "Врач",
  speech_therapist: "Логопед",
  musician: "Музыкант",
  art_therapist: "Арт-терапевт",
  parent: "Родитель",
  other: "Другое",
};

export const DELIVERY_LABELS: Record<string, string> = {
  cdek: "СДЭК",
  post: "Почта России",
  pickup: "Самовывоз (Санкт-Петербург)",
};

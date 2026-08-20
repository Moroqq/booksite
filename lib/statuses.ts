import type { OrderStatus } from "./orders-db";
import type { SignupStatus } from "./seminar-signups-db";

/** Тексты для покупателя: коротко — что происходит, и что делать дальше. */
export const ORDER_STATUS: Record<OrderStatus, { label: string; note: string }> = {
  payment_pending: {
    label: "Проверяем оплату",
    note: "Мы ищем ваш перевод. Обычно это занимает несколько часов в рабочее время.",
  },
  preparing: {
    label: "Готовим к отправке",
    note: "Оплата получена, книга собирается. Когда передадим в доставку, напишем вам.",
  },
  shipped: {
    label: "Отправлен",
    note: "Книга передана в доставку.",
  },
  payment_rejected: {
    label: "Оплата не найдена",
    note: "Мы не смогли подтвердить перевод. Если он был сделан — напишите нам, разберёмся.",
  },
  cancelled: {
    label: "Отменён",
    note: "Заказ отменён. Если это ошибка — напишите нам.",
  },
};

export const SIGNUP_STATUS: Record<SignupStatus, { label: string; note: string }> = {
  new: {
    label: "Заявка на рассмотрении",
    note: "Мы свяжемся с вами по телефону и подтвердим участие.",
  },
  confirmed: {
    label: "Место закреплено за вами",
    note: "Ждём вас на занятии. Если планы изменятся — сообщите заранее, чтобы освободить место.",
  },
  declined: {
    label: "Участие не подтверждено",
    note: "К сожалению, в этот раз не получилось. Напишите нам — подберём другую дату.",
  },
  cancelled: {
    label: "Запись отменена",
    note: "Если это ошибка — напишите нам.",
  },
};

export const BADGE_STYLES: Record<string, string> = {
  payment_pending: "bg-[rgba(201,162,75,0.15)] text-[var(--ink)]",
  preparing: "bg-[rgba(143,169,184,0.2)] text-[var(--ink)]",
  shipped: "bg-[rgba(124,139,111,0.2)] text-[var(--ink)]",
  payment_rejected: "bg-[rgba(201,123,99,0.18)] text-[var(--ink)]",
  cancelled: "bg-[rgba(26,22,18,0.08)] text-[var(--ink-soft)]",
  new: "bg-[rgba(201,162,75,0.15)] text-[var(--ink)]",
  confirmed: "bg-[rgba(124,139,111,0.2)] text-[var(--ink)]",
  declined: "bg-[rgba(201,123,99,0.18)] text-[var(--ink)]",
};

export const SUPPORT_EMAIL = "info@zvukterap.ru";

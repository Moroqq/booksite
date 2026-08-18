"use server";

import { revalidatePath } from "next/cache";
import { createBookOrder } from "@/lib/orders-db";
import { getCurrentUser, isLoginRequired } from "@/lib/customer-auth";

export type OrderSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  address: string;
  comment?: string;
  quantity: number;
};

const clean = (value: string) => value.trim();
const isPhoneComplete = (value: string) => value.replace(/\D/g, "").length === 11;

export async function submitOfflineBookOrder(input: OrderSubmission) {
  const user = getCurrentUser();
  if (isLoginRequired() && !user) {
    return { ok: false, message: "Сессия истекла. Войдите заново, чтобы оформить заказ." };
  }

  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const deliveryMethod = clean(input.deliveryMethod);
  const address = clean(input.address);
  const quantity = Number(input.quantity);

  if (!firstName || !lastName || !email || !deliveryMethod || !address || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return { ok: false, message: "Пожалуйста, заполните обязательные поля и проверьте количество книг." };
  }
  if (!isPhoneComplete(phone)) {
    return { ok: false, message: "Введите номер телефона полностью, например +7 999 000-00-00." };
  }

  const order = createBookOrder({
    userId: user?.id,
    customer: { firstName, lastName, email, phone },
    delivery: { method: deliveryMethod, address, comment: clean(input.comment || "") || undefined },
    quantity,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account");
  return { ok: true, number: order.number };
}

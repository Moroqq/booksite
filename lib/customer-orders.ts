import { cookies } from "next/headers";

const CUSTOMER_ORDERS_COOKIE = "booksite_customer_orders";
const MAX_SAVED_ORDERS = 20;

function parseOrderIds(value?: string) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_SAVED_ORDERS) : [];
  } catch {
    return [];
  }
}

export function getCustomerOrderIds() {
  return parseOrderIds(cookies().get(CUSTOMER_ORDERS_COOKIE)?.value);
}

export function rememberCustomerOrder(id: string) {
  const previous = getCustomerOrderIds().filter((item) => item !== id);
  cookies().set(CUSTOMER_ORDERS_COOKIE, JSON.stringify([id, ...previous].slice(0, MAX_SAVED_ORDERS)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

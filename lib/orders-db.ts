import crypto from "node:crypto";
import { readLocalData, writeLocalData } from "./local-data";
import { BOOK_INFO } from "./content";

export type OrderStatus = "payment_pending" | "preparing" | "shipped" | "payment_rejected" | "cancelled";

export type BookOrder = {
  id: string;
  number: string;
  bookTitle: string;
  quantity: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: string;
    address: string;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
  paymentSubmittedAt?: string;
  status: OrderStatus;
  rejectionReason?: string;
};

export type BookOrderInput = Omit<BookOrder, "id" | "number" | "bookTitle" | "total" | "createdAt" | "updatedAt" | "paymentSubmittedAt" | "status" | "rejectionReason">;

type Store = { orders?: BookOrder[]; articles?: unknown; seminars?: unknown };

function store(): Store {
  const value = readLocalData<Store>({});
  return { ...value, orders: value.orders || [] };
}

function save(value: Store) {
  writeLocalData(value);
}

function nextNumber(orders: BookOrder[]) {
  const year = new Date().getFullYear();
  const prefix = `BS-${year}-`;
  const last = orders.reduce((max, order) => {
    if (!order.number.startsWith(prefix)) return max;
    const suffix = Number(order.number.slice(prefix.length));
    return Number.isInteger(suffix) ? Math.max(max, suffix) : max;
  }, 0);
  return `${prefix}${String(last + 1).padStart(4, "0")}`;
}

export function getBookOrders() {
  return store().orders!.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBookOrdersByIds(ids: string[]) {
  const wanted = new Set(ids);
  return getBookOrders().filter((order) => wanted.has(order.id));
}

export function getBookOrder(id: string) {
  return store().orders!.find((order) => order.id === id) || null;
}

export function createBookOrder(input: BookOrderInput) {
  const value = store();
  const now = new Date().toISOString();
  const order: BookOrder = {
    id: `order-${crypto.randomUUID()}`,
    number: nextNumber(value.orders!),
    bookTitle: BOOK_INFO.title,
    quantity: input.quantity,
    total: BOOK_INFO.price * input.quantity,
    customer: input.customer,
    delivery: input.delivery,
    createdAt: now,
    updatedAt: now,
    paymentSubmittedAt: now,
    status: "payment_pending",
  };
  value.orders!.push(order);
  save(value);
  return order;
}

export function updateBookOrderStatus(id: string, status: OrderStatus, rejectionReason?: string) {
  const value = store();
  const order = value.orders!.find((item) => item.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.rejectionReason = status === "payment_rejected" ? rejectionReason?.trim() || "Оплата не была подтверждена." : undefined;
  save(value);
  return order;
}

export function orderBuyerName(order: BookOrder) {
  return `${order.customer.firstName} ${order.customer.lastName}`;
}

export function orderItems(order: BookOrder) {
  return `${order.bookTitle} × ${order.quantity}`;
}

import crypto from "node:crypto";
import { readLocalData, writeLocalData } from "./local-data";

export type SignupStatus = "new" | "confirmed" | "declined" | "cancelled";

export type SeminarSignup = {
  id: string;
  number: string;
  userId?: string;
  seminarId: string;
  seminarTitle: string;
  seminarDate: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  profession: string;
  motivation: string;
  createdAt: string;
  updatedAt: string;
  status: SignupStatus;
  declineReason?: string;
};

export type SeminarSignupInput = Omit<SeminarSignup, "id" | "number" | "createdAt" | "updatedAt" | "status" | "declineReason">;

type Store = { seminarSignups?: SeminarSignup[] } & Record<string, unknown>;

function store(): Store {
  const value = readLocalData<Store>({});
  return { ...value, seminarSignups: value.seminarSignups || [] };
}

function save(value: Store) {
  writeLocalData(value);
}

function nextNumber(signups: SeminarSignup[]) {
  const prefix = `SM-${new Date().getFullYear()}-`;
  const last = signups.reduce((max, signup) => {
    if (!signup.number.startsWith(prefix)) return max;
    const suffix = Number(signup.number.slice(prefix.length));
    return Number.isInteger(suffix) ? Math.max(max, suffix) : max;
  }, 0);
  return `${prefix}${String(last + 1).padStart(4, "0")}`;
}

export function getSeminarSignups() {
  return store().seminarSignups!.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSeminarSignupsByUser(userId: string) {
  return store().seminarSignups!.filter((signup) => signup.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSeminarSignup(id: string) {
  return store().seminarSignups!.find((signup) => signup.id === id) || null;
}

/** Один человек не должен записываться на один семинар дважды. */
export function hasActiveSignup(userId: string, seminarId: string) {
  return store().seminarSignups!.some(
    (signup) => signup.userId === userId && signup.seminarId === seminarId && signup.status !== "cancelled" && signup.status !== "declined"
  );
}

export function createSeminarSignup(input: SeminarSignupInput) {
  const value = store();
  const now = new Date().toISOString();
  const signup: SeminarSignup = {
    id: `signup-${crypto.randomUUID()}`,
    number: nextNumber(value.seminarSignups!),
    ...input,
    createdAt: now,
    updatedAt: now,
    status: "new",
  };
  value.seminarSignups!.push(signup);
  save(value);
  return signup;
}

export function updateSignupStatus(id: string, status: SignupStatus, declineReason?: string) {
  const value = store();
  const index = value.seminarSignups!.findIndex((signup) => signup.id === id);
  if (index < 0) return null;
  value.seminarSignups![index] = {
    ...value.seminarSignups![index],
    status,
    declineReason: status === "declined" ? declineReason : undefined,
    updatedAt: new Date().toISOString(),
  };
  save(value);
  return value.seminarSignups![index];
}

export function signupPersonName(signup: SeminarSignup) {
  return `${signup.customer.firstName} ${signup.customer.lastName}`.trim();
}

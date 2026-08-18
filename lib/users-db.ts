import crypto from "node:crypto";
import { readLocalData, writeLocalData } from "./local-data";

export type AuthProvider = "vk" | "yandex";

export type SiteUser = {
  id: string;
  provider: AuthProvider;
  providerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
};

export type OAuthProfile = {
  provider: AuthProvider;
  providerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

type Store = { users?: SiteUser[] } & Record<string, unknown>;

function store(): Store {
  const value = readLocalData<Store>({});
  return { ...value, users: value.users || [] };
}

function save(value: Store) {
  writeLocalData(value);
}

export function findUserById(id: string): SiteUser | null {
  return store().users!.find((user) => user.id === id) || null;
}

export function getUsers() {
  return store().users!.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function userName(user: Pick<SiteUser, "firstName" | "lastName">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}

/** Находит пользователя по связке «сервис + идентификатор» или заводит нового. */
export function upsertUserFromProfile(profile: OAuthProfile): SiteUser {
  const value = store();
  const now = new Date().toISOString();
  const index = value.users!.findIndex((user) => user.provider === profile.provider && user.providerId === profile.providerId);

  if (index >= 0) {
    const existing = value.users![index];
    const updated: SiteUser = {
      ...existing,
      firstName: profile.firstName || existing.firstName,
      lastName: profile.lastName || existing.lastName,
      email: profile.email || existing.email,
      phone: profile.phone || existing.phone,
      lastLoginAt: now,
    };
    value.users![index] = updated;
    save(value);
    return updated;
  }

  const user: SiteUser = {
    id: `user-${crypto.randomUUID()}`,
    provider: profile.provider,
    providerId: profile.providerId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    createdAt: now,
    lastLoginAt: now,
  };
  value.users!.push(user);
  save(value);
  return user;
}

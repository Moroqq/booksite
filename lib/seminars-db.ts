import crypto from "node:crypto";
import { readLocalData, writeLocalData } from "./local-data";
import { SEMINARS, type Seminar, type SeminarFormat } from "./seminars";

export interface SeminarInput { title: string; location: string; dateStart: string; dateEnd: string; sessionDates?: string[]; format: SeminarFormat; duration: string; price: number; instructor: string; description: string; forWhom: string[]; spots: number; spotsLeft: number; }
type Store = { seminars?: Seminar[]; articles?: unknown; orders?: unknown };
function store() { const value = readLocalData<Store>({}); return { ...value, seminars: value.seminars?.length ? value.seminars : SEMINARS }; }
function save(value: Store) { writeLocalData(value); }
export function formatPrice(price: number) { return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`; }
function hydrated(seminar: Seminar): Seminar { return { ...seminar, priceFormatted: formatPrice(seminar.price) }; }
export function getAllSeminars() { return store().seminars!.slice().sort((a, b) => a.dateStart.localeCompare(b.dateStart)).map(hydrated); }
export function getSeminarById(id: string) { const found = store().seminars!.find((seminar) => seminar.id === id); return found ? hydrated(found) : null; }
export function createSeminar(input: SeminarInput) { const value = store(); const seminar: Seminar = { id: `seminar-${crypto.randomUUID()}`, ...input, priceFormatted: formatPrice(input.price) }; value.seminars!.push(seminar); save(value); return seminar; }
export function updateSeminar(id: string, input: SeminarInput) { const value = store(); const index = value.seminars!.findIndex((seminar) => seminar.id === id); if (index < 0) return; value.seminars![index] = { id, ...input, priceFormatted: formatPrice(input.price) }; save(value); }
export function deleteSeminar(id: string) { const value = store(); value.seminars = value.seminars!.filter((seminar) => seminar.id !== id); save(value); }

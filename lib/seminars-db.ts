import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { SEMINARS, type Seminar, type SeminarFormat } from "./seminars";

// ─── Connection (cached across dev hot-reloads) ──────────────
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "salesbook.db");

const globalForDb = globalThis as unknown as { __salesbookDb?: DatabaseSync };

function getDb(): DatabaseSync {
  if (globalForDb.__salesbookDb) return globalForDb.__salesbookDb;

  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS seminars (
      id          TEXT PRIMARY KEY,
      title       TEXT    NOT NULL,
      location    TEXT    NOT NULL,
      dateStart   TEXT    NOT NULL,
      dateEnd     TEXT    NOT NULL,
      format      TEXT    NOT NULL,
      duration    TEXT    NOT NULL,
      price       INTEGER NOT NULL,
      instructor  TEXT    NOT NULL,
      description TEXT    NOT NULL,
      forWhom     TEXT    NOT NULL,
      spots       INTEGER NOT NULL,
      spotsLeft   INTEGER NOT NULL,
      sort        INTEGER NOT NULL
    )
  `);

  seedIfEmpty(db);
  globalForDb.__salesbookDb = db;
  return db;
}

function seedIfEmpty(db: DatabaseSync) {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM seminars").get() as { n: number };
  if (n > 0) return;

  const insert = db.prepare(`
    INSERT INTO seminars
      (id, title, location, dateStart, dateEnd, format, duration, price, instructor, description, forWhom, spots, spotsLeft, sort)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  SEMINARS.forEach((s, i) => {
    insert.run(
      s.id, s.title, s.location, s.dateStart, s.dateEnd, s.format, s.duration,
      s.price, s.instructor, s.description, JSON.stringify(s.forWhom), s.spots, s.spotsLeft, i,
    );
  });
}

// ─── Helpers ─────────────────────────────────────────────────
export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

interface SeminarRow {
  id: string;
  title: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  format: string;
  duration: string;
  price: number;
  instructor: string;
  description: string;
  forWhom: string;
  spots: number;
  spotsLeft: number;
  sort: number;
}

function rowToSeminar(r: SeminarRow): Seminar {
  return {
    id: r.id,
    title: r.title,
    location: r.location,
    dateStart: r.dateStart,
    dateEnd: r.dateEnd,
    format: r.format as SeminarFormat,
    duration: r.duration,
    price: r.price,
    priceFormatted: formatPrice(r.price),
    instructor: r.instructor,
    description: r.description,
    forWhom: JSON.parse(r.forWhom) as string[],
    spots: r.spots,
    spotsLeft: r.spotsLeft,
  };
}

// ─── Public API ──────────────────────────────────────────────
export function getAllSeminars(): Seminar[] {
  const rows = getDb()
    .prepare("SELECT * FROM seminars ORDER BY sort ASC, dateStart ASC")
    .all() as SeminarRow[];
  return rows.map(rowToSeminar);
}

export function getSeminarById(id: string): Seminar | null {
  const row = getDb().prepare("SELECT * FROM seminars WHERE id = ?").get(id) as
    | SeminarRow
    | undefined;
  return row ? rowToSeminar(row) : null;
}

export interface SeminarInput {
  title: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  format: SeminarFormat;
  duration: string;
  price: number;
  instructor: string;
  description: string;
  forWhom: string[];
  spots: number;
  spotsLeft: number;
}

export function createSeminar(input: SeminarInput): Seminar {
  const db = getDb();
  const id = `seminar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const { maxSort } = db.prepare("SELECT COALESCE(MAX(sort), -1) AS maxSort FROM seminars").get() as {
    maxSort: number;
  };

  db.prepare(`
    INSERT INTO seminars
      (id, title, location, dateStart, dateEnd, format, duration, price, instructor, description, forWhom, spots, spotsLeft, sort)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.title, input.location, input.dateStart, input.dateEnd, input.format, input.duration,
    input.price, input.instructor, input.description, JSON.stringify(input.forWhom),
    input.spots, input.spotsLeft, maxSort + 1,
  );

  return getSeminarById(id)!;
}

export function deleteSeminar(id: string): void {
  getDb().prepare("DELETE FROM seminars WHERE id = ?").run(id);
}

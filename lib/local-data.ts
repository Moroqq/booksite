import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "booksite-admin.json");

/** Tiny local repository used for the dev-only admin. Replaceable by an API/database adapter later. */
export function readLocalData<T>(fallback: T): T {
  if (!fs.existsSync(DATA_FILE)) return fallback;
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as T; } catch { return fallback; }
}

export function writeLocalData<T>(data: T) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const temporary = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(temporary, DATA_FILE);
}

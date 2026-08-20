/**
 * Разовая доработка: выдаёт личные ключи заказам и заявкам, созданным до появления
 * персональных ссылок. Запускать из папки сайта: node scripts/backfill-tokens.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "booksite-admin.json");
if (!fs.existsSync(file)) {
  console.log("Файл данных не найден: " + file);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
let added = 0;

for (const list of [data.orders || [], data.seminarSignups || []]) {
  for (const item of list) {
    if (!item.token) {
      item.token = crypto.randomBytes(18).toString("base64url");
      added++;
    }
  }
}

if (added) {
  const temporary = file + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(temporary, file);
}

console.log("выдано ключей: " + added);
console.log("заказов: " + (data.orders || []).length + ", заявок: " + (data.seminarSignups || []).length);

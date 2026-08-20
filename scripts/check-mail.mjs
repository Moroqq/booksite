/**
 * Проверка почты: читает настройки из .env.local, пробует войти на почтовый сервер
 * и, если попросить, отправляет пробное письмо.
 *
 *   node scripts/check-mail.mjs                     — только проверка связи и входа
 *   node scripts/check-mail.mjs kto-to@example.com  — ещё и пробное письмо на этот адрес
 *
 * Пароль нигде не печатается — только длина, чтобы понять, подставлен он или нет.
 */

import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("Файл .env.local не найден — запускайте из папки /var/www/booksite");
  process.exit(1);
}

const env = {};
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const clean = line.trim();
  if (!clean || clean.startsWith("#")) continue;
  const at = clean.indexOf("=");
  if (at > 0) env[clean.slice(0, at)] = clean.slice(at + 1);
}

const host = env.SMTP_HOST;
const port = Number(env.SMTP_PORT || 465);
const user = env.SMTP_USER;
const pass = env.SMTP_PASSWORD;

console.log("сервер:  " + (host || "не задан") + ":" + port);
console.log("ящик:    " + (user || "не задан"));
console.log("пароль:  " + (pass ? "задан, длина " + pass.length : "НЕ ЗАДАН"));

if (pass === "ВАШ_ПАРОЛЬ_ОТ_ЯЩИКА") {
  console.log("\nПароль не подставлен — в файле осталась заглушка из инструкции.");
  process.exit(1);
}
if (!host || !user || !pass) process.exit(1);

const mailer = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  await mailer.verify();
  console.log("\nСвязь и вход: успешно ✓");
} catch (error) {
  console.log("\nНе удалось войти на почтовый сервер:");
  console.log("  " + error.message);
  process.exit(1);
}

const to = process.argv[2];
if (!to) {
  console.log("Пробное письмо не отправляю. Чтобы отправить: node scripts/check-mail.mjs адрес@почта");
  process.exit(0);
}

try {
  const info = await mailer.sendMail({
    from: (env.MAIL_FROM_NAME || "Духовная звукотерапия") + " <" + (env.MAIL_FROM || user) + ">",
    to,
    subject: "Проверка почты сайта zvukterap.ru",
    text: "Это пробное письмо с сайта. Если вы его видите — отправка работает.\n\nzvukterap.ru",
    html: '<div style="font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#1A1612;">'
      + "<p>Это пробное письмо с сайта. Если вы его видите — отправка работает.</p>"
      + '<p style="color:#4A443C;font-size:14px;">zvukterap.ru</p></div>',
  });
  console.log("Пробное письмо отправлено на " + to);
  console.log("идентификатор письма: " + info.messageId);
} catch (error) {
  console.log("Письмо отправить не удалось: " + error.message);
  process.exit(1);
}

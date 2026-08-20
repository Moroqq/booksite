import fs from "node:fs";
import path from "node:path";

/**
 * Проверка, что файл действительно лежит в public.
 * Нужна, чтобы не показывать посетителю пустые места и мёртвые кнопки,
 * пока заказчик не прислал материалы (развороты книги, звуки гласных).
 */
export function publicFileExists(webPath: string) {
  const clean = webPath.replace(/^\//, "").split("/").join(path.sep);
  return fs.existsSync(path.join(process.cwd(), "public", clean));
}

export function existingSpreads() {
  return [1, 2, 3, 4, 5].filter((n) => publicFileExists(`/images/spread-${n}.jpg`));
}

export function vowelSoundsReady() {
  return ["a", "e", "i", "o", "u"].every((letter) => publicFileExists(`/sounds/${letter}.mp3`));
}

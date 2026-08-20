/**
 * Прогрев картинок после выкладки.
 *
 * Next обрабатывает каждую картинку при первом обращении и складывает результат
 * в .next/cache/images. На сервере с одним ядром это заметно, поэтому лучше,
 * чтобы за обработку заплатил этот скрипт, а не первый живой посетитель.
 *
 * Запуск: node scripts/warm-images.mjs https://zvukterap.ru
 */

const origin = (process.argv[2] || "http://127.0.0.1:3010").replace(/\/$/, "");
const PAGES = ["/", "/book", "/about", "/method", "/seminars", "/blog"];
const ACCEPT = "image/webp,image/*,*/*";

const decode = (value) =>
  value.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

async function imageUrlsOf(page) {
  const response = await fetch(`${origin}${page}`, { headers: { Accept: "text/html" } });
  if (!response.ok) return [];
  const html = await response.text();
  const found = html.match(/\/_next\/image\?[^"'\s\]+/g) || [];
  return found.map((url) => decode(url));
}

const urls = new Set();
for (const page of PAGES) {
  try {
    (await imageUrlsOf(page)).forEach((url) => urls.add(url));
  } catch (error) {
    console.log(`не удалось прочитать ${page}: ${error.message}`);
  }
}

console.log(`картинок к прогреву: ${urls.size}`);

let done = 0;
let failed = 0;
const started = Date.now();

// По две за раз: сервер одноядерный, больше — только очередь и таймауты.
const queue = [...urls];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(`${origin}${url}`, { headers: { Accept: ACCEPT } });
      await response.arrayBuffer();
      if (response.ok) done++;
      else failed++;
    } catch {
      failed++;
    }
  }
}
await Promise.all([worker(), worker()]);

console.log(`прогрето: ${done}, с ошибкой: ${failed}, заняло ${Math.round((Date.now() - started) / 1000)} с`);

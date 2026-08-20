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
const MARKER = "/_next/image?";
const STOP = ['"', "'", " ", "<", ">"];

/** Достаём адреса картинок без регулярных выражений — так надёжнее при переносе файла. */
function imageUrlsIn(html) {
  const found = [];
  let start = html.indexOf(MARKER);
  while (start !== -1) {
    let end = start;
    while (end < html.length && !STOP.includes(html[end])) end++;
    found.push(html.slice(start, end).split("&amp;").join("&"));
    start = html.indexOf(MARKER, end);
  }
  return found;
}

const urls = new Set();
for (const page of PAGES) {
  try {
    const response = await fetch(origin + page, { headers: { Accept: "text/html" } });
    if (!response.ok) {
      console.log("страница " + page + " ответила " + response.status);
      continue;
    }
    imageUrlsIn(await response.text()).forEach((url) => urls.add(url));
  } catch (error) {
    console.log("не удалось прочитать " + page + ": " + error.message);
  }
}

console.log("картинок к прогреву: " + urls.size);

let done = 0;
let failed = 0;
const started = Date.now();
const queue = [...urls];

// По две за раз: сервер одноядерный, больше — только очередь и таймауты.
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(origin + url, { headers: { Accept: ACCEPT } });
      await response.arrayBuffer();
      response.ok ? done++ : failed++;
    } catch {
      failed++;
    }
  }
}
await Promise.all([worker(), worker()]);

console.log("прогрето: " + done + ", с ошибкой: " + failed + ", заняло " + Math.round((Date.now() - started) / 1000) + " с");

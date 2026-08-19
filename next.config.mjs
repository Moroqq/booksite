/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Вступительная анимация не меняется — пусть браузер держит её у себя
        // и не перезапрашивает при каждом заходе. Если будете менять анимацию,
        // сохраните файлы под новым именем (intro-v2.webm), иначе месяц будет
        // показываться старая версия из кеша.
        source: "/:file(intro.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
};

export default nextConfig;

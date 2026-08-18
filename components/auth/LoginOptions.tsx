import { configuredProviders, PROVIDER_LABELS } from "@/lib/customer-auth";

const BUTTON_STYLES: Record<string, string> = {
  vk: "bg-[#0077FF] text-white hover:bg-[#0067dd]",
  yandex: "bg-[#FC3F1D] text-white hover:bg-[#e03517]",
};

/** Кнопки входа через российские сервисы. Показываем только те, для которых заданы ключи. */
export default function LoginOptions({ next = "/", className = "" }: { next?: string; className?: string }) {
  const providers = configuredProviders();

  if (!providers.length) {
    return (
      <p className={`font-inter text-sm text-[var(--ink-soft)] ${className}`}>
        Вход временно недоступен: сервисы авторизации ещё не настроены.
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {providers.map((provider) => (
        <a
          key={provider}
          href={`/api/auth/${provider}?next=${encodeURIComponent(next)}`}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-inter text-xs uppercase tracking-widest transition-colors duration-150 ${BUTTON_STYLES[provider]}`}
        >
          Войти через {PROVIDER_LABELS[provider]}
        </a>
      ))}
    </div>
  );
}

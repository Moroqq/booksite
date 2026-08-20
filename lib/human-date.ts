const RU_DATE = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/**
 * Даты в письмах должны читаться по-человечески: «25 августа 2026», а не «2026-08-25».
 * В строке могут быть и произвольные пояснения («ЗУМ, 19.45») — их не трогаем.
 */
export function humanDates(value: string) {
  return value.replace(/\d{4}-\d{2}-\d{2}/g, (iso) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : RU_DATE.format(date);
  });
}

/**
 * Единственное место для локальной настройки перевода.
 * Перед запуском добавьте реквизиты и, при необходимости, путь к QR-коду в public/.
 * Не храните здесь ключи, токены или данные банковской карты.
 */
export const OFFLINE_PAYMENT = {
  recipient: "",
  details: "",
  qrCodeSrc: "",
  instruction: "После перевода вернитесь на эту страницу и нажмите «Я оплатил». Мы проверим поступление вручную.",
} as const;

export const hasOfflinePaymentDetails = Boolean(OFFLINE_PAYMENT.recipient || OFFLINE_PAYMENT.details || OFFLINE_PAYMENT.qrCodeSrc);

/**
 * Единственное место для локальной настройки перевода.
 * Перед запуском добавьте реквизиты и, при необходимости, путь к QR-коду в public/.
 * Не храните здесь ключи, токены или данные банковской карты.
 */
export const OFFLINE_PAYMENT = {
  phone: "+7 921 630-77-04",
  bank: "Сбербанк (СБП)",
  qrCodeSrc: "/payment-qr.jpg",
} as const;

export const hasOfflinePaymentDetails = Boolean(OFFLINE_PAYMENT.phone || OFFLINE_PAYMENT.qrCodeSrc);

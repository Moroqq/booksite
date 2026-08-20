import { adminRecipient, sendLetter, type Letter } from "./mailer";
import { OFFLINE_PAYMENT } from "./offline-payment";
import { orderBuyerName, type BookOrder } from "./orders-db";
import { signupPersonName, type SeminarSignup } from "./seminar-signups-db";
import { PROFESSION_LABELS } from "./schema";
import { humanDates } from "./human-date";
import { orderUrl, signupUrl } from "./site";

/** Тексты писем собраны в одном месте, чтобы их можно было править не трогая логику. */

const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

async function send(letter: Letter) {
  return sendLetter(letter);
}

// ——— Книга ———

export async function sendOrderCreated(order: BookOrder) {
  await send({
    to: order.customer.email,
    subject: `Заказ ${order.number} принят`,
    heading: `Здравствуйте, ${order.customer.firstName}!`,
    lines: [
      `Мы получили ваш заказ <b>${order.number}</b> — «${order.bookTitle}», ${order.quantity} шт. на сумму <b>${money(order.total)}</b>.`,
      `Осталось перевести оплату по номеру <b>${OFFLINE_PAYMENT.phone}</b> (${OFFLINE_PAYMENT.bank}). Назначение платежа указывать не нужно.`,
      `После перевода вернитесь на сайт и нажмите кнопку «Я оплатил» — мы проверим поступление и напишем вам.`,
      `Доставка: ${order.delivery.method}, адрес — ${order.delivery.address}.`,
      `<b><a href="${orderUrl(order.token)}" style="color:#C9A24B;">Посмотреть состояние заказа</a></b> — по этой ссылке всегда видно, на каком он этапе. Сохраните письмо.`,
    ],
    footnote: "Если письмо пришло вам по ошибке, просто не отвечайте на него.",
  });

  await send({
    to: adminRecipient(),
    subject: `Новый заказ ${order.number} — ${money(order.total)}`,
    heading: `Новый заказ книги`,
    lines: [
      `<b>${order.number}</b> · ${orderBuyerName(order)} · ${order.quantity} шт. · ${money(order.total)}`,
      `Телефон: ${order.customer.phone}<br>Почта: ${order.customer.email}`,
      `Доставка: ${order.delivery.method}, ${order.delivery.address}`,
      order.delivery.comment ? `Комментарий: ${order.delivery.comment}` : "",
    ].filter(Boolean),
    footnote: "Подтвердить оплату можно в админке, раздел «Заказы книг».",
  });
}

export async function sendOrderStatusChanged(order: BookOrder) {
  const byStatus: Partial<Record<BookOrder["status"], { subject: string; lines: string[] }>> = {
    preparing: {
      subject: `Оплата заказа ${order.number} получена`,
      lines: [
        `Мы нашли ваш перевод по заказу <b>${order.number}</b> — спасибо!`,
        `Книга готовится к отправке. Когда передадим её в доставку, напишем вам ещё раз.`,
      ],
    },
    shipped: {
      subject: `Заказ ${order.number} отправлен`,
      lines: [
        `Ваш заказ <b>${order.number}</b> передан в доставку (${order.delivery.method}).`,
        `Адрес доставки: ${order.delivery.address}.`,
      ],
    },
    payment_rejected: {
      subject: `Заказ ${order.number}: оплата не найдена`,
      lines: [
        `К сожалению, мы не смогли подтвердить оплату по заказу <b>${order.number}</b>.`,
        order.rejectionReason ? `Причина: ${order.rejectionReason}` : "",
        `Если перевод всё же был сделан, ответьте на это письмо — разберёмся.`,
      ].filter(Boolean),
    },
    cancelled: {
      subject: `Заказ ${order.number} отменён`,
      lines: [`Заказ <b>${order.number}</b> отменён. Если это ошибка, ответьте на это письмо.`],
    },
  };

  const letter = byStatus[order.status];
  if (!letter) return;

  await send({
    to: order.customer.email,
    subject: letter.subject,
    heading: `Здравствуйте, ${order.customer.firstName}!`,
    lines: [...letter.lines, `<a href="${orderUrl(order.token)}" style="color:#C9A24B;">Открыть заказ ${order.number}</a>`],
  });
}

// ——— Семинары ———

export async function sendSignupCreated(signup: SeminarSignup) {
  await send({
    to: signup.customer.email,
    subject: `Заявка ${signup.number} на семинар принята`,
    heading: `Здравствуйте, ${signup.customer.firstName}!`,
    lines: [
      `Мы получили вашу заявку <b>${signup.number}</b> на семинар «${signup.seminarTitle}».`,
      `Даты занятий: ${humanDates(signup.seminarDate)}`,
      `Мы свяжемся с вами по телефону ${signup.customer.phone}, подтвердим участие и расскажем, как всё будет проходить.`,
      `<b><a href="${signupUrl(signup.token)}" style="color:#C9A24B;">Посмотреть состояние заявки</a></b> — сохраните это письмо.`,
    ],
  });

  await send({
    to: adminRecipient(),
    subject: `Новая заявка на семинар — ${signupPersonName(signup)}`,
    heading: `Новая заявка на семинар`,
    lines: [
      `<b>${signup.number}</b> · ${signupPersonName(signup)}`,
      `Семинар: ${signup.seminarTitle} (${humanDates(signup.seminarDate)})`,
      `Телефон: ${signup.customer.phone}<br>Почта: ${signup.customer.email}`,
      `Занятие: ${PROFESSION_LABELS[signup.profession] || signup.profession}`,
      `О себе: ${signup.motivation}`,
    ],
    footnote: "Подтвердить участие можно в админке, раздел «Записи на семинары».",
  });
}

export async function sendSignupStatusChanged(signup: SeminarSignup) {
  const byStatus: Partial<Record<SeminarSignup["status"], { subject: string; lines: string[] }>> = {
    confirmed: {
      subject: `Вы записаны на семинар «${signup.seminarTitle}»`,
      lines: [
        `Ваше участие подтверждено — место закреплено за вами.`,
        `Семинар: «${signup.seminarTitle}».<br>Даты занятий: ${humanDates(signup.seminarDate)}`,
        `Если планы изменятся, ответьте на это письмо, чтобы мы освободили место.`,
      ],
    },
    declined: {
      subject: `Заявка ${signup.number}: место не подтверждено`,
      lines: [
        `К сожалению, подтвердить ваше участие в семинаре «${signup.seminarTitle}» не получилось.`,
        signup.declineReason ? `Причина: ${signup.declineReason}` : "",
        `Напишите нам в ответ на это письмо — подберём другую дату.`,
      ].filter(Boolean),
    },
    cancelled: {
      subject: `Запись на семинар «${signup.seminarTitle}» отменена`,
      lines: [`Ваша запись на семинар отменена. Если это ошибка, ответьте на это письмо.`],
    },
  };

  const letter = byStatus[signup.status];
  if (!letter) return;

  await send({
    to: signup.customer.email,
    subject: letter.subject,
    heading: `Здравствуйте, ${signup.customer.firstName}!`,
    lines: [...letter.lines, `<a href="${signupUrl(signup.token)}" style="color:#C9A24B;">Открыть заявку ${signup.number}</a>`],
  });
}

// ——— Напоминания ———

/** Заказ висит неоплаченным — мягко напоминаем, без давления. */
export async function sendPaymentReminder(order: BookOrder) {
  await send({
    to: order.customer.email,
    subject: `Заказ ${order.number} ждёт оплаты`,
    heading: `Здравствуйте, ${order.customer.firstName}!`,
    lines: [
      `Мы пока не нашли перевод по вашему заказу <b>${order.number}</b> на сумму <b>${money(order.total)}</b>.`,
      `Если вы уже оплатили — ничего делать не нужно, иногда перевод идёт дольше обычного, мы всё увидим и напишем.`,
      `Если нет — переведите по номеру <b>${OFFLINE_PAYMENT.phone}</b> (${OFFLINE_PAYMENT.bank}), назначение платежа указывать не нужно.`,
      `<a href="${orderUrl(order.token)}" style="color:#C9A24B;">Открыть заказ ${order.number}</a>`,
    ],
    footnote: "Передумали? Просто ответьте на это письмо, и мы отменим заказ.",
  });
}

/** За сутки до семинара — дата, место и напоминание про отмену. */
export async function sendSeminarReminder(signup: SeminarSignup, place?: string) {
  await send({
    to: signup.customer.email,
    subject: `Завтра семинар «${signup.seminarTitle}»`,
    heading: `Здравствуйте, ${signup.customer.firstName}!`,
    lines: [
      `Напоминаем: завтра начинается семинар «${signup.seminarTitle}».`,
      `Даты занятий: ${humanDates(signup.seminarDate)}${place ? `<br>Где: ${place}` : ""}`,
      `Если планы изменились — сообщите нам, пожалуйста, чтобы мы освободили место для другого участника.`,
      `<a href="${signupUrl(signup.token)}" style="color:#C9A24B;">Открыть заявку ${signup.number}</a>`,
    ],
  });
}

/**
 * Отправка в фоне. Покупатель не должен ждать почтовый сервер: заказ уже сохранён,
 * а на подключение к почте уходят секунды — из-за этого экран подтверждения не дожидался
 * ответа и показывал ошибку.
 */
export function inBackground(task: Promise<unknown>) {
  task.catch((error) => console.error("[MAIL] фоновая отправка не удалась:", error));
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BOOK_INFO } from "@/lib/content";
import { OFFLINE_PAYMENT, hasOfflinePaymentDetails } from "@/lib/offline-payment";
import { submitOfflineBookOrder } from "./actions";
import type { SiteUser } from "@/lib/users-db";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  address: string;
  comment: string;
  quantity: number;
};

const DELIVERY_METHOD = "Яндекс Доставка";
const initialValues: FormValues = { firstName: "", lastName: "", email: "", phone: "", deliveryMethod: DELIVERY_METHOD, address: "", comment: "", quantity: 1 };
const price = (quantity: number) => new Intl.NumberFormat("ru-RU").format(BOOK_INFO.price * quantity);

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits && !digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);
  const rest = digits.slice(1);
  if (!digits) return "";
  let out = "+7";
  if (rest.length > 0) out += " " + rest.slice(0, 3);
  if (rest.length > 3) out += " " + rest.slice(3, 6);
  if (rest.length > 6) out += "-" + rest.slice(6, 8);
  if (rest.length > 8) out += "-" + rest.slice(8, 10);
  return out;
}

function isPhoneComplete(value: string) {
  return value.replace(/\D/g, "").length === 11;
}

function PaymentConfirmedOverlay({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm overlay-backdrop" style={{ backgroundColor: "rgba(42, 37, 32, 0.7)" }}>
      <div className="mx-4 flex w-full max-w-sm flex-col items-center rounded-2xl bg-[var(--bg)] p-8 text-center shadow-2xl overlay-card">
        <svg width="88" height="88" viewBox="0 0 72 72" className="overlay-checkmark-icon">
          <circle cx="36" cy="36" r="33" fill="none" strokeWidth="3" className="stroke-[var(--sage)]" />
          <path d="M21 37.5 L31 47 L51 25" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="stroke-[var(--sage)]" />
        </svg>
        <div>
          <h2 className="mt-5 font-cormorant text-2xl text-[var(--ink)]">Оплата отправлена на проверку</h2>
          <p className="mt-2 font-inter text-sm leading-relaxed text-[var(--ink-soft)]">Мы проверим перевод и напишем вам на почту. Ссылка на заказ уже отправлена — по ней всегда видно, на каком он этапе.</p>
          <button type="button" onClick={onDone} className="mt-6 rounded-full bg-[var(--bg-deep)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)]">Открыть мой заказ</button>
        </div>
      </div>
      <style>{`
        @keyframes overlayBackdropFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayCardPop {
          0% { opacity: 0; transform: translateY(10px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayCheckmarkPop {
          0% { transform: scale(0); opacity: 0; }
          55% { transform: scale(1.18); opacity: 1; }
          80% { transform: scale(0.94); }
          100% { transform: scale(1); opacity: 1; }
        }
        .overlay-backdrop { opacity: 0; animation: overlayBackdropFade 0.5s ease-out forwards; }
        .overlay-card { opacity: 0; animation: overlayCardPop 0.5s ease-out 0.15s forwards; }
        .overlay-checkmark-icon { animation: overlayCheckmarkPop 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both; }
      `}</style>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder, autoComplete }: { label: string; name: keyof FormValues; value: string; onChange: (name: keyof FormValues, value: string) => void; type?: string; placeholder?: string; autoComplete?: string }) {
  return <label className="block"><span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">{label}</span><input required type={type} name={name} value={value} autoComplete={autoComplete} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] placeholder:text-[var(--ink-soft)]/45 focus:border-[var(--gold)]" /></label>;
}

export default function OrderForm({ user }: { user: SiteUser | null }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(() => ({ ...initialValues, firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", phone: user?.phone ? formatPhone(user.phone) : "" }));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const [orderToken, setOrderToken] = useState("");
  const [step3Ready, setStep3Ready] = useState(false);
  const [copied, setCopied] = useState(false);
  const update = (name: keyof FormValues, value: string | number) => setValues((current) => ({ ...current, [name]: value }));

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(OFFLINE_PAYMENT.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  useEffect(() => {
    if (step !== 3) { setStep3Ready(false); return; }
    const timeout = setTimeout(() => setStep3Ready(true), 600);
    return () => clearTimeout(timeout);
  }, [step]);

  const next = () => {
    if (step === 1) {
      if (!values.firstName.trim() || !values.lastName.trim() || !values.email.trim()) { setError("Заполните, пожалуйста, все обязательные поля."); return; }
      if (!isPhoneComplete(values.phone)) { setError("Введите номер телефона полностью, например +7 999 000-00-00."); return; }
    } else if (!values.address.trim()) {
      setError("Заполните, пожалуйста, все обязательные поля.");
      return;
    }
    setError("");
    setStep((current) => Math.min(3, current + 1));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await submitOfflineBookOrder(values);
        if (!result.ok) { setError(result.message || "Не удалось сохранить заказ. Попробуйте ещё раз."); return; }
        setOrderToken(result.token || "");
        setConfirmed(true);
      } catch {
        // Вкладка открыта до обновления сайта: код на сервере уже другой.
        setError("Страница устарела — обновите её и оформите заново. Обычно это происходит, если вкладка была открыта во время обновления сайта.");
      }
    });
  };

  // После оформления ведём покупателя на страницу его заказа — там состояние и реквизиты.
  const goToOrder = () => {
    router.push(orderToken ? `/order/${orderToken}` : "/");
    router.refresh();
  };

  return <>{confirmed && <PaymentConfirmedOverlay onDone={goToOrder} />}<Header /><main id="main-content" className="min-h-screen pt-20"><section className="pt-5 pb-20 sm:pt-7 sm:pb-24 bg-[var(--bg)]"><div className="container-layout max-w-3xl"><Link href="/book" className="inline-flex items-center gap-1 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]"><ChevronLeft size={16} /> К книге</Link><header className={step === 1 ? "mt-5" : "mt-4"}><p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Оформление заказа</p><h1 className={`font-cormorant text-[var(--ink)] ${step === 1 ? "mt-2 text-4xl sm:text-5xl" : "mt-1 text-2xl sm:text-3xl"}`}>Купить книгу</h1>{step === 1 && <p className="mt-3 font-inter text-[var(--ink-soft)]">{BOOK_INFO.title} · {BOOK_INFO.priceFormatted}</p>}</header><ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Этапы оформления">{["Контакты", "Доставка", "Оплата"].map((label, index) => { const number = index + 1; const active = step === number; const complete = step > number; return <li key={label} className="flex items-center gap-2"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-inter text-xs ${active || complete ? "bg-[var(--gold)] text-[var(--bg)]" : "bg-[var(--line)] text-[var(--ink-soft)]"}`}>{complete ? <Check size={15} /> : number}</span><span className={`font-inter text-xs sm:text-sm ${active ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>{label}</span></li>; })}</ol><form onSubmit={submit} className="mt-6 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-8"><style>{`@keyframes stepFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .step-fade-in { animation: stepFadeIn 0.3s ease-out both; }`}</style>{step === 1 && <section aria-labelledby="contact-heading" className="step-fade-in"><h2 id="contact-heading" className="font-cormorant text-3xl text-[var(--ink)]">Ваши контакты</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">Они нужны только для связи по этому заказу и доставки.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Имя" name="firstName" value={values.firstName} onChange={update} autoComplete="given-name" /><Field label="Фамилия" name="lastName" value={values.lastName} onChange={update} autoComplete="family-name" /><Field label="Электронная почта" name="email" value={values.email} onChange={update} type="email" autoComplete="email" /><Field label="Телефон" name="phone" value={values.phone} onChange={(name, value) => update(name, formatPhone(value))} type="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></div></section>}{step === 2 && <section aria-labelledby="delivery-heading" className="step-fade-in"><h2 id="delivery-heading" className="font-cormorant text-3xl text-[var(--ink)]">Куда доставить</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">Доставка — {DELIVERY_METHOD}. Стоимость и срок уточним после подтверждения оплаты.</p><div className="mt-6"><Field label="Адрес доставки" name="address" value={values.address} onChange={update} autoComplete="street-address" placeholder="Индекс, город, улица, дом, квартира" /></div><label className="mt-5 block"><span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Комментарий к доставке <span className="text-[var(--ink-soft)]/60">(необязательно)</span></span><textarea name="comment" value={values.comment} onChange={(event) => update("comment", event.target.value)} rows={3} className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] focus:border-[var(--gold)]" /></label><div className="mt-5 flex items-center justify-between rounded-xl bg-[var(--bg)] p-4"><span className="font-inter text-sm text-[var(--ink-soft)]">Количество</span><div className="flex items-center gap-3"><button type="button" onClick={() => update("quantity", Math.max(1, values.quantity - 1))} className="h-8 w-8 rounded-full border border-[var(--line)] text-[var(--ink)]" aria-label="Уменьшить количество">−</button><span className="min-w-5 text-center font-inter text-sm text-[var(--ink)]">{values.quantity}</span><button type="button" onClick={() => update("quantity", Math.min(10, values.quantity + 1))} className="h-8 w-8 rounded-full border border-[var(--line)] text-[var(--ink)]" aria-label="Увеличить количество">+</button></div></div></section>}{step === 3 && <section aria-labelledby="payment-heading" className="step-fade-in"><p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Остался последний шаг</p><h2 id="payment-heading" className="mt-2 font-cormorant text-3xl text-[var(--ink)]">Оплата заказа</h2><p className="mt-2 font-inter text-sm leading-relaxed text-[var(--ink-soft)]">Оплатите книгу удобным способом через СБП. После получения перевода мы подтвердим заказ и отправим книгу по указанному адресу.</p><div className="mt-6 rounded-2xl bg-[var(--bg-deep)] p-5 sm:p-6"><div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center"><div className="flex flex-col items-center gap-2.5">{hasOfflinePaymentDetails && OFFLINE_PAYMENT.qrCodeSrc ? <img src={OFFLINE_PAYMENT.qrCodeSrc} alt="QR-код для перевода через СБП" className="h-44 w-44 rounded-xl bg-white p-2.5 sm:h-52 sm:w-52" /> : <div className="flex h-44 w-44 items-center justify-center rounded-xl border border-dashed border-[var(--gold)]/60 bg-white/5 text-center font-inter text-xs leading-relaxed text-[var(--text-on-dark-soft)] sm:h-52 sm:w-52">Место для QR-кода<br />будет настроено<br />перед запуском</div>}<p className="font-inter text-xs text-[var(--text-on-dark-soft)]">Отсканируйте камерой банка</p></div><div><h3 className="font-cormorant text-xl text-[var(--text-on-dark)]">Реквизиты перевода</h3><dl className="mt-3 space-y-2 font-inter text-sm"><div className="flex items-baseline justify-between gap-3"><dt className="text-[var(--text-on-dark-soft)]">Телефон</dt><dd className="text-[var(--text-on-dark)]">{OFFLINE_PAYMENT.phone}</dd></div><div className="flex items-baseline justify-between gap-3"><dt className="text-[var(--text-on-dark-soft)]">Банк</dt><dd className="text-[var(--text-on-dark)]">{OFFLINE_PAYMENT.bank}</dd></div><div className="flex items-baseline justify-between gap-3"><dt className="text-[var(--text-on-dark-soft)]">Сумма</dt><dd className="font-medium text-[var(--gold)]">{price(values.quantity)} ₽</dd></div></dl><button type="button" onClick={copyPhone} className="mt-4 rounded-full border border-white/15 px-4 py-2 font-inter text-xs uppercase tracking-widest text-[var(--text-on-dark)] transition-colors duration-150 hover:border-[var(--gold)] hover:text-[var(--gold)]">{copied ? "Скопировано ✓" : "Скопировать телефон"}</button></div></div></div><ul className="mt-5 space-y-2.5 rounded-xl border border-[var(--line)] bg-white/60 p-4">{[`Сумма перевода — ${price(values.quantity)} ₽`, "Назначение платежа не требуется", "После оплаты вернитесь на эту страницу", "Нажмите кнопку «Я оплатил»"].map((item) => <li key={item} className="flex items-start gap-2.5 font-inter text-sm text-[var(--ink-soft)]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sage)]/15 text-[var(--sage)]"><Check size={12} /></span>{item}</li>)}</ul><div className="mt-5 rounded-xl border border-[var(--line)] p-4 font-inter text-sm text-[var(--ink-soft)]"><p className="font-cormorant text-lg text-[var(--ink)]">Ваш заказ</p><dl className="mt-3 space-y-1.5"><div className="flex justify-between gap-3"><dt>Книга</dt><dd className="text-right text-[var(--ink)]">{BOOK_INFO.title}</dd></div><div className="flex justify-between gap-3"><dt>Количество</dt><dd className="text-[var(--ink)]">{values.quantity}</dd></div><div className="flex justify-between gap-3"><dt>Получатель</dt><dd className="text-[var(--ink)]">{values.firstName} {values.lastName}</dd></div><div className="flex justify-between gap-3"><dt>Адрес доставки</dt><dd className="max-w-[60%] text-right text-[var(--ink)]">{values.address}</dd></div></dl><div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3 font-inter text-sm"><span className="text-[var(--ink)]">Итого</span><span className="font-medium text-[var(--ink)]">{price(values.quantity)} ₽</span></div></div></section>}{error && <p role="alert" className="mt-5 font-inter text-sm text-[var(--rose-color)]">{error}</p>}<div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{step > 1 ? <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--line)] px-5 py-3 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:border-[var(--gold)]"><ChevronLeft size={16} /> Назад</button> : <span />}{step < 3 ? <button type="button" onClick={next} className="inline-flex items-center justify-center gap-1 rounded-full bg-[var(--bg-deep)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)]">Продолжить <ChevronRight size={16} /></button> : <button disabled={isPending || !step3Ready} type="submit" className="rounded-full bg-[var(--gold)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-[var(--bg-deep)] disabled:opacity-60">{isPending ? "Сохраняем…" : "Я оплатил"}</button>}</div></form></div></section></main><Footer /></>;
}

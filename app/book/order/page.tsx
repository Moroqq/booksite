"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight, CreditCard, MapPin, QrCode, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BOOK_INFO } from "@/lib/content";
import { OFFLINE_PAYMENT, hasOfflinePaymentDetails } from "@/lib/offline-payment";
import { submitOfflineBookOrder } from "./actions";

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

const deliveryMethods = ["СДЭК", "Яндекс Доставка", "Самовывоз"];
const initialValues: FormValues = { firstName: "", lastName: "", email: "", phone: "", deliveryMethod: "СДЭК", address: "", comment: "", quantity: 1 };
const price = (quantity: number) => new Intl.NumberFormat("ru-RU").format(BOOK_INFO.price * quantity);

function Field({ label, name, value, onChange, type = "text", placeholder, autoComplete }: { label: string; name: keyof FormValues; value: string; onChange: (name: keyof FormValues, value: string) => void; type?: string; placeholder?: string; autoComplete?: string }) {
  return <label className="block"><span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">{label}</span><input required type={type} name={name} value={value} autoComplete={autoComplete} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] placeholder:text-[var(--ink-soft)]/45 focus:border-[var(--gold)]" /></label>;
}

export default function BookOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const update = (name: keyof FormValues, value: string | number) => setValues((current) => ({ ...current, [name]: value }));

  const next = () => {
    const missing = step === 1 ? !values.firstName.trim() || !values.lastName.trim() || !values.email.trim() || !values.phone.trim() : !values.address.trim();
    if (missing) { setError("Заполните, пожалуйста, все обязательные поля."); return; }
    setError("");
    setStep((current) => Math.min(3, current + 1));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitOfflineBookOrder(values);
      if (!result.ok) { setError(result.message || "Не удалось сохранить заказ. Попробуйте ещё раз."); return; }
      router.push("/orders");
      router.refresh();
    });
  };

  return <><Header /><main id="main-content" className="min-h-screen pt-20"><section className="section-padding bg-[var(--bg)]"><div className="container-layout max-w-3xl"><Link href="/book" className="inline-flex items-center gap-1 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]"><ChevronLeft size={16} /> К книге</Link><header className="mt-7"><p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Оформление заказа</p><h1 className="mt-3 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">Купить книгу</h1><p className="mt-3 font-inter text-[var(--ink-soft)]">{BOOK_INFO.title} · {BOOK_INFO.priceFormatted}</p></header><ol className="mt-9 grid grid-cols-3 gap-2" aria-label="Этапы оформления">{["Контакты", "Доставка", "Оплата"].map((label, index) => { const number = index + 1; const active = step === number; const complete = step > number; return <li key={label} className="flex items-center gap-2"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-inter text-xs ${active || complete ? "bg-[var(--gold)] text-[var(--bg)]" : "bg-[var(--line)] text-[var(--ink-soft)]"}`}>{complete ? <Check size={15} /> : number}</span><span className={`font-inter text-xs sm:text-sm ${active ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>{label}</span></li>; })}</ol><form onSubmit={submit} className="mt-8 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-8">{step === 1 && <section aria-labelledby="contact-heading"><h2 id="contact-heading" className="font-cormorant text-3xl text-[var(--ink)]">Ваши контакты</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">Они нужны только для связи по этому заказу и доставки.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Имя" name="firstName" value={values.firstName} onChange={update} autoComplete="given-name" /><Field label="Фамилия" name="lastName" value={values.lastName} onChange={update} autoComplete="family-name" /><Field label="Электронная почта" name="email" value={values.email} onChange={update} type="email" autoComplete="email" /><Field label="Телефон" name="phone" value={values.phone} onChange={update} type="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></div></section>}{step === 2 && <section aria-labelledby="delivery-heading"><h2 id="delivery-heading" className="font-cormorant text-3xl text-[var(--ink)]">Куда доставить</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">Стоимость и срок доставки уточним после подтверждения оплаты.</p><div className="mt-6"><span className="mb-2 block font-inter text-sm text-[var(--ink-soft)]">Способ доставки</span><div className="grid gap-2 sm:grid-cols-3">{deliveryMethods.map((method) => <label key={method} className={`cursor-pointer rounded-xl border px-3 py-3 font-inter text-sm transition-colors ${values.deliveryMethod === method ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--ink)]" : "border-[var(--line)] text-[var(--ink-soft)]"}`}><input type="radio" name="deliveryMethod" value={method} checked={values.deliveryMethod === method} onChange={(event) => update("deliveryMethod", event.target.value)} className="sr-only" />{method}</label>)}</div></div><div className="mt-5"><Field label={values.deliveryMethod === "Самовывоз" ? "Город и удобный способ связи" : "Адрес доставки"} name="address" value={values.address} onChange={update} autoComplete="street-address" placeholder={values.deliveryMethod === "Самовывоз" ? "Например: Санкт-Петербург" : "Индекс, город, улица, дом, квартира"} /></div><label className="mt-5 block"><span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Комментарий к доставке <span className="text-[var(--ink-soft)]/60">(необязательно)</span></span><textarea name="comment" value={values.comment} onChange={(event) => update("comment", event.target.value)} rows={3} className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] focus:border-[var(--gold)]" /></label><div className="mt-5 flex items-center justify-between rounded-xl bg-[var(--bg)] p-4"><span className="font-inter text-sm text-[var(--ink-soft)]">Количество</span><div className="flex items-center gap-3"><button type="button" onClick={() => update("quantity", Math.max(1, values.quantity - 1))} className="h-8 w-8 rounded-full border border-[var(--line)] text-[var(--ink)]" aria-label="Уменьшить количество">−</button><span className="min-w-5 text-center font-inter text-sm text-[var(--ink)]">{values.quantity}</span><button type="button" onClick={() => update("quantity", Math.min(10, values.quantity + 1))} className="h-8 w-8 rounded-full border border-[var(--line)] text-[var(--ink)]" aria-label="Увеличить количество">+</button></div></div></section>}{step === 3 && <section aria-labelledby="payment-heading"><h2 id="payment-heading" className="font-cormorant text-3xl text-[var(--ink)]">Оплата банковским переводом</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">Оплата проходит без эквайринга: перевод проверит человек, а не платёжный сервис.</p><div className="mt-6 rounded-2xl bg-[var(--bg-deep)] p-5 text-[var(--text-on-dark)] sm:p-6"><div className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]"><QrCode size={23} /></span><div><h3 className="font-cormorant text-2xl text-[var(--text-on-dark)]">QR-код для перевода</h3>{hasOfflinePaymentDetails && OFFLINE_PAYMENT.qrCodeSrc ? <img src={OFFLINE_PAYMENT.qrCodeSrc} alt="QR-код для банковского перевода" className="mt-4 h-40 w-40 rounded-lg bg-white p-2" /> : <div className="mt-4 flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-[var(--gold)]/60 bg-white/5 text-center font-inter text-xs leading-relaxed text-[var(--text-on-dark-soft)]">Место для QR-кода<br />будет настроено<br />перед запуском</div>}</div></div>{hasOfflinePaymentDetails ? <div className="mt-5 border-t border-white/10 pt-4 font-inter text-sm leading-relaxed text-[var(--text-on-dark-soft)]">{OFFLINE_PAYMENT.recipient && <p>Получатель: {OFFLINE_PAYMENT.recipient}</p>}{OFFLINE_PAYMENT.details && <p className="mt-1 whitespace-pre-line">{OFFLINE_PAYMENT.details}</p>}</div> : <p className="mt-5 border-t border-white/10 pt-4 font-inter text-sm leading-relaxed text-[var(--text-on-dark-soft)]">Реквизиты ещё не заполнены. Это безопасный плейсхолдер: добавьте их перед приёмом реальных заказов в <code className="text-[var(--gold-soft)]">lib/offline-payment.ts</code>.</p>}</div><div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4"><div className="flex gap-3"><CreditCard className="mt-0.5 shrink-0 text-[var(--gold)]" size={20} /><p className="font-inter text-sm leading-relaxed text-[var(--ink-soft)]">К переводу: <strong className="font-medium text-[var(--ink)]">{price(values.quantity)} ₽</strong>. В назначении платежа укажите номер заказа, который появится после отправки.</p></div><div className="mt-3 flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--sage)]" size={20} /><p className="font-inter text-sm leading-relaxed text-[var(--ink-soft)]">{OFFLINE_PAYMENT.instruction}</p></div></div><div className="mt-5 rounded-xl border border-[var(--line)] p-4 font-inter text-sm text-[var(--ink-soft)]"><div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[var(--gold)]" size={20} /><div><p className="text-[var(--ink)]">{values.firstName} {values.lastName} · {values.deliveryMethod}</p><p>{values.address}</p></div></div></div></section>}{error && <p role="alert" className="mt-5 font-inter text-sm text-[var(--rose-color)]">{error}</p>}<div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{step > 1 ? <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--line)] px-5 py-3 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:border-[var(--gold)]"><ChevronLeft size={16} /> Назад</button> : <span />}{step < 3 ? <button type="button" onClick={next} className="inline-flex items-center justify-center gap-1 rounded-full bg-[var(--bg-deep)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)]">Продолжить <ChevronRight size={16} /></button> : <button disabled={isPending} type="submit" className="rounded-full bg-[var(--gold)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-[var(--bg-deep)] disabled:opacity-60">{isPending ? "Сохраняем…" : "Я оплатил"}</button>}</div></form></div></section></main><Footer /></>;
}

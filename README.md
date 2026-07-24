# Духовная звукотерапия — сайт

Сайт-визитка и продающая площадка для книги и семинаров по духовной звукотерапии гласных и согласных звуков. Метод Арнольда Дорхаут Мэйс.

## Запуск проекта

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Деплой на Vercel

```bash
vercel deploy
```

Или подключите репозиторий GitHub в [vercel.com](https://vercel.com).

## Структура страниц

| Страница | URL |
|---|---|
| Главная | `/` |
| Книга + форма заказа | `/book` |
| Метод (интерактив) | `/method` |
| Семинары + запись | `/seminars` |
| Об авторах + хронология | `/about` |
| Статьи | `/blog` |
| Контакты | `/contact` |
| Оформление заказа | `/checkout` |

## Ассеты — что нужно от заказчика

### Изображения (положить в `public/images/`)

| Файл | Описание | Размер |
|---|---|---|
| `book-cover.jpg` | Обложка книги | 600×850 px |
| `spread-1.jpg` … `spread-5.jpg` | 5 разворотов-превью книги | 800×560 px |
| `arnold-1.jpg` … `arnold-3.jpg` | 3 фотографии Арнольда Дорхаут Мэйс | ≥ 800×600 px |

### Аудио (положить в `public/sounds/`)

| Файл | Описание |
|---|---|
| `a.mp3` | Звуковой поток гласной А |
| `e.mp3` | Звуковой поток гласной Е |
| `i.mp3` | Звуковой поток гласной И |
| `o.mp3` | Звуковой поток гласной О |
| `u.mp3` | Звуковой поток гласной У |

### Ссылки

- YouTube: ссылка на документальный фильм об Арнольде → вставить в `app/contact/page.tsx`
- Telegram: реальная ссылка на канал → заменить `https://t.me/zvukoterapia` в `components/layout/Footer.tsx`
- Email: заменить `info@zvukoterapia.ru` на реальный адрес
- Домен: заменить `zvukoterapia.ru` в `public/robots.txt`

### Платёжная система

В `app/checkout/page.tsx` есть TODO-комментарии. Подключить:
- Юкасса (YooMoney)
- CloudPayments
- или другую систему

Переменные в `.env`:
```
PAYMENT_SHOP_ID=
PAYMENT_SECRET_KEY=
```

### CRM / Email уведомления

В `app/api/lead/route.ts` есть TODO-комментарии. Все заявки (книга, семинар, контакт) приходят туда. Подключить:
- amoCRM / Bitrix24 / Notion API / Airtable
- Email: Resend (рекомендуем), SendGrid, Nodemailer

Переменные в `.env`:
```
CRM_WEBHOOK_URL=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_TO=
```

## Технологии

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + CSS переменные
- **Framer Motion** + GSAP (структура готова)
- **react-hook-form** + **zod** (все формы валидируются)
- **lucide-react** (иконки)
- Шрифты: Cormorant Garamond, Inter, Fraunces (Google Fonts)

## Производительность

- Изображения через `next/image` с blur-placeholder
- Шрифты через `next/font/google` с `display: swap`
- `SoundWave` Canvas-анимация динамически импортируется (no SSR)
- Все тяжёлые анимации отключаются при `prefers-reduced-motion: reduce`

## Доступность

- WCAG AA контрасты
- Семантические теги (`main`, `nav`, `article`, `section`, `figure`)
- `aria-label` на иконках и интерактивных элементах
- Видимый `:focus-visible` (золотая обводка)
- Клавиатурная навигация в VowelCircle и ZodiacCircle

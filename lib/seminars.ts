export type SeminarFormat = "Очный" | "Онлайн" | "Выездной";

export interface Seminar {
  id: string;
  title: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  sessionDates?: string[];
  format: SeminarFormat;
  duration: string;
  price: number;
  priceFormatted: string;
  instructor: string;
  description: string;
  forWhom: string[];
  spots: number;
  spotsLeft: number;
}

export const SEMINARS: Seminar[] = [
  {
    id: "spb-intensive-2025",
    title: "Введение в духовную звукотерапию",
    location: "Санкт-Петербург",
    dateStart: "2025-09-19",
    dateEnd: "2025-09-21",
    format: "Очный",
    duration: "3 дня",
    price: 18000,
    priceFormatted: "18 000 ₽",
    instructor: "Татьяна Рожукене-Дорхаут Мэйс",
    description:
      "Базовый трёхдневный интенсив. Гласные, согласные, дыхание и ритм. Практика звукорядов. Основы антропософской модели человека применительно к голосу.",
    forWhom: ["Педагоги", "Логопеды", "Арт-терапевты", "Родители", "Все желающие"],
    spots: 14,
    spotsLeft: 6,
  },
  {
    id: "online-course-2025",
    title: "Онлайн-курс: гласные звуки и планеты",
    location: "Онлайн (Zoom)",
    dateStart: "2025-10-06",
    dateEnd: "2025-11-24",
    format: "Онлайн",
    duration: "8 занятий по 2 часа",
    price: 12000,
    priceFormatted: "12 000 ₽",
    instructor: "Татьяна Рожукене-Дорхаут Мэйс",
    description:
      "Восемь онлайн-встреч: глубокое изучение пяти гласных звуков, их связи с планетами, практические звукоряды. Запись остаётся у участников.",
    forWhom: ["Все желающие", "Певцы", "Музыканты", "Педагоги"],
    spots: 20,
    spotsLeft: 11,
  },
  {
    id: "karelia-retreat-2025",
    title: "Выездной семинар в Карелии",
    location: "Карелия",
    dateStart: "2025-07-14",
    dateEnd: "2025-07-18",
    format: "Выездной",
    duration: "5 дней",
    price: 35000,
    priceFormatted: "35 000 ₽",
    instructor: "Татьяна Рожукене-Дорхаут Мэйс",
    description:
      "Пятидневный выездной семинар на природе. Полное погружение: утренние практики, дневные занятия, вечерние звучания. Проживание и питание включены.",
    forWhom: ["Специалисты", "Педагоги", "Врачи", "Все желающие"],
    spots: 12,
    spotsLeft: 4,
  },
  {
    id: "moscow-workshop-2025",
    title: "Мастер-класс: согласные и зодиак",
    location: "Москва",
    dateStart: "2025-11-08",
    dateEnd: "2025-11-09",
    format: "Очный",
    duration: "2 дня",
    price: 14000,
    priceFormatted: "14 000 ₽",
    instructor: "Татьяна Рожукене-Дорхаут Мэйс",
    description:
      "Двухдневный мастер-класс для продолжающих. Согласные звуки, их связь с зодиакальным кругом и органами тела. Звукоряды для работы с детьми с ОВЗ.",
    forWhom: ["Прошедшие базовый курс", "Логопеды", "Врачи", "Лечебные педагоги"],
    spots: 10,
    spotsLeft: 3,
  },
];

export const SEMINAR_AUDIENCE = [
  "Педагоги вальдорфских школ",
  "Логопеды и дефектологи",
  "Врачи (особенно антропософской медицины)",
  "Музыкальные и арт-терапевты",
  "Эвритмисты",
  "Родители детей с особенностями развития",
  "Певцы и актёры",
  "Ведущие и преподаватели",
];

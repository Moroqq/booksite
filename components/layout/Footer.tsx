import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/book", label: "Книга" },
  { href: "/method", label: "Метод" },
  { href: "/seminars", label: "Семинары" },
  { href: "/about", label: "Об авторах" },
  { href: "/blog", label: "Статьи" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-deep)] text-[var(--gold-soft)]">
      <div className="container-layout py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <p className="font-cormorant text-2xl font-light text-white">
              Духовная<br />
              <span className="text-[var(--gold)]">звукотерапия</span>
            </p>
            <p className="font-inter text-sm leading-relaxed text-[var(--gold-soft)]/70">
              Метод Арнольда Дорхаут Мэйс (1935–2018).
              Институт духовной звукотерапии гласных и согласных им. А. Д. Мэйс.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Нижняя навигация">
            <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-5">
              Разделы
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-sm text-[var(--gold-soft)]/70 hover:text-[var(--gold-soft)] transition-colors duration-300 link-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts */}
          <div>
            <p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)] mb-5">
              Контакты
            </p>
            <ul className="space-y-3 font-inter text-sm text-[var(--gold-soft)]/70">
              <li>
                <a
                  href="mailto:info@zvukterap.ru"
                  className="hover:text-[var(--gold-soft)] transition-colors duration-300"
                >
                  info@zvukterap.ru
                </a>
              </li>
              <li>Санкт-Петербург</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-inter text-xs text-[var(--gold-soft)]/40">
            © {new Date().getFullYear()} Институт духовной звукотерапии им. А. Д. Мэйс
          </p>
          <p className="font-inter text-xs text-[var(--gold-soft)]/40">
            Книга: ISBN 978-5-907889-33-0, М.: Энигма, 2024
          </p>
        </div>
      </div>
    </footer>
  );
}

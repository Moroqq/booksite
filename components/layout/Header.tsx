"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/book", label: "Книга" },
  { href: "/method", label: "Метод" },
  { href: "/seminars", label: "Семинары" },
  { href: "/about", label: "Об авторах" },
  { href: "/blog", label: "Статьи" },
  { href: "/account", label: "Кабинет" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Пока меню открыто: страница под ним не прокручивается, Esc закрывает, фокус — на крестике.
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "header-solid backdrop-blur-md border-b border-[var(--line)]" : "bg-transparent"
      }`}
    >
      <div className="container-layout flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="font-cormorant text-xl md:text-2xl font-light tracking-wide transition-colors duration-300"
          style={{ color: "var(--ink)" }}
          aria-label="Духовная звукотерапия — главная страница"
        >
          Духовная<br className="hidden sm:block" />
          <span style={{ color: "var(--gold)" }}>звукотерапия</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Основная навигация" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative font-inter text-sm uppercase tracking-widest transition-colors duration-300 pb-1"
                style={{ color: active ? "var(--gold)" : "var(--ink-soft)" }}
              >
                {label}
                {active && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute bottom-0 left-0 right-0 h-px bg-[var(--gold)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/book/order"
            className="btn-gold font-inter text-sm uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300"
          >
            Купить книгу
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center transition-colors"
          style={{ color: "var(--ink)" }}
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile menu — выезжающая панель поверх затемнённой страницы */}
      <AnimatePresence>
        {menuOpen && (
          <div className="md:hidden">
            <motion.button
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
              tabIndex={-1}
              className="fixed inset-0 z-[55] cursor-default bg-[rgba(26,22,18,0.38)] backdrop-blur-[2px]"
            />

            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Меню сайта"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed right-0 top-0 bottom-0 z-[60] flex w-[86%] max-w-sm flex-col bg-[var(--bg)] shadow-[-12px_0_40px_rgba(0,0,0,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] px-5 h-16">
                <span className="font-inter text-xs uppercase tracking-[0.2em] text-[rgba(74,68,60,0.7)]">Меню</span>
                <button
                  ref={closeButtonRef}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Закрыть меню"
                  className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[rgba(26,22,18,0.06)]"
                >
                  <X size={22} />
                </button>
              </div>

              <nav aria-label="Мобильное меню" className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
                {NAV_LINKS.map(({ href, label }, index) => {
                  const active = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + index * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className="flex min-h-[52px] items-center border-b border-[rgba(26,22,18,0.08)] font-cormorant text-2xl font-light transition-colors duration-200"
                        style={{ color: active ? "var(--gold)" : "var(--ink)" }}
                      >
                        <span
                          aria-hidden="true"
                          className="mr-3 h-5 w-px transition-colors duration-200"
                          style={{ backgroundColor: active ? "var(--gold)" : "transparent" }}
                        />
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t border-[var(--line)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Link
                  href="/book/order"
                  className="btn-gold block w-full rounded-full px-6 py-3.5 text-center font-inter text-sm uppercase tracking-widest transition-all duration-300"
                >
                  Купить книгу
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

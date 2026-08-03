"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/book", label: "Книга" },
  { href: "/orders", label: "Мои заказы" },
  { href: "/method", label: "Метод" },
  { href: "/seminars", label: "Семинары" },
  { href: "/about", label: "Об авторах" },
  { href: "/blog", label: "Статьи" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isLight = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLight
          ? "bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-layout flex items-center justify-between h-16 md:h-20">
        {/* Logo — both lines same color, only "звукотерапия" gets gold accent */}
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
          className="md:hidden p-2 transition-colors"
          style={{ color: "var(--ink)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 top-16 bg-[var(--bg)] z-40"
            aria-hidden={!menuOpen}
          >
            <nav
              aria-label="Мобильное меню"
              className="container-layout pt-10 flex flex-col gap-6"
            >
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={href}
                    className="font-cormorant text-3xl font-light transition-colors duration-300"
                    style={{ color: pathname === href ? "var(--gold)" : "var(--ink)" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/book/order"
                className="btn-gold mt-4 font-inter text-sm uppercase tracking-widest px-6 py-3 rounded-full text-center w-fit transition-all duration-300"
              >
                Купить книгу
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

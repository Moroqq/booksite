import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "gold" | "ghost" | "dark";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function Button({
  children,
  variant = "gold",
  href,
  onClick,
  type = "button",
  className = "",
  disabled,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-inter text-sm uppercase tracking-widest rounded-full px-6 py-3 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    gold: "btn-gold",
    ghost:
      "border border-[var(--ink)]/20 text-[var(--ink-soft)] hover:border-[var(--ink)]/50 hover:text-[var(--ink)] bg-transparent",
    dark: "bg-[var(--bg-deep)] text-[var(--gold-soft)] border border-[var(--gold)]/30 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

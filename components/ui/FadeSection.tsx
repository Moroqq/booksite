"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FadeSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function FadeSection({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: FadeSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`fade-section ${className}`}>
      {children}
    </Tag>
  );
}

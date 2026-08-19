"use client";

import { useEffect, useRef } from "react";

/**
 * Вступительная анимация — рисующийся зодиакальный круг.
 * Раньше это были 116 PNG-кадров (55 МБ), которые браузер тянул целиком до начала показа.
 * Теперь то же самое одним видео (~0,8 МБ) с постером, который виден мгновенно.
 */
export default function IntroAnimationSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Пользователям, попросившим убрать анимации, показываем только первый кадр.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.autoplay = false;
      video.pause();
      video.currentTime = 0;
      return;
    }

    // Safari на iOS иногда игнорирует autoplay до готовности данных — подстраховываемся.
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <section aria-hidden="true" className="w-full pt-16 md:pt-20 flex justify-center bg-[var(--intro-bg)]">
      <video
        ref={videoRef}
        width={1052}
        height={876}
        poster="/intro-poster.webp"
        autoPlay
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        disablePictureInPicture
        className="block h-auto w-[88%] sm:w-[70%] lg:w-1/2"
      >
        <source src="/intro.webm" type="video/webm" />
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

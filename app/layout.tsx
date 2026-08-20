import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Fraunces } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Духовная звукотерапия",
    default: "Духовная звукотерапия гласных и согласных — метод Арнольда Д. Мэйс",
  },
  description:
    "Авторский метод духовной звукотерапии Арнольда Дорхаут Мэйс. Книга, семинары, практики. Институт духовной звукотерапии им. А. Д. Мэйс.",
  metadataBase: new URL(process.env.SITE_ORIGIN || "https://zvukterap.ru"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Духовная звукотерапия",
    // Картинка-превью для мессенджеров и соцсетей.
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Духовная звукотерапия гласных и согласных звуков" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable} ${fraunces.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}

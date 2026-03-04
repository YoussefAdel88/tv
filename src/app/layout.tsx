import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "تلفزيون مصر 90s | Egyptian TV 90s",
  description: "استمتع بأفضل أفلام ومسلسلات وموسيقى مصرية من التسعينات - Experience the best Egyptian movies, series, and music from the 90s",
  keywords: "Egyptian TV, تلفزيون مصري, أفلام مصرية, مسلسلات مصرية, تسعينات, 90s, retro TV",
  openGraph: {
    title: "تلفزيون مصر 90s | Egyptian TV 90s",
    description: "Retro Egyptian Television Experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

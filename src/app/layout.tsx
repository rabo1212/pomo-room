import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pomo Room - 귀여운 뽀모도로 타이머",
  description: "아이소메트릭 방 꾸미기 + 뽀모도로 타이머 게임. 집중하고, 코인 모으고, 나만의 방을 꾸며보세요!",
  keywords: ["pomodoro", "timer", "productivity", "game", "isometric", "뽀모도로", "타이머", "집중"],
  openGraph: {
    title: "🍅 Pomo Room - 귀여운 뽀모도로 타이머",
    description: "아이소메트릭 방 꾸미기 + 뽀모도로 타이머 게임",
    url: "https://pomodoro-game.vercel.app",
    siteName: "Pomo Room",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "🍅 Pomo Room - 귀여운 뽀모도로 타이머",
    description: "집중하고, 코인 모으고, 나만의 방을 꾸며보세요!",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#FFF8F0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${fredoka.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

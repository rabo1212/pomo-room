import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FF6B6B" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1E1E2E" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* 다크모드 FOUC 방지: 페인트 전에 클래스 적용 */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('pomo-theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body
        className={`${fredoka.variable} ${nunito.variable} antialiased`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

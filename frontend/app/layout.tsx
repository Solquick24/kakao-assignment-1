// layout.tsx
// 모든 페이지를 감싸는 공통 레이아웃 (App Router의 루트 레이아웃)
// 여기서 전역 CSS를 불러오고, 페이지 공통 틀(헤더, 가운데 정렬 등)을 잡는다.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Next.js + FastAPI 풀스택 Todo 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 페이지 내용을 화면 가운데, 일정 너비로 모아준다 */}
        <main className="mx-auto max-w-xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
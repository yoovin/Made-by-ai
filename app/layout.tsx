import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Made by AI",
  description: "허브형 AI 확장 웹서비스"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

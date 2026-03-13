import "./globals.css";
import type { Metadata } from "next";
import { RecentServiceTracker } from "@/components/recent-service-tracker";
import { ServicePagePinControl } from "@/components/service-page-pin-control";

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
      <body>
        <RecentServiceTracker />
        <ServicePagePinControl />
        {children}
      </body>
    </html>
  );
}

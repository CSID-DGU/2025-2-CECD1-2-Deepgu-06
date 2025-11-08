import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이상행동 감지 서비스",
  description: "이상행동 감지 서비스를",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

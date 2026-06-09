import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeBite SF | Find free, cheap, and nearby food",
  description:
    "Find free food resources and live nearby restaurants, cafes, and markets across San Francisco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en">
      <body>{children}</body>
    </html>
  );
}

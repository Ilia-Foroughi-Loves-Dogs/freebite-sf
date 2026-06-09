import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeBite SF | Free and affordable food in San Francisco",
  description:
    "Find food pantries, free meals, community fridges, student resources, and low-cost food options in San Francisco.",
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

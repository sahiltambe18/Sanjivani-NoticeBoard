import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import bg from '../public/bg.jpg';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanjivani Notice Board",
  description: "Online Notice Board for students",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{backgroundImage: `url(${bg.src})`}}  >{children}</body>
    </html>
  );
}

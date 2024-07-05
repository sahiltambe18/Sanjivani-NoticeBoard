import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import bg from '../public/bg.jpg';
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import AuthProvider from "@/components/AuthProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanjivani Notice Board",
  description: "Online Notice Board for students",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions)
  
  
  return (
    <html lang="en">
      <body className={inter.className} style={{backgroundImage: `url(${bg.src})`}}  >
      <AuthProvider session={session} >
        {children}
      </AuthProvider>
      
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X MART | ร้านโชว์ห่วยออนไลน์ 24 ชม.",
  description: "X MART ร้านโชว์ห่วยออนไลน์ ขายอาหาร เครื่องดื่ม ขนม และของใช้ทั่วไป ส่งฟรีทุกคำสั่งซื้อ",
};

export const viewport: Viewport = {
  themeColor: "#0F52BA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-zinc-50/50`}>
      <body className="min-h-full flex flex-col bg-transparent text-zinc-900 pb-[env(safe-area-inset-bottom)] sm:pb-0 relative">
        <AppProviders>
          <div className="flex-1 flex flex-col min-h-screen">
            {children}
          </div>
          <Footer />
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}

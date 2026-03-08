import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Work History Registry | Institutional Data Verification",
  description: "The professional registry of record. Cryptographically secured and neutral employment history verification.",
};

import { AuthProvider } from "@/context/AuthContext";

import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ToastProvider>
          <AuthProvider>
            <Header />
            <div style={{ minHeight: 'calc(100vh - 80px)' }}>
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

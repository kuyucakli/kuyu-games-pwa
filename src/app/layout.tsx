import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderMain } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuyu Games",
  description: "Minimalist Games by Kuyu",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#000000" />

      {/* iOS support */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Kuyu Games" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <div id="root">
          <HeaderMain />
          <main>{children}</main>
        </div>
        {modal}
        <Toaster />
      </body>
    </html>
  );
}

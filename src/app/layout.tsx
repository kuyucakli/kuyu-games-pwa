import type { Metadata } from "next";
import { Allerta_Stencil } from "next/font/google";
import "./globals.css";
import { PWAInstallBanner } from "@/components/features/banners/pwa-banner";
import { HeaderMain } from "@/components/layout";
import Link from "next/link";
import { ProfileDropDown } from "@/components/features/auth/profile-dropdown";
import { IconGameList } from "@/components/ui/icons";

const allertaStencil = Allerta_Stencil({
  weight: "400",
  variable: "--font-allerta-stencil",
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

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-title" content="Kuyu Games" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

      <body className={`${allertaStencil.className}  antialiased dark`}>
        <PWAInstallBanner />
        <div id="root">
          <HeaderMain>
            <Link href="/select-game">
              <IconGameList />
            </Link>
            <ProfileDropDown />
          </HeaderMain>
          {children}
        </div>
        {modal}
      </body>
    </html>
  );
}

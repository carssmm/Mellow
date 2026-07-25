import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mellow Café System",
  description: "Smart café management — sales, stock, and financial intelligence",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mellow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1c1b1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased font-body-md bg-surface text-on-surface">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cvmd.vercel.app"),
  title: {
    default: "lebenslauf — Modern Markdown CV Builder",
    template: "%s | lebenslauf",
  },
  description:
    "Build a professional, industry-standard CV in minutes. Privacy-first, open-source, and no sign-up required. Markdown-driven design with real-time preview.",
  keywords: ["CV Builder", "Resume Builder", "Markdown CV", "Lebenslauf", "Open Source Resume", "Developer Resume"],
  authors: [{ name: "Bimal Paudel", url: "https://github.com/bimalpaudels" }],
  creator: "Bimal Paudel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cvmd.vercel.app",
    siteName: "lebenslauf",
    title: "lebenslauf — Build your professional CV with Markdown",
    description: "The fast, privacy-focused way to create stunning CVs. No accounts, no fees, just professional results.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "lebenslauf - Modern CV Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lebenslauf — Modern Markdown CV Builder",
    description: "The fast, privacy-focused way to create stunning CVs. No accounts, no fees, just professional results.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system">
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

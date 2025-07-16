import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";

/* ------------------- fonts ------------------- */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/* ------------------- meta -------------------- */
export const metadata: Metadata = {
  title: "Reclamos al 311 - NYC",
  description:
    "Reclamos al 311 de Nueva York entre 2010 y 2024.",
};

/* --------------- Root layout (server component) --------------- */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans overflow-x-hidden">
        {/* Client-side shell handles menu & state */}
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}

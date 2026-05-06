import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ar.ayy - Memory & Finance",
  description: "A private space for our memories and finances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-rose-50 text-slate-800 antialiased pb-20 md:pb-0 md:pl-64`}>
        <Navigation />
        <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

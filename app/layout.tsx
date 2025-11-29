import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoRaCue Firmware Releases",
  description: "Official firmware releases for LoRaCue presentation remotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col text-lg`}
      >
        <Navigation />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} LoRaCue. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

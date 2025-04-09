import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Angleito's Portfolio",
  description: "Welcome to my personal portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Angleito&apos;s Portfolio</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Angleito. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

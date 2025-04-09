import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

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
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-deepSea-surface/80 backdrop-blur-md border-b border-abyss-400/20 text-white py-6 sticky top-0 z-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                  <Link href="/" className="group">
                    <h1 className="text-2xl font-bold font-montserrat">
                      <span className="abyss-gradient-text">Angleito</span>
                      <span className="text-white">&apos;s Portfolio</span>
                    </h1>
                  </Link>
                  <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                      <li><Link href="/" className="abyss-link">Home</Link></li>
                      <li><Link href="/about" className="abyss-link">About</Link></li>
                      <li><Link href="/projects" className="abyss-link">Projects</Link></li>
                      <li><Link href="/posts" className="abyss-link">Articles</Link></li>
                      <li><Link href="/search" className="abyss-link">Search</Link></li>
                    </ul>
                  </nav>
                  <div className="md:hidden">
                    <button className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>

            <footer className="bg-deepSea-abyss/90 backdrop-blur-md border-t border-abyss-400/20 py-8 mt-8">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold mb-2 font-montserrat">
                      <span className="abyss-gradient-text">Angleito</span>
                    </h2>
                    <p className="text-abyss-100">Exploring the depths of technology</p>
                  </div>
                  <div className="flex space-x-6">
                    <a href="https://github.com/Angleito" className="text-bitcoin-400 hover:text-bitcoin-300 transition-colors">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="mailto:arainey555@gmail.com" className="text-bitcoin-400 hover:text-bitcoin-300 transition-colors">
                      <span className="sr-only">Email</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-abyss-700/50 text-center text-abyss-300">
                  <p>&copy; {new Date().getFullYear()} Angleito. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

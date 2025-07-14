'use client';

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import React from "react";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/posts", label: "Articles" },
    { href: "/search", label: "Search" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${montserrat.variable} font-sans`}
        data-mobile-menu-open={mobileMenuOpen ? 'true' : 'false'}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-deepSea-surface/80 backdrop-blur-md border-b border-abyss-400/20 text-white py-6 sticky top-0 z-50 transition-all duration-300">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                  <Link href="/" className="group">
                    <h1 className="text-2xl font-bold font-montserrat">
                      <span className="abyss-gradient-text">Angel Ortega-Melton</span>
                      <span className="text-white">&apos;s Portfolio</span>
                    </h1>
                  </Link>
                  <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                      {navLinks.map((link) => (
                        <li key={link.href} className="relative">
                          <Link 
                            href={link.href} 
                            className={`
                              relative py-2 transition-all duration-300
                              ${isActive(link.href) 
                                ? 'text-bitcoin-400 font-medium' 
                                : 'text-abyss-200 hover:text-bitcoin-300'
                              }
                            `}
                          >
                            {link.label}
                            {isActive(link.href) && (
                              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bitcoin-500 to-bitcoin-400 rounded-full animate-fade-in" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="md:hidden">
                    <button 
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="relative w-10 h-10 text-white focus:outline-none"
                      aria-label="Toggle menu"
                    >
                      <span className="sr-only">Open main menu</span>
                      <div className="absolute w-6 h-5 left-2 top-2.5">
                        <span 
                          className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                            mobileMenuOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'
                          }`} 
                        />
                        <span 
                          className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out translate-y-2 ${
                            mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                          }`} 
                        />
                        <span 
                          className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                            mobileMenuOpen ? '-rotate-45 translate-y-2' : 'translate-y-4'
                          }`} 
                        />
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Mobile Navigation Menu */}
                <div 
                  className={`md:hidden fixed inset-x-0 top-[88px] bg-deepSea-surface/95 backdrop-blur-lg border-b border-abyss-400/20 transform transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                  }`}
                >
                  <nav className="container mx-auto px-4 py-6">
                    <ul className="space-y-4">
                      {navLinks.map((link, index) => (
                        <li 
                          key={link.href}
                          className="transform transition-all duration-300"
                          style={{
                            transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                            opacity: mobileMenuOpen ? 1 : 0,
                          }}
                        >
                          <Link 
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                              block py-2 px-4 rounded-lg transition-all duration-300
                              ${isActive(link.href)
                                ? 'bg-bitcoin-500/10 text-bitcoin-400 font-medium border-l-4 border-bitcoin-500'
                                : 'text-abyss-200 hover:bg-abyss-700/30 hover:text-bitcoin-300'
                              }
                            `}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
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
                      <span className="abyss-gradient-text">Angel Ortega-Melton</span>
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
                  <p>&copy; {new Date().getFullYear()} Angel Ortega-Melton. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

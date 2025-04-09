'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/posts', label: 'Articles' },
    { href: '/categories', label: 'Categories' },
    { href: '/search', label: 'Search' }
  ];

  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="hover:text-blue-200">
                Angleito&apos;s Portfolio
              </Link>
            </h1>

            {/* Hamburger Menu Button */}
            <button
              aria-label="Menu"
              className="md:hidden z-50 relative"
              onClick={toggleMobileMenu}
            >
              <div className="space-y-2">
                <div className={`w-6 h-0.5 bg-white transition transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
              </div>
            </button>
          </div>

          <nav
            className={`
              ${isMobileMenuOpen ? 'block' : 'hidden'}
              md:block
              fixed md:static
              top-0 left-0 w-full md:w-auto
              bg-blue-600 md:bg-transparent
              h-full md:h-auto
              pt-20 md:pt-0
              z-40 md:z-auto
            `}
          >
            <ul className="flex flex-col md:flex-row gap-4 items-center">
              {navLinks.map((link) => (
                <li key={link.href} className="w-full md:w-auto text-center">
                  <Link
                    href={link.href}
                    className={`
                      block md:inline-block
                      px-3 py-2 rounded
                      hover:bg-blue-700 transition
                      ${isActive(link.href)}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
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
  );
};

export default Header;

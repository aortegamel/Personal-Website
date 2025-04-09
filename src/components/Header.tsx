'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            <Link href="/" className="hover:text-blue-200">
              Angleito&apos;s Portfolio
            </Link>
          </h1>
          <nav>
            <ul className="flex flex-wrap gap-4">
              <li>
                <Link 
                  href="/" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/')}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/about')}`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/projects')}`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="/posts" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/posts')}`}
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/categories')}`}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/search')}`}
                >
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

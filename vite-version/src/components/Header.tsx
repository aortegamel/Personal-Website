import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Articles', href: '/posts' },
  { name: 'Search', href: '/search' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a2342]/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-xl text-bitcoin-primary">
            Angleito's Portfolio
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  location.pathname === item.href
                    ? "text-bitcoin-primary"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <span className="absolute -bottom-[1.25rem] left-0 right-0 h-[2px] bg-bitcoin-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-300 hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
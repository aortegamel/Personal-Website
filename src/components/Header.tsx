import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { routePath, site } from '../site'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
]

export function Header() {
  const location = useLocation()
  // The menu belongs to the location where it opened. Any navigation
  // (nav link, logo, Back, Forward) creates a new key and closes it.
  const [openKey, setOpenKey] = useState<string | null>(null)
  const open = openKey === location.key
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenKey(null)
      menuButton.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Cloudflare redirects /about to /about/, so the pathname can carry a
  // trailing slash. Strip it before comparing against the plain nav paths.
  const pathname =
    location.pathname !== '/' && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname
  // Exact match is the current page. A nested path (/blog/post) keeps its
  // section highlighted and marks the section link aria-current="true".
  const current = (href: string): 'page' | 'true' | undefined =>
    pathname === href
      ? 'page'
      : href !== '/' && pathname.startsWith(`${href}/`)
        ? 'true'
        : undefined

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a2342]/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-xl text-bitcoin-500">
            {site.name}
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={routePath(item.href)}
                aria-current={current(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  current(item.href)
                    ? "text-bitcoin-500"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.name}
                {current(item.href) && (
                  <span className="absolute -bottom-[1.25rem] left-0 right-0 h-[2px] bg-bitcoin-500" />
                )}
              </Link>
            ))}
          </nav>

          <button ref={menuButton} type="button" className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setOpenKey(open ? null : location.key)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
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
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <nav id="mobile-nav" className={cn("md:hidden border-t border-gray-800/50 py-4", open ? "flex flex-col space-y-1" : "hidden")}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={routePath(item.href)}
              aria-current={current(item.href)}
              className={cn(
                "px-2 py-2 text-base font-medium rounded-md",
                current(item.href)
                  ? "text-bitcoin-500"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
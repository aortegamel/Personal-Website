import { type ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import ParticlesBackground from './ParticlesBackground'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
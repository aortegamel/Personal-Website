import { Link, useLocation } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { site } from '../site'
import { ParticleCTA } from '../components/ui/particle-cta'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={`Page Not Found — ${site.name}`}
        description="The requested page does not exist."
        path={location.pathname}
        noindex
      />
      <ParticleCTA className="rounded-2xl">
        <div className="py-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Visual */}
            <div className="mb-8">
              <h1 className="text-9xl md:text-[12rem] font-bold text-abyss-500/20 leading-none">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-abyss-300 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Navigation Options */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <Link
                to="/"
                className="bitcoin-button text-center font-medium"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="abyss-card text-center px-6 py-3 font-medium hover:border-bitcoin-500/50"
              >
                Projects
              </Link>
              <Link
                to="/about"
                className="abyss-card text-center px-6 py-3 font-medium hover:border-bitcoin-500/50"
              >
                About
              </Link>
            </div>

            {/* Search Suggestion */}
            <div className="abyss-section text-left">
              <h3 className="text-lg font-semibold mb-3">Looking for something specific?</h3>
              <p className="text-abyss-300 mb-4">
                Try searching for projects using the navigation above, or contact me directly if you can't find what you're looking for.
              </p>
              <Link
                to="/about"
                className="abyss-link"
              >
                Get in touch →
              </Link>
            </div>

            {/* Fun Error Messages */}
            <div className="mt-12 text-sm text-abyss-400">
              <p>
                "In the world of blockchain, even 404 errors are immutable."
                <br />
                <span className="italic">- Some developer, probably</span>
              </p>
            </div>
          </div>
        </div>
      </ParticleCTA>
    </div>
  )
}

import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-muted-foreground/20 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-8">
          <Link
            to="/"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/posts"
            className="bg-card border px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Posts
          </Link>
          <Link
            to="/projects"
            className="bg-card border px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="bg-card border px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            About
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-muted rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Looking for something specific?</h3>
          <p className="text-muted-foreground mb-4">
            Try searching for posts or projects using the navigation above, or contact me directly if you can't find what you're looking for.
          </p>
          <Link
            to="/about#contact"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            Get in touch →
          </Link>
        </div>

        {/* Fun Error Messages */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            "In the world of blockchain, even 404 errors are immutable." 
            <br />
            <span className="italic">- Some developer, probably</span>
          </p>
        </div>
      </div>
    </div>
  )
}
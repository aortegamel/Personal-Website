import { useParams, Link, Navigate } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { formatDate } from '@/lib/utils'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { content, frontMatter, loading, error } = useContent('projects', slug || '')

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-muted rounded mb-8 w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content || !frontMatter) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Projects
          </Link>
        </nav>

        {/* Project Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {frontMatter.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={frontMatter.date}>
              {formatDate(frontMatter.date)}
            </time>
            
            {frontMatter.featured && (
              <>
                <span>•</span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  Featured Project
                </span>
              </>
            )}
          </div>

          {frontMatter.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {frontMatter.description}
            </p>
          )}

          {/* Technologies */}
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-sm font-medium text-muted-foreground mr-2">Technologies:</span>
              {frontMatter.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {frontMatter.github && (
              <a
                href={frontMatter.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                View on GitHub
                <svg 
                  className="ml-2 h-4 w-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            
            {frontMatter.demo && (
              <a
                href={frontMatter.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              >
                Live Demo
                <svg 
                  className="ml-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </header>

        {/* Project Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:text-primary/80"
          />
        </article>

        {/* Project Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Project completed on {formatDate(frontMatter.date)}
            </div>
            
            <div className="flex gap-4">
              {frontMatter.github && (
                <a
                  href={frontMatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  View Source →
                </a>
              )}
              
              <Link 
                to="/projects" 
                className="text-primary hover:text-primary/80 transition-colors text-sm"
              >
                View all projects →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
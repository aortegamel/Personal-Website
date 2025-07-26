import { useParams, Link, Navigate } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { formatDate } from '@/lib/utils'

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { content, frontMatter, loading, error } = useContent('posts', slug || '')

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
            to="/posts" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Posts
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {frontMatter.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={frontMatter.date}>
              {formatDate(frontMatter.date)}
            </time>
            
            {frontMatter.category && (
              <>
                <span>•</span>
                <span className="bg-muted px-3 py-1 rounded-full text-sm">
                  {frontMatter.category}
                </span>
              </>
            )}
            
            {frontMatter.featured && (
              <>
                <span>•</span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </>
            )}
          </div>

          {frontMatter.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {frontMatter.description}
            </p>
          )}

          {/* Tags */}
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontMatter.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:text-primary/80"
          />
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Published on {formatDate(frontMatter.date)}
              {frontMatter.category && ` in ${frontMatter.category}`}
            </div>
            
            <Link 
              to="/posts" 
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              View all posts →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
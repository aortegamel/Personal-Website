import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getPost } from '../lib/content'
import { formatDate } from '../lib/utils'
import type { Post } from '../types/content'

export function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPost(slug ?? '').then((p) => {
      setPost(p)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-muted rounded mb-8 w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            to="/posts"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Posts
          </Link>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.category && (
              <>
                <span>•</span>
                <span className="bg-muted px-3 py-1 rounded-full text-sm">{post.category}</span>
              </>
            )}
            {post.featured && (
              <>
                <span>•</span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </>
            )}
          </div>

          {post.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">{post.description}</p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
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

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap">{post.content}</pre>
        </article>

        <footer className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Published on {formatDate(post.date)}
              {post.category && ` in ${post.category}`}
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

import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '../lib/content'
import { formatDate } from '../lib/utils'
import { mdToHtml } from '../lib/markdown'
import type { Post } from '../types/content'
import { Seo, postJsonLd } from '../components/Seo'
import { site } from '../site'
import { ParticleCTA } from '../components/ui/particle-cta'
import { NotFoundPage } from './NotFoundPage'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPost(slug ?? '').then((p) => {
      setPost(p)
      setLoading(false)
    })
  }, [slug])

  const bodyHtml = useMemo(() => (post ? mdToHtml(post.content) : ''), [post])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="skeleton h-8 mb-4 w-3/4"></div>
            <div className="skeleton h-4 mb-2 w-1/2"></div>
            <div className="skeleton h-4 mb-8 w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  // Drafts and unknown slugs are absent from the data. Render the 404
  // page in place, matching the static 404.html for this URL.
  if (!post) return <NotFoundPage />

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo
        title={`${post.title} | ${site.name}`}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={postJsonLd(post)}
      />
      <ParticleCTA className="rounded-2xl">
        <div className="py-4">
          <div className="max-w-3xl mx-auto">
            <nav className="mb-8" aria-label="Breadcrumb">
              <Link to="/blog/" className="abyss-link inline-flex items-center">
                ← Back to Blog
              </Link>
            </nav>

            <article>
              <header className="mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
                <p className="text-xl text-abyss-200 leading-relaxed mb-6">{post.description}</p>
                <p className="text-abyss-400 mb-6">
                  Published <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {post.updated && (
                    <>
                      {' · Updated '}
                      <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                    </>
                  )}
                </p>
                {post.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label="Tags">
                    {post.tags.map((tag) => (
                      <li key={tag} className="badge badge-bitcoin">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </header>

              <div
                className="prose prose-lg prose-invert max-w-none text-abyss-100"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </article>

            <footer className="mt-16 pt-8 border-t border-abyss-700/30">
              <Link to="/blog/" className="abyss-link text-sm">
                View all posts →
              </Link>
            </footer>
          </div>
        </div>
      </ParticleCTA>
    </div>
  )
}

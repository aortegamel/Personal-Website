import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../types/content'
import { getAllPosts } from '../lib/content'
import { formatDate } from '../lib/utils'
import { BLOG_DESCRIPTION, BLOG_TITLE, Seo, blogJsonLd } from '../components/Seo'
import { routePath } from '../site'
import { ParticleCTA } from '../components/ui/particle-cta'

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="loading-text">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Seo title={BLOG_TITLE} description={BLOG_DESCRIPTION} path="/blog" jsonLd={blogJsonLd()} />
      <ParticleCTA className="rounded-2xl">
        <div className="py-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
                Blog
              </h1>
              <p className="text-xl text-abyss-200 max-w-3xl mx-auto">{BLOG_DESCRIPTION}</p>
            </div>

            {posts.length === 0 ? (
              <p className="text-center py-16 text-abyss-300 text-lg">No posts published yet.</p>
            ) : (
              <ul className="space-y-8 stagger-in">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <article className="abyss-card">
                      <h2 className="text-2xl font-semibold mb-3">
                        <Link to={routePath(`/blog/${post.slug}`)} className="link-morph">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-abyss-400 mb-3">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        {post.updated && (
                          <>
                            {' · Updated '}
                            <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                          </>
                        )}
                      </p>
                      <p className="text-abyss-200 text-lg mb-4">{post.description}</p>
                      {post.tags.length > 0 && (
                        <ul className="flex flex-wrap gap-2" aria-label="Tags">
                          {post.tags.map((tag) => (
                            <li key={tag} className="badge badge-bitcoin">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </ParticleCTA>
    </div>
  )
}

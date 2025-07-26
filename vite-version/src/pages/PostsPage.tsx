import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentMeta } from '../types/content'
import { getAllPosts } from '../lib/content-loader'
import { formatDate } from '../lib/utils'

export function PostsPage() {
  const [posts, setPosts] = useState<ContentMeta[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ContentMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // Get unique categories and tags for filtering
  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)))
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  useEffect(() => {
    getAllPosts()
      .then((allPosts) => {
        setPosts(allPosts)
        setFilteredPosts(allPosts)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag))
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, selectedTag])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedTag('')
  }

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
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
          All Posts
        </h1>
        <p className="text-xl text-abyss-200 max-w-3xl mx-auto">
          Thoughts on technology, development, and innovation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 abyss-input"
          />
          <button
            onClick={clearFilters}
            className="btn-ghost"
          >
            Clear Filters
          </button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-abyss-300 py-2">Categories:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-bitcoin-500 text-deepSea-abyss shadow-bitcoin'
                    : 'bg-deepSea-surface/50 text-abyss-300 hover:bg-deepSea-surface hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-abyss-300 py-2">Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-bitcoin-500 text-deepSea-abyss shadow-bitcoin'
                    : 'bg-deepSea-surface/50 text-abyss-300 hover:bg-deepSea-surface hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-abyss-400">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-abyss-300 text-lg">
            {searchTerm || selectedCategory || selectedTag 
              ? 'No posts found matching your filters.' 
              : 'No posts available.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-in">
          {filteredPosts.map((post, index) => (
            <article 
              key={post.slug} 
              className="animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="abyss-card h-full">
                <h2 className="text-xl font-semibold mb-3">
                  <Link 
                    to={`/posts/${post.slug}`} 
                    className="link-morph"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-abyss-300 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="badge badge-ocean"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex justify-between items-center text-sm text-abyss-400">
                  <span>{formatDate(post.date)}</span>
                  {post.category && (
                    <span className="badge badge-bitcoin">
                      {post.category}
                    </span>
                  )}
                </div>

                {post.featured && (
                  <div className="mt-3">
                    <span className="badge badge-ocean">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
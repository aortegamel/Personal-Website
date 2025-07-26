'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Post } from '@/lib/types';

interface SearchClientProps {
  posts: Post[];
}

export default function SearchClient({ posts }: SearchClientProps) {
  const [query, setQuery] = useState('');
  
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-40 right-20 w-96 h-96 bg-bitcoin-500/10 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-abyss-400/10 rounded-full filter blur-[128px] animate-pulse animation-delay-2000" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 font-montserrat">
          <span className="bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
            Search
          </span>
        </h1>
        
        {/* Search Input */}
        <div className="relative mb-8 max-w-2xl">
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 bg-deepSea-surface/50 backdrop-blur-sm border border-abyss-400/30 rounded-xl text-white placeholder-abyss-300/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-bitcoin-500/50 focus:border-bitcoin-500/50 focus:bg-deepSea-surface/70"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-abyss-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Results count */}
        {query && (
          <p className="text-abyss-200 mb-6">
            {filteredPosts.length === 0 
              ? "No posts found" 
              : `Found ${filteredPosts.length} post${filteredPosts.length === 1 ? '' : 's'}`
            }
          </p>
        )}

        {/* Search Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={post.url} 
              className="group bg-deepSea-middle/40 backdrop-blur-sm border border-abyss-400/20 rounded-xl p-6 hover:border-bitcoin-500/50 hover:shadow-bitcoin transition-all duration-300 hover:scale-[1.02]"
            >
              <h2 className="text-2xl font-semibold mb-4 text-abyss-100 group-hover:text-bitcoin-400 transition-colors">{post.title}</h2>
              <div className="text-sm text-abyss-300 mb-4">
                <span>{format(parseISO(post.date), 'MMMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </div>
              {post.categories && post.categories.length > 0 && (
                <div className="mb-4">
                  {post.categories.map((category) => (
                    <span 
                      key={category} 
                      className="inline-block bg-bitcoin-500/20 backdrop-blur-sm border border-bitcoin-500/30 rounded-full px-3 py-1 text-sm font-semibold text-bitcoin-400 mr-2 mb-2 hover:bg-bitcoin-500/30 transition-colors"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
              {post.excerpt && <p className="text-abyss-200 mb-4 line-clamp-3">{post.excerpt}</p>}
              <div className="text-bitcoin-400 group-hover:text-bitcoin-300 font-medium inline-flex items-center gap-1 transition-colors">
                Read More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
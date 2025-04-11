'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { loadPosts } from '@/lib/content-loader';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const allPosts = loadPosts();
  
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link 
            key={post.slug} 
            href={post.url} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>
            {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
            <div className="text-blue-500 hover:underline">Read More</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

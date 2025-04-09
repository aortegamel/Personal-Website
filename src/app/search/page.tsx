'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { allPosts, allProjects } from 'contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';

type SearchResult = {
  title: string;
  url: string;
  date?: string;
  excerpt?: string;
  category?: string;
  type: 'post' | 'project';
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Combine posts and projects for searching
      const combinedContent = [
        ...allPosts.map(post => ({
          ...post,
          type: 'post' as const,
          searchContent: [
            post.title, 
            post.excerpt || '', 
            post.categories?.join(' ') || '', 
            post.tags?.join(' ') || ''
          ].join(' ').toLowerCase()
        })),
        ...allProjects.map(project => ({
          ...project,
          type: 'project' as const,
          searchContent: [
            project.name, 
            project.description, 
            project.tech_stack?.join(' ') || '', 
            project.features?.join(' ') || ''
          ].join(' ').toLowerCase()
        }))
      ];

      // Filter results based on search query
      const filteredResults = combinedContent
        .filter(item => 
          item.searchContent.includes(searchQuery.toLowerCase())
        )
        .map(item => ({
          title: item.type === 'post' ? item.title : item.name,
          url: item.url,
          date: item.type === 'post' ? format(parseISO(item.date), 'LLLL d, yyyy') : undefined,
          excerpt: item.type === 'post' ? item.excerpt : item.description,
          category: item.type === 'post' ? item.categories?.[0] : undefined,
          type: item.type
        }))
        // Sort results by date (for posts) or alphabetically (for projects)
        .sort((a, b) => {
          if (a.type === 'post' && b.type === 'post' && a.date && b.date) {
            return compareDesc(parseISO(a.date), parseISO(b.date));
          }
          return a.title.localeCompare(b.title);
        });

      setResults(filteredResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts and projects..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r font-medium transition"
          >
            Search
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {!isLoading && !error && results.length === 0 && query && (
        <p className="text-gray-600">No results found for "{query}"</p>
      )}
      
      {results.length > 0 && (
        <div>
          <p className="mb-4 text-gray-600">{results.length} results found for "{query}"</p>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold mb-2">
                  <Link href={result.url} className="text-blue-600 hover:text-blue-800">
                    {result.title}
                  </Link>
                </h2>
                {result.date && (
                  <p className="text-gray-500 mb-2">{result.date}</p>
                )}
                {result.category && (
                  <p className="text-sm text-gray-600 mb-2">
                    {result.type === 'post' ? 'Category: ' : 'Type: '}{result.category}
                  </p>
                )}
                {result.excerpt && (
                  <p className="text-gray-700 mb-2">{result.excerpt}</p>
                )}
                <Link href={result.url} className="text-blue-600 hover:text-blue-800">
                  Read more
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

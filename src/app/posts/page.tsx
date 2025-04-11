import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { loadPosts } from '@/lib/content-loader';

export default function PostsPage() {
  const posts = loadPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={post.url} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>{format(parseISO(post.date), 'MMMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>
            <div className="mb-4">
              {post.categories.map((category) => (
                <span 
                  key={category} 
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {category}
                </span>
              ))}
            </div>
            {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
            <div className="text-blue-500 hover:underline">Read More</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

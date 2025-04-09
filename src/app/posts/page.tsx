import { allPosts } from '.contentlayer/generated';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostsPage() {
  // Sort posts by date in descending order (most recent first)
  const sortedPosts = allPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
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
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <span 
                  key={category} 
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="text-blue-500 hover:underline">Read More</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Blog Posts | Angleito Portfolio',
  description: 'A collection of my thoughts, insights, and experiences across various topics.'
};

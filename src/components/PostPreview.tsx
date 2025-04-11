import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    categories: string[];
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <Link 
      href={`/posts/${post.slug}`} 
      className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        <span>{format(parseISO(post.date), 'LLLL d, yyyy')}</span>
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
  );
}

import Link from 'next/link';

interface PostPreviewProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  categories?: string[];
}

export default function PostPreview({ 
  title, 
  date, 
  excerpt, 
  slug, 
  categories 
}: PostPreviewProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/posts/${slug}`} className="text-blue-600 hover:text-blue-800">
          {title}
        </Link>
      </h3>
      <p className="text-gray-500 text-sm mb-2">{date}</p>
      {categories && categories.length > 0 && (
        <div className="mb-2">
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/categories/${category}`} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full mr-2"
            >
              {category}
            </Link>
          ))}
        </div>
      )}
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <Link 
        href={`/posts/${slug}`} 
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Read More →
      </Link>
    </div>
  );
}

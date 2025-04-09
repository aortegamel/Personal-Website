import Link from 'next/link';
import { getAllCategories } from '@/lib/mdx';

export const metadata = {
  title: 'Categories - Angleito\'s Portfolio',
  description: 'Browse articles by category including economics, crypto, personal, AI, and development.',
};

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  economics: 'Articles about economic theories, market analysis, and financial insights.',
  crypto: 'Blockchain technology, cryptocurrency analysis, and DeFi innovations.',
  personal: 'Personal stories, experiences, and reflections on my journey.',
  ai: 'Artificial intelligence, machine learning, and their applications.',
  development: 'Programming, software development, and technical projects.',
  politics: 'Political analysis, commentary, and perspectives.',
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Article Categories</h1>
      <p className="text-xl text-gray-600 mb-8">
        Browse articles by category:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div 
            key={category} 
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold mb-2">
              <Link 
                href={`/categories/${category}`} 
                className="text-blue-600 hover:text-blue-800"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            </h2>
            <p className="text-gray-600">
              {categoryDescriptions[category] || 'Articles related to this topic.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

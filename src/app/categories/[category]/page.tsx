import { getPostsByCategory, getAllCategories } from '@/lib/mdx';
import PostPreview from '@/components/PostPreview';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category;
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${categoryTitle} Articles - Angleito's Portfolio`,
    description: `Browse all articles related to ${category} including the latest insights and analysis.`,
  };
}

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  economics: 'Articles about economic theories, market analysis, and financial insights.',
  crypto: 'Blockchain technology, cryptocurrency analysis, and DeFi innovations.',
  personal: 'Personal stories, experiences, and reflections on my journey.',
  ai: 'Artificial intelligence, machine learning, and their applications.',
  development: 'Programming, software development, and technical projects.',
  politics: 'Political analysis, commentary, and perspectives.',
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category;
  const posts = getPostsByCategory(category);
  
  if (!getAllCategories().includes(category)) {
    notFound();
  }
  
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{categoryTitle} Articles</h1>
      <p className="text-xl text-gray-600 mb-8">
        {categoryDescriptions[category] || 'Articles related to this topic.'}
      </p>
      
      <div className="space-y-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostPreview key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-gray-600">No articles in this category yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}

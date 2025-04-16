interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

const sortedPosts: Post[] = [
  {
    slug: 'post-1',
    title: 'First Blog Post',
    date: '2025-01-15',
    excerpt: 'An introduction to our blog'
  },
  {
    slug: 'post-2',
    title: 'Second Blog Post',
    date: '2025-02-20',
    excerpt: 'Exploring new technologies'
  }
];

import Navbar from "../components/Navbar";

export default function PostsPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post: Post) => (
          <a 
            key={post.slug} 
            href={`/posts/${post.slug}`} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </div>
    </>
  );
}
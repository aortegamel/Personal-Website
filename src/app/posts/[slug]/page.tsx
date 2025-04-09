import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { compareDesc } from 'date-fns';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: `${post.title} - Angleito's Portfolio`,
    description: post.excerpt,
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Find previous and next posts for navigation
  const sortedPosts = allPosts.sort((a, b) => 
    compareDesc(new Date(a.date), new Date(b.date))
  );
  const currentIndex = sortedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  return (
    <article className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500">
          <time dateTime={post.date}>
            {format(parseISO(post.date), 'LLLL d, yyyy')}
          </time>
          {post.author && <> • {post.author}</>}
          {post.categories && post.categories.length > 0 && (
            <>
              {' • Categories: '}
              {post.categories.map((category, index) => (
                <span key={category}>
                  <Link 
                    href={`/categories/${category}`} 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {category}
                  </Link>
                  {index < post.categories.length - 1 && ', '}
                </span>
              ))}
            </>
          )}
        </p>
      </header>

      <div 
        className="prose prose-lg max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.body.html }} 
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-2">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Download Article:</h4>
        <Link 
          href={`/api/pdf/${post.slug}`}
          target="_blank"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
        >
          <span className="mr-2">📄</span> Download as PDF
        </Link>
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
        {prevPost ? (
          <Link 
            href={`/posts/${prevPost.slug}`} 
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; {prevPost.title}
          </Link>
        ) : (
          <div></div>
        )}
        {nextPost ? (
          <Link 
            href={`/posts/${nextPost.slug}`} 
            className="text-blue-600 hover:text-blue-800"
          >
            {nextPost.title} &rarr;
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </article>
  );
}

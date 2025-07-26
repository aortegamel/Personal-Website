import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface PostPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Function to estimate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffc300' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}
      ></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl relative z-10">
        <article className="abyss-card hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
        <header className="mb-12 pb-8 border-b border-abyss-500/20">
          <h1 className="text-5xl sm:text-6xl font-display font-bold mb-6 text-gradient-ocean leading-tight tracking-tight">{post.title}</h1>
          <div className="text-white/70 text-lg mb-6 flex flex-wrap items-center gap-2">
            <span className="font-medium">{format(parseISO(post.date), 'MMMM d, yyyy')}</span>
            <span className="text-bitcoin-500 text-xl">•</span>
            <span className="font-medium text-abyss-300">{post.author}</span>
            <span className="text-bitcoin-500 text-xl">•</span>
            <span className="font-medium text-abyss-300">{readingTime} min read</span>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {post.categories.map((category) => (
              <span 
                key={category} 
                className="inline-flex items-center bg-deepSea-surface/40 backdrop-blur-sm border border-bitcoin-500/30 rounded-full px-4 py-2 text-sm font-medium text-bitcoin-400 hover:bg-deepSea-surface/60 hover:border-bitcoin-500/50 transition-all duration-300"
              >
                {category}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg sm:prose-xl max-w-none animate-fade-in-up
          /* Base Typography & Accessibility */
          prose-headings:text-white prose-headings:font-display prose-headings:tracking-tight prose-headings:scroll-mt-20
          prose-headings:focus:outline-none prose-headings:focus:ring-2 prose-headings:focus:ring-bitcoin-500/50 prose-headings:focus:rounded
          
          /* Responsive Heading Sizes with Better Contrast */
          prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-6 prose-h1:text-gradient-ocean
          prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:leading-snug prose-h2:mb-5 prose-h2:mt-8 prose-h2:text-white prose-h2:font-bold
          prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:leading-snug prose-h3:mb-4 prose-h3:mt-6 prose-h3:text-abyss-300 prose-h3:font-semibold
          prose-h4:text-lg sm:prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-5 prose-h4:text-abyss-400 prose-h4:font-semibold
          
          /* Enhanced Body Text with Better Line Height */
          prose-p:text-white/90 prose-p:text-base sm:prose-p:text-lg prose-p:leading-[1.7] sm:prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-pretty
          prose-strong:text-bitcoin-400 prose-strong:font-semibold
          prose-em:text-abyss-300 prose-em:italic
          
          /* Enhanced Blockquotes with Better Visual Hierarchy */
          prose-blockquote:border-l-4 prose-blockquote:border-bitcoin-500 prose-blockquote:bg-deepSea-surface/30 
          prose-blockquote:rounded-r-lg prose-blockquote:p-4 sm:prose-blockquote:p-6 prose-blockquote:my-8 prose-blockquote:text-white/85
          prose-blockquote:backdrop-blur-sm prose-blockquote:italic prose-blockquote:shadow-md prose-blockquote:font-medium
          
          /* Enhanced Code Styling */
          prose-code:text-bitcoin-400 prose-code:bg-deepSea-surface/60 prose-code:px-2 prose-code:py-1 
          prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-code:border prose-code:border-bitcoin-500/30 prose-code:font-medium
          
          /* Enhanced Code Blocks */
          prose-pre:bg-deepSea-abyss/90 prose-pre:border prose-pre:border-abyss-500/40 prose-pre:rounded-xl 
          prose-pre:p-4 sm:prose-pre:p-6 prose-pre:my-8 prose-pre:overflow-x-auto prose-pre:backdrop-blur-sm
          prose-pre:shadow-xl prose-pre:text-abyss-200 prose-pre:scrollbar-abyss prose-pre:leading-relaxed
          
          /* Enhanced Links with Better Focus States */
          prose-a:text-bitcoin-400 prose-a:font-medium prose-a:no-underline prose-a:transition-all prose-a:duration-300
          hover:prose-a:text-bitcoin-300 prose-a:border-b prose-a:border-bitcoin-500/30 hover:prose-a:border-bitcoin-400/70
          hover:prose-a:shadow-sm focus:prose-a:outline-none focus:prose-a:ring-2 focus:prose-a:ring-bitcoin-500/50 focus:prose-a:rounded
          
          /* Enhanced Lists with Better Spacing */
          prose-ul:space-y-3 prose-ol:space-y-3 prose-li:text-white/90 prose-li:leading-[1.7]
          prose-li:marker:text-bitcoin-500 prose-ul:my-8 prose-ol:my-8 prose-li:pl-2
          
          /* Enhanced Dividers */
          prose-hr:border-abyss-500/40 prose-hr:my-12 prose-hr:border-t-2 prose-hr:rounded-full
          
          /* Enhanced Tables */
          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:overflow-hidden prose-table:rounded-lg prose-table:shadow-lg
          prose-th:bg-deepSea-surface/60 prose-th:text-white prose-th:font-semibold prose-th:p-4 prose-th:border prose-th:border-abyss-500/40
          prose-td:text-white/90 prose-td:p-4 prose-td:border prose-td:border-abyss-500/30 prose-td:leading-relaxed
          
          /* Enhanced Images */
          prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8 prose-img:transition-all prose-img:duration-300
          hover:prose-img:scale-[1.02] prose-img:border prose-img:border-abyss-500/20">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

import Link from 'next/link';
import { allPosts, allProjects } from 'contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';
import PostPreview from '@/components/PostPreview';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  // Sort posts by date, most recent first
  const sortedPosts = allPosts.sort((a, b) => 
    compareDesc(new Date(a.date), new Date(b.date))
  );

  // Take the first 3 posts
  const recentPosts = sortedPosts.slice(0, 3);

  // Take all projects
  const projects = allProjects;

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Exploring technology, sharing insights, and showcasing projects that push the boundaries of innovation.
        </p>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Recent Posts</h2>
          <Link 
            href="/posts" 
            className="text-blue-600 hover:text-blue-800 transition"
          >
            View All Posts →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostPreview 
              key={post.slug}
              title={post.title}
              date={format(parseISO(post.date), 'LLLL d, yyyy')}
              excerpt={post.excerpt || ''}
              slug={post.slug}
              categories={post.categories}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Projects</h2>
          <Link 
            href="/projects" 
            className="text-blue-600 hover:text-blue-800 transition"
          >
            View All Projects →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.slug}
              name={project.name}
              description={project.description}
              techStack={project.tech_stack}
              slug={project.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

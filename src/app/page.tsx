import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import PostPreview from '@/components/PostPreview';
import ProjectCard from '@/components/ProjectCard';
import { loadPosts, loadProjects } from '@/lib/content-loader';

export default function Home() {
  const sortedPosts = loadPosts();
  const recentPosts = sortedPosts.slice(0, 3);
  const projects = loadProjects();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Exploring technology, sharing insights, and showcasing projects that push the boundaries of innovation.
        </p>
        <p className="text-lg text-zinc-300 mb-6">
          I am a finance graduate who has transformed into a software developer by mastering AI agentic coding tools like Claude Code, Aider, GitHub Copilot, and Cursor. These powerful AI assistants have accelerated my learning journey and development capabilities, allowing me to build sophisticated projects efficiently. With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions with modern technologies. My background in finance and customer service, combined with my AI-assisted technical skills, enables me to tackle complex problems and deliver impactful software. I'm passionate about pushing the boundaries of what's possible when human creativity meets AI collaboration.
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
              post={post}
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
              techStack={project.techStack}
              slug={project.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

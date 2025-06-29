import Link from 'next/link';
import { ProjectCard } from '@/components/common/ProjectCard';
import { loadProjects } from '@/lib/content-loader';

export default function Home() {
  const projects = loadProjects();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <h1 className="text-5xl font-bold mb-8 abyss-gradient-text">Welcome to My Portfolio</h1>
        <p className="text-xl text-abyss-200 max-w-3xl mb-6">
          Exploring technology, sharing insights, and showcasing projects that push the boundaries of innovation.
        </p>
        <p className="text-lg text-abyss-300 max-w-4xl">
          I am a finance graduate who has transformed into a software developer by mastering AI agentic coding tools like Claude Code, Aider, GitHub Copilot, and Cursor. These powerful AI assistants have accelerated my learning journey and development capabilities, allowing me to build sophisticated projects efficiently. With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions with modern technologies. My background in finance and customer service, combined with my AI-assisted technical skills, enables me to tackle complex problems and deliver impactful software. I'm passionate about pushing the boundaries of what's possible when human creativity meets AI collaboration.
        </p>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-bitcoin-400">Featured Projects</h2>
          <p className="text-xl text-abyss-300 max-w-2xl mx-auto">
            Innovative solutions leveraging cutting-edge technologies in DeFi, AI, and blockchain development.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {projects.slice(0, 4).map((project) => (
            <div key={project.slug} className="abyss-card hover:border-bitcoin-500/30 transition-all duration-300">
              <ProjectCard 
                project={{
                  ...project,
                  url: `/projects/${project.slug}`
                }}
              />
            </div>
          ))}
        </div>

        {projects.length > 4 && (
          <div className="text-center mt-12">
            <Link 
              href="/projects" 
              className="bitcoin-button inline-flex items-center gap-2 text-lg"
            >
              <span>View All Projects</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

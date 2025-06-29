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
          I am a finance major and self-taught programmer who has mastered AI agentic coding tools like Claude Code, Aider, GitHub Copilot, and Cursor. These powerful AI assistants have accelerated my learning journey and development capabilities, allowing me to build sophisticated projects efficiently. With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions with modern technologies. My background in finance combined with my self-taught technical skills enables me to tackle complex problems and deliver impactful software. I'm passionate about pushing the boundaries of what's possible when human creativity meets AI collaboration.
        </p>
      </section>

      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-bitcoin-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-abyss-500/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-abyss-200 max-w-3xl mx-auto leading-relaxed">
            Innovative solutions leveraging cutting-edge technologies in DeFi, AI, and blockchain development.
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Featured project - Single Agent Trader */}
          {projects.length > 0 && (
            <div className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up">
              <ProjectCard 
                project={{
                  ...projects[0],
                  url: `/projects/${projects[0].slug}`
                }}
                variant="featured"
              />
            </div>
          )}

          {/* Grid for remaining projects with NyxUSD prominently displayed */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.slice(1, 4).map((project, index) => (
              <div 
                key={project.slug} 
                className={`transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up`}
                style={{ 
                  animationDelay: `${(index + 1) * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="h-full bg-gradient-to-br from-abyss-800/50 to-abyss-900/50 rounded-lg p-[1px] hover:from-bitcoin-500/20 hover:to-abyss-700/20 transition-all duration-300">
                  <div className="h-full bg-abyss-900 rounded-lg">
                    <ProjectCard 
                      project={{
                        ...project,
                        url: `/projects/${project.slug}`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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

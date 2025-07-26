import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectCard } from '../components/common/ProjectCard';
import { getAllProjects } from '../lib/content-loader';
import { ContentMeta } from '../types/content';
import ParticleButton from '../components/ParticleButton';
import { ParticleCTA } from '../components/ui/particle-cta';

export function HomePage() {
  const [projects, setProjects] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(allProjects => {
        // Show featured projects first, then others
        const featured = allProjects.filter(p => p.featured);
        const nonFeatured = allProjects.filter(p => !p.featured);
        setProjects([...featured, ...nonFeatured]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="loading-text">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-16">
        <ParticleCTA className="rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-5xl font-bold mb-8 abyss-gradient-text">Welcome to My Portfolio</h1>
            <p className="text-xl text-abyss-200 max-w-3xl mb-6">
              Exploring technology, sharing insights, and showcasing projects that push the boundaries of innovation.
            </p>
            <p className="text-lg text-abyss-300 max-w-4xl mb-8">
              I am a finance major and self-taught programmer who has mastered AI agentic coding tools like Claude Code, Aider, GitHub Copilot, and Cursor. These powerful AI assistants have accelerated my learning journey and development capabilities, allowing me to build sophisticated projects efficiently. With experience in Python, JavaScript, and web development, I leverage AI to create innovative solutions with modern technologies. My background in finance combined with my self-taught technical skills enables me to tackle complex problems and deliver impactful software. I'm passionate about pushing the boundaries of what's possible when human creativity meets AI collaboration.
            </p>
            <div className="flex gap-4 flex-wrap">
              <ParticleButton className="bitcoin-button-magnetic">
                <Link to="/projects">
                  Explore All Projects
                </Link>
              </ParticleButton>
              <Link to="/about" className="abyss-button inline-block">
                Learn More About Me
              </Link>
            </div>
          </div>
        </ParticleCTA>
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
                  name: projects[0].title,
                  techStack: projects[0].tags,
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
                        name: project.title,
                        techStack: project.tags,
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
              to="/projects" 
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
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectCard } from '../components/common/ProjectCard';
import { getAllProjects } from '../lib/content';
import type { ContentMeta } from '../types/content';
import ParticleButton from '../components/ParticleButton';
import { AbyssOrb } from '../components/AbyssOrb';
import { ParticleCTA } from '../components/ui/particle-cta';
import { Seo } from '../components/Seo';
import { site } from '../site';

const HOME_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${site.name} | Portfolio`,
  description: site.description,
  author: { '@type': 'Person', name: site.name },
};

export function HomePage() {
  const [projects, setProjects] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(allProjects => {
        // Stockbot first, then other featured, then the rest
        const byPriority = (p: ContentMeta) =>
          p.slug === 'stockbot' ? 0 : p.featured ? 1 : 2;
        setProjects([...allProjects].sort((a, b) => byPriority(a) - byPriority(b)));
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Seo
        title={`${site.name} | Portfolio`}
        description={site.description}
        path="/"
        jsonLd={HOME_JSONLD}
      />
      <section className="mb-16">
        <ParticleCTA className="rounded-2xl overflow-hidden">
          <AbyssOrb className="right-6 top-4 hidden h-[88px] w-[150px] md:block lg:h-[106px] lg:w-[180px]" />
          <div className="p-8 md:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 abyss-gradient-text md:pr-40 lg:pr-48 xl:pr-0">{site.name}</h1>
            <p className="text-xl text-abyss-200 max-w-3xl mb-6">
              Exploring {site.tagline}: technology, insights, and projects that push the boundaries of innovation.
            </p>
            <p className="text-lg text-abyss-300 max-w-4xl mb-8">
              I&apos;m a software engineer building AI-integrated applications, agent tooling, and data pipelines. Winner of Best Technical Implementation at the Walrus Haulout Hackathon 2025, I ship full-stack fast and ground AI output in verifiable data.
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
        <ParticleCTA className="rounded-2xl">
          <div className="py-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin-400 via-bitcoin-300 to-abyss-400 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-xl text-abyss-200 max-w-3xl mx-auto leading-relaxed">
                Innovative solutions in AI-integrated applications, agent tooling, and data pipelines.
              </p>
            </div>

            <div className="space-y-12">
              {/* Featured project */}
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

              {/* Grid for remaining projects */}
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
          </div>
        </ParticleCTA>
      </section>
    </div>
  );
}

import { getAllProjects, getProjectBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket, FaCog } from 'react-icons/fa';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Special features for specific projects
  const projectFeatures = {
    nyxusd: [
      { icon: <FaRocket />, title: 'DeFi Innovation', description: 'Cutting-edge decentralized finance protocol' },
      { icon: <FaCog />, title: 'Smart Contracts', description: 'Audited and optimized Solidity contracts' },
      { icon: <FaCode />, title: 'High Performance', description: 'Built for scalability and efficiency' }
    ],
    singleagenttrader: [
      { icon: <FaRocket />, title: 'AI-Powered', description: 'Advanced machine learning algorithms' },
      { icon: <FaCog />, title: 'Real-time Trading', description: 'Low-latency execution engine' },
      { icon: <FaCode />, title: 'Risk Management', description: 'Sophisticated risk controls' }
    ],
    bot: [
      { icon: <FaRocket />, title: 'Flash Loans', description: 'Automated arbitrage opportunities' },
      { icon: <FaCog />, title: 'Multi-DEX', description: 'Supports multiple exchanges' },
      { icon: <FaCode />, title: 'Gas Optimized', description: 'Efficient transaction processing' }
    ]
  };

  const features = projectFeatures[project.slug as keyof typeof projectFeatures] || [];

  return (
    <div className="min-h-screen bg-deepSea-abyss">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[768px] h-[768px] bg-bitcoin-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-96 -left-96 w-[768px] h-[768px] bg-abyss-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[512px] h-[512px] bg-deepSea-shallow/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <article className="space-y-12">
          {/* Header Section */}
          <header className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold abyss-gradient-text mb-4">
              {project.name}
            </h1>
            
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {project.techStack.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="bitcoin"
                  className="text-sm font-semibold px-4 py-1.5"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {project.github && (
                <Button
                  href={project.github}
                  external
                  variant="bitcoin"
                  size="lg"
                  className="group"
                >
                  <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  View on GitHub
                </Button>
              )}
              {project.slug === 'nyxusd' && (
                <Button
                  href="#"
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  <FaExternalLinkAlt className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Live Demo
                </Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="bg-deepSea-deep/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-abyss-400/20 shadow-2xl">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-abyss-100 text-xl leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Features Section (for special projects) */}
            {features.length > 0 && (
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-deepSea-abyss/50 rounded-lg p-6 border border-abyss-400/20 hover:border-bitcoin-500/30 transition-all duration-300 hover:shadow-bitcoin"
                  >
                    <div className="text-bitcoin-400 text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-abyss-100 font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-abyss-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Project Info */}
            <div className="mt-12 pt-8 border-t border-abyss-400/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-abyss-100 font-semibold text-lg mb-4">Key Technologies</h3>
                  <div className="space-y-2">
                    {project.techStack.map((tech) => (
                      <div key={tech} className="flex items-center text-abyss-300">
                        <FaCode className="mr-2 text-bitcoin-400" />
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {project.slug === 'nyxusd' && (
                  <div>
                    <h3 className="text-abyss-100 font-semibold text-lg mb-4">DeFi Features</h3>
                    <ul className="space-y-2 text-abyss-300">
                      <li className="flex items-start">
                        <span className="text-bitcoin-400 mr-2">•</span>
                        <span>Decentralized stablecoin protocol</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-bitcoin-400 mr-2">•</span>
                        <span>Automated market making</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-bitcoin-400 mr-2">•</span>
                        <span>Yield farming opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-bitcoin-400 mr-2">•</span>
                        <span>Cross-chain compatibility</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Projects Link */}
          <div className="text-center">
            <Button
              href="/projects"
              variant="ghost"
              size="lg"
              className="group"
            >
              ← Back to All Projects
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({ slug: project.slug }));
}

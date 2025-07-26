import { getAllProjects } from '@/lib/mdx';
import { ProjectCard } from '@/components/common/ProjectCard';

export default function ProjectsPage() {
  const projects = getAllProjects();
  
  // Define featured projects
  const featuredSlugs = ['nyxusd', 'singleagenttrader', 'qwensuicoder'];

  return (
    <div className="min-h-screen bg-abyss-900">
      <div className="container mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-abyss-100 mb-4">
            Projects
          </h1>
          <p className="text-xl text-abyss-200 max-w-2xl mx-auto">
            Exploring the intersection of AI, blockchain, and decentralized finance through innovative solutions
          </p>
        </div>

        {/* Featured Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-montserrat font-bold text-bitcoin-400 mb-8">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter(project => featuredSlugs.includes(project.slug))
              .map((project) => (
                <ProjectCard 
                  key={project.slug} 
                  project={project} 
                  variant="featured"
                />
              ))}
          </div>
        </div>

        {/* Other Projects Section */}
        {projects.filter(project => !featuredSlugs.includes(project.slug)).length > 0 && (
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-abyss-100 mb-8">
              Other Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(project => !featuredSlugs.includes(project.slug))
                .map((project) => (
                  <ProjectCard 
                    key={project.slug} 
                    project={project} 
                    variant="default"
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

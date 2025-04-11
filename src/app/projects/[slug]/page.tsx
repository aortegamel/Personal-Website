import { getAllProjects, getProjectBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span 
                key={tech} 
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>{project.description}</p>
        </div>

        {project.github && (
          <div className="mt-8">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </div>
        )}
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({ slug: project.slug }));
}

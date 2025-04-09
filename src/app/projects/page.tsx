import { allProjects } from '.contentlayer/generated';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project) => (
          <Link 
            key={project.slug} 
            href={project.url} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.map((tech) => (
                <span 
                  key={tech} 
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                View on GitHub
              </a>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Projects | Angleito Portfolio',
  description: 'A collection of my software development projects showcasing various technologies and skills.'
};

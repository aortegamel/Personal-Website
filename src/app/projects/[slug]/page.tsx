import { allProjects } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = allProjects.find((p) => p.slug === params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  return {
    title: `${project.name} - Angleito's Portfolio`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((p) => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
        
        <div className="text-gray-600 mb-4">
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span 
                key={tech} 
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          {project.github && (
            <Link 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              GitHub Repository
            </Link>
          )}
          {project.has_demo && (
            <Link 
              href="#" 
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Live Demo
            </Link>
          )}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <div 
          className="prose prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: project.body.html }} 
        />
      </section>

      {project.features && project.features.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {project.contact && (
        <section className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-gray-700">{project.contact}</p>
        </section>
      )}
    </div>
  );
}

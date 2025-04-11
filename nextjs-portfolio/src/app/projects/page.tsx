interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
}

const allProjects: Project[] = [
  {
    slug: 'project-1',
    name: 'Web Portfolio',
    description: 'A responsive personal portfolio website',
    techStack: ['Next.js', 'React', 'Tailwind CSS']
  },
  {
    slug: 'project-2',
    name: 'Task Management App',
    description: 'A full-stack task tracking application',
    techStack: ['Node.js', 'Express', 'MongoDB']
  }
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project: Project) => (
          <a 
            key={project.slug} 
            href={`/projects/${project.slug}`} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-blue-500 hover:underline">View Project</div>
          </a>
        ))}
      </div>
    </div>
  );
}
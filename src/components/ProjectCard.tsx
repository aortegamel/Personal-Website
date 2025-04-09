import Link from 'next/link';

interface ProjectCardProps {
  name: string;
  description: string;
  techStack: string[];
  slug: string;
}

export default function ProjectCard({ 
  name, 
  description, 
  techStack, 
  slug 
}: ProjectCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/projects/${slug}`} className="text-blue-600 hover:text-blue-800">
          {name}
        </Link>
      </h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span 
              key={tech} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <Link 
        href={`/projects/${slug}`} 
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        View Project →
      </Link>
    </div>
  );
}

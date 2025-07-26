'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  renderTechStack, 
  createVariantRenderer, 
  truncateList,
  renderBadges 
} from '../../lib/ui-utils';

interface Project {
  slug: string;
  name?: string;
  title?: string;
  description: string;
  techStack?: string[];
  technologies?: string[];
  features?: string[];
  github?: string;
  demo?: string;
  url?: string;
}

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'featured';
}

// Pure function for GitHub icon
const GitHubIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

// Pure function for project header
const ProjectHeader = ({ name, url, title }: { name?: string; url: string; title?: string }) => (
  <CardTitle className="break-words">
    <Link to={url} className="abyss-link hover:text-bitcoin-400 transition-colors">
      {name || title}
    </Link>
  </CardTitle>
);

// Pure function for project features
const ProjectFeatures = ({ features, url }: { features: string[]; url: string }) => {
  const { displayed, moreText } = truncateList(features, 3, (count) => `+${count} more features`);
  
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-abyss-200 mb-2">Key Features:</h4>
      <ul className="list-disc list-inside text-sm text-abyss-100 space-y-1">
        {displayed.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
        {moreText && (
          <li className="text-bitcoin-400">
            <Link to={url}>{moreText}</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

// Pure function for project actions
const ProjectActions = ({ 
  github, 
  demo, 
  url, 
  size = 'sm' 
}: { 
  github?: string; 
  demo?: string; 
  url: string; 
  size?: 'sm' | 'default' | 'lg';
}) => (
  <div className="flex flex-wrap gap-2">
    {github && (
      <Button variant="outline" size={size} href={github} external>
        <GitHubIcon />
        View Code
      </Button>
    )}
    {demo && (
      <Button variant="bitcoin" size={size} href={demo} external>
        Live Demo
      </Button>
    )}
    <Button variant="default" size={size} href={url}>
      Details
    </Button>
  </div>
);

// Variant renderers as pure functions
const CompactProjectCard = ({ project }: { project: Project }) => {
  const projectUrl = project.url || `/projects/${project.slug}`;
  const techStack = project.techStack || project.technologies || [];
  
  return (
    <article className="border-b border-abyss-700/30 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <h3 className="text-lg font-bold mb-1 font-montserrat break-words">
        <Link to={projectUrl} className="abyss-link hover:text-bitcoin-400 transition-colors">
          {project.name || project.title}
        </Link>
      </h3>
      <p className="text-abyss-100 text-sm mb-2 line-clamp-2">{project.description}</p>
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {renderBadges(techStack, 'default', 3, 'text-xs')}
        </div>
      )}
    </article>
  );
};

const FeaturedProjectCard = ({ project }: { project: Project }) => {
  const projectUrl = project.url || `/projects/${project.slug}`;
  const techStack = project.techStack || project.technologies || [];
  
  return (
    <Card hover="glow" variant="highlight" className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <ProjectHeader name={project.name} title={project.title} url={projectUrl} />
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <p className="text-abyss-100 mb-6 leading-relaxed">{project.description}</p>
        
        {techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-abyss-200 mb-3">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {renderTechStack(techStack)}
            </div>
          </div>
        )}
        
        {project.features && project.features.length > 0 && (
          <ProjectFeatures features={project.features} url={projectUrl} />
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-6 mt-auto">
        <ProjectActions 
          github={project.github} 
          demo={project.demo} 
          url={projectUrl} 
        />
      </CardFooter>
    </Card>
  );
};

const DefaultProjectCard = ({ project }: { project: Project }) => {
  const projectUrl = project.url || `/projects/${project.slug}`;
  const techStack = project.techStack || project.technologies || [];
  
  return (
    <Card hover="border" className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <ProjectHeader name={project.name} title={project.title} url={projectUrl} />
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <p className="text-abyss-100 mb-4 leading-relaxed">{project.description}</p>
        
        {techStack.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-abyss-200 mb-3">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {renderTechStack(techStack)}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-6 mt-auto">
        <ProjectActions 
          github={project.github} 
          demo={project.demo} 
          url={projectUrl} 
        />
      </CardFooter>
    </Card>
  );
};

// Create the variant renderer
const renderProjectCard = createVariantRenderer<{ project: Project }, 'default' | 'compact' | 'featured'>({
  compact: CompactProjectCard,
  featured: FeaturedProjectCard,
  default: DefaultProjectCard,
}, 'default');

// Main component is now just a wrapper
export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  return renderProjectCard({ project, variant });
}
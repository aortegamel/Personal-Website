'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: {
    slug: string;
    name: string;
    description: string;
    techStack?: string[];
    features?: string[];
    github?: string;
    demo?: string;
    url: string;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const { name, description, techStack, features, github, demo, url } = project;
  
  if (variant === 'compact') {
    return (
      <article className="border-b border-abyss-700/30 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <h3 className="text-lg font-bold mb-1 font-montserrat">
          <Link href={url} className="abyss-link">
            {name}
          </Link>
        </h3>
        <p className="text-abyss-100 text-sm mb-2">{description}</p>
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {techStack.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{techStack.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </article>
    );
  }
  
  if (variant === 'featured') {
    return (
      <Card hover="glow" variant="highlight" className="h-full">
        <CardHeader>
          <CardTitle>
            <Link href={url} className="abyss-link">
              {name}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-abyss-100 mb-4">{description}</p>
          
          {techStack && techStack.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-abyss-200 mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {features && features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-abyss-200 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside text-sm text-abyss-100 space-y-1">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
                {features.length > 3 && (
                  <li className="text-bitcoin-400">
                    <Link href={url}>+{features.length - 3} more features</Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {github && (
            <Button variant="outline" size="sm" href={github} external>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View Code
            </Button>
          )}
          {demo && (
            <Button variant="bitcoin" size="sm" href={demo} external>
              Live Demo
            </Button>
          )}
          <Button variant="default" size="sm" href={url}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card hover="border" className="h-full">
      <CardHeader>
        <CardTitle>
          <Link href={url} className="abyss-link">
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-abyss-100 mb-4">{description}</p>
        
        {techStack && techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-abyss-200 mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {github && (
          <Button variant="outline" size="sm" href={github} external>
            View Code
          </Button>
        )}
        {demo && (
          <Button variant="bitcoin" size="sm" href={demo} external>
            Live Demo
          </Button>
        )}
        <Button variant="default" size="sm" href={url}>
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}

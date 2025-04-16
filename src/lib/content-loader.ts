import { allPosts, allProjects } from 'contentlayer/generated'

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  categories: string[];
  author: string;
  url: string;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  github?: string;
  url: string;
}

export function loadPosts(): Post[] {
  return allPosts
    .map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt || '',
      categories: post.categories || [],
      author: post.author,
      url: post.url
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function loadProjects(): Project[] {
  return allProjects.map(project => ({
    slug: project.slug,
    name: project.name,
    description: project.description,
    techStack: project.tech_stack || [],
    github: project.github,
    url: project.url
  }));
}

export async function generateStaticParams() {
  const posts = loadPosts();
  const projects = loadProjects();
  return {
    posts: posts.map(post => ({ slug: post.slug })),
    projects: projects.map(project => ({ slug: project.slug }))
  };
}
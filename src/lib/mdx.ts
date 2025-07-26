import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, Project } from './types';

// Re-export types for backward compatibility
export type { Post, Project } from './types';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const projectsDirectory = path.join(process.cwd(), 'src/content/projects');

function loadProjectFromFile(filename: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Extract slug from filename (remove .md extension)
    const slug = filename.replace(/\.md$/, '');
    
    return {
      slug,
      name: data.name || 'Untitled Project',
      description: data.description || '',
      techStack: data.tech_stack || data.techStack || [],
      github: data.github,
      demo: data.demo,
      webpage: data.webpage,
      features: data.features || [],
      url: `/projects/${slug}`,
      content
    };
  } catch (error) {
    console.error(`Error loading project ${filename}:`, error);
    return null;
  }
}

function loadPostFromFile(filename: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Extract slug from filename (remove date prefix and .md extension)
    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    
    // Generate excerpt from content (first 200 characters)
    const excerpt = content.replace(/^#{1,6}\s+.*$/gm, '').trim().substring(0, 200) + '...';
    
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '1970-01-01',
      excerpt: excerpt,
      categories: data.categories || [],
      author: data.author || 'Unknown',
      url: `/posts/${slug}`,
      content
    };
  } catch (error) {
    console.error(`Error loading post ${filename}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
      .filter(name => name.endsWith('.md'))
      .map(loadPostFromFile)
      .filter((post): post is Post => post !== null);
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getAllProjects(): Project[] {
  try {
    const filenames = fs.readdirSync(projectsDirectory);
    const projects = filenames
      .filter(name => name.endsWith('.md'))
      .map(loadProjectFromFile)
      .filter((project): project is Project => project !== null);
    
    return projects.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error reading projects directory:', error);
    return [];
  }
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const allProjects = getAllProjects();
  return allProjects.find(project => project.slug === slug);
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const allCategories = new Set<string>();
  allPosts.forEach(post => {
    post.categories.forEach(category => {
      allCategories.add(category.toLowerCase());
    });
  });
  return Array.from(allCategories).sort();
}

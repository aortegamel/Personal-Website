import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';

// Define the Post type
export type Post = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  author: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags?: string[];
};

// Define the Project type
export type Project = {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  github?: string;
  demo?: string;
  privateFullVersion?: boolean;
  contact?: string;
  features: string[];
  detailedDescription?: string;
};

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const projectsDirectory = path.join(process.cwd(), 'src/content/projects');

// Get all post slugs
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

// Get all project slugs
export function getProjectSlugs() {
  return fs.readdirSync(projectsDirectory);
}

// Get post by slug
export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const date = data.date instanceof Date ? data.date : new Date(data.date);
  const formattedDate = format(date, 'MMMM d, yyyy');

  return {
    slug: realSlug,
    title: data.title,
    date: data.date.toString(),
    formattedDate,
    author: data.author || 'Angleito',
    excerpt: data.excerpt || content.slice(0, 160),
    content,
    categories: data.categories || [],
    tags: data.tags || [],
  };
}

// Get project by slug
export function getProjectBySlug(slug: string): Project {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(projectsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    name: data.name,
    description: data.description,
    techStack: data.tech_stack || [],
    github: data.github,
    demo: data.demo,
    privateFullVersion: data.private_full_version,
    contact: data.contact || 'arainey555@gmail.com',
    features: data.features || [],
    detailedDescription: content,
  };
}

// Get all posts
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (new Date(post1.date) > new Date(post2.date) ? -1 : 1));
  return posts;
}

// Get all projects
import { allProjects } from 'contentlayer/generated';

export function getAllProjects(): Project[] {
  return allProjects;
}

// Get posts by category
export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => 
    post.categories.includes(category)
  );
}

// Get all categories
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  
  posts.forEach((post) => {
    post.categories.forEach((category) => {
      categories.add(category);
    });
  });
  
  return Array.from(categories);
}

// Get all tags
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tags.add(tag);
      });
    }
  });
  
  return Array.from(tags);
}

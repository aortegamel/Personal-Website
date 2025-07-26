export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  author: string;
  url: string;
  content: string; // Full markdown content
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  github?: string;
  demo?: string;
  webpage?: string;
  features?: string[];
  url: string;
  content: string; // Full markdown content
}
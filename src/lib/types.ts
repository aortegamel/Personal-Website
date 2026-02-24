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

export interface Design {
  slug: string;
  name: string;
  description: string;
  role: string;
  projectUrl?: string;
  github?: string;
  designStack: string[];
  colorPalette: { name: string; hex: string }[];
  designElements: string[];
  highlights: string[];
  url: string;
  content: string;
}
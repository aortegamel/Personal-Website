export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
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

const POSTS: Post[] = [
  {
    slug: '',
    title: 'Trump\'s ',
    date: '2024-03-29',
    excerpt: 'An analysis of recent political developments in Las Vegas',
    categories: ['politics', 'economics'],
    author: 'Angleito',
    url: '/posts/'
  },
  {
    slug: '',
    title: 'Sui ',
    date: '2025-03-29',
    excerpt: 'Exploring blockchain technology and its potential applications',
    categories: ['crypto', 'technology'],
    author: 'Angleito',
    url: '/posts/'
  }
];

const PROJECTS: Project[] = [
  {
    slug: 'singleagenttrader',
    name: 'BlueFin AI Agent Trader',
    description: 'An AI-powered trading platform for cryptocurrency markets',
    techStack: ['Python', 'Machine Learning', 'Blockchain'],
    github: 'https://github.com/angleito/bluefinaiagenttrader',
    url: '/projects/singleagenttrader'
  },
  {
    slug: 'bot',
    name: ' Bot',
    description: 'Automated DeFi trading bot utilizing flash loan technology',
    techStack: ['Solidity', 'Web3.js', 'Blockchain'],
    github: 'https://github.com/angleito/bot',
    url: '/projects/bot'
  }
];

export function getAllPosts(): Post[] {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getPostsByCategory(category: string): Post[] {
  return POSTS.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find(post => post.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(project => project.slug === slug);
}

export function getAllCategories(): string[] {
  const allCategories = new Set<string>();
  POSTS.forEach(post => {
    post.categories.forEach(category => {
      allCategories.add(category.toLowerCase());
    });
  });
  return Array.from(allCategories).sort();
}

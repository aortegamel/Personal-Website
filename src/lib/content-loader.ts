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

// Hardcoded data for static generation
const POSTS: Post[] = [
  {
    slug: '2024-03-29-',
    title: 'Trump\'s ',
    date: '2024-03-29',
    excerpt: 'An analysis of recent political developments in Las Vegas',
    categories: ['politics', 'economics'],
    author: 'Angleito',
    url: '/posts/2024-03-29-'
  },
  {
    slug: '2025-03-29-',
    title: 'Sui ',
    date: '2025-03-29',
    excerpt: 'Exploring blockchain technology and its potential applications',
    categories: ['crypto', 'technology'],
    author: 'Angleito',
    url: '/posts/2025-03-29-'
  }
];

const PROJECTS: Project[] = [
  {
    slug: 'bluefinaiagenttrader',
    name: 'BlueFin AI Agent Trader',
    description: 'An AI-powered trading platform for cryptocurrency markets',
    techStack: ['Python', 'Machine Learning', 'Blockchain'],
    github: 'https://github.com/angleito/bluefinaiagenttrader',
    url: '/projects/bluefinaiagenttrader'
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

export function loadPosts(): Post[] {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function loadProjects(): Project[] {
  return PROJECTS;
}

export async function generateStaticParams() {
  return {
    posts: POSTS.map(post => ({ slug: post.slug })),
    projects: PROJECTS.map(project => ({ slug: project.slug }))
  };
}
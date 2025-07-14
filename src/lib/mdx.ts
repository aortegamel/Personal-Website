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
  demo?: string;
  url: string;
}

const POSTS: Post[] = [
  {
    slug: '',
    title: 'Trump\'s ',
    date: '2024-03-29',
    excerpt: 'An analysis of recent political developments in Las Vegas',
    categories: ['politics', 'economics'],
    author: 'Angel Ortega-Melton',
    url: '/posts/'
  },
  {
    slug: '',
    title: 'Sui ',
    date: '2025-03-29',
    excerpt: 'Exploring blockchain technology and its potential applications',
    categories: ['crypto', 'technology'],
    author: 'Angel Ortega-Melton',
    url: '/posts/'
  }
];

const PROJECTS: Project[] = [
  {
    slug: 'nyxusd',
    name: 'NyxUSD Protocol',
    description: 'A revolutionary DeFi stablecoin protocol built on cutting-edge blockchain technology. NyxUSD provides decentralized, collateralized stablecoins with advanced yield farming capabilities, automated market making, and cross-chain compatibility for seamless integration across multiple blockchain ecosystems.',
    techStack: ['Compact (Midnight Protocol)', 'TypeScript', 'Zero-Knowledge Proofs', 'Web3.js', 'React', 'Smart Contracts'],
    github: 'https://github.com/angleito/nyxusd-protocol',
    demo: 'https://nyxusd.com',
    url: '/projects/nyxusd'
  },
  {
    slug: 'singleagenttrader',
    name: 'Single Agent Trader',
    description: 'An advanced AI-powered trading platform that leverages machine learning algorithms to analyze cryptocurrency markets in real-time. Features include automated trade execution, risk management protocols, sentiment analysis, and predictive modeling for optimal trading strategies across multiple exchanges.',
    techStack: ['Python', 'Machine Learning', 'TensorFlow', 'Blockchain', 'API Integration'],
    github: 'https://github.com/Angleito/Single-Agent-Trader',
    url: '/projects/singleagenttrader'
  },
  {
    slug: 'bot',
    name: ' Bot',
    description: 'A sophisticated DeFi trading bot that capitalizes on arbitrage opportunities using flash loan technology. The bot monitors multiple decentralized exchanges simultaneously, executes complex multi-step transactions within a single block, and implements gas-optimized strategies for maximum profitability.',
    techStack: ['Move', 'Sui', 'TypeScript', 'Node.js', 'DeFi Protocols'],
    github: 'https://github.com/angleito/bot',
    url: '/projects/bot'
  },
  {
    slug: 'qwensuicoder',
    name: 'QwenSuiCoder',
    description: 'End-to-end LLM Benchmarking & Training Framework for Sui blockchain development. Features automated benchmarking of models from 0.5B to 14B parameters, hardware-aware model selection, smart parameter selection, and DeepSpeed-optimized training with ZeRO optimization.',
    techStack: ['Python', 'DeepSpeed', 'Qwen 2.5', 'MLOps', 'PyTorch'],
    github: 'https://github.com/Angleito/qwensuicoder',
    url: '/projects/qwensuicoder'
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

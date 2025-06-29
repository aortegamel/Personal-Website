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

// Type for content filters
type ContentFilter<T> = (item: T) => boolean;
type ContentSorter<T> = (a: T, b: T) => number;
type ContentMapper<T, R> = (item: T) => R;

// Higher-order function for content operations
const withContentOperation = <T, R>(
  data: T[],
  operation: (items: T[]) => R
): R => operation(data);

// Composable filter functions
const bySlug = <T extends { slug: string }>(slug: string): ContentFilter<T> =>
  (item) => item.slug === slug;

const byCategory = (category: string): ContentFilter<Post> =>
  (post) => post.categories.includes(category);

const byTechStack = (tech: string): ContentFilter<Project> =>
  (project) => project.techStack.includes(tech);

// Composable sort functions
const byDate = (order: 'asc' | 'desc' = 'desc'): ContentSorter<Post> =>
  (a, b) => {
    const comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    return order === 'desc' ? comparison : -comparison;
  };

const byName: ContentSorter<Project> = (a, b) =>
  a.name.localeCompare(b.name);

// Pure data transformation functions
const extractCategories = (posts: Post[]): string[] =>
  Array.from(new Set(posts.flatMap(post => post.categories)));

const extractTechStack = (projects: Project[]): string[] =>
  Array.from(new Set(projects.flatMap(project => project.techStack)));

// Compose filters
const composeFilters = <T>(...filters: ContentFilter<T>[]): ContentFilter<T> =>
  (item) => filters.every(filter => filter(item));

// Pipeline function for data transformation
const pipe = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) =>
  (arg) => fns.reduce((prev, fn) => fn(prev), arg);

// Mock data (to be replaced with actual data loading)
const mockPosts: Post[] = [
  {
    slug: '',
    title: 'SUI: The  of Blockchains',
    date: '2025-03-29',
    excerpt: 'Exploring the SUI blockchain and its unique features',
    categories: ['crypto', 'development'],
    author: 'Angel Romero',
    url: '/posts//'
  },
  {
    slug: '',
    title: 'Trump\'s ',
    date: '2024-03-29',
    excerpt: 'Analysis of political and economic implications',
    categories: ['economics', 'politics'],
    author: 'Angel Romero',
    url: '/posts//'
  }
];

const mockProjects: Project[] = [
  {
    slug: 'singleagenttrader',
    name: 'BlueFin AI Agent Trader',
    description: 'AI-powered trading agent for DeFi',
    techStack: ['TypeScript', 'AI', 'DeFi'],
    github: 'https://github.com/Angleito/bluefinaiagenttrader',
    url: '/projects/singleagenttrader/'
  },
  {
    slug: 'bot',
    name: 'Flash Loan Bot',
    description: 'Automated flash loan arbitrage bot',
    techStack: ['Solidity', 'TypeScript', 'DeFi'],
    github: 'https://github.com/Angleito/bot',
    url: '/projects/bot/'
  }
];

// Main content loading functions using composition
export const loadPosts = (): Post[] => mockPosts;

export const loadProjects = (): Project[] => mockProjects;

export const loadPostBySlug = (slug: string): Post | undefined =>
  withContentOperation(loadPosts(), posts => posts.find(bySlug(slug)));

export const loadProjectBySlug = (slug: string): Project | undefined =>
  withContentOperation(loadProjects(), projects => projects.find(bySlug(slug)));

export const loadCategories = (): string[] =>
  withContentOperation(loadPosts(), extractCategories);

export const loadPostsByCategory = (category: string): Post[] =>
  withContentOperation(
    loadPosts(),
    posts => posts.filter(byCategory(category)).sort(byDate())
  );

export const loadProjectsByTech = (tech: string): Project[] =>
  withContentOperation(
    loadProjects(),
    projects => projects.filter(byTechStack(tech)).sort(byName)
  );

// Advanced query functions using composition
export const queryPosts = (
  filters: ContentFilter<Post>[] = [],
  sorter: ContentSorter<Post> = byDate()
): Post[] =>
  withContentOperation(
    loadPosts(),
    posts => posts.filter(composeFilters(...filters)).sort(sorter)
  );

export const queryProjects = (
  filters: ContentFilter<Project>[] = [],
  sorter: ContentSorter<Project> = byName
): Project[] =>
  withContentOperation(
    loadProjects(),
    projects => projects.filter(composeFilters(...filters)).sort(sorter)
  );

// Pagination helper
export const paginate = <T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number; currentPage: number } => ({
  items: items.slice((page - 1) * pageSize, page * pageSize),
  totalPages: Math.ceil(items.length / pageSize),
  currentPage: page
});

// Search function
export const searchContent = <T extends { [key: string]: any }>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] => {
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
    })
  );
};
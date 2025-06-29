// Import the actual data from mdx.ts to avoid duplication
import { 
  getAllPosts, 
  getAllProjects, 
  getPostsByCategory, 
  getProjectBySlug, 
  getPostBySlug,
  getAllCategories
} from './mdx';

// Re-export types from mdx.ts
export type { Post, Project } from './mdx';

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

const byCategory = (category: string): ContentFilter<import('./mdx').Post> =>
  (post) => post.categories.includes(category);

const byTechStack = (tech: string): ContentFilter<import('./mdx').Project> =>
  (project) => project.techStack.includes(tech);

// Composable sort functions
const byDate = (order: 'asc' | 'desc' = 'desc'): ContentSorter<import('./mdx').Post> =>
  (a, b) => {
    const comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    return order === 'desc' ? comparison : -comparison;
  };

const byName: ContentSorter<import('./mdx').Project> = (a, b) =>
  a.name.localeCompare(b.name);

// Pure data transformation functions
const extractCategories = (posts: import('./mdx').Post[]): string[] =>
  Array.from(new Set(posts.flatMap(post => post.categories)));

const extractTechStack = (projects: import('./mdx').Project[]): string[] =>
  Array.from(new Set(projects.flatMap(project => project.techStack)));

// Compose filters
const composeFilters = <T>(...filters: ContentFilter<T>[]): ContentFilter<T> =>
  (item) => filters.every(filter => filter(item));

// Pipeline function for data transformation
const pipe = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) =>
  (arg) => fns.reduce((prev, fn) => fn(prev), arg);

// Main content loading functions - now using data from mdx.ts
export const loadPosts = getAllPosts;

export const loadProjects = getAllProjects;

export const loadPostBySlug = getPostBySlug;

export const loadProjectBySlug = getProjectBySlug;

export const loadCategories = getAllCategories;

export const loadPostsByCategory = getPostsByCategory;

export const loadProjectsByTech = (tech: string): import('./mdx').Project[] =>
  withContentOperation(
    loadProjects(),
    projects => projects.filter(byTechStack(tech)).sort(byName)
  );

// Advanced query functions using composition
export const queryPosts = (
  filters: ContentFilter<import('./mdx').Post>[] = [],
  sorter: ContentSorter<import('./mdx').Post> = byDate()
): import('./mdx').Post[] =>
  withContentOperation(
    loadPosts(),
    posts => posts.filter(composeFilters(...filters)).sort(sorter)
  );

export const queryProjects = (
  filters: ContentFilter<import('./mdx').Project>[] = [],
  sorter: ContentSorter<import('./mdx').Project> = byName
): import('./mdx').Project[] =>
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

// Export the composable utilities for external use
export {
  bySlug,
  byCategory,
  byTechStack,
  byDate,
  byName,
  composeFilters,
  pipe,
  withContentOperation
};
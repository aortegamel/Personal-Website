import matter from 'gray-matter'
import type { ContentMeta, Post, Project } from '../types/content'

// Build-time import of every markdown file under src/content.
// Vite inlines these as raw strings; no runtime fetch, no Walrus.
const postModules = import.meta.glob<string>('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const projectModules = import.meta.glob<string>('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

let postCache: Post[] | null = null
let projectCache: Project[] | null = null

export function postSlug(filename: string): string {
  const base = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
  return base === '-project-journal' ? `${base}-${filename.slice(0, 10)}` : base
}

function allPosts(): Post[] {
  if (!postCache) {
    postCache = Object.entries(postModules)
      .map(([path, raw]) => {
        const { data, content } = matter(raw)
        const categories: string[] = Array.isArray(data.categories) ? data.categories : []
        return {
          slug: postSlug(path.split('/').pop() ?? ''),
          title: (data.title as string) ?? 'Untitled',
          description:
            (data.excerpt as string) ??
            (data.description as string) ??
            content.replace(/^#{1,6}\s+.*$/gm, '').replace(/\s+/g, ' ').trim().slice(0, 200) +
            '...',
          date: data.date
            ? new Date(data.date as string).toISOString().split('T')[0]
            : '1970-01-01',
          category: categories[0] ?? 'general',
          tags: categories.length > 0 ? categories : ((data.tags as string[]) ?? []),
          content,
          featured: (data.featured as boolean) ?? false,
        }
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
  return postCache
}

function allProjects(): Project[] {
  if (!projectCache) {
    projectCache = Object.entries(projectModules)
      .map(([path, raw]) => {
        const { data, content } = matter(raw)
        return {
          slug: (path.split('/').pop() ?? '').replace(/\.md$/, ''),
          title: (data.name as string) ?? (data.title as string) ?? 'Untitled',
          description: (data.description as string) ?? '',
          date: data.date
            ? new Date(data.date as string).toISOString().split('T')[0]
            : '1970-01-01',
          tags: ((data.tech_stack as string[]) ?? (data.tags as string[]) ?? []),
          content,
          github: data.github as string | undefined,
          demo: (data.demo as string) ?? (data.webpage as string) ?? undefined,
          featured: (data.featured as boolean) ?? false,
        }
      })
      .sort((a, b) => a.title.localeCompare(b.title))
  }
  return projectCache
}

export async function getAllPosts(): Promise<ContentMeta[]> {
  return allPosts().map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.date,
    tags: item.tags,
    featured: item.featured,
    category: item.category,
  }))
}

export async function getAllProjects(): Promise<ContentMeta[]> {
  return allProjects().map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.date,
    tags: item.tags,
    featured: item.featured,
    category: undefined,
  }))
}

export async function getPost(slug: string): Promise<Post | null> {
  return allPosts().find((p) => p.slug === slug) ?? null
}

export async function getProject(slug: string): Promise<Project | null> {
  return allProjects().find((p) => p.slug === slug) ?? null
}

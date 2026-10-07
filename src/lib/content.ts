import matter from 'gray-matter'
import type { ContentMeta, Project } from '../types/content'

// Build-time import of every project markdown file under src/content.
// Vite inlines these as raw strings; no runtime fetch, no Walrus.
const projectModules = import.meta.glob<string>('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

let projectCache: Project[] | null = null

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

export async function getProject(slug: string): Promise<Project | null> {
  return allProjects().find((p) => p.slug === slug) ?? null
}

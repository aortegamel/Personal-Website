import type { ContentMeta, Post, Project } from '../types/content'
import { parseProject } from './content-source'
// Published posts only. The Vite plugin in vite.config.ts parses
// src/content/blog with publishedPosts at build time, so draft text
// never reaches the browser bundle.
import blogPosts from 'virtual:blog-posts'

export async function getAllPosts(): Promise<Post[]> {
  return blogPosts
}

export async function getPost(slug: string): Promise<Post | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null
}

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
      .map(([path, raw]) => parseProject(raw, (path.split('/').pop() ?? '').replace(/\.md$/, '')))
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
    github: item.github,
    demo: item.demo,
    demoLabel: item.demoLabel,
    award: item.award,
    category: undefined,
  }))
}

export async function getProject(slug: string): Promise<Project | null> {
  return allProjects().find((p) => p.slug === slug) ?? null
}

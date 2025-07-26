import { Post, Project, ContentMeta } from '../types/content'
import { parseMarkdown, fetchMarkdownFromWalrus } from './markdown'

// Content registry - maps slugs to Walrus blob IDs
const CONTENT_REGISTRY = {
  posts: {
    '': 'walrus-blob-id-1',
    '': 'walrus-blob-id-2',
  },
  projects: {
    'bot': 'walrus-blob-id-3',
    'nyxusd': 'walrus-blob-id-4',
    'qwensuicoder': 'walrus-blob-id-5',
    'singleagenttrader': 'walrus-blob-id-6',
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    // Check if slug exists in registry
    if (!CONTENT_REGISTRY.posts.hasOwnProperty(slug)) return null
    
    // Pass the slug directly to fetchMarkdownFromWalrus
    const markdown = await fetchMarkdownFromWalrus(slug)
    const parsed = await parseMarkdown(markdown)
    
    return {
      slug,
      title: parsed.frontMatter.title,
      description: parsed.frontMatter.description,
      date: parsed.frontMatter.date,
      category: parsed.frontMatter.category || 'general',
      tags: parsed.frontMatter.tags || [],
      content: parsed.content,
      featured: parsed.frontMatter.featured || false,
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    // Check if slug exists in registry
    if (!CONTENT_REGISTRY.projects.hasOwnProperty(slug)) return null
    
    // Pass the slug directly to fetchMarkdownFromWalrus
    const markdown = await fetchMarkdownFromWalrus(slug)
    const parsed = await parseMarkdown(markdown)
    
    return {
      slug,
      title: parsed.frontMatter.title,
      description: parsed.frontMatter.description,
      date: parsed.frontMatter.date,
      tags: parsed.frontMatter.tags || [],
      content: parsed.content,
      github: parsed.frontMatter.github,
      demo: parsed.frontMatter.demo,
      featured: parsed.frontMatter.featured || false,
    }
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<ContentMeta[]> {
  // For development, return demo content directly
  const demoPostSlugs = ['', '']
  const posts: ContentMeta[] = []
  
  for (const slug of demoPostSlugs) {
    try {
      const post = await getPost(slug)
      if (post) {
        posts.push({
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          category: post.category,
          tags: post.tags,
          featured: post.featured,
        })
      }
    } catch (error) {
      console.error(`Error loading post meta for ${slug}:`, error)
    }
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getAllProjects(): Promise<ContentMeta[]> {
  // For development, return demo content directly
  const demoProjectSlugs = ['bot', 'nyxusd', 'qwensuicoder', 'singleagenttrader']
  const projects: ContentMeta[] = []
  
  for (const slug of demoProjectSlugs) {
    try {
      const project = await getProject(slug)
      if (project) {
        projects.push({
          slug: project.slug,
          title: project.title,
          description: project.description,
          date: project.date,
          tags: project.tags,
          featured: project.featured,
        })
      }
    } catch (error) {
      console.error(`Error loading project meta for ${slug}:`, error)
    }
  }
  
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostsByCategory(category: string): Promise<ContentMeta[]> {
  return getAllPosts().then(posts => 
    posts.filter(post => post.category === category)
  )
}

export function getFeaturedContent(): Promise<{ posts: ContentMeta[], projects: ContentMeta[] }> {
  return Promise.all([
    getAllPosts().then(posts => posts.filter(post => post.featured)),
    getAllProjects().then(projects => projects.filter(project => project.featured))
  ]).then(([posts, projects]) => ({ posts, projects }))
}
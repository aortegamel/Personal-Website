import { Post, Project, ContentMeta } from '../types/content'

export interface ContentStore {
  getAllPosts(): Promise<Post[]>
  getAllProjects(): Promise<Project[]>
  getPost(slug: string): Promise<Post | null>
  getProject(slug: string): Promise<Project | null>
  getFeaturedContent(): Promise<{ posts: ContentMeta[], projects: ContentMeta[] }>
}

export class DemoContentStore implements ContentStore {
  private posts: Post[]
  private projects: Project[]

  constructor(posts: Post[], projects: Project[]) {
    this.posts = posts
    this.projects = projects
  }

  async getAllPosts(): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.posts
  }

  async getAllProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.projects
  }

  async getPost(slug: string): Promise<Post | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.posts.find(p => p.slug === slug) || null
  }

  async getProject(slug: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.projects.find(p => p.slug === slug) || null
  }

  async getFeaturedContent(): Promise<{ posts: ContentMeta[], projects: ContentMeta[] }> {
    const posts = this.posts.filter(p => p.featured).map(toContentMeta)
    const projects = this.projects.filter(p => p.featured).map(toContentMeta)
    
    return { posts, projects }
  }
}

function toContentMeta(item: Post | Project): ContentMeta {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: item.date,
    tags: item.tags,
    featured: item.featured,
    category: 'category' in item ? item.category : undefined
  }
}
// Unified content loading system that works for both development and production
import { ContentMeta, Post, Project } from '../types/content'
import { getAllPrebuiltPosts, getAllPrebuiltProjects, loadPrebuiltContent } from './prebuilt-content'

export async function getAllPosts(): Promise<ContentMeta[]> {
  try {
    console.log('Loading posts from prebuilt content...')
    const prebuiltPosts = await getAllPrebuiltPosts()
    
    // Convert prebuilt content to ContentMeta format
    return prebuiltPosts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      category: post.frontMatter.category,
      tags: post.frontMatter.tags || [],
      featured: post.frontMatter.featured
    }))
  } catch (error) {
    console.error('Failed to load prebuilt posts:', error)
    throw new Error('Unable to load posts. Please try again later.')
  }
}

export async function getAllProjects(): Promise<ContentMeta[]> {
  try {
    console.log('Loading projects from prebuilt content...')
    const prebuiltProjects = await getAllPrebuiltProjects()
    
    // Convert prebuilt content to ContentMeta format
    return prebuiltProjects.map(project => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.date,
      tags: project.frontMatter.tags || [],
      featured: project.frontMatter.featured
    }))
  } catch (error) {
    console.error('Failed to load prebuilt projects:', error)
    throw new Error('Unable to load projects. Please try again later.')
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    console.log(`Loading post ${slug} from prebuilt content...`)
    const prebuilt = await loadPrebuiltContent('posts', slug)
    
    if (prebuilt) {
      return {
        slug,
        title: prebuilt.frontMatter.title,
        description: prebuilt.frontMatter.description,
        date: prebuilt.frontMatter.date,
        category: prebuilt.frontMatter.category,
        tags: prebuilt.frontMatter.tags || [],
        content: prebuilt.content, // Already HTML
        featured: prebuilt.frontMatter.featured
      }
    }
    
    // Post not found
    console.warn(`Post ${slug} not found in prebuilt content`)
    return null
  } catch (error) {
    console.error(`Failed to load prebuilt post ${slug}:`, error)
    throw new Error(`Unable to load post "${slug}". Please try again later.`)
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    console.log(`Loading project ${slug} from prebuilt content...`)
    const prebuilt = await loadPrebuiltContent('projects', slug)
    
    if (prebuilt) {
      return {
        slug,
        title: prebuilt.frontMatter.title,
        description: prebuilt.frontMatter.description,
        date: prebuilt.frontMatter.date,
        tags: prebuilt.frontMatter.tags || [],
        content: prebuilt.content, // Already HTML
        github: prebuilt.frontMatter.github,
        demo: prebuilt.frontMatter.demo,
        featured: prebuilt.frontMatter.featured
      }
    }
    
    // Project not found
    console.warn(`Project ${slug} not found in prebuilt content`)
    return null
  } catch (error) {
    console.error(`Failed to load prebuilt project ${slug}:`, error)
    throw new Error(`Unable to load project "${slug}". Please try again later.`)
  }
}

export async function getFeaturedContent(): Promise<{ posts: ContentMeta[], projects: ContentMeta[] }> {
  const [posts, projects] = await Promise.all([
    getAllPosts(),
    getAllProjects()
  ])
  
  return {
    posts: posts.filter(post => post.featured),
    projects: projects.filter(project => project.featured)
  }
}
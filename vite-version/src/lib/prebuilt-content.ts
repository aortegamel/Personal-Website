// Prebuilt content system for static HTML loading
import { FrontMatter } from './markdown'
import { getContentUrl } from './deployment-config'

export interface PrebuiltContent {
  slug: string
  title: string
  description: string
  date: string
  htmlPath: string
  frontMatter: FrontMatter
}

export interface ContentManifest {
  posts: Record<string, PrebuiltContent>
  projects: Record<string, PrebuiltContent>
}

let manifestCache: ContentManifest | null = null

export async function loadManifest(): Promise<ContentManifest> {
  if (manifestCache) return manifestCache
  
  try {
    // Use deployment-aware URL construction
    const manifestUrl = getContentUrl('content/manifest.json')
    
    console.log(`Loading manifest from: ${manifestUrl}`)
    const response = await fetch(manifestUrl)
    
    if (!response.ok) {
      console.error(`Failed to load manifest: ${response.status} ${response.statusText}`)
      console.error('Response URL:', response.url)
      
      // Try fallback paths if primary fails
      const fallbackPaths = [
        '/content/manifest.json',
        './content/manifest.json'
      ]
      
      for (const fallbackPath of fallbackPaths) {
        console.log(`Trying fallback path: ${fallbackPath}`)
        try {
          const fallbackResponse = await fetch(fallbackPath)
          if (fallbackResponse.ok) {
            console.log(`Loaded manifest from fallback: ${fallbackPath}`)
            const data = await fallbackResponse.json()
            manifestCache = data
            return manifestCache!
          }
        } catch (e) {
          // Continue to next fallback
        }
      }
      
      throw new Error('Failed to load content manifest')
    }
    
    const data = await response.json()
    console.log('Manifest loaded successfully:', {
      posts: Object.keys(data.posts || {}),
      projects: Object.keys(data.projects || {})
    })
    
    manifestCache = data
    return manifestCache!
  } catch (error) {
    console.error('Error loading manifest:', error)
    console.error('This usually means the manifest.json file is not accessible or has invalid JSON')
    // Return empty manifest as fallback
    return { posts: {}, projects: {} }
  }
}

export async function loadPrebuiltContent(type: 'posts' | 'projects', slug: string): Promise<{
  content: string
  frontMatter: FrontMatter
} | null> {
  const manifest = await loadManifest()
  const item = manifest[type][slug]
  
  if (!item) {
    console.error(`Content not found in manifest: ${type}/${slug}`)
    console.error('Available content:', {
      posts: Object.keys(manifest.posts || {}),
      projects: Object.keys(manifest.projects || {})
    })
    return null
  }
  
  try {
    // Use deployment-aware URL construction
    const contentPath = item.htmlPath.startsWith('/') ? item.htmlPath.slice(1) : item.htmlPath
    const contentUrl = getContentUrl(contentPath)
    
    console.log(`Loading content from: ${contentUrl}`)
    const response = await fetch(contentUrl)
    
    if (!response.ok) {
      console.error(`Failed to load content: ${response.status} ${response.statusText}`)
      console.error('Response URL:', response.url)
      
      // Try fallback with direct path
      console.log(`Trying direct path: ${item.htmlPath}`)
      const fallbackResponse = await fetch(item.htmlPath)
      
      if (!fallbackResponse.ok) {
        console.error(`Fallback also failed: ${fallbackResponse.status}`)
        throw new Error(`Failed to load content`)
      }
      
      const content = await fallbackResponse.text()
      console.log(`Loaded content from fallback, length: ${content.length}`)
      return {
        content,
        frontMatter: item.frontMatter
      }
    }
    
    const content = await response.text()
    console.log(`Successfully loaded content for ${slug}, length: ${content.length}`)
    return {
      content,
      frontMatter: item.frontMatter
    }
  } catch (error) {
    console.error(`Error loading prebuilt content for ${slug}:`, error)
    return null
  }
}

export async function getAllPrebuiltPosts(): Promise<PrebuiltContent[]> {
  const manifest = await loadManifest()
  return Object.values(manifest.posts).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getAllPrebuiltProjects(): Promise<PrebuiltContent[]> {
  const manifest = await loadManifest()
  return Object.values(manifest.projects).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
import { useState, useEffect } from 'react'
import { FrontMatter } from '../lib/markdown'
import { getPost, getProject } from '../lib/content-loader'

interface UseContentResult {
  content: string | null
  frontMatter: FrontMatter | null
  loading: boolean
  error: Error | null
}

export function useContent(type: 'posts' | 'projects', slug: string): UseContentResult {
  const [state, setState] = useState<UseContentResult>({
    content: null,
    frontMatter: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    async function loadContent() {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        // Use unified content loader
        const contentItem = type === 'posts' 
          ? await getPost(slug)
          : await getProject(slug)
        
        if (contentItem) {
          setState({
            content: contentItem.content,
            frontMatter: {
              title: contentItem.title,
              description: contentItem.description,
              date: contentItem.date,
              category: type === 'posts' ? contentItem.category : undefined,
              tags: contentItem.tags,
              featured: contentItem.featured,
              github: type === 'projects' ? contentItem.github : undefined,
              demo: type === 'projects' ? contentItem.demo : undefined
            },
            loading: false,
            error: null
          })
        } else {
          throw new Error(`Content not found: ${type}/${slug}`)
        }
      } catch (error) {
        setState({
          content: null,
          frontMatter: null,
          loading: false,
          error: error as Error
        })
      }
    }

    loadContent()
  }, [type, slug])

  return state
}
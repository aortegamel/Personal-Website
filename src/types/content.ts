export interface Post {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  content: string
  featured?: boolean
}

export interface Project {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  content: string
  github?: string
  demo?: string
  demoLabel?: string
  award?: string
  featured?: boolean
}

export interface ContentMeta {
  slug: string
  title: string
  description: string
  date: string
  category?: string
  tags: string[]
  featured?: boolean
  github?: string
  demo?: string
  demoLabel?: string
  award?: string
}
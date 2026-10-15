// Published blog post. Frontmatter schema: see parsePost in lib/content-source.ts.
export interface Post {
  slug: string
  title: string
  description: string
  /** Publication date, YYYY-MM-DD. */
  date: string
  /** Last update date, YYYY-MM-DD. */
  updated?: string
  tags: string[]
  content: string
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
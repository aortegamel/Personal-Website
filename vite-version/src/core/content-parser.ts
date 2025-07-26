import { FrontMatter } from '../lib/markdown'

export interface ParsedContent {
  html: string
  frontMatter: FrontMatter
  excerpt?: string
}

export interface ContentParser {
  parse(markdown: string): Promise<ParsedContent>
}

export class MarkdownContentParser implements ContentParser {
  private processor: any

  constructor(processor: any) {
    this.processor = processor
  }

  async parse(markdown: string): Promise<ParsedContent> {
    const { parseMarkdown } = await import('../lib/markdown')
    const result = await parseMarkdown(markdown)
    
    return {
      html: result.content,
      frontMatter: result.frontMatter,
      excerpt: result.excerpt
    }
  }
}
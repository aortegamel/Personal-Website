import type { ContentMeta, Project } from '../types/content'

// Minimal frontmatter parser for the known project schema.
// gray-matter needs Node Buffer and crashed in the browser,
// leaving every project list empty. The prerender script
// still uses gray-matter in Node where Buffer exists.
function parseMd(raw: string): { data: Record<string, unknown>; content: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return { data: {}, content: raw }
  const data: Record<string, unknown> = {}
  const lines = m[1].split('\n')
  let i = 0
  while (i < lines.length) {
    const kv = lines[i].match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) {
      i++
      continue
    }
    const key = kv[1]
    const rest = kv[2].trim()
    if (rest === '>-' || rest === '>' || rest === '|') {
      const buf: string[] = []
      i++
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        buf.push(lines[i].trim())
        i++
      }
      data[key] = rest === '|' ? buf.join('\n') : buf.join(' ')
      continue
    }
    if (rest === '') {
      const items: string[] = []
      i++
      while (i < lines.length) {
        const item = lines[i].match(/^\s*-\s+(.*)$/)
        if (!item) break
        const t = item[1].trim()
        const q = t.length >= 2 && t[0] === "'" && t[t.length - 1] === "'"
        items.push(q ? t.slice(1, -1) : t)
        i++
      }
      data[key] = items
      continue
    }
    const q = rest.length >= 2 && rest[0] === "'" && rest[rest.length - 1] === "'"
    const unq = q ? rest.slice(1, -1) : rest
    data[key] = unq === 'true' ? true : unq === 'false' ? false : unq
    i++
  }
  return { data, content: raw.slice(m[0].length) }
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
      .map(([path, raw]) => {
        const { data, content } = parseMd(raw)
        return {
          slug: (path.split('/').pop() ?? '').replace(/\.md$/, ''),
          title: (data.name as string) ?? (data.title as string) ?? 'Untitled',
          description: (data.description as string) ?? '',
          date: data.date
            ? new Date(data.date as string).toISOString().split('T')[0]
            : '',
          tags: ((data.tech_stack as string[]) ?? (data.tags as string[]) ?? []),
          content,
          github: data.github as string | undefined,
          demo: (data.demo as string) ?? (data.webpage as string) ?? undefined,
          demoLabel: data.demo_label as string | undefined,
          award: data.award as string | undefined,
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

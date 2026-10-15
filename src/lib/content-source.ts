import type { Post, Project } from '../types/content'
import { safeContentUrl } from './content-url'

// Shared, dependency-free markdown source parsing. The browser bundle,
// the Vite blog plugin, and the Bun prerender script all import this
// module, so it must not touch browser globals, Node APIs, or
// import.meta.glob. gray-matter needs Node Buffer and crashed in the
// browser, which is why this small parser exists.
//
// Supported frontmatter: a `---` fenced block at the top of the file.
// BOM and CRLF/CR line endings are normalized first. Inside the block:
//   key: value          plain scalar on one line. Unquoted true/false
//                       become booleans.
//   key: 'value'        single quotes are removed and '' becomes '.
//   key: "value"        double quotes are removed. Escapes are NOT processed.
//   key: | |- |+        indented literal block: lines join with newlines and
//                       keep indentation beyond the least indented line.
//   key: > >- >+        indented folded block: lines join with spaces, and
//                       each blank line becomes a newline.
//                       Both block forms keep inner blank lines. This subset
//                       normalizes scalar trailing newlines: it always drops
//                       them, whatever the chomping sign.
//   key:                followed by `- item` lines: a list of strings.
//   # comment           whole-line comments and blank lines are skipped.
// Keys match [A-Za-z0-9_]+. This is NOT a YAML parser: flow lists
// ([a, b]), maps, anchors, wrapped plain scalars, indentation indicators,
// numbers, and trailing `# comments` are unsupported. A value such as
// `[a, b]` stays a raw string. Every other line lands in `unparsed`, and
// parsePost and parseProject reject it, so nothing truncates silently.

/** A frontmatter line parseMd could not read. */
export interface UnparsedLine {
 /** 1-based line number in the source file. */
 line: number
 text: string
 /** The last key before this line, if any. */
 key?: string
}

export function parseMd(raw: string): {
 data: Record<string, unknown>
 content: string
 unparsed: UnparsedLine[]
} {
 const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
 const m = text.match(/^---\n(?:([\s\S]*?)\n)?---(?:\n|$)/)
 if (!m) return { data: {}, content: text, unparsed: [] }
 const data: Record<string, unknown> = {}
 const unparsed: UnparsedLine[] = []
 const lines = (m[1] ?? '').split('\n')
 let key: string | undefined
 let i = 0
 while (i < lines.length) {
  const kv = lines[i].match(/^([A-Za-z0-9_]+):\s*(.*)$/)
  if (!kv) {
   // File line 1 is the opening `---`.
   if (!/^\s*(#.*)?$/.test(lines[i])) unparsed.push({ line: i + 2, text: lines[i], ...(key ? { key } : {}) })
   i++
   continue
  }
  key = kv[1]
  const rest = kv[2].trim()
  const block = rest.match(/^([|>])[+-]?$/)
  if (block) {
   const body: string[] = []
   i++
   while (i < lines.length && /^(\s*$|\s+\S)/.test(lines[i])) body.push(lines[i++])
   while (body.length && !body[body.length - 1].trim()) body.pop()
   if (block[1] === '|') {
    const indent = Math.min(...body.filter((l) => l.trim()).map((l) => l.search(/\S/)))
    data[key] = body.map((l) => l.slice(indent)).join('\n')
   } else {
    let folded = ''
    let sep = ''
    for (const l of body) {
     const t = l.trim()
     folded += t ? sep + t : '\n'
     sep = t ? ' ' : ''
    }
    data[key] = folded
   }
   continue
  }
  if (rest === '') {
   const items: string[] = []
   i++
   while (i < lines.length) {
    const item = lines[i].match(/^\s*-\s+(.*)$/)
    if (!item) break
    items.push(unquote(item[1].trim()))
    i++
   }
   data[key] = items
   continue
  }
  const value = unquote(rest)
  data[key] = value !== rest ? value : rest === 'true' ? true : rest === 'false' ? false : rest
  i++
 }
 return { data, content: text.slice(m[0].length), unparsed }
}

function unquote(s: string): string {
 if (s.length < 2) return s
 if (s[0] === "'" && s[s.length - 1] === "'") return s.slice(1, -1).replace(/''/g, "'")
 if (s[0] === '"' && s[s.length - 1] === '"') return s.slice(1, -1)
 return s
}

// Error text for the first unread frontmatter line.
function unsupportedLine({ line, text, key }: UnparsedLine): string {
 return `unsupported frontmatter line ${line}${key ? ` after "${key}"` : ''}: ${JSON.stringify(text)}`
}

/** True for a real calendar date written as YYYY-MM-DD. */
export function isIsoDay(s: string): boolean {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
 const date = new Date(`${s}T00:00:00Z`)
 return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === s
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Blog post frontmatter (src/content/blog/<slug>.md, filename stem = slug):
//   title: required non-empty string
//   description: required non-empty string
//   date: required YYYY-MM-DD publication date
//   updated: optional YYYY-MM-DD update date, not before date
//   tags: optional block list of non-empty strings
//   draft: optional true/false. true hides the post everywhere and skips
//          all other checks, so an incomplete draft never breaks a build.
// Other keys are ignored, but every frontmatter line must parse. The
// content holds the full Markdown body. Returns null for drafts. Throws an
// Error naming the slug when a published post is malformed, so it never
// publishes silently.
export function parsePost(raw: string, slug: string): Post | null {
 const { data, content, unparsed } = parseMd(raw)
 if (data.draft === true) return null
 const fail = (msg: string) => new Error(`Blog post "${slug}": ${msg}`)
 if (data.draft !== undefined && data.draft !== false) throw fail('draft must be true or false')
 if (!SLUG.test(slug)) throw fail('filename must be a lowercase slug of a-z, 0-9, and single hyphens')
 if (unparsed.length) throw fail(unsupportedLine(unparsed[0]))

 const text = (key: string): string => {
  const v = data[key]
  if (typeof v !== 'string' || !v.trim()) throw fail(`${key} is required and must be a non-empty string`)
  return v.trim()
 }
 const day = (key: string): string => {
  const v = data[key]
  if (typeof v !== 'string' || !isIsoDay(v)) {
   throw fail(`${key} must be a valid YYYY-MM-DD date (got ${JSON.stringify(v ?? null)})`)
  }
  return v
 }

 const title = text('title')
 const description = text('description')
 const date = day('date')
 let updated: string | undefined
 if (data.updated !== undefined) {
  updated = day('updated')
  // Both are checked ISO days, so string order is date order.
  if (updated < date) throw fail(`updated (${updated}) must not be before date (${date})`)
 }
 let tags: string[] = []
 if (data.tags !== undefined) {
  const t = data.tags
  if (!Array.isArray(t) || t.some((x) => typeof x !== 'string' || !x.trim())) {
   throw fail('tags must be a block list of non-empty strings')
  }
  tags = t.map((x: string) => x.trim())
 }

 return { slug, title, description, date, ...(updated ? { updated } : {}), tags, content }
}

/**
 * Parses every source, drops drafts, and sorts newest first with the slug
 * as a stable tie-breaker. Throws on the first malformed published post.
 */
export function publishedPosts(sources: { slug: string; raw: string }[]): Post[] {
 return sources
  .map(({ slug, raw }) => parsePost(raw, slug))
  .filter((p): p is Post => p !== null)
  .sort((a, b) =>
   a.date !== b.date ? (a.date < b.date ? 1 : -1) : a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0,
  )
}

// Project frontmatter (src/content/projects/<slug>.md). Every key is
// optional: name (or title), description, date (YYYY-MM-DD), tech_stack
// (or tags), github, demo (or webpage), demo_label, award, featured.
// github, demo, and webpage must pass safeContentUrl: http(s) or relative.
// Every frontmatter line must parse. Throws an Error naming the slug and
// field for malformed metadata, so no unsafe link reaches a page.
export function parseProject(raw: string, slug: string): Project {
 const { data, content, unparsed } = parseMd(raw)
 const fail = (msg: string) => new Error(`Project "${slug}": ${msg}`)
 if (unparsed.length) throw fail(unsupportedLine(unparsed[0]))
 const url = (key: string): string | undefined => {
  const v = data[key]
  if (v === undefined) return undefined
  const safe = typeof v === 'string' ? safeContentUrl(v) : null
  if (!safe) throw fail(`${key} must be an http(s) or relative URL (got ${JSON.stringify(v)})`)
  return safe
 }
 const date = data.date ?? ''
 if (typeof date !== 'string' || (date !== '' && !isIsoDay(date))) {
  throw fail(`date must be a valid YYYY-MM-DD date (got ${JSON.stringify(date)})`)
 }
 const github = url('github')
 const demo = url('demo')
 const webpage = url('webpage')
 return {
  slug,
  title: (data.name as string) ?? (data.title as string) ?? 'Untitled',
  description: (data.description as string) ?? '',
  date,
  tags: (data.tech_stack as string[]) ?? (data.tags as string[]) ?? [],
  content,
  github,
  demo: demo ?? webpage,
  demoLabel: data.demo_label as string | undefined,
  award: data.award as string | undefined,
  featured: (data.featured as boolean) ?? false,
 }
}

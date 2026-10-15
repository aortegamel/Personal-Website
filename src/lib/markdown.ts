import { safeContentUrl } from './content-url'

// Minimal markdown → HTML for project and blog bodies. Shared by the client
// pages and the prerender script so crawlers and visitors see identical
// semantic HTML. Callers pass the body after frontmatter removal.
//
// Supported: ATX headings, paragraphs (wrapped lines join), fenced code,
// blockquotes, flat `-`/`*`/`+` and `1.`/`1)` lists with indented
// continuation paragraphs, thematic breaks, and inline code, links, images,
// **strong**, *em*. Unsupported: nested lists, tables, setext headings,
// indented code, link titles. Raw HTML is escaped, not rendered.
// Destinations go through safeContentUrl: links allow web, relative, and
// mailto URLs, images web and relative only. A rejected link renders as its
// label text, a rejected image as its alt text.
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SPACE = /\s/
const WORD = /[\p{L}\p{N}_]/u

// End index of the code span opened by the backtick at `i`, or -1.
function codeEnd(s: string, i: number): number {
  const end = s.indexOf('`', i + 1)
  return end > i + 1 ? end : -1
}

interface Link {
  image: boolean
  label: string
  url: string
  end: number
}

// Parses `[label](url)` or `![alt](url)` at `i`. Code spans and nested
// brackets stay inside the label. The destination may hold balanced
// parentheses but no whitespace.
function parseLink(s: string, i: number): Link | null {
  const image = s[i] === '!'
  const open = image ? i + 1 : i
  let depth = 0
  let j = open
  for (; j < s.length; j++) {
    if (s[j] === '`') {
      j = Math.max(j, codeEnd(s, j))
    } else if (s[j] === '[') {
      depth++
    } else if (s[j] === ']' && --depth === 0) {
      break
    }
  }
  if (s[j + 1] !== '(' || (!image && j === open + 1)) return null
  depth = 0
  let k = j + 2
  for (; k < s.length; k++) {
    if (SPACE.test(s[k])) return null
    if (s[k] === '(') depth++
    else if (s[k] === ')' && depth-- === 0) break
  }
  if (k >= s.length || k === j + 2) return null
  return { image, label: s.slice(open + 1, j), url: s.slice(j + 2, k), end: k + 1 }
}

function renderLink(link: Link): string {
  if (link.image) {
    const src = safeContentUrl(link.url)
    return src ? `<img alt="${esc(link.label)}" src="${esc(src)}" loading="lazy">` : esc(link.label)
  }
  const href = safeContentUrl(link.url, true)
  const label = inline(link.label, true)
  return href ? `<a href="${esc(href)}">${label}</a>` : label
}

// Index of the run of exactly `n` asterisks that closes emphasis opened at
// `i`, or -1. Code spans and links are skipped whole, so delimiters inside
// them never close. Openers need a non-word char before and a non-space
// after. Closers need a non-space before and a non-word char after.
function emphasisClose(s: string, i: number, n: number): number {
  if (WORD.test(s[i - 1] ?? '') || SPACE.test(s[i + n] ?? ' ')) return -1
  for (let j = i + n; j < s.length; j++) {
    if (s[j] === '`') {
      j = Math.max(j, codeEnd(s, j))
    } else if (s[j] === '[' || (s[j] === '!' && s[j + 1] === '[')) {
      const link = parseLink(s, j)
      if (link) j = link.end - 1
    } else if (s[j] === '*') {
      let run = 1
      while (s[j + run] === '*') run++
      if (run === n && !SPACE.test(s[j - 1]) && !WORD.test(s[j + n] ?? '')) return j
      j += run - 1
    }
  }
  return -1
}

// One left-to-right scan over the raw text. Each construct is rendered
// from source and appended once, so generated HTML is never parsed again.
function inline(s: string, inLink: boolean): string {
  let out = ''
  let text = 0 // start of literal text not yet appended
  let i = 0
  const emit = (html: string, next: number) => {
    out += esc(s.slice(text, i)) + html
    i = text = next
  }
  while (i < s.length) {
    const c = s[i]
    if (c === '`') {
      const end = codeEnd(s, i)
      if (end > 0) {
        emit(`<code>${esc(s.slice(i + 1, end))}</code>`, end + 1)
        continue
      }
    } else if (c === '[' || (c === '!' && s[i + 1] === '[')) {
      const link = parseLink(s, i)
      if (link && (link.image || !inLink)) {
        emit(renderLink(link), link.end)
        continue
      }
    } else if (c === '*') {
      let run = 1
      while (s[i + run] === '*') run++
      const close = run <= 2 ? emphasisClose(s, i, run) : -1
      if (close > 0) {
        const tag = run === 2 ? 'strong' : 'em'
        emit(`<${tag}>${inline(s.slice(i + run, close), inLink)}</${tag}>`, close + run)
      } else {
        i += run
      }
      continue
    }
    i++
  }
  return out + esc(s.slice(text))
}

export function mdInline(s: string): string {
  return inline(s, false)
}

const BLANK = /^\s*$/
const FENCE = /^\s*```/
const HEADING = /^(#{1,6})\s+(.*)/
const HR = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/
const QUOTE = /^\s*>/
const UL = /^\s*[-*+]\s+/
const OL = /^\s*(\d{1,9})[.)]\s+/

// Whether `line` ends the current paragraph or list item text instead of
// continuing it. As in CommonMark, only an ordered item numbered 1 can
// interrupt prose, so a wrapped line such as "2019. Then…" stays text.
function startsBlock(line: string): boolean {
  if (FENCE.test(line) || HEADING.test(line) || HR.test(line) || QUOTE.test(line) || UL.test(line)) {
    return true
  }
  return Number(OL.exec(line)?.[1]) === 1
}

export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (BLANK.test(line)) {
      i++
      continue
    }
    if (FENCE.test(line)) {
      const code: string[] = []
      i++
      while (i < lines.length && !FENCE.test(lines[i])) code.push(lines[i++])
      i++ // closing fence; an unclosed fence runs to the end of the body
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`)
      continue
    }
    const heading = HEADING.exec(line)
    if (heading) {
      const level = heading[1].length
      out.push(`<h${level}>${mdInline(heading[2].trim())}</h${level}>`)
      i++
      continue
    }
    if (HR.test(line)) {
      out.push('<hr>')
      i++
      continue
    }
    if (QUOTE.test(line)) {
      const quote: string[] = []
      while (i < lines.length && QUOTE.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ''))
      out.push(`<blockquote>${mdToHtml(quote.join('\n'))}</blockquote>`)
      continue
    }
    const ordered = OL.exec(line)
    if (ordered || UL.test(line)) {
      const marker = ordered ? OL : UL
      // Each item is a list of paragraphs. `indent` is the last item's
      // content column, which a continuation paragraph must reach.
      const items: string[][] = []
      let indent = 0
      while (i < lines.length) {
        const l = lines[i]
        if (BLANK.test(l)) {
          // Blank lines between items keep one list. An indented paragraph
          // continues the last item. Anything else ends the list.
          let next = i
          while (next < lines.length && BLANK.test(lines[next])) next++
          if (next >= lines.length) break
          const n = lines[next]
          if (marker.test(n) && !HR.test(n)) {
            i = next
            continue
          }
          if (n.replace(/\t/g, '    ').search(/\S/) < indent || startsBlock(n)) break
          items[items.length - 1].push(n.trim())
          i = next + 1
          continue
        }
        const item = marker.exec(l)
        if (item && !HR.test(l)) {
          items.push([l.slice(item[0].length).trim()])
          indent = item[0].replace(/\t/g, '    ').length
        } else if (startsBlock(l)) {
          break
        } else {
          const paras = items[items.length - 1]
          paras[paras.length - 1] += `\n${l.trim()}`
        }
        i++
      }
      const tag = ordered ? 'ol' : 'ul'
      const start = ordered && Number(ordered[1]) !== 1 ? ` start="${Number(ordered[1])}"` : ''
      const li = items.map((paras) =>
        paras.length === 1 ? mdInline(paras[0]) : paras.map((p) => `<p>${mdInline(p)}</p>`).join(''),
      )
      out.push(`<${tag}${start}>${li.map((item) => `<li>${item}</li>`).join('')}</${tag}>`)
      continue
    }
    const para = [line.trim()]
    i++
    while (i < lines.length && !BLANK.test(lines[i]) && !startsBlock(lines[i])) para.push(lines[i++].trim())
    out.push(`<p>${mdInline(para.join('\n'))}</p>`)
  }
  return out.join('\n')
}

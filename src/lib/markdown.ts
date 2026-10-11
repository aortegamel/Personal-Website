// Minimal markdown → HTML for project bodies. Shared by the client
// ProjectPage and the prerender script so crawlers and visitors
// see identical semantic HTML.
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function mdInline(s: string): string {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

export function mdToHtml(md: string): string {
  const out: string[] = []
  const lines = md.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
  let i = 0
  let inCode = false
  let codeBuf: string[] = []
  while (i < lines.length) {
    const line = lines[i]
    if (/^```/.test(line)) {
      if (inCode) {
        out.push(`<pre><code>${esc(codeBuf.join('\n'))}</code></pre>`)
        codeBuf = []
        inCode = false
      } else {
        inCode = true
      }
      i++
      continue
    }
    if (inCode) {
      codeBuf.push(line)
      i++
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.*)/)
    if (heading) {
      out.push(`<h${heading[1].length}>${mdInline(heading[2])}</h${heading[1].length}>`)
      i++
      continue
    }
    if (/^(\s*[-*]\s+)/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*[-*]\s+)/.test(lines[i])) {
        items.push(`<li>${mdInline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }
    if (/^\s*$/.test(line)) {
      i++
      continue
    }
    if (/^>/.test(line)) {
      out.push(`<blockquote><p>${mdInline(line.replace(/^>\s?/, ''))}</p></blockquote>`)
      i++
      continue
    }
    out.push(`<p>${mdInline(line)}</p>`)
    i++
  }
  return out.filter(Boolean).join('\n')
}

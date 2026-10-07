// Prerender: reads real project markdown from src/content, emits one
// SEO-complete static HTML file per route into dist/. Runs AFTER
// `vite build` and injects the hashed bundle so crawlers get content
// and visitors get the SPA.
import matter from 'gray-matter'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = process.env.SITE_URL ?? ''
if (!SITE_URL) throw new Error('SITE_URL is required: copy .env.example to .env and set your domain')
const DIST = path.join(process.cwd(), 'dist')
const PROJECTS_DIR = path.join(process.cwd(), 'src', 'content', 'projects')

interface Route {
  path: string
  file: string
  title: string
  description: string
  type: 'website' | 'article'
  date?: string
  body: string
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function builtAssets(): Promise<{ js: string; css: string }> {
  const files = await readdir(path.join(DIST, 'assets'))
  const js = files.find((f: string) => f.endsWith('.js'))
  const css = files.find((f: string) => f.endsWith('.css'))
  if (!js) throw new Error('no built JS bundle in dist/assets')
  return { js: `/assets/${js}`, css: css ? `/assets/${css}` : '' }
}

function mdInline(s: string): string {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function mdToHtml(md: string): string {
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

function shell(route: Route, assets: { js: string; css: string }): string {
  const url = `${SITE_URL}${route.path}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': route.type === 'article' ? 'BlogPosting' : 'WebPage',
    headline: route.title,
    description: route.description,
    url,
    ...(route.date ? { datePublished: route.date } : {}),
    author: { '@type': 'Person', name: 'Angel Ortega-Melton' },
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(route.title)}</title>
<meta name="description" content="${esc(route.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0a2342">
<meta property="og:site_name" content="Angel Ortega-Melton — Portfolio">
<meta property="og:title" content="${esc(route.title)}">
<meta property="og:description" content="${esc(route.description)}">
<meta property="og:type" content="${route.type}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(route.title)}">
<meta name="twitter:description" content="${esc(route.description)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${assets.css ? `<link rel="stylesheet" href="${assets.css}">` : ''}
</head>
<body>
<main>${route.body}</main>
<div id="root"></div>
<script type="module" src="${assets.js}"></script>
</body>
</html>`
}

function card(title: string, description: string, href: string): string {
  return `<article><h2><a href="${href}">${esc(title)}</a></h2><p>${esc(description)}</p></article>`
}

async function readMd(
  dir: string,
): Promise<{ file: string; data: Record<string, unknown>; content: string }[]> {
  const files = (await readdir(dir)).filter((f: string) => f.endsWith('.md')).sort()
  return Promise.all(
    files.map(async (file: string) => {
      const raw = await readFile(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      return { file, data: data as Record<string, unknown>, content }
    }),
  )
}

async function buildRoutes(): Promise<Route[]> {
  const projects = await readMd(PROJECTS_DIR)
  const routes: Route[] = [
    {
      path: '/',
      file: 'index.html',
      title: 'Angel Ortega-Melton — Portfolio',
      description: 'Portfolio of Angel Ortega-Melton: DeFi, AI, and blockchain projects.',
      type: 'website',
      body: `<h1>Angel Ortega-Melton</h1><p>Exploring technology and showcasing projects in DeFi, AI, and blockchain.</p><nav><a href="/projects">Projects</a> <a href="/about">About</a></nav>`,
    },
    {
      path: '/about',
      file: 'about/index.html',
      title: 'About — Angel Ortega-Melton',
      description:
        'Software engineer focused on blockchain, DeFi protocols, and full-stack web applications.',
      type: 'website',
      body: `<h1>About</h1><p>Software engineer passionate about blockchain technology, DeFi protocols, and building innovative web applications.</p>`,
    },
    {
      path: '/projects',
      file: 'projects/index.html',
      title: 'Projects — Angel Ortega-Melton',
      description: 'DeFi, AI, and blockchain projects by Angel Ortega-Melton.',
      type: 'website',
      body: `<h1>Projects</h1>${projects
        .map((p) => {
          const slug = p.file.replace(/\.md$/, '')
          return card(
            String(p.data.name ?? p.data.title ?? slug),
            String(p.data.description ?? ''),
            `/projects/${slug}`,
          )
        })
        .join('')}`,
    },
  ]
  for (const p of projects) {
    const slug = p.file.replace(/\.md$/, '')
    const title = String(p.data.name ?? p.data.title ?? slug)
    const description = String(p.data.description ?? '')
    routes.push({
      path: `/projects/${slug}`,
      file: `projects/${slug}/index.html`,
      title: `${title} — Angel Ortega-Melton`,
      description,
      type: 'article',
      body: `<nav><a href="/projects">← Projects</a></nav><article><h1>${esc(title)}</h1><p>${esc(description)}</p>${mdToHtml(p.content)}</article>`,
    })
  }
  return routes
}

async function main(): Promise<void> {
  const [routes, assets] = await Promise.all([buildRoutes(), builtAssets()])
  for (const route of routes) {
    const out = path.join(DIST, route.file)
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, shell(route, assets))
    console.log(`  prerendered ${route.path} → ${route.file}`)
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (r) =>
        `  <url><loc>${SITE_URL}${r.path}</loc>${r.date ? `<lastmod>${r.date}</lastmod>` : ''}</url>`,
    )
    .join('\n')}\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
  await writeFile(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  )
  console.log(`prerendered ${routes.length} routes + sitemap.xml + robots.txt`)
}

await main()

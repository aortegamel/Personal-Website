// Prerender: reads real markdown from src/content, emits one SEO-complete
// static HTML file per route into dist/. Runs AFTER `vite build` and injects
// the hashed bundle so crawlers get content and visitors get the SPA.
import matter from 'gray-matter'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = process.env.SITE_URL ?? 'https://angleito.github.io'
const DIST = path.join(process.cwd(), 'dist')
const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
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

function mdToText(md: string): string {
  return md
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/[*_`>|[\]()!-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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

function excerptOf(data: Record<string, unknown>, content: string): string {
  if (typeof data.excerpt === 'string') return data.excerpt
  if (typeof data.description === 'string') return data.description
  return mdToText(content).slice(0, 160)
}

function isoDate(value: unknown): string | undefined {
  if (!value) return undefined
  const d = new Date(value as string)
  return Number.isNaN(+d) ? undefined : d.toISOString().split('T')[0]
}

function card(title: string, description: string, href: string, meta: string): string {
  return `<article><h2><a href="${href}">${esc(title)}</a></h2><p>${esc(description)}</p><p>${esc(meta)}</p></article>`
}

function postSlug(filename: string): string {
  const base = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
  return base === '-project-journal' ? `${base}-${filename.slice(0, 10)}` : base
}

async function readMd(dir: string): Promise<{ file: string; data: Record<string, unknown>; content: string }[]> {
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
  const [posts, projects] = await Promise.all([readMd(POSTS_DIR), readMd(PROJECTS_DIR)])
  const routes: Route[] = [
    {
      path: '/',
      file: 'index.html',
      title: 'Angel Ortega-Melton — Portfolio',
      description:
        'Portfolio of Angel Ortega-Melton: DeFi, AI, and blockchain projects plus technical articles.',
      type: 'website',
      body: `<h1>Angel Ortega-Melton</h1><p>Exploring technology, sharing insights, and showcasing projects in DeFi, AI, and blockchain.</p><nav><a href="/projects">Projects</a> <a href="/posts">Articles</a> <a href="/about">About</a></nav>`,
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
      path: '/posts',
      file: 'posts/index.html',
      title: 'Articles — Angel Ortega-Melton',
      description: 'Technical articles on crypto, economics, AI, and development.',
      type: 'website',
      body: `<h1>Articles</h1>${posts
        .map((p) => {
          const slug = postSlug(p.file)
          return card(
            String(p.data.title ?? slug),
            excerptOf(p.data, p.content),
            `/posts/${slug}`,
            isoDate(p.data.date) ?? '',
          )
        })
        .join('')}`,
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
            '',
          )
        })
        .join('')}`,
    },
  ]
  for (const p of posts) {
    const slug = postSlug(p.file)
    const title = String(p.data.title ?? slug)
    const description = excerptOf(p.data, p.content)
    routes.push({
      path: `/posts/${slug}`,
      file: `posts/${slug}/index.html`,
      title: `${title} — Angel Ortega-Melton`,
      description,
      type: 'article',
      date: isoDate(p.data.date),
      body: `<nav><a href="/posts">← Articles</a></nav><article><h1>${esc(title)}</h1><p>${esc(description)}</p><div>${esc(mdToText(p.content).slice(0, 2000))}</div></article>`,
    })
  }
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
      body: `<nav><a href="/projects">← Projects</a></nav><article><h1>${esc(title)}</h1><p>${esc(description)}</p><div>${esc(mdToText(p.content).slice(0, 2000))}</div></article>`,
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

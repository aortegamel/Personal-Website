// Prerender: reads real project markdown from src/content, emits one
// SEO-complete static HTML file per route into dist/. Runs AFTER
// `vite build` and injects the hashed bundle so crawlers get content
// and visitors get the SPA. Reuses the client's markdown renderer so
// crawler HTML and visitor HTML stay identical.
import matter from 'gray-matter'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { site } from '../src/site'
import { mdToHtml } from '../src/lib/markdown'

const SITE_URL = site.url
const DIST = path.join(process.cwd(), 'dist')
const PROJECTS_DIR = path.join(process.cwd(), 'src', 'content', 'projects')

interface Route {
  path: string
  file: string
  title: string
  description: string
  type: 'website' | 'article'
  date?: string
  keywords?: string[]
  body: string
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function builtAssets(): Promise<{ js: string; css: string; fonts: string }> {
  // Read the entry from Vite's own index.html (emitted before prerender
  // overwrites it). Picking the largest .js would grab a lazy chunk
  // instead of the app entry and break hydration.
  const html = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const js = html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1]
  const styles = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1])
  const css = styles.find(href => href.includes('/assets/')) ?? ''
  const fonts = styles.find(href => !href.includes('/assets/')) ?? ''
  if (!js) throw new Error('no entry script in dist/index.html')
  if (!css) throw new Error('no app css in dist/index.html')
  return { js, css, fonts }
}
function shell(route: Route, assets: { js: string; css: string; fonts: string }): string {
  const url = `${SITE_URL}${route.path}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': route.type === 'article' ? 'CreativeWork' : 'WebPage',
    headline: route.title,
    description: route.description,
    url,
    ...(route.date ? { datePublished: route.date } : {}),
    ...(route.keywords?.length ? { keywords: route.keywords.join(', ') } : {}),
    author: { '@type': 'Person', name: site.name },
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
<meta name="author" content="${esc(site.name)}">
${route.keywords?.length ? `<meta name="keywords" content="${esc(route.keywords.join(', '))}">` : ''}
<meta name="theme-color" content="#0a2342">
<meta property="og:site_name" content="${esc(`${site.name} | Portfolio`)}">
<meta property="og:title" content="${esc(route.title)}">
<meta property="og:description" content="${esc(route.description)}">
<meta property="og:type" content="${route.type}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/og-cover.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(route.title)}">
<meta name="twitter:description" content="${esc(route.description)}">
<meta name="twitter:image" content="${SITE_URL}/og-cover.svg">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${assets.css ? `<link rel="stylesheet" href="${assets.css}">` : ''}
${assets.fonts ? `<link rel="stylesheet" href="${assets.fonts}">` : ''}
</head>
<body>
<div id="root"><main>${route.body}</main></div>
<script type="module" src="${assets.js}"></script>
</body>
</html>`
}

function card(title: string, description: string, href: string): string {
  return `<article><h2><a href="${href}">${esc(title)}</a></h2><p>${esc(description)}</p></article>`
}

function tagsOf(data: Record<string, unknown>): string[] {
  return ((data.tech_stack as string[]) ?? (data.tags as string[]) ?? []).map(String)
}

function dateOf(data: Record<string, unknown>): string | undefined {
  if (!data.date) return undefined
  const d = new Date(String(data.date))
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0]
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
      title: `${site.name} | Portfolio`,
      description: site.description,
      type: 'website',
      keywords: ['AI-integrated applications', 'agent tooling', 'data pipelines', 'portfolio', site.name],
      body: `<h1>${esc(site.name)}</h1><p>Exploring ${esc(site.tagline)}: technology, insights, and projects that push the boundaries of innovation.</p><h2>Featured Projects</h2>${projects
        .map((p) => {
          const slug = p.file.replace(/\.md$/, '')
          return card(
            String(p.data.name ?? p.data.title ?? slug),
            String(p.data.description ?? ''),
            `/projects/${slug}`,
          )
        })
        .join('')}<nav><a href="/projects">Projects</a> <a href="/about">About</a></nav>`,
    },
    {
      path: '/about',
      file: 'about/index.html',
      title: `About | ${site.name}`,
      description:
        'Software engineer building AI-integrated applications, agent tooling, and data pipelines.',
      type: 'website',
      keywords: ['AI-integrated applications', 'agent tooling', 'data pipelines', 'Python', 'TypeScript', 'React'],
      body: `<h1>About</h1><p>Software engineer building AI-integrated applications, agent tooling, and data pipelines.</p><h2>Who I Am</h2><p>Software engineer building AI-integrated applications, agent tooling, and data pipelines. Winner of Best Technical Implementation at the Walrus Haulout Hackathon 2025 for Project S.O.N.A.R. Strengths include shipping full-stack features fast and grounding AI output in verifiable data.</p>`,
    },
    {
      path: '/projects',
      file: 'projects/index.html',
      title: `Projects | ${site.name}`,
      description: `All ${site.tagline} by ${site.name}.`,
      type: 'website',
      keywords: [...new Set(projects.flatMap((p) => tagsOf(p.data)))],
      body: `<h1>Projects</h1><p>A collection of work in AI-integrated applications, agent tooling, and data pipelines.</p>${projects
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
      title: `${title} | ${site.name}`,
      description,
      type: 'article',
      date: dateOf(p.data),
      keywords: tagsOf(p.data),
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
        `  <url><loc>${SITE_URL}${r.path}</loc>${r.date ? `<lastmod>${r.date}</lastmod>` : ''}<changefreq>weekly</changefreq></url>`,
    )
    .join('\n')}\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
  // GPTBot/Claude/CCBot need explicit allow entries; some crawlers
  // ignore bare `Allow: /` for AI agents.
  await writeFile(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: CCBot\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n`,
  )
  // llms.txt: plain-markdown index for LLM crawlers (GEO).
  const llms = `# ${site.name} | Portfolio\n\n> ${site.description}\n\n## Pages\n\n${routes
    .map((r) => `- [${r.title}](${SITE_URL}${r.path}): ${r.description}`)
    .join('\n')}\n\n## Contact\n\n- Email: ${site.email}\n- GitHub: ${site.social.github}\n- LinkedIn: ${site.social.linkedin}\n`
  await writeFile(path.join(DIST, 'llms.txt'), llms)
  console.log(`prerendered ${routes.length} routes + sitemap.xml + robots.txt + llms.txt`)
}

await main()

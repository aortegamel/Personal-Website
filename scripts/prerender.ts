// Static generator. Runs after `vite build`, reads project and blog
// markdown with the client's shared parser (src/lib/content-source.ts),
// and writes for every public route:
//   <route>/index.html  meaningful pre-JS HTML with the full SEO head
//   <route>/index.md    clean Markdown counterpart for LLM readers
// plus 404.html (noindex), sitemap.xml, robots.txt, and llms.txt.
// This is static generation, not hydration: createRoot in main.tsx
// replaces the #root markup once the bundle runs. Head tags, JSON-LD,
// and URLs come from the same helpers the client Seo component uses.
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { markdownUrl, pageUrl, routePath, site } from '../src/site'
import { mdToHtml } from '../src/lib/markdown'
import { parseProject, publishedPosts } from '../src/lib/content-source'
import { formatDate } from '../src/lib/utils'
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  OG_IMAGE,
  blogJsonLd,
  pageJsonLd,
  postJsonLd,
} from '../src/components/Seo'
import type { Post, Project } from '../src/types/content'

const DIST = path.join(process.cwd(), 'dist')
const CONTENT = path.join(process.cwd(), 'src', 'content')

interface Route {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  keywords?: string[]
  jsonLd?: Record<string, unknown>
  html: string
  md: string
  // Real publication/update date only; never a guessed file mtime.
  lastmod?: string
}

interface Assets {
  js: string
  css: string
  fonts: string
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function builtAssets(): Promise<Assets> {
  // Read the entry from Vite's own index.html (emitted before this script
  // overwrites it). Picking the largest .js would grab a lazy chunk.
  const html = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const js = html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1]
  const styles = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  const css = styles.find((href) => href.includes('/assets/')) ?? ''
  const fonts = styles.find((href) => !href.includes('/assets/')) ?? ''
  if (!js) throw new Error('no entry script in dist/index.html')
  if (!css) throw new Error('no app css in dist/index.html')
  return { js, css, fonts }
}

// noindex pages (404) get no canonical, og:url, or Markdown counterpart,
// matching what Seo does on the client.
function shell(route: Route, assets: Assets, noindex = false): string {
  const url = pageUrl(route.path)
  const ld = route.jsonLd
    ? `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')}</script>`
    : ''
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(route.title)}</title>
<meta name="description" content="${esc(route.description)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
${noindex ? '' : `<link rel="canonical" href="${url}">\n<link rel="alternate" type="text/markdown" href="${markdownUrl(route.path)}">`}
<link rel="describedby" href="${site.url}/llms.txt">
<meta name="author" content="${esc(site.name)}">
${route.keywords?.length ? `<meta name="keywords" content="${esc(route.keywords.join(', '))}">` : ''}
<meta name="theme-color" content="#0a2342">
<meta property="og:site_name" content="${esc(`${site.name} | Portfolio`)}">
<meta property="og:title" content="${esc(route.title)}">
<meta property="og:description" content="${esc(route.description)}">
<meta property="og:type" content="${route.type}">
${noindex ? '' : `<meta property="og:url" content="${url}">`}
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(`${site.name}: ${site.tagline}`)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(route.title)}">
<meta name="twitter:description" content="${esc(route.description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
${ld}
<link rel="stylesheet" href="${assets.css}">
${assets.fonts ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${assets.fonts}">` : ''}
</head>
<body>
<div id="root"><header><nav aria-label="Main"><a href="/">${esc(site.name)}</a> <a href="/">Home</a> <a href="/about/">About</a> <a href="/projects/">Projects</a> <a href="/blog/">Blog</a></nav></header>
<main>${route.html}</main>
<footer><p>© ${new Date().getFullYear()} ${esc(site.name)}</p><a href="${site.social.github}">GitHub</a> <a href="${site.social.linkedin}">LinkedIn</a></footer></div>
<script type="module" src="${assets.js}"></script>
</body>
</html>
`
}

// Reads <slug>.md files. A missing directory means no content.
async function readSources(dir: string): Promise<{ slug: string; raw: string }[]> {
  let files: string[]
  try {
    files = await readdir(dir)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw e
  }
  return Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .sort()
      .map(async (f) => ({ slug: f.slice(0, -3), raw: await readFile(path.join(dir, f), 'utf8') })),
  )
}

const mdLink = (label: string, href: string): string => `[${label.replace(/[[\]]/g, '\\$&')}](${href})`
const list = (items: string[]): string => items.map((i) => `- ${i}`).join('\n')
const timeTag = (d: string): string => `<time datetime="${d}">${esc(formatDate(d))}</time>`

function projectLinks(p: Project): { label: string; href: string }[] {
  return [
    ...(p.github ? [{ label: 'View on GitHub', href: p.github }] : []),
    ...(p.demo ? [{ label: p.demoLabel || 'Live Demo', href: p.demo }] : []),
  ]
}

function projectCard(p: Project, heading: 'h2' | 'h3'): string {
  const href = routePath(`/projects/${p.slug}`)
  const links = projectLinks(p)
    .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
    .join(' ')
  return `<article><${heading}><a href="${href}">${esc(p.title)}</a></${heading}><p>${esc(p.description)}</p>${p.tags.length ? `<ul>${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''
    }${p.featured ? '<p>Featured Project</p>' : ''}${p.award ? `<p>${esc(p.award)}</p>` : ''}<p>${links} <a href="${href}">View Details</a></p></article>`
}

// Copies the current About, Experience, and Contact prose from AboutPage.
// These are static sections, not the interactive React tabs.
const ABOUT_DESCRIPTION =
  'Software engineer building AI-integrated applications, agent tooling, and data pipelines.'
const ABOUT_MD = `# About ${site.name}

${ABOUT_DESCRIPTION}

## Who I Am

I originally went to UNR to study mechanical engineering after discovering how much I enjoyed my AP physics class in high school. I loved every second of my engineering classes: problem solving, the math (which I used to hate), and the process of understanding how complex systems worked and how to apply them to real life.

Then the pandemic hit. I felt lost and alone, and spiraled out of college.

For a while, software engineering remained something I wanted to pursue but kept putting off. I had always been interested in programming, but I knew people who had been coding since they were kids, and I convinced myself I was already too far behind.

In 2024, I finally decided that didn't matter. I started from the beginning: HTML, then Python, TypeScript, APIs, databases, and the fundamentals of building software. At first, progress felt slow. I knew I could understand technical concepts, but I hadn't found a way of learning that matched how I naturally think.

Then I heard about AI. I started using AI as a learning tool. That changed everything.

For me, it felt like being able to talk to a future version of myself, someone who could explain a concept from five different angles, answer every follow-up question, and immediately help me apply what I had learned.

Not long after, I discovered AI-native development tools like Cursor and began working with AI directly inside my development environment. That was the point where software really clicked for me. Suddenly, I could take an idea and turn it into something real.

Instead of learning concepts in isolation, I could learn by building. Just like in the engineering classes I fell in love with, I could take these abstract things and see them work in realtime. I could discover an API and immediately integrate it. When I encountered an unfamiliar architecture or engineering concept, I could understand it in the context of a system I was actively working on.

That feedback loop became addictive.

Since then, I've spent most of my time building, experimenting, breaking things, rebuilding them, and continually pushing toward more ambitious projects. My interests have increasingly moved toward AI engineering, agentic systems, structured data, developer tooling, and designing systems that make LLMs more reliable and useful.

What started as learning how to write code became an interest in a much bigger question: How can we use AI to make individuals capable of building things that previously required entire teams? That's the problem space I want to keep exploring.

### What I Do

#### AI-Integrated Applications

Full-stack apps with AI at the core, from privacy-focused marketplaces on Sui to investment research tools. Every AI claim carries provenance and quality checks.

#### Agent Tooling

Tool-using agents with structured outputs and prompt pipelines, built on the OpenAI API and LangChain. Policy gates and human review keep autonomous behavior trustworthy.

#### Data Pipelines

Point-in-time datasets from SEC EDGAR and FINRA sources, versioned as JSON artifacts and served through DuckDB over Parquet. Offline pytest suites with pyrefly and ruff gates.

#### Full-Stack Web

TypeScript and React front ends with Hono APIs, PostgreSQL, and Dockerized workers. PWAs and Astro or Vite sites that ship fast and stay maintainable.

### Technologies I Work With

${list(['Python', 'TypeScript', 'JavaScript', 'Rust', 'Sui Move', 'React', 'Vite', 'Tailwind CSS', 'Hono', 'Astro', 'OpenAI API', 'LangChain', 'DuckDB', 'Parquet', 'pytest', 'Docker', 'Bun', 'Sui', 'Walrus', 'Seal', 'Nautilus'])}

## Professional Journey

### Lead Software Engineer (Freelance)

Apr 2025 - Feb 2026. Dreamlit Apps LLC, Remote.

Built a full-stack dApp environment with TypeScript, React, Sui Move, Walrus storage, and AI integration. Shipped the S.O.N.A.R. audio marketplace end to end as sole creator.

### Warehouse 3rd Shift Supervisor

Mar 2020 - Dec 2023. Amazon, Reno, NV.

Coordinated overnight operations and built inventory-routing workflows that cut errors. Led shift crews through high-volume deadlines with clear handoffs and accountability.

### Key Achievements

${list([
  'Best Technical Implementation, Walrus Haulout Hackathon 2025, one of three winners from hundreds of entries across 27 countries',
  'Sole creator of S.O.N.A.R., a privacy-focused audio marketplace on Sui',
  'Shipped open-source Stockbot with verifiable, provenance-backed data',
  'Built inventory-routing workflows at Amazon that cut errors',
])}

## Get In Touch

I'm always interested in discussing AI-integrated applications, agent tooling, data pipelines, and open-source collaboration.

${list([mdLink(site.email, `mailto:${site.email}`), mdLink('GitHub', site.social.github), mdLink('LinkedIn', site.social.linkedin)])}

### Let's Collaborate

I'm particularly interested in projects involving:

${list(['AI-integrated applications', 'Agent tooling', 'Data pipelines', 'Open-source AI and developer tools'])}
`

function projectRoute(p: Project): Route {
  const path = `/projects/${p.slug}`
  const links = projectLinks(p)
  const meta = [
    ...(p.date ? [`Date: ${p.date}`] : []),
    ...(p.award ? [`Award: ${p.award}`] : []),
    ...(p.tags.length ? [`Technologies: ${p.tags.join(', ')}`] : []),
    ...links.map((l) => mdLink(l.label, l.href)),
  ]
  return {
    path,
    title: `${p.title} | ${site.name}`,
    description: p.description,
    type: 'website',
    keywords: p.tags,
    jsonLd: pageJsonLd('CreativeWork', p.title, p.description, path, {
      ...(p.date ? { datePublished: p.date } : {}),
      ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}),
    }),
    html: `<nav aria-label="Breadcrumb"><a href="/projects/">← Back to Projects</a></nav><header><h1>${esc(p.title)}</h1>${p.date ? `<p>${timeTag(p.date)}</p>` : ''
      }${p.featured ? '<p>Featured Project</p>' : ''}${p.award ? `<p>${esc(p.award)}</p>` : ''}${p.description ? `<p>${esc(p.description)}</p>` : ''
      }${p.tags.length ? `<p>Technologies:</p><ul>${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}${links.length ? `<p>${links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(' ')}</p>` : ''
      }</header><article>${mdToHtml(p.content)}</article><footer>${p.github ? `<a href="${esc(p.github)}">View Source →</a> ` : ''
      }<a href="/projects/">View all projects →</a></footer>`,
    md: `# ${p.title}\n\n> ${p.description}\n\n${meta.length ? `${list(meta)}\n\n` : ''}${p.content.trim()}\n`,
  }
}

function postRoute(p: Post): Route {
  const path = `/blog/${p.slug}`
  const meta = [
    `Published: ${p.date}`,
    ...(p.updated ? [`Updated: ${p.updated}`] : []),
    ...(p.tags.length ? [`Tags: ${p.tags.join(', ')}`] : []),
    `Author: ${site.name}`,
  ]
  return {
    path,
    title: `${p.title} | ${site.name}`,
    description: p.description,
    type: 'article',
    keywords: p.tags,
    jsonLd: postJsonLd(p),
    lastmod: p.updated ?? p.date,
    html: `<nav aria-label="Breadcrumb"><a href="/blog/">← Back to Blog</a></nav><article><header><h1>${esc(p.title)}</h1><p>${esc(
      p.description,
    )}</p><p>Published ${timeTag(p.date)}${p.updated ? ` · Updated ${timeTag(p.updated)}` : ''}</p>${p.tags.length ? `<ul>${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''
      }</header>${mdToHtml(p.content)}</article><footer><a href="/blog/">View all posts →</a></footer>`,
    md: `# ${p.title}\n\n> ${p.description}\n\n${list(meta)}\n\n${p.content.trim()}\n`,
  }
}

// `ordered` is already in HomePage/ProjectsPage display order.
function buildRoutes(ordered: Project[], posts: Post[]): Route[] {
  const projectItems = ordered.map((p) => `${mdLink(p.title, routePath(`/projects/${p.slug}`))}: ${p.description}`)
  const projectsTitle = `Projects | ${site.name}`
  const projectsDescription = `All ${site.tagline} by ${site.name}.`
  const homeIntro = `Exploring ${site.tagline}: technology, insights, and projects that push the boundaries of innovation.`
  const homeBio =
    "I'm a software engineer building AI-integrated applications, agent tooling, and data pipelines. Winner of Best Technical Implementation at the Walrus Haulout Hackathon 2025, I ship full-stack fast and ground AI output in verifiable data."
  const projectsIntro = 'AI-integrated applications, agent tooling, and data pipelines'
  const featured = ordered.slice(0, 4)
  return [
    {
      path: '/',
      title: `${site.name} | Portfolio`,
      description: site.description,
      type: 'website',
      jsonLd: pageJsonLd('WebSite', `${site.name} | Portfolio`, site.description, '/', {
        name: `${site.name} | Portfolio`,
      }),
      html: `<section><h1>${esc(site.name)}</h1><p>${esc(homeIntro)}</p><p>${esc(homeBio)}</p><p><a href="/projects/">Explore All Projects</a> <a href="/about/">Learn More About Me</a></p></section><section><h2>Featured Projects</h2><p>Innovative solutions in AI-integrated applications, agent tooling, and data pipelines.</p>${featured
        .map((p) => projectCard(p, 'h3'))
        .join('')}${ordered.length > 4 ? '<p><a href="/projects/">View All Projects</a></p>' : ''}</section>`,
      md: `# ${site.name}\n\n${homeIntro}\n\n${homeBio}\n\n## Featured Projects\n\n${list(projectItems.slice(0, 4))}\n\n## Pages\n\n${list([
        mdLink('About', '/about/'),
        mdLink('Projects', '/projects/'),
        mdLink('Blog', '/blog/'),
      ])}\n`,
    },
    {
      path: '/about',
      title: `About | ${site.name}`,
      description: ABOUT_DESCRIPTION,
      type: 'website',
      jsonLd: pageJsonLd('AboutPage', `About | ${site.name}`, ABOUT_DESCRIPTION, '/about'),
      html: mdToHtml(ABOUT_MD),
      md: ABOUT_MD,
    },
    {
      path: '/projects',
      title: projectsTitle,
      description: projectsDescription,
      type: 'website',
      jsonLd: pageJsonLd('CollectionPage', projectsTitle, projectsDescription, '/projects'),
      html: `<h1>All Projects</h1><p>${esc(projectsIntro)}</p>${ordered.length ? ordered.map((p) => projectCard(p, 'h2')).join('') : '<p>No projects available.</p>'
        }`,
      md: `# All Projects\n\n${projectsIntro}\n\n${ordered.length ? list(projectItems) : 'No projects available.'}\n`,
    },
    ...ordered.map(projectRoute),
    {
      path: '/blog',
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      type: 'website',
      jsonLd: blogJsonLd(),
      html: `<h1>Blog</h1><p>${esc(BLOG_DESCRIPTION)}</p>${posts.length
        ? posts
          .map(
            (p) =>
              `<article><h2><a href="${routePath(`/blog/${p.slug}`)}">${esc(p.title)}</a></h2><p>${timeTag(p.date)}${p.updated ? ` · Updated ${timeTag(p.updated)}` : ''
              }</p><p>${esc(p.description)}</p>${p.tags.length ? `<ul aria-label="Tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''
              }</article>`,
          )
          .join('')
        : '<p>No posts published yet.</p>'
        }`,
      md: `# Blog\n\n${BLOG_DESCRIPTION}\n\n${posts.length
        ? list(posts.map((p) => `${mdLink(p.title, routePath(`/blog/${p.slug}`))} (${p.date}): ${p.description}`))
        : 'No posts published yet.'
        }\n`,
    },
    ...posts.map(postRoute),
  ]
}

function llmsTxt(routes: Route[], projects: Project[], posts: Post[]): string {
  const item = (title: string, routePathname: string, description: string) =>
    `${mdLink(title, markdownUrl(routePathname))}: ${description}`
  const pages = routes.filter((r) => ['/', '/about', '/projects', '/blog'].includes(r.path))
  const sections = [
    `# ${site.name}\n\n> ${site.description}\n\nEach link below points at the Markdown version of a page. Remove index.md from a link to get the HTML page.`,
    `## Pages\n\n${list(pages.map((r) => item(r.title, r.path, r.description)))}`,
    `## Projects\n\n${list(projects.map((p) => item(p.title, `/projects/${p.slug}`, p.description)))}`,
    ...(posts.length
      ? [`## Blog\n\n${list(posts.map((p) => item(p.title, `/blog/${p.slug}`, p.description)))}`]
      : []),
    `## Contact\n\n${list([
      mdLink('Email', `mailto:${site.email}`),
      mdLink('GitHub', site.social.github),
      mdLink('LinkedIn', site.social.linkedin),
    ])}`,
  ]
  return `${sections.join('\n\n')}\n`
}

async function emit(file: string, content: string): Promise<void> {
  const out = path.join(DIST, file)
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, content)
}

async function main(): Promise<void> {
  const [projectSources, postSources, assets] = await Promise.all([
    readSources(path.join(CONTENT, 'projects')),
    readSources(path.join(CONTENT, 'blog')),
    builtAssets(),
  ])
  // Title order, then Stockbot first, other featured next, the rest last,
  // as HomePage and ProjectsPage show them. Array.sort is stable.
  const priority = (p: Project) => (p.slug === 'stockbot' ? 0 : p.featured ? 1 : 2)
  const projects = projectSources
    .map(({ slug, raw }) => parseProject(raw, slug))
    .sort((a, b) => a.title.localeCompare(b.title))
    .sort((a, b) => priority(a) - priority(b))
  // Same parse, draft filter, validation, and sort as the client bundle.
  const posts = publishedPosts(postSources)
  const routes = buildRoutes(projects, posts)

  for (const route of routes) {
    const dir = routePath(route.path).slice(1)
    await emit(`${dir}index.html`, shell(route, assets))
    await emit(`${dir}index.md`, route.md)
  }
  // Cloudflare Pages serves 404.html with status 404 for unknown paths.
  // The SPA then renders NotFoundPage for the requested URL.
  await emit(
    '404.html',
    shell(
      {
        path: '/404',
        title: `Page Not Found | ${site.name}`,
        description: 'The requested page does not exist.',
        type: 'website',
        html: '<h1>Page Not Found</h1><p>The requested page does not exist.</p><p><a href="/">Go home</a> <a href="/projects/">Projects</a> <a href="/blog/">Blog</a></p>',
        md: '',
      },
      assets,
      true,
    ),
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((r) => `  <url><loc>${pageUrl(r.path)}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`
  await emit('sitemap.xml', sitemap)
  // Allows crawling only. It cannot force any crawler to index or train.
  // Cloudflare account settings can override this file; see
  // https://developers.cloudflare.com/bots/additional-configurations/custom-rules/
  await emit('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
  await emit('llms.txt', llmsTxt(routes, projects, posts))
  for (const r of routes) console.log(`  ${routePath(r.path)} → ${routePath(r.path).slice(1)}index.{html,md}`)
  console.log(`generated ${routes.length} routes + 404.html + sitemap.xml + robots.txt + llms.txt`)
}

await main()
